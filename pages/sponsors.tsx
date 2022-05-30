import Head from 'next/head';
import MainView from 'components/landing/MainView';

export default function Sponsors() {
  return (
    <MainView showFooter={true}>
      <Head><title>Sponsors | mdSilo</title></Head>
      <div className="container px-6 py-16">
        <h1 className="text-5xl font-semibold text-center">We Appreciate Your Support</h1>
        <p className="text-2xl text-center mt-4">
          mdSilo is an <a href="https://github.com/danloh/mdSilo-web" className="link" target="_blank" rel="noopener noreferrer">open source project</a> and is provided for free
        </p>
        <p className="text-xl text-center mt-4">
          We appreciate any support from you: recommend it to your friends, report bugs, contribute in coding...
        </p>
      </div>
    </MainView>
  );
}
