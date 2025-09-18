import { useOutletContext } from 'react-router';
import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import Wishlist from 'components/Wishlist';


const Home = () => {
  const { user, trips, wishlistedTrips, handleToggleWishlist } = useOutletContext();

  const wishlistedTripDetails = trips.filter((trip) => wishlistedTrips.includes(trip.$id));

  return (
    <div>
      <WelcomeSection user={user} />
      <UpcomingTrips
        trips={trips}
        wishlistedTrips={wishlistedTrips}
        onToggleWishlist={handleToggleWishlist}
      />
      {wishlistedTripDetails.length > 0 && <Wishlist trips={wishlistedTripDetails} />}
    </div>
  );
};

export default Home;