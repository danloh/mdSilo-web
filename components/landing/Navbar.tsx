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
      </div>
    </div>
  );
}
