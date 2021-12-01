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
        <p><b>mdSilo</b> /maind &apos;sailou/ : A mind silo to mark down promises.</p>
        <div>
          <blockquote>Simple is better than complex.</blockquote>
          <p>
            mdSilo is the silo for storing ideas with a WYSIWYG editor and markdown support, it is easy-to-use and versatile.
          </p>
        </div>
        <div>
          <blockquote>Networked is better than standalone.</blockquote>
          <p>
            With mdSilo, the writings are not standalone but networked together via bidirectional BackLinks, Block Reference, PubLinks, HashTag and more.
          </p>
        </div>
        <div>
          <blockquote>You can&apos;t start a fire without a spark.</blockquote>
          <p>
            mdSilo can help you grasp, mark every spark of inspiration down, connect your thoughts together, think better via daily I/O(reading and writing). 
          </p>
        </div>
      </article>
    </MainView>
  );
}
