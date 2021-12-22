import Link from 'next/link';
import {
  IconInfoCircle,
  IconBrandDiscord,
  IconHelp,
  IconTag,
} from '@tabler/icons';

type SidebarFootProps = {
  className?: string;
};

export default function SidebarFoot(props: SidebarFootProps) {
  const { className = '' } = props;

  return (
    <div className={`flex items-center justify-between border-t dark:border-gray-700 ${className}`}>
      <Link href="/about">
        <a title="About mdSilo"><IconInfoCircle size={18} className="mr-1" /></a>
      </Link>
      <Link href="/sponsors">
        <a title="Pricing"><IconTag size={18} className="mr-1" /></a>
      </Link>
      <Link href="/app/demo">
        <a title="Get Started"><IconHelp size={18} className="mr-1" /></a>
      </Link>
      <a
        href="https://discord.gg/EXYSEHRTFt"
        target="_blank"
        rel="noopener noreferrer"
        title="Discuss on Discord"
      >
        <IconBrandDiscord size={18} className="mr-1" />
      </a>
    </div>
  );
}
