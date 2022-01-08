import Head from 'next/head';
import MainView from 'components/landing/MainView';

export default function About() {
  return (
    <MainView>
      <Head>
        <title>About | mdSilo</title>
      </Head>
      <article className="container px-6 py-16 prose prose-primary text-gray-300">
        <h1>About mdSilo</h1>
        <p><b>mdSilo</b> /maind &apos;sailou/ : A mind silo.</p>
        <div>
          <blockquote>Simple is better than complex.</blockquote>
          <p>
            mdSilo is a silo for storing ideas with a WYSIWYG editor and Markdown support. It is easy-to-use and versatile.
          </p>
        </div>
        <div>
          <blockquote>Networked is better than standalone.</blockquote>
          <p>
            With mdSilo, your writings are not standalone, but are networked together via bidirectional BackLinks, Block Reference, PubLinks, HashTag and more.
          </p>
        </div>
        <div>
          <blockquote>You can&apos;t start a fire without a spark.</blockquote>
          <p>
            mdSilo can help you take note of every idea, capture every spark of inspiration, connect your thoughts together, and think better.
          </p>
        </div>
      </article>
    </MainView>
  );
}
