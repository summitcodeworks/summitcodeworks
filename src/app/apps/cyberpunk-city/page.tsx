'use client';

import { Suspense } from 'react';
import CyberpunkScene from './components/CyberpunkScene';
import UI from './components/UI';
import Loading from './components/Loading';

export default function CyberpunkCityPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Suspense fallback={<Loading />}>
        <CyberpunkScene />
        <UI />
      </Suspense>
    </div>
  );
} 