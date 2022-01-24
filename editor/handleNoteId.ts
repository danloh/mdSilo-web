import { v4 as uuidv4 } from 'uuid';
import { store } from 'lib/store';
import apiClient from 'lib/apiClient';
import { upsertDbNote } from 'lib/api/curdNote';
import { defaultUserId, defaultNote } from 'types/model';
import { ciStringEqual, regDateStr } from 'utils/helper';
import { getOrNewFileHandle } from 'editor/hooks/useFSA';

// If the normalized note title exists, then returns the existing note id.
// Otherwise, creates a new note id.
export const getOrCreateNoteId = (title: string): string => {
  let noteId;
  const noteTitle = title.trim();
  const notes = store.getState().notes;
  const notesArr = Object.values(notes);
  const matchingNote = notesArr.find((note) =>
    ciStringEqual(note.title, noteTitle) && !note.is_wiki
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
      is_daily, 
    };
    store.getState().upsertNote(newNote);
    // new FileHandle and set in store
    getOrNewFileHandle(newNote.title); // cannot await here, to avoid awaits propagation
    
    const offlineMode = store.getState().offlineMode;
    if (!offlineMode) {
      const authId = apiClient.auth.user()?.id;
      if (!authId) {
        return noteId;
      }
      const upsertData = {...newNote, user_id: authId };
      
      // The note id may be updated on upsert old Note with new noteId, 
      // noteid (db/linking) consistence issue:
      // private notes: can assert new in this else branch, no such issue,
      upsertDbNote(upsertData, authId).then(res => {
        const newDbNote = res.data;
        if (newDbNote) {
          store.getState().upsertNote(newDbNote);
        }
      }); 
    }
  }

  return noteId;
};

// for Wiki note only
export const getOrCreateWikiId = (title: string) => {
  const noteTitle = title.trim();
  const notes = store.getState().notes;
  const notesArr = Object.values(notes);
  const matchingNote = notesArr.find((note) =>
    ciStringEqual(note.title, noteTitle) && note.is_wiki
  );

  if (matchingNote) {
    const noteId = matchingNote.id;
    return noteId;
  } else {
    // The note id may be updated on upsert old Note with new noteId, 
    // noteid (db/linking) consistence issue:
    // wiki notes: the id maybe used in others' PubLink, thus it may exists in db, 
    // must be consistent:
    //   handle PubLink: searching triggered before autocomplete, minimal issue,
    //   handle CustomPubLink: trigger bug if input the title of a old note,
    // Just return noteTitle if not existing locally
    // delay to get real id till onClick in PubLinkElement
    return noteTitle;
  }
};

/**
 * better use if we can make sure that no note with this title in db
 * @param {string} title
 * @returns {Note}
 */
export const newWikiPerTitle = async (title: string) => {
  const noteTitle = title.trim();
  const noteId = uuidv4();
  const newNote = {
    ...defaultNote,
    id: noteId, 
    title: noteTitle, 
    user_id: defaultUserId,
    is_wiki: true,
  };
  
  const res = await upsertDbNote(newNote, defaultUserId);
  const newDbNote = res.data;
  if (newDbNote) {
    store.getState().upsertNote(newDbNote);
  }

  return newDbNote;
};
