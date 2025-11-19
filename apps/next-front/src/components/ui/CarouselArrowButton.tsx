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
  // Always centered vertically on all devices
  const baseClasses = 'absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-transparent backdrop-blur-sm transition-all duration-200 rounded-none border-2';
  
  const variantClasses = variant === 'dark'
    ? 'border-black/20 hover:border-black/40 hover:bg-black/10'
    : 'border-white/30 hover:border-white/60 hover:bg-white/20';
  
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
        className={`w-6 h-6 ${variant === 'dark' ? 'text-black' : 'text-white'}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

