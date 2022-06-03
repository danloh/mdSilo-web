import { useState, useRef } from 'react';
import { Menu } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { IconDots, IconFeather, IconFile, IconMarkdown, IconFileCode } from '@tabler/icons';
import { DropdownItem } from 'components/misc/Dropdown';
import Tooltip from 'components/misc/Tooltip';
import Portal from 'components/misc/Portal';

type Props = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveHTML: () => void;
};

export default function NavDrop(props: Props) {
  const { onNew, onOpen, onSave, onSaveHTML } = props;
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(
    menuButtonRef.current,
    popperElement,
    { placement: 'bottom-start' }
  );

  const buttonClassName =
    'rounded hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600';
  const iconClassName = 'text-gray-600 dark:text-gray-300';

  return (
    <div>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button ref={menuButtonRef} className={buttonClassName}>
              <Tooltip content="Options (New, Export...)">
                <span className="flex items-center justify-center w-8 h-8">
                  <IconDots className={iconClassName} />
                </span>
              </Tooltip>
            </Menu.Button>
            {open && (
              <Portal>
                <Menu.Items
                  ref={setPopperElement}
                  className="z-10 w-32 overflow-hidden bg-white rounded shadow-popover dark:bg-gray-800 focus:outline-none"
                  static
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <DropdownItem
                    onClick={onNew}
                    className="border-t dark:border-gray-700"
                  >
                    <IconFeather size={18} className="mr-1" />
                    <span>New</span>
                  </DropdownItem>
                  <DropdownItem
                    onClick={onOpen}
                    className="border-t dark:border-gray-700"
                  >
                    <IconFile size={18} className="mr-1" />
                    <span>Open</span>
                  </DropdownItem>
                  <DropdownItem
                    onClick={onSave}
                    className="border-t dark:border-gray-700"
                  >
                    <IconMarkdown size={18} className="mr-1" />
                    <span>Save md</span>
                  </DropdownItem>
                  <DropdownItem
                    onClick={onSaveHTML}
                    className="border-t dark:border-gray-700"
                  >
                    <IconFileCode size={18} className="mr-1" />
                    <span>Save HTML</span>
                  </DropdownItem>
                </Menu.Items>
              </Portal>
            )}
          </>
        )}
      </Menu>
    </div>
  );
}
