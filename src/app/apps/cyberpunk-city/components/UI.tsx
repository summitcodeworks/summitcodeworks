'use client';

import { useState, useEffect, useCallback } from 'react';

export default function UI() {
  const [isOpen, setIsOpen] = useState(false);
  const [neonIntensity, setNeonIntensity] = useState(1);
  const [vehicleSpeed, setVehicleSpeed] = useState(1);
  const [fogDensity, setFogDensity] = useState(0.03);
  const [rainIntensity, setRainIntensity] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);

  // Custom event to update scene parameters
  const updateSceneParams = useCallback(() => {
    const event = new CustomEvent('updateSceneParams', {
      detail: {
        neonIntensity,
        vehicleSpeed,
        fogDensity,
        rainIntensity
      }
    });
    window.dispatchEvent(event);
  }, [neonIntensity, vehicleSpeed, fogDensity, rainIntensity]);

  // Update scene when parameters change
  useEffect(() => {
    updateSceneParams();
  }, [updateSceneParams]);

  // Toggle audio
  const toggleAudio = () => {
    setIsMuted(!isMuted);
    const event = new CustomEvent('toggleAudio', {
      detail: { isMuted: !isMuted }
    });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Control panel toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-black/70 text-cyan-400 p-3 rounded-full border border-cyan-500 hover:bg-black/90 transition-all duration-300 backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Audio toggle button */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 left-4 z-50 bg-black/70 text-pink-400 p-3 rounded-full border border-pink-500 hover:bg-black/90 transition-all duration-300 backdrop-blur-md"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Control panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-lg text-white z-40 p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-cyan-500/50`}>
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500">
            NEURAL INTERFACE
          </h2>
          
          <div className="space-y-6 flex-grow">
            {/* Neon Intensity Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cyan-400">Neon Intensity</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={neonIntensity}
                onChange={(e) => setNeonIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Vehicle Speed Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-pink-400">Vehicle Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={vehicleSpeed}
                onChange={(e) => setVehicleSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Fog Density Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-400">Fog Density</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={fogDensity}
                onChange={(e) => setFogDensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Clear</span>
                <span>Dense</span>
              </div>
            </div>

            {/* Rain Intensity Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">Rain Intensity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={rainIntensity}
                onChange={(e) => setRainIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>None</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 font-mono">
              SYSTEM STATUS: <span className="text-green-500">ONLINE</span>
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              NEURAL LINK: <span className="text-cyan-500 animate-pulse">ACTIVE</span>
            </p>
          </div>
        </div>
      </div>

      {/* Instructions overlay - shows briefly then fades out */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/30 max-w-md animate-fadeOut">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">NAVIGATION CONTROLS</h3>
          <ul className="text-gray-300 text-sm space-y-1 font-mono">
            <li>Mouse Drag: Rotate Camera</li>
            <li>Mouse Wheel: Zoom In/Out</li>
            <li>Right Click + Drag: Pan Camera</li>
            <li>Settings Panel: Top Right Corner</li>
          </ul>
        </div>
      </div>
    </>
  );
} 