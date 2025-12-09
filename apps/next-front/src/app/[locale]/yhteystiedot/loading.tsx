// ✅ LINUS FIX: Instant loading state for contact page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[500px] md:h-[600px] bg-gray-200" />
        
        {/* Social icons skeleton */}
        <div className="py-8 flex justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        
        {/* Welcome section skeleton */}
        <div className="py-8">
          <div className="max-w-3xl mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        
        {/* Staff grid skeleton */}
        <div className="py-12 px-4">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-40 bg-gray-200 mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

