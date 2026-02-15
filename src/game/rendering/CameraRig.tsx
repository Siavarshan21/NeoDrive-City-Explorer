'use client';

/**
 * CameraRig - Third-person camera that follows the player from behind.
 * Reads store directly via getState() to avoid stale React closures.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function CameraRig() {
  const { camera } = useThree();

  // Smooth camera interpolation
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 10, 20));
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Read directly from store each frame to avoid stale closures
    const { playerPosition, playerRotation, isInVehicle } = useGameStore.getState();

    const distance = isInVehicle ? 12 : 8;
    const height = isInVehicle ? 5 : 4;

    // Calculate camera position behind the player
    const offset = new THREE.Vector3(0, height, -distance);
    offset.applyEuler(new THREE.Euler(0, playerRotation.y, 0));
    targetPos.current.copy(playerPosition).add(offset);

    // Look-at point slightly ahead and above the player
    targetLookAt.current.set(playerPosition.x, playerPosition.y + 1.5, playerPosition.z);

    // Smooth follow with lerp
    const followSpeed = Math.min(8 * delta, 1);
    const lookSpeed = Math.min(10 * delta, 1);

    currentPos.current.lerp(targetPos.current, followSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lookSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
