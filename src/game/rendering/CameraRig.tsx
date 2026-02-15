'use client';

/**
 * CameraRig - Third-person camera that follows the player from behind.
 * Smooth camera movement with lerp interpolation.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function CameraRig() {
  const { camera } = useThree();
  const playerPosition = useGameStore((s) => s.playerPosition);
  const playerRotation = useGameStore((s) => s.playerRotation);
  const isInVehicle = useGameStore((s) => s.isInVehicle);

  // Smooth camera interpolation
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 10, 20));
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Third-person camera (behind and above player)
    // Vehicle mode: farther back
    // On-foot mode: closer, higher angle
    const distance = isInVehicle ? 12 : 8;
    const height = isInVehicle ? 5 : 4;

    // Calculate camera position behind the player
    const offset = new THREE.Vector3(0, height, -distance);
    offset.applyEuler(new THREE.Euler(0, playerRotation.y, 0));
    targetPos.current.copy(playerPosition).add(offset);

    // Look-at point slightly ahead and above the player
    const lookOffset = new THREE.Vector3(0, 1.5, 0);
    targetLookAt.current.copy(playerPosition).add(lookOffset);

    // Smooth follow with lerp (adjust speed for smoothness)
    const followSpeed = 8 * delta;
    const lookSpeed = 10 * delta;

    currentPos.current.lerp(targetPos.current, followSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lookSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
