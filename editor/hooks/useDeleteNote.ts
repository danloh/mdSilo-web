import { useCallback } from 'react';
import { useRouter } from 'next/router';
import deleteBacklinks from 'editor/backlinks/deleteBacklinks';
import { deleteDbNote } from 'lib/api/curdNote';
import { store, useStore } from 'lib/store';
import { useAuthContext } from 'utils/useAuth';

export default function useDeleteNote(noteId: string) {
  const { user } = useAuthContext();
  const router = useRouter();
  const openNoteIds = useStore((state) => state.openNoteIds);
  const offlineMode = useStore((state) => state.offlineMode);

  const onDeleteClick = useCallback(async () => {
    if (!offlineMode && !user) {
      router.push('/app');
      return;
    }

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
    // delete locally and update backlinks
    store.getState().deleteNote(noteId);
    await deleteBacklinks(noteId);

    // delete in db if not offlineMode
    if (!offlineMode && user) {
      await deleteDbNote(noteId, user.id);
    }
  }, [router, noteId, openNoteIds, user, offlineMode]);

  return onDeleteClick;
}
