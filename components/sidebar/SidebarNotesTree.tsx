import React, { useMemo, useCallback, memo } from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { NoteTreeItem, useStore } from 'lib/store';
import SidebarNoteLink from './SidebarNoteLink';

export type FlattenedNoteTreeItem = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string; 
  is_dir: boolean;
  depth: number;
  collapsed: boolean;
};

type Props = {
  data: NoteTreeItem[];
  className?: string;
};

function SidebarNotesTree(props: Props) {
  const { data, className } = props;

  const currentNoteId = useStore(state => state.currentNoteId);
  
  const flattenNode = useCallback(
    (node: NoteTreeItem, depth: number, result: FlattenedNoteTreeItem[]) => {
      const { id, title, created_at, updated_at, is_dir } = node;
      result.push({ id, title, created_at, updated_at, is_dir, depth, collapsed: false });
    },
    []
  );

  const flattenedData = useMemo(() => {
    const result: FlattenedNoteTreeItem[] = [];
    for (const node of data) {
      flattenNode(node, 0, result);
    }
    return result;
  }, [data, flattenNode]);

  const Row = useCallback(
    ({ index, style }: {index: number; style: React.CSSProperties}) => {
      const node = flattenedData[index];
      return (
        <SidebarNoteLink
          key={`${node.id}-${index}`}
          node={node}
          isHighlighted={node.id === currentNoteId}
          style={style}
        />
      );
    },
    [currentNoteId, flattenedData]
  );

  return (
    <div className={className}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={flattenedData.length}
            rowHeight={32}
            rowRenderer={Row}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default memo(SidebarNotesTree);
