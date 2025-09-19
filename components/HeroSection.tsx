import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import {  Model } from './Model';
import { Canvas } from '@react-three/fiber';
import { Float, PresentationControls } from '@react-three/drei';

// Main App component that renders the HeroSection
export default function App() {
  return <HeroSection />;
}

const HeroSection = () => {
  // Animation variants for the container to orchestrate staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Time delay between each child animation
      },
    },
  };

  // Animation variants for individual child elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };
  
  // Animation for the globe placeholder
  const globeVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.175, 0.885, 0.32, 1.275] as const, // A springy ease for a nice pop
        delay: 0.5,
      },
    }
  };


  return (
    <div className="bg-gray-900 font-sans">
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
          alt="Lush landscape with mountains and a river"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* Overlay Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-16">
          {/* Left Side - Heading & Buttons */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg uppercase"
              variants={itemVariants}
            >
              Explore the world with us
            </motion.h1>
            <motion.p
              className="text-lg text-gray-200 mt-4 drop-shadow-md"
              variants={itemVariants}
            >
              Your journey to unforgettable experiences starts here.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start"
              variants={itemVariants}
            >
              <button
  className="px-6 py-3 rounded-full font-semibold text-white text-lg
             bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 // Adjusted base gradient
             hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 // More vibrant, but still harmonious hover
             transform hover:scale-105 transition-transform duration-300
             shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
>
  Generate Trip
</button>
            </motion.div>
          </motion.div>

          {/* Right Side - Placeholder for Globe */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
            variants={globeVariants}
            initial="hidden"
            animate="visible"
          >
             <div className="w-80 h-80 md:w-96 md:h-96 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <ambientLight intensity={1.5} />
  <directionalLight position={[5, 5, 5]} intensity={2} />

  {/* ✅ Your globe */}
  <group scale={2.5} position={[0, -1.5, 0]}>
    <Model />
  </group>
</Canvas>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

