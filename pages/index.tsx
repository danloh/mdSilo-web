import { useState } from 'react';
import screenShot from 'public/demo/screenshot.webp';
import toc from 'public/demo/toc.webp';
import table from 'public/demo/table.webp';
import math from 'public/demo/code-math.webp';
import slash from 'public/demo/slash.webp';
import img from 'public/demo/image.webp';
import list from 'public/demo/list.webp';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import DemoEditor from './DemoEditor';

export default function Home() {
  const caseList = ['Demo', 'TOC', 'Writing and Formatting', 'Table', 'Code and Math', 'Image', 'List', 'etc.']; 
  const [caseTab, setCaseTab] = useState('Demo');

  const demoClass = "flex flex-1 w-full lg:w-2/3 mx-auto pt-2 drop-shadow-lg";

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
                    Welcome to mdsilo.
                  </p>
                  <p className="text-md pt-3 text-center">
                    Buffering for your daily I/O 
                  </p>
                  <p className="text-xl py-3 text-center">
                    Available for <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.5/mdsilo_0.4.5_x64_en-US.msi" className="link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.5/mdsilo_0.4.5_x64.dmg" className="link" target="_blank" rel="noopener noreferrer">macOS</a>, <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.5/mdsilo_0.4.5_amd64.deb" className="link" target="_blank" rel="noopener noreferrer">Linux(deb)</a> and <a href="https://github.com/mdSilo/mdSilo/releases/download/app-v0.4.5/mdsilo_0.4.5_amd64.AppImage" className="link" target="_blank" rel="noopener noreferrer">AppImage</a>. 
                  </p>
                  <p className="text-sm text-slate-500 text-center -mt-1">
                    Version: 0.4.5 
                    <a href="https://github.com/mdSilo/mdSilo/releases" className="hover:text-green-100 ml-2" target="_blank" rel="noopener noreferrer">CHANGELOG</a>
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-center my-2">
                  Lightweight, Yet Powerful  
                </h2>
                <div className="flex flex-row flex-wrap items-center justify-center overflow-auto">
                  {caseList.map((c, idx) => { return (
                    <button 
                      key={idx} 
                      className={`m-1 bg-slate-500 p-1 rounded hover:bg-green-500 ${c === caseTab ? 'bg-gray-500' : ''}`}
                      onClick={() => setCaseTab(c)}
                    >
                      {c}
                    </button>
                  )})}
                </div>
                {caseTab === 'Demo' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor defaultValue={defaultValue} autoFocus={true} dark={false} />
                    </div>
                  </div>
                ) : caseTab === 'TOC' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 1682 1468"><image id="img-in-svg" xlinkHref={toc.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><g id="t-plus-0"><circle cx="512" cy="297" r="13.5" style={{fill:'#0284c7',stroke:'#0284c7',strokeWidth:'5px'}}><animate attributeName="opacity" values="1;0.6;1" begin="1s" dur="1.5s" repeatCount="indefinite"></animate></circle><path d="M25 14h-7.37v-7.369h-3.79v7.369h-7.371v3.791h7.371v7.372h3.79v-7.372h7.37z" fill="#fff" transform="translate(499,284) scale(0.8,0.8)"></path><title>Expand or Collapse TOC</title></g><polygon id="t-polygon-1" className="shape-effect" points="200 320 200 970 950 970 950 320" style={{stroke:'transparent',strokeWidth:3}}><title>Auto Generate, Live Update</title></polygon></svg>
                  </div>
                ) : caseTab === 'Writing and Formatting' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 1606 1275"><image id="img-in-svg" xlinkHref={slash.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image></svg>
                  </div>
                ) : caseTab === 'Table' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 1597 1265"><image id="img-in-svg" xlinkHref={table.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><g id="t-plus-0"><circle cx="512" cy="297" r="13.5" style={{fill:'#0284c7',stroke:'#0284c7',strokeWidth:'5px'}}><animate attributeName="opacity" values="1;0.6;1" begin="1s" dur="1.5s" repeatCount="indefinite"></animate></circle><path d="M25 14h-7.37v-7.369h-3.79v7.369h-7.371v3.791h7.371v7.372h3.79v-7.372h7.37z" fill="#fff" transform="translate(499,284) scale(0.8,0.8)"></path><title>Command and Raw Markdown Table support</title></g><polygon id="t-polygon-1" className="shape-effect" points="1065 360 1065 450 1580 450 1580 360" style={{stroke:'transparent',strokeWidth:3}}><title>Styling and Editing Toolbar</title></polygon></svg>
                  </div>
                ) : caseTab === 'Code and Math' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 1707 1513"><image id="img-in-svg" xlinkHref={math.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><polygon id="t-polygon-1" className="shape-effect" points="165 580 165 750 1580 750 1580 580" style={{stroke:'transparent',strokeWidth:3}}></polygon><polygon id="t-polygon-1" className="shape-effect" points="165 1080 165 1500 1580 1500 1580 1080" style={{stroke:'transparent',strokeWidth:3}}></polygon></svg>
                  </div>
                ) : caseTab === 'Image' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 2048 1620"><image id="img-in-svg" xlinkHref={img.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><g id="t-plus-0"><circle cx="782" cy="1590" r="15" style={{fill:'red',stroke:'red',strokeWidth:'5px'}}><animate attributeName="opacity" values="1;0.6;1" begin="1s" dur="1.5s" repeatCount="indefinite"></animate></circle><circle cx="782" cy="1590" r="8" fill="#fff"></circle><title>Caption here</title></g></svg>
                  </div>
                ) : caseTab === 'List' ? (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 2046 1700"><image id="img-in-svg" xlinkHref={list.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><g id="t-plus-0"><circle cx="450" cy="1400" r="15" style={{fill:'red',stroke:'red',strokeWidth:'5px'}}><animate attributeName="opacity" values="1;0.6;1" begin="1s" dur="1.5s" repeatCount="indefinite"></animate></circle><circle cx="450" cy="1400" r="8" fill="#fff"></circle><title>Can be nested</title></g></svg>
                  </div>
                ) : (
                  <div className={demoClass}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" viewBox="0 0 2313 1310"><image id="img-in-svg" xlinkHref={screenShot.src} overflow="visible" width="100%" height="100%" xmlnsXlink="http://www.w3.org/1999/xlink"></image><polygon id="polygon-1" className="shape-effect" points="560 50 560 120 1250 120 1250 50" style={{stroke:'transparent',strokeWidth:3}}><title>Switch between WYSIWYG and Markdown Mode</title></polygon><polygon id="polygon-2" className="shape-effect" points="1025 230 1025 685 2205 685 2205 230" style={{stroke:'transparent',strokeWidth:3,cursor:'pointer'}}onClick={()=> window.open('https://github.com/mdSilo/mdSilo/releases', '_blank')}><title>Get Application</title> </polygon><polygon id="polygon-3" className="shape-effect" points="640 205 640 650 1200 650 1200 205" style={{stroke:'transparent',strokeWidth:3}}><title>Generate TOC Automatically for you</title></polygon><polyline id="polyline-4" className="shape-effect" points="110 220 110 620 500 620 500 250" style={{stroke:'transparent',strokeWidth:3}}><title>Sort Writings</title></polyline><polygon id="polygon-5" className="shape-effect" points="100 640 100 1300 520 1300 520 640" style={{stroke:'transparent',strokeWidth:3}}><title>Organize writing</title> </polygon><polygon id="polygon-6" className="shape-effect" points="650 750 650 1300 2205 1300 2205 750" style={{stroke:'transparent',strokeWidth:3}}> <title>Writing and formatting Toolkits: Slash Commands, Hovering Toolbar, Hotkeys...</title></polygon><polygon id="polygon-7" className="shape-effect" points="1860 50 1860 120 2300 120 2300 50" style={{stroke:'transparent',strokeWidth:3,cursor:'pointer'}}onClick={()=> window.open('https://mdsilo.com/writing', '_blank')}><title>Try out more features</title></polygon><polygon id="polygon-8" className="shape-effect" points="10 205 10 260 80 260 80 205" style={{stroke:'transparent',strokeWidth:3}}><title>Start writing</title> </polygon><polygon id="polygon-9" className="shape-effect" points="10 275 10 330 80 330 80 275" style={{stroke:'transparent',strokeWidth:3}}> <title>Chronicle view</title> </polygon><polygon id="polygon-10" className="shape-effect" points="10 345 10 400 80 400 80 345" style={{stroke:'transparent',strokeWidth:3}}> <title>Graph view</title> </polygon><polygon id="polygon-11" className="shape-effect" points="350 15 350 75 450 75 450 15" style={{stroke:'transparent',strokeWidth:3}}> <title>Light and Dark Mode Support</title> </polygon></svg>
                  </div>
                )}
                {/* <div className="container px-6 text-center">
                  <video
                    className="mx-auto mt-8 rounded-md md:mt-16 shadow-popover bg-gray-50"
                    width={1200}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src="/demo/demo.mp4" type="video/mp4" />
                  </video>
                </div> */}
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
  - 📝 WYSIWYG Markdown Editor: Table, Math, Code block, Hashtag...  
  - 🔀 Seamless switch between WYSIWYG and raw Markdown 
  - 🗄️ Build personal wiki with bidirectional links  
  - ⌨️ Slash commands, Hotkeys and Hovering toolbar...   
  - 🕸️ Graph view to visualize the networked writing 
  - ✔️ Task view to track todo/doing/done   
  - 📅 Chronicle view and Daily activities graph    
  - 🔍 Full-text search 
  - 🔒 Write directly with local Markdown files, entirely offline 
  - ✨ Available for Windows, macOS, Linux and Web  

## Get Application

:::info
You can [Get the application here](https://github.com/mdSilo/mdSilo/releases), less than 10Mb.
:::

### Try it out here  

For human brain, Reading and Writing is the I/O: the communication between the information processing system and the outside world. mdSilo is here to boost your daily I/O, it is tiny yet powerful. Please [get the application here](https://github.com/mdSilo/mdSilo/releases), or start [writing on web](https://mdsilo.com/writing/)... #Tips# 

### Road map

See more here:  

[https://trello.com/b/xzIFkNGb/mdsilo-roadmap](https://trello.com/b/xzIFkNGb/mdsilo-roadmap) 
`;
