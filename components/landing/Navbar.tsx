import Link from 'next/link';
import LogoWithText from 'components/LogoWithText';
import Logo from 'components/Logo';

type Props = {
  withText?: boolean;
};

export default function Navbar(props: Props) {
  const { withText = false } = props;
  return (
    <div className="container px-6 pt-6">
      <div className="flex items-center justify-between space-x-6">
        {withText ? (<LogoWithText />) : (<Logo />)}
        <Link href="/sponsors">
          <a className="px-2 text-white bg-green-600 hover:bg-opacity-75 rounded">
            Help Us
          </a>
        </Link>
      </div>
    </div>
  );
}
