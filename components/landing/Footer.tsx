import Link from 'next/link';
import LogoWithText from 'components/LogoWithText';

type Props = {
  className?: string;
};

export default function Footer(props: Props) {
  const { className } = props;
  return (
    <div className={`pt-4 pb-12 ${className}`}>
      <div className="container flex flex-col justify-between px-6 lg:flex-row">
        <div className="inline-block">
          <LogoWithText text="mds I/O" />
        </div>
        <div className="flex flex-wrap flex-col lg:flex-row mt-2">
          <Link href="/app/demo">
            <a className="m-1 text-gray-300 hover:text-primary-500">About</a>
          </Link>
          <Link href="/privacy">
            <a className="m-1 text-gray-300 hover:text-primary-500">Privacy</a>
          </Link>
          <Link href="/terms">
            <a className="m-1 text-gray-300 hover:text-primary-500">Terms</a>
          </Link>
          <Link href="/helpus">
            <a className="m-1 text-green-300 hover:text-primary-500">
              HelpUs
            </a>
          </Link>
          <a
            href="https://discord.gg/EXYSEHRTFt"
            className="m-1 text-gray-300 hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
          <a
            href="https://bsky.app/profile/mdsilo.com"
            className="m-1 text-gray-300 hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bluesky
          </a>
        </div>
      </div>
    </div>
  );
}
