'use client';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Please wait...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4">
        {/* Animated loader */}
        <div className="relative w-20 h-20">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Middle spinning ring (reverse) */}
          <div className="absolute inset-2 border-4 border-green-200 border-b-green-600 rounded-full animate-spin-reverse"></div>
          
          {/* Inner pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl animate-bounce-slow">
              🏍️
            </div>
          </div>
        </div>

        {/* Loading message */}
        <p className="mt-6 text-gray-700 font-semibold text-lg text-center">{message}</p>
        
        {/* Animated dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
