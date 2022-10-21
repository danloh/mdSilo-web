import { memo } from 'react';
import { useStore } from 'lib/store';
import { Sort } from 'lib/userSettingsSlice';
import Tooltip from 'components/misc/Tooltip';
import { normalizeSlash } from 'utils/helper';
// import { normalizeSlash, getParentDir } from 'file/util';
// import { listDirPath } from 'editor/hooks/useOpen';
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
    </div>
  );
}

export default memo(SidebarNotesBar);
