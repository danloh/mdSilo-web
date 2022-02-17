import { useCallback } from 'react';
import { useRouter } from 'next/router';
import deleteBacklinks from 'editor/backlinks/deleteBacklinks';
import { store, useStore } from 'lib/store';
import { delFileHandle } from './useFSA';

export default function useDeleteNote(noteId: string) {
  const router = useRouter();
  const openNoteIds = useStore((state) => state.openNoteIds);

  const onDeleteClick = useCallback(async () => {
    const deletedNoteIndex = openNoteIds.findIndex(
      (openNoteId) => openNoteId === noteId
    );

    if (deletedNoteIndex !== -1) {
      const noteIds = Object.keys(store.getState().notes);
      // Redirect to first not-del note or to /app if no note already
      if (noteIds.length > 1) {
        for (const id of noteIds) {
          if (noteId !== id) {
            router.push(`/app/md/${id}`, undefined, { shallow: true });
            break;
          }
        }
      } else {
        router.push('/app');
      }
    }
    
    // get title for del FileHandle
    const title = store.getState().notes[noteId].title;
    // delete locally and update backlinks
    store.getState().deleteNote(noteId);
    await deleteBacklinks(noteId);
    // FSA: del FileHandle
    // Alert: permanently del
    await delFileHandle(title);
  }, [router, noteId, openNoteIds]);

  return onDeleteClick;
}
