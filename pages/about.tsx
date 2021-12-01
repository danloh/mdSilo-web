import Head from 'next/head';
import Link from 'next/link';
import MainView from 'components/landing/MainView';

export default function About() {
  return (
    <MainView>
      <Head>
        <title>About | mdSilo</title>
      </Head>
      <article className="container px-6 py-16 prose prose-primary text-gray-300">
        <h1>About mdSilo</h1>
        <div>
          <blockquote>
            Simple is better than complex.
            Networked is better than standalone.
          </blockquote>
        </div>
        <div>
          <p><b>mdSilo</b> /maind &apos;sailou/ : A mind silo to markdown promises.</p>
          <p>
            As the name indicated, mdSilo is the silo for storing ideas with a WYSIWYG editor and markdown support, 
            help you grasp every spark of inspiration, keep promises, build habit and think better via daily I/O(reading and writing). 
          </p>
          <p>
            With mdSilo, notes are not standalone but networked with bidirectional links to each other;
            besides backlinks, which let you see which notes link to a specific note, 
            the different pieces of thoughts in different notes can be also connected together via block reference. Your notes and knowledge will be organized associatively, empowering your reading, thinking and writing.
          </p>
        </div>
        <div>
          <blockquote>You can&apos;t start a fire without a spark.</blockquote>
          <p>
            mdSilo is a powerful {' '}  
            <Link href="/app"><a><b>note-taking-networking app</b></a></Link>, to help you grasp, 
            mark down every spark of inspiration and connect your thoughts together. 
            it is easy-to-use and versatile.
          </p>
        </div>
      </article>
    </MainView>
  );
}
