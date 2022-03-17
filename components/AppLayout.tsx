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
  Notes,
  SidebarTab,
} from 'lib/store';
import useHotkeys from 'editor/hooks/useHotkeys';
import demo from 'public/demo.json';
import { isMobile } from 'utils/helper';
import Sidebar from './sidebar/Sidebar';
import FindOrCreateModal from './note/NoteNewModal';
import { exportNotesJson } from './note/NoteExport';
import PageLoading from './PageLoading';
import SettingsModal from './settings/SettingsModal';
import OfflineBanner from './OfflineBanner';
import UpdateBanner from './UpdateBanner';


type Props = {
  children: ReactNode;
  className?: string;
};

export default function AppLayout(props: Props) {
  const { children, className = '' } = props;
  
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const upsertNote = useStore((state) => state.upsertNote);
  const updateNoteTree = useStore((state) => state.updateNoteTree);

  // offline mode
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

  // demo mode
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
    } else {
      initLocal();
    }
  }, [router, initLocal, initDemo]);

  const [isFindOrCreateModalOpen, setIsFindOrCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const darkMode = useStore((state) => state.darkMode);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const setIsPageStackingOn = useStore((state) => state.setIsPageStackingOn);
  const setSidebarTab = useStore((state) => state.setSidebarTab);

  const hasHydrated = useStore((state) => state._hasHydrated);

  useEffect(() => {
    // If on mobile, the persisted data has been hydrated, and there are no open note ids (a proxy for the first load),
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

  // Prompt to export json
  const exportOnClose = useStore((state) => state.exportOnClose);
  useEffect(() => {
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
  }, [router, exportOnClose]);

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
          />
          <div className="relative flex flex-col flex-1 overflow-y-auto">
            <OfflineBanner />
            <UpdateBanner />
            {children}
          </div>
          {isSettingsOpen ? (
            <SettingsModal 
              isOpen={isSettingsOpen}
              handleClose={() => setIsSettingsOpen(false)} 
            />
          ) : null}
          {isFindOrCreateModalOpen ? (
            <FindOrCreateModal setIsOpen={setIsFindOrCreateModalOpen} />
          ) : null}
        </div>
      </div>
    </>
  );
}

export const delDemoNotes = () => {
  const ids: string[] = Object.keys(demo.notesObj);
  for (const id of ids) {
    store.getState().deleteNote(id);
  }
}
