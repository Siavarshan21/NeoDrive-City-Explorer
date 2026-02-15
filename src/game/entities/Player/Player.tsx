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
  const enterVehicle = useGameStore((s) => s.enterVehicle);
  const vehicles = useGameStore((s) => s.vehicles);
  const isPaused = useUIStore((s) => s.isPaused);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const setInteractionPrompt = useUIStore((s) => s.setInteractionPrompt);

  const playerPosition = useGameStore((s) => s.playerPosition);
  const playerRotation = useGameStore((s) => s.playerRotation);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(playerPosition);
      groupRef.current.rotation.copy(playerRotation);
    }

    // Check for nearby vehicles (enter/exit prompt)
    if (isPaused || isMainMenu || isInVehicle) return;

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
