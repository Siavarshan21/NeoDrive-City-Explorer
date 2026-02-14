'use client';

/**
 * Game Page - Main game view combining the 3D canvas with UI overlays.
 * This is the primary page where all gameplay happens.
 */

import dynamic from 'next/dynamic';
import { HUD } from '@/components/hud/HUD';
import { MainMenu } from '@/components/menus/MainMenu';
import { PauseMenu } from '@/components/menus/PauseMenu';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { DAY_NIGHT } from '@/game/utils/constants';

// Dynamic import for the 3D canvas to avoid SSR issues with Three.js
const GameCanvas = dynamic(() => import('@/game/engine/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-neo-dark">
      <div className="text-center">
        <div className="text-xl text-neo-cyan font-mono animate-pulse">
          Initializing 3D Engine...
        </div>
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
    <div className="h-screen w-screen overflow-hidden bg-neo-dark game-active">
      {/* 3D Game Canvas */}
      <GameCanvas />

      {/* Day/Night cycle timer */}
      <DayNightCycle />

      {/* HUD Overlay (only during gameplay) */}
      {isGameRunning && !isMainMenu && <HUD />}

      {/* Menus */}
      <MainMenu />
      <PauseMenu />
    </div>
  );
}
