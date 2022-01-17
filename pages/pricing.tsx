import Head from 'next/head';
import MainView from 'components/landing/MainView';
import PricingFaq from 'components/PricingFaq';

export default function Pricing() {
  return (
    <MainView>
      <Head>
        <title>Pricing | mdSilo</title>
      </Head>
      <div className="container px-6 py-16">
        <h1 className="text-5xl font-semibold text-center">Pricing</h1>
        <PricingFaq className="pt-12 sm:pt-16 lg:pt-24" />
      </div>
    </MainView>
  );
}
