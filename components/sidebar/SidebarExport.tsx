import { Menu } from '@headlessui/react';
import { IconFileUpload, IconFileDownload, IconClearAll } from '@tabler/icons';
import { DropdownItem } from 'components/misc/Dropdown';

type Props = {
  numOfNotes: number;
  onImportClick: () => void;
  onExportClick: () => void;
  onCleanupClick: () => void;
};

export default function Header(props: Props) {
  const { numOfNotes, onImportClick, onExportClick, onCleanupClick} = props;

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="px-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none">
          <span className="text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
            md: {numOfNotes}
          </span>
        </Menu.Button>
        <Menu.Items className="absolute z-20 w-auto overflow-hidden bg-white rounded top-full shadow-popover dark:bg-gray-800 focus:outline-none">
          <DropdownItem onClick={onExportClick}>
            <IconFileDownload size={18} className="mr-1" />
            <span>Export</span>
          </DropdownItem>
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
