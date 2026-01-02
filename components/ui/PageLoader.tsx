'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Show loader when navigation starts (this will be triggered by route changes)
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen to route changes
    window.addEventListener('beforeunload', handleStart);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center">
        {/* Main loader with bike animation */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Middle ring (reverse) */}
          <div className="absolute inset-3 border-4 border-green-200 border-b-green-600 rounded-full animate-spin-reverse"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-6 border-4 border-orange-200 border-l-orange-600 rounded-full animate-spin"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-bounce-slow">
              🏍️
            </div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="mt-6 flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-700">Loading</p>
          <div className="flex gap-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 via-green-600 to-orange-600 animate-progress"></div>
        </div>
      </div>
    </div>
  );
}
