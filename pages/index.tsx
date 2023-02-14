/* eslint-disable @next/next/no-img-element */
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import Footer from 'components/landing/Footer';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col splash-bg">
        <div className="shadow-sm bg-slate-600 pb-12">
          <Navbar withText={true} />
          <div className="container flex flex-col lg:flex-row items-center justify-center my-12">
            <div className="container flex flex-col items-center justify-center px-2">
              <p className="text-lg pt-4 text-center text-slate-300">
                RSS & Podcast Client + Personal Wiki
              </p>
              <p className="text-4xl py-2 text-center text-primary-500">
                Buffering for your daily I/O 
              </p>
              <p className="text-2xl pt-2 text-center text-white">
                Available for Windows(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">msi</a>), macOS(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">dmg</a>, <a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_x64.app.tar.gz" className="link" target="_blank" rel="noopener noreferrer">app</a>), Linux(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">deb</a>, <a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>) and <a href="/app" className="link" target="_blank" rel="noopener noreferrer">Web</a>. 
              </p>
              <div className="flex flex-wrap items-center justify-center mt-4">
                <button className="m-2 text-lg text-white text-center bg-slate-700 py-2 px-4 rounded hover:bg-green-400">
                  <a href="https://github.com/mdSilo/mdSilo-app/releases" target="_blank" rel="noopener noreferrer">VERSION  0.5.4</a>
                </button>
                <button className="m-2 text-lg text-white text-center bg-slate-500 py-2 px-4 rounded hover:bg-green-600">
                  <a href="/app/demo" target="_blank" rel="noopener noreferrer">Try Online</a>
                </button>
              </div>
              <p className="text-xs pt-2 text-center text-slate-400">
                Local-first, Lightweight Yet Powerful. 
              </p>
            </div>
            <div 
              className="container p-2 text-center drop-shadow-lg" 
              title="All-In-One: WYSIWYG, Markdown, MindMap"
            >
              <img className="rounded-md" src="/3-mode.webp"></img>
              <p className="py-1 text-xs text-center text-white">
                All-In-One: WYSIWYG, Markdown, MindMap... 
              </p>
            </div>
          </div>
        </div>
        <Footer className="mt-8" />
      </div>
    </MainView>
  );
}
