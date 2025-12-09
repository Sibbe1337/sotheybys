/**
 * Loading UI for properties listing page
 * 
 * Shows grid skeleton for smooth transition
 */
export default function PropertiesLoading() {
  return (
    <main className="flex-1">
      {/* Hero skeleton */}
      <div className="h-[40vh] bg-gray-100 animate-pulse"></div>
      
      {/* Filter bar skeleton */}
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-200 overflow-hidden">
              <div className="h-56 bg-gray-100 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-10 bg-[#002349]/10 rounded animate-pulse mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

