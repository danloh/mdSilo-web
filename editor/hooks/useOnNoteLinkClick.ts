import { useCallback } from 'react';
import { useCurrentViewContext } from 'context/useCurrentView';
import { refreshFile } from 'editor/hooks/useRefresh';

export default function useOnNoteLinkClick() {
  const currentView = useCurrentViewContext();
  const dispatch = currentView.dispatch;

  const onClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (toId: string, highlightedPath?: any) => {
      const note = await refreshFile(toId);
      console.log("note", note)
      if (!note) return;
      const noteId = note.id;
      const hash = highlightedPath ? `0-${highlightedPath}` : ''; // TODO
      dispatch({view: 'md', params: {noteId, hash}});
      return;
    },
    [dispatch]
  );

  return { onClick };
}
