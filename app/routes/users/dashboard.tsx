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
import LayoutSkeleton from 'components/LayoutSkeleton'

export const clientLoader = async () => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Response("Not authenticated", { status: 401 });
    }

    const userTripsResponse = await getUserTrips(user.$id);
    const userTrips = userTripsResponse.userTrips.map(
      ({ $id, tripDetails, imageUrls }) => ({
        $id,
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? [],
      })
    );

    const allTripsResponse = await getAllTrips();
    const recommendedTrips = allTripsResponse.documents
      .map((trip) => ({
        id: trip.$id,
        ...parseTripData(trip.tripDetails),
        imageUrls: trip.imageUrls ?? [],
      }))
      .filter((trip) => !userTrips.some((userTrip) => userTrip.id === trip.id));

    return {
      user,
      userTrips,
      recommendedTrips,
      totalTrips: userTripsResponse.total,
    };
  } catch (error) {
    console.error("Error in user dashboard loader:", error);
    throw error;
  }
};

const UserDashboard = ({ loaderData }: Route.ComponentProps) => {
  const { user, userTrips, recommendedTrips, totalTrips } = loaderData;
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (tripId: string) => {
    setWishlist((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  };

  const wishlistedTrips = recommendedTrips.filter((trip) =>
    wishlist.includes(trip.id)
  );

  const fetchUserTrips = async () => {
    try {
      const tripsResponse = await getUserTrips(user.$id, 10, 0);
      return tripsResponse.userTrips.map(
        ({ $id, tripDetails, imageUrls }) => ({
          $id,
          id: $id,
          ...parseTripData(tripDetails),
          imageUrls: imageUrls ?? [],
        })
      );
    } catch (error) {
      console.error("Error refetching user trips:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! ✈️
          </h1>
          <p className="text-gray-600">
            {totalTrips > 0
              ? `You have ${totalTrips} trip${
                  totalTrips !== 1 ? "s" : ""
                } planned`
              : "Ready to plan your next adventure?"}
          </p>
        </div>

        {totalTrips > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Total Trips</h3>
              <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">
                Recent Trips
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {Math.min(userTrips.length, 5)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <p className="text-2xl font-bold text-gray-900">
                {
                  userTrips.filter((trip) => {
                    const tripDate = new Date(trip.$createdAt || 0);
                    const thisMonth = new Date();
                    return (
                      tripDate.getMonth() === thisMonth.getMonth() &&
                      tripDate.getFullYear() === thisMonth.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Upcoming Trips
          </h2>
          <UpcomingTrips trips={userTrips} onFetchTrips={fetchUserTrips} />
        </div>

        <Wishlist
          wishlistedTrips={wishlistedTrips}
          toggleWishlist={toggleWishlist}
        />

        <RecommendedTrips
          trips={recommendedTrips}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />

        <div className="text-center py-8">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg">
            Plan New Trip
          </button>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;