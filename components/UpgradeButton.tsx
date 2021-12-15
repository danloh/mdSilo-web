import { useMemo } from 'react';
import { IconArrowUpCircle } from '@tabler/icons';
import { Feature } from 'constants/pricing';
import { useStore } from 'lib/store';
import Tooltip from './misc/Tooltip';

type Props = {
  feature: Feature;
  className?: string;
};

export default function UpgradeButton(props: Props) {
  const { feature, className = '' } = props;

  const setIsUpgradeModalOpen = useStore(
    (state) => state.setIsUpgradeModalOpen
  );

  const content = useMemo(() => {
    if (feature === Feature.NumOfNotes) {
      return `Upgrade for unlimited writing.`;
    } else {
      return 'Please Subscribe Any Add-on Service.';
    }
  }, [feature]);

  return (
    <Tooltip content={content}>
      <span
        className={`flex items-center p-2 text-xs btn ${className}`}
        onClick={() => setIsUpgradeModalOpen(true)}
      >
        <IconArrowUpCircle size={18} className="flex-shrink-0 mr-1" />
        <span className="whitespace-nowrap">Need to Subscribe Add-on Service</span>
      </span>
    </Tooltip>
  );
}
