import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router';
import { motion } from 'framer-motion';
import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import Wishlist from 'components/Wishlist';
import RecommendedTrips from '../../../components/RecommendedTrips';
import { getUserTrips, getAllTrips, updateUserWishlist } from '~/appwrite/trips';
import { getUser } from '~/appwrite/auth';
import { parseTripData } from '~/lib/utlis';
import { allTrips } from '~/constants';
import LayoutSkeleton from 'components/LayoutSkeleton';

const sectionVariants = {
hidden: { opacity: 0, y: 50 },
visible: {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.8,
    ease: [0.6, -0.05, 0.01, 0.99] as const // A nice easing curve
  }
}
};


const UserLayout = () => {
  const [userTrips, setUserTrips] = useState<FormattedTrip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  


  // Keep the transformed trips for RecommendedTrips (demo data)
  const transformedTrips = allTrips.map(trip => ({
    ...trip,
    $id: trip.id.toString(),
    id: trip.id.toString(),
    interests: trip.tags,
    estimatedPrice: parseFloat(trip.estimatedPrice.replace(/[^0-9.]/g, '')) || 0
  }));

  // Function to fetch user's trips
  interface User {
    accountId: string;
    wishlist?: string[];
    [key: string]: any;
  }

  interface TripDetails {
    [key: string]: any;
  }

  interface UserTripResponse {
    userTrips: Array<{
      $id: string;
      tripDetails: TripDetails;
      imageUrls?: string[];
    }>;
  }

  interface FormattedTrip {
    $id: string;
    id: string;
    imageUrls: string[];
    [key: string]: any;
  }

  const fetchUserTrips = async (currentUser: User): Promise<FormattedTrip[]> => {
    try {
      console.log('Fetching trips for user:', currentUser);

      // Get user's trips
      const response = await getUserTrips(currentUser.accountId, 10, 0);
      console.log('User trips response:', response);

      // Defensive mapping for tripDetails
      const formattedTrips: FormattedTrip[] = (response.userTrips || []).map((doc: any) => {
        const tripDetails = doc.tripDetails || {};
        return {
          $id: doc.$id ?? '',
          id: doc.$id ?? '',
          name: tripDetails.name ?? '',
          imageUrls: Array.isArray(doc.imageUrls) ? doc.imageUrls : [],
          interests: tripDetails.tags ?? [],
          estimatedPrice: tripDetails.estimatedPrice ? parseFloat(String(tripDetails.estimatedPrice).replace(/[^0-9.]/g, '')) : 0,
          itinerary: tripDetails.itinerary ?? [],
          tags: tripDetails.tags ?? [],
          travelStyle: tripDetails.travelStyle ?? '',
        };
      });

      return formattedTrips;

    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  };

  // Single useEffect for authentication and data loading
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check authentication
        const currentUserRaw = await getUser();
        console.log('Current user:', currentUserRaw);

        // Type guard for user
        let currentUser: User | null = null;
        if (currentUserRaw && typeof currentUserRaw === 'object') {
          // Try to extract accountId and wishlist
          const accountId = (currentUserRaw as any).accountId ?? (currentUserRaw as any).$id ?? '';
          const wishlist = Array.isArray((currentUserRaw as any).wishlist) ? (currentUserRaw as any).wishlist : [];
          currentUser = { accountId, wishlist, ...currentUserRaw };
        }

        if (!currentUser || !currentUser.accountId) {
          setAuthChecked(true);
          setLoading(false);
          return; // Will trigger redirect
        }

        setUser(currentUser);
        setWishlist(currentUser.wishlist || []);
        setAuthChecked(true);

        // Fetch user trips
        const trips = await fetchUserTrips(currentUser);
        setUserTrips(trips);
        
      } catch (err) {
        console.error('Error initializing user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user data');
        setAuthChecked(true);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, []);

  const toggleWishlist = useCallback(async (tripId: string) => {
    if (!user || !user.accountId) return;
    const newWishlist = wishlist.includes(tripId)
      ? wishlist.filter(id => id !== tripId)
      : [...wishlist, tripId];

    setWishlist(newWishlist);

    try {
      await updateUserWishlist(user.accountId, newWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Revert wishlist on error
      setWishlist(wishlist);
    }
  }, [user, wishlist]);

  const refetchTrips = async () => {
    if (!user || !user.accountId) return;
    try {
      setError(null);
      const trips = await fetchUserTrips(user);
      setUserTrips(trips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh trips');
      console.log(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const wishlistedTrips = [
    ...userTrips,
    ...transformedTrips,
  ].filter(trip => wishlist.includes(trip.id)).map(trip => ({
    ...trip,
    name: trip.name ?? '',
    imageUrls: Array.isArray(trip.imageUrls) ? trip.imageUrls : [],
    interests: trip.interests ?? [],
    estimatedPrice: trip.estimatedPrice ?? 0,
    itinerary: trip.itinerary ?? [],
    tags: trip.tags ?? [],
    travelStyle: trip.travelStyle ?? '',
  }));

  // Show loading while checking authentication
   if (loading) {
  return <LayoutSkeleton />;
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
  return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className='bg-white'>
      <WelcomeSection />

      <motion.div
        className="px-4 sm:px-6 lg:px-5 py-10 space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >  
       <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <UpcomingTrips 
            trips={userTrips.map(trip => ({
              ...trip,
              name: trip.name ?? '',
              imageUrls: Array.isArray(trip.imageUrls) ? trip.imageUrls : [],
              interests: trip.interests ?? [],
              estimatedPrice: trip.estimatedPrice ?? 0,
              itinerary: trip.itinerary ?? [],
              tags: trip.tags ?? [],
              travelStyle: trip.travelStyle ?? '',
            }))} 
            onFetchTrips={refetchTrips}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        </motion.section>

        <motion.section
          id="wishlist"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Wishlist
            wishlistedTrips={wishlistedTrips}
            toggleWishlist={toggleWishlist}
          />
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RecommendedTrips 
            trips={transformedTrips.map(trip => ({
              ...trip,
              name: trip.name ?? '',
              imageUrls: Array.isArray(trip.imageUrls) ? trip.imageUrls : [],
              interests: trip.interests ?? [],
              estimatedPrice: trip.estimatedPrice ?? 0,
              itinerary: trip.itinerary ?? [],
              tags: trip.tags ?? [],
              travelStyle: trip.travelStyle ?? '',
            }))} 
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        </motion.section>
      </motion.div>
    </div>
  );
};

export default UserLayout;