import { useMemo, useState } from 'react';
import useHotkeys from 'editor/hooks/useHotkeys';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
  onInsert: (row: number, col: number) => void;
};

export default function TableModal(props: Props) {
  const { setIsOpen, onInsert } = props;

  const [row, setRow] = useState('');
  const [col, setCol] = useState('');

  const hotkeys = useMemo(
    () => [
      {
        hotkey: 'esc',
        callback: () => setIsOpen(false),
      },
    ],
    [setIsOpen]
  );
  useHotkeys(hotkeys);

  const inputClass = "mt-2 w-24 border-green-800 dark:bg-gray-800 dark:text-gray-200";
  const onClick = (row: string, col: string) => {
    const rowN = Number(row);
    const colN = Number(col);
    if ( rowN < 1 || colN < 1) {
      setIsOpen(false);
    } else {
      onInsert(rowN, colN)
    }
  }

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto">
      <div className="flex justify-center px-6 max-h-screen-80 my-screen-10">
        <input
          type="number"
          className={inputClass}
          placeholder="Rows"
          value={row}
          onChange={(e) => setRow(e.target.value)}
          autoFocus
        />
        <input
          type="number"
          className={inputClass}
          placeholder="Columns"
          value={col}
          onChange={(e) => setCol(e.target.value)}
          autoFocus
        />
        <button className="mt-2 pop-btn" onClick={() => onClick(row, col)}>Ok</button>
      </div>
    </div>
  );
}
