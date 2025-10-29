'use client';

type VM = import('@/lib/presentation/property.view-model').PropertyDetailVM;

/**
 * Map component for property detail page
 * ✅ Phase 3: Now renders actual map when coordinates are available
 * Renders client-side only to avoid SSR issues
 */
export function MapView({ vm }: { vm: VM }) {
  const hasCoordinates = vm.coordinates && vm.coordinates.lat && vm.coordinates.lon;
  
  return (
    <div className="bg-white rounded-none shadow-sm p-6">
      <h3 className="text-xl font-light mb-4">Kartta</h3>
      
      {hasCoordinates ? (
        <div className="h-[450px] border border-gray-200 rounded-none overflow-hidden">
          <iframe
            title="Property Location Map"
            src={`https://www.google.com/maps?q=${vm.coordinates?.lat},${vm.coordinates?.lon}&output=embed&z=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="h-[360px] bg-gray-100 flex items-center justify-center border border-gray-200">
          <div className="text-center px-4">
            <svg 
              className="w-12 h-12 text-gray-300 mx-auto mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p className="text-gray-500 text-sm">
              Kartkoordinater inte tillgängliga för denna fastighet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Kontakta mäklaren för mer information om plats
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

