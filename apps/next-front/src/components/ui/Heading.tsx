import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ 
  as: Component = 'h2', 
  children, 
  className 
}) => {
  const styles = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-light text-[var(--brand-blue)]',
    h2: 'text-3xl md:text-4xl font-light text-[var(--brand-blue)]',
    h3: 'text-2xl md:text-3xl font-light text-[var(--brand-blue)]'
  };

  return (
    <Component className={cn(styles[Component], className)}>
      {children}
    </Component>
  );
};

export default Heading;
