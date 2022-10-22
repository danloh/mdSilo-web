/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import DemoEditor from 'editor/DemoEditor';


export default function Home() {
  const caseList = useMemo(() => [
    'Demo', 'Shortcuts', 'Table', 'MathCode', 'Diagram', 'Charts', 'ABCNotation', 'Image', 
    'Mindmap', 'Writing', 'etc.'
  ], []); 
  const [caseTab, setCaseTab] = useState('Demo');
  const [isMounted, setMounted] = useState(false);
  useEffect(()=>{
    if (isMounted) return;
    const hash = (window && window.location.hash)?.split('#')[1] || 'Demo';
    if (hash && caseList.includes(hash)) {
      setCaseTab(hash);
    }
    return () => {
      setMounted(true);
    }
  }, [caseList, isMounted]);

  const demoClass = "flex flex-1 w-full lg:w-4/5 mx-auto p-2 drop-shadow-lg";

  return (
    <MainView showNavbar={false} showFooter={false}>
      <Head>
        <title>Playground - mdSilo</title>
      </Head>
      <div className="flex flex-col min-h-screen splash-bg">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm bg-gradient-to-r from-slate-600 via-gray-600 to-stone-600">
            <Navbar withText={true} />
            <div className="container">
              <div className="p-4">
                <div className="flex flex-row flex-wrap items-center justify-center overflow-auto mt-4">
                  {caseList.map((c, idx) => { return (
                    <button 
                      key={idx} 
                      className={`m-1 bg-slate-500 p-1 rounded hover:bg-green-500 text-white ${c === caseTab ? 'bg-gray-500' : ''}`}
                      onClick={() => setCaseTab(c)}
                    >
                      {c}
                    </button>
                  )})}
                </div>
                {caseTab === 'Demo' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="demo" defaultValue={defaultValue} />
                    </div>
                  </div>
                ) : caseTab === 'Shortcuts' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="shortcuts" defaultValue={shortcutsValue} />
                    </div>
                  </div>
                ) : caseTab === 'Table' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="table" defaultValue={tableValue} />
                    </div>
                  </div>
                ) : caseTab === 'MathCode' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="codemath" defaultValue={codeValue} />
                    </div>
                  </div>
                ) : caseTab === 'Diagram' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="diagram" defaultValue={diagramValue} />
                    </div>
                  </div>
                ) : caseTab === 'Charts' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="charts" defaultValue={chartsValue} />
                    </div>
                  </div>
                ) : caseTab === 'ABCNotation' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="abc" defaultValue={abcValue} />
                    </div>
                  </div>
                ) : caseTab === 'Image' ? (
                  <div className={demoClass}>
                    <div className="flex-1 bg-white overflow-auto px-8 py-2 rounded">
                      <DemoEditor key="img" defaultValue={imgValue} />
                    </div>
                  </div>
                ) : caseTab === 'Mindmap' ? (
                  <div className={demoClass}>
                    <img src="/mindmap.svg"></img>
                  </div>
                ) : caseTab === 'Writing' ? (
                  <div className={demoClass}>
                    <img src="/wnf.webp"></img>
                  </div>
                ) : (
                  <div className={`${demoClass} flex-col`}>
                    <h2 className="text-white text-2xl text-center my-2">
                      Connect everything in the context 
                    </h2>
                    <p className="text-md text-center text-white">
                      Visualize the networked thoughts, Get further inspiration. 
                    </p>
                    <div title="Local graph of linked thoughts">
                      <img className="rounded-md" src="/graph.webp"></img>
                    </div>
                    <h2 className="text-white text-2xl text-center mb-2 mt-4">
                      Write locally, and in version control   
                    </h2>
                    <p className="text-md text-center text-white">
                      You can sync your writing to GitHub using git or any other version control services you trust. 
                    </p>
                    <div title="Daily Activities recorded locally">
                      <img className="rounded-md" src="/activity.webp"></img>
                    </div>
                    <p className="text-sm text-center text-white">
                      Count daily activities locally. 
                    </p>
                  </div>
                )}
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
Lightweight **knowledge silo** and networked-writing tool equipped with ==WYSIWYG Markdown editor and reader==. You can use it to organize writing, network thoughts and build a ==Second Brain on top of local plain text Markdown files==.

