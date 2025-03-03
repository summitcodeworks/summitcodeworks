import Image from 'next/image'
import Link from 'next/link'
import NetworkBackground from './NetworkBackground'

interface PortfolioItemProps {
    image: string
    title: string
    description: string
    link?: string
}

export default function Portfolio() {
    return (
        <section id="portfolio" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/95">
                <NetworkBackground 
                    particleColor="rgba(255, 255, 255, 0.5)" 
                    lineColor="rgba(255, 255, 255, 0.15)"
                    particleCount={70}
                    lineDistance={120}
                />
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center text-primary-foreground mb-4">Our Work</h2>
                <p className="text-center text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
                    We create innovative digital solutions that solve real-world problems. 
                    Our portfolio showcases our expertise in web development, mobile applications, and interactive experiences.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PortfolioItem
                        image="/cyberpunk-preview.jpg?height=300&width=400"
                        title="Cyberpunk City 3D Experience"
                        description="An immersive 3D dystopian cityscape with interactive elements and stunning visual effects."
                        link="/apps/cyberpunk-city"
                    />
                    <PortfolioItem
                        image="/fitness.jpg?height=300&width=400"
                        title="Fitness Tracker App"
                        description="A comprehensive fitness app with personalized workout plans and progress tracking."
                        link="/apps/fitness-tracker"
                    />
                    <PortfolioItem
                        image="/ecommerce.jpg?height=300&width=400"
                        title="E-commerce Web Platform"
                        description="A scalable and secure online shopping platform with advanced features and analytics."
                    />
                </div>
                
                <div className="mt-12 text-center">
                    <Link href="/apps" className="inline-block px-6 py-3 bg-background text-primary font-medium rounded-md hover:bg-secondary transition-colors">
                        View All Projects
                    </Link>
                </div>
            </div>
        </section>
    )
}

function PortfolioItem({ image, title, description, link }: PortfolioItemProps) {
    const content = (
        <>
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
                {link && (
                    <div className="mt-4">
                        <span className="text-primary hover:text-primary/80 font-medium">
                            View Demo →
                        </span>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
            {link ? (
                <Link href={link} className="block h-full">
                    {content}
                </Link>
            ) : (
                content
            )}
        </div>
    );
}

