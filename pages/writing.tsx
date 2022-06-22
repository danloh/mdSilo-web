import MainView from 'components/landing/MainView';
import Navbar from 'components/landing/Navbar';
import DemoEditor from './DemoEditor';

export default function WritingDemo() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className={`shadow-sm max-w-3xl mx-auto`}>
        <Navbar withText={false} />
        <DemoEditor 
          defaultValue={defaultValue}
          defaultTitle="Welcome to mdSilo"
          className="flex-1 min-h-screen px-8 bg-black overflow-auto"
        />
      </div>
    </MainView>
  );
}

const defaultValue = `
:::info
This is an editable document. 
::: 

[mdSilo](https://mdsilo.com/about/) is a lightweight writing tool with WYSIWYG Markdown Editor, Open Source and Free. Available for Web, Linux, Windows and macOS. You can [get the Desktop application here](https://github.com/mdSilo/mdSilo/releases) and enjoy more features. 

---

### WYSIWYG Markdown editor and reader  

Feel free to edit this document and check out the powerful features: 

* ==Slash Commands== : Typing \`/\` will trigger a list of the commands; 
* ==Hovering Toolbar== : Styling the text when any selected;
* ==Markdown shortcuts== :  **Bold**,  *Italic*, __underline__, \`inline code\`, and more.  

> Quoteblock: typing \`>\` to quote. 

* Numbered List, Bullet List and nested list: Typing \`-\` or \`*\` or \`1.\` to create list.
  1. This is the first nested list item 
  - This is another nested list item 

* use Task List to track your todo-list: Typing \`[]\` to create task list.  
  - [ ] todo-1 
  - [x] done-1 
  - [ ] the list items are dragable, just click, hold and drag to organize your taks. #Tips# 
    - [ ] Click
    - [ ] Hold
    - [ ] Drag to wherever you want 

* use \`#Hashtag#\` to tag your writing. #Tips# 
* use [[Wiki Link]] to connect your writing together. 
--- 

:::tip
Click top menu to new document, open local md file, save changes.
:::

### You can insert tables 

--- 

* Insert table by typing \`/table\` and then select Table command;
* You can add or remove column or row by floating table toolbar;

| Features | mdSilo | Note | Pricing |
|----|----|----|---:|
| WYSIWYG | Yes | Live Preview: Markdown, Code, Math... | Free |
| Writing | Yes | Slash Commands, Hovering Toolbar, Hotkeys  | Free | 
| Table | Yes | Insert Table, Add or Remove Row or Column  | Free | 
| Code | Yes | Code Block and Highlight  | Free | 
| Math | Yes | Math Equation($LaTex$): inline or block | Free | 
| Hashtag | Yes | To Tag your writing  | Free | 
| Wiki Link | Yes | To network your writing  | Free | 
| Call-out | Yes | Information, Tips, Warning  | Free | 

### You can insert code 

- Quickly add code using the \`\`\` shortcut;
- Insert code using /code and select Code Block command;


\`\`\`javascript
function main() {
  console.log("Hello World");
}
\`\`\`  

Try to change the language to see the changes on highlight. 

\`\`\`rust
fn main() {
  let greetings = [
    "Hello", "Hola", "Bonjour","Ciao", "こんにちは", "안녕하세요","Cześć", "Olá", 
    "Здравствуйте","Chào bạn", "您好", "Hallo","Hej", "Ahoj", "سلام","สวัสดี"
  ];

  for (num, greeting) in greetings.iter().enumerate() {
      print!("{} : ", greeting);
      match num {
          0 =>  println!("This code is editable and runnable!"),
          1 =>  println!("¡Este código es editable y ejecutable!"),
          2 =>  println!("Ce code est modifiable et exécutable !"),
          3 =>  println!("Questo codice è modificabile ed eseguibile!"),
          4 =>  println!("このコードは編集して実行出来ます！"),
          5 =>  println!("여기에서 코드를 수정하고 실행할 수 있습니다!"),
          6 =>  println!("Ten kod można edytować oraz uruchomić!"),
          7 =>  println!("Este código é editável e executável!"),
          8 =>  println!("Этот код можно отредактировать и запустить!"),
          9 =>  println!("Bạn có thể edit và run code trực tiếp!"),
          10 => println!("这段代码是可以编辑并且能够运行的！"),
          11 => println!("Dieser Code kann bearbeitet und ausgeführt werden!"),
          12 => println!("Den här koden kan redigeras och köras!"),
          13 => println!("Tento kód můžete upravit a spustit"),
          14 => println!("این کد قابلیت ویرایش و اجرا دارد!"),
          15 => println!("โค้ดนี้สามารถแก้ไขได้และรันได้"),
          _ =>  {},
      }
  }
}
\`\`\` 


### You can insert math equations 

--- 

- Quickly add inline math using the \`$\` and math block using \`$$\` ;
- Insert $\\LaTeX$ equations using /math and select Math Equation command;


$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$


### You can insert callout 

--- 

There are three types of editable blocks that can be used to callout information:

:::info
Information: A WYSIWYG Markdown editor 
::: 

:::tip
Tip: Feel free to edit this page
:::

:::warning
Warning: Any changes will not be saved automatically. 
:::


### You can insert image 

--- 

- Insert using \`![caption](image_link)\`


![A cat, Image credits: Dorota Dylka@unsplash](https://images.unsplash.com/photo-1456677698485-dceeec22c7fc)


## Install mdSilo

mdSilo is available for Web, Linux, Windows and macOS. 

You can write on [mdsio.com](https://mdsilo.com/writing) entirely in your web browser. And mdSilo web app is also a PWA (Progressive Web App). This means that you can install it on your desktop or mobile, just add it to youre Home Screen. 

You can get the Desktop Application for Windows, macOS, Linux: [download here](https://github.com/mdSilo/mdSilo/releases), it is lightweight and powerful. 


### More is on the way 

---

- [ ] Linking: Backlink, …
- [ ] Hashtag, 
- [ ] Embed media, web page, local image... 


### Any questions, feedback or suggestions?

You can follow us on [Twitter](https://twitter.com/mdsiloapp) or go to our [Discord](https://discord.gg/EXYSEHRTFt). We are waiting there for you.


--- 

We would appreciate any support from you! ❤️`;
