'use client';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Please wait...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm px-4">
      <div className="flex flex-col items-center gap-3">
        {/* Enhanced Loader */}
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md animate-pulse"></div>
          
          {/* Spinning gradient ring */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 animate-spin" style={{ padding: '3px' }}>
            <div className="w-full h-full rounded-full bg-white"></div>
            
            {/* Counter-rotating particles */}
            <div className="absolute inset-1.5 animate-spin-slow-reverse">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-0.75 rounded-full bg-blue-500"></div>
              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -ml-0.75 rounded-full bg-purple-500"></div>
            </div>
          </div>
          
          {/* Center bike icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse-gentle">🏍️</span>
          </div>
        </div>
        
        {/* Loading text with gradient */}
        <p className="text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-text">
          {message}
        </p>
        
        {/* Bouncing dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
