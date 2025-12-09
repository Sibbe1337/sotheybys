// ✅ LINUS FIX: Instant loading state for references page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[300px] bg-[#002349]" />
        
        {/* Content section skeleton */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </div>
        
        {/* Property grid skeleton */}
        <div className="py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white shadow-md">
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

