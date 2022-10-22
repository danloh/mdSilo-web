/* eslint-disable @next/next/no-img-element */
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import Footer from 'components/landing/Footer';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col splash-bg">
        <div className="shadow-sm bg-slate-600">
          <Navbar withText={true} />
          <div className="container flex flex-col lg:flex-row items-center justify-center my-12">
            <div className="container flex flex-col items-center justify-center px-2">
              <p className="text-3xl pt-3 text-center text-primary-500">
                Buffering for your daily I/O 
              </p>
              <p className="text-xl pt-4 text-center text-white">
                A Lightweight Personal Wiki: available for Windows(<a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.9/mdsilo_0.4.9_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">msi</a>), macOS(<a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.9/mdsilo_0.4.9_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">dmg</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.9/mdsilo.app.tar.gz" className="link" target="_blank" rel="noopener noreferrer">app</a>), Linux(<a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.9/mdsilo_0.4.9_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">deb</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.9/mdsilo_0.4.9_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>) and <a href="/app" className="link" target="_blank" rel="noopener noreferrer">Web</a>. 
              </p>
              <div className="flex flex-wrap items-center justify-center mt-4">
                <button className="m-1 text-lg text-white text-center bg-slate-700 py-2 px-4 rounded hover:bg-green-400">
                  <a href="https://github.com/mdSilo/mdSilo/releases" target="_blank" rel="noopener noreferrer">VERSION  0.4.9</a>
                </button>
                <button className="m-1 text-lg text-white text-center bg-slate-500 py-2 px-4 rounded hover:bg-green-600">
                  <a href="/playground" target="_blank" rel="noopener noreferrer">Live Demo</a>
                </button>
              </div>
            </div>
            <div 
              className="container p-2 text-center drop-shadow-lg" 
              title="All-In-One: WYSIWYG, Markdown, MindMap"
            >
              <img className="rounded-md" src="/3-mode.webp"></img>
              <p className="text-xs text-center text-white">
                All-In-One: WYSIWYG, Markdown, MindMap... 
              </p>
            </div>
          </div>
        </div>
        <div>
          <svg className="fill-slate-600" viewBox="0 0 1024 65"><path d="M99 0.25C59.25 0 0 25 0 25.2V0.25H99C99 0.25 99 0.25 99 0.25C99 0.25 99 0.25 99 0.25H1150V65C1018 22 958 25 820 23C672 21 573 73 427 73C308 73 218 0.25 99 0.25H99Z"></path></svg>
        </div>
        <Footer className="mt-10" />
      </div>
    </MainView>
  );
}
