import { useCallback, useState, useEffect, useRef } from 'react';
import MsEditor, { renderToHtml, embeds } from "mdsmirror";
import { RawMark } from "mdkit-mdmark";
import { parseMd, transform, markmap } from "mdkit-mdmap";
import { saveAs } from 'file-saver';
import Title from 'components/note/Title';
import Toc, { Heading } from 'components/note/Toc';
import Menubar from 'components/landing/Menubar';
import { useStore } from 'lib/store';
import { defaultNote } from 'types/model';
import {nowToRadix36Str } from 'utils/helper';
import { useImportMd } from 'editor/hooks/useImport'; 

type MapProps = {
  mdValue: string;
  className?: string;
};

export function Mindmap(props: MapProps) {
  const { mdValue, className='' } = props;
  const svgRef = useRef<SVGSVGElement | null>(null);

  const renderSVG = useCallback(() => {
    if (!svgRef.current || !mdValue.trim()) { return; }

    const data = transform(parseMd(mdValue, {}));
    markmap(svgRef.current, data, {
      preset: 'colorful', // or default
      linkShape: 'diagonal' // or bracket
    });
  }, [mdValue]);

  useEffect(() => {
    if (!svgRef.current) { return; }

    renderSVG();
  }, [renderSVG]);

  return (
    <div className={`w-full h-full bg-slate-100 ${className}`}>
      <svg
        id="mindmap"
        ref={svgRef}
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%" 
      />
    </div>
  );
}

type Props = {
  defaultValue: string;
  defaultTitle?: string;
  autoFocus?: boolean;
  dark?: boolean;
  className?: string;
};

export default function DemoEditor(props: Props) {
  const { defaultValue, defaultTitle = '', autoFocus, dark = false, className = '' } = props;
  const [title, setTitle] = useState<string>(defaultTitle);
  const [md, setMd] = useState<string>(defaultValue);
  const upsertNote = useStore((state) => state.upsertNote);

  const [headings, setHeadings] = useState<Heading[]>([]);
  const editorInstance = useRef<MsEditor>(null);
  const getHeading = () => {
    const hdings = editorInstance.current?.getHeadings();
    // console.log(hdings); 
    setHeadings(hdings ?? []);
  };

  useEffect(() => { 
    getHeading(); 
    // init note in store
    const initNote = {
      ...defaultNote,
      id: 'md-current',
      title: defaultTitle,
      content: defaultValue,
    };
    upsertNote(initNote);
  }, [defaultTitle, defaultValue, upsertNote]); 

  const [rawMode, setRawMode] = useState<string>('md'); // md|raw|mp

  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (text: string, json: unknown) => {
      // console.log("on content change", text, json);
      const newNote = {
        ...defaultNote,
        id: 'md-current',
        title,
        content: text,
      };
      upsertNote(newNote);
      getHeading();
    },
    [title, upsertNote]
  );

  const onTitleChange = useCallback(
    async (newTitle: string) => {
      setTitle(newTitle);
      const newNote = {
        ...defaultNote,
        id: 'md-current',
        title: newTitle,
        content: md,
      };
      upsertNote(newNote);
    },[md, upsertNote]
  );

  const onMarkdownChange = useCallback(
    async (text: string) => {
      // console.log("on markdown content change", text);
      await onChange(text, '');
    },[onChange]
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

  const note = useStore(state => state.notes)['md-current'];
  // console.log("note: ", note)
  const onSwitch = useCallback(async (mode: string) => {
    setMd(note?.content || ' ');
    setTitle(note?.title || '')
    setRawMode(mode)
  }, [note]);

  const onOpen = useImportMd(val => setTitle(val), value => setMd(value));

  return (
    <div className={`container ${className}`}>
      <Menubar 
        onNew={() => {onSave(); setTitle(''); setMd(' ');}} 
        onOpen={onOpen}
        onSave={onSave}
        onSaveHTML={onSaveHTML}
        onSwitch={onSwitch} 
        rawMode={rawMode}
      />
      <div className="">
        {title.trim().length > 0 
          ? (
              <Title
                className="py-2"
                initialTitle={title}
                onChange={onTitleChange}
              />
            ) 
          : null
        }
        {headings.length > 0 && !rawMode 
          ? (<Toc headings={headings} />) 
          : null
        }
        <div className="flex-1 p-2">
          {rawMode === 'raw' ? (
            <RawMark
              initialContent={md}
              onChange={onMarkdownChange}
              dark={true}
              readMode={false}
              className="text-lg"
            />
          ) : rawMode === 'md' ? (
            <MsEditor 
              dark={dark} 
              value={md} 
              onChange={onChange} 
              onOpenLink={(href) => { window.open(href, "_blank");}}
              onClickHashtag={(text) => { console.info("Click Hahtag: ", text);}}
              onShowToast={() => {/* nothing*/}}
              autoFocus={autoFocus} 
              embeds={embeds}
              ref={editorInstance}
            />
          ) : (
            <Mindmap mdValue={md} />
          )}
        </div>
      </div>
    </div>
  );
}
