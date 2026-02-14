'use client';

/**
 * useGameTick - React hook that subscribes to the game loop.
 * Runs a callback function every frame with delta time.
 */

import { useEffect, useRef } from 'react';
import { gameLoop, type UpdateCallback } from '@/game/engine/GameLoop';

/**
 * Subscribe to the game loop and run a callback every frame.
 * The callback receives (deltaTime, elapsedTime).
 * Automatically unsubscribes on unmount.
 */
export function useGameTick(callback: UpdateCallback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsubscribe = gameLoop.subscribe((dt, elapsed) => {
      callbackRef.current(dt, elapsed);
    });

    return unsubscribe;
  }, []);
}
