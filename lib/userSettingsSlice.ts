import { Draft } from 'immer';
import { setter, Setter, Store } from './store';

export enum Sort {
  TitleAscending = 'TITLE_ASCENDING',
  TitleDescending = 'TITLE_DESCENDING',
  DateModifiedAscending = 'DATE_MODIFIED_ASCENDING',
  DateModifiedDescending = 'DATE_MODIFIED_DESCENDING',
  DateCreatedAscending = 'DATE_CREATED_ASCENDING',
  DateCreatedDescending = 'DATE_CREATED_DESCENDING',
}

export const ReadableNameBySort = {
  [Sort.TitleAscending]: 'Title (A-Z)',
  [Sort.TitleDescending]: 'Title (Z-A)',
  [Sort.DateModifiedAscending]: 'Modified (old)',
  [Sort.DateModifiedDescending]: 'Modified (new)',
  [Sort.DateCreatedAscending]: 'Created (old)',
  [Sort.DateCreatedDescending]: 'Created (new)',
} as const;

export type UserSettings = {
  userId: string,
  setUserId: Setter<string>;
  darkMode: boolean;
  setDarkMode: Setter<boolean>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Setter<boolean>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: Setter<boolean>;
  isFindOrCreateModalOpen: boolean;
  setIsFindOrCreateModalOpen: Setter<boolean>;
  noteSort: Sort;
  setNoteSort: Setter<Sort>;
  isPageStackingOn: boolean;
  setIsPageStackingOn: Setter<boolean>;
  isCheckSpellOn: boolean;
  setIsCheckSpellOn: Setter<boolean>;
  isRTL: boolean;
  setIsRTL: Setter<boolean>;
  readMode: boolean;
  setReadMode: Setter<boolean>;
  rawMode: string; // 'raw' | 'wysiwyg' | 'mindmap'; 
  setRawMode: Setter<string>;
  useAsset: boolean;
  setUseAsset: Setter<boolean>;
  wikiReadMode: boolean;
  setWikiReadMode: Setter<boolean>;
};

const userSettingsSlice = (
  set: (fn: (draft: Draft<Store>) => void) => void
) => ({
  userId: '',
  setUserId: setter(set, 'userId'),
  darkMode: true,
  setDarkMode: setter(set, 'darkMode'),
  isSidebarOpen: true,
  setIsSidebarOpen: setter(set, 'isSidebarOpen'),
  isSettingsOpen: false,
  setIsSettingsOpen: setter(set, 'isSettingsOpen'),
  isFindOrCreateModalOpen: false,
  setIsFindOrCreateModalOpen: setter(set, 'isFindOrCreateModalOpen'),
  noteSort: Sort.TitleAscending,
  setNoteSort: setter(set, 'noteSort'),
  isPageStackingOn: true,
  setIsPageStackingOn: setter(set, 'isPageStackingOn'),
  isCheckSpellOn: true,
  setIsCheckSpellOn: setter(set, 'isCheckSpellOn'),
  isRTL: false,
  setIsRTL: setter(set, 'isRTL'),
  rawMode: 'wysiwyg',
  setRawMode: setter(set, 'rawMode'),
  useAsset: true,
  setUseAsset: setter(set, 'useAsset'),
  readMode: false,
  setReadMode: setter(set, 'readMode'),
  wikiReadMode: true,
  setWikiReadMode: setter(set, 'wikiReadMode'),
});

export default userSettingsSlice;
