import React from 'react';
import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import Wishlist from 'components/Wishlist';
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

interface UserLayoutProps {
  trips: TransformedTrip[];
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ trips, children }) => {
  return (
    <div>
      <WelcomeSection />
      <UpcomingTrips trips={trips} />
      <Wishlist />
      <main>{children}</main>
    </div>
  );
};

export default UserLayout;
