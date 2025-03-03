"use client"

import type React from "react"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const apps = [
    { id: "app1", name: "Main App" },
    { id: "app2", name: "Mobile App" },
    { id: "app3", name: "Desktop App" },
]

export function AccountDeletionForm() {
    const [selectedApp, setSelectedApp] = useState("")
    const [emailOrPhone, setEmailOrPhone] = useState("")
    const [reason, setReason] = useState("")
    const [confirmation, setConfirmation] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const isValidEmailOrPhone = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^\+?[\d\s-]{10,}$/
        return emailRegex.test(value) || phoneRegex.test(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (!isValidEmailOrPhone(emailOrPhone)) {
            setError("Please enter a valid email or phone number.")
            setIsLoading(false)
            return
        }

        if (reason.trim().length < 10) {
            setError("Please provide a reason with at least 10 characters.")
            setIsLoading(false)
            return
        }

        // Simulating an API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        if (confirmation.toLowerCase() !== "delete my account") {
            setError("Please type the confirmation phrase correctly.")
            setIsLoading(false)
            return
        }

        // Here you would typically make an API call to delete the account
        // For this example, we'll just simulate success
        setSuccess(true)
        setIsLoading(false)
    }

    if (success) {
        return (
            <div className="bg-black text-white p-8 rounded-lg border border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
                <div className="absolute h-40 w-40 rounded-full bg-purple-600/20 blur-3xl -top-10 -left-10" />
                <div className="absolute h-40 w-40 rounded-full bg-cyan-600/20 blur-3xl -bottom-10 -right-10" />
                <div className="relative z-10">
                    <Alert className="bg-black/60 border border-green-500/20 text-green-400">
                        <AlertTitle className="text-lg font-medium">Account Deletion Request Submitted</AlertTitle>
                        <AlertDescription className="text-gray-300">
                            Your account deletion request has been received. We&apos;ll process it within 24 hours and send a confirmation to
                            the provided email or phone number.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-black text-white p-8 rounded-lg border border-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
            <div className="absolute h-40 w-40 rounded-full bg-purple-600/20 blur-3xl -top-10 -left-10" />
            <div className="absolute h-40 w-40 rounded-full bg-cyan-600/20 blur-3xl -bottom-10 -right-10" />
            
            <div className="relative z-10">
                <h2 className="text-2xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Delete Your Account
                </h2>
                <p className="text-gray-400 mb-6">
                    We&apos;re sorry to see you go. Please complete the form below to request account deletion.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="app" className="text-gray-300">Select App</Label>
                            <Select onValueChange={setSelectedApp}>
                                <SelectTrigger id="app" className="bg-black/60 border-gray-800 text-white">
                                    <SelectValue placeholder="Select an app" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-gray-800 text-white">
                                    {apps.map((app) => (
                                        <SelectItem key={app.id} value={app.id} className="focus:bg-gray-800 focus:text-white">
                                            {app.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emailOrPhone" className="text-gray-300">Email or Phone Number</Label>
                            <Input
                                id="emailOrPhone"
                                type="text"
                                placeholder="Enter your email or phone number"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                className="bg-black/60 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-gray-300">Reason for Deletion</Label>
                            <Textarea
                                id="reason"
                                placeholder="Please tell us why you&apos;re deleting your account"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                className="bg-black/60 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmation" className="text-gray-300">Confirmation</Label>
                            <div className="relative">
                                <Input
                                    id="confirmation"
                                    type="text"
                                    placeholder="Type &apos;delete my account&apos; to confirm"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    className="bg-black/60 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                                />
                                {confirmation.toLowerCase() === "delete my account" && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-red-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            !selectedApp || !emailOrPhone || !reason || confirmation.toLowerCase() !== "delete my account" || isLoading
                        }
                        className={cn(
                            "w-full relative overflow-hidden transition-all",
                            "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800",
                            "border-0 text-white font-medium"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting Request...
                            </>
                        ) : (
                            "Submit Deletion Request"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

