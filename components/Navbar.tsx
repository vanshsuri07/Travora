import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router"; // Use react-router-dom for v6+
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

// Define User type
interface User {
  name: string;
  email: string;
  imageUrl?: string;
}

// ====================================================================
// 1. Upgraded User Profile Dropdown Component
// ====================================================================
const UserProfileDropdown = ({
  onLogout,
  user,
}: {
  onLogout: () => void;
  user: User | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
    open: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  };

  if (!user) return null;

  return (
    <div className="relative"  onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)} >
      <button
       
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 font-bold text-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="rounded-full w-10 h-10 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xl">{user.name?.charAt(0).toUpperCase()}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl z-50 ring-1 ring-black ring-opacity-5 origin-top-right"
          >
            <div className="p-4 border-b border-gray-200">
              <p className="font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <div className="py-2">
              {/* <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaUserCircle className="text-gray-400" /> My Profile
              </Link> */}
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                <FaSignOutAlt className="text-red-400" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ====================================================================
// 2. Animated Mobile Menu Toggle Button
// ====================================================================
const MenuToggle = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <button onClick={toggle} className="relative z-50 w-8 h-8 text-black">
      <motion.div
        animate={isOpen ? "open" : "closed"}
        className="w-6 h-6 absolute"
      >
        <motion.span
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: 45, y: 5 },
          }}
          className="block absolute h-0.5 w-6 bg-current"
          style={{ top: "25%" }}
        />
        <motion.span
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          className="block absolute h-0.5 w-6 bg-current"
          style={{ top: "50%" }}
        />
        <motion.span
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: -45, y: -5 },
          }}
          className="block absolute h-0.5 w-6 bg-current"
          style={{ top: "75%" }}
        />
      </motion.div>
    </button>
  );
};


// ====================================================================
// 3. Upgraded Main Navbar Component
// ====================================================================
interface NavbarProps {
  onLogout: () => void;
  user?: User | null;
}

const Navbar = ({ onLogout, user }: NavbarProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll listener to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isUserRoute = location.pathname.startsWith("/user");

  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About Us" },
    { href: "/#tours", label: "Tours" },
    { href: "/contact", label: "Contact" },
  ];

  const userLinks = [
    { href: "/user", label: "Home" },
    { href: "/user/my-trip", label: "My Trips" },
    { href: "/user#wishlist", label: "Wishlist" },
    { href: "/contact", label: "Contact" },
  ];

  const navLinks = isUserRoute ? userLinks : guestLinks;
  
  const mobileMenuVariants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    open: { x: 0, transition: { type: "tween", duration: 0.3, staggerChildren: 0.1 } },
  };

  const mobileLinkVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-40 font-poppins transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/assets/icons/logo.svg"
                alt="Travora Logo"
                className="h-9 w-9"
              />
              <span className={`font-bold text-3xl transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Travora
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-4 py-2 text-lg font-medium rounded-full transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                  }`}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink("")}
                >
                  {hoveredLink === link.label && (
                    <motion.span
                      layoutId="hover-underline"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:block">
              {isUserRoute && user ? (
                <UserProfileDropdown onLogout={onLogout} user={user} />
              ) : (
                <Link to="/sign-in">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Sign In
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden">
              <MenuToggle
                isOpen={isMobileMenuOpen}
                toggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map(link => (
              <motion.div key={link.label} variants={mobileLinkVariants}>
                <Link
                  to={link.href}
                  className="text-gray-800 text-3xl font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={mobileLinkVariants} className="pt-8">
              {isUserRoute ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-red-500"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;