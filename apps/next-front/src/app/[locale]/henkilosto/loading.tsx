// ✅ LINUS FIX: Instant loading state for staff page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[300px] md:h-[400px] bg-gray-200" />
        
        {/* Staff grid skeleton */}
        <div className="py-16 px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-48 h-60 bg-gray-200 mx-auto mb-4 rounded" />
                <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-4" />
                <div className="h-3 bg-gray-200 rounded w-28 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

