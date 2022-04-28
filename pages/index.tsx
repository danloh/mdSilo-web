import Link from 'next/link';
import MsEditor from "mdsmirror";
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';

export default function Home() {
  const defaultValue = `# Welcome  
  Lightweight note-taking tool with WYSIWYG Editor and Markdown support.  

  [Open Source](https://mdsilo.com/sponsors/) and Free.

  | Features | mdSilo | Note | Pricing |
  |----|----|----|---:|
  | WYSIWYG | Yes | Live Preview: Markdown, Code, Math... | Free |
  | Writing | Yes | Slash Commands, Toolbar, Hotkeys  | Free | `;

  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar />
            <div className="container">
              <div className="px-8 py-16">
                <div className="container text-xl px-2 text-center">
                  <div className="flex-1 mx-auto">
                    <Link href="https://github.com/danloh/mdSilo-app/releases">
                      <a className="inline-flex mt-4 text-xl btn">
                        Get Desktop App
                      </a>
                    </Link>
                  </div>
                  <p className="max-w-3xl pt-6 mx-auto md:text-2xl">
                    mdSilo is a plain-text knowledge silo and a networked-writing app.
                  </p>
                </div>
                <div className="flex flex-1 py-6 mx-auto max-w-2xl">
                  <div className="flex-1 px-8 bg-gray-900 overflow-auto">
                    <MsEditor 
                      dark={true} 
                      defaultValue={defaultValue} 
                      onOpenLink={(href) => { window.open(href, "_blank");}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer className={''} />
      </div>
    </MainView>
  );
}
