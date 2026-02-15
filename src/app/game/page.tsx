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
import { useEffect, useState, useCallback } from 'react';
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
      const increment = (1 / DAY_NIGHT.CYCLE_DURATION) * 0.1;
      setTimeOfDay(timeOfDay + increment);
    }, 100);

    return () => clearInterval(interval);
  }, [isGameRunning, isPaused, timeOfDay, setTimeOfDay]);

  return null;
}

/** Debug overlay showing game state and key presses */
function DebugPanel() {
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const isPaused = useUIStore((s) => s.isPaused);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [pointerLocked, setPointerLocked] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        if (prev.includes(e.code)) return prev;
        return [...prev, e.code];
      });
    };
    const onKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => prev.filter((k) => k !== e.code));
    };
    const onPointerLock = () => {
      setPointerLocked(document.pointerLockElement !== null);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerlockchange', onPointerLock);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onPointerLock);
    };
  }, []);

  if (!isGameRunning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.85)',
        border: '1px solid #00f0ff',
        borderRadius: 6,
        padding: '8px 16px',
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#ccc',
        zIndex: 100,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <span style={{ color: isGameRunning ? '#0f0' : '#f00' }}>
        Game: {isGameRunning ? 'ON' : 'OFF'}
      </span>
      <span>Menu: {isMainMenu ? 'YES' : 'NO'}</span>
      <span>Paused: {isPaused ? 'YES' : 'NO'}</span>
      <span>Lock: {pointerLocked ? 'YES' : 'NO'}</span>
      <span>
        Pos: ({playerPosition.x.toFixed(1)}, {playerPosition.z.toFixed(1)})
      </span>
      <span style={{ color: pressedKeys.length > 0 ? '#0f0' : '#666' }}>
        Keys: {pressedKeys.length > 0 ? pressedKeys.join('+') : 'none'}
      </span>
    </div>
  );
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

        {/* Debug Panel - shows game state and input */}
        <DebugPanel />

        {/* Menus */}
        <MainMenu />
        <PauseMenu />
      </div>
    </GameErrorBoundary>
  );
}
