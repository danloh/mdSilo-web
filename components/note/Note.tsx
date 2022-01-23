import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { Path, Descendant } from 'slate';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Editor from 'components/editor/Editor';
import Title from 'components/editor/Title';
import Trait, { TraitKeys } from 'components/editor/Trait';
import Backlinks from 'components/editor/backlinks/Backlinks';
import { store, useStore } from 'lib/store';
import { Attr, defaultAttr, buildAttr } from 'types/model';
import { useAuthContext } from 'utils/useAuth';
import type { NoteUpdate } from 'lib/api/curdNote';
import { updateDbNote, loadDbNote } from 'lib/api/curdNote';
import serialize from 'editor/serialization/serialize';
import { getDefaultEditorValue } from 'editor/constants';
import { ProvideCurrent } from 'editor/hooks/useCurrent';
import { 
  writeFile, getOrNewFileHandle, delFileHandle, writeJsonFile,
} from 'editor/hooks/useFSA';
import updateBacklinks from 'editor/backlinks/updateBacklinks';
import { FileSystemAccess } from 'editor/checks';
import { ciStringEqual } from 'utils/helper';
import ErrorBoundary from '../misc/ErrorBoundary';
import NoteHeader from './NoteHeader';

const SYNC_DEBOUNCE_MS = 1000;

const CHECK_VIOLATION_ERROR_CODE = '23514';
const UNIQUE_VIOLATION_ERROR_CODE = '23505';

type Props = {
  noteId: string;
  highlightedPath?: Path;
  className?: string;
};

