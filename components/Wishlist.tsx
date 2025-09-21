import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import TripCard from "./TripCard";
import { FaHeartBroken, FaChevronLeft, FaChevronRight, FaTimesCircle } from "react-icons/fa";

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

interface WishlistProps {
  wishlistedTrips: Trip[];
  toggleWishlist: (tripId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistedTrips, toggleWishlist }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => checkScrollButtons(), 150);
    const currentRef = scrollRef.current;

    currentRef?.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      clearTimeout(timer);
      currentRef?.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [wishlistedTrips]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -(clientWidth / 2) : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Empty state
  if (!wishlistedTrips || wishlistedTrips.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaHeartBroken className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Travel Wishlist is Empty!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Start exploring our recommended trips or generate a new one to add your dream destinations here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Wishlist</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
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

        {/* Scrollable Wishlist */}
        <div className="relative">
          {/* Left Fade */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right Fade */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            {wishlistedTrips.map((trip) => (
              <div key={trip.id} className="relative group flex-shrink-0 w-[280px]">
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(trip.id)}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 text-red-500 hover:text-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <FaTimesCircle className="w-5 h-5" />
                </button>

                <TripCard
                  id={trip.id.toString()}
                  name={trip.name}
                  imageUrl={trip.imageUrls[0]}
                  location={trip.itinerary?.[0]?.location ?? ""}
                  tags={[...(trip.interests || []), trip.travelStyle!]}
                  price={`$${trip.estimatedPrice ?? ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
