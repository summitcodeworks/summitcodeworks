'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('hero.jpg?height=1080&width=1920')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(50%)',
                    transform: `translateY(${scrollY * 0.5}px)`
                }}
            />
            <div className="container mx-auto px-6 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                        Elevate Your Digital Presence
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto">
                        We craft exceptional mobile, web, and custom software solutions to bring your ideas to life. Experience innovation at its peak.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link href="#contact" className="bg-blue-600 text-white py-3 px-8 rounded-full font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                            Get Started
                        </Link>
                        <Link href="#portfolio" className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-bold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105">
                            View Our Work
                        </Link>
                    </div>
                </motion.div>
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>
        </section>
    )
}

