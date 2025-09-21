import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '~/appwrite/trips';
import { getUser } from '~/appwrite/auth';

// A simple, lightweight confetti component for a celebratory effect
const Confetti = () => {
  // Use a fixed number of confetti pieces for consistent rendering
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      backgroundColor: ['#22c55e', '#3b82f6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)],
    };
    return <div key={i} className="confetti-piece" style={style}></div>;
  });

  return (
    <>
      <style>{`
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          top: -20px;
          opacity: 0.7;
          animation: drop-confetti linear infinite;
        }
        @keyframes drop-confetti {
          0% { transform: translateY(0vh) rotateZ(0deg); }
          100% { transform: translateY(110vh) rotateZ(360deg); }
        }
      `}</style>
      <div className="absolute inset-0 z-0">{confettiPieces}</div>
    </>
  );
};

// The main Payment Success Page component
const PaymentSuccessPage = () => {
    const location = useLocation();
    // State to track if the component has mounted on the client
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This effect runs only on the client, after initial render
        setIsClient(true);

        const storeBooking = async () => {
            const searchParams = new URLSearchParams(location.search);
            const tripId = searchParams.get('tripId');
            const user = await getUser();

            if (tripId && user) {
                await createBooking(tripId, user.$id);
            }
        };

        storeBooking();
    }, [location]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white overflow-hidden">
            <AnimatePresence>
                {/* Conditionally render Confetti only on the client */}
                {isClient && <Confetti />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }} // Using a standard easing value
                className="relative bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-4 z-10"
            >
                {/* Animated Checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                    <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-4xl font-extrabold text-gray-800 mb-3"
                >
                    Payment Successful!
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="text-lg text-gray-600 mb-8"
                >
                    Thank you for your booking. A confirmation has been sent to your email.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link 
                        to="/user" 
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Go to Dashboard
                    </Link>
                    <Link 
                        to="/user/mytrip" 
                        className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                    >
                        View My Trips
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccessPage;
