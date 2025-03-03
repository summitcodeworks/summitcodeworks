'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()
    
    // Determine if the current page has a hero image
    const hasHeroImage = pathname === '/' || pathname === '/apps'
    
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

    // Determine header background based on scroll state and whether page has hero image
    const headerBg = isScrolled 
        ? 'bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60' 
        : hasHeroImage 
            ? 'bg-transparent' 
            : 'bg-background'
    
    // Determine text color based on scroll state and whether page has hero image
    const textColor = isScrolled || !hasHeroImage
        ? 'text-primary'
        : 'text-primary-foreground'
    
    const linkColor = isScrolled || !hasHeroImage
        ? 'text-muted-foreground'
        : 'text-primary-foreground/90'

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className={`text-2xl font-bold ${textColor}`}>Summit Codeworks</div>
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className={`hover:text-primary dark:hover:text-primary transition duration-300 ${linkColor}`}>Home</Link>
                        <Link href="/#services" className={`hover:text-primary dark:hover:text-primary transition duration-300 ${linkColor}`}>Services</Link>
                        <Link href="/#about" className={`hover:text-primary dark:hover:text-primary transition duration-300 ${linkColor}`}>About</Link>
                        <Link href="/#portfolio" className={`hover:text-primary dark:hover:text-primary transition duration-300 ${linkColor}`}>Portfolio</Link>
                        <Link href="/contact" className={`hover:text-primary dark:hover:text-primary transition duration-300 ${linkColor}`}>Contact</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`hover:text-primary transition duration-300 ${linkColor}`}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition duration-300">Home</Link>
                        <Link href="/#services" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition duration-300">Services</Link>
                        <Link href="/#about" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition duration-300">About</Link>
                        <Link href="/#portfolio" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition duration-300">Portfolio</Link>
                        <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition duration-300">Contact</Link>
                    </div>
                </div>
            )}
        </header>
    )
}

