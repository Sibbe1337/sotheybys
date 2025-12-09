// ✅ LINUS FIX: Instant loading state for international page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[700px] bg-gray-300" />
        
        {/* Social icons skeleton */}
        <div className="py-6 flex justify-center gap-6">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        
        {/* Content section skeleton */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        
        {/* Destinations grid skeleton */}
        <div className="py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-64 bg-gray-200 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

