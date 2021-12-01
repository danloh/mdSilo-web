import { createEditor, Editor, Element, Transforms } from 'slate';
import { ElementType } from 'editor/slate';
import { Note } from 'types/model';
import apiClient from 'lib/apiClient';
import { updateDbNote } from 'lib/api/curdNote';
import { store } from 'lib/store';
import { computeLinkedBacklinks } from './useBacklinks';

const deleteBacklinks = async (noteId: string) => {
  const notes = store.getState().notes;
  const backlinks = computeLinkedBacklinks(notes, noteId);
  const updateData: Pick<Note, 'id' | 'content'>[] = [];

  for (const backlink of backlinks) {
    const note = notes[backlink.id];

    if (!note) {
      continue;
    }

    const editor = createEditor();
    editor.children = note.content;

    Transforms.unwrapNodes(editor, {
      at: [],
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === ElementType.NoteLink &&
        n.noteId === noteId,
    });

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

export default deleteBacklinks;
