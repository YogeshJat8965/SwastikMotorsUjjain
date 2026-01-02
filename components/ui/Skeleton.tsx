interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-shimmer bg-gray-200 rounded ${className}`} />
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-56 w-full" />
      
      {/* Content skeleton */}
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        
        {/* Specs skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function RentalCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-56 w-full" />
      
      {/* Content skeleton */}
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-3" />
        
        {/* Price skeleton */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <Skeleton className="h-8 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        
        {/* Specs skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, type = 'vehicle' }: { count?: number; type?: 'vehicle' | 'rental' }) {
  const SkeletonComponent = type === 'vehicle' ? VehicleCardSkeleton : RentalCardSkeleton;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
