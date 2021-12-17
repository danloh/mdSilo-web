import { FileSystemAccess } from 'editor/checks';
import { store } from 'lib/store';
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

  let dirHandle;
  try {
    // dialog to open folder
    // will prompt to require view permission
    dirHandle = await window.showDirectoryPicker();
  } catch (error) {
    // `showDirectoryPicker` will throw an error when the user cancels
  }

  if (dirHandle) {
    store.getState().setDirHandle(dirHandle);
  }

  console.log("dirhandles: ", store.getState().dirHandle);

  const fileList = []; // File[]
  // key: filename, value: FileSystemFileHandle
  for await (const [_key, value] of dirHandle.entries()) {
    const fileData = await value.getFile();
    fileList.push(fileData);
    // upsert Handle
    //console.log(_key, value)
    if (checkFileIsMd(_key)) {
      const key = getFileName(_key);
      store.getState().upsertHandle(key, value);
    }
  }

  console.log("handles: ", store.getState().handles);

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
  try {
    // Create a FileSystemWritableFileStream to write to.
    // will prompt to require write permission
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();
  } catch (error) {
    console.error('An error occured: ', error);
    //alert('An error occured, change can not be saved to file');
  }
}

/**
 * get or create new FileHandle.
 *
 * @param {string} name name or title
 * @return {FileSystemFileHandle | undefined} fileHandle File handle to write to.
 */
export async function getFileHandle(name) {
  let fileHandle;
  if (FileSystemAccess.support(window)) {
    const dirHandle = store.getState().dirHandle;
    if (dirHandle) {
      try {
        const handleName = `${name}.md`;
        fileHandle = await dirHandle.getFileHandle(handleName, {create: true});
      } catch (error) {
        console.log('An error occured: ', error);
        return undefined;
      }
    } else {
      console.log('An error occured: no directory');
    }
  }
  return fileHandle;
}

