// ✅ LINUS FIX: Instant loading state for selling page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[600px] bg-[#002349]/50" />
        
        {/* Welcome section skeleton */}
        <div className="py-12 border-b">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        
        {/* 2x2 grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-[500px] bg-gray-300 p-16">
            <div className="h-8 bg-gray-400/50 rounded w-48 mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-white/50 rounded" />
              <div className="h-10 bg-white/50 rounded" />
              <div className="h-24 bg-white/50 rounded" />
            </div>
          </div>
          <div className="h-[500px] bg-white p-16">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="h-[500px] bg-white p-16">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="h-[500px] bg-gray-300 p-16">
            <div className="h-6 bg-gray-400/50 rounded w-44 mb-4" />
            <div className="h-4 bg-gray-400/30 rounded w-full mb-2" />
            <div className="h-4 bg-gray-400/30 rounded w-3/4" />
          </div>
        </div>
      </main>
    </div>
  );
}

