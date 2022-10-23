import { useCallback, useState, useEffect, useRef } from 'react';
import MsEditor, { renderToHtml, embeds } from "mdsmirror";
import { RawMark } from "mdsmark";
import { parse, transform, markmap } from "mdsmap";
import { saveAs } from 'file-saver';
import Title from 'components/note/Title';
import Toc, { Heading } from 'components/note/Toc';
import { saveDiagram } from 'components/note/Note';
import Menubar from 'components/landing/Menubar';
import { useStore } from 'lib/store';
import { defaultNote } from 'types/model';
import { useImportFiles } from 'editor/hooks/useImport'; 
import { nowToRadix36Str } from 'utils/helper';

type MapProps = {
  mdValue: string;
  title?: string;
  className?: string;
};

export function Mindmap(props: MapProps) {
  const { mdValue, title, className = '' } = props;

  const [svgElement, setSvgElement] = useState<SVGAElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const renderSVG = useCallback(() => {
    if (!svgRef.current || !mdValue.trim()) { return; }

    const data = transform(parse(mdValue, {}));
    const svg: SVGAElement = markmap(svgRef.current, data, {
      preset: 'colorful',   
      linkShape: 'diagonal'
    });
    setSvgElement(svg);
  }, [mdValue]);

  useEffect(() => {
    if (!svgRef.current) { return; }

    renderSVG();
  }, [renderSVG]);

  const saveSVG = useCallback(async () => {
    if (!svgElement) return;
    const w = svgElement.clientWidth;
    const h = svgElement.clientHeight;
    if (w && h) {
      svgElement.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }
    svgElement.setAttribute("style", "background-color:white");
    // console.log("w/h", w, h, svgElement);
    const styleNode = document.createElement('style');
    styleNode.setAttribute('type', 'text/css');
    styleNode.innerHTML = `svg#mindmap {width: 100%; height: 100%;} .markmap-node-circle {fill: #fff; stroke-width: 1.5px;} .markmap-node-text {fill: #000; font: 10px sans-serif;} .markmap-link {fill: none;}`;
    svgElement.appendChild(styleNode);
    // prepare to save
    const rawSVG = svgElement.outerHTML;
    const svgBlob = new Blob([rawSVG], {
      type: 'image/svg+xml;charset=utf-8',
    });
    saveAs(svgBlob, `mindmap-${title || 'untitled'}.svg`);
  }, [svgElement, title]);

  return (
    <div className={`w-full h-full bg-white mb-6 ${className}`}>
      <div className="flex items-center justify-center my-2">
        <button className="text-xs text-gray-700" onClick={saveSVG}>
          SAVE RAW SVG
        </button>
      </div>
      <svg
        id="mindmap"
        ref={svgRef}
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="100%" 
        height="100%" 
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

  const [isInited, setInited] = useState(false);
  useEffect(() => { 
    if (isInited) return;
    getHeading(); 
    // init note in store
    const initNote = {
      ...defaultNote,
      id: 'md-current',
      title: defaultTitle,
      content: defaultValue,
    };
    upsertNote(initNote);
    return () => {
      setInited(true);
    }
  }, [defaultTitle, defaultValue, isInited, upsertNote]); 

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
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${title}-${nowToRadix36Str()}.html`);
  }, [md, title]);

  const onSaveDiagram = useCallback((svg: string, ty: string) => {
    saveDiagram(svg, ty);
  }, []);

  const note = useStore(state => state.notes)['md-current'];
  // console.log("note: ", note)
  const onSwitch = useCallback(async (mode: string) => {
    setMd(note?.content || ' ');
    setTitle(note?.title || '');
    setRawMode(mode);
  }, [note]);

  const onOpen = useImportFiles();

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
        {headings.length > 0 && rawMode === 'md' 
          ? (<Toc headings={headings} />) 
          : null
        }
        <div className="flex-1 p-2">
          {rawMode === 'raw' ? (
            <RawMark
              value={md}
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
              onSaveDiagram={onSaveDiagram}
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
