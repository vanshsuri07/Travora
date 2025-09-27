import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getUser } from "~/appwrite/auth";
import { getUserBookings, getTripById } from "~/appwrite/trips";
import { parseTripData } from '~/lib/utlis'; // Assuming you have this utility
import  TripCard  from "../../../components/TripCard"; // Header is no longer needed here
import { motion, AnimatePresence } from 'framer-motion';

// --- UI ENHANCEMENT: Skeleton Loader Component ---
const TripCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="bg-gray-200 h-48 w-full"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="px-4 pb-4 flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
    </div>
);

// Loader is not used for client-side fetching in this setup
export const loader = async () => ({});

const MyTripsPage = () => {
    const [bookedTrips, setBookedTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const user = await getUser();
                if (!user || !('$id' in user)) {
                    setLoading(false);
                    return;
                }

                const bookings = await getUserBookings(user.$id);
                
                if (!bookings || bookings.length === 0) {
                    setLoading(false);
                    return;
                }

                // --- LOGIC IS UNCHANGED ---
                const tripPromises = bookings.map(booking => getTripById(booking.tripId));
                const tripResults = await Promise.all(tripPromises);

                const formattedTrips = tripResults
                    .filter(trip => trip !== null)
                    .map((trip) => ({
                        id: trip.$id,
                        ...parseTripData(trip.tripDetails),
                        imageUrls: trip.imageUrls ?? []
                    }));
                
                setBookedTrips(formattedTrips);

            } catch (error) {
                console.error('💥 Error fetching booked trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const descriptionText = loading 
        ? "Searching for your adventures..."
        : `You have ${bookedTrips.length} wonderful adventures booked.`;

    // --- ENHANCED Loading State UI ---
    if (loading) {
        return (
            <main className="my-trips-page bg-gray-50 min-h-screen">
                <div className="relative bg-gray-900 pt-32 pb-20">
                    <img
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                        alt="Scenic travel destination"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h1 className="text-5xl font-bold tracking-tight">My Trips</h1>
                        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">{descriptionText}</p>
                    </div>
                </div>
                <section className="relative z-10 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => <TripCardSkeleton key={i} />)}
                    </div>
                </section>
            </main>
        );
    }

    // --- ENHANCED Main Content & Empty State UI ---
    return (
        <main className="my-trips-page bg-gray-50 min-h-screen">
            {/* --- NEW HERO SECTION FOR NAV VISIBILITY --- */}
            <div className="relative bg-gray-900 pt-32 pb-20">
                <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                    alt="Scenic travel destination"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold tracking-tight"
                    >
                        My Trips
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        {descriptionText}
                    </motion.p>
                </div>
            </div>
            
            <section className="relative z-10 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <AnimatePresence>
                    {bookedTrips.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm"
                        >
                            <img src="/assets/images/adventure.png" alt="A suitcase and a globe" className="mx-auto h-32 w-32 mb-6" />
                            <h2 className="text-3xl font-bold text-gray-800">Your Adventure Awaits!</h2>
                            <p className="mt-3 text-lg text-gray-500 max-w-md mx-auto">It looks like your passport is ready for a new stamp. Let's find your next destination.</p>
                            <Link to="/user/trip">
                                <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                                    Explore Trips
                                </button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.07 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {bookedTrips.map((trip) => (
                                <motion.div
                                    key={trip.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="h-full"
                                >
                                    <TripCard
                                        id={trip.id}
                                        name={trip.name}
                                        imageUrl={trip.imageUrls[0]}
                                        location={trip.itinerary?.[0]?.location ?? ""}
                                        tags={[trip.interests, trip.travelStyle]}
                                        price={trip.estimatedPrice}
                                        isWishlisted={false}
                                        onToggleWishlist={() => {}}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    );
};

export default MyTripsPage;

