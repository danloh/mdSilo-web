import { useCallback, useState, useEffect, useRef } from 'react';
import MsEditor, { renderToHtml } from "mdsmirror";
import { saveAs } from 'file-saver';
import Title from 'components/note/Title';
import Toc, { Heading } from 'components/note/Toc';
import Menubar from 'components/landing/Menubar';

import { useStore } from 'lib/store';
import { defaultNote } from 'types/model';
import {nowToRadix36Str } from 'utils/helper';
import { useImportMd } from 'editor/hooks/useImport';

type Props = {
  defaultValue: string;
  defaultTitle?: string;
  autoFocus?: boolean;
  className?: string;
};

export default function DemoEditor(props: Props) {
  const { defaultValue, defaultTitle = '', autoFocus, className = '' } = props;
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
  useEffect(() => { getHeading(); }, [title, md]);

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
      getHeading();
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
    <div className="container">
      <Menubar 
        onNew={() => {onSave(); setTitle(''); setMd(' ');}} 
        onOpen={onOpen}
        onSave={onSave}
        onSaveHTML={onSaveHTML}
      />
      <div className={className}>
        {title.trim().length > 0 
          ? (
              <Title
                className="py-2"
                initialTitle={title}
                onChange={(newTitle: string) => setTitle(newTitle)}
              />
            ) 
          : null
        }
        {headings.length > 0 
          ? (<Toc headings={headings} />) 
          : null
        }
        <MsEditor 
          dark={true} 
          value={md} 
          onChange={onChange} 
          onOpenLink={(href) => { window.open(href, "_blank");}}
          onClickHashtag={(text) => { console.info("Click Hahtag: ", text);}}
          onShowToast={() => {/* nothing*/}}
          autoFocus={autoFocus}
          ref={editorInstance}
        />
      </div>
    </div>
  );
}
