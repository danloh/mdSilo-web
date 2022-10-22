import { useMemo } from 'react';
import { parser, Task, getTasks } from "mdsmirror";
import { Notes, useStore } from 'lib/store';
import { Note } from 'types/model';

export type DocTask = {
  note: Note;
  tasks: Task[];
};

export default function useTasks() {
  const notes = useStore((state) => state.notes);

  const docTasks = useMemo(
    () => computeTasks(notes),
    [notes]
  );

  return docTasks;
}

export const computeTasks = (notes: Notes): DocTask[] => {
  const result: DocTask[] = [];
  const myNotes = Object.values(notes);
  for (const note of myNotes) {
    const tasks = computeNoteTasks(note.content);
    if (tasks.length > 0) {
      result.push({ note, tasks });
    }
  }
  return result;
};

const computeNoteTasks = (content: string) => {
  const doc = parser.parse(content);
  // console.log(">> doc: ", doc, content)
  const tasks = getTasks(doc); 
  
  return tasks;
};
