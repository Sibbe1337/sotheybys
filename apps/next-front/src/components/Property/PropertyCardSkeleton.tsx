/**
 * PROPERTY CARD SKELETON
 * 
 * Loading placeholder for PropertyCard during data fetch.
 * Matches PropertyCard dimensions for seamless transition.
 */

export default function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-none border border-gray-200 bg-white shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-[4/3] w-full bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="space-y-2 p-3">
        {/* Title */}
        <div className="h-4 w-4/5 bg-gray-200 rounded" />
        
        {/* Meta row */}
        <div className="h-3 w-3/5 bg-gray-200 rounded" />
        
        {/* Area */}
        <div className="h-3 w-2/5 bg-gray-200 rounded" />
        
        {/* Price */}
        <div className="mt-2 space-y-1">
          <div className="h-4 w-3/5 bg-gray-200 rounded" />
          <div className="h-3 w-2/5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

