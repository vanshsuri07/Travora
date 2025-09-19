import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import Wishlist from 'components/Wishlist';
import { getUser } from '~/appwrite/auth';
import { getAllTrips, getTripsByUserId } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utlis';
import { useLoaderData } from 'react-router-dom';
import { Models } from 'appwrite';

interface TransformedTrip extends Models.Document {
    id: string;
    name: string;
    imageUrls: string[];
    itinerary?: Array<{ location: string }>;
    interests?: string[];
    travelStyle?: string;
    estimatedPrice?: number;
}

interface LoaderData {
    transformedTrips: TransformedTrip[];
}

export const clientLoader = async () => {
  const user = await getUser();
  if (!user) {
    return { transformedTrips: [] };
  }

  let trips;
  if (user.labels.includes('admin')) {
    trips = await getAllTrips(100, 0); // Fetch all trips for admin
  } else {
    trips = await getTripsByUserId(user.accountId);
  }

  const transformedTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
    $id,
    id: $id,
    ...parseTripData(tripDetails),
    imageUrls: imageUrls ?? [],
  }));

  return { transformedTrips };
};

const UserLayout = () => {
  const { transformedTrips } = useLoaderData() as LoaderData;

  return (
    <div>
      <WelcomeSection />
      <UpcomingTrips trips={transformedTrips} />
      <Wishlist />
    </div>
  );
};

export default UserLayout;
