import { useCallback, useState } from 'react';
import MsEditor, { renderToHtml } from "mdsmirror";
import { saveAs } from 'file-saver';
import Title from 'components/note/Title';
import Menubar from 'components/landing/Menubar';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';
import { useStore } from 'lib/store';
import { defaultNote } from 'types/model';
import {nowToRadix36Str } from 'utils/helper';
import { useImportMd } from 'editor/hooks/useImport';

export default function EditorDemo() {
  const [title, setTitle] = useState<string>("Welcome to mdSilo");
  const [md, setMd] = useState<string>(defaultValue);
  const upsertNote = useStore((state) => state.upsertNote);

  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (text: string, json: unknown) => {
      // console.log("on content change", text, json);
      const newNote = {
        ...defaultNote,
        id: 'md-current',
        content: text,
      };
      upsertNote(newNote);
    },
    [upsertNote]
  );

  const onSave = useCallback(async () => {
    const blob = new Blob([md], {
      type: 'text/markdown;charset=utf-8',
    });
    saveAs(blob, `${title}-${nowToRadix36Str()}.md`);
  }, [md, title]);

  const onSaveHTML = useCallback(async () => {
    const mdHTML = renderToHtml(md)
    const html = `<!DOCTYPE html><html><head></head><body>${mdHTML}</body></html>`
    const blob = new Blob([html], {
      type: 'text/html;charset=utf-8',
    });
    saveAs(blob, `${title}-${nowToRadix36Str()}.html`);
  }, [md, title]);

  const onOpen = useImportMd(val => setTitle(val), value => setMd(value));

  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="shadow-sm max-w-3xl mx-auto">
        <Navbar withText={false} />
        <div className="container my-4">
          <Menubar 
            onNew={() => {onSave(); setTitle(''); setMd(' ');}} 
            onOpen={onOpen}
            onSave={onSave}
            onSaveHTML={onSaveHTML}
          />
          <div className="flex-1 min-h-screen px-8 bg-black overflow-auto">
            <Title
              className="py-2"
              initialTitle={title}
              onChange={(newTitle: string) => setTitle(newTitle)}
            />
            <MsEditor 
              dark={true} 
              value={md} 
              onChange={onChange} 
              onOpenLink={(href) => { window.open(href, "_blank");}}
              onShowToast={() => {/* nothing*/}}
            />
          </div>
        </div>
      </div>
    </MainView>
  );
}

const defaultValue = `
:::info
This is an editable document. 
::: 

[mdSilo](https://mdsilo.com/about/) is a lightweight writing tool with WYSIWYG Editor and Markdown support. Open Source and Free. Available for Web, Linux, Windows and macOS. You can get the Desktop application [here](https://github.com/danloh/mdSilo-app/releases) and enjoy more features. 

---

Feel free to edit this document and try out the powerful features: 

* ==Slash Commands== : Typing \`/\` will trigger a list of the commands; 
* ==Hovering Toolbar== : Styling the text when any selected;
* ==Markdown shortcuts== :  **Bold**,  *Italic*, __underline__, \`inline code\`, and more:  

> Quoteblock: typing \`>\` to quote. 

* List: Typing \`-\` or \`*\` or \`1.\` to create list.

- [ ] Checklist: Typing \`[]\` to create todo-list. 

--- 

:::tip
Click top-right menu to new document, open local md file, save changes.
:::

### You can insert tables 

--- 

* Insert table by typing \`/table\` and then select Table command;
* You can add or remove column or row by floating table toolbar;

| Features | mdSilo | Note | Pricing |
|----|----|----|---:|
| WYSIWYG | Yes | Live Preview: Markdown, Code, Math... | Free |
| Writing | Yes | Slash Commands, Hovering Toolbar, Hotkeys  | Free | 
| Table | Yes | Insert Table, Add or Remove Row or Culumn  | Free | 
| Code | Yes | Code Block and Highlight  | Free | 
| Math | Yes | Math Equation($LaTex$): inline or block | Free | 
| Callout | Yes | Information, Tips, Warning  | Free | 

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


![A cat from unsplash](https://images.unsplash.com/photo-1456677698485-dceeec22c7fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2334&q=80)


### More is on the way 

---

- [ ] Linking: Backlink, …
- [ ] Hashtag, 
- [ ] Embed media, web page, local image... 
- [ ] Operations: Open local file, Save, Export...  


### Any questions, feedback or suggestions?

You can follow us on [Twitter](https://twitter.com/mdsiloapp) or go to our [Discord](https://discord.gg/EXYSEHRTFt). We are waiting there for you.


--- 

We would appreciate any support from you! ❤️`;
