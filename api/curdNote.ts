import { store } from 'lib/store';
import apiClient from 'api/apiClient';
import type { Note } from 'types/model';
import type { PickPartial } from 'types/utils';

// upsert
// 
export type NoteUpsert = PickPartial<
  Note,  // title, user_id required
  'id' | 'title' | 'content' | 'created_at' | 'updated_at' | 'is_daily'
>;

export async function upsertDbNote(note: NoteUpsert) {
  // for userId
  const response = await apiClient
    .from<Note>('notes')
    .upsert(
      { ...note, updated_at: new Date().toISOString() },
      { onConflict: 'user_id, title', }
    )
    .single();

  return response;
}

// update
// 
export type NoteUpdate = PickPartial<
  Note, // id required
  'title' | 'content' | 'file_path' | 'cover' | 'created_at' | 'updated_at' | 'is_daily'
>;

export async function updateDbNote(note: NoteUpdate) {
  const response = await apiClient
    .from<Note>('notes')
    .update({ ...note, updated_at: new Date().toISOString() })
    .eq('id', note.id)
    .single();

  if (response.data) {
    // Update updated_at locally
    store
      .getState()
      .updateNote({ id: note.id, updated_at: response.data.updated_at });
  }

  return response;
}

// get
//
const selectColumns = 'id, title, content, user_id, created_at, updated_at, is_pub, is_wiki, is_daily';

export async function loadDbNote(noteId: string) {
  const response = await apiClient
    .from<Note>('notes')
    .select(selectColumns)
    .eq('id', noteId)
    .single();

  return response;
}


/* useless, to be del  */
/**
 * load note from db per title
 * @param noteTitle 
 * @returns Response
 */
export async function loadDbNotePerTitle(noteTitle: string) {
  const response = await apiClient
    .from<Note>('notes')
    .select(selectColumns)
    .eq('title', noteTitle)
    .single();

  return response;
}

// delete note from db
// 
export async function deleteDbNote(id: string, userId: string) {
  const response = await apiClient
    .from<Note>('notes')
    .delete()
    .match({'id': id, 'user_id': userId});

  return response;
}

/* end useless, to be del  */
