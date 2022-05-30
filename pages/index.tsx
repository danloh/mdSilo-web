import MsEditor, { parser, serializer } from "mdsmirror";
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';

export default function Home() {
  const defaultValue = `## Welcome to mdSilo  

[mdSilo](https://mdsilo.com/about/) is a Lightweight note-taking tool with WYSIWYG Editor and Markdown support. Open Source and Free. Available for Web, Linux, Windows and macOS. You can get the Desktop application [here](https://github.com/danloh/mdSilo-app/releases) and enjoy more features. 

---

Feel free to edit this document and try out the powerful features: 

* ==Slash Commands== : Typing \`/\` will trigger a list of the commands; 
* ==Hovering Toolbar== : Styling the text when any selected;
* ==Markdown shortcuts== :  **Bold**,  *Italic*, __underline__, \`inline code\`, and more;

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
Warning: Any changes will not be saved on this page. 
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

  // const docAst = parser.parse(defaultValue);
  // console.log("slice: ", serializer.serialize(docAst.content.content))
  // const jsonDoc = docAst.toJSON();
  // console.log("json: ", jsonDoc);
  // const textDoc = serializer.serialize(docAst);
  // console.log("text: ", textDoc); 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (text: string, json: any) => {console.log("text: ", text, "JSON: ", json)};

  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="shadow-sm max-w-3xl mx-auto">
        <Navbar withText={false} />
        <div className="container my-4">
          <div className="flex-1 px-8 bg-black overflow-auto">
            <MsEditor 
              dark={true} 
              defaultValue={defaultValue} 
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
