import { memo, useRef, useState } from 'react';
import { IconMenu2 } from '@tabler/icons';
import { usePopper } from 'react-popper';
import { Menu, Portal } from '@headlessui/react';
import { useStore } from 'lib/store';
import { Sort } from 'lib/userSettingsSlice';
import Tooltip from 'components/misc/Tooltip';
import { normalizeSlash } from 'utils/helper';
import SidebarNotesSortDropdown from './SidebarNotesSortDropdown';


type Props = {
  noteSort: Sort;
  numOfNotes: number;
};

function SidebarNotesBar(props: Props) {
  const { noteSort, numOfNotes} = props;
  const setNoteSort = useStore((state) => state.setNoteSort);
  const currentDir = useStore((state) => state.currentDir);
  const currentFolder = currentDir 
    ? normalizeSlash(currentDir).split('/').pop() || '/'
    : 'md';
  const barClass = `px-2 text-sm bg-blue-500 text-white rounded overflow-hidden`; 
  
  return (
    <div className="flex items-center justify-between border-t dark:border-gray-700">
      <div className="flex mx-2 my-1">
        <SidebarNotesSortDropdown
          currentSort={noteSort}
          setCurrentSort={setNoteSort}
        />
      </div>
      <Tooltip content={currentDir ? currentDir : 'md'}>
        <div className="flex mx-2 my-1">
          <div className="relative">
            <span className={barClass}>
              {currentFolder}: {numOfNotes}
            </span>
          </div>
        </div>
      </Tooltip>
      <div className="flex mx-2 my-1">
        <DirDropDown />
      </div>
    </div>
  );
}

export default memo(SidebarNotesBar);


const DirDropDown = () => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = 
    useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(
    btnRef.current, popperElement, { placement: 'right-start' }
  );

  const noteTree = useStore(state => state.noteTree);
  const dirs = Object.keys(noteTree);
  const setCurrentDir = useStore(state => state.setCurrentDir);
  const currentDir = useStore(state => state.currentDir);

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button ref={btnRef} className="hover:bg-gray-200 dark:hover:bg-gray-700">
            <Tooltip content="Folder" placement="top">
              <span className="flex items-center justify-center w-6 h-6">
                <IconMenu2 size={16} className="text-gray-600 dark:text-gray-300" />
              </span>
            </Tooltip>
          </Menu.Button>
          {open && (
            <Portal>
              <Menu.Items
                ref={setPopperElement}
                className="z-20 w-42 overflow-hidden bg-white rounded shadow-popover dark:bg-gray-800 focus:outline-none"
                static
                style={styles.popper}
                {...attributes.popper}
              >
                {dirs.map((dir, index) => {
                  const isActive = currentDir === dir;
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          className={`flex w-full items-center px-4 py-2 text-left text-gray-800 dark:text-gray-200 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                          onClick={() => setCurrentDir(dir)}
                        >
                          <span className={isActive ? 'text-primary-500' : undefined}>
                            {dir}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </Portal>
          )}
        </>
      )}
    </Menu>
  );
};
