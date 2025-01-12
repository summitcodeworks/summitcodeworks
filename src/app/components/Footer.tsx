export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-2xl font-bold">Summit Codeworks</h3>
                        <p className="text-gray-400">Elevating digital experiences</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://www.linkedin.com/company/summit-codeworks/" className="hover:text-blue-400 transition duration-300" target="_blank">LinkedIn</a>
                        <a href="https://x.com/summitcodeworks" className="hover:text-blue-400 transition duration-300" target="_blank">Twitter</a>
                        <a href="https://www.instagram.com/summitcodeworks/" className="hover:text-blue-400 transition duration-300" target="_blank">Instagram</a>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Summit Codeworks. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

