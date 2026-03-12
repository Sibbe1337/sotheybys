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
  const baseClasses = 'absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-200';
  
  const variantClasses = variant === 'dark'
    ? 'bg-white/50 hover:bg-white/70'
    : 'bg-black/20 hover:bg-black/40';
  
  const positionClasses = direction === 'left' 
    ? 'left-2 sm:left-3' 
    : 'right-2 sm:right-3';

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
        className={`w-4 h-4 sm:w-5 sm:h-5 ${variant === 'dark' ? 'text-gray-700' : 'text-white'}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

