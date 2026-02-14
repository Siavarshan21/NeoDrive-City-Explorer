'use client';

/**
 * CameraRig - First-person camera that follows the player position and rotation.
 * In vehicle mode, uses a third-person chase camera.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { PLAYER } from '@/game/utils/constants';

export function CameraRig() {
  const { camera } = useThree();
  const playerPosition = useGameStore((s) => s.playerPosition);
  const playerRotation = useGameStore((s) => s.playerRotation);
  const isInVehicle = useGameStore((s) => s.isInVehicle);

  // Smooth camera interpolation
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 10, 20));

  useFrame((_, delta) => {
    if (isInVehicle) {
      // Third-person chase camera for vehicle
      const offset = new THREE.Vector3(0, 5, -12);
      offset.applyEuler(new THREE.Euler(0, playerRotation.y, 0));
      targetPos.current.copy(playerPosition).add(offset);

      // Smooth follow
      currentPos.current.lerp(targetPos.current, 5 * delta);
      camera.position.copy(currentPos.current);
      camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
    } else {
      // First-person camera
      camera.position.set(
        playerPosition.x,
        playerPosition.y + PLAYER.CAMERA_HEIGHT,
        playerPosition.z
      );
      camera.rotation.copy(playerRotation);
    }
  });

  return null;
}
