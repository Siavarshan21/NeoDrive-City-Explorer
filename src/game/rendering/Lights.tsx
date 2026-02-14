'use client';

/**
 * Lights - Dynamic lighting that responds to the day/night cycle.
 * Includes ambient light, directional sun light, and hemisphere light.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { calculateDayNightState } from '@/game/systems/dayNightSystem';
import { RENDERING } from '@/game/utils/constants';

export function Lights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  useFrame(() => {
    const state = calculateDayNightState(timeOfDay);

    if (ambientRef.current) {
      ambientRef.current.color.copy(state.ambientColor);
      ambientRef.current.intensity = state.ambientIntensity;
    }

    if (directionalRef.current) {
      directionalRef.current.color.copy(state.sunColor);
      directionalRef.current.intensity = state.sunIntensity;
      directionalRef.current.position.copy(state.sunPosition);
    }
  });

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight ref={ambientRef} intensity={0.6} />

      {/* Directional light (sun/moon) */}
      <directionalLight
        ref={directionalRef}
        position={[50, 80, -50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={RENDERING.SHADOW_MAP_SIZE}
        shadow-mapSize-height={RENDERING.SHADOW_MAP_SIZE}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Hemisphere light for sky/ground color blending */}
      <hemisphereLight
        args={['#5588cc', '#1a1a2e', 0.3]}
      />
    </>
  );
}
