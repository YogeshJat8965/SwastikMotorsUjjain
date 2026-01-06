import React from 'react';

export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="relative">
        {/* Outer glow effect */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md animate-pulse`}></div>
        
        {/* Spinning gradient ring */}
        <div className={`relative ${sizes[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 animate-spin`} style={{ padding: '3px' }}>
          <div className="w-full h-full rounded-full bg-white"></div>
          
          {/* Counter-rotating particles */}
          <div className="absolute inset-1.5 animate-spin-slow-reverse">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-0.75 rounded-full bg-blue-500"></div>
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -ml-0.75 rounded-full bg-purple-500"></div>
          </div>
        </div>
        
        {/* Center bike icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${iconSizes[size]} animate-pulse-gentle`}>🏍️</span>
        </div>
      </div>
    </div>
  );
}
