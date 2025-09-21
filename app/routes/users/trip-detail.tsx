import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from './+types/trip-detail';
import { cn, getFirstWord, parseTripData } from "~/lib/utlis";
import { TripCard } from "../../../components"; // Assuming Header is not needed directly here anymore

// Icons - It's better to use a library or inline SVGs
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const StarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5", className)} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;


export const loader = async ({ params }: LoaderFunctionArgs) => {
    // ... same loader logic
    const { tripId } = params;
    if (!tripId) throw new Error('Trip ID is required');

    const [trip, trips] = await Promise.all([
        getTripById(tripId),
        getAllTrips(4, 0)
    ]);

    return {
        trip,
        allTrips: trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        }))
    }
}

import { loadStripe } from '@stripe/stripe-js';

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
    const imageUrls = loaderData?.trip?.imageUrls || [];
    const tripData = parseTripData(loaderData?.trip?.tripDetails);

    const {
        name, duration, itinerary, travelStyle,
        groupType, budget, interests, estimatedPrice,
        description, bestTimeToVisit, weatherInfo, country
    } = tripData || {};
    const allTrips = loaderData.allTrips as Trip[] | [];

    const handleBooking = async () => {
        // ... same booking logic
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

        if (!stripe) {
            console.error("Stripe.js failed to load.");
            return;
        }
        console.log("Booking price sent to backend:", estimatedPrice);

        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                images: imageUrls,
                price: estimatedPrice?.replace(/\$/g, "") || "0",
                tripId: loaderData?.trip?.$id,
            }),
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    const pillItems = [
        { text: travelStyle, bg: 'bg-pink-100 text-pink-700' },
        { text: groupType, bg: 'bg-blue-100 text-blue-700' },
        { text: budget, bg: 'bg-green-100 text-green-700' },
        { text: interests, bg: 'bg-indigo-100 text-indigo-700' },
    ]

    const visitTimeAndWeatherInfo = [
        { title: 'Best Time to Visit', items: bestTimeToVisit },
        { title: 'Weather Information', items: weatherInfo }
    ]

    return (
        <main className="bg-gray-50">
            {/* --- Hero Section --- */}
            <section
                className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-white"
                style={{ backgroundImage: `url(${imageUrls[0]})` }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{name}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
                        Explore the wonders of {country} with our curated {duration}-day travel plan.
                    </p>
                </div>
            </section>

            {/* --- Main Content Section --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">

                    {/* --- Left Column (Trip Details) --- */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Info Header */}
                        <header className="pb-8 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{duration}-Day {travelStyle} Adventure</h2>
                                    <div className="mt-2 flex items-center text-gray-600">
                                        <p><CalendarIcon /> {duration} Day Plan</p>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <p><LocationIcon /> {itinerary?.slice(0, 3).map(item => item.location).join(', ')}</p>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="text-yellow-400" />)}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-600">4.9/5 (120 reviews)</span>
                                </div>
                            </div>
                            {/* Tags */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {pillItems.map((pill, i) => pill.text && (
                                    <span key={i} className={`px-3 py-1 text-sm font-medium rounded-full ${pill.bg}`}>
                                        {getFirstWord(pill.text)}
                                    </span>
                                ))}
                            </div>
                        </header>

                        {/* Photo Gallery */}
                        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {imageUrls.map((url: string, i: number) => (
                                <div key={i} className={cn('overflow-hidden rounded-xl shadow-md', i === 0 ? 'col-span-2 row-span-2' : '')}>
                                    <img src={url} alt={`Trip view ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                </div>
                            ))}
                        </section>
                        
                        {/* Description */}
                        <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
                        
                        {/* Itinerary Timeline */}
                        <section>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h3>
                            <ol className="relative border-l border-gray-200 space-y-8">
                                {itinerary?.map((dayPlan: DayPlan, index: number) => (
                                    <li key={index} className="ml-6">
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
                                            <CalendarIcon />
                                        </span>
                                        <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Day {dayPlan.day}: {dayPlan.location}</h4>
                                        <ul className="mt-2 space-y-2">
                                            {dayPlan.activities.map((activity, actIndex: number) => (
                                                <li key={actIndex} className="text-base font-normal text-gray-600">
                                                    <strong className="text-gray-800">{activity.time}:</strong> {activity.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                            {visitTimeAndWeatherInfo.map((section) => section.items && section.items.length > 0 && (
                                <div key={section.title}>
                                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                                    <ul className="mt-3 list-disc list-inside text-gray-600 space-y-1">
                                        {section.items.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Column (Sticky Booking Card) --- */}
                    <aside className="lg:col-span-1 mt-12 lg:mt-0">
                        <div className="sticky top-24">
                            <div className="rounded-2xl bg-white shadow-xl p-6 border">
                                <p className="text-sm font-medium text-gray-500">Starting from</p>
                                <h2 className="text-5xl font-extrabold text-gray-900">{estimatedPrice}</h2>
                                <p className="text-sm text-gray-500">per person</p>
                                <button
                                    onClick={handleBooking}
                                    className="mt-6 w-full px-8 py-4 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Book This Trip
                                </button>
                                <p className="mt-4 text-xs text-center text-gray-400">Secure your spot now!</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            
            {/* --- Popular Trips Section --- */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-dark-100">Popular Trips</h2>
                    <p className="mt-2 text-center text-lg text-gray-600">Discover other adventures you might like.</p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {allTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                name={trip.name}
                                imageUrl={trip.imageUrls[0]}
                                location={trip.itinerary?.[0]?.location ?? ""}
                                tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                                price={trip.estimatedPrice}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default TripDetail;