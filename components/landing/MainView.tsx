import { ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
};

export default function MainView(props: Props) {
  const {
    children,
    showNavbar = true,
    showFooter = false,
    className = '',
  } = props;

  return (
    <div className={`min-h-screen font-display ${className}`}>
      {showNavbar ? <Navbar withText={true} /> : null}
      {children}
      {showFooter ? <Footer /> : null}
    </div>
  );
}