## Features
  - 📝 All-In-One Editor: Markdown and extensions(Table, Math...), Diagram, Echarts, MindMap...  
  - 🔀 Seamlessly switch between WYSIWYG, raw Markdown and Mind map   
  - 🗄️ Build personal wiki with bidirectional links  
  - ⌨️ Slash commands, Hotkeys and Hovering toolbar...   
  - 🕸️ Graph view to visualize the networked writing 
  - ✔️ Task view to track todo/doing/done   
  - 📅 Chronicle view and Daily activities graph    
  - 🔍 Full-text search 
  - 🔒 Write directly with local Markdown files, entirely offline 
  - 🌓 Dark and light mode 
  - ✨ Available for Windows, macOS, Linux and Web  

## Get Application

:::info
You can [Get the application here](https://github.com/mdSilo/mdSilo/releases), 10Mb only.
Benefited from Tauri(Rust), mdSilo is lightweight and fast.  
:::

### Try it out here  

For human brain, Reading and Writing is the I/O: the communication between the information processing system and the outside world. mdSilo is here to boost your daily I/O, it is tiny yet powerful. Please [get the application here](https://github.com/mdSilo/mdSilo/releases), or start [writing on web](https://mdsilo.com/writing/)... #Tips# 

### Road map

- Markdown
  - [X] Style: **Bold**, *Italic*, ~~Strikethrough~~, \`Inline Code\`
  - [X] Link: [mdSilo](https://mdsilo.com) and <https://mdsilo.com>, 
  - [X] Image: \`![]()\` 
  - [X] Headings and TOC, 
  - [X] List item: ordered list, bullet list, check list and nested list
  - [X] Table
  - [X] Blockquotes  
  - [X] Horizontal Rules 

- Markdown extension
  - [X] more style: \`==mark==\`, \`__underline__\`, \`1^sup^\`, \`H&sub&\`   
    - [X] e.g. 1^st^: 2H&2& + O&2& = 2H&2&O 
  - [X] Highlight code block  
  - [X] Math and Chemical equation: inline \`$\\LaTeX$\` and block \`$$\\LaTeX$$\` 
  - [X] Notice block: info, warning, tips 
  - [X] Wikilink: \`[[]]\` 
  - [X] Hashtag: \`#tag#\` 
  - [X] Diagram: mermaid, echarts, abc notation  

- Writing and formatting 
  - [X] WYSIWYG, raw mode and mindmap mode 
  - [X] Slash commands  
  - [X] Hovering toolbar
  - [X] hotkeys 
  - [X] Split view

- View
  - [X] Graph
  - [X] Task
  - [X] Chronicle 

- Organize writings
  - [X] Folder management 
  - [X] Backlinks 
  - [X] Recent history 
  - [ ] Export as PDF,HTML, ... 
  - [ ] Version control: git integration 

See more here:  

[https://trello.com/b/xzIFkNGb/mdsilo-roadmap](https://trello.com/b/xzIFkNGb/mdsilo-roadmap) 
`;

const diagramValue = `Type \`\`\`\` \`\`\`mermaid \`\`\`\` to add text-to-diagram block. 

- Flowchart

\`\`\`mermaid
flowchart LR
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]
\`\`\` 

- Sequence

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\`\`\` 
 
- Gantt

\`\`\`mermaid
gantt
dateFormat  YYYY-MM-DD
title GANTT Diagram
excludes weekdays 2022-01-10

section A section
Completed task            :done,    des1, 2022-01-06,2022-01-08
Active task               :active,  des2, 2022-01-09, 3d
Future task               :         des3, after des2, 5d
Future task2               :         des4, after des3, 5d
\`\`\` 

Powered by [mermaidjs](https://mermaid-js.github.io).
`;

const chartsValue = `Type \`\`\`\` \`\`\`echarts \`\`\`\` to add text-to-chart block. 
- Display Chart  

\`\`\`echarts
{
  "title": { "text": "Last 30 days" },
  "tooltip": { "trigger": "axis", "axisPointer": { "lineStyle": { "width": 0 } } },
  "legend": { "data": ["Post", "User", "Reply"] },
  "xAxis": [{
      "type": "category",
      "boundaryGap": false,
      "data": ["2022-05-08","2022-05-09","2022-05-10","2022-05-11","2022-05-12","2022-05-13","2022-05-14","2022-05-15","2022-05-16","2022-05-17","2022-05-18","2022-05-19","2022-05-20","2022-05-21","2022-05-22","2022-05-23","2022-05-24","2022-05-25","2022-05-26","2022-05-27","2022-05-28","2022-05-29","2022-05-30","2022-05-31","2022-06-01","2022-06-02","2022-06-03","2022-06-04","2022-06-05","2022-06-06","2022-06-07"],
      "axisTick": { "show": false },
      "axisLine": { "show": false }
  }],
  "yAxis": [{ "type": "value", "axisTick": { "show": false }, "axisLine": { "show": false }, "splitLine": { "lineStyle": { "color": "rgba(0, 0, 0, .38)", "type": "dashed" } } }],
  "series": [
    {
      "name": "Post", "type": "line", "smooth": true, "itemStyle": { "color": "#d23f31" }, "areaStyle": { "normal": {} }, "z": 3,
      "data": ["18","14","22","9","12","18","10","12","13","16","36","19","15","25","12","15","8","14","19","10","29","22","14","22","9","10","15","9","19","15","35"]
    },
    {
      "name": "User", "type": "line", "smooth": true, "itemStyle": { "color": "#f1e05a" }, "areaStyle": { "normal": {} }, "z": 2,
      "data": ["31","33","30","23","16","29","23","37","41","29","16","43","39","23","38","136","89","35","22","50","57","47","36","59","34","23","46","44","51","43","50"]
    },
    {
      "name": "Reply", "type": "line", "smooth": true, "itemStyle": { "color": "#4285f4" }, "areaStyle": { "normal": {} }, "z": 1,
      "data": ["35","42","73","25","43","58","55","35","46","87","36","55","44","76","130","73","50","20","21","54","48","73","60","89","26","27","70","63","55","37","70"]
    }
  ]
}
\`\`\` 

- Powered by [echartsjs](https://echarts.apache.org/examples/en/index.html).  
`;

const abcValue = `
Type \`\`\`\` \`\`\`abcjs \`\`\`\` to add music notation block. 

- Display the music notation and lyrics 

\`\`\`abcjs
X:1901
T:Auld Lang Syne
C:Trad. Words by Burns.
O:Scotland
Z:Paul Hardy. Creative Commons cc by-nc-sa licenced.
M:4/4
L:1/8
K:D
V:1
%%MIDI program 23 % Tango Accd.
A,2|"D"D3 D D2 F2|"A"E3 D E2 F2|"D"D3 D F2 A2|"G"B6|
w:Should auld ac-quain-tance be for-got, and nev-er brought to mind?
B2|"D"A3 F F2 D2|"A"E3 D E2 F2|"G"D3 B, B,2 A,2|"D"D6||
w:should auld ac-quain-tance be for-got, In days of auld lang syne?
V:2
%%MIDI program 73 % Flute
a2|a,3 a, a,2 d2|c3 d c2 c2|A3 A d2 d2|d6|
d2|d3 d d2 d2|c3 d c2 d2|B3 G G2 G2|F6||
V:1
"^Chorus"B2|"D"A3 F F2 D2|"A"E3 D E2 B2|"D"A3 F F2 A2|"G"B6|
w:For auld_ lang_ syne my dear for auld_ lang_ syne.
D2|"D"A3 F F2 D2|"A"E3 D E2 F2|"G"D3 B, B,2 A,2|"D"D6|]
w:We'll tak' a cup o' kind-ness yet for auld_ lang_ syne.
V:2
d2|d4 d4|c3 B c2 g2|f3 d d4|d6|
d2|d3 d d2 A2|A3 A A2 ^A2|B3 F G4|F6|]
W:
W:We two hae run a-bout the braes, and pu'd the go-wans fine,
W:We've wan-dered mony a wea-ry foot, sin' auld_ lang_ syne.
W:
W:We two hae paid-elt in the burn, frae morn-in sun till dine,
W:But seas be-tween us braid hae roared, sin' auld_ lang_ syne.
W:
W:And here's a hand, my trus-ty fiere, and gis a hand o' thine,
W:We'll tak' a richt gude wil-lie waught, For auld_ lang_ syne.
W:
W:And sure-ly ye'll be your pint-stoup, and sure-ly I'll be mine,
W:We'll tak' a cup of kind-ness yet, for sake of auld lang syne.
\`\`\`

- Play the MIDI. 
- Powered by [abcjs](https://paulrosen.github.io/abcjs/). 
`;

const shortcutsValue = `
## Markdown Shortcuts

- Style: **Bold**, *Italic*, ==mark==, __underline__, ~~Strike through~~, \`Inline Code\` 
- Link: [mdSilo](https://mdsilo.com) and <https://mdsilo.com>, 
- Headings and Table of Contents, 
- List items: ordered list, bullet list, check list and nested list
- Table, Block quotes, Horizontal Rules.

### List Items

#### Bullet List

* Type \`-\` or \`*\` to create bullet list(unordered list).
* Nested list is supported. 
  - This is nested list item. 
  - \`Mod + [ or ] \` can lift or sink the nested list item.
* \`Enter\` to add more list item.
* \`Alt + ArrowUp or ArrowDown\` can move list item up or down.

#### Numbered List

1. Type \`1.\` to create numbered list(ordered list).  
2. Nested numbered list is supported.  


#### Check List(Task List)

- [X] Type \`[]\` to create Check list. 
- [X] Support nested Check list too.  
- [X] Main task.
  - [X] Sub task.
- [X] Support drag and move.

## Markdown Extensions 

- Highlight code block  
- Math: inline math \`$LaTeX$\` and math block \`$$LaTeX$$\`. 
- Notice block: info, warning, tips. 
- Wiki Link: \`[[]]\`. 
- Hashtag: \`#tag#\` #tips# 
- Diagram: mermaid, echarts, ABC Notation. 

## Quick Action

- Type \`/\` to trigger slash commands
- Insert current date, time or datetime using \`/date\`, \`/time\`, \`/now\` and a space.
`;

const tableValue = `
* Insert table by typing \`/table\` and then select Table command;
* You can resize table via floating toolbar;

| Features | mdSilo | Note | Pricing |
|----|:----:|----|---:|
| Mode | Yes | Raw Markdown mode, WYSIWYG mode, Mindmap mode | Free |
| Writing | Yes | Slash Commands, Hovering Toolbar, Hotkeys | Free |
| Linking | Yes | BackLinks, Mentions | Free |
| View | Yes | Chronicle, Graph, Task | Free |
| WYSIWYG | Yes | Markdown and extension: Code, Math... | Free |
| Table | Yes | Insert Table, Add or Remove Row or Column | Free |
| Notice | Yes | Information, Tips, Warning | Free |
| Code Fence | Yes | Code Block and Highlight | Free |
| Math | Yes | Math Equation($LaTex$): inline or block | Free |
| Diagram | Yes | mermaid(Flowchart, Sequence...), echarts, ABC Notation | Free |
`;

const codeValue = `
## Code Block

---

* Quickly add code block using the \`\`\` shortcut.
* Insert code block using /code and select Code Block command.

\`\`\`javascript
function main() {
  console.log("Hello World, mdSilo is neat!");
}
\`\`\`

Try to change the language to see the changes on highlight. 

\`\`\`rust
fn main() {
  println!("Hello World, nice mdSilo");
}
\`\`\`

## Math/Chemical Equations

---

* Add inline math using \`$equation$\` or \`Mod-Space\`
* Add math block using \`$$-Space\`.
* Insert using slash command: \`/math\` and select Math Equation command.

> Source code for math equation

\`\`\`
$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
\`\`\`

> Display the math equation

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

* Support chemical equation block with \\ce

$$
\\ce{x Na(NH4)HPO4 ->[\\Delta] (NaPO3)_x + x NH3 ^ + x H2O}
$$

* Support Live preview for Math/Chemical equation block. 
`;

const imgValue = `
- Insert image using \`![caption](image_link)\`

 ![A cat, Image credits: Dorota Dylka@unsplash](https://images.unsplash.com/photo-1456677698485-dceeec22c7fc)

- Insert local image using \`/image\` command. 

- Relative local file path is supported.
`;
