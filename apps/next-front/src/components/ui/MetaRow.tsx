import React from 'react';
import { cn } from '@/lib/utils';

interface MetaRowProps {
  items: Array<{
    label?: string;
    value: string | number;
  }>;
  separator?: string;
  className?: string;
}

export const MetaRow: React.FC<MetaRowProps> = ({ 
  items, 
  separator = ' • ',
  className 
}) => {
  const validItems = items.filter(item => item.value);
  
  if (validItems.length === 0) return null;
  
  return (
    <div className={cn('text-sm text-[var(--color-dark-gray)] truncate', className)}>
      {validItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-1">{separator}</span>}
          {item.label && <span>{item.label}: </span>}
          <span>{item.value}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default MetaRow;
