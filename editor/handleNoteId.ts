import { v4 as uuidv4 } from 'uuid';
import { store } from 'lib/store';
import apiClient from 'lib/apiClient';
import { upsertDbNote } from 'lib/api/curdNote';
import { defaultUserId, defaultNote } from 'types/model';
import { ciStringEqual, regDateStr } from 'utils/helper';
import { getOrNewFileHandle } from 'editor/hooks/useFSA';

// If the normalized note title exists, then returns the existing note id.
// Otherwise, creates a new note id.
export const getOrCreateNoteId = (title: string, is_wiki = false): string | null => {
  let noteId;
  const noteTitle = title.trim();
  const notes = store.getState().notes;
  const notesArr = Object.values(notes);
  const matchingNote = notesArr.find((note) =>
    ciStringEqual(note.title, noteTitle) && 
    note.is_wiki == is_wiki 
  );

  if (matchingNote) {
    noteId = matchingNote.id;
  } else {
    noteId = uuidv4();
    const is_daily = regDateStr.test(noteTitle);
    const newNote = {
      ...defaultNote,
      id: noteId, 
      title: noteTitle, 
      is_wiki,
      is_daily, 
    };
    store.getState().upsertNote(newNote);
    // new FileHandle and set in store
    if (!is_wiki) {
      getOrNewFileHandle(newNote.title); // cannot await here, to avoid awaits propagation
    }

    const offlineMode = store.getState().offlineMode;
    if (!offlineMode || is_wiki) {
      if (!offlineMode && !is_wiki && !apiClient.auth.user()?.id) {
        return noteId;
      }
      const userId = is_wiki 
        ? defaultUserId 
        : apiClient.auth.user()?.id || defaultUserId;
      const upsertData = {...newNote, user_id: userId };
      
      // The note id may be updated on upsert old Note with new noteId, 
      // noteid (db/linking) consistence issue:
      // private notes: can assert new in this else branch, no such issue,
      // wiki notes: the id maybe used in others' PubLink, thus it exists in db, 
      // must be consistent:
      //   handle PubLink: searching triggered before autocomplete, minimal issue,
      //   handle CustomPubLink: trigger bug if input the title of a old note,
      // FIXME: stopgap - ignore dup on upsert, minimize the effect on linking, 
      //              but will confuse user: new linking is invalid.
      // cannot await here for it will propagate awaits, 
      // and then not work in proper order
      upsertDbNote(upsertData, userId).then(res => {
        const newNote = res.data;
        if (newNote) {
          noteId = newNote.id; // this not work actually
        }
      }); 
    }
  }

  return noteId;
};
