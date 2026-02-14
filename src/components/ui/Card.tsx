'use client';

/**
 * Card - Reusable panel component with neo-styled border and background.
 */

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glowing?: boolean;
}

export function Card({ children, className = '', title, glowing = false }: CardProps) {
  return (
    <div
      className={`
        bg-neo-panel rounded-lg border border-gray-700/50 p-4
        ${glowing ? 'border-neo-cyan/50 animate-pulse-glow' : ''}
        ${className}
      `}
    >
      {title && (
        <h2 className="text-lg font-bold text-neo-cyan font-mono mb-3 border-b border-gray-700 pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
