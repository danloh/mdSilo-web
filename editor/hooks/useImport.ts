import { useCallback } from 'react';
import { Descendant, Element } from 'slate';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import wikiLinkPlugin from 'editor/serialization/wikilink/index';
import { store, useStore, Notes, NoteTreeItem, WikiTreeItem, NotesData } from 'lib/store';
import type { NoteUpsert } from 'lib/api/curdNote';
import apiClient from 'lib/apiClient';
import { getDefaultEditorValue } from 'editor/constants';
import remarkToSlate from 'editor/serialization/remarkToSlate';
import { ciStringEqual } from 'utils/helper';
import { ElementType, NoteLink } from 'editor/slate';
import { Note, defaultNote, User } from 'types/model';
import { getOrNewFileHandle, writeFile } from './useFSA';

export function useImportJson() {
  const upsertNote = useStore((state) => state.upsertNote);
  const updateNoteTree = useStore((state) => state.updateNoteTree);
  const updateWikiTree = useStore((state) => state.updateWikiTree);
  const offlineMode = useStore((state) => state.offlineMode);

  const onImportJson = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.multiple = false;

    input.onchange = async (e) => {
      if (!e.target) {
        return;
      }

      const inputElement = e.target as HTMLInputElement;
      const importFiles = inputElement.files;
      if (!importFiles || importFiles.length < 1) {
        return;
      }

      const file = importFiles[0];
      if (file.type !== 'application/json') {
        return;
      }
      const fname = file.name.replace(/\.[^/.]+$/, '');
      if (!fname) {
        return;
      }

      const importingToast = toast.info('Importing, Please wait...', {
        autoClose: false,
        closeButton: false,
        draggable: false,
      });

      // clean up store entries related FSA
      store.getState().setHandles({});
      store.getState().setDirHandle(undefined);

      const fileContent = await file.text();
      const jsonNotesData: NoteUpsert[] = []; // for upsert to db
      
      try {
        const notesData: NotesData = JSON.parse(fileContent);
        const notesObj: Notes = notesData.notesObj;
        const notesArr = Object.values(notesObj);
        notesArr.forEach(note => upsertNote(note, false)); // not upsert tree here
        jsonNotesData.push(...notesArr);
        // not upsert tree when upsertNote because it will flatten nested structure
        // update tree from saved tree structure 
        const noteTree: NoteTreeItem[] = notesData.noteTree;
        noteTree.forEach(item => updateNoteTree(item, null));
        const wikiTree: WikiTreeItem[] = notesData.wikiTree;
        wikiTree.forEach(item => updateWikiTree(item.id, null));
      } catch (e) {
        console.log(e);
        toast.error("Please check the file, it must be the json you exported.")
      }
      
      // Show a toast with the number of successfully imported notes
      toast.dismiss(importingToast);
      toast.info(
        `Imported and Processed: ${jsonNotesData?.filter((note) => !!note).length ?? 0}`
      );
      
      // Create new notes import from json
      // if online mode and issue: id conflict or user_id/title
      if (!offlineMode) {
        await apiClient
          .from<Note>('notes')
          .upsert(jsonNotesData, { onConflict: 'user_id, title' });
        await apiClient
          .from<User>('users')
          .update({ note_tree: store.getState().noteTree });
        await apiClient
          .from<User>('users')
          .update({ wiki_tree: store.getState().wikiTree });
      }
    };

    input.click();
  }, [offlineMode, upsertNote, updateNoteTree, updateWikiTree]);

  return onImportJson;
}

export function useImportMds() {
  const onImportMds = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.text, .txt, .md, .mkdn, .mdwn, .mdown, .markdown';
    input.multiple = true;

    input.onchange = async (e) => {
      if (!e.target) {
        return;
      }

      const inputElement = e.target as HTMLInputElement;
      const fileList = inputElement.files;

      if (!fileList) {
        return;
      }

      const importingToast = toast.info('Importing, Please wait...', {
        autoClose: false,
        closeButton: false,
        draggable: false,
      });

      const newNotesData = await processImport(fileList);

      // Show a toast with the number of successfully imported notes
      toast.dismiss(importingToast);
      const numOfImports = newNotesData?.filter((note) => !!note).length ?? 0;
      const noteUnit = numOfImports == 1 ? 'note' : 'notes';
      const toastText = `${numOfImports} ${noteUnit} were imported.`;
      numOfImports > 0 
        ? toast.success(toastText) 
        : toast.error(toastText);
    };

    input.click();
  }, []);

  return onImportMds;
}

/**
 * on Import Mds: 
 * 0- procee txt to Descendant[],
 * 1- process Linking in content, create needed note; 
 * 2- FSA: save txt to File System;
 * 3- Store: set Descendant[] to store system of App 
 * 4- Upsert to db in some cases
 */
