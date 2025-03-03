'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QuoteIcon } from 'lucide-react';

interface DailyQuoteProps {
  quote: {
    text: string;
    author: string;
  };
}

export default function DailyQuote({ quote }: DailyQuoteProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none shadow-sm">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start">
          <QuoteIcon className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-lg font-medium italic text-gray-800 dark:text-gray-200">
              &quot;{quote.text}&quot;
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              — {quote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}