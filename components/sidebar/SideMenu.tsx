import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconMenu2, IconDna, IconBookmarks, IconCheckbox } from '@tabler/icons';
import { useStore } from 'lib/store';
import { isMobile } from 'utils/helper';
import Tooltip from 'components/misc/Tooltip';
import Logo from 'components/Logo';
import SidebarItem from './SidebarItem';

export default function SideMenu() {
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const hideSidebarOnMobile = useCallback(() => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  }, [setIsSidebarOpen]);

  return (    
    <div className="flex flex-col h-full">
      <div className="text-center p-2">
        <Logo width={36} height={36} />
      </div>
      <OpenButton />
      <ChronButton onClick={hideSidebarOnMobile} />
      <GraphButton onClick={hideSidebarOnMobile} />
      <TaskButton onClick={hideSidebarOnMobile} />
    </div>
  );
}

const btnClass = 'title flex items-center text-lg p-2';
const btnIconClass = 'flex-shrink-0 mx-1 text-gray-600 dark:text-gray-400';

const OpenButton = () => {
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const isSidebarOpen: boolean = useStore((state) => state.isSidebarOpen);

  return (
    <SidebarItem isHighlighted={isSidebarOpen}>
      <Tooltip content="Toggle Sidebar (Alt+X)" placement="right" touch={true}>
        <button
          aria-label="Toggle Sidebar"
          className={btnClass}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <IconMenu2 size={24} className={btnIconClass} />
        </button>
      </Tooltip>
    </SidebarItem>
  );
}

type ButtonProps = {
  onClick: () => void;
};

const GraphButton = (props: ButtonProps) => {
  const { onClick } = props;
  const router = useRouter();

  return (
    <SidebarItem
      isHighlighted={router.pathname.includes('/app/graph')}
      onClick={onClick}
    >
      <Tooltip
        content="Visualization of networked writings (Ctrl+Shift+G)"
        placement="right"
        touch={true}
      >
        <span>
          <Link href="/app/graph">
            <a className={btnClass}>
              <IconDna size={24} className={btnIconClass} />
            </a>
          </Link>
        </span>
      </Tooltip>
    </SidebarItem>
  );
};

const ChronButton = (props: ButtonProps) => {
  const { onClick } = props;
  const router = useRouter();

  return (
    <SidebarItem
      isHighlighted={router.pathname.includes('/app/chronicle')}
      onClick={onClick}
    >
      <Tooltip
        content="Chronicle View (Ctrl+Shift+C)"
        placement="right"
        touch={true}
      >
        <span>
          <Link href="/app/chronicle">
            <a className={btnClass}>
              <IconBookmarks size={24} className={btnIconClass} />
            </a>
          </Link>
        </span>
      </Tooltip>
    </SidebarItem>
  );
};

const TaskButton = (props: ButtonProps) => {
  const { onClick } = props;
  const router = useRouter();

  return (
    <SidebarItem
      isHighlighted={router.pathname.includes('/app/tasks')}
      onClick={onClick}
    >
      <Tooltip
        content="Track Personal Tasks (Ctrl+Shift+T)"
        placement="right"
        touch={true}
      >
        <span>
          <Link href="/app/tasks">
            <a className={btnClass}>
              <IconCheckbox size={24} className={btnIconClass} />
            </a>
          </Link>
        </span>
      </Tooltip>
    </SidebarItem>
  );
};
