import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import classNames from 'classnames';
import useOnNoteLinkClick from 'editor/hooks/useOnNoteLinkClick';
import { useCurrentContext } from 'editor/hooks/useCurrent';
import { PubLink } from 'editor/slate';
import Tooltip from 'components/misc/Tooltip';
import { loadDbWikiNotePerTitle } from 'lib/api/curdNote'

type PubLinkElementProps = {
  element: PubLink;
  children: ReactNode;
  attributes: RenderElementProps['attributes'];
  className?: string;
};

export default function PubLinkElement(props: PubLinkElementProps) {
  const { element, children, attributes, className } = props;

  const linkClassName = classNames("link shadow px-1 py-0.5 bg-gray-100 dark:bg-gray-800", className);
  const currentNote = useCurrentContext();
  const { onClick: onNoteLinkClick, defaultStackingBehavior } =
    useOnNoteLinkClick(currentNote.id);
  
  // Load wiki note first to get noteId if no noteId in Element, 
  const getWikiNoteId = async (title: string, id: string) => {
    if (id.trim()) {
      return id;
    } else if (title.trim()) {
      const wikiNoteRes = await loadDbWikiNotePerTitle(title);
      const wikiNote = wikiNoteRes.data;
      // TODO: update the real noteId in element? 
      if (wikiNote) {
        return wikiNote.id;
      }
    }
  }

  return (
    <Tooltip
      content={<span className="break-words">{element.noteTitle}</span>}
      placement="bottom-start"
    >
      <span
        role="button"
        className={linkClassName}
        onClick={async (e) => {
          e.stopPropagation();
          const wikiNoteId = await getWikiNoteId(element.noteTitle, element.noteId);
          if (!wikiNoteId) return;
          onNoteLinkClick(wikiNoteId, defaultStackingBehavior(e));
        }}
        contentEditable={false}
        {...attributes}
      >
        {element.customText ?? element.noteTitle}
        {children}
      </span>
    </Tooltip>
  );
}
