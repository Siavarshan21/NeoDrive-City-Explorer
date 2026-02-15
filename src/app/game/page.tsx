'use client';

/**
 * Game Page - Main game view combining the 3D canvas with UI overlays.
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

const GameCanvas = dynamic(() => import('@/game/engine/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a1a' }}>
      <div style={{ textAlign: 'center', color: '#00f0ff', fontFamily: 'monospace', fontSize: 20 }}>
        Initializing 3D Engine...
      </div>
    </div>
  ),
});

function DayNightCycle() {
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isPaused = useUIStore((s) => s.isPaused);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  useEffect(() => {
    if (!isGameRunning || isPaused) return;
    const interval = setInterval(() => {
      setTimeOfDay(timeOfDay + (1 / DAY_NIGHT.CYCLE_DURATION) * 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [isGameRunning, isPaused, timeOfDay, setTimeOfDay]);

  return null;
}

/**
 * DirectMovement - Handles ALL player movement using requestAnimationFrame.
 * Runs completely outside of Three.js to ensure reliability.
 */
function DirectMovement() {
  // Use refs for everything to avoid stale closures
  const keysRef = useRef(new Set<string>());
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  // Single effect for all input listeners (always active)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yawRef.current -= e.movementX * PLAYER.MOUSE_SENSITIVITY;
        pitchRef.current -= e.movementY * PLAYER.MOUSE_SENSITIVITY;
        pitchRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitchRef.current));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Game loop using requestAnimationFrame (always runs, checks state each frame)
  useEffect(() => {
    const gameLoop = (time: number) => {
      rafRef.current = requestAnimationFrame(gameLoop);

      // Read current game state directly from stores (no stale closures)
      const { isGameRunning, isInVehicle, setPlayerPosition, setPlayerRotation } = useGameStore.getState();
      const { isMainMenu, isPaused } = useUIStore.getState();

      if (!isGameRunning || isMainMenu || isPaused || isInVehicle) {
        lastTimeRef.current = time;
        return;
      }

      // Calculate delta time
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.1) : 1 / 60;
      lastTimeRef.current = time;

      const keys = keysRef.current;
      const isRunning = keys.has('ShiftLeft') || keys.has('ShiftRight');
      const speed = isRunning ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED;

      // Forward/right based on yaw
      const yaw = yawRef.current;
      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

      const move = new THREE.Vector3(0, 0, 0);
      if (keys.has('KeyW')) move.add(forward);
      if (keys.has('KeyS')) move.sub(forward);
      if (keys.has('KeyD')) move.add(right);
      if (keys.has('KeyA')) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        posRef.current.add(move);
        posRef.current.y = 0;
      }

      // Always update store (even without movement, for rotation updates)
      setPlayerPosition(posRef.current.clone());
      setPlayerRotation(new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ'));
    };

    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // No dependencies - reads state directly from stores

  return null;
}

function DebugPanel() {
  const isGameRunning = useGameStore((s) => s.isGameRunning);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const isPaused = useUIStore((s) => s.isPaused);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [pointerLocked, setPointerLocked] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => prev.includes(e.code) ? prev : [...prev, e.code]);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => prev.filter((k) => k !== e.code));
    };
    const onPointerLock = () => setPointerLocked(document.pointerLockElement !== null);

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
    <div style={{
      position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid #00f0ff', borderRadius: 6,
      padding: '8px 16px', fontFamily: 'monospace', fontSize: 11, color: '#ccc',
      zIndex: 100, display: 'flex', gap: 16, alignItems: 'center',
    }}>
      <span style={{ color: '#0f0' }}>Game: ON</span>
      <span>Menu: {isMainMenu ? 'YES' : 'NO'}</span>
      <span>Paused: {isPaused ? 'YES' : 'NO'}</span>
      <span>Lock: {pointerLocked ? 'YES' : 'NO'}</span>
      <span>Pos: ({playerPosition.x.toFixed(1)}, {playerPosition.z.toFixed(1)})</span>
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
        <GameCanvas />
        <DirectMovement />
        <DayNightCycle />
        {isGameRunning && !isMainMenu && <HUD />}
        <PointerLockPrompt />
        <DebugPanel />
        <MainMenu />
        <PauseMenu />
      </div>
    </GameErrorBoundary>
  );
}
