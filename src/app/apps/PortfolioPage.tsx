'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'
import NetworkBackground from '../components/NetworkBackground'

interface PortfolioItemProps {
    image: string
    title: string
    description: string
    technologies: string[]
    features: string[]
}

const portfolioItems: PortfolioItemProps[] = [
    {
        image: "/cyberpunk-preview.jpg",
        title: "Cyberpunk City 3D Experience",
        description: "An immersive 3D dystopian cityscape inspired by cyberpunk aesthetics. This interactive experience features a dark, gritty urban environment with towering skyscrapers adorned with glowing neon lights in vibrant colors.",
        technologies: ["Next.js", "Three.js", "React Three Fiber", "TypeScript", "Tailwind CSS"],
        features: [
            "Interactive 3D environment with orbit controls",
            "Procedurally generated buildings with neon lights",
            "Animated ground and flying vehicles",
            "Atmospheric effects including fog and rain",
            "Adjustable scene parameters via UI controls"
        ]
    },
    {
        image: "/fitness.jpg",
        title: "Mobile App for Fitness Tracking",
        description: "A comprehensive fitness app with personalized workout plans and progress tracking. This application helps users maintain their fitness goals with intuitive interfaces and real-time analytics.",
        technologies: ["React Native", "Firebase", "Node.js", "Express", "MongoDB"],
        features: [
            "Personalized workout plans",
            "Progress tracking with visual charts",
            "Nutrition planning and calorie counting",
            "Social sharing capabilities",
            "Integration with wearable devices"
        ]
    },
    {
        image: "/ecommerce.jpg",
        title: "E-commerce Web Platform",
        description: "A scalable and secure online shopping platform with advanced features and analytics. This platform provides businesses with everything they need to sell products online effectively.",
        technologies: ["React", "Next.js", "Stripe", "PostgreSQL", "AWS"],
        features: [
            "Responsive product catalog",
            "Secure payment processing",
            "Inventory management",
            "Customer account management",
            "Order tracking and history"
        ]
    },
]

export default function PortfolioPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const nextProject = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === portfolioItems.length - 1 ? 0 : prevIndex + 1
        )
    }
    
    const prevProject = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? portfolioItems.length - 1 : prevIndex - 1
        )
    }
    
    const currentItem = portfolioItems[currentIndex]

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Header />
            
            {/* Hero section with network background */}
            <div className="relative h-80 md:h-96 lg:h-[500px] w-full bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
                <NetworkBackground 
                    particleColor="rgba(255, 255, 255, 0.6)" 
                    lineColor="rgba(255, 255, 255, 0.2)"
                    particleCount={100}
                    lineDistance={150}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Portfolio</h1>
                    <p className="text-lg md:text-xl text-white max-w-2xl">
                        Explore our diverse range of projects showcasing our technical expertise and creative solutions.
                    </p>
                </div>
            </div>
            
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {portfolioItems.map((item, index) => (
                        <div 
                            key={index}
                            className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 ${index === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="relative w-full h-96 overflow-hidden">
                        <Image
                            src={currentItem.image}
                            alt={currentItem.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <h2 className="absolute bottom-6 left-8 text-3xl font-bold text-white">{currentItem.title}</h2>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex justify-end items-center mb-6">
                            <div className="flex space-x-4">
                                <button 
                                    onClick={prevProject}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ArrowLeft size={20} className="text-gray-800 dark:text-gray-200" />
                                </button>
                                <button 
                                    onClick={nextProject}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ArrowRight size={20} className="text-gray-800 dark:text-gray-200" />
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentItem.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Technologies Used</h3>
                                <ul className="space-y-2">
                                    {currentItem.technologies.map((tech, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            <span className="text-gray-700 dark:text-gray-300">{tech}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Key Features</h3>
                                <ul className="space-y-2">
                                    {currentItem.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            {currentIndex === 0 ? (
                                <Link href="/apps/cyberpunk-city" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Explore Cyberpunk City
                                </Link>
                            ) : currentIndex === 1 ? (
                                <Link href="/apps/fitness-tracker" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Try Fitness Tracker
                                </Link>
                            ) : (
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    View Live Demo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
} 