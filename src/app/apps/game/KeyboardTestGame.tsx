'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, Keyboard } from 'lucide-react';
import Header from "@/app/components/Header";

interface Position {
    x: number;
    y: number;
}

interface Obstacle {
    id: number;
    x: number;
    y: number;
    counted: boolean;
}

interface KeyCount {
    [key: string]: number;
}

const KeyboardTestGame = () => {
    const [position, setPosition] = useState<Position>({ x: 20, y: 50 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isHit, setIsHit] = useState(false);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [dodgeCount, setDodgeCount] = useState(0);
    const [hitCount, setHitCount] = useState(0);
    const [lastKey, setLastKey] = useState('');
    const [keyCount, setKeyCount] = useState<KeyCount>({});
    const [screenShake, setScreenShake] = useState(false);

    const triggerHitEffect = () => {
        setIsHit(true);
        setScreenShake(true);
        setTimeout(() => {
            setIsHit(false);
            setScreenShake(false);
        }, 500);
    };

    const moveUp = () => {
        setPosition(prev => ({
            ...prev,
            y: Math.max(0, prev.y - 10)
        }));
        setLastKey('ArrowUp');
        setKeyCount(prev => ({
            ...prev,
            'ArrowUp': (prev['ArrowUp'] || 0) + 1
        }));
    };

    const moveDown = () => {
        setPosition(prev => ({
            ...prev,
            y: Math.min(90, prev.y + 10)
        }));
        setLastKey('ArrowDown');
        setKeyCount(prev => ({
            ...prev,
            'ArrowDown': (prev['ArrowDown'] || 0) + 1
        }));
    };

    const jump = useCallback(() => {
        if (!isJumping) {
            setIsJumping(true);
            setLastKey('Space');
            setKeyCount(prev => ({
                ...prev,
                'Space': (prev['Space'] || 0) + 1
            }));
            setTimeout(() => setIsJumping(false), 500);
        }
    }, [isJumping]);

    useEffect(() => {
        let gameInterval: NodeJS.Timeout;
        let spawnInterval: NodeJS.Timeout;

        if (isPlaying) {
            gameInterval = setInterval(() => {
                setObstacles(prevObstacles => {
                    const updatedObstacles = prevObstacles
                        .map(obs => ({
                            ...obs,
                            x: obs.x - 1.5
                        }))
                        .filter(obs => obs.x > -10);

                    updatedObstacles.forEach(obs => {
                        if (!obs.counted && obs.x < 15) {
                            if (Math.abs(obs.y - position.y) < 15) {
                                setHitCount(h => h + 1);
                                triggerHitEffect();
                            } else {
                                setDodgeCount(d => d + 1);
                            }
                            obs.counted = true;
                        }
                    });

                    return updatedObstacles;
                });
            }, 16);

            spawnInterval = setInterval(() => {
                setObstacles(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        x: 100,
                        y: Math.random() * 80,
                        counted: false
                    }
                ]);
            }, 1500);
        }

        return () => {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
        };
    }, [isPlaying, position.y]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            e.preventDefault();

            switch (e.key) {
                case 'ArrowUp':
                    moveUp();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case ' ':
                    jump();
                    break;
                default:
                    break;
            }
        };

        if (isPlaying) {
            window.addEventListener('keydown', handleKeyPress);
            return () => window.removeEventListener('keydown', handleKeyPress);
        }
    }, [isPlaying, isJumping, jump]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            <Header/>
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient bg-[length:200%_200%] -z-10"
                 style={{
                     animation: 'gradient 15s ease infinite',
                 }}
            />

            {/* Semi-transparent overlay to improve readability */}
            <div className="absolute inset-0 backdrop-blur-sm bg-white/30 -z-5" />

            <style jsx global>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6">
                {!isPlaying ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-black">Dodge Game</h2>
                        <p className="mb-2 text-black">Use UP/DOWN arrows or buttons to move!</p>
                        <p className="mb-4 text-black">Press SPACE or JUMP button to jump!</p>
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
                        >
                            Start Game
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between mb-4">
                            <div className="text-lg font-bold text-green-500">Dodged: {dodgeCount}</div>
                            <div className="text-lg font-bold text-red-500">Hit: {hitCount}</div>
                        </div>

                        <div
                            className={`relative w-full h-48 sm:h-64 bg-white/50 backdrop-blur-sm border-2 border-white/50 rounded-lg mb-4 overflow-hidden
                            ${screenShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                        >
                            <div
                                className={`absolute w-6 h-6 sm:w-8 sm:h-8 rounded transition-all duration-100
                                ${isJumping ? 'animate-bounce' : ''}
                                ${isHit ? 'animate-[flash_0.5s_ease-in-out]' : 'bg-blue-500'}`}
                                style={{
                                    left: `${position.x}%`,
                                    top: `${position.y}%`,
                                }}
                            />

                            {obstacles.map(obstacle => (
                                <div
                                    key={obstacle.id}
                                    className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded"
                                    style={{
                                        left: `${obstacle.x}%`,
                                        top: `${obstacle.y}%`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button
                                onTouchStart={moveUp}
                                onClick={moveUp}
                                className="p-4 bg-blue-500 text-white rounded-lg active:bg-blue-600"
                            >
                                <ArrowUp className="w-6 h-6 mx-auto" />
                            </button>
                            <button
                                onTouchStart={jump}
                                onClick={jump}
                                className="p-4 bg-green-500 text-white rounded-lg active:bg-green-600"
                            >
                                JUMP
                            </button>
                            <button
                                onTouchStart={moveDown}
                                onClick={moveDown}
                                className="p-4 bg-blue-500 text-white rounded-lg active:bg-blue-600"
                            >
                                <ArrowDown className="w-6 h-6 mx-auto" />
                            </button>
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Keyboard className="w-5 h-5 text-blue-500" />
                                <span className="font-bold text-black">Last Key: </span>
                                <code className="px-2 py-1 bg-white/70 rounded text-gray-600">{lastKey || 'None'}</code>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(keyCount).map(([key, count]) => (
                                    <div key={key} className="flex justify-between bg-white/70 p-2 rounded shadow-sm">
                                        <code className="text-blue-600">{key}</code>
                                        <span className="font-bold text-black">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setPosition({ x: 20, y: 50 });
                                setObstacles([]);
                                setDodgeCount(0);
                                setHitCount(0);
                                setKeyCount({});
                                setLastKey('');
                            }}
                            className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default KeyboardTestGame;
