import React, { useState, useRef, useEffect } from 'react';
import TripCard from './TripCard';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';

// Type definitions matching your dashboard structure
interface Trip {
    $id: string;
    id: string;
    name: string;
    imageUrls: string[];
    itinerary?: Array<{ location: string }>;
    interests?: string[];
    travelStyle?: string;
    estimatedPrice?: number;
}

import { addToWishlist, getWishlistItem, removeFromWishlist } from '~/appwrite/trips';
import type { Models } from 'appwrite';

interface UpcomingTripsProps {
    trips?: Trip[];
    onFetchTrips?: () => Promise<Trip[]>;
    refreshTrigger?: number; // Add this to trigger refetch from parent
    userId?: string;
    wishlist?: Models.Document[];
    onWishlistChange?: () => void;
}

const UpcomingTrips: React.FC<UpcomingTripsProps> = ({ 
    trips: initialTrips = [], 
    onFetchTrips,
    refreshTrigger = 0,
    userId,
    wishlist = [],
    onWishlistChange
}) => {
    const [trips, setTrips] = useState<Trip[]>(initialTrips);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wishlistedTrips, setWishlistedTrips] = useState<string[]>(wishlist.map(item => item.tripId));
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef<HTMLDivElement>(null);

    // Fetch trips function
    const fetchTrips = async () => {
        if (!onFetchTrips) {
            console.warn('No onFetchTrips function provided');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const fetchedTrips = await onFetchTrips();
            setTrips(fetchedTrips);
            setCurrentSlide(0); // Reset to first slide when new trips arrive
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch trips');
            console.error('Error fetching trips:', err);
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch trips on mount and when refreshTrigger changes
    useEffect(() => {
        if (onFetchTrips && refreshTrigger > 0) {
            fetchTrips();
        }
    }, [refreshTrigger]);

    // Update trips when initialTrips prop changes
    useEffect(() => {
        if (initialTrips && initialTrips.length > 0) {
            setTrips(initialTrips);
        }
    }, [initialTrips]);

    const toggleWishlist = async (tripId: string) => {
        if (!userId) {
            console.error("User not logged in");
            return;
        }

        const wishlistItem = await getWishlistItem(tripId, userId);

        if (wishlistItem) {
            const success = await removeFromWishlist(wishlistItem.$id);
            if (success) {
                setWishlistedTrips(prev => prev.filter(id => id !== tripId));
                onWishlistChange?.();
            }
        } else {
            const newItem = await addToWishlist(tripId, userId);
            if (newItem) {
                setWishlistedTrips(prev => [...prev, tripId]);
                onWishlistChange?.();
            }
        }
    };

    // Calculate how many cards to show per slide based on screen size
    const getCardsPerSlide = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 4; // lg screens
            if (window.innerWidth >= 768) return 2; // md screens
            return 1; // sm screens
        }
        return 4;
    };

    const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());

    useEffect(() => {
        const handleResize = () => {
            setCardsPerSlide(getCardsPerSlide());
            setCurrentSlide(0); // Reset to first slide on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(trips.length / cardsPerSlide);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    // Auto-slide functionality (optional)
    useEffect(() => {
        if (trips.length > cardsPerSlide) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [trips.length, cardsPerSlide, totalSlides]);

    // Early return if trips is not available or empty
    if (!trips || trips.length === 0) {
        return (
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Trips</h2>
                        {onFetchTrips && (
                            <button 
                                onClick={fetchTrips}
                                disabled={loading}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <FaSpinner className="w-4 h-4 animate-spin" />}
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
                        )}
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-16">
                            <FaSpinner className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading trips...</h3>
                            <p className="text-gray-600">Please wait while we fetch your adventures</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="mb-6">
                                <svg className="mx-auto h-24 w-24 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading trips</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button 
                                onClick={fetchTrips}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="mb-6">
                                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start planning your next adventure and create unforgettable memories</p>
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg">
                                Create Your First Trip
                            </button>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Trips</h2>
                    <div className="flex items-center gap-4">
                        {onFetchTrips && (
                            <button 
                                onClick={fetchTrips}
                                disabled={loading}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <FaSpinner className="w-4 h-4 animate-spin" />}
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                </div>

                {/* Slideshow Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {trips.length > cardsPerSlide && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
                                aria-label="Previous slide"
                            >
                                <FaChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
                                aria-label="Next slide"
                            >
                                <FaChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Slides Container */}
                    <div className="overflow-hidden rounded-lg">
                        <div
                            ref={slideRef}
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`
                            }}
                        >
                            {Array.from({ length: totalSlides }, (_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className="w-full flex-shrink-0"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {trips
                                            .slice(
                                                slideIndex * cardsPerSlide,
                                                (slideIndex + 1) * cardsPerSlide
                                            )
                                            .map((trip) => {
                                                // Create a comprehensive tags array with proper filtering
                                                const tags = [
                                                    ...(trip.interests || []),
                                                    ...(trip.travelStyle ? [trip.travelStyle] : [])
                                                ].filter(Boolean);

                                                return (
                                                    <div key={trip.id} className="relative group">
                                                        {/* Wishlist Button Overlay */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleWishlist(trip.id);
                                                            }}
                                                            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100"
                                                            aria-label={wishlistedTrips.includes(trip.id) ? "Remove from wishlist" : "Add to wishlist"}
                                                        >
                                                            {wishlistedTrips.includes(trip.id) ? (
                                                                <FaHeart className="w-5 h-5 text-red-500" />
                                                            ) : (
                                                                <FaRegHeart className="w-5 h-5" />
                                                            )}
                                                        </button>

                                                        <TripCard
                                                            id={trip.id.toString()}
                                                            name={trip.name || 'Untitled Trip'}
                                                            imageUrl={trip.imageUrls?.[0] || ''}
                                                            location={trip.itinerary?.[0]?.location || 'Location TBD'}
                                                            tags={tags}
                                                            price={`$${trip.estimatedPrice ? trip.estimatedPrice.toString() : '0'}`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    {trips.length > cardsPerSlide && totalSlides > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalSlides }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        index === currentSlide
                                            ? 'bg-blue-600 scale-110'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Trip Count Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    {trips.length > cardsPerSlide && (
                        <span>
                            Showing {Math.min((currentSlide + 1) * cardsPerSlide, trips.length)} of {trips.length} trips
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingTrips;