interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingState({ message = 'Loading...', size = 'md', fullScreen = false }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center px-4'
    : 'flex flex-col items-center justify-center min-h-[400px] py-12 sm:py-16 px-4';

  return (
    <div className={containerClasses}>
      {/* Enhanced Loader */}
      <div className="relative">
        {/* Outer glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md animate-pulse`}></div>
        
        {/* Spinning gradient ring */}
        <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 animate-spin`} style={{ padding: '3px' }}>
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

      {/* Loading message with gradient text */}
      <p className="mt-6 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-text">
        {message}
      </p>
      
      {/* Animated progress dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
