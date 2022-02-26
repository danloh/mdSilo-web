import { useMemo } from 'react';
import useHotkeys from 'editor/hooks/useHotkeys';
import useDeleteNote from 'editor/hooks/useDeleteNote';
import { BaseModal } from 'components/settings/BaseModal';

type Props = {
  noteId: string;
  isOpen: boolean;
  handleClose: () => void;
};

export default function NoteDelModal(props: Props) {
  const { noteId, isOpen, handleClose } = props;

  const hotkeys = useMemo(
    () => [
      {
        hotkey: 'esc',
        callback: handleClose,
      },
    ],
    [handleClose]
  );
  useHotkeys(hotkeys);

  const onDeleteClick = useDeleteNote(noteId);

  return (
    <BaseModal title="Delete This Work?" isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col justify-center px-6">
        <button className="mt-2 font-bold text-red-600 pop-btn" onClick={onDeleteClick}>
          Confirm Delete
        </button>
        <button className="mt-4 font-bold pop-btn" onClick={handleClose}>
          Cancel Delete
        </button>
      </div>
    </BaseModal>
  );
}
