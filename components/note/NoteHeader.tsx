import { useRef, useState } from 'react';
import { Menu } from '@headlessui/react';
import { IconDots } from '@tabler/icons';
import { usePopper } from 'react-popper';
import { useCurrentContext } from 'editor/hooks/useCurrent';
import Tooltip from 'components/misc/Tooltip';
import Portal from 'components/misc/Portal';
import Toggle from 'components/misc/Toggle';
import NoteMetadata from 'components/note/NoteMetadata';
import { useStore } from 'lib/store';

type Props = {
  isWiki: boolean;
  isPub: boolean;
};

export default function NoteHeader(props: Props) {
  const { isWiki, isPub } = props;
  const currentNote = useCurrentContext();
  
  const note = useStore((state) => state.notes[currentNote.id]);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(
    menuButtonRef.current,
    popperElement,
    { placement: 'bottom-start' }
  );

  const readMode = useStore((state) => state.readMode);
  const setReadMode = useStore((state) => state.setReadMode);
  const wikiReadMode = useStore((state) => state.wikiReadMode);
  const setWikiReadMode = useStore((state) => state.setWikiReadMode);

  const buttonClassName =
    'rounded hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600';
  const iconClassName = 'text-gray-600 dark:text-gray-300';

  return (
    <div className={`flex items-center justify-between w-full px-2 py-1 mb-2 text-right ${isWiki ? 'bg-blue-100 dark:bg-blue-900': 'bg-gray-100 dark:bg-gray-800'}`}>
      <div className="flex items-center">
        <span className="text-sm text-gray-300 dark:text-gray-500">Write</span>
        <Toggle
          id={isWiki ? 'wikiReadMode' : 'readMode'}
          className="mx-2"
          isChecked={isWiki ? wikiReadMode : readMode}
          setIsChecked={isWiki ? setWikiReadMode : setReadMode}
        />
        <span className="text-sm text-gray-300 dark:text-gray-500">Read</span>
      </div>
      <div>
        {!(isWiki || isPub) ? (
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button ref={menuButtonRef} className={buttonClassName}>
                  <Tooltip content="Options (export, import, delete, etc.)">
                    <span className="flex items-center justify-center w-8 h-8">
                      <IconDots className={iconClassName} />
                    </span>
                  </Tooltip>
                </Menu.Button>
                {open && (
                  <Portal>
                    <Menu.Items
                      ref={setPopperElement}
                      className="z-10 w-56 overflow-hidden bg-white rounded shadow-popover dark:bg-gray-800 focus:outline-none"
                      static
                      style={styles.popper}
                      {...attributes.popper}
                    >
                      <NoteMetadata note={note} />
                    </Menu.Items>
                  </Portal>
                )}
              </>
            )}
          </Menu>
        ) : null}
      </div>
    </div>
  );
}
