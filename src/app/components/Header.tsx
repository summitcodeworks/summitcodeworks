'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Summit Codeworks</div>
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Home</Link>
                        <Link href="/#services" className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Services</Link>
                        <Link href="/#about" className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>About</Link>
                        <Link href="/#portfolio" className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Portfolio</Link>
                        <Link href="/contact" className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Contact</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`hover:text-blue-600 transition duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300">Home</Link>
                        <Link href="/#services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300">Services</Link>
                        <Link href="/#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300">About</Link>
                        <Link href="/#portfolio" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300">Portfolio</Link>
                        <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300">Contact</Link>
                    </div>
                </div>
            )}
        </header>
    )
}

