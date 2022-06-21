import Link from 'next/link';
import { useState, useEffect } from 'react';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import { getOS } from 'utils/helper';
import DemoEditor from './DemoEditor';

export default function Home() {
  const platform = getOS();
  const [link, setLink] = useState<string>('https://github.com/mdSilo/mdSilo/releases');
  const [app, setApp] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { 
    if (isLoaded) {
      return;
    }
    if (platform == 'Win') {
      setLink('https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_x64_en-US.msi');
      setApp('Windows');
    } else if (platform == 'Mac') {
      setLink('https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_x64.dmg');
      setApp('macOS');
    } else if (platform == 'Linux') {
      setLink('https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_amd64.AppImage');
      setApp('AppImage');
    }
    return () => {
      setIsLoaded(true);
    }
  }, [isLoaded, platform]);

  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar withText={true} />
            <div className="container">
              <div className="px-4 py-8">
                <div className="container text-xl px-2 text-center">
                  <h1 className="p-2 text-4xl font-bold">Tiny Knowledge Silo On Your Desktop</h1>
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
                  <p className="text-xl pt-3 text-center">
                    Also available for <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.0/mdsilo_0.4.0_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>.
                  </p>
                  <Link href="/writing">
                    <a className="inline-flex mt-4 text-lg">Live Demo</a>
                  </Link>
                </div>
                <div className="flex flex-1 w-full lg:w-2/3 mx-auto pt-2">
                  <div className="flex-1 bg-black overflow-auto px-8 py-2">
                    <DemoEditor defaultValue={defaultValue} autoFocus={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer className="border-t-2 border-gray-600" />
      </div>
    </MainView>
  );
}


const defaultValue = `
Lightweight plain-text knowledge silo and networked-writing tool equipped with ==WYSIWYG Markdown== editor and reader.

## Features
  - 📝 WYSIWYG Markdown Editor: Table, Math, Hashtag, WikiLink...  
  - 🔀 Seamless switch between WYSIWYG and raw Markdown
  - ⌨️ Slash commands, Hotkeys and Hovering toolbar...   
  - 🪟 Chronicle view, Graph view... 
  - 🔍 Full-text search 
  - 📅 Daily activities graph  
  - ✨ Available for **Web**, *Windows*, __macOS__, Linux

:::info
You can [Get the application here](https://github.com/mdSilo/mdSilo/releases)
:::

Tiny but Powerful, free and open source. Please [get the application here](https://github.com/mdSilo/mdSilo/releases), or start [writing on web](https://mdsilo.com/writing/)... #Tips# 
\\
`;
