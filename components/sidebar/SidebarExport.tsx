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
  
  const dirHandle = useStore((state) => state.dirHandle);
  const [inDir, dirName, hasFSA] = checkFSA(dirHandle);
  const onOpenFolder = openDirDialog;

  const onExportJson = useCallback(exportNotesJson, []);
  const onImportJson = useImportJson();
  const onImportFile = useImportMds();

  const barClass = 'px-2 text-sm bg-blue-500 text-white rounded overflow-hidden'; 

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="px-2 hover:bg-blue-500">
          <span className={barClass}>
            {inDir ? dirName : 'md'}: {numOfNotes}
          </span>
        </Menu.Button>
        <Menu.Items className="absolute z-20 w-auto overflow-hidden bg-white rounded top-full shadow-popover dark:bg-gray-800 focus:outline-none">
          <DropdownItem 
            onClick={onExportJson}
            className="border-b-2 border-gray-200 dark:border-gray-600"
          >
            <IconFileDownload size={18} className="mr-1" />
            <Tooltip content="Export JSON"><span>Export</span></Tooltip>
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
              <Tooltip content="Import .md | .txt"><span>Text</span></Tooltip>
            </DropdownItem>
            <DropdownItem onClick={onImportJson}>
              <IconFileUpload size={18} className="mr-1" />
              <Tooltip content="Import JSON"><span>JSON</span></Tooltip>
            </DropdownItem>
          </>) : null}
          <DropdownItem 
            onClick={delDemoNotes}
            className="border-t-2 border-gray-200 dark:border-gray-600"
          >
            <IconClearAll size={18} className="mr-1" />
            <span>DeDemo</span>
          </DropdownItem>
        </Menu.Items>
      </Menu>
    </div>
  );
}
