import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classNames from 'classnames';
import colors from 'tailwindcss/colors';
import {
  useStore,
  store,
  NoteTreeItem,
  getNoteTreeItem,
  Notes,
  SidebarTab,
} from 'lib/store';
import apiClient from 'lib/apiClient';
import { Note, User as DbUser } from 'types/model';
import { useAuthContext } from 'utils/useAuth';
import useHotkeys from 'editor/hooks/useHotkeys';
import demo from 'public/demo.json';
import { isMobile } from 'utils/helper';
import Sidebar from './sidebar/Sidebar';
import FindOrCreateModal from './note/NoteNewModal';
import { exportNotesJson } from './note/NoteExport';
import PageLoading from './PageLoading';
import SettingsModal from './settings/SettingsModal';
import BillingModal from './settings/BillingModal';
import UpgradeModal from './UpgradeModal';
import OfflineBanner from './OfflineBanner';
import UpdateBanner from './UpdateBanner';


type Props = {
  children: ReactNode;
  className?: string;
};

export default function AppLayout(props: Props) {
  const { children, className = '' } = props;
  // auth user
  const { user, } = useAuthContext();
  const router = useRouter();

  const offlineMode = useStore((state) => state.offlineMode);
  const setOfflineMode = useStore((state) => state.setOfflineMode);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const setNotes = useStore((state) => state.setNotes);
  const setNoteTree = useStore((state) => state.setNoteTree);
  //const setWikiTree = useStore((state) => state.setWikiTree);
  const upsertNote = useStore((state) => state.upsertNote);
  const updateNoteTree = useStore((state) => state.updateNoteTree);

  // offline
  const initLocal = useCallback(async () => {
    const notes = Object.values(store.getState().notes);
    const openNoteIds = store.getState().openNoteIds;
    // Redirect to most recent note or first note
    if (router.pathname === '/app') {
      if (
        openNoteIds.length > 0 &&
        notes &&
        notes.findIndex((note) => note.id === openNoteIds[0]) > -1
      ) {
        router.replace(`/app/md/${openNoteIds[0]}`);
        return;
      } else if (notes && notes.length > 0) {
        router.replace(`/app/md/${notes[0].id}`);
        return;
      } else {
        router.replace(`/app/chronicle`);
      }
    }

    setIsPageLoaded(true);
  }, [router]);

  // load data from db
  const initData = useCallback(async () => {
    if (!user) {
      initLocal();
      return;
    }
    // clean up demo notes firstly
    delDemoNotes();

    // db user info
    const { data: userData } = await apiClient
      .from<DbUser>('users')
      .select('note_tree, wiki_tree')
      .eq('id', user.id)
      .single();
    
    if (!userData) {
      // TODO: per user's service subscription
      setOfflineMode(false);
      initLocal();
      return;
    }

    // init notes data for signin user
    const { data: notes } = await apiClient
      .from<Note>('notes')
      .select('id, title, content, cover, attr, created_at, updated_at, is_pub, is_wiki, is_daily')
      .eq('user_id', user.id)
      .order('title');

    // Redirect to most recent note or first note in database 
    if (router.pathname === '/app') {
      const openNoteIds = store.getState().openNoteIds;
      if (
        openNoteIds.length > 0 &&
        notes &&
        notes.findIndex((note) => note.id === openNoteIds[0]) > -1
      ) {
        router.replace(`/app/md/${openNoteIds[0]}`);
        return;
      } else if (notes && notes.length > 0) {
        router.replace(`/app/md/${notes[0].id}`);
        return;
      } else {
        router.replace(`/app/chronicle`);
      }
    }

    if (!notes) {
      setIsPageLoaded(true);
      return;
    }

    // Set notes
    const notesAsObj = notes.reduce<Record<Note['id'], Note>>((acc, note) => {
      acc[note.id] = note;
      return acc;
    }, {});
    setNotes(notesAsObj);

    // Set note tree
    if (userData?.note_tree) {
      const noteTree: NoteTreeItem[] = [...userData.note_tree];
      // This is a sanity check for removing notes in the noteTree that do not exist
      removeNonexistentNotes(noteTree, notesAsObj);
      // If there are notes that are not in the note tree, add them
      // This is a sanity check to make sure there are no orphaned notes
      for (const note of notes) {
        if (getNoteTreeItem(noteTree, note.id) === null) {
          noteTree.push({ id: note.id, children: [], collapsed: true });
        }
      }
      // Use the note tree saved in the database
      setNoteTree(noteTree);
    } else {
      // No note tree in database, just use notes
      setNoteTree(
        notes.map((note) => ({ id: note.id, children: [], collapsed: true }))
      );
    }

    setIsPageLoaded(true);
  }, [user, router, setNotes, setNoteTree, setOfflineMode, initLocal]);

  const initDemo = useCallback(async () => {
    try {
      const notesObj = demo.notesObj; // json as demo
      const notesArr = Object.values(notesObj as Notes);
      // console.log("parse", notesObj);
      notesArr.forEach(note => upsertNote(note, false)); 
      // not upsert tree when upsertNote because it will flatten nested structure
      // update tree from saved tree structure 
      const noteTree: NoteTreeItem[] = demo.noteTree;
      noteTree.forEach(item => updateNoteTree(item, null));
    } catch (e) {
      console.log(e);
    }

    router.replace(`/app/tasks`);

    setIsPageLoaded(true);
  }, [router, updateNoteTree, upsertNote]);

  useEffect(() => {
    if (router.pathname === '/app/demo') {
      initDemo();
    } else if (offlineMode) {
      initLocal();
    } else {
      initData(); // Initialize data from db
    }
  }, [router, offlineMode, initData, initLocal, initDemo]);

  const [isFindOrCreateModalOpen, setIsFindOrCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setBillingOpen] = useState(false);

  const darkMode = useStore((state) => state.darkMode);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const setIsPageStackingOn = useStore((state) => state.setIsPageStackingOn);
  const setSidebarTab = useStore((state) => state.setSidebarTab);

  const isUpgradeModalOpen = useStore((state) => state.isUpgradeModalOpen);

  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);

  const hasHydrated = useStore((state) => state._hasHydrated);
  useEffect(() => {
    // If the user is mobile, the persisted data has been hydrated, and there are no open note ids (a proxy for the first load),
    // change the initial values of isSidebarOpen and isPageStackingOn to better suit mobile devices
    // We need to wait until after hydration because otherwise the persisted state gets overridden and thrown away
    // After https://github.com/pmndrs/zustand/issues/562 is fixed, we can change this
    if (
      isMobile() &&
      hasHydrated &&
      store.getState().openNoteIds.length === 0
    ) {
      setIsSidebarOpen(false);
      setIsPageStackingOn(false);
    }
  }, [setIsSidebarOpen, setIsPageStackingOn, hasHydrated]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Subscribe to changes on the notes table for the logged in user
    const subscription = apiClient
      .from<Note>(`notes:user_id=eq.${user.id}`)
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          upsertNote(payload.new);
        } else if (payload.eventType === 'UPDATE') {
          // Don't update the note if it is currently open
          const openNoteIds = store.getState().openNoteIds;
          if (!openNoteIds.includes(payload.new.id)) {
            updateNote(payload.new);
          }
        } else if (payload.eventType === 'DELETE') {
          deleteNote(payload.old.id);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, upsertNote, updateNote, deleteNote]);

  const hotkeys = useMemo(
    () => [
      {
        hotkey: 'alt+n',
        callback: () => setIsFindOrCreateModalOpen((isOpen) => !isOpen),
      },
      {
        hotkey: 'mod+s',
        callback: () => { /* todo: for saving */ },
      },
      {
        hotkey: 'mod+shift+d',
        callback: () => setSidebarTab(SidebarTab.Silo),
      },
      {
        hotkey: 'mod+shift+f',
        callback: () => setSidebarTab(SidebarTab.Search),
      },
      {
        hotkey: 'mod+shift+g',
        callback: () => router.push('/app/graph'),
      },
      {
        hotkey: 'mod+shift+c',
        callback: () => router.push('/app/chronicle'),
      },
      {
        hotkey: 'mod+shift+t',
        callback: () => router.push('/app/tasks'),
      },
      {
        hotkey: 'alt+x',
        callback: () => setIsSidebarOpen((isOpen) => !isOpen),
      },
    ],
    [setIsFindOrCreateModalOpen, setSidebarTab, setIsSidebarOpen, router]
  );
  useHotkeys(hotkeys);

  // Prompt user to export json
  const exportOnClose = useStore((state) => state.exportOnClose);
  useEffect(() => {
    if (!offlineMode) { return; }
    const tipsText = `Will export your works as JSON.`;
    const handleWindowClose = async (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e || window.event).returnValue = tipsText;
      // better export works before closing
      if (exportOnClose) { await exportNotesJson(); }
      return tipsText;
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [user, router, offlineMode, exportOnClose]);

  const appContainerClassName = classNames(
    'h-screen',
    { dark: darkMode },
    className
  );

  if (!isPageLoaded) {
    return <PageLoading />;
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={darkMode ? colors.neutral[900] : colors.white}
        />
      </Head>
      <div id="app-container" className={appContainerClassName}>
        <div className="flex w-full h-full dark:bg-gray-900">
          <Sidebar
            setIsFindOrCreateModalOpen={setIsFindOrCreateModalOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            setBillingOpen={setBillingOpen}
          />
          <div className="relative flex flex-col flex-1 overflow-y-auto">
            {offlineMode ? null : <OfflineBanner />}
            <UpdateBanner />
            {children}
          </div>
          {isSettingsOpen ? (
            <SettingsModal setIsOpen={setIsSettingsOpen} />
          ) : null}
          {isBillingOpen ? (
            <BillingModal setIsOpen={setBillingOpen} />
          ) : null}
          {isFindOrCreateModalOpen ? (
            <FindOrCreateModal setIsOpen={setIsFindOrCreateModalOpen} />
          ) : null}
          {isUpgradeModalOpen ? <UpgradeModal /> : null}
        </div>
      </div>
    </>
  );
}

const removeNonexistentNotes = (tree: NoteTreeItem[], notes: Notes) => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (!notes[item.id]) {
      tree.splice(i, 1);
    } else if (item.children.length > 0) {
      removeNonexistentNotes(item.children, notes);
    }
  }
};

export const delDemoNotes = () => {
  const ids: string[] = Object.keys(demo.notesObj);
  for (const id of ids) {
    store.getState().deleteNote(id);
  }
}
