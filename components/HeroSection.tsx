import React from "react";
import Globe from "react-globe.gl";
const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[90vh] flex items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/hero-section.png')" }}
    >
      {/* Overlay (optional for glass effect) */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between">
        {/* Right Side - Heading & Buttons */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight drop-shadow-lg">
            Explore the World with Us
          </h1>
          <p className="text-lg text-gray-700 mt-4 drop-shadow">
            Discover amazing places at exclusive deals
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center md:justify-start">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition">
              Get Started
            </button>
            
          </div>
        </div>
        {/* Left Side - Globe (or placeholder div for now) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Globe
        height={326}
        width={326}
        backgroundColor="rgba(0,0,0,0)"
        
        showAtmosphere
        showGraticules
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      
      />
        </div>

        
      </div>
    </section>
  );
};

export default HeroSection;
