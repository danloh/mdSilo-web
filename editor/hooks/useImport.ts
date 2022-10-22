import { useCallback } from 'react';
import { Notes, NotesData, NoteTree, store, useStore } from 'lib/store';
import { defaultNote, Note } from 'types/model';
import { regDateStr } from 'utils/helper';
// import { getOrNewFileHandle, writeFile } from './useFSA';

export function processJson(content: string): NotesData {
  try {
    const notesData: NotesData = JSON.parse(content);
    return notesData;
  } catch (e) {
    // console.log('Please Check the JSON file: ', e);
    return {notesobj: {}, notetree: {}};
  }
}

/**
 * on Process Files: 
 */
 export async function processFiles(fileList: FileList | File[], dir: string) {
  const newNotesData: Note[] = [];
  const nonNotesData: Note[] = [];

  for (const file of fileList) {
    const fileName = file.name;
    
    const fileContent = await file.text();
    const filePath = fileName; //file.file_path;

    const checkMd = checkFileIsMd(fileName);
    // new note from file
    const newNoteTitle = checkMd ? rmFileNameExt(fileName) : fileName;
    const lastModDate = new Date(file.lastModified).toISOString();
    const isDaily = checkMd ? regDateStr.test(newNoteTitle) : false;
    const newNoteObj = {
      id: filePath,
      title: newNoteTitle,
      content: fileContent,
      created_at: lastModDate,
      updated_at: lastModDate,
      is_daily: isDaily,
      file_path: filePath,
    };
    const newProcessed = {...defaultNote, ...newNoteObj};

    // push to Array
    checkMd ? newNotesData.push(newProcessed) : nonNotesData.push(newProcessed);
  }

  const treeItemList = []; // Note[]
  const upsertNote = store.getState().upsertNote;
  const upsertTree = store.getState().upsertTree;
  for (const md of newNotesData) {
    // console.log("dir path2", dirPath, dir);
    treeItemList.push(md);
    upsertNote(md);
  }
  upsertTree(dir, treeItemList);

  return [newNotesData, nonNotesData];
}

export function useImportJson() {
  const setNotes = useStore((state) => state.setNotes);
  const setTree = useStore((state) => state.setNoteTree);

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

      // clean up store entries related FSA
      store.getState().setHandles({});
      store.getState().setDirHandle(undefined);

      const fileContent = await file.text();
      
      try {
        const notesData: NotesData = JSON.parse(fileContent);
        const notesObj: Notes = notesData.notesobj;
        setNotes(notesObj);
        const noteTree: NoteTree = notesData.notetree;
        setTree(noteTree);
        const dirs = Object.keys(noteTree);
        const dir = dirs.length > 0 ? dirs[0] : '.';
        store.getState().setInitDir(dir);
        store.getState().setCurrentDir(dir);
      } catch (e) {
        console.log(e);
      }
    };

    input.click();
  }, [setNotes, setTree]);

  return onImportJson;
}

export function useImportFiles() {
  const onImportFiles = useCallback(() => {
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

      store.getState().setInitDir('.');
      store.getState().setCurrentDir('.');
      await processFiles(fileList, '.');
    };

    input.click();
  }, []);

  return onImportFiles;
}

/**
 * Refresh Import File
 * @param file
 * @returns 
 */
 export const refreshImport = async (file: File, title: string) => {
  // if the file rename?
  // console.log("title", file, title)
  const fileName = file.name;
  const checkMd = checkFileIsMd(fileName);
  if (!fileName || !checkMd) {
    return;
  }

  const fileContent = await file.text();
  const lastModDate = new Date(file.lastModified).toISOString();
  const isDaily = checkMd ? regDateStr.test(title) : false;
  const newNoteObj = {
    id: fileName,
    title,
    content: fileContent,
    created_at: lastModDate,
    updated_at: lastModDate,
    is_daily: isDaily,
    file_path: fileName,
  };
  const reProcessedNote: Note = {...defaultNote, ...newNoteObj};

  // upsert into store
  store.getState().upsertNote(reProcessedNote); 
  
  return reProcessedNote;
};

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

export const buildNotesJson = () => {
  const notesobj = store.getState().notes;
  const notetree = store.getState().noteTree;
  const notesData: NotesData = {notesobj, notetree};
  const notesJson = JSON.stringify(notesData);
  return notesJson;
}
