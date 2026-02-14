'use client';

/**
 * Sky - Dynamic sky dome that changes with the day/night cycle.
 * Uses a large sphere with gradient material.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { calculateDayNightState } from '@/game/systems/dayNightSystem';

export function Sky() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  useFrame(() => {
    const state = calculateDayNightState(timeOfDay);
    if (materialRef.current) {
      materialRef.current.color.copy(state.skyColor);
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#5588cc"
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}
