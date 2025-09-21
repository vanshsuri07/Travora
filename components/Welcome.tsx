import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

// Framer Motion animation variants
const styles = `
  @keyframes kenburns-top {
    0% {
      transform: scale(1) translateY(0);
      transform-origin: 50% 16%;
    }
    100% {
      transform: scale(1.15) translateY(-10px);
      transform-origin: top;
    }
  }
  .animate-kenburns {
    animation: kenburns-top 10s ease-out both reverse;
  }
  
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .animate-bounce-slow {
    animation: bounce-slow 2s infinite;
  }
`;
const WelcomeSection = () => {
  return (
   <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      
      {/* Background Image with Ken Burns Effect & Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-kenburns"
        style={{ backgroundImage: `url('/assets/images/welcome.png')` }}
      />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/0"></div>
      

      {/* Animated Content */}
      
       <div className="relative z-20 flex flex-col items-center justify-center p-4">
      
        <motion.h1
         initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl  font-bold leading-tight mb-6 shadow-text bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300"
        >
          Your Next Adventure, Intelligently Crafted
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-white drop-shadow-lg mb-10 max-w-2xl"

        >
          Stop planning, start dreaming. Tell us where you want to go.
        </motion.p>

       <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
              <Link to="/user/trip">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white text-lg whitespace-nowrap
                           bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500
                           hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
                           transform hover:scale-105 transition-all duration-300
                           shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Generate Trip
              </button>
              </Link>
          
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
          delay: 1, // Start animation after other elements load
        }}
        className="absolute bottom-10 z-20"
      >
        <FaChevronDown size={24} className="animate-bounce-slow" />
      </motion.div>
    </section>
  );
};

export default WelcomeSection;