import { Link } from "react-router";
import NavItems from "./NavItems";
import { useState, useEffect, useRef } from "react";

// MobileSidebar component (the overlay sidebar)
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  children, 
  width = 270 
}: MobileSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: `${width}px` }}
      >
        {children}
      </div>
    </>
  );
};

// Main component 
const MobileSlidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="mobile-slidebar wrapper">
      <header className="flex items-center justify-between px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
          <h1 className="text-lg font-bold">Travora</h1>
        </Link>

        <button 
          onClick={toggleSidebar} 
          className="block lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        width={270}
      >
        <NavItems handleClick={toggleSidebar} />
      </MobileSidebar>
    </div>
  );
};

export default MobileSlidebar;