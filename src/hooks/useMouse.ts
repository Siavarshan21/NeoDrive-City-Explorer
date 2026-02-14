'use client';

/**
 * useMouse - React hook for tracking mouse position and movement deltas.
 * Used for camera rotation and UI interactions.
 */

import { useEffect, useRef, useCallback } from 'react';

interface MouseState {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  buttons: Set<number>;
}

export function useMouse() {
  const stateRef = useRef<MouseState>({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    buttons: new Set(),
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      stateRef.current.deltaX += e.movementX;
      stateRef.current.deltaY += e.movementY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.buttons.add(e.button);
    };

    const handleMouseUp = (e: MouseEvent) => {
      stateRef.current.buttons.delete(e.button);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  /** Consume and reset the accumulated mouse delta */
  const consumeDelta = useCallback(() => {
    const delta = {
      x: stateRef.current.deltaX,
      y: stateRef.current.deltaY,
    };
    stateRef.current.deltaX = 0;
    stateRef.current.deltaY = 0;
    return delta;
  }, []);

  const isButtonDown = useCallback((button: number): boolean => {
    return stateRef.current.buttons.has(button);
  }, []);

  return { state: stateRef, consumeDelta, isButtonDown };
}
