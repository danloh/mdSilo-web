import { FileSystemAccess } from 'editor/checks';
import { store } from 'lib/store';
import { processImport, getFileName } from './useImport';

// open local folder to import files
export async function openDirDialog() {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  let dirHandle;
  try {
    // dialog to open folder
    // will prompt to require view permission
    dirHandle = await window.showDirectoryPicker();
  } catch (error) {
    // `showDirectoryPicker` will throw an error when the user cancels
  }

  const fileList = []; // File[]
  // key: filename, value: FileSystemFileHandle
  for await (const [_key, value] of dirHandle.entries()) {
    const fileData = await value.getFile();
    fileList.push(fileData);
    // upsert Handle
    //console.log(_key, value)
    const key = getFileName(_key);
    store.getState().upsertHandle(key, value);
  }

  //console.log("handles: ", store.getState().handles);

  await processImport(fileList);

  return dirHandle;
}

/**
 * Writes the content to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} content Contents to write.
 */
export async function writeFile(fileHandle, content) {
  // Create a FileSystemWritableFileStream to write to.
  // will prompt to require write permission
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(content);
  // Close the file and write the contents to disk.
  await writable.close();
}

