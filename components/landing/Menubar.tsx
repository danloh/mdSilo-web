import { 
  /* IconFeather, IconFile, */ IconMarkdown, IconFileCode, IconNotes, IconCode
} from '@tabler/icons';

type Props = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveHTML: () => void;
  onSwitch: () => void;
  rawMode: boolean;
};

export default function Menubar(props: Props) {
  const { /* onNew, onOpen, */ onSave, onSaveHTML, onSwitch, rawMode = false } = props;

  const itemClassName = `flex items-center p-1 text-sm text-gray-500 select-none`;

  return (
    <div className="flex flex-row flex-wrap item-center justify-center">
      {/* <button className={itemClassName} onClick={onNew}>
        <IconFeather size={18} className="mr-1" />
        <span className="hover:text-primary-500">New</span>
      </button>
      <button className={itemClassName} onClick={onOpen}>
        <IconFile size={18} className="mr-1" />
        <span className="hover:text-primary-500">Open</span>
      </button> */}
      <button className={itemClassName} onClick={onSave}>
        <IconMarkdown size={18} className="mr-1" />
        <span className="hover:text-primary-500">Save md</span>
      </button>
      <button className={itemClassName} onClick={onSaveHTML}>
        <IconFileCode size={18} className="mr-1" />
        <span className="hover:text-primary-500">Save HTML</span>
      </button>   
      <button className={itemClassName} onClick={onSwitch}>
        {rawMode ? (
          <IconCode size={18} className="mr-1" />
        ) : (
          <IconNotes size={18} className="mr-1" />
        )}
        <span className="hover:text-primary-500">{rawMode ? 'WYSIWYG' : 'Markdown'}</span>
      </button> 
    </div>
  );
}