export const processImport = async (fileList: FileList | File[], ifHandle = true) => {
  const upsertNote = store.getState().upsertNote;
  const offlineMode = store.getState().offlineMode;
 
  const noteTitleToIdCache: Record<string, string | undefined> = {};
  const newNotesData: Note[] = [];

  for (const file of fileList) {
    const fileName = file.name;
    const checkMd = checkFileIsMd(fileName);
    if (!fileName || !checkMd) {
      continue;
    }
    const fileContent = await file.text();

    // process Markdown/txt to Descendant[]
    const { result } = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(wikiLinkPlugin, { aliasDivider: '|' })
      .use(remarkToSlate)
      .processSync(fileContent);

    // process content and create new notes to which NoteLinks in content linked
    // newLinkedNote has and must has id and title only, w/ default content...
    const { content: slateContent, newLinkedNoteArr: newLinkedNotes } =
      processNoteLinks(result as Descendant[], noteTitleToIdCache);

    // new note from file
    // Issue Alert: same title but diff ext, only one file can be imported
    const newNoteTitle = rmFileNameExt(fileName);
    const newNoteObj = {
      id: noteTitleToIdCache[newNoteTitle.toLowerCase()] ?? uuidv4(),
      title: newNoteTitle,
      content: slateContent.length > 0 ? slateContent : getDefaultEditorValue(),
    };
    const newProcessedNote = {...defaultNote, ...newNoteObj};

    // save to title-id cache when new note from file: newProcessedNote
    noteTitleToIdCache[newNoteTitle.toLowerCase()] = newNoteObj.id;

    // Two type of note on process/import: 
    // 1- note imported from file (newProcessedNote) and 
    // 2- new created simple note on process NoteLink in content: newLinkedNote, {id, title};
    // sometimes, imported note has the same title to the noteTitle of NoteLink, 
    // here how to update the content of such note: 
    // 1- if newLinkedNote created on Process NoteLinks is pushed to newNotesData array before 
    // the newProcessedNote imported which has real content, can be updated when upsertNote.
    // 2- if the same note is already created from file, will not create note on processNoteLinks.
    // noteTitleToIdCache will record the created notes's title and id.
    //
    // upsert into store, order may matters:
    newLinkedNotes.forEach(simpleNote => upsertNote(simpleNote)); // upsert Simple Note first
    upsertNote(newProcessedNote); // upsert processed note with content later, good override
    // push to Array
    newNotesData.push(...newLinkedNotes);
    newNotesData.push(newProcessedNote);

    // FSA fileHandle: get or create if not-exist, then upsert in store
    if (ifHandle) {
      const fHandle = await getOrNewFileHandle(newNoteTitle);
      // save fileContent to File System
      if (fHandle) {
        await writeFile(fHandle, fileContent);
      }
    }
  }

  // upsert new notes to db 
  // Alert: could be a heavy task
  const upsertData: NoteUpsert[] = [];
  if (!offlineMode) {
    upsertData.push(...newNotesData);
    // fix with actual user id
    const userId = apiClient.auth.user()?.id; 
    if (userId) {
      upsertData.forEach(n => n.user_id = userId);
      await apiClient
        .from<Note>('notes')
        .upsert(upsertData, { onConflict: 'user_id, title' });
    }
  }

  return newNotesData;
};

/** 
 *  Add the proper note id to the note links. 
 */
const processNoteLinks = (
  content: Descendant[],
  noteTitleToIdCache: Record<string, string | undefined> = {}
): { content: Descendant[]; newLinkedNoteArr: Note[] } => {
  const newLinkedNoteArr: Note[] = [];

  // Update note link elements with noteId
  const newContent = content.map((node) =>
    setNoteLinkIds(node, noteTitleToIdCache, newLinkedNoteArr)
  );

  return { content: newContent, newLinkedNoteArr };
};

const setNoteLinkIds = (
  node: Descendant,
  noteTitleToIdCache: Record<string, string | undefined>,
  newLinkedNoteArr: Note[]
): Descendant => {
  if (
    Element.isElement(node) && 
    !(node.type === ElementType.Table || node.type === ElementType.TableRow)
  ) {
    return {
      ...node,
      ...(node.type === ElementType.NoteLink
        ? { noteId: getNoteId(node, noteTitleToIdCache, newLinkedNoteArr) }
        : {}),
      children: node.children.map((child) =>
        setNoteLinkIds(child, noteTitleToIdCache, newLinkedNoteArr)
      ),
    };
  } else {
    return node;
  }
};

const getNoteId = (
  node: NoteLink,
  noteTitleToIdCache: Record<string, string | undefined>,
  newLinkedNoteArr: Note[]
): string => {
  const noteTitle = node.noteTitle;
  const notesArr = Object.values(store.getState().notes);
  const notes = notesArr.filter(n => !n.is_wiki);

  const existingNoteId =
    noteTitleToIdCache[noteTitle.toLowerCase()] ??
    notes.find((note) => !note.is_wiki && ciStringEqual(note.title, noteTitle))?.id;
  
  let noteId;
  if (existingNoteId) {
    noteId = existingNoteId;
  } else {
    // Create new note from NoteLink, w/ id and title only
    noteId = uuidv4(); 
    const newLinkedNoteObj = {
      id: noteId, 
      title: noteTitle,
    };
    newLinkedNoteArr.push({ 
      ...defaultNote,
      ...newLinkedNoteObj,
    });
  }
  // save to title-id cache when new note from NoteLink: newLinkedNote
  noteTitleToIdCache[noteTitle.toLowerCase()] = noteId;

  return noteId;
};

/* #endregion: import process */

/**
 * remove file name extension
 *
 * @param {string} fname, file name.
 */
export const rmFileNameExt = (fname: string) => {
  return fname.replace(/\.[^/.]+$/, '');
}

export const checkFileIsMd = (fname: string) => {
  const check = /\.(text|txt|md|mkdn|mdwn|mdown|markdown){1}$/i.test(fname);
  return check;
}
