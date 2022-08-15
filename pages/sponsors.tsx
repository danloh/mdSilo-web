import Head from 'next/head';
import Image from 'next/image';
import MainView from 'components/landing/MainView';
import payqr from 'public/stripe-qr.png';

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
          We appreciate any support from you: 
        </p>
        <p className="text-xl text-center mt-4">
          recommend it to your friends, report bugs, contribute in coding or donate...
        </p>
        <div className="container p-6 flex flex-col items-center justify-center">
          <Image
            src={payqr}
            width={220}
            height={263.75} 
          />
          <a href="https://buy.stripe.com/6oE9ChgVZeOT4WA000" className="link mt-2 text-xl" target="_blank" rel="noopener noreferrer">Click to donate</a>
        </div>
      </div>
    </MainView>
  );
}
