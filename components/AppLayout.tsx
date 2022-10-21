import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classNames from 'classnames';
import colors from 'tailwindcss/colors';
import { useStore, store, Notes, SidebarTab, NoteTree } from 'lib/store';
import { ProvideCurrentView } from 'context/useCurrentView';
import useHotkeys from 'editor/hooks/useHotkeys';
import demo from 'public/demo.json';
import { isMobile } from 'utils/helper';
import AppView from 'pages/app/AppView';
import Sidebar from './sidebar/Sidebar';
import FindOrCreateModal from './note/NoteNewModal';
import PageLoading from './PageLoading';
import SettingsModal from './settings/SettingsModal';
import OfflineBanner from './OfflineBanner';
import UpdateBanner from './UpdateBanner';
import SideMenu from './sidebar/SideMenu';


type Props = {
  children: ReactNode;
  className?: string;
};

export default function AppLayout(props: Props) {
  const { className = '' } = props;
  
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const initLocal = useCallback(async () => {
    if (router.pathname === '/app') {
      // TODO
    }
    setIsPageLoaded(true);
  }, [router]);

  // demo mode
  const initDemo = useCallback(async () => {
    try {
      const notesObj: Notes = demo.notesobj; // json as demo
      store.getState().setNotes(notesObj);
      const noteTree: NoteTree = demo.notetree;
      store.getState().setNoteTree(noteTree);
      store.getState().setInitDir('demo');
      store.getState().setCurrentDir('demo');
    } catch (e) {
      console.log(e);
    }

    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (router.pathname === '/app/demo') {
      initDemo();
    } else {
      initLocal();
    }
  }, [router, initLocal, initDemo]);

  const darkMode = useStore((state) => state.darkMode);

  const isFindOrCreateModalOpen= useStore((state) => state.isFindOrCreateModalOpen);
  const setIsFindOrCreateModalOpen = useStore((state) => state.setIsFindOrCreateModalOpen);
  const setSidebarTab = useStore((state) => state.setSidebarTab);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const setIsSettingsOpen = useStore((state) => state.setIsSettingsOpen);
  const isSettingsOpen = useStore((state) => state.isSettingsOpen);

  const setIsPageStackingOn = useStore((state) => state.setIsPageStackingOn);

  // const hasHydrated = useStore((state) => state._hasHydrated);

  useEffect(() => {
    // If on mobile, the persisted data has been hydrated, and there are no open note ids (a proxy for the first load),
    // change the initial values of isSidebarOpen and isPageStackingOn to better suit mobile devices
    // We need to wait until after hydration because otherwise the persisted state gets overridden and thrown away
    // After https://github.com/pmndrs/zustand/issues/562 is fixed, we can change this
    if (
      isMobile() &&
      store.getState().openNoteIds.length === 0
    ) {
      setIsSidebarOpen(false);
      setIsPageStackingOn(false);
    }
  }, [setIsSidebarOpen, setIsPageStackingOn]);

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
      <ProvideCurrentView>
        <div id="app-container" className={appContainerClassName}>
          <div className="flex w-full h-full dark:bg-gray-900">
            <SideMenu />
            <Sidebar />
            <div className="relative flex flex-col flex-1 overflow-y-auto">
              <OfflineBanner />
              <UpdateBanner />
              <AppView />
            </div>
            {isFindOrCreateModalOpen ? (
            <FindOrCreateModal setIsOpen={setIsFindOrCreateModalOpen} />
            ) : null}
            <SettingsModal 
              isOpen={isSettingsOpen}
              handleClose={() => setIsSettingsOpen(false)} 
            />
          </div>
        </div>
      </ProvideCurrentView>
    </>
  );
}

export const delDemoNotes = () => {
  const ids: string[] = Object.keys(demo.notesobj);
  for (const id of ids) {
    store.getState().deleteNote(id);
  }
}
