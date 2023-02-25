/* eslint-disable @next/next/no-img-element */
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import Footer from 'components/landing/Footer';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col">
        <div className="shadow-sm pb-8">
          <Navbar withText={true} />
          <div className="py-12">
            <div className="container px-6 text-center">
              <h1 className="text-5xl font-semibold text-slate-300 leading-tight">
                Open platform for <br/> Writing, Reading and Collaboration
              </h1>
              <p className="text-4xl py-2 text-center text-primary-500">
                Buffering for your daily I/O 
              </p>
              <div className="flex-1 mx-auto pt-4">
                <a href="https://github.com/mdSilo/mdSilo-app/releases" target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 mr-2 text-xl btn">
                  Private Writing
                </a>
                <a href="https://pad.mdsilo.com" target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 mr-2 text-xl btn">
                  Collaborative Writing
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 bg-neutral-300">
          <div className="container px-6">
            <div className="grid gap-8 pt-6 lg:grid-cols-2">
              <div className="container flex flex-col items-center justify-center py-4">
                <div 
                  className="container p-4 text-center drop-shadow-lg flex flex-col items-center justify-center" 
                  title="All-In-One: WYSIWYG, Markdown, MindMap"
                >
                  <img className="rounded-md" style={{maxHeight: "280px", maxWidth: "570px"}} src="/3-mode.webp"></img>
                  <p className="py-1 text-xs text-center text-black">
                    All-In-One: WYSIWYG, Markdown, MindMap... 
                  </p>
                </div>
                <div className="container flex flex-col items-center justify-center px-2">
                  <p className="text-4xl py-2 text-center text-primary-600">
                    Private Writing
                  </p>
                  <p className="text-xl py-2 text-center text-primary-500">
                    RSS & Podcast Client + Personal Wiki on Desktop
                  </p>
                  <p className="text-xl pt-2 text-center text-black">
                    Available for Windows(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">msi</a>), macOS(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">dmg</a>, <a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_x64.app.tar.gz" className="link" target="_blank" rel="noopener noreferrer">app</a>), Linux(<a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">deb</a>, <a href="https://github.com/mdSilo/mdSilo-app/releases/download/app-v0.5.4/mdsilo_0.5.4_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>) and <a href="/app" className="link" target="_blank" rel="noopener noreferrer">Web</a>. 
                  </p>
                  <p className="text-base pt-2 text-center text-slate-500">
                    Local-first, Lightweight Yet Powerful. 
                  </p>
                  <div className="flex flex-wrap items-center justify-center mt-4">
                    <button className="m-2 text-lg text-white text-center bg-slate-700 py-2 px-4 rounded hover:bg-green-400">
                      <a href="https://github.com/mdSilo/mdSilo-app/releases" target="_blank" rel="noopener noreferrer">VERSION  0.5.4</a>
                    </button>
                    <button className="m-2 text-lg text-white text-center bg-slate-500 py-2 px-4 rounded hover:bg-green-600">
                      <a href="/app/demo" target="_blank" rel="noopener noreferrer">Try Online</a>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container flex flex-col items-center justify-center py-4">
                <div 
                  className="container p-4 text-center drop-shadow-lg flex flex-col items-center justify-center" 
                  title="Effient live collaboration"
                >
                  <img className="rounded-md" style={{maxHeight: "280px", maxWidth: "570px"}} src="/live-collaboration.webp"></img>
                  <p className="py-1 text-xs text-center text-black">
                    Effient live collaborative writing and preview... 
                  </p>
                </div>
                <div className="container flex flex-col items-center justify-center px-2">
                  <p className="text-4xl py-2 text-center text-primary-600">
                    Collaborative Writing
                  </p>
                  <p className="text-xl py-2 text-center text-primary-500">
                    Self-host platform with live collaboration
                  </p>
                  <p className="text-xl pt-2 text-center text-black">
                    Support preview Markdown, Mindmap, mermaid, music notes and more.
                  </p>
                  <p className="text-base pt-2 text-center text-slate-500">
                    Easy to deploy with one single executable. 
                  </p>
                  <div className="flex flex-wrap items-center justify-center mt-4">
                    <button className="m-2 text-lg text-white text-center bg-slate-700 py-2 px-4 rounded hover:bg-green-400">
                      <a href="https://github.com/danloh/mdSilo-spc/releases" target="_blank" rel="noopener noreferrer">VERSION  0.1.0</a>
                    </button>
                    <button className="m-2 text-lg text-white text-center bg-slate-500 py-2 px-4 rounded hover:bg-green-600">
                      <a href="https://github.com/danloh/mdSilo-spc" target="_blank" rel="noopener noreferrer">Source Code</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8">
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
      </div>
      <Footer className="mt-8" />
    </MainView>
  );
}
