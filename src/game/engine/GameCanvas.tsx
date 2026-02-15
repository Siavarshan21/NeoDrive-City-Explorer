'use client';

/**
 * GameCanvas - Main 3D scene container using React Three Fiber.
 * Sets up the Canvas, camera, and renders all 3D game entities.
 */

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { Stats } from '@react-three/drei';
import { Player } from '@/game/entities/Player/Player';
import { City } from '@/game/entities/World/City';
import { Lights } from '@/game/rendering/Lights';
import { Sky } from '@/game/rendering/Sky';
import { CameraRig } from '@/game/rendering/CameraRig';
import { VehicleManager } from '@/game/entities/Vehicle/Vehicle';
import { NPCManager } from '@/game/entities/NPC/NPC';
import { inputManager } from '@/game/engine/InputManager';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import { RENDERING } from '@/game/utils/constants';

/** Loading fallback shown while 3D assets load */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00f0ff" wireframe />
    </mesh>
  );
}

export default function GameCanvas() {
  const showFps = useSettingsStore((s) => s.showFps);
  const isGameRunning = useGameStore((s) => s.isGameRunning);

  useEffect(() => {
    console.info('[GameCanvas] Initializing InputManager');
    inputManager.init();
    return () => {
      console.info('[GameCanvas] Disposing InputManager');
      inputManager.dispose();
    };
  }, []);

  useEffect(() => {
    console.info('[GameCanvas] isGameRunning:', isGameRunning);
  }, [isGameRunning]);

  if (!isGameRunning) return null;

  return (
    <div
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      className="absolute inset-0"
    >
      <Canvas
        shadows
        camera={{
          fov: RENDERING.FOV,
          near: RENDERING.NEAR,
          far: RENDERING.FAR,
          position: [0, 10, 20],
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={() => {
          console.info('[GameCanvas] Three.js Canvas created successfully');
        }}
        onPointerDown={(e) => {
          // Lock pointer on click for FPS controls
          const canvas = e.target as HTMLCanvasElement;
          inputManager.requestPointerLock(canvas);
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting and sky */}
          <Lights />
          <Sky />

          {/* Camera controller */}
          <CameraRig />

          {/* World */}
          <City />

          {/* Player */}
          <Player />

          {/* Vehicles */}
          <VehicleManager />

          {/* NPCs */}
          <NPCManager />

          {/* Fog for depth */}
          <fog attach="fog" args={['#0a0a1a', 50, 300]} />
        </Suspense>

        {/* Performance stats overlay */}
        {showFps && <Stats />}
      </Canvas>
    </div>
  );
}
