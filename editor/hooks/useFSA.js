import { FileSystemAccess } from 'editor/checks';
import { processImport } from './useImport';

// open local folder to import files
export async function openDirDialog() {
  if (!FileSystemAccess.support(window)) {
    return;
  }

  let dirHandle;
  try {
    dirHandle = await window.showDirectoryPicker();
  } catch (error) {
    // `showDirectoryPicker` will throw an error when the user cancels
  }

  const fileList = []; // File[]
  for await (const [_key, value] of dirHandle.entries()) {
    const fileData = await value.getFile();
    fileList.push(fileData);
  }

  await processImport(fileList);

  return dirHandle;
}
