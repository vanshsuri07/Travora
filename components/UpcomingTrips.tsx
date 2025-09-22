import { useState, useRef, useEffect } from "react";
import { Link } from "react-router"; // Use react-router-dom for modern React
import { motion } from "framer-motion";
import TripCard from "./TripCard";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaSyncAlt, // Refresh Icon
  FaSuitcaseRolling,
} from "react-icons/fa";

// --- Interfaces remain the same ---
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

interface UpcomingTripsProps {
  trips?: Trip[];
  onFetchTrips?: () => Promise<void>; // Make it a void promise
  wishlist: string[];
  onToggleWishlist: (tripId: string) => void;
}


const UpcomingTrips: React.FC<UpcomingTripsProps> = ({
  trips: initialTrips = [],
  onFetchTrips,
  wishlist,
  toggleWishlist,
}) => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [loading, setLoading] = useState(!initialTrips || initialTrips.length === 0);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // FIXED: The internal fetch function now handles its own loading state
  const handleFetchTrips = async () => {
    if (!onFetchTrips) return;
    try {
      setLoading(true);
      setError(null);
      await onFetchTrips(); // Call the parent function to refetch
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTrips(initialTrips);
    setLoading(false); // Stop loading when new props arrive
  }, [initialTrips]);

  // FIXED: Added a timeout to ensure DOM is ready before checking scroll
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => checkScrollButtons(), 150); // Small delay
    const currentRef = scrollRef.current;

    currentRef?.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);
    
    return () => {
      clearTimeout(timer);
      currentRef?.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [trips]);

const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -(clientWidth / 2) : (clientWidth / 2); // Scroll half a screen for a nicer feel
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // --- Improved Empty State ---
  if (!loading && (!trips || trips.length === 0)) {
    return (
        <section className="py-16">
            {/* ... Your awesome actionable empty state JSX ... */}
        </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Unified Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Trips</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
             {onFetchTrips && (
            <button
                onClick={handleFetchTrips}
                disabled={loading}
                className="flex items-center gap-2 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-wait hover:text-blue-600 transition-colors"
              >
                {loading ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                    <FaSyncAlt className="w-4 h-4" />
                )}
                {loading ? "Refreshing..." : "Refresh"}
              </button>
             )}
                      <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="bg-white hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow border border-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Scroll left"
                      >
                        <FaChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="bg-white hover:bg-gray-100 text-gray-700 rounded-full p-2 shadow border border-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Scroll right"
                      >
                        <FaChevronRight className="w-5 h-5" />
                      </button>
                    </div>
        </div>

        {/* --- Scrollable Container --- */}
       <div className="relative">
          {/* Left Fade */}
          <div className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Right Fade */}
          <div className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

         <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide">
            {trips.map((trip) => (
              <div key={trip.id} className="relative group flex-shrink-0 w-[280px]">
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(trip.id)}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 text-gray-700 hover:text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  {wishlist.includes(trip.id) ? <FaHeart className="w-5 h-5 text-red-500"/> : <FaRegHeart className="w-5 h-5"/>}
                </button>
                <TripCard
                    id={trip.id.toString()}
                    name={trip.name}
                    imageUrl={trip.imageUrls[0]}
                    location={trip.itinerary?.[0]?.location ?? ""}
                    tags={[trip.interests!, trip.travelStyle!]}
                    price={`${trip.estimatedPrice ?? ""}`}
                  />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingTrips;