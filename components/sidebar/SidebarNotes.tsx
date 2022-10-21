import { memo, useMemo } from 'react';
import Link from 'next/link';
import { NoteTreeItem, useStore } from 'lib/store';
import { Sort } from 'lib/userSettingsSlice';
import { ciStringCompare, dateCompare } from 'utils/helper';
import { useImportJson, useImportFiles } from 'editor/hooks/useImport';
import { openDirDialog } from 'editor/hooks/useFSA';
import { FileSystemAccess } from 'editor/checks';
import ErrorBoundary from '../misc/ErrorBoundary';
import SidebarNotesBar from './SidebarNotesBar';
import SidebarNotesTree from './SidebarNotesTree';

type SidebarNotesProps = {
  className?: string;
};

function SidebarNotes(props: SidebarNotesProps) {
  const { className='' } = props;
  const currentDir = useStore((state) => state.currentDir);
  
  const noteTree = useStore((state) => state.noteTree);
  const noteSort = useStore((state) => state.noteSort);
  const [sortedNoteTree, numOfNotes] = useMemo(() => {
    if (currentDir) {
      const treeList = noteTree[currentDir] || [];
      return [sortNoteTree(treeList, noteSort), treeList.length];
    } else {
      return [[], 0];
    }
  }, [noteTree, currentDir, noteSort]);
  
  const onImportJson = useImportJson();
  const onImportFile = useImportFiles();

  const hasFSA = FileSystemAccess.support(window);
  const onOpenFolder = openDirDialog;

  const btnClass = "p-1 my-1 mx-4 rounded bg-blue-500 hover:text-yellow-500";

  return (
    <ErrorBoundary>
      <div className={`flex flex-col flex-1 overflow-x-hidden ${className}`}>
        <SidebarNotesBar
          noteSort={noteSort}
          numOfNotes={numOfNotes}
        />
        {sortedNoteTree && sortedNoteTree.length > 0 ? (
          <SidebarNotesTree
            data={sortedNoteTree}
            className="flex-1 overflow-y-auto"
          />
        ) : (
          <>
            {hasFSA ? (
              <button className={btnClass} onClick={onOpenFolder}>Open Folder</button>
            ) : null}
            <button className={btnClass} onClick={onImportFile}>Open File</button>
            <button className={btnClass} onClick={onImportJson}>Import JSON</button>
            <Link href="/app/demo">
              <a target="_blank" className={`${btnClass} mb-4 text-center`}>Live Demo</a>
            </Link>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

/**
 * Sorts the tree recursively based on the information in notes with the given noteSort.
 */
 const sortNoteTree = (
  tree: NoteTreeItem[],
  noteSort: Sort
): NoteTreeItem[] => {
  // Copy tree shallowly
  const newTree = [...tree];
  // Sort tree items (one level)
  if (newTree.length >= 2) {
    newTree.sort((n1, n2) => {
      switch (noteSort) {
        case Sort.DateModifiedAscending:
          return dateCompare(n1.updated_at, n2.updated_at);
        case Sort.DateModifiedDescending:
          return dateCompare(n2.updated_at, n1.updated_at);
        case Sort.DateCreatedAscending:
          return dateCompare(n1.created_at, n2.created_at);
        case Sort.DateCreatedDescending:
          return dateCompare(n2.created_at, n1.created_at);
        case Sort.TitleAscending:
          return ciStringCompare(n1.title, n2.title);
        case Sort.TitleDescending:
          return ciStringCompare(n2.title, n1.title);
        default:
          return ciStringCompare(n1.title, n2.title);
      }
    });
    newTree.sort((n1, n2) => Number(Boolean(n2.is_dir)) - Number(Boolean(n1.is_dir)));
  }
  // Sort each tree item's children
  return newTree;
};

export default memo(SidebarNotes);
