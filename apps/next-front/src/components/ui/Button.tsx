import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link' | 'gold' | 'goldOutline' | 'whiteOutline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'h-11 px-5 rounded-none bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-md',
    secondary: 'h-11 px-5 rounded-none border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
    gold: 'h-11 px-5 rounded-none bg-[var(--color-accent)] text-white hover:opacity-90 hover:shadow-md',
    goldOutline: 'h-11 px-5 rounded-none border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white',
    whiteOutline: 'h-11 px-5 rounded-none border-2 border-white text-white hover:bg-white hover:text-[var(--color-primary)]'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
