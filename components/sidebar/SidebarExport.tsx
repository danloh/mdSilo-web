import { Menu } from '@headlessui/react';
import { 
  IconFileUpload, IconFileDownload, IconClearAll, IconFolderPlus 
} from '@tabler/icons';
import { useStore } from 'lib/store';
import { DropdownItem } from 'components/misc/Dropdown';
import { checkFSA, openDirDialog } from 'editor/hooks/useFSA';

type Props = {
  numOfNotes: number;
  onImportClick: () => void;
  onExportClick: () => void;
  onCleanupClick: () => void;
};

export default function SidebarExport(props: Props) {
  const { numOfNotes, onImportClick, onExportClick, onCleanupClick} = props;
  // FIXME: some issue on FSA
  useStore((state) => state.dirHandle);
  const [inDir, dirName, hasFSA] = checkFSA();
  const onOpenFolder = openDirDialog;

  const barClass = `px-2 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap ${inDir ? 'bg-blue-500 text-gray-200 rounded' : ''}`; 

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="px-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none">
          <span className={barClass}>
            {inDir ? dirName : 'md'}: {numOfNotes}
          </span>
        </Menu.Button>
        <Menu.Items className="absolute z-20 w-auto overflow-hidden bg-white rounded top-full shadow-popover dark:bg-gray-800 focus:outline-none">
          <DropdownItem onClick={onExportClick}>
            <IconFileDownload size={18} className="mr-1" />
            <span>Export</span>
          </DropdownItem>
          {(hasFSA && !inDir) ? (
            <DropdownItem onClick={onOpenFolder}>
              <IconFolderPlus size={18} className="mr-1" />
              <span>Folder</span>
            </DropdownItem>) : null}
          <DropdownItem onClick={onImportClick}>
            <IconFileUpload size={18} className="mr-1" />
            <span>Import</span>
          </DropdownItem>
          <DropdownItem onClick={onCleanupClick}>
            <IconClearAll size={18} className="mr-1" />
            <span>DeDemo</span>
          </DropdownItem>
        </Menu.Items>
      </Menu>
    </div>
  );
}
