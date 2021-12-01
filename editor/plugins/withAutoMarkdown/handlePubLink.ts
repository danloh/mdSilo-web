import { Editor, Point, Transforms } from 'slate';
import { ElementType, PubLink } from 'editor/slate';
import { createNodeId } from '../withNodeId';
import { deleteMarkup, getOrCreateNoteId } from './handleInlineShortcuts';

export default function handlePubLink(
  editor: Editor,
  result: RegExpMatchArray,
  endOfMatchPoint: Point,
  textToInsertLength: number
): boolean {
  const [, startMark, noteTitle, endMark] = result;

  // Get or generate note id
  const noteId = getOrCreateNoteId(noteTitle, true);

  if (!noteId) {
    return false;
  }

  // Wrap text in a link
  const noteTitleRange = deleteMarkup(editor, endOfMatchPoint, {
    startMark: startMark.length,
    text: noteTitle.length,
    endMark: endMark.length,
    textToInsert: textToInsertLength,
  });
  const link: PubLink = {
    id: createNodeId(),
    type: ElementType.PubLink,
    noteId,
    noteTitle,
    children: [],
  };

  Transforms.wrapNodes(editor, link, {
    at: noteTitleRange,
    split: true,
  });
  Transforms.move(editor, { unit: 'offset' });

  return true;
}
