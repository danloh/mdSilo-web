import { useMemo } from 'react';
import useHotkeys from 'editor/hooks/useHotkeys';
import Billing from './Billing';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function BillingModal(props: Props) {
  const { setIsOpen } = props;

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

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-500 opacity-70"
        onClick={() => setIsOpen(false)}
      />
      <div className="flex items-center justify-center h-screen px-6">
        <div className="z-30 flex flex-col w-full h-full max-w-full overflow-hidden bg-white rounded sm:flex-row sm:max-h-176 sm:w-240 shadow-popover">
          <Billing />
        </div>
      </div>
    </div>
  );
}
