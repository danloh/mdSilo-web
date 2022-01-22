import { useEffect } from 'react';
import { FileSystemAccess } from 'editor/checks';
import { store } from 'lib/store';
import { refreshImport } from './useImport';

// FIXME:
// use case: when any modification by other app, re-click the note title,
// refresh the changes
// Issue: currently need to re-click 2 times to reload changes,
// before being reloaded, any operation on editor will lead to loss of the modification.
export async function refreshFile(title: string) {
  if (title.trim().length == 0) {
    return; 
  }

  if (!FileSystemAccess.support(window)) {
    return;
  }

  const dirHandle = store.getState().dirHandle;
  if (!dirHandle) {
    return;
  }

  try {
    // re-get fileHandle to refresh: dirHandle.entries or getFileHandle or store? 
    const fileHandle = store.getState().handles[title];
    // const [,handleName] = getRealHandleName(title, false);
    // const fileHandle = await dirHandle.getFileHandle(handleName);
    const fileData = await fileHandle.getFile();
    // re-processImport 
    const refreshedNote = await refreshImport(fileData, title);
    return refreshedNote;
  } catch (error) {
    console.log("An error occured when refresh file: ", error);
  }
}

export default function useRefresh(title: string) {
  useEffect(() => { refreshFile(title); }, [title]);
}
