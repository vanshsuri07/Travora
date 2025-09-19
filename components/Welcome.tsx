import React from 'react';
import { Link } from 'react-router';

const WelcomeSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center font-poppins text-white">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/assets/images/welcome.png')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold leading-tight mb-4 shadow-text">
          Your Next Adventure, Intelligently Crafted
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light max-w-2xl mx-auto shadow-text">
          Stop planning, start dreaming. Our AI crafts personalized travel itineraries in seconds. Where do you want to go?
        </p>
        <Link to="/trip">
        <button
  className="px-6 py-3 rounded-full font-semibold text-white text-lg
             bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 // Adjusted base gradient
             hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 // More vibrant, but still harmonious hover
             transform hover:scale-105 transition-transform duration-300
             shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
>
  Generate Trip
</button>
        </Link>
      </div>
    </div>
  );
};

// Add this to your global CSS file (e.g., index.css) for the text shadow effect
/*
@layer utilities {
  .shadow-text {
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  }
}
*/

export default WelcomeSection;