import * as React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Model } from './Model';

// Loading placeholder
function LoadingEarth() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#1e40af" transparent opacity={0.5} />
    </mesh>
  );
}

export default function HeroSection() {
  return (
    <div className="bg-gray-900 font-sans">
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
          alt="Travel landscape"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-16">
          {/* Left Side - Text */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg uppercase">
              Explore the world with us
            </h1>
            <p className="text-lg text-gray-200 mt-4 drop-shadow-md">
              Your journey to unforgettable experiences starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
              <button className="px-6 py-3 rounded-full font-semibold text-white text-lg bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300">
                Plan a Trip
              </button>
            </div>
          </motion.div>

          {/* Right Side - 3D Earth */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center ">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        
        {/* Globe model */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* Controls */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
