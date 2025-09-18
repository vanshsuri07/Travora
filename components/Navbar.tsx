import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router'; // Assuming you're using an older version of react-router



  interface User {
  name: string;
  email: string;
  imageUrl?: string;
}

// A simple component for the user profile dropdown
const UserProfileDropdown = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useLoaderData();
 
 


  return (

    <div className="relative">
      <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 font-bold text-lg overflow-hidden"
    >
      <img src={user?.imageUrl || '/assets/images/david.webp'} alt={user?.name || 'user'} referrerPolicy="no-referrer"  />
    </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            My Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};


// Main Navbar Component
interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define links for guests and authenticated users
  const guestLinks = [
    { href: '/users/home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#tours', label: 'Tours' },
    { href: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    { href: '/user', label: 'Home' },
    { href: '/my-trips', label: 'My Trips' },
    { href: '/wishlist', label: 'Wishlist' },
    { href: '/contact', label: 'Contact' },
  ];

  const navLinks = isAuthenticated ? userLinks : guestLinks;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg font-poppins text-black">
      <div className="wrapper py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/users/home" className="flex items-center gap-2">
            <img
              src="/assets/icons/logo.svg"
              alt="Travora Logo"
              className="h-8 w-8"
            />
            <span className="font-semibold text-2xl text-black">Travora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-lg font-semibold hover:text-gray-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Conditional Action Area: Sign In Button or User Profile */}
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <UserProfileDropdown onLogout={onLogout}  />
            ) : (
              <Link to="/sign-in">
                <button
                  className="px-5 py-2 rounded-lg font-semibold text-white 
                  bg-gradient-to-r from-blue-500 to-purple-500 
                  hover:from-purple-500 hover:to-pink-500 
                  transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-black">
              <img src="/assets/icons/menu.svg" alt="Menu" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-lg z-40 flex flex-col items-center justify-center">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-6 text-white text-4xl" aria-label="Close menu">&times;</button>
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-white text-2xl" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
               {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-8 py-3 rounded-lg font-semibold text-black bg-white"
                  >
                    Sign Out
                  </button>
               ) : (
                  <Link to="/sign-in">
                    <button className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500">
                      Sign In
                    </button>
                  </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;