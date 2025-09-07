export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative h-[70vh] bg-gray-300">
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-2xl">
            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Image navigation skeleton */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          <div className="w-12 h-12 bg-white/50 rounded-full"></div>
          <div className="w-12 h-12 bg-white/50 rounded-full"></div>
        </div>
      </section>

      {/* Tabs Skeleton */}
      <section className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              
              {/* Key features grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between py-3 border-b">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="h-6 bg-gray-200 rounded mb-6 w-2/3"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-12 bg-[#002349] rounded-lg opacity-20"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
