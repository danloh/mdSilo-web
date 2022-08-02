import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import DemoEditor from './DemoEditor';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar withText={true} />
            <div className="container">
              <div className="p-4">
                <div className="container text-xl px-2 text-center">
                  <p className="text-4xl pt-3 text-center text-primary-500">
                    Hello, welcome to mdsilo.
                  </p>
                  <p className="text-md pt-3 text-center">
                    Buffering for your daily I/O 
                  </p>
                  <p className="text-xl py-3 text-center">
                    Available for <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>.
                  </p>
                </div>
                <div className="flex flex-1 w-full lg:w-2/3 mx-auto pt-2 drop-shadow-lg">
                  <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                    <DemoEditor defaultValue={defaultValue} autoFocus={true} dark={false} />
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
Lightweight **knowledge silo** and networked-writing tool equipped with ==WYSIWYG Markdown editor and reader==. Use it to organize writing, network thoughts and build a Second Brain on top of local plain text Markdown files.

## Features
  - 📝 WYSIWYG Markdown Editor: Table, Math, Code block, Wiki Link...  
  - 🔀 Seamless switch between WYSIWYG and raw Markdown
  - ⌨️ Slash commands, Hotkeys and Hovering toolbar...   
  - 🕸️ Graph view to visualize the networked writing  
  - 📅 Chronicle view and Daily activities tracker  
  - 🔍 Full-text search 
  - ✨ Available for Windows, macOS, Linux and Web  

:::info
You can [Get the application here](https://github.com/mdSilo/mdSilo/releases), less than 10Mb.
:::

For human brain, Reading and Writing is the I/O: the communication between the information processing system and the outside world. mdSilo is here to boost your daily I/O, it is tiny yet powerful, free and open source. Please [get the application here](https://github.com/mdSilo/mdSilo/releases), or start [writing on web](https://mdsilo.com/writing/)... #Tips# 
\\
`;
