import { Editor, Range, Point } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { ElementType, Mark } from 'editor/slate';
import { defaultUserId, defaultNote } from 'types/model';
import { isMark } from 'editor/formatting';
import { getOrNewFileHandle } from 'editor/hooks/useFSA';
import { store } from 'lib/store';
import { upsertDbNote } from 'lib/api/curdNote';
import apiClient from 'lib/apiClient';
import { ciStringEqual, regDateStr } from 'utils/helper';
import { deleteText } from 'editor/transforms';
import handleMark from './handleMark';
import handleExternalLink from './handleExternalLink';
import handleNoteLink from './handleNoteLink';
import handleCustomNoteLink from './handleCustomNoteLink';
import handleCustomPubLink from './handleCustomPubLink';
import handlePubLink from './handlePubLink';
import handleBlockReference from './handleBlockReference';
import handleTag from './handleTag';

enum CustomInlineShortcuts {
  CustomNoteLink = 'custom-note-link',
  CustomPubLink = 'custom-pub-link',
}

const INLINE_SHORTCUTS: Array<{
  match: RegExp;
  type:
    | Mark
    | CustomInlineShortcuts
    | ElementType.ExternalLink
    | ElementType.NoteLink
    | ElementType.PubLink
    | ElementType.Tag
    | ElementType.BlockReference;
}> = [
  // Match shortcuts' ElementType
  { match: /(?:^|\s)(\*\*)([^*]+)(\*\*)/, type: Mark.Bold },
  { match: /(?:^|\s)(__)([^_]+)(__)/, type: Mark.Bold },
  { match: /(?:^|\s)(\*)([^*]+)(\*)/, type: Mark.Italic },
  { match: /(?:^|\s)(_)([^_]+)(_)/, type: Mark.Italic },
  { match: /(?:^|\s)(`)([^`]+)(`)/, type: Mark.Code },
  { match: /(?:^|\s)(~~)([^~]+)(~~)/, type: Mark.Strikethrough },
  { match: /(?:^|\s)(\[)(.+)(\]\()(.+)(\))/, type: ElementType.ExternalLink }, // []()
  { match: /(?:^|\s)(\[\[)(.+)(\]\])/, type: ElementType.NoteLink },
  { match: /(?:^|\s)(\{\{)(.+)(\}\})/, type: ElementType.PubLink },
  { match: /(?:^|\s)(\(\()(.+)(\)\))/, type: ElementType.BlockReference },
  { match: /(?:^|\s)(#[^\s]+)(\s)/, type: ElementType.Tag },
  {
    match: /(?:^|\s)(\[)(.+)(\]\(\[\[)(.+)(\]\]\))/, // []([[]])
    type: CustomInlineShortcuts.CustomNoteLink,
  },
  {
    match: /(?:^|\s)(\[)(.+)(\]\(\{\{)(.+)(\}\}\))/, // []({{}})
    type: CustomInlineShortcuts.CustomPubLink,
  },
];

// Handle inline shortcuts
const handleInlineShortcuts = (editor: Editor, text: string, isWiki: boolean): boolean => {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) {
    return false;
  }

  for (const shortcut of INLINE_SHORTCUTS) {
    const { match, type } = shortcut;

    // do not handle notelink, blockref if isWiki
    // if (
    //   isWiki && 
    //   ( type === ElementType.BlockReference || 
    //     type === ElementType.NoteLink || 
    //     type === CustomInlineShortcuts.CustomNoteLink || 
    //     type === CustomInlineShortcuts.CustomPubLink
    //   )
    // ) {
    //   continue;
    // }

    const selectionAnchor = editor.selection.anchor;
    const elementStart = Editor.start(editor, selectionAnchor.path);
    const elementRange = { anchor: selectionAnchor, focus: elementStart };
    const elementText = Editor.string(editor, elementRange) + text;
    const result = elementText.match(match);

    if (!result || result.index === undefined) {
      continue;
    }

    const wholeMatch = result[0];
    const endOfMatchOffset = result.index + wholeMatch.length - text.length; // Make sure to subtract text length since it's not in the editor
    const endOfMatchPoint: Point = {
      offset: endOfMatchOffset,
      path: selectionAnchor.path,
    };

    // Continue if the match does not end at the current selection
    // Ensures that we only just triggered the auto markdown with the text we inserted
    if (endOfMatchOffset !== editor.selection.anchor.offset) {
      continue;
    }

    let handled = false;
    if (isMark(type)) {
      handled = handleMark(editor, type, result, endOfMatchPoint, text.length);
    } else if (type === ElementType.ExternalLink) {
      handled = handleExternalLink(
        editor,
        result,
        endOfMatchPoint,
        text.length
      );
    } else if (type === ElementType.NoteLink) {
      handled = isWiki ? false : handleNoteLink(
        editor, 
        result, 
        endOfMatchPoint, 
        text.length
      );
    } else if (type === CustomInlineShortcuts.CustomNoteLink) {
      handled = isWiki ? false : handleCustomNoteLink(
        editor,
        result,
        endOfMatchPoint,
        text.length
      );
    } else if (type === ElementType.BlockReference) {
      handled = isWiki ? false : handleBlockReference(
        editor,
        result,
        endOfMatchPoint,
        elementText === wholeMatch,
        text.length
      );
    } else if (type === ElementType.PubLink) {
      handled = handlePubLink(editor, result, endOfMatchPoint, text.length);
    } else if (type === CustomInlineShortcuts.CustomPubLink) {
      handled = isWiki ? false : handleCustomPubLink(
        editor,
        result,
        endOfMatchPoint,
        text.length
      );
    } else if (type === ElementType.Tag) {
      handled = handleTag(editor, result, endOfMatchPoint, text.length);
    }

    if (handled) {
      return handled;
    }
  }

  return false;
};

// If the normalized note title exists, then returns the existing note id.
// Otherwise, creates a new note id.
export const getOrCreateNoteId = (title: string, is_wiki = false): string | null => {
  let noteId;
  const noteTitle = title.trim();
  const notes = store.getState().notes;
  const notesArr = Object.values(notes);
  const myNotes = notesArr.filter(n => !n.is_wiki);
  const matchingNote = myNotes.find((note) =>
    ciStringEqual(note.title, noteTitle) && 
    note.is_wiki == is_wiki 
  );

  if (matchingNote) {
    noteId = matchingNote.id;
  } else {
    noteId = uuidv4();
    const is_daily = regDateStr.test(noteTitle);
    const newNote = {
      ...defaultNote,
      id: noteId, 
      title: noteTitle, 
      is_wiki,
      is_daily, 
    };
    store.getState().upsertNote(newNote);
    // new FileHandle and set in store
    if (!is_wiki) {
      getOrNewFileHandle(newNote.title); // cannot await here, to avoid awaits propagation
    }

    const offlineMode = store.getState().offlineMode;
    if (!offlineMode || is_wiki) {
      const authId = apiClient.auth.user()?.id;
      if (!offlineMode && !authId && !is_wiki) {
        return noteId;
      }
      const userId = authId || defaultUserId;
      const upsertData = {...newNote, user_id: is_wiki ? defaultUserId : userId };
      
      // The note id may update on upsert old Note, 
      // noteid (db/linking) consistence issue:
      // private notes: can assert new in this else branch, no such issue,
      // wiki notes: the id maybe used in others' PubLink, must be consistent:
      //   handle PubLink: searching triggered before autocomplete, minimal issue,
      //   handle CustomPubLink: trigger bug if input the title of a old note,
      // FIXME: stopgap - ignore dup on upsert, minimize the effect on linking, 
      //                  but will confuse user: new linking is invalid.
      upsertDbNote(upsertData, userId); // cannot await here for it will propagate awaits
    }
  }

  return noteId;
};

type MarkupLengths = { startMark: number; text: number; endMark: number };
type MarkupLengthsWithTextToInsert = MarkupLengths & { textToInsert: number };

// Gets the markup lengths to remove, given that the textToInsertLength is the length
// of the text that has not been inserted into the editor
const getMarkupLengths = (
  markupLengths: MarkupLengthsWithTextToInsert
): MarkupLengths => {
  let currTextToInsertLength = markupLengths.textToInsert;
  let currStartMarkLength = markupLengths.startMark;
  let currTextLength = markupLengths.text;
  let currEndMarkLength = markupLengths.endMark;

  // Subtract textToInsertLength from the end mark
  if (currTextToInsertLength > 0 && currEndMarkLength > 0) {
    currEndMarkLength = Math.max(currEndMarkLength - currTextToInsertLength, 0);
    currTextToInsertLength -= markupLengths.endMark - currEndMarkLength;
  }

  // Subtract textToInsertLength from the text
  if (currTextToInsertLength > 0 && currTextLength > 0) {
    currTextLength = Math.max(currTextLength - currTextToInsertLength, 0);
    currTextToInsertLength -= markupLengths.text - currTextLength;
  }

  // Subtract textToInsertLength from the start mark
  if (currTextToInsertLength > 0 && currStartMarkLength > 0) {
    currStartMarkLength = Math.max(
      currStartMarkLength - currTextToInsertLength,
      0
    );
    currTextToInsertLength -= markupLengths.startMark - currStartMarkLength;
  }

  return {
    startMark: currStartMarkLength,
    text: currTextLength,
    endMark: currEndMarkLength,
  };
};

// Deletes beginning and ending markup and returns the range of the text in the middle
export const deleteMarkup = (
  editor: Editor,
  point: Point,
  lengths: MarkupLengthsWithTextToInsert
): Range => {
  const {
    startMark: startMarkLength,
    text: textLength,
    endMark: endMarkLength,
  } = getMarkupLengths(lengths);

  const pointPath = point.path;
  let pointOffset = point.offset;

  // Delete the ending mark
  deleteText(editor, pointPath, pointOffset, endMarkLength);
  pointOffset -= endMarkLength;

  // Delete the start mark
  deleteText(editor, pointPath, pointOffset - textLength, startMarkLength);
  pointOffset -= startMarkLength;

  // Return range of the text to format
  return {
    anchor: { path: pointPath, offset: pointOffset },
    focus: {
      path: pointPath,
      offset: pointOffset - textLength,
    },
  };
};

export default handleInlineShortcuts;
