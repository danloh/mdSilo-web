import Link from 'next/link';
import Logo from './Logo';

export default function LogoWithText({text} : {text?: string}) {
  return (
    <Link href="/">
      <a className="flex items-center">
        <Logo width={36} height={36} />
        <span className="ml-2 text-xl font-medium text-white">{text || 'mdSilo'}</span>
      </a>
    </Link>
  );
}
