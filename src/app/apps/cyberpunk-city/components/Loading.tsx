'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mb-4 mx-auto">
          <div className="absolute inset-0 border-4 border-t-pink-500 border-r-blue-500 border-b-purple-500 border-l-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-transparent border-l-cyan-300 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-pulse">
          LOADING CYBERPUNK CITY
        </h2>
        <p className="text-gray-400 mt-2 font-mono">Initializing neural interface...</p>
      </div>
    </div>
  );
} 