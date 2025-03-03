import { AccountDeletionForm } from "../account-delete/AccountDeletionForm"

export default function AccountDeletionPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px]" />
            <div className="absolute h-80 w-80 rounded-full bg-purple-600/10 blur-3xl top-20 -left-20" />
            <div className="absolute h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl -bottom-20 -right-20" />
            
            {/* Content */}
            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Request Account Deletion
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        We&apos;re sorry to see you go. Please provide the required information to process your account deletion request.
                    </p>
                </div>
                <AccountDeletionForm />
            </div>
        </main>
    )
}

