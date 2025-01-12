import React from 'react';
import { Smartphone, Globe, Code } from 'lucide-react'

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function Services() {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <ServiceCard
                        icon={<Smartphone className="w-12 h-12 text-blue-600" />}
                        title="Mobile Development"
                        description="Create powerful, user-friendly mobile applications for iOS and Android platforms."
                    />
                    <ServiceCard
                        icon={<Globe className="w-12 h-12 text-blue-600" />}
                        title="Web Development"
                        description="Build responsive, scalable web applications using cutting-edge technologies."
                    />
                    <ServiceCard
                        icon={<Code className="w-12 h-12 text-blue-600" />}
                        title="Custom Software"
                        description="Develop tailor-made software solutions to address your unique business challenges."
                    />
                </div>
            </div>
        </section>
    )
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-300">
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

