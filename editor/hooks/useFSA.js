/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

import { toast } from 'react-toastify';
import { FileSystemAccess } from 'editor/checks';
import { store } from 'lib/store';

/**
 * open local folder to import files
 *
 * @return {FileSystemDirectoryHandle} FileSystemDirectoryHandle
 */
export async function openDirDialog() {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  // cleaning noteTree first, thus will not trigger noteSort in sidebar
  store.getState().setNoteTree([]);
  store.getState().setNotes({});
  store.getState().setOpenNoteIds([]);
  store.getState().setHandles({});
  store.getState().setDirHandle(undefined);

  let dirHandle;
  try {
    // dialog to open folder
    // will prompt to require read permission
    dirHandle = await window.showDirectoryPicker();
    // store dirHandle, import files in dir and store FileHandes
    if (dirHandle) {
      store.getState().setDirHandle(dirHandle);
      // Show a toast
      const openToast = toast.info('Opening files, Please wait...', {
        autoClose: false,
        closeButton: true,
        draggable: false,
      });

      const fileList = []; // File[]
      // key: filename or dir name 
      // value: FileSystemFileHandle or sub FileSystemDirectoryHandle
      for await (const [key, value] of dirHandle.entries()) {
        //console.log(key, value)
        if (value.kind !== 'file') {
          continue;
        }
        // TODO: upsert Handle in store
       
      }
      
      // TODO process file

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
 * Writes the content to local File system.
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
    // Close the file and write the contents to local File syetem.
    await writable.close();
  } catch (error) {
    console.log('An error occured on write file: ', error);
    //alert('An error occured, change can not be saved to file');
  }
}

/**
 * get or create FileHandle, verify permission and upsert to store.
 * Importtant: unique title or filename as key to store Handle, 
 * Note: to consistent with Notes store, use unique title
 * Other: can use filename
 *
 * @param {string} name name(name.ext or title)
 * @param {boolean} withExt default False, optional, True if name with extension
 * @return {Promise<FileSystemFileHandle | undefined>} fileHandle File handle to write to.
 */
export async function getOrNewFileHandle(name, withExt=false) {
  if (!FileSystemAccess.support(window)) {
    return undefined;
  }

  let fileHandle;
  const dirHandle = store.getState().dirHandle;
  if (dirHandle) {
    try {
      const [,handleName] = getRealHandleName(name, withExt);
      // Error may occur here: NotAllowedError, PermissionStatus is not 'granted'.
      fileHandle = await dirHandle.getFileHandle(handleName, {create: true});
      if (fileHandle) {
        const hasPermission = verifyPermission(fileHandle, true);
        if (!hasPermission) {
          console.log(`No permission to '${fileHandle.name}'`);
          return undefined;
        }
        store.getState().upsertHandle(name, fileHandle);
      }
    } catch (error) {
      // FIXME: sometimes on import, no prompt to request permission but error occur 
      // msg: DOMException: User activation is required to request permissions.
      // especially on new open web browser. 
      // sometime, error occur first import but prompt on second. 
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
 * @param {string} name file.name or title
 * @param {boolean} withExt default False, optional, True if name with extension
 */
 export async function delFileHandle(name, withExt=false) {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  const dirHandle = store.getState().dirHandle;
  if (dirHandle) {
    try {
      const [,handleName] = getRealHandleName(name, withExt);
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
 * @param {string} name file.name or title
 * @param {boolean} withExt optional, True if name with extension
 * @return {[FileSystemFileHandle, string]} [handle, name], default ext: .md
 * 
 */
function getRealHandleName(name, withExt) {
  if (!FileSystemAccess.support(window)) {
    return [null, ''];
  }
  
  const existingHandle = store.getState().handles[name];
  if (existingHandle) {
    return [existingHandle, existingHandle.name];
  } else {
    return [null, withExt ? name : `${name}.md`];
  }
}

/**
 * Writes all works to json on local file system.
 *
 * @param {string} json, optional, Contents to write to json Handle.
 */
export async function writeJsonFile(json = '') {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  try {
    const jsonHandle = await getOrNewFileHandle('mdSilo_all.json', true);
    const notesJson = json;
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
export function checkFSA(dirH = null) {
  if (!FileSystemAccess.support(window)) {
    return [false, null, false];
  }

  const dirHandle = dirH || store.getState().dirHandle;
  if (dirHandle) {
    return [true, dirHandle.name, true];
  } else {
    return [false, null, true];
  }
}


/**
 * Verify read/write permission, otherwise request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} ifWrite True if to check write permission.
 * @return {boolean} if read/write permission granted.
 */
export async function verifyPermission(fileHandle, ifWrite) {
  const opts = {};
  if (ifWrite) {
    opts.writable = true;
    opts.mode = 'readwrite';
  }
  // Check if permission granted.
  if (await fileHandle.queryPermission(opts) === 'granted') {
    return true;
  }
  // Request permission, see if the user will grant permission.
  if (await fileHandle.requestPermission(opts) === 'granted') {
    return true;
  }
  // The user did not grant permission, return false.
  return false;
}


/**
 * remove file name extension
 *
 * @param {string} fname, file name.
 */
 export const rmFileNameExt = (fname) => {
  return fname.replace(/\.[^/.]+$/, '');
}

export const checkFileIsMd = (fname) => {
  const check = /\.(text|txt|md|mkdn|mdwn|mdown|markdown){1}$/i.test(fname);
  return check;
}
