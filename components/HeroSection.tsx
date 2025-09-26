import * as React from 'react'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import Model from './Model'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from '@react-three/drei'
import { Link } from 'react-router'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

// Main App component
export default function App() {
  return <HeroSection />
}

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const globeVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.175, 0.885, 0.32, 1.275] as const,
        delay: 0.5,
      },
    },
  }

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

        {/* Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-16">
          {/* Left Side */}
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
              <Link
                to="/user"
                className="
                  inline-block px-8 py-4 rounded-full font-semibold text-white text-lg
                  bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500
                  hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
                  hover:scale-105 hover:brightness-110
                  transform transition-transform duration-300
                  shadow-md hover:shadow-xl
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                "
              >
                Plan a Trip
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Globe (hidden on small devices) */}
          <motion.div
            className="hidden md:flex w-full md:w-1/2 justify-center mt-10 md:mt-0"
            variants={globeVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full h-[400px] md:h-[500px]">
              <Canvas camera={{ position: [0, 0.5, 5], fov: 50 }} shadows>
                <ambientLight intensity={0.5} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={2}
                  castShadow
                />

                <Suspense fallback={null}>
                  <Model />
                  <Environment preset="sunset" />
                  <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.75}
                    scale={10}
                    blur={1}
                    far={10}
                    resolution={256}
                    color="#000000"
                  />
                </Suspense>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.8}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                />

                <EffectComposer>
                  <Bloom
                    luminanceThreshold={0.4}
                    intensity={0.6}
                    mipmapBlur
                  />
                  <ToneMapping />
                </EffectComposer>
              </Canvas>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
