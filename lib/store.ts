import create, { State, StateCreator } from 'zustand';
import createVanilla from 'zustand/vanilla';
import { persist, StateStorage } from 'zustand/middleware';
import produce, { Draft } from 'immer';
import localforage from 'localforage';
import type { Note } from 'types/model';
import { ciStringEqual } from 'utils/helper';

import userSettingsSlice, { UserSettings } from './userSettingsSlice';
import type { NoteUpdate } from './api/curdNote';

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
  children: NoteTreeItem[];
  collapsed: boolean;
};

export enum SidebarTab {
  Silo,
  Search,
}

export type Store = {
  // note
  notes: Notes;
  setNotes: Setter<Notes>;
  // operate note
  upsertNote: (note: Note, ifUpTree?: boolean) => void;
  upsertTree: (note: Note) => void;
  updateNote: (note: NoteUpdate) => void;
  deleteNote: (noteId: string) => void;
  openNoteIds: string[];
  setOpenNoteIds: (openNoteIds: string[], index?: number) => void;
  noteTree: NoteTreeItem[];
  setNoteTree: Setter<NoteTreeItem[]>;
  updateNoteTree: (item: NoteTreeItem, target: string | null) => void;
  sidebarTab: SidebarTab;
  setSidebarTab: Setter<SidebarTab>;
  sidebarSearchQuery: string;
  setSidebarSearchQuery: Setter<string>;
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
      //  Map of note id to notes
      notes: {},  // all private notes and related wiki notes
      // Sets the notes
      setNotes: setter(set, 'notes'),
      /**
       * update or insert the note
       * @param {Note} note the note to upsert
       * @param ifUpTree, boolean, optional, Defaut True,if upsertTree on upsert
       */
      upsertNote: (note: Note, ifUpTree = true) => {
        set((state) => {
          if (state.notes[note.id]) {
            // if existing per id
            state.notes[note.id] = { ...state.notes[note.id], ...note };
          } else {
            // if existing per title
            const existingNote = Object.values(state.notes).find((n) =>
              n.title && note.title &&
              ciStringEqual(n.title, note.title)
            );
            if (existingNote) {
              // Update existing note
              state.notes[existingNote.id] = {
                ...state.notes[existingNote.id],
                ...note,
              };
            } else {
              // Insert new note
              state.notes[note.id] = note;
              if (ifUpTree) {
                if (!note.is_wiki) {
                  insertTreeItem(
                    state.noteTree,
                    { id: note.id, children: [], collapsed: true },
                    null
                  );
                }
              }
            }
          }
        });
      },
      upsertTree: (note: Note) => {
        set((state) => {
          if (!note.is_wiki) {
            insertTreeItem(
              state.noteTree,
              { id: note.id, children: [], collapsed: true },
              null
            );
          }
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
          const item = deleteTreeItem(state.noteTree, noteId);
          if (item && item.children.length > 0) {
            for (const child of item.children) {
              insertTreeItem(state.noteTree, child, null);
            }
          }
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
      noteTree: [], // private notes
      setNoteTree: setter(set, 'noteTree'),
      
      updateNoteTree: (item: NoteTreeItem, target: string | null) => {
        set((state) => {
          insertTreeItem(state.noteTree, item, target);
        });
      },
      sidebarTab: SidebarTab.Silo,
      setSidebarTab: setter(set, 'sidebarTab'),
      sidebarSearchQuery: '',
      setSidebarSearchQuery: setter(set, 'sidebarSearchQuery'),
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
  tree: NoteTreeItem[],
  id: string
): NoteTreeItem | null => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.id === id) {
      tree.splice(i, 1);
      return item;
    } else if (item.children.length > 0) {
      const result = deleteTreeItem(item.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/**
 * Inserts the given item into the tree as a child of the item with targetId, and returns true if it was inserted.
 * If targetId is null, inserts the item into the root level.
 */
const insertTreeItem = (
  tree: NoteTreeItem[],
  item: NoteTreeItem,
  targetId: string | null
): boolean => {
  if (targetId === null) {
    const itemExist = tree.find((n) => n.id === item.id);
    if (itemExist) { 
      return true; // existed
    }
    tree.push(item);
    return true;
  }

  for (let i = 0; i < tree.length; i++) {
    const treeItem = tree[i];
    if (treeItem.id === targetId) {
      const children = treeItem.children;
      const itemExist = children.find((n) => n.id === item.id);
      if (itemExist) {
        return true; // existed
      }
      children.push(item);
      return true;
    } else if (treeItem.children.length > 0) {
      const result = insertTreeItem(treeItem.children, item, targetId);
      if (result) {
        return result;
      }
    }
  }
  return false;
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
    } else if (item.children.length > 0) {
      const result = getNoteTreeItem(item.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
