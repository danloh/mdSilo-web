import { useCallback } from 'react';
import { Menu } from '@headlessui/react';
import { 
  IconFileUpload, IconFileDownload, IconFileText, IconClearAll, IconFolderPlus 
} from '@tabler/icons';
import { useStore } from 'lib/store';
import { delDemoNotes } from 'components/AppLayout';
import { DropdownItem } from 'components/misc/Dropdown';
import Tooltip from 'components/misc/Tooltip';
import { exportNotesJson } from 'components/note/NoteExport';
import { checkFSA, openDirDialog } from 'editor/hooks/useFSA';
import { useImportJson, useImportMds } from 'editor/hooks/useImport';

type Props = {
  numOfNotes: number;
};

export default function SidebarExport(props: Props) {
  const { numOfNotes } = props;
  
  useStore((state) => state.dirHandle);
  const [inDir, dirName, hasFSA] = checkFSA();
  const onOpenFolder = openDirDialog;

  const onExportJson = useCallback(exportNotesJson, []);
  const onImportJson = useImportJson();
  const onImportFile = useImportMds();

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
          <DropdownItem onClick={onExportJson}>
            <IconFileDownload size={18} className="mr-1" />
            <Tooltip content="Export Json"><span>Export</span></Tooltip>
          </DropdownItem>
          {(hasFSA && !inDir) ? (
            <DropdownItem onClick={onOpenFolder}>
              <IconFolderPlus size={18} className="mr-1" />
              <Tooltip content="Open Folder"><span>Folder</span></Tooltip>
            </DropdownItem>) : null}
          {!inDir ? (
          <>
            <DropdownItem onClick={onImportFile}>
              <IconFileText size={18} className="mr-1" />
              <Tooltip content="Import .md | .txt"><span>File</span></Tooltip>
            </DropdownItem>
            <DropdownItem onClick={onImportJson}>
              <IconFileUpload size={18} className="mr-1" />
              <Tooltip content="Import Json"><span>Json</span></Tooltip>
            </DropdownItem>
          </>) : null}
          <DropdownItem onClick={delDemoNotes}>
            <IconClearAll size={18} className="mr-1" />
            <span>DeDemo</span>
          </DropdownItem>
        </Menu.Items>
      </Menu>
    </div>
  );
}
