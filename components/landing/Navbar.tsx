import LogoWithText from 'components/LogoWithText';
import Logo from 'components/Logo';
import NavDrop from './NavDrop';

type Props = {
  withText?: boolean;
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
};

export default function Navbar(props: Props) {
  const { withText = false, onNew, onOpen, onSave } = props;
  return (
    <div className="container px-6 pt-6">
      <div className="flex items-center justify-between space-x-6">
        {withText ? (<LogoWithText />) : (<Logo />)}
        {onNew && onOpen && onSave 
          ? (<NavDrop onNew={onNew} onOpen={onOpen} onSave={onSave} />) 
          : null 
        }
      </div>
    </div>
  );
}
