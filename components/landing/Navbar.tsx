import LogoWithText from 'components/LogoWithText';
import Logo from 'components/Logo';
import NavDrop from './NavDrop';

export default function Navbar({ withText = true }: { withText?: boolean}) {
  return (
    <div className="container px-6 pt-6">
      <div className="flex items-center justify-between space-x-6">
        {withText ? (<LogoWithText />) : (<Logo />)}
        <NavDrop />
      </div>
    </div>
  );
}
