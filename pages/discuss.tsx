import Head from 'next/head';
import MainView from 'components/landing/MainView';
import Discuss from 'components/discuss/Utter/Discuss';

export default function Sponsors() {
  return (
    <MainView>
      <Head><title>Discuss | mdSilo</title></Head>
      <div className="container px-6 py-16 bg-splash">
        <h1 className="text-5xl font-semibold text-center">Thanks for Your Feedback</h1>
        <p className="text-xl text-center mt-4">
          Please go to our <a href="https://discord.gg/EXYSEHRTFt" className="link" target="_blank" rel="noopener noreferrer">Discord</a> and follow us on <a href="https://twitter.com/mdsiloapp" className="link" target="_blank" rel="noopener noreferrer">Twitter</a>. We are waiting there for you.
        </p>
        <Discuss 
          repo="mdSilo/mdSilo"
          issueTerm="title"
          theme="github-light"
        />
        {/* <Discuss 
          repo="mdSilo/mdSilo"
          repoId="R_kgDOGd0mUg"
          mapping="title"
          theme="light"
        /> */}
      </div>
    </MainView>
  );
}
