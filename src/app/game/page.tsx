'use client';

/**
 * Game Page - Main game view combining the 3D canvas with UI overlays.
 * This is the primary page where all gameplay happens.
 */

import dynamic from 'next/dynamic';
import { HUD } from '@/components/hud/HUD';
import { PointerLockPrompt } from '@/components/hud/PointerLockPrompt';
import { MainMenu } from '@/components/menus/MainMenu';
import { PauseMenu } from '@/components/menus/PauseMenu';
import { GameErrorBoundary } from '@/components/ui/GameErrorBoundary';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { DAY_NIGHT } from '@/game/utils/constants';

// Dynamic import for the 3D canvas to avoid SSR issues with Three.js
const GameCanvas = dynamic(() => import('@/game/engine/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1a',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          color: '#00f0ff',
          fontFamily: 'monospace',
          fontSize: 20,
        }}
      >
        Initializing 3D Engine...
      </div>
    </div>
  ),
});

/** Day/Night cycle updater */
function DayNightCycle() {
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isPaused = useUIStore((s) => s.isPaused);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  useEffect(() => {
    if (!isGameRunning || isPaused) return;

    const interval = setInterval(() => {
      // Advance time: full cycle in DAY_NIGHT.CYCLE_DURATION seconds
      const increment = (1 / DAY_NIGHT.CYCLE_DURATION) * 0.1; // 100ms interval
      setTimeOfDay(timeOfDay + increment);
    }, 100);

    return () => clearInterval(interval);
  }, [isGameRunning, isPaused, timeOfDay, setTimeOfDay]);

  return null;
}

export default function GamePage() {
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const isGameRunning = useGameStore((s) => s.isGameRunning);

  return (
    <GameErrorBoundary>
      <div
        className="h-screen w-screen overflow-hidden bg-neo-dark game-active"
        style={{ backgroundColor: '#0a0a1a', minHeight: '100vh', minWidth: '100vw' }}
      >
        {/* 3D Game Canvas */}
        <GameCanvas />

        {/* Day/Night cycle timer */}
        <DayNightCycle />

        {/* HUD Overlay (only during gameplay) */}
        {isGameRunning && !isMainMenu && <HUD />}

        {/* Pointer Lock Prompt */}
        <PointerLockPrompt />

        {/* Menus */}
        <MainMenu />
        <PauseMenu />
      </div>
    </GameErrorBoundary>
  );
}
