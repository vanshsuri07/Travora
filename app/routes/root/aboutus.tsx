import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBrain, FaPlaneDeparture, FaRegPaperPlane, FaUsers } from 'react-icons/fa';

// Animation variants for Framer Motion
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } as const}
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

// Team Member Component
const TeamMember = ({ imageUrl, name, title }: { imageUrl: string; name: string; title: string }) => (
    <motion.div variants={fadeIn} className="text-center">
        <div className="relative w-40 h-40 mx-auto">
            <img src={imageUrl} alt={name} className="rounded-full w-full h-full object-cover shadow-lg" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-500">{title}</p>
    </motion.div>
);

const AboutUsPage = () => {
    return (
        <main className="about-us-page bg-white">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[70vh] min-h-[500px] bg-gray-900 text-white">
                <img
                    src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto-format&fit=crop"
                    alt="World map with travel items"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight"
                    >
                        We're Changing How You Travel
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-xl text-gray-200 max-w-3xl"
                    >
                        At Travora, we blend the power of artificial intelligence with a passion for exploration to create perfectly tailored, unforgettable journeys.
                    </motion.p>
                </div>
            </section>

            {/* --- OUR MISSION SECTION --- */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn}>
                        <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
                        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                            To eliminate the stress of travel planning by providing intelligent, personalized, and seamless booking experiences. We believe that the joy of travel should begin with the dream, not get lost in the details. Travora is your personal travel genius, crafting bespoke adventures that match your unique style.
                        </p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn}>
                         <img src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2072&auto=format&fit=crop" alt="Person planning a trip on a laptop" className="rounded-2xl shadow-xl w-full h-full object-cover" />
                    </motion.div>
                </div>
            </section>

            {/* --- HOW IT WORKS SECTION --- */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Your dream trip is just three simple steps away.</p>
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        {/* Step 1 */}
                        <motion.div variants={fadeIn} className="flex flex-col items-center">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-6"><FaRegPaperPlane size={40} /></div>
                            <h3 className="mt-6 text-2xl font-semibold">Tell Us Your Dream</h3>
                            <p className="mt-2 text-gray-500">Share your destination, interests, budget, and travel style. The more we know, the better your trip will be.</p>
                        </motion.div>
                        {/* Step 2 */}
                        <motion.div variants={fadeIn} className="flex flex-col items-center">
                            <div className="bg-green-100 text-green-600 rounded-full p-6"><FaBrain size={40} /></div>
                            <h3 className="mt-6 text-2xl font-semibold">AI Crafts Your Itinerary</h3>
                            <p className="mt-2 text-gray-500">Our intelligent engine analyzes millions of data points to build a unique, day-by-day plan just for you.</p>
                        </motion.div>
                        {/* Step 3 */}
                        <motion.div variants={fadeIn} className="flex flex-col items-center">
                            <div className="bg-pink-100 text-pink-600 rounded-full p-6"><FaPlaneDeparture size={40} /></div>
                            <h3 className="mt-6 text-2xl font-semibold">Book & Go!</h3>
                            <p className="mt-2 text-gray-500">Review your custom plan, make adjustments, and book your entire adventure with a single click.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* --- TEAM SECTION --- */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Meet the Innovators</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">The passionate minds behind Travora's intelligent travel platform.</p>
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12"
                    >
                        <TeamMember imageUrl="/assets/images/david.webp" name="Vansh Suri" title="Founder & CEO" />
                        <TeamMember imageUrl="/assets/images/david.webp" name="Maria Garcia" title="Lead AI Engineer" />
                        <TeamMember imageUrl="/assets/images/david.webp" name="Chris Lee" title="Head of Design" />
                        <TeamMember imageUrl="/assets/images/david.webp" name="Samira Khan" title="Travel Experience Lead" />
                    </motion.div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="bg-blue-600">
                <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
                    <motion.h2 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                        className="text-4xl font-extrabold text-white"
                    >
                        Ready for an adventure designed for you?
                    </motion.h2>
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                        className="mt-8"
                    >
                        <Link to="/user/trip">
                             <button className="px-10 py-4 text-lg font-bold rounded-full text-blue-600 bg-white
                                               hover:bg-gray-100 transition-all duration-300 shadow-xl 
                                               transform hover:scale-105">
                                Generate Your Trip
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default AboutUsPage;
