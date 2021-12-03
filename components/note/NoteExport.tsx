import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { IconFileExport, IconFileDownload } from '@tabler/icons';
import { Note } from 'types/model';
import { store, NotesData } from 'lib/store';
import serialize from 'editor/serialization/serialize';
import { DropdownItem } from 'components/Dropdown';

type Props = {
  note: Note;
};

export function NoteExport(props: Props) {
  const { note } = props;

  const onExportClick = useCallback(async () => {
    saveAs(getNoteAsBlob(note), `${note.title}.md`);
  }, [note]);

  return (
    <DropdownItem onClick={onExportClick}>
      <IconFileExport size={18} className="mr-1" />
      <span>Export</span>
    </DropdownItem>
  );
}

export function NoteExportAll() {
  const onExportAllClick = useCallback(exportAllNotes, []);

  return (
    <DropdownItem onClick={onExportAllClick}>
      <IconFileDownload size={18} className="mr-1" />
      <span>Export All</span>
    </DropdownItem>
  );
}

export const exportAllNotes = async () => {
  const zip = new JSZip();

  const notesObj = store.getState().notes;
  // json real all notes, including wiki note
  const notesJson = buildNotesJson();
  zip.file('all_mdSilo.json', notesJson);

  // but do not export mds for wiki note
  const notesArr = Object.values(notesObj);
  const myNotes = notesArr.filter(n => !n.is_wiki);
  for (const note of myNotes) {
    const fileName = note.is_wiki ? `wiki_${note.title}.md` : `${note.title}.md`;
    zip.file(fileName, getNoteAsBlob(note));
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });
  const now = nowToRadix36Str();
  saveAs(zipContent, `mdSilo-export-${now}.zip`);
};

export const exportNotesJson = async () => {
  const notesJson = buildNotesJson();
  const jsonContent = new Blob([notesJson], {
    type: 'application/json;charset=utf-8',
  });
  const now = nowToRadix36Str();
  saveAs(jsonContent, `mdSilo-json-${now}.json`);
};

export const getSerializedNote = (note: Note) =>
  note.content.map((n) => serialize(n)).join('');

export const getNoteAsBlob = (note: Note) => {
  const serializedContent = getSerializedNote(note);
  const blob = new Blob([serializedContent], {
    type: 'text/markdown;charset=utf-8',
  });
  return blob;
};

const buildNotesJson = () => {
  const notesObj = store.getState().notes;
  const noteTree = store.getState().noteTree;
  const wikiTree = store.getState().wikiTree;
  const notesData: NotesData = {notesObj, noteTree, wikiTree};
  const notesJson = JSON.stringify(notesData);
  return notesJson;
}

const nowToRadix36Str = () => {
  const now = Math.floor(Date.now() / 100); // 0.1s
  const strR = now.toString(36); // radix = 36
  return strR;
}
