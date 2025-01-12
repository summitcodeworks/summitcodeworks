import Image from 'next/image'

interface PortfolioItemProps {
    image: string
    title: string
    description: string
}

export default function Portfolio() {
    return (
        <section id="portfolio" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PortfolioItem
                        image="/fitness.jpg?height=300&width=400"
                        title="Mobile App for Fitness Tracking"
                        description="A comprehensive fitness app with personalized workout plans and progress tracking."
                    />
                    <PortfolioItem
                        image="/ecommerce.jpg?height=300&width=400"
                        title="E-commerce Web Platform"
                        description="A scalable and secure online shopping platform with advanced features and analytics."
                    />
                    <PortfolioItem
                        image="/crm.jpg?height=300&width=400"
                        title="Custom CRM Solution"
                        description="A tailor-made customer relationship management system for a leading telecommunications company."
                    />
                </div>
            </div>
        </section>
    )
}

function PortfolioItem({ image, title, description }: PortfolioItemProps) {
    return (
        <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    )
}

