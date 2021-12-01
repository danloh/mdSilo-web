import { Descendant } from 'slate';
import { ElementType } from 'editor/slate';
import { createNodeId } from './plugins/withNodeId';

export const getDefaultEditorValue = (): Descendant[] => [
  { id: createNodeId(), type: ElementType.Paragraph, children: [{ text: '' }] },
];