function Note(props: Props) {
  const { noteId, highlightedPath, className } = props;
  const router = useRouter();
  const { user } = useAuthContext();
  const updateNote = useStore((state) => state.updateNote);

  // get some property of note
  const isPub = store.getState().notes[noteId]?.is_pub ?? false;
  const isDaily = store.getState().notes[noteId]?.is_daily ?? false;
  const initIsWiki = store.getState().notes[noteId]?.is_wiki ?? false;
  const [isWiki, setIsWiki] = useState(initIsWiki);
  const initNoteExists = useMemo(() => !!store.getState().notes[noteId], [noteId]);
  const [noteExists, setNoteExists] = useState(initNoteExists)
  const [isLoaded, setIsLoaded] = useState(false)  // for clean up in useEffect
  
  // load note if it isWiki or not-exist locally
  const loadNote = async (noteId: string) => {
    const {data: note} = await loadDbNote(noteId);
    if (note) {
      store.getState().upsertNote(note);
      setNoteExists(true)
      setIsWiki(note.is_wiki);
    }
  };

  useEffect(() => { 
    if ((isWiki || !noteExists) && !isLoaded ) {
      loadNote(noteId);
    }
    return () => {
      setIsLoaded(true);
    }
  }, [noteId, isWiki, noteExists, isLoaded]);

  // get title and content value
  const title = store.getState().notes[noteId]?.title ?? '';
  const [initTitle, ] = useState(title); // an initial title copy
  const value = useStore(
    (state) => state.notes[noteId]?.content ?? getDefaultEditorValue()
  );

  // update locally
  const setValueOnChange = useCallback(
    async (value: Descendant[]) => {
      updateNote({ id: noteId, content: value });
      // write to local file system if hasFSA
      if (FileSystemAccess.support(window)) {
        const handle = store.getState().handles[title]
          || await getOrNewFileHandle(title);
        if (handle) {
          const content = value.map((n) => serialize(n)).join('');
          await writeFile(handle, content);
          await writeJsonFile();
        }
      }
    },
    [noteId, title, updateNote]
  );

  const initNoteAttr: Attr = useStore(
    (state) => state.notes[noteId]?.attr ?? defaultAttr
  );
  // update locally
  const setAttrOnChange = useCallback(
    (k: string, v: string) => {
      const newAttr = Object.assign({}, initNoteAttr, buildAttr(k,v)); //Object.assign(tar,...src)
      store.getState().updateNote({ id: noteId, attr: newAttr })
    }, [noteId, initNoteAttr]
  );

  // use state and useEffect to trigger and handle update
  const [syncState, setSyncState] = useState({
    isTitleSynced: true,
    isContentSynced: true,
    isAttrSynced: true,
  });
  const isSynced = useMemo(
    () => syncState.isTitleSynced && syncState.isContentSynced && syncState.isAttrSynced,
    [syncState]
  );

  // update locally, set the syncState
  const onTitleChange = useCallback(
    async (title: string) => {
      // update note title in storage as unique title
      const newTitle = title.trim() || getUntitledTitle(noteId);
      const isTitleUnique = () => {
        const notesArr = Object.values(store.getState().notes);
        return notesArr.findIndex(
          // no need to be unique for wiki note under current user?
          (n) => n.id !== noteId && !n.is_wiki && ciStringEqual(n.title, newTitle)
        ) === -1;
      };
      if (isWiki || isTitleUnique()) {
        updateNote({ id: noteId, title: newTitle });
        // save backlinked notes to db, may backlinks updated but note not
        await updateBacklinks(newTitle, noteId);
        setSyncState((syncState) => ({ ...syncState, isTitleSynced: false }));
        // FSA: on rename file: 1- new FileHandle 
        const newHandle = await getOrNewFileHandle(newTitle);
        // swap value
        if (newHandle) {
          const content = value.map((n) => serialize(n)).join('');
          await writeFile(newHandle, content);
          await writeJsonFile();
        }
        // FSA: on rename file: 2- delete the old redundant FileHandle
        await delFileHandle(initTitle);
      } else {
        toast.error(
          `There's already a note called ${newTitle}. Please use a different title.`
        );
      }
    },
    [noteId, updateNote, isWiki, initTitle, value]
  );

  const onAttrChange = useCallback(() => {
    setSyncState((syncState) => ({ ...syncState, isAttrSynced: false }));
  }, []);

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
    
    setSyncState({ isTitleSynced: true, isContentSynced: true, isAttrSynced: true });
  }, []);

  // Save the note to db
  const offlineMode = useStore((state) => state.offlineMode);
  useEffect(() => {
    if ((offlineMode && !isWiki) || (!offlineMode && !user)) {
      return;
    }

    const note = store.getState().notes[noteId];
    if (!note) {
      return;
    }

    const noteUpdate: NoteUpdate = { id: noteId, is_wiki: isWiki };
    if (!syncState.isContentSynced) {
      noteUpdate.content = note.content;
    }
    if (!syncState.isTitleSynced) {
      noteUpdate.title = note.title;
    }
    if (!syncState.isAttrSynced) {
      noteUpdate.attr = note.attr;
    }

    // Note: a potential issue
    // do not need authed user to update wiki note currently
    const userId = isWiki ? '' : user?.id || '';
    if (!userId && !isWiki) {
      return;
    }

    if (noteUpdate.title || noteUpdate.content || noteUpdate.attr) {
      const handler = setTimeout(
        () => handleNoteUpdate(noteUpdate, userId),
        SYNC_DEBOUNCE_MS
      );
      return () => clearTimeout(handler);
    }
  }, [noteId, offlineMode, isWiki, user, syncState, handleNoteUpdate]);

  // Prompt the user with a dialog box about unsaved changes if they navigate away
  useEffect(() => {
    if ((offlineMode && !isWiki) || (!offlineMode && !user)) {
      return;
    }

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
  }, [user, router, offlineMode, isSynced, isWiki, noteId]);

  const noteContainerClassName =
    'flex flex-col flex-shrink-0 md:flex-shrink w-full bg-white dark:bg-gray-900 dark:text-gray-200';
  const errorContainerClassName = `${noteContainerClassName} items-center justify-center h-full p-4`;
  const noteClassName = `${noteContainerClassName} ${offlineMode ? 'border-t-4 border-red-600' : ''}`;

  const currentNoteValue = useMemo(() => ({ ty: 'note', id: noteId }), [noteId]);

  if (!noteExists) {
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
              <Title
                className="px-8 pb-1 md:px-12"
                initialTitle={title}
                onChange={onTitleChange}
                isDaily={isDaily}
                isPub={isPub}
              />
              {isWiki ? (
                <div className="mt-2 border-b">
                  {TraitKeys.map((k) => (
                    <Trait
                      key={k}
                      traitKey={k}
                      initialVal={initNoteAttr[k] || ''}
                      setAttr={setAttrOnChange}
                      onChange={onAttrChange}
                    />
                  ))}
                </div>
              ) : null}
              <Editor
                className="flex-1 px-8 pt-2 pb-8 md:pb-12 md:px-12"
                noteId={noteId}
                value={value}
                setValue={setValueOnChange}
                onChange={onValueChange}
                highlightedPath={highlightedPath}
                isWiki={isWiki}
                isDaily={isDaily}
                isPub={isPub}
              />
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-600">
                <Backlinks className="mx-4 mb-8 md:mx-8 md:mb-12" isCollapse={isWiki} />
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
