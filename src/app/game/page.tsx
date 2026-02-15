'use client';

/**
 * Game Page - Main game view combining the 3D canvas with UI overlays.
 * This is the primary page where all gameplay happens.
 */

import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { HUD } from '@/components/hud/HUD';
import { PointerLockPrompt } from '@/components/hud/PointerLockPrompt';
import { MainMenu } from '@/components/menus/MainMenu';
import { PauseMenu } from '@/components/menus/PauseMenu';
import { GameErrorBoundary } from '@/components/ui/GameErrorBoundary';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useRef, useState } from 'react';
import { DAY_NIGHT, PLAYER } from '@/game/utils/constants';

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

/**
 * DirectMovement - Handles player movement entirely outside of Three.js/R3F.
 * Uses setInterval + direct keyboard tracking to update the Zustand store.
 * This ensures movement works even if useFrame inside Canvas is not running.
 */
function DirectMovement() {
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const isPaused = useUIStore((s) => s.isPaused);
  const isInVehicle = useGameStore((s) => s.isInVehicle);

  const keysRef = useRef(new Set<string>());
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const posRef = useRef(new THREE.Vector3(0, 0, 0));

  // Track keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Track mouse movement for camera rotation (when pointer locked)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yawRef.current -= e.movementX * PLAYER.MOUSE_SENSITIVITY;
        pitchRef.current -= e.movementY * PLAYER.MOUSE_SENSITIVITY;
        pitchRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitchRef.current));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Main movement loop - runs at 60fps via setInterval
  useEffect(() => {
    if (!isGameRunning || isMainMenu || isPaused || isInVehicle) return;

    const setPlayerPosition = useGameStore.getState().setPlayerPosition;
    const setPlayerRotation = useGameStore.getState().setPlayerRotation;

    const interval = setInterval(() => {
      const keys = keysRef.current;
      const dt = 1 / 60;

      const isRunning = keys.has('ShiftLeft') || keys.has('ShiftRight');
      const speed = isRunning ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED;

      // Calculate forward/right vectors from yaw
      const forward = new THREE.Vector3(
        -Math.sin(yawRef.current),
        0,
        -Math.cos(yawRef.current)
      );
      const right = new THREE.Vector3(
        Math.cos(yawRef.current),
        0,
        -Math.sin(yawRef.current)
      );

      const move = new THREE.Vector3(0, 0, 0);
      if (keys.has('KeyW')) move.add(forward);
      if (keys.has('KeyS')) move.sub(forward);
      if (keys.has('KeyD')) move.add(right);
      if (keys.has('KeyA')) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        posRef.current.add(move);
        posRef.current.y = 0;

        setPlayerPosition(posRef.current.clone());
      }

      // Always update rotation (for mouse look)
      const rotation = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
      setPlayerRotation(rotation);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isGameRunning, isMainMenu, isPaused, isInVehicle]);

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

        {/* Direct movement system (outside Three.js) */}
        <DirectMovement />

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
