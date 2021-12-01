import { useState } from 'react';
import { IconMenu2 } from '@tabler/icons';
import LogoWithText from 'components/LogoWithText';
import NavMenu from './NavMenu';

export default function Navbar() {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  return (
    <div className="container px-6 pt-6">
      <div className="flex items-center justify-between space-x-6">
        <LogoWithText />
        <button
          type="button"
          onClick={() => setIsNavMenuOpen(true)}
          className="inline-flex items-center justify-center p-2 transition duration-150 ease-in-out  hover:bg-yellow-100"
        >
          <IconMenu2 className="text-gray-500" />
        </button>
      </div>
      <NavMenu isOpen={isNavMenuOpen} setIsOpen={setIsNavMenuOpen} />
    </div>
  );
}
