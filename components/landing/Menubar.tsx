import { IconFeather, IconFile, IconMarkdown, IconFileCode } from '@tabler/icons';

type Props = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveHTML: () => void;
};

export default function Menubar(props: Props) {
  const { onNew, onOpen, onSave, onSaveHTML } = props;

  const itemClassName = `flex items-center px-4 py-2 text-sm text-gray-500 select-none`;

  return (
    <div className="flex flex-row flex-wrap item-center justify-center">
      <button className={itemClassName} onClick={onNew}>
        <IconFeather size={18} className="mr-1" />
        <span className="hover:text-primary-500">New</span>
      </button>
      <button className={itemClassName} onClick={onOpen}>
        <IconFile size={18} className="mr-1" />
        <span className="hover:text-primary-500">Open</span>
      </button>
      <button className={itemClassName} onClick={onSave}>
        <IconMarkdown size={18} className="mr-1" />
        <span className="hover:text-primary-500">Save md</span>
      </button>
      <button className={itemClassName} onClick={onSaveHTML}>
        <IconFileCode size={18} className="mr-1" />
        <span className="hover:text-primary-500">Save HTML</span>
      </button>    
    </div>
  );
}
