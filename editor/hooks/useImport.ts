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
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      if (!fileName) {
        return;
      }

      const importingToast = toast.info('Importing notes, please wait...', {
        autoClose: false,
        closeButton: false,
        draggable: false,
      });

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
        `JSON was imported and processed: 
        ${jsonNotesData?.filter((note) => !!note).length ?? 0}`
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

      const importingToast = toast.info('Importing notes, please wait...', {
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

export const processImport = async (fileList: FileList | File[]) => {
  const upsertNote = store.getState().upsertNote;
  const offlineMode = store.getState().offlineMode;
 
  const noteTitleToIdCache: Record<string, string | undefined> = {};
  const newNotesData: Note[] = [];

  for (const file of fileList) {
    const fname = file.name;
    const checkMd = checkFileIsMd(fname);
    const fileName = getFileName(fname);
    if (!fileName || !checkMd) {
      continue;
    }
    const fileContent = await file.text();

    const { result } = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(wikiLinkPlugin, { aliasDivider: '|' })
      .use(remarkToSlate)
      .processSync(fileContent);

    // process content and creat new notes to which NoteLinks in content linked
    // newLinkedNote with id and title only, w/o content 
    const { content: slateContent, newData: newLinkedNotesData } =
      processNoteLinks(result as Descendant[], noteTitleToIdCache);

    // sometimes, file note is just the note NoteLink linked to
    // here can update the content to such note: 
    // if note created on ProcessNoteLinks is pushed 
    // before the note from file with more content in newNotesData array, 
    // can be updated when upsertNote.
    // if the same note is created from file already, will not create note on processNoteLinks.
    newNotesData.push(...newLinkedNotesData);

    // new note from file
    const newNoteObj = {
      id: noteTitleToIdCache[fileName.toLowerCase()] ?? uuidv4(),
      title: fileName,
      content: slateContent.length > 0 ? slateContent : getDefaultEditorValue(),
    };
    // save to title-id cache when new note from file
    noteTitleToIdCache[fileName.toLowerCase()] = newNoteObj.id;

    // // store FileHandle finally
    // const handle = store.getState().handles[fileName];
    // if (handle) {
    //   store.getState().upsertHandle(newNoteObj.id, handle);
    //   // store.getState().deleteHandle(fileName);
    // }

    newNotesData.push({
      ...defaultNote,
      ...newNoteObj
    });
  }

  // update to store
  newNotesData.forEach(note => upsertNote(note));

  // update new notes to db
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

// Add the proper note id to the note links.
const processNoteLinks = (
  content: Descendant[],
  noteTitleToIdCache: Record<string, string | undefined> = {}
): { content: Descendant[]; newData: Note[] } => {
  const newData: Note[] = [];

  // Update note link elements with noteId
  const newContent = content.map((node) =>
    setNoteLinkIds(node, noteTitleToIdCache, newData)
  );

  return { content: newContent, newData };
};

const setNoteLinkIds = (
  node: Descendant,
  noteTitleToIdCache: Record<string, string | undefined>,
  newData: Note[]
): Descendant => {
  if (
    Element.isElement(node) && 
    !(node.type === ElementType.Table || node.type === ElementType.TableRow)
  ) {
    return {
      ...node,
      ...(node.type === ElementType.NoteLink
        ? { noteId: getNoteId(node, noteTitleToIdCache, newData) }
        : {}),
      children: node.children.map((child) =>
        setNoteLinkIds(child, noteTitleToIdCache, newData)
      ),
    };
  } else {
    return node;
  }
};

const getNoteId = (
  node: NoteLink,
  noteTitleToIdCache: Record<string, string | undefined>,
  newData: Note[]
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
    const newObj = {
      id: noteId, 
      title: noteTitle,
    };
    newData.push({ 
      ...defaultNote,
      ...newObj,
    });
  }
  // save to title-id cache when new note from NoteLink
  noteTitleToIdCache[noteTitle.toLowerCase()] = noteId;

  return noteId;
};

/* #endregion: import process */

export const getFileName = (fname: string) => {
  return fname.replace(/\.[^/.]+$/, '');
}

export const checkFileIsMd = (fname: string) => {
  const check = /\.(text|txt|md|mkdn|mdwn|mdown|markdown){1}$/i.test(fname);
  return check;
}
