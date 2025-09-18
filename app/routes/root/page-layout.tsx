import { Outlet } from 'react-router';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer'
import { useState } from 'react';

const PageLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false

  const handleLogin = () => {
    // Your login logic here...
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Your logout logic here (clear tokens, etc.)...
    console.log("User logged out");
    setIsAuthenticated(false);
  };
  return (
    <main className="relative">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />
      <section>
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default PageLayout;
