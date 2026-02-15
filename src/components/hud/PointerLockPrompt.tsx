'use client';

/**
 * PointerLockPrompt - Shows instructions to click for mouse look when pointer is not locked.
 * Displays prominently in the center of the screen when needed.
 */

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';

export function PointerLockPrompt() {
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const isPaused = useUIStore((s) => s.isPaused);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  // Don't show if in menu, paused, or pointer is locked
  if (!isGameRunning || isMainMenu || isPaused || isPointerLocked) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      <div className="bg-neo-dark/90 border-2 border-neo-cyan/50 rounded-lg px-8 py-6 text-center animate-pulse-glow pointer-events-auto">
        <div className="text-2xl font-bold text-neo-cyan font-mono mb-2">
          CLICK TO LOOK AROUND
        </div>
        <div className="text-sm text-gray-400 font-mono">
          Click anywhere on the game to enable mouse look
        </div>
        <div className="text-xs text-gray-500 font-mono mt-3">
          Press ESC to release mouse
        </div>
      </div>
    </div>
  );
}
