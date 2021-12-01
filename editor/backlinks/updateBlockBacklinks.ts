import { createEditor, Transforms } from 'slate';
import { Note } from 'types/model';
import apiClient from 'lib/apiClient';
import { updateDbNote } from 'lib/api/curdNote';
import { store } from 'lib/store';
import { Backlink } from './useBacklinks';

/**
 * Updates the block text for each block reference. 
 * This is necessary for full-text search.
 */
const updateBlockBacklinks = async (
  blockBacklinks: Backlink[],
  newText: string
) => {
  const notes = store.getState().notes;
  const updateData: Pick<Note, 'id' | 'content'>[] = [];

  for (const backlink of blockBacklinks) {
    const note = notes[backlink.id];

    if (!note) {
      continue;
    }

    const editor = createEditor();
    editor.children = note.content;

    // Update the text of each block reference
    for (const match of backlink.matches) {
      Transforms.insertText(editor, newText, {
        at: match.path,
        voids: true,
      });
    }

    updateData.push({
      id: backlink.id,
      content: editor.children,
    });
  }

  // Make sure backlinks are updated locally
  for (const newNote of updateData) {
    store.getState().updateNote(newNote);
  }

  const offlineMode = store.getState().offlineMode;
  if (!offlineMode) {
    // It would be better if we could consolidate the update requests into one request
    // See https://github.com/supabase/supabase-js/issues/156
    const promises = [];
    const userId = apiClient.auth.user()?.id;
    if (userId) {
      for (const data of updateData) {
        promises.push(updateDbNote(data, userId));
      }
      await Promise.all(promises);
    }
  }
};

export default updateBlockBacklinks;
