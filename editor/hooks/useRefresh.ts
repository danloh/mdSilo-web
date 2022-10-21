import { FileSystemAccess } from 'editor/checks';
import { Notes, store } from 'lib/store';
import { Note } from 'types/model';
import { refreshImport, rmFileNameExt } from './useImport';

// use case: when any modification by other app, re-click the note title,
// to refresh the changes. would be heavy task
// 
// used before NoteLinkClick in SidebarNoteLink, NoteLinkElement.
// To reduce refresh, 
// currently not in BackLinkMatchLeaf,BackLinkNoteBranch,BlockRefElement 
export async function refreshFile(id: string) {
  const title = rmFileNameExt(id);
  console.log("title: ", title, id)
  if (title.trim().length == 0) {
    return; 
  }

  if (!FileSystemAccess.support(window)) {
    return;
  }

  // const dirHandle = store.getState().dirHandle;
  // console.log("dir: ", dirHandle)
  // if (!dirHandle) {
  //   return;
  // }
  let note: Note | undefined;
  try {
    // re-get fileHandle to refresh: dirHandle.entries or getFileHandle or store? 
    const fileHandle = store.getState().handles[title];
    // const [,handleName] = getRealHandleName(title, false);
    // const fileHandle = await dirHandle.getFileHandle(handleName);
    const fileData = await fileHandle.getFile();
    // re-processImport 
    note = await refreshImport(fileData, title);
  } catch (error) {
    console.log("An error occured when refresh file: ", error);
    note = store.getState().notes[id];
  }

  if (note) {
    const cNote: Notes = {};
    cNote[note.id] = note;
    store.getState().setCurrentNote(cNote);
  }

  return note;
}
