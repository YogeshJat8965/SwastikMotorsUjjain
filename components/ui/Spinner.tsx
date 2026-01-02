import React from 'react';

export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className={`${sizes[size]} border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        <div className={`absolute inset-1 border-2 border-green-200 border-b-green-600 rounded-full animate-spin-reverse`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${iconSizes[size]} animate-bounce-slow`}>
            🏍️
          </div>
        </div>
      </div>
    </div>
  );
}
