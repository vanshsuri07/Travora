import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { createBooking } from "~/appwrite/trips";
import { getCurrentUser } from "~/appwrite/auth";

const PaymentSuccessPage = () => {
    const location = useLocation();

    useEffect(() => {
        const storeBooking = async () => {
            const searchParams = new URLSearchParams(location.search);
            const tripId = searchParams.get('tripId');
            const user = await getCurrentUser();

            if (tripId && user) {
                await createBooking(tripId, user.$id);
            }
        };

        storeBooking();
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-700 mb-8">Thank you for your booking. Your trip is confirmed.</p>
                <Link to="/users/home" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
