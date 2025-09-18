import React from 'react';
import TripCard from './TripCard';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { production } from '~/appwrite/databases';

const UpcomingTrips = ({ trips, wishlistedTrips, onToggleWishlist }) => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip.$id} className="relative">
              <TripCard trip={trip} />
              <button
                onClick={() => onToggleWishlist(trip.$id)}
                className="absolute top-2 right-2 text-red-500"
              >
                {wishlistedTrips.includes(trip.$id) ? (
                  <FaHeart size={24} />
                ) : (
                  <FaRegHeart size={24} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingTrips;