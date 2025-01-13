import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <Image
                            src="/about.jpg"
                            alt="Team working"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">About Summit Codeworks</h2>
                        <p className="text-gray-600 mb-6">
                            At Summit Codeworks, we&#39;re passionate about turning innovative ideas into reality. Our
                            team of expert developers and designers work tirelessly to create cutting-edge solutions
                            that drive business growth and user engagement.
                        </p>
                        <p className="text-gray-600">
                            With years of experience in mobile, web, and custom software development, we&#39;re
                            committed to delivering high-quality products that exceed our clients&#39; expectations.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
