import { useEffect, useState } from 'react';
import { getTripById } from '~/appwrite/trips';
import TripCard from './TripCard';
import type { Models } from 'appwrite';

interface WishlistProps {
  wishlist: Models.Document[];
}

const Wishlist: React.FC<WishlistProps> = ({ wishlist }) => {
  const [trips, setTrips] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistTrips = async () => {
      setLoading(true);
      const tripPromises = wishlist.map(item => getTripById(item.tripId));
      const tripResults = await Promise.all(tripPromises);
      setTrips(tripResults.filter(trip => trip !== null) as Models.Document[]);
      setLoading(false);
    };

    if (wishlist.length > 0) {
      fetchWishlistTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [wishlist]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Wishlist</h2>
        {loading ? (
          <p>Loading wishlist...</p>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trips.map(trip => (
              <TripCard
                key={trip.$id}
                id={trip.$id}
                name={trip.name}
                imageUrl={trip.imageUrls[0]}
                location={trip.itinerary[0]?.location || 'N/A'}
                tags={[trip.travelStyle, ...trip.interests]}
                price={`$${trip.estimatedPrice}`}
              />
            ))}
          </div>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
