
# mdSilo

A local-first mind silo for storing ideas, thought, knowledge with a powerful writing tool,
running fully in the browser. 

[Web App](https://mdsilo.com/app)   
[Demo](https://mdsilo.com/app/demo)    
[Discord](https://discord.gg/EXYSEHRTFt) 

## Features

- All-In-One Editor: Markdown, WYSIWYG, MindMap... 
- Markdown and extensions: Diagram, Table, Math/Chemical, Code block(Highlight)...   
- Slash commands, Hovering toolbar, hotkeys and more toolkits...   
- Chronicle view, Graph view, Task view... 
- Full-text search; 
- Dark and Light Mode  
- PWA  
- On top of local plain-text files. No install required, no registration required, no privacy issue. 

If your browser doesn't support local file system APIs, you'll still be able to open individual local files or import JSON file exported from mdsilo desktop app. 

Since mdSilo Web app is running completely within the browser, some experiences will naturally be more constrained, when compared to the desktop app. For example, we cannot attach local images or files, no relative path to image/file support and no folder management. 

Howerver, we can also benefit from the browser environment, for example, we can export our writing to PDF via the `Print` in browser and we can run mdsilo on mobile as mdsilo web is also a PWA(Progressive Web App). 

And, BTW, [Desktop App is here](https://github.com/mdSilo/mdSilo/releases) 

## Tech Stack

- Editor Framework: [ProseMirror](https://prosemirror.net/)      
- Frontend Framework: [React](https://reactjs.org/) and [Nextjs](https://nextjs.org/)

## Road map 

- Markdown
  - [X] Style: **Bold**, *Italic*, ~~Strikethrough~~, `Inline Code`
  - [X] Link: [mdSilo](https://mdsilo.com) and <https://mdsilo.com>, 
  - [X] Image: `![]()`   
  - [X] Headings and TOC, 
  - [X] List item: ordered list, bullet list, check list and nested list
  - [X] Table
  - [X] Blockquotes  
  - [X] Horizontal Rules 

- Markdown extension
  - [X] more style: `==mark==`, `__underline__`, `1^sup^`
  - [X] Highlight code block  
  - [X] Math and Chemical Equation: inline `$\KaTeX$` and block `$$\LaTeX$$` 
  - [X] Notice block: info, warning, tips 
  - [X] Wikilink: `[[]]` 
  - [X] Hashtag: `#tag#` 
  - [X] Diagram: mermaid, echarts, music notation... 
  - [X] Embed web page: YouTube, Figma... 

- Writing, formatting and drawing 
  - [X] WYSIWYG, Markdown, MindMap and Split view 
  - [X] Slash commands  
  - [X] Hovering toolbar
  - [X] hotkeys 
  - [ ] Drawing  

- View
  - [X] Graph
  - [X] Task
  - [X] Chronicle 

- Organize writings
  - [X] Folder management 
  - [X] Backlinks 
  - [X] Recent history 
  - [ ] Block reference  
  - [ ] Flashcards 
  - [ ] Export as PDF,HTML, ... 
  - [ ] Version control: git integration 

- Cross-Platform 
  - [x] Windows, macOS, Linux. 
  - [X] Web: https://mdsilo.com/app/ 
  - [ ] Mobile: iOS/iPadOS and Android(soon...)


## Any questions, feedback or suggestions?

You can follow us on [Twitter](https://twitter.com/mdsiloapp) or go to our [Discord](https://discord.gg/EXYSEHRTFt). We are waiting there for you.
