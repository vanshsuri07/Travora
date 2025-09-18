import UpcomingTrips from 'components/UpcomingTrips';
import WelcomeSection from 'components/Welcome';
import React from 'react'

const UserLayout = () => {
  return (
    <div>
      <WelcomeSection />
      <UpcomingTrips />
    </div>
  )
}

export default UserLayout;
