import Head from 'next/head';
import Link from 'next/link';
import Note from 'components/note/Note';
import { useCurrentViewContext } from 'context/useCurrentView';

export default function NotePage() {
  const currentView = useCurrentViewContext();
  const params = currentView.state.params;
  const noteId = params?.noteId || ''; 

  console.log("go to note id", noteId)

  const siteTitle = 'mdSilo';

  if (!noteId || typeof noteId !== 'string') {
    return (
      <>
        <Head>
          <title>Not Found | mdSilo</title>
        </Head>
        <div className="flex flex-col items-center justify-center flex-1 h-screen p-4">
          <p className="text-2xl text-center">
            Whoops&mdash;it doesn&apos;t look like this note exists!
          </p>
          <Link href="/">
            <a className="mt-6 btn">Go back</a>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="flex flex-1 overflow-x-auto divide-x divide-gray-200 dark:divide-gray-700">
        <Note
          key={noteId}
          noteId={noteId}
          className="sticky left-0"
        />
      </div>
    </>
  );
}
