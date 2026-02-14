'use client';

/**
 * Button - Reusable neo-styled button component.
 * Supports primary, secondary, and danger variants.
 */

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary:
    'bg-neo-cyan/20 border-neo-cyan text-neo-cyan hover:bg-neo-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]',
  secondary:
    'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white',
  danger:
    'bg-red-900/20 border-red-500 text-red-400 hover:bg-red-900/40',
};

const sizeStyles = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        font-mono border rounded transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
