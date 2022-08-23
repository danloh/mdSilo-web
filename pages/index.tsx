import screenShot from 'public/screenshot.webp';
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
                    Available for <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.2/mdsilo_0.4.2_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.2/mdsilo_0.4.2_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.2/mdsilo_0.4.2_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.2/mdsilo_0.4.2_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>.
                  </p>
                </div>
                <div className="flex w-full rounded-md shadow-md mt-4">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 2313 1310"><image id="img-in-svg" xlinkHref={screenShot.src}overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><polygon id="polygon-1" className="shape-effect" points="560 50 560 120 1250 120 1250 50" style={{stroke:'transparent',strokeWidth:3}}><title>Switch between WYSIWYG and Markdown Mode</title> </polygon><polygon id="polygon-2" className="shape-effect" points="1025 230 1025 685 2205 685 2205 230" style={{stroke:'transparent',strokeWidth:3,cursor:'pointer'}}onClick={()=> window.open('https://github.com/mdSilo/mdSilo/releases', '_blank')}><title>Get Application</title> </polygon><polygon id="polygon-3" className="shape-effect" points="640 205 640 650 1200 650 1200 205" style={{stroke:'transparent',strokeWidth:3}}> <title>Generate TOC Automatically for you</title> </polygon><polyline id="polyline-4" className="shape-effect" points="110 220 110 620 500 620 500 250" style={{stroke:'transparent',strokeWidth:3}}> <title>Sort Writings</title></polyline><polygon id="polygon-5" className="shape-effect" points="100 640 100 1300 520 1300 520 640" style={{stroke:'transparent',strokeWidth:3}}><title>Organize writing</title> </polygon><polygon id="polygon-6" className="shape-effect" points="650 750 650 1300 2205 1300 2205 750" style={{stroke:'transparent',strokeWidth:3}}> <title>Writing and formatting Toolkits: Slash Commands, Hovering Toolbar, Hotkeys...</title></polygon><polygon id="polygon-7" className="shape-effect" points="1860 50 1860 120 2300 120 2300 50" style={{stroke:'transparent',strokeWidth:3,cursor:'pointer'}}onClick={()=> window.open('https://mdsilo.com/writing', '_blank')}><title>Try out more features</title></polygon><polygon id="polygon-8" className="shape-effect" points="10 205 10 260 80 260 80 205" style={{stroke:'transparent',strokeWidth:3}}><title>Start writing</title> </polygon><polygon id="polygon-9" className="shape-effect" points="10 275 10 330 80 330 80 275" style={{stroke:'transparent',strokeWidth:3}}> <title>Chronicle view</title> </polygon><polygon id="polygon-10" className="shape-effect" points="10 345 10 400 80 400 80 345" style={{stroke:'transparent',strokeWidth:3}}> <title>Graph view</title> </polygon><polygon id="polygon-11" className="shape-effect" points="350 15 350 75 450 75 450 15" style={{stroke:'gray',strokeWidth:3}}> <title>Light and Dark Mode Support</title> </polygon></svg>
                </div>
                <h2 className="text-4xl font-bold text-center my-6">
                  Try Out Here 
                </h2>
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
