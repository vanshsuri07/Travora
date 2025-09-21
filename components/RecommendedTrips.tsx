import React, { useState, useRef, useEffect } from "react";
import TripCard from "./TripCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

// Define the Trip type for better type safety
interface Trip {
  id: string | number;
  name: string;
  imageUrls?: string[];
  itinerary?: Array<{ location: string }>;
  tags?: string[];
  travelStyle?: string;
  estimatedPrice: string | number;
}

interface RecommendedTripsProps {
  trips: Trip[];
  
  wishlist: string[];
  onToggleWishlist: (tripId: string) => void;
}

// Animation variants for the section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    }
  }
};

const RecommendedTrips: React.FC<RecommendedTripsProps> = ({ trips }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll function remains the same
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -(clientWidth / 2) : (clientWidth / 2); // Scroll half a screen for a nicer feel
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Effect for checking scroll buttons remains the same
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    // A small delay to ensure the DOM is fully painted before checking
    const timer = setTimeout(() => checkScrollButtons(), 100);
    const currentRef = scrollRef.current;

    currentRef?.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      clearTimeout(timer);
      currentRef?.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [trips]);

  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="py-16 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Redesigned Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Recommended For You
            </h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
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

        {/* --- Scrollable Container with Fade Effect --- */}
        <div className="relative">
          {/* Left Fade */}
          <div className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Right Fade */}
          <div className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            {trips.map((trip) => (
              <div key={trip.id} className="flex-shrink-0 w-[280px]">
                <TripCard
                  id={trip.id.toString()}
                  name={trip.name}
                  imageUrl={trip.imageUrls?.[0]}
                  location={trip.itinerary?.[0]?.location ?? ""}
                  tags={[...(trip.tags || []), trip.travelStyle]}
                  price={`$${trip.estimatedPrice}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default RecommendedTrips;