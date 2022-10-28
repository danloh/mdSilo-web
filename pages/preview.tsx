import { useStore } from 'lib/store';
import DemoEditor from 'editor/DemoEditor';
import { defaultValue } from './app/AppView';

export default function Preview() {
  const noteId = useStore(state => state.currentNoteId);
  const note = useStore(state => state.notes[noteId]);
  const value = note?.content || defaultValue;
  const title = note?.title || '';
  const dark = useStore(state => state.darkMode);

  return (
    <div className={`min-h-screen font-display ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-4xl mx-auto">
        <DemoEditor 
          defaultValue={value}
          defaultTitle={title}
          dark={dark}
          className="flex-1 p-8 overflow-auto shadow-inner"
        />
      </div>
    </div>
  );
}
