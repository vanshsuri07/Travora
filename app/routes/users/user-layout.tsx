import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import Wishlist from 'components/Wishlist';
import { allTrips } from '~/constants';


const UserLayout = () => {
  const transformedTrips = allTrips.map(trip => ({
    ...trip,
    $id: trip.id.toString(),
    id: trip.id.toString(),
    interests: trip.tags,
    estimatedPrice: parseFloat(trip.estimatedPrice.replace(/[^0-9.]/g, '')) || 0
  }));

  return (
    <div>
      <WelcomeSection />
      <UpcomingTrips trips={transformedTrips} />
      <Wishlist />
    </div>
  )
}

export default UserLayout;
