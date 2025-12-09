/**
 * Loading UI for page transitions
 * 
 * Next.js automatically shows this component during navigation
 * This provides instant visual feedback while the new page loads
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {/* Elegant spinner matching Sotheby's brand */}
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 border-2 border-[#002349]/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-[#002349] rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 font-light tracking-wide">Laddar...</p>
      </div>
    </div>
  );
}

