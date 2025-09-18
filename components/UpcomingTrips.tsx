import React from 'react';
import { FaArrowRight } from 'react-icons/fa'; // A popular icon library

// You can install react-icons by running:
// npm install react-icons
// or
// yarn add react-icons




const UpcomingTripsSection = () => {
    

  return (
    <section className="bg-gray-50 font-poppins py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Your Next Adventures
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get ready! Here are the trips you've crafted with our AI.
          </p>
        </div>

        {/* Trips Grid */}
        
     
      </div>
    </section>
  );
};

export default UpcomingTripsSection;