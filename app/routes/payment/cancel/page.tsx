import { Link } from "react-router-dom";

const PaymentCancelPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Canceled</h1>
                <p className="text-lg text-gray-700 mb-8">Your payment was not processed. Please try again.</p>
                <Link to="/users/home" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
