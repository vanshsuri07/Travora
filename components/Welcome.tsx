import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

// Framer Motion animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const WelcomeSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center font-poppins text-white overflow-hidden">
      {/* Background Image with Ken Burns Effect & Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-kenburns"
        style={{ backgroundImage: `url('/assets/images/welcome.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Animated Content */}
      <motion.div
        className="relative z-10 text-center p-6 max-w-4xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 shadow-text bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300"
          variants={itemVariants}
        >
          Your Next Adventure, Intelligently Crafted
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl"
          variants={itemVariants}
        >
          Stop planning, start dreaming. Tell us where you want to go.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full max-w-2xl">
          <form className="relative flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative w-full">
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
            </div>
          
          </form>
        </motion.div>
      </motion.div>

      {/* Animated Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <FaChevronDown size={24} className="animate-bounce-slow" />
      </motion.div>
    </div>
  );
};

export default WelcomeSection;