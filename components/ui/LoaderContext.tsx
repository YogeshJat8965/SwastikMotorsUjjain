'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  setLoadingWithDelay: (delay?: number) => Promise<void>;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const setLoadingWithDelay = async (delay: number = 300) => {
    showLoader();
    await new Promise(resolve => setTimeout(resolve, delay));
    hideLoader();
  };

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader, setLoadingWithDelay }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            {/* Animated Loader */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-green-200 border-b-green-600 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-bounce">🏍️</span>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 animate-pulse">
                Loading...
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}
