'use client';

/**
 * Modal - Full-screen overlay modal with backdrop blur.
 * Used for pause menu, settings, quest log, etc.
 */

import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-neo-dark border border-neo-cyan/30 rounded-lg p-6 min-w-[320px] max-w-lg max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        {title && (
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-xl font-bold text-neo-cyan font-mono">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg font-mono"
            >
              [X]
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
