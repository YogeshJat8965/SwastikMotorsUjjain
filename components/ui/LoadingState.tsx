interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Beautiful animated loader */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        
        {/* Middle spinning ring (reverse) */}
        <div className={`absolute inset-3 border-4 border-green-200 border-b-green-600 rounded-full animate-spin-reverse`}></div>
        
        {/* Inner spinning ring */}
        <div className={`absolute inset-6 border-4 border-orange-200 border-l-orange-600 rounded-full animate-spin`}></div>
        
        {/* Inner pulsing core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${iconSizes[size]} animate-bounce-slow drop-shadow-lg`}>
            🏍️
          </div>
        </div>
      </div>

      {/* Loading message */}
      <p className="mt-8 text-gray-700 font-semibold text-lg animate-pulse">{message}</p>
      
      {/* Animated dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 via-green-600 to-orange-600 animate-progress"></div>
      </div>
    </div>
  );
}
