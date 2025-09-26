import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '~/appwrite/trips';
import { getUser } from '~/appwrite/auth';

// A simple, lightweight confetti component for a celebratory effect
const Confetti = () => {
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

const PaymentSuccessPage = () => {
    const location = useLocation();
    const [isClient, setIsClient] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setIsClient(true);

        const storeBooking = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const tripId = searchParams.get('tripId');
                
                console.log('Processing booking for tripId:', tripId);
                
                if (!tripId) {
                    throw new Error('Trip ID not found in URL');
                }

                const user = await getUser();
                // If getUser() can return different types, check for $id property
                if (!user || typeof (user as any).$id !== 'string') {
                    throw new Error('User not authenticated');
                }
                const userId = (user as any).$id;
                console.log('User retrieved:', userId);

                // Create the booking
                const booking = await createBooking(tripId, userId);
                console.log('Booking created successfully:', booking);
                
                setBookingStatus('success');
            } catch (error: any) {
                console.error('Failed to create booking:', error);
                setErrorMessage(error.message || 'Failed to create booking');
                setBookingStatus('error');
            }
        };

        storeBooking();
    }, [location]);

    if (bookingStatus === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing your booking...</p>
                </div>
            </div>
        );
    }

    if (bookingStatus === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white">
                <div className="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-4">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Booking Error</h1>
                    <p className="text-gray-600 mb-4">Your payment was successful, but we had trouble creating your booking.</p>
                    <p className="text-sm text-red-600 mb-6">{errorMessage}</p>
                    <div className="flex flex-col gap-4">
                        <Link to="/contact" className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                            Contact Support
                        </Link>
                        <Link to="/user" className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white overflow-hidden">
            <AnimatePresence>
                {isClient && <Confetti />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-4 z-10"
            >
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
                    Thank you for your booking. Your trip has been confirmed!
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
                        to="/user/my-trip" 
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