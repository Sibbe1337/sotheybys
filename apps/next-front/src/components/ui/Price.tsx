import React from 'react';
import { cn } from '@/lib/utils';

interface PriceProps {
  children: React.ReactNode;
  className?: string;
  block?: boolean;
}

export const Price: React.FC<PriceProps> = ({ 
  children, 
  className,
  block = false 
}) => {
  return (
    <strong 
      className={cn(
        'font-extrabold text-[var(--text-default)]',
        block && 'block',
        className
      )}
    >
      {children}
    </strong>
  );
};

export default Price;
