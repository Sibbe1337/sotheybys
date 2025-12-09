// ✅ LINUS FIX: Instant loading state for purchase assignments page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[500px] bg-[#002349]/70" />
        
        {/* Social icons skeleton */}
        <div className="py-8 flex justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        
        {/* Content skeleton */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
          </div>
        </div>
        
        {/* Office section skeleton */}
        <div className="h-[400px] bg-gray-300" />
      </main>
    </div>
  );
}

