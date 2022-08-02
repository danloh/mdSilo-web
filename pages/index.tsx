import Image from 'next/image';
import screenshot from 'public/screenshot.svg';
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
                    Available for <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.1/mdsilo_0.4.1_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>.
                  </p>
                </div>
                <div className="flex w-full rounded-md shadow-md mt-4">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 2313 1310"><image id="img-in-svg" xlinkHref={screenShot.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><path id="star-0" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" transform="translate(24,332) scale(2,2)" className="circle-effect" style={{fill:'#f2ca2d',stroke:'#f2ca2d',cursor:'pointer'}}><title>View Your writing in different way: Chronicle, Graph, Sorted List...</title></path><polygon  id="polygon-1" className="shape-effect" points=" 880 290 880 440 1020 440 1020 290" style={{stroke:'#000000',strokeWidth:'14',cursor:'pointer'}}><title>Light Mode and Dark mode may work to decrease eye strain and dry eye</title></polygon><polygon id="polygon-2" className="shape-effect" points=" 398 45 398 105 1245 105 1245 45" style={{stroke:'transparent',strokeWidth:'2',cursor:'pointer'}}><title>WYSIWYG and Raw Mode: Seamless switch between both mode.</title></polygon><polygon id="polygon-3" className="shape-effect" points=" 1150 252 1150 480 1818 480 1818 252" style={{stroke:'transparent',strokeWidth:'2',cursor:'pointer'}} onClick={() => window.open('https://github.com/mdSilo/mdSilo/releases', '_blank')}><title>Get Application</title></polygon><polygon id="polygon-4" className="shape-effect" points=" 1088 894 1082 1220 1943 1220 1911 896" style={{stroke:'transparent'}}><title>Features: Markdown, Table, Math, Image, WikiLink...</title></polygon><polygon id="polygon-5" className="shape-effect" points=" 1345 528 1356 843 2065 852 2035 535" style={{stroke:'transparent'}}><title>Writing / Formatiing Toolkit: Slash Commands, Hovering Toolbar, Hotkeys....</title></polygon><polygon id="polygon-6" className="shape-effect" points=" 450 960 450 1270 850 1270 850 960" style={{stroke:'transparent'}}><title>On Table: You can add/remove row or column easily</title></polygon><polygon id="polygon-7" className="shape-effect" points=" 447 599 447 754 882 769 886 609" style={{stroke:'transparent'}}><title>List Support: Numbered List, Bullet List, Check List and Nested List....</title></polygon><polygon id="polygon-8" className="shape-effect" points=" 435 164 435 275 903 275 903 164" style={{stroke:'transparent'}}><title>TOC: Generate Table of Contents automatically for you</title></polygon></svg>
                </div>
                <h2 className="text-4xl font-bold text-center my-6">
                  Just Try Out Here 
                </h2>
                <div className="flex flex-1 w-full lg:w-2/3 mx-auto pt-2 drop-shadow-lg h-min-screen">
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
