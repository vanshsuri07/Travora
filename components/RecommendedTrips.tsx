import React, { useState, useRef, useEffect } from "react";
import TripCard from "./TripCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
}

const RecommendedTrips: React.FC<RecommendedTripsProps> = ({ trips }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const currentRef = scrollRef.current;

    currentRef?.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      currentRef?.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [trips]);

  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
         
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
              aria-label="Scroll right"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          )}

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
    </section>
  );
};

export default RecommendedTrips;


