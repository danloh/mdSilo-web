import { useMemo } from 'react';
import Head from 'next/head';
import { createEditor, Editor, Element, Node } from 'slate';
import type { NoteLink, PubLink } from 'editor/slate';
import { ElementType } from 'editor/slate';
import type { GraphData } from 'components/editor/ForceGraph';
import ForceGraph from 'components/editor/ForceGraph';
import { NoteTreeItem, useStore } from 'lib/store';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import OpenSidebarButton from 'components/sidebar/OpenSidebarButton';

export default function Graph() {
  const notes = useStore((state) => state.notes);
  const noteTree = useStore((state) => state.noteTree);
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  // Compute graph data
  const graphData: GraphData = useMemo(() => {
    const data: GraphData = { nodes: [], links: [] };
    const notesArr = Object.values(notes);

    // Initialize linksByNoteId
    const linksByNoteId: Record<string, Set<string>> = {};
    for (const note of notesArr) {
      linksByNoteId[note.id] = new Set();
    }

    const genLinkPerNoteTree = (tree: NoteTreeItem[]) => {
      for (const item of tree) {
        const children = item.children;
        if (children.length > 0) {
          for (const child of children) {
            linksByNoteId[item.id].add(child.id);
            linksByNoteId[child.id].add(item.id);
            const subChildren = child.children;
            genLinkPerNoteTree(subChildren);
          }
        }
      }
    }

    // Search for links in each note
    for (const note of notesArr) {
      const editor = createEditor();
      editor.children = note.content;

      // Find note link elements that match noteId
      // also find PubLink
      const matchingElements = Editor.nodes(editor, {
        at: [],
        match: (n) =>
          Element.isElement(n) &&
          (n.type === ElementType.NoteLink || n.type === ElementType.PubLink) &&
          !!Node.string(n), // ignore note links with empty link text
      });

      // Update linksByNoteId per noteLink
      for (const [node] of matchingElements) {
        const noteLinkElement = node as NoteLink | PubLink;

        // Skip the node if it doesn't link to an existing note
        if (!linksByNoteId[noteLinkElement.noteId]) {
          continue;
        }

        // Add the link to each note set
        linksByNoteId[note.id].add(noteLinkElement.noteId);
        linksByNoteId[noteLinkElement.noteId].add(note.id);
      }
    }

    // Update linksByNoteId per noteTree nested structure
    genLinkPerNoteTree(noteTree);

    // Create graph data
    for (const note of notesArr) {
      // Populate links
      const linkedNoteIds = linksByNoteId[note.id].values();
      const numOfLinks = linksByNoteId[note.id].size;
      for (const linkedNoteId of linkedNoteIds) {
        data.links.push({ source: note.id, target: linkedNoteId });
      }
      // Populate nodes
      data.nodes.push({
        id: note.id,
        name: note.title,
        radius: getRadius(numOfLinks),
      });
    }

    return data;
  }, [notes, noteTree]);

  return (
    <>
      <Head>
        <title>Graph View | mdSilo</title>
      </Head>
      <ErrorBoundary>
        {!isSidebarOpen ? (
          <OpenSidebarButton className="absolute top-0 left-0 z-10 mx-4 my-1" />
        ) : null}
        <ForceGraph data={graphData} className="flex-1" />
      </ErrorBoundary>
    </>
  );
}

const getRadius = (numOfLinks: number) => {
  const MAX_RADIUS = 10;
  const BASE_RADIUS = 3;
  const LINK_MULTIPLIER = 0.5;
  return Math.min(BASE_RADIUS + LINK_MULTIPLIER * numOfLinks, MAX_RADIUS);
};


