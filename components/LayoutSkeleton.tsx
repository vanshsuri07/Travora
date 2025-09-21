import React from 'react';

// A more detailed skeleton for a single trip card
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
    <div className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
    <div className="mt-4 space-y-3">
      <div className="bg-gray-200 h-6 w-3/4 rounded-md animate-pulse"></div>
      <div className="bg-gray-200 h-4 w-5/6 rounded-md animate-pulse"></div>
      <div className="flex gap-2 pt-2">
        <div className="bg-gray-200 h-5 w-1/4 rounded-full animate-pulse"></div>
        <div className="bg-gray-200 h-5 w-1/4 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// The main layout skeleton
const LayoutSkeleton = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* --- High-Fidelity Welcome Section Placeholder --- */}
      <div className="h-screen bg-gray-100 flex flex-col">
        {/* Fake Navbar */}
        <header className="p-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="hidden md:flex gap-6">
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </header>
        {/* Fake Centered Content */}
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
          <div className="h-10 md:h-16 w-3/4 lg:w-1/2 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="h-6 w-1/2 lg:w-1/3 bg-gray-200 rounded-md animate-pulse mb-8"></div>
          <div className="h-14 w-full max-w-lg bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* --- Content Sections Placeholder --- */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Upcoming Trips Skeleton */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div className="h-9 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
            <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-6">
            {/* We map here to avoid repeating code */}
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px]"><SkeletonCard/></div>
            ))}
          </div>
        </section>

        {/* Wishlist / Recommended Skeleton */}
        <section>
          <div className="h-9 bg-gray-200 rounded-md w-1/3 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LayoutSkeleton;