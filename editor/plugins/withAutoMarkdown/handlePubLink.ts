import { Editor, Point, Transforms } from 'slate';
import { ElementType, PubLink } from 'editor/slate';
import { getOrCreateNoteId } from 'editor/handleNoteId';
import { createNodeId } from '../withNodeId';
import { deleteMarkup } from './handleInlineShortcuts';

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
