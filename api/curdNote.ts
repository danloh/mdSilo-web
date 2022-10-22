import { store } from 'lib/store';
import apiClient from 'api/apiClient';
import type { PickPartial } from 'types/utils';

export type DbNotesData = {
  id: string; 
  title: string;   // aka. folder name
  content: string; // all notes
  created_at: string;
  updated_at: string;
  user_id: string;
};

// upsert
// 
export type NoteUpsert = PickPartial<
  DbNotesData, 
  'id' | 'title' | 'content' | 'created_at' | 'updated_at' | 'user_id'
>;

export async function upsertDbNote(note: NoteUpsert) {
  // for userId
  const response = await apiClient
    .from<DbNotesData>('notes')
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
  DbNotesData, // id required
  'title' | 'content' | 'created_at' | 'updated_at' | 'user_id'
>;

export async function updateDbNote(note: NoteUpdate) {
  const response = await apiClient
    .from<DbNotesData>('notes')
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
const selectColumns = 'id, title, content, created_at, updated_at, user_id';

export async function loadDbNote(noteId: string) {
  const response = await apiClient
    .from<DbNotesData>('notes')
    .select(selectColumns)
    .eq('id', noteId)
    .single();

  return response;
}

// delete note from db
// 
export async function deleteDbNote(id: string, userId: string) {
  const response = await apiClient
    .from<DbNotesData>('notes')
    .delete()
    .match({'id': id, 'user_id': userId});

  return response;
}
