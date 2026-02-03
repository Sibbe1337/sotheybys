'use client';

interface CarouselArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
  variant?: 'light' | 'dark';
}

export function CarouselArrowButton({ 
  direction, 
  onClick, 
  className = '',
  variant = 'light'
}: CarouselArrowButtonProps) {
  // Responsive sizing: smaller on mobile (40px), larger on desktop (48px)
  // More visible background on mobile for better UX
  const baseClasses = 'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 rounded-none';
  
  const variantClasses = variant === 'dark'
    ? 'bg-white/70 sm:bg-white/50 hover:bg-white/90 border border-gray-300 shadow-sm'
    : 'bg-black/40 sm:bg-black/30 hover:bg-black/60 border border-white/40 hover:border-white/70 backdrop-blur-sm';
  
  const positionClasses = direction === 'left' 
    ? 'left-2 sm:left-4' 
    : 'right-2 sm:right-4';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${positionClasses} ${className}`}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      <svg 
        className={`w-5 h-5 sm:w-6 sm:h-6 ${variant === 'dark' ? 'text-gray-800' : 'text-white'}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

