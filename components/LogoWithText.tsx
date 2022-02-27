import Link from 'next/link';
import Logo from './Logo';

export default function LogoWithText() {
  return (
    <Link href="/">
      <a className="flex items-center">
        <Logo width={36} height={36} />
        <span className="ml-2 text-xl font-medium">mdSilo</span>
      </a>
    </Link>
  );
}
