'use client';

/**
 * useKeyboard - React hook for tracking keyboard state.
 * Provides a simple API to check if specific keys are currently pressed.
 */

import { useEffect, useCallback, useRef } from 'react';

export function useKeyboard() {
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isKeyDown = useCallback((code: string): boolean => {
    return keysRef.current.has(code);
  }, []);

  const getKeys = useCallback((): Set<string> => {
    return new Set(keysRef.current);
  }, []);

  return { isKeyDown, getKeys };
}
