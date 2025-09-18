import { Outlet, useLoaderData } from 'react-router';
import { user as userApi } from '~/appwrite/sessions';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { production, addToWishlist, getWishlist, removeFromWishlist } from '~/appwrite/trips';
import { useEffect, useState } from 'react';
import MobileSidebar from 'components/MobileSlidebar';
import Wishlist from 'components/Wishlist';


export const loader = async () => {
  const user = await userApi.get();
  const trips = await production.getAll();
  const wishlist = await getWishlist(user.$id);
  return { user, trips, wishlist };
};



const UserLayout = () => {
  const { user, trips, wishlist } = useLoaderData();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistedTrips, setWishlistedTrips] = useState(wishlist.map(item => item.tripId));

  const handleToggleWishlist = async (tripId) => {
    if (wishlistedTrips.includes(tripId)) {
      await removeFromWishlist(tripId, user.$id);
      setWishlistedTrips((prev) => prev.filter((id) => id !== tripId));
    } else {
      await addToWishlist(tripId, user.$id);
      setWishlistedTrips((prev) => [...prev, tripId]);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar user={user} toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet context={{ user, trips, wishlistedTrips, handleToggleWishlist }} />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
