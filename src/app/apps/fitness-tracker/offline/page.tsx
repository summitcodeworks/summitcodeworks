'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <WifiOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <CardTitle className="text-2xl">You&apos;re Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            It looks like you&apos;re currently offline. Some features of the Fitness Tracker may not be available until you reconnect.
          </p>
          <p className="mb-6">
            You can still view previously loaded data and use basic features that don&apos;t require an internet connection.
          </p>
          <Button 
            onClick={() => window.location.href = '/apps/fitness-tracker'}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 