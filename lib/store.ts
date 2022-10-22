import create, { State, StateCreator } from 'zustand';
import createVanilla from 'zustand/vanilla';
import { persist, StateStorage } from 'zustand/middleware';
import produce, { Draft } from 'immer';
import localforage from 'localforage';
import type { Note } from 'types/model';
import type { NoteUpdate } from 'api/curdNote';
import userSettingsSlice, { UserSettings } from './userSettingsSlice';

export { default as shallowEqual } from 'zustand/shallow';

const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api);

localforage.config({
  name: 'mdSilo',
  version: 1.0,
  storeName: 'user_data',
});

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await localforage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export type Notes = Record<Note['id'], Note>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FileHandles = Record<string, any>; // FileSystemFileHandle

export type NoteTreeItem = {
  id: Note['id']; 
  title: string;
  created_at: string;
  updated_at: string; 
  is_dir: boolean;
  children?: NoteTreeItem[]; // to del
  collapsed?: boolean;       // to del
};

export type NoteTree = Record<Note['id'], NoteTreeItem[]>;

export type NotesData = {
  notesobj: Notes;
  notetree: NoteTree;
}

export enum SidebarTab {
  Silo,
  Search,
  Hashtag,
}

export type Store = {
  currentNoteId: string;
  setCurrentNoteId: Setter<string>;
  initDir: string | undefined;  // first open dir path
  setInitDir: Setter<string | undefined>;
  currentDir: string | undefined;  // dir path
  setCurrentDir: Setter<string | undefined>;
  currentNote: Notes;  // one record only
  setCurrentNote: Setter<Notes>;
  // note
  notes: Notes;
  setNotes: Setter<Notes>;
  // operate note
  upsertNote: (note: Note, ifUpTree?: boolean) => void;
  upsertTree: (targetDir: string, noteList: Note[], isDir?: boolean) => void;
  updateNote: (note: NoteUpdate) => void;
  deleteNote: (noteId: string) => void;
  openNoteIds: string[];
  setOpenNoteIds: (openNoteIds: string[], index?: number) => void;
  noteTree: NoteTree;
  setNoteTree: Setter<NoteTree>;
  sidebarTab: SidebarTab;
  setSidebarTab: Setter<SidebarTab>;
  sidebarSearchQuery: string;
  setSidebarSearchQuery: Setter<string>;
  sidebarSearchType: string; // content or hashtag
  setSidebarSearchType: Setter<string>;
  // FileSystemFileHandle
  handles: FileHandles;
  setHandles: Setter<FileHandles>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upsertHandle: (key: string, handle: any) => void;
  deleteHandle: (key: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dirHandle: any;  // FileSystemDirectoryHandle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDirHandle: (handle: any) => void;
} & UserSettings;

type FunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type StoreWithoutFunctions = Omit<Store, FunctionPropertyNames<Store>>;

export type Setter<T> = (value: T | ((value: T) => T)) => void;
export const setter =
  <K extends keyof StoreWithoutFunctions>(
    set: (fn: (draft: Draft<Store>) => void) => void,
    key: K
  ) =>
  (value: Store[K] | ((value: Store[K]) => Store[K])) => {
    if (typeof value === 'function') {
      set((state) => {
        state[key] = value(state[key]);
      });
    } else {
      set((state) => {
        state[key] = value;
      });
    }
  };

export const store = createVanilla<Store>(
  persist(
    immer((set) => ({
      currentNoteId: '',
      setCurrentNoteId: setter(set, 'currentNoteId'),
      currentNote: {},
      setCurrentNote: setter(set, 'currentNote'),
      initDir: undefined,
      setInitDir: setter(set, 'initDir'),
      currentDir: undefined,
      setCurrentDir: setter(set, 'currentDir'),
      //  Map of note id to notes
      notes: {},  // all private notes and related wiki notes
      // Sets the notes
      setNotes: setter(set, 'notes'),
      /**
       * update or insert the note
       * @param {Note} note the note to upsert
       */
       upsertNote: (note: Note) => {
        set((state) => {
          if (state.notes[note.id]) {
            // if existing per id, update 
            state.notes[note.id] = { ...state.notes[note.id], ...note };
          } else {
            // otherwise, new insert
            state.notes[note.id] = note;
          }
          // alert: not check title unique, wiki-link will link to first searched note
        });
      },
      upsertTree: (targetDir: string, noteList: Note[]) => {
        set((state) => {
          const itemsToInsert: NoteTreeItem[] = noteList.map(note => ({ 
            id: note.id, 
            title: note.title,
            created_at: note.created_at,
            updated_at: note.updated_at,
            is_dir: note.is_dir ?? false,
            children: [], 
            collapsed: true, 
          }));
          const targetList = state.noteTree[targetDir] || [];
          const newTargetList = [...targetList, ...itemsToInsert];
          const newList: NoteTreeItem[] = [];
          newTargetList.forEach(item => {
            if (!newList.some(n => n.id === item.id)) {
              newList.push(item)
            }
          })
          state.noteTree[targetDir] = newList;
        });
      },
      // Update the given note
      updateNote: (note: NoteUpdate) => {
        set((state) => {
          if (state.notes[note.id]) {
            state.notes[note.id] = { 
              ...state.notes[note.id], 
              ...note, 
              updated_at: new Date().toISOString() 
            };
          }
        });
      },
      // Delete the note with the given noteId
      deleteNote: (noteId: string) => {
        set((state) => {
          delete state.notes[noteId];
          deleteTreeItem(state.noteTree, noteId);
        });
      },
      // The visible notes, including the main note and the stacked notes
      openNoteIds: [],
      // Replaces the open notes at the given index (0 by default)
      setOpenNoteIds: (newOpenNoteIds: string[], index?: number) => {
        if (!index) {
          set((state) => {
            state.openNoteIds = newOpenNoteIds;
          });
          return;
        }
        // Replace the notes after the current note with the new note
        set((state) => {
          state.openNoteIds.splice(
            index,
            state.openNoteIds.length - index,
            ...newOpenNoteIds
          );
        });
      },
      // The tree of notes visible in the sidebar
      noteTree: {}, // private notes
      setNoteTree: setter(set, 'noteTree'),
      
      sidebarTab: SidebarTab.Silo,
      setSidebarTab: setter(set, 'sidebarTab'),
      sidebarSearchQuery: '',
      setSidebarSearchQuery: setter(set, 'sidebarSearchQuery'),
      sidebarSearchType: 'content',
      setSidebarSearchType: setter(set, 'sidebarSearchType'),
      // FileSystemFileHandles
      // map name(title) to FileHandle
      handles: {},
      setHandles: setter(set, 'handles'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      upsertHandle: (key: string, handle: any) => {
        set((state) => {
          state.handles[key] = handle;
        });
      },
      deleteHandle: (key: string) => {
        set((state) => {
          delete state.handles[key];
        });
      },
      // FileSystemDirectoryHandle
      dirHandle: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDirHandle: (handle: any) => {
        set((state) => {
          state.dirHandle = handle;
        });
      },
      ...userSettingsSlice(set),
    })),
    {
      name: 'mdSilo-storage',
      version: 1,
      getStorage: () => storage,
      partialize: (state) => ({
        // user setting related storage
        userId: state.userId,
        isSidebarOpen: state.isSidebarOpen,
        darkMode: state.darkMode,
        isPageStackingOn: state.isPageStackingOn,
        isCheckSpellOn: state.isCheckSpellOn,
      }),
    }
  )
);

export const useStore = create<Store>(store);

/**
 * Deletes the tree item with the given id and returns it.
 */
 const deleteTreeItem = (
  tree: NoteTree,
  id: string
): NoteTreeItem | null => {
  for (const [key, treeList] of Object.entries(tree)) {
    for (let i = 0; i < treeList.length; i++) {
      const item = treeList[i];
      if (item.id === id) {
        treeList.splice(i, 1);
        tree[key] = treeList;
        return item;
      }
    }
  }
  return null;
};

/**
 * Gets the note tree item corresponding to the given noteId.
 */
export const getNoteTreeItem = (
  tree: NoteTreeItem[],
  id: string
): NoteTreeItem | null => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.id === id) {
      return item;
    } else if (item.children && item.children.length > 0) {
      const result = getNoteTreeItem(item.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
