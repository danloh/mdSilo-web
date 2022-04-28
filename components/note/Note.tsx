import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import MsEditor, { JSONContent } from "mdsmirror";

import { Note } from 'types/model';
import { useAuthContext } from 'utils/useAuth';
import type { NoteUpdate } from 'lib/api/curdNote';
import { updateDbNote, loadDbNote } from 'lib/api/curdNote';

import { ProvideCurrent } from 'editor/hooks/useCurrent';
import { 
  writeFile, getOrNewFileHandle, delFileHandle, writeJsonFile,
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
  const storeNotes = useStore((state) => state.notes);
  const note: Note | undefined = storeNotes[noteId];
  const isPub = note?.is_pub ?? false;
  const isDaily = note?.is_daily ?? false;
  const initIsWiki = note?.is_wiki ?? false;
  // get title and content value
  const title = note?.title ?? 'demo note';
  const [initTitle, setInitTitle] = useState(title); // an initial title copy
  const value = note?.content ?? getDefaultEditorValue();

  const [isWiki, setIsWiki] = useState(initIsWiki);
  const [isLoaded, setIsLoaded] = useState(false)  // for clean up in useEffect
  const mdContent: string = value.map((n) => serialize(n)).join('');
  // note action
  const updateNote = useStore((state) => state.updateNote);
  const upsertNote = useStore((state) => state.upsertNote);
  // load note if it isWiki
  const loadNote = useCallback(
    async (noteId: string) => {
    const {data: note} = await loadDbNote(noteId);
    if (note) {
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
      // update note title in storage as unique title
      const newTitle = title.trim() || getUntitledTitle(noteId);
      const isTitleUnique = () => {
        const notesArr = Object.values(storeNotes);
        return notesArr.findIndex(
          // no need to be unique for wiki note title
          (n) => n.id !== noteId && !n.is_wiki && ciStringEqual(n.title, newTitle)
        ) === -1;
      };
      if (isWiki || isTitleUnique()) {
        updateNote({ id: noteId, title: newTitle });
        setSyncState((syncState) => ({ ...syncState, isTitleSynced: false }));
        await updateBacklinks(newTitle, noteId); 
        // handle FSA for private note only
        if (!isWiki) {
          // #FSA: on rename file: 
          // 1- new FileHandle 
          const newHandle = await getOrNewFileHandle(newTitle);
          // 2- swap value
          if (newHandle) {
            const content = value.map((n) => serialize(n)).join('');
            await writeFile(newHandle, content);
            await writeJsonFile();
          }
          // 3- delete the old redundant FileHandle
          await delFileHandle(initTitle);
          // 4- reset initTitle
          setInitTitle(newTitle);
        }
      } else {
        toast.error(
          `There's already a note called ${newTitle}. Please use a different title.`
        );
      }
    },
    [noteId, isWiki, storeNotes, updateNote, initTitle, value]
  );

  const onContentChange = useCallback(
    async (text: string, json: JSONContent) => {
      //updateNote({ id: noteId, content: value });
      console.log("on content change", text.length, json);
    },
    [note?.is_daily, noteId, title, updateNote]
  );

  const onValueChange = useCallback(() => {
    setSyncState((syncState) => ({ ...syncState, isContentSynced: false }));
  }, []);

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

  // Save the note to db, wiki note only
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

  const offlineMode = useStore((state) => state.offlineMode);
  const noteContainerClassName =
    'flex flex-col flex-shrink-0 md:flex-shrink w-full bg-white dark:bg-gray-900 dark:text-gray-200';
  const errorContainerClassName = `${noteContainerClassName} items-center justify-center h-full p-4`;
  const noteClassName = `${noteContainerClassName} ${offlineMode ? 'border-t-2 border-red-600' : ''}`;

  const currentNoteValue = useMemo(() => ({ ty: 'note', id: noteId }), [noteId]);
  const isNoteExists = useMemo(() => !!storeNotes[noteId], [noteId, storeNotes]);

  if (!isNoteExists) {
    return (
      <div className={errorContainerClassName}>
        <p>it does not look like this note exists! {noteId}</p>
      </div>
    );
  }

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

// Get a unique "Untitled" title, ignoring the specified noteId.
const getUntitledTitle = (noteId: string) => {
  const title = 'Untitled';

  const getResult = () => (suffix > 0 ? `${title} ${suffix}` : title);

  let suffix = 0;
  const notesArr = Object.values(store.getState().notes);
  while (
    notesArr.findIndex(
      (note) =>
        note.id !== noteId &&
        !note.is_wiki && 
        ciStringEqual(note.title, getResult())
    ) > -1
  ) {
    suffix += 1;
  }

  return getResult();
};
