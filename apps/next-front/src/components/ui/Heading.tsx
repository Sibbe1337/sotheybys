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
    h1: 'text-4xl md:text-5xl lg:text-6xl text-[var(--color-primary)]',
    h2: 'text-3xl md:text-4xl text-[var(--color-primary)]',
    h3: 'text-2xl md:text-3xl text-[var(--color-primary)]'
  };

  return (
    <Component className={cn(styles[Component], className)}>
      {children}
    </Component>
  );
};

export default Heading;
