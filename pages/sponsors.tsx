import Head from 'next/head';
import MainView from 'components/landing/MainView';

export default function Sponsors() {
  return (
    <MainView>
      <Head><title>Sponsors | mdSilo</title></Head>
      <div className="container px-6 py-16">
        <h1 className="text-5xl font-semibold text-center">We appreciate your support</h1>
        <p className="text-xl text-center mt-4">
          mdSilo is an <a href="https://github.com/mdSilo" target="_blank" rel="noopener noreferrer">open source project</a> and is provided for free
        </p>
      </div>
    </MainView>
  );
}
