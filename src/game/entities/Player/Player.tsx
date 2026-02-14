'use client';

/**
 * Player - 3D player entity rendered as a placeholder capsule.
 * In first-person mode, this is invisible (camera is at player eye level).
 * In third-person or debug mode, renders a simple character shape.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { inputManager } from '@/game/engine/InputManager';
import { KEYS, VEHICLE } from '@/game/utils/constants';
import { distanceXZ } from '@/game/utils/math';
import { playerConfig } from './playerConfig';

// Singleton controller persists across re-renders
const controller = new PlayerController();

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setPlayerRotation = useGameStore((s) => s.setPlayerRotation);
  const isInVehicle = useGameStore((s) => s.isInVehicle);
  const enterVehicle = useGameStore((s) => s.enterVehicle);
  const exitVehicle = useGameStore((s) => s.exitVehicle);
  const vehicles = useGameStore((s) => s.vehicles);
  const isPaused = useUIStore((s) => s.isPaused);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const setInteractionPrompt = useUIStore((s) => s.setInteractionPrompt);

  useFrame((_, delta) => {
    // Don't process player movement if paused or in menu
    if (isPaused || isMainMenu || isInVehicle) return;

    const { position, rotation, speed } = controller.update(delta);

    // Update store
    setPlayerPosition(position);
    setPlayerRotation(rotation);

    // Update mesh transform
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.copy(rotation);
    }

    // Check for nearby vehicles (enter/exit prompt)
    let nearestVehicleDist = Infinity;
    let nearestVehicleId: string | null = null;
    for (const v of vehicles) {
      const dist = distanceXZ(position, v.position);
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

  // When in vehicle, don't render player mesh
  if (isInVehicle) return null;

  return (
    <group>
      {/* Player body - capsule placeholder */}
      <mesh ref={meshRef} castShadow position={[0, playerConfig.height / 2, 0]}>
        <capsuleGeometry args={[playerConfig.radius, playerConfig.height - playerConfig.radius * 2, 8, 16]} />
        <meshStandardMaterial color={playerConfig.color} emissive={playerConfig.color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
