import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classNames from 'classnames';
import colors from 'tailwindcss/colors';
import PageLoading from './PageLoading';


type Props = {
  children: ReactNode;
  className?: string;
};

export default function AppLayout(props: Props) {
  const { children, className = '' } = props;
  
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  

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


  const appContainerClassName = classNames(
    'h-screen',
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
          <div className="relative flex flex-col flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
