import Link from 'next/link';
import MsEditor from "mdsmirror";
import { useState, useEffect } from 'react';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import { getOS } from 'utils/helper';

export default function Home() {
  const platform = getOS();
  const [link, setLink] = useState<string>('https://github.com/danloh/mdSilo-app/releases');
  const [app, setApp] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => { 
    if (isLoaded) {
      return;
    }
    if (platform == 'Win') {
      setLink('https://github.com/danloh/mdSilo-app/releases');
      setApp('Windows');
    } else if (platform == 'Mac') {
      setLink('https://github.com/danloh/mdSilo-app/releases/download/app-v0.4.0-beta.2/mdsilo_0.4.0-beta.2_x64.dmg');
      setApp('macOS');
    } else if (platform == 'Linux') {
      setLink('https://github.com/danloh/mdSilo-app/releases/download/app-v0.4.0-beta.2/mdsilo_0.4.0-beta.2_amd64.AppImage');
      setApp('AppImage');
    }
    return () => {
      setIsLoaded(true);
    }
  }, [isLoaded, platform]);

  const cardClass = 'p-8 rounded-md shadow bg-neutral-100 text-gray-800';

  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar withText={true} />
            <div className="container">
              <div className="px-6 py-16 grid gap-6 md:grid-cols-2">
                <div className="container text-xl px-2 text-center">
                  <div className="flex-1 mx-auto">
                    <Link href="/writing">
                      <a className="inline-flex mt-4 mx-1 text-xl btn">
                        Writing on Web
                      </a>
                    </Link>
                    <Link href={link}>
                      <a className="inline-flex mt-4 mx-1 text-xl btn group">
                        Get App <span className='text-xs text-gray-200'> {app}</span>
                      </a>
                    </Link>
                  </div>
                  <p className="text-xs pt-3 text-center">
                    Also available for <a href="https://github.com/danloh/mdSilo-app/releases" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/danloh/mdSilo-app/releases/download/app-v0.4.0-beta.2/mdsilo_0.4.0-beta.2_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/danloh/mdSilo-app/releases/download/app-v0.4.0-beta.2/mdsilo_0.4.0-beta.2_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/danloh/mdSilo-app/releases/download/app-v0.4.0-beta.2/mdsilo_0.4.0-beta.2_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>.
                  </p>
                  <p className="max-w-3xl pt-2 mx-auto md:text-2xl">
                    Lightweight plain-text knowledge silo and networked-writing tool.
                  </p>
                  <Link href="/writing">
                    <a className="inline-flex mt-4 text-2xl link hover:shadow-lg">
                      Live Demo
                    </a>
                  </Link>
                </div>
                <div className="flex flex-1 w-full mx-auto ">
                  <div className="flex-1 bg-black overflow-auto p-8">
                    <MsEditor 
                      dark={true} 
                      value={defaultValue} 
                      onChange={() => {/**/}} 
                      onOpenLink={(href) => { window.open(href, "_blank");}}
                      onShowToast={() => {/* nothing*/}}
                    />
                  </div>
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
                <p className="pt-1">WYSIWYG Markdown Support</p>
                <p className="pt-1">Slash commands, Toolbar, Hotkeys</p>
                <p className="pt-1">Web App and Cross-platform Desktop App</p>
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
        <Footer className="border-t-2 border-gray-600" />
      </div>
    </MainView>
  );
}


const defaultValue = `
A Knowledge Silo equipped with ==WYSIWYG Markdown== writing and reading tool. Available for **Web**, *Windows*, __macOS__, Linux.  

Tiny but Powerful, You can use it for 100% free forever. Please [get the application here](https://github.com/danloh/mdSilo-app/releases), or Try it out and just start writing...  
`;
