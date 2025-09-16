import { useState } from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/users/home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#tours', label: 'Tours' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent font-inter">
      <div className="wrapper py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/users/home">
            <img src="/assets/icons/logo.svg" alt="Travora Logo" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white text-lg hover:text-gray-200 transition-colors">
                {link.label}
              </a>
            ))}
             <Link to="/root/sign-in">
                <button className='button-class'>Sign In</button>
             </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              <img src="/assets/icons/menu.svg" alt="Menu" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-lg z-40 flex flex-col items-center justify-center">
          <button onClick={() => setIsOpen(false)} className="absolute top-8 right-6 text-white text-4xl" aria-label="Close menu">&times;</button>
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white text-2xl" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
             <Link to="/root/sign-in">
                <button className='button-class'>Sign In</button>
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
