import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-heading font-bold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[color:var(--pq-amber)] text-white hover:brightness-110 focus:ring-[color:var(--pq-amber)] shadow-[0_4px_0_0_#D48806]',
    secondary: 'bg-white text-[color:var(--pq-charcoal)] border-2 border-[color:var(--pq-slate)] hover:bg-[color:var(--pq-cream)] focus:ring-[color:var(--pq-slate)]',
    success: 'bg-[color:var(--pq-sage)] text-white hover:brightness-110 focus:ring-[color:var(--pq-sage)] shadow-[0_4px_0_0_#5A8B5D]',
    danger: 'bg-[color:var(--pq-coral)] text-white hover:brightness-110 focus:ring-[color:var(--pq-coral)] shadow-[0_4px_0_0_#C5533B]',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-lg min-h-[48px]',
    lg: 'px-8 py-4 text-xl min-h-[56px]',
  };

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.95, y: 4, boxShadow: '0 0px 0 0 transparent' } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
