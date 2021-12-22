'use strict';

import { toast } from 'react-toastify';
import { FileSystemAccess } from 'editor/checks';
import { store } from 'lib/store';
import { exportNotesJson, buildNotesJson } from 'components/note/NoteExport';
import { processImport, getFileName, checkFileIsMd } from './useImport';

/**
 * open local folder to import files
 *
 * @return {FileSystemDirectoryHandle} FileSystemDirectoryHandle
 */
export async function openDirDialog() {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  // export works and clean store notes
  const exportOnClose = store.getState().exportOnClose;
  if (exportOnClose) { await exportNotesJson(); }
  // cleaning noteTree first, thus will not trigger noteSort in sidebar
  store.getState().setNoteTree([]);
  store.getState().setNotes({});
  store.getState().setOpenNoteIds([]);
  store.getState().setHandles({});
  store.getState().setDirHandle(undefined);

  let dirHandle;
  try {
    // dialog to open folder
    // will prompt to require view permission
    dirHandle = await window.showDirectoryPicker();
    // store dirHandle, import files in dir and store FileHandes
    if (dirHandle) {
      store.getState().setDirHandle(dirHandle);
      const fileList = []; // File[]
      // Show a toast
      const openToast = toast.info('Open Folder and Importing files, please wait...', {
        autoClose: false,
        closeButton: false,
        draggable: false,
      });
      // key: filename or dir name 
      // value: FileSystemFileHandle or sub FileSystemDirectoryHandle
      for await (const [_key, value] of dirHandle.entries()) {
        //console.log(_key, value)
        // may TODO: recursively get the files in sub dirs
        if (value.kind !== 'file') {
          continue;
        }
        const fileData = await value.getFile();
        fileList.push(fileData);
        // upsert Handle
        if (checkFileIsMd(_key)) {
          // lose file extension info here: 
          // unique key for Handle and note
          const key = getFileName(_key);
          // store, title as key
          store.getState().upsertHandle(key, value);
        }
      }
      await processImport(fileList);
      // close the toast
      toast.dismiss(openToast);
    }
  } catch (error) {
    // `showDirectoryPicker` will throw an error when the user cancels
    console.log("An error occured when open folder and import files: ", error);
    toast.dismiss();
  }

  return dirHandle;
}

/**
 * Writes the content to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} content Contents to write.
 */
export async function writeFile(fileHandle, content) {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  try {
    // Create a FileSystemWritableFileStream to write to.
    // will prompt to require write permission
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();
  } catch (error) {
    console.log('An error occured on write file: ', error);
    //alert('An error occured, change can not be saved to file');
  }
}

/**
 * get or create new FileHandle and upsert to store.
 *
 * @param {string} name name or title
 * @param {string} id optional, the custom key for handle in store
 * @param {boolean} asReal optional, if keep name as the handle name
 * @return {FileSystemFileHandle | undefined} fileHandle File handle to write to.
 */
export async function getFileHandle(name, id='', asReal=false) {
  if (!FileSystemAccess.support(window)) {
    return undefined;
  }

  let fileHandle;
  const dirHandle = store.getState().dirHandle;
  if (dirHandle) {
    try {
      const [,handleName] = getRealHandleName(name, asReal);
      fileHandle = await dirHandle.getFileHandle(handleName, {create: true});
      if (fileHandle) {
        store.getState().upsertHandle(id || name, fileHandle);
      }
    } catch (error) {
      console.log('An error occured on get FileHandle: ', error);
      return undefined;
    }
  } else {
    console.log('no directory');
  }
  
  return fileHandle;
}

/**
 * del FileHandle
 *
 * @param {string} name name or title
 * @param {boolean} asReal optional, if keep name as the handle name
 */
 export async function delFileHandle(name, asReal=false) {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  const dirHandle = store.getState().dirHandle;
  if (dirHandle) {
    try {
      const [,handleName] = getRealHandleName(name, asReal);
      await dirHandle.removeEntry(handleName);
      store.getState().deleteHandle(name);
    } catch (error) {
      console.log('An error occured on delete FileHandle: ', error);
    }
  } else {
    console.log('no directory');
  }
}

/**
 * try to get the FileHandle name from store
 * @param {string} name name or title
 * @param {boolean} asReal optional, if keep name as the handle name
 * @return {[FileSystemFileHandle, string]} [handle, name]
 * 
 * for key(name|title) lose the file extension info when store, 
 * and FileHandle name includes file extension info
 */
function getRealHandleName(name, asReal=false) {
  if (!FileSystemAccess.support(window)) {
    return [null, ''];
  }
  
  const existingHandle = store.getState().handles[name];
  if (existingHandle) {
    return [existingHandle, existingHandle.name];
  } else {
    return [null, asReal ? name : `${name}.md`];
  }
}

/**
 * Writes all works to json on disk.
 *
 * @param {string} json, optional, Contents to write to json Handle.
 */
export async function writeJsonFile(json = '') {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  try {
    const jsonHandle = await getFileHandle('mdSilo_all.json', '', true);
    const notesJson = json || buildNotesJson();
    if (jsonHandle) {
      await writeFile(jsonHandle, notesJson);
    }
  } catch (error) {
    console.log('An error occured on write json file: ', error);
  }
}

/**
 * check if FileSystemDirectoryHandle
 * @return {[boolean, FileSystemDirectoryHandleName, boolean]} [isDir, dirName, isSupport]
 */
export function checkFSA() {
  if (!FileSystemAccess.support(window)) {
    return [false, null, false];
  }

  const dirHandle = store.getState().dirHandle;
  if (dirHandle) {
    return [true, dirHandle.name, true];
  } else {
    return [false, null, true];
  }
}
