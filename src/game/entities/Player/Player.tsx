'use client';

/**
 * Player - 3D player character using real GLB model.
 * Visible in third-person mode, shows animated character.
 */

import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { inputManager } from '@/game/engine/InputManager';
import { KEYS, VEHICLE } from '@/game/utils/constants';
import { distanceXZ } from '@/game/utils/math';
import { playerConfig } from './playerConfig';

// Preload player model
useGLTF.preload('/assets/models/cesium_man.glb');

/** Real 3D player character model */
function PlayerModel() {
  const { scene } = useGLTF('/assets/models/cesium_man.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} scale={1.8} position={[0, 0, 0]} />;
}

/** Placeholder player (capsule fallback) */
function PlaceholderPlayer() {
  return (
    <mesh castShadow position={[0, playerConfig.height / 2, 0]}>
      <capsuleGeometry args={[playerConfig.radius, playerConfig.height - playerConfig.radius * 2, 8, 16]} />
      <meshStandardMaterial color={playerConfig.color} emissive={playerConfig.color} emissiveIntensity={0.2} />
    </mesh>
  );
}

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const isInVehicle = useGameStore((s) => s.isInVehicle);

  useFrame(() => {
    // Read directly from store each frame to avoid stale closures
    const { playerPosition, playerRotation, isInVehicle: inVehicle, vehicles, enterVehicle } = useGameStore.getState();
    const { isPaused, isMainMenu, setInteractionPrompt } = useUIStore.getState();

    if (groupRef.current) {
      groupRef.current.position.copy(playerPosition);
      // Only apply yaw rotation to keep character upright
      groupRef.current.rotation.set(0, playerRotation.y, 0);
    }

    // Check for nearby vehicles (enter/exit prompt)
    if (isPaused || isMainMenu || inVehicle) return;

    let nearestVehicleDist = Infinity;
    let nearestVehicleId: string | null = null;
    for (const v of vehicles) {
      const dist = distanceXZ(playerPosition, v.position);
      if (dist < VEHICLE.ENTER_DISTANCE && dist < nearestVehicleDist) {
        nearestVehicleDist = dist;
        nearestVehicleId = v.id;
      }
    }

    if (nearestVehicleId) {
      setInteractionPrompt('Press F to enter vehicle');
      if (inputManager.isKeyDown(KEYS.VEHICLE_ENTER)) {
        enterVehicle(nearestVehicleId);
      }
    } else {
      setInteractionPrompt(null);
    }
  });

  // When in vehicle, don't render player
  if (isInVehicle) return null;

  return (
    <group ref={groupRef}>
      <Suspense fallback={<PlaceholderPlayer />}>
        <PlayerModel />
      </Suspense>
    </group>
  );
}
