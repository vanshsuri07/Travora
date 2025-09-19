import { useEffect, useState } from "react";
import { getAllTrips, getWishlist } from "~/appwrite/trips";
import { getUser } from "~/appwrite/auth";
import UpcomingTrips from "../../../components/UpcomingTrips";
import Wishlist from "../../../components/Wishlist";
import WelcomeSection from "../../../components/Welcome";
import type { Models } from "appwrite";

const Home = () => {
  const [user, setUser] = useState<Models.Document | null>(null);
  const [trips, setTrips] = useState<Models.Document[]>([]);
  const [wishlist, setWishlist] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = await getUser();
        if (currentUser && 'email' in currentUser) {
          setUser(currentUser);
          const [tripsData, wishlistData] = await Promise.all([
            getAllTrips(10, 0),
            getWishlist(currentUser.$id),
          ]);
          setTrips(tripsData.allTrips);
          setWishlist(wishlistData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleWishlistChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <WelcomeSection />
      <UpcomingTrips
        trips={trips as any}
        onFetchTrips={() => getAllTrips(10, 0).then(data => data.allTrips) as any}
        refreshTrigger={refreshTrigger}
        userId={user?.$id}
        wishlist={wishlist}
        onWishlistChange={handleWishlistChange}
      />
      <Wishlist wishlist={wishlist} />
    </div>
  );
};

export default Home;