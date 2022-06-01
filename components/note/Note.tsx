/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import MsEditor, { JSONContent } from "mdsmirror";
import { store, useStore } from 'lib/store';
import { Note } from 'types/model';
import { useAuthContext } from 'utils/useAuth';
import type { NoteUpdate } from 'lib/api/curdNote';
import { updateDbNote, loadDbNote } from 'lib/api/curdNote';

import { ProvideCurrent } from 'editor/hooks/useCurrent';
import { 
  writeFile, getOrNewFileHandle, delFileHandle, 
} from 'editor/hooks/useFSA';

import { FileSystemAccess } from 'editor/checks';
import { ciStringEqual } from 'utils/helper';
import ErrorBoundary from '../misc/ErrorBoundary';
import NoteHeader from './NoteHeader';

const SYNC_DEBOUNCE_MS = 1000;

const CHECK_VIOLATION_ERROR_CODE = '23514';
const UNIQUE_VIOLATION_ERROR_CODE = '23505';

type Props = {
  noteId: string;
  highlightedPath?: unknown;
  className?: string;
};

function Note(props: Props) {
  const { noteId, className } = props;
  const router = useRouter();
  const { user } = useAuthContext();
  const darkMode = useStore((state) => state.darkMode);
  // get some property of note
  const [note, setNote] = useState<Note | undefined>(undefined);
  const isPub = note?.is_pub ?? false;
  const isDaily = note?.is_daily ?? false;
  const initIsWiki = note?.is_wiki ?? false;
  // get title and content value
  const title = note?.title ?? 'demo note';
  const [initTitle, setInitTitle] = useState(title); // an initial title copy
  const mdContent = note?.content || '';

  const [isWiki, setIsWiki] = useState(initIsWiki);
  const [isLoaded, setIsLoaded] = useState(false)  // for clean up in useEffect
  
  // note action
  const updateNote = useStore((state) => state.updateNote);
  const upsertNote = useStore((state) => state.upsertNote);

  const loadNote = useCallback(
    async (noteId: string) => {
    const {data: note} = await loadDbNote(noteId);
    if (note) {
      setNote(note);
      upsertNote(note);
      setIsWiki(note.is_wiki);
    }
  }, [upsertNote]);

  useEffect(() => { 
    if (isWiki && !isLoaded) {
      loadNote(noteId);
    }
    return () => {
      setIsLoaded(true);
    }
  }, [noteId, isWiki, isLoaded, loadNote]);

  
  // use state and useEffect to trigger and handle update to db
  const [syncState, setSyncState] = useState({
    isTitleSynced: true,
    isContentSynced: true,
  });
  const isSynced = useMemo(
    () => syncState.isTitleSynced && syncState.isContentSynced,
    [syncState]
  );

  // update locally, set the syncState
  const onTitleChange = useCallback(
    async (title: string) => {
      const newTitle = title.trim();
      updateNote({ id: noteId, title: newTitle });
      setSyncState((syncState) => ({ ...syncState, isTitleSynced: false }));
    },
    [noteId, updateNote]
  );

  const onContentChange = useCallback(
    async (text: string, json: JSONContent) => {
      //updateNote({ id: noteId, content: value });
      console.log("on content change", text.length, json);
    },
    []
  );

  // update note to db
  const handleNoteUpdate = useCallback(async (note: NoteUpdate, userId: string) => {
    const { error } = await updateDbNote(note, userId);

    if (error) {
      switch (error.code) {
        case CHECK_VIOLATION_ERROR_CODE:
          toast.error(
            `This note cannot have an empty title. Please use a different title.`
          );
          return;
        case UNIQUE_VIOLATION_ERROR_CODE:
          toast.error(
            `There's already a note called ${note.title}. Please use a different title.`
          );
          return;
        default:
          // console.log("save locally only", error)
          return;
      }
    }
    
    setSyncState({ isTitleSynced: true, isContentSynced: true });
  }, []);

  // Save the note to db
  useEffect(() => {
    if (!isWiki || !note) { return; }

    const noteUpdate: NoteUpdate = { id: noteId, is_wiki: isWiki };
    if (!syncState.isContentSynced) {
      noteUpdate.content = note.content;
    }
    if (!syncState.isTitleSynced) {
      noteUpdate.title = note.title;
    }

    // Do not need authed usr to update wiki note currently
    const userId = user?.id || '';

    if (noteUpdate.title || noteUpdate.content) {
      const handler = setTimeout(
        () => handleNoteUpdate(noteUpdate, userId),
        SYNC_DEBOUNCE_MS
      );
      return () => clearTimeout(handler);
    }
  }, [user, noteId, isWiki, syncState, handleNoteUpdate, note]);

  // Prompt the usr with a dialog box about unsaved changes if they navigate away
  useEffect(() => {
    if (!isWiki) { return; }

    const warningText =
      `Any changes may be saved locally only: ${noteId}`;

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (isSynced) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (isSynced) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [router, isSynced, isWiki, noteId]);

  const noteContainerClassName =
    'flex flex-col flex-shrink-0 md:flex-shrink w-full bg-white dark:bg-gray-900 dark:text-gray-200';
  const errorContainerClassName = `${noteContainerClassName} items-center justify-center h-full p-4`;
  const noteClassName = `${noteContainerClassName} border-t-2 border-red-600`;

  const currentNoteValue = useMemo(() => ({ ty: 'note', id: noteId }), [noteId]);

  return (
    <ErrorBoundary
      fallback={
        <div className={errorContainerClassName}>
          <p>An unexpected error occurred when rendering this note.</p>
        </div>
      }
    >
      <ProvideCurrent value={currentNoteValue}>
        <div id={noteId} className={`${noteClassName} ${className}`}>
          <NoteHeader isWiki={isWiki} isPub={isPub} />
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col flex-1 w-full mx-auto md:w-128 lg:w-160 xl:w-192">
              <div className="flex-1 px-8 pt-2 pb-8 md:pb-12 md:px-12">
                <MsEditor 
                  value={mdContent}
                  dark={darkMode}
                  onChange={onContentChange}
                  onSearchSelectText={(txt) => console.log("search text", txt)}
                />
              </div>
            </div>
          </div>
        </div>
      </ProvideCurrent>
    </ErrorBoundary>
  );
}

export default memo(Note);
