import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import classNames from 'classnames';
import useOnNoteLinkClick from 'editor/hooks/useOnNoteLinkClick';
import { PubLink } from 'editor/slate';
import Tooltip from 'components/Tooltip';
import { useCurrentContext } from 'editor/hooks/useCurrent';

type PubLinkElementProps = {
  element: PubLink;
  children: ReactNode;
  attributes: RenderElementProps['attributes'];
  className?: string;
};

export default function PubLinkElement(props: PubLinkElementProps) {
  const { element, children, attributes, className } = props;

  const linkClassName = classNames("link shadow", className);
  const currentNote = useCurrentContext();
  const { onClick: onNoteLinkClick, defaultStackingBehavior } =
    useOnNoteLinkClick(currentNote.id);

  return (
    <Tooltip
      content={<span className="break-words">{element.noteTitle}</span>}
      placement="bottom-start"
    >
      <span
        role="button"
        className={linkClassName}
        onClick={(e) => {
          e.stopPropagation();
          onNoteLinkClick(element.noteId, defaultStackingBehavior(e));
        }}
        contentEditable={false}
        {...attributes}
      >
        {`{{ ${element.customText ?? element.noteTitle} }}`}
        {children}
      </span>
    </Tooltip>
  );
}
