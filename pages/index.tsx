import Link from 'next/link';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import Editor from 'components/editor/Editor';
import { getIndexDemoEditorValue } from 'editor/constants';
import { ProvideCurrent } from 'editor/hooks/useCurrent';

export default function Home() {
  const cardClass = 'p-8 rounded-md shadow bg-neutral-100 text-gray-800';
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar />
            <div className="container">
              <div className="px-8 py-16 grid gap-6 md:grid-cols-2">
                <div className="container text-xl px-6 text-center">
                  <div className="flex-1 mx-auto">
                    <Link href="/app">
                      <a className="inline-flex mt-4 mx-2 text-2xl btn">
                        Writing on Web
                      </a>
                    </Link>
                    <Link href="https://github.com/danloh/mdSilo-app/releases">
                      <a className="inline-flex mt-4 mx-2 text-2xl btn">
                        Get Desktop App
                      </a>
                    </Link>
                  </div>
                  <p className="max-w-3xl pt-6 mx-auto md:text-2xl">
                    mdSilo is a plain-text knowledge silo and a networked-writing app.
                  </p>
                  <Link href="/app/demo">
                    <a className="inline-flex mt-4 text-2xl link hover:shadow-lg">
                      Live Demo
                    </a>
                  </Link>
                </div>
                <div className="flex flex-1 w-full mx-auto">
                  <ProvideCurrent value={{ ty: 'note', id: '0000' }}>
                    <Editor
                      className="flex-1 px-8 pt-2 pb-8 md:pb-12 md:px-12 bg-gray-800"
                      value={getIndexDemoEditorValue()}
                      setValue={() => {/*do nothing*/}}
                      onChange={() => {/*do nothing*/}}
                    />
                  </ProvideCurrent>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 md:py-12 bg-neutral-300">
          <div className="container px-6">
            <div className="grid gap-6 pt-6 md:grid-cols-3">
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">📝 Enjoy Writing</h3>
                <p className="pt-1">Real-time WYSIWYG writing</p>
                <p className="pt-1">Slash commands, Toolbar, Hotkeys</p>
                <p className="pt-1">Import and Export (Markdown, JSON)</p>
                <p className="pt-1">Web App and Cross-platform Desktop App</p>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">
                  🔗 Connect Everything
                </h3>
                <p className="pt-1">{`#HashTag and ( External Link )`}</p>
                <p className="pt-1">(( Block Reference ))</p>
                <p className="pt-1">[[ Bidirection BackLink ]]</p>
                <p className="pt-1">{`{{ PubLink to liaison points }}`}</p>
                <sup className="text-xs">*Experimental</sup>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">🪟 Different Views</h3>
                <p className="pt-1">Chronicle View</p>
                <p className="pt-1">Stacking View</p>
                <p className="pt-1">Graph View</p>
                <p className="pt-1">Task View</p>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">💡 Knowledge Silo</h3>
                <p className="pt-1">
                  Store the ideas, thoughts, knowledge in the networked way and 
                  view them from different perspectives.
                </p>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">🔒 Private and Secure</h3>
                <p className="pt-2">
                  Write completely offline using the tiny but powerful and cross-platform Desktop App. Even the code is entirely in your control.
                </p>
              </div>
              <div className={cardClass}>
                <h3 className="text-xl font-semibold">🤝🏼 Liaison to Knowledge</h3>
                <p className="pt-1">
                  PubLink opens a window for each private digital garden, links to liaison points between knowledge.
                </p>
                <sup className="text-xs">*Experimental</sup>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8 md:py-16">
          <div className="container px-6">
            <div className="max-w-3xl pt-6 mx-auto space-y-8 text-center md:pt-8">
              <p className="text-2xl italic leading-normal">
                &ldquo; WYSIWYG markdown editor is such a rarity. &rdquo;
              </p>
              <p className="text-2xl italic leading-normal">
                &ldquo; I love the simplicity. &rdquo;
              </p>
              <p className="text-2xl italic leading-normal">
                &ldquo; Very neat product. &rdquo;
              </p>
            </div>
          </div>
        </div>
        <Footer className={''} />
      </div>
    </MainView>
  );
}
