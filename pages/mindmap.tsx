import { useStore } from 'lib/store';
import { Mindmap } from 'editor/DemoEditor';
import { defaultValue } from './app/AppView';

export default function FullMindmap() {
  const noteId = useStore(state => state.currentNoteId);
  const note = useStore(state => state.notes[noteId]);
  const value = note?.content || defaultValue;
  const title = note?.title || '';

  return (
    <div className={`h-screen p-1 bg-white text-black`}>
      <Mindmap key={`mp-${noteId}`} mdValue={value} title={title} />
    </div>
  );
}
