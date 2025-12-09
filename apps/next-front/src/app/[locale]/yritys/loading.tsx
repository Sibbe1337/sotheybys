// ✅ LINUS FIX: Instant loading state for company page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[400px] md:h-[500px] bg-gray-200" />
        
        {/* Social icons skeleton */}
        <div className="py-8 flex justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        
        {/* Intro section skeleton */}
        <div className="py-8">
          <div className="max-w-3xl mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
          </div>
        </div>
        
        {/* Three boxes skeleton */}
        <div className="py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="h-[250px] bg-gray-200" />
            <div className="h-[250px] bg-gray-200" />
            <div className="h-[250px] bg-gray-200" />
          </div>
        </div>
        
        {/* About section skeleton */}
        <div className="h-[400px] bg-gray-300" />
      </main>
    </div>
  );
}

