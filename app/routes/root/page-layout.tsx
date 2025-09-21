import { Outlet } from 'react-router';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer'
import { useState, useEffect } from 'react';
import { getUser, logoutUser } from '~/appwrite/auth'; // Import both functions

const PageLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const user = await getUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          console.log("Current user loaded:", user);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // 1. Call Appwrite logout to delete session
      await logoutUser();
      
      // 2. Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear specific items that might be stored separately
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('authToken');
      localStorage.removeItem('cookieFallback');
      
      // 4. Clear cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname.split('.').slice(-2).join('.');
      });
      
      // 5. Reset React state
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      console.log("User logged out successfully");
      
      // 6. Force redirect to home page to ensure complete cleanup
      window.location.href = '/';
      
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Even if Appwrite logout fails, clear everything locally
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies even on error
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
      });
      
      // Reset state even on error
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Still redirect even if there was an error
      window.location.href = '/';
    }
  };

  // Show loading state if needed
  if (isLoading) {
    return (
      <main className="relative">
        {/* <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div> */}
        {/* </div> */}
      </main>
    );
  }

  return (
    <main className="relative">
      <Navbar onLogout={handleLogout} user={currentUser} />
      <section>
        <Outlet context={{ user: currentUser, isAuthenticated, handleLogin }} />
      </section>
      <Footer />
    </main>
  );
};

export default PageLayout;