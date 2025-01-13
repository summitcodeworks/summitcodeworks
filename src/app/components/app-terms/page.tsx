'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { API_CONFIG } from '../../config/api'

// Separate component that uses useSearchParams
function TermsContent() {
    const [termsContent, setTermsContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const name = searchParams.get('name')

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await fetch(`${API_CONFIG.baseUrl}/app-terms?name=${encodeURIComponent(name || '')}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch terms content')
                }

                const data = await response.json()
                setTermsContent(data.content || '')
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchTerms()
    }, [name])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
            <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{__html: termsContent}}/>
            </div>
        </div>
    )
}

// Main component with Suspense boundary
export default function TermsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            }
        >
            <TermsContent />
        </Suspense>
    )
}
