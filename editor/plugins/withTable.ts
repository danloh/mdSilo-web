import { Editor, Range, Point, Element as SlateElement } from 'slate';
import { ElementType, TableCell, TableRow, MsElement } from 'editor/slate';
import { createNodeId } from './withNodeId';

export const buildTable = (row = 4, col = 4): MsElement[] => {
  const children: TableRow[] = [];
  for (let i = 0; i < row; i++) {
    const subChildren: TableCell[] = [];
    for (let j = 0; j < col; j++) {
      const subChild: TableCell = {
        id: createNodeId(),
        type: ElementType.TableCell,
        children: [{ text: `${i}-${j}` }],
      };
      subChildren.push(subChild);
    }
    const child: TableRow = {
      id: createNodeId(),
      type: ElementType.TableRow,
      children: subChildren,
    };
    children.push(child);
  }
  
  return [
    {
      id: createNodeId(),
      type: ElementType.Table,
      children: children,
    },
    {
      id: createNodeId(),
      type: ElementType.Paragraph,  // to reserve a block below table
      children: [{ text: '' }],
    },
  ];
}

const withTables = (editor: Editor) => {
  const { deleteForward } = editor;

  // merger override deleteBackward to withCustomDeleteBackward
  // merge override insertBreak to withBlockBreakout
  // here override deleteForward
  editor.deleteForward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === ElementType.TableCell,
      })

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(...args);
  } 

  return editor;
}

export default withTables;
