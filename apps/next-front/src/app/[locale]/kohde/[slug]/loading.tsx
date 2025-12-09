/**
 * Loading UI for property detail pages
 * 
 * Shows skeleton placeholders for instant feedback
 * while property data is being fetched
 */
export default function PropertyLoading() {
  return (
    <main className="flex-1">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 border-2 border-[#002349]/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-transparent border-t-[#002349] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

