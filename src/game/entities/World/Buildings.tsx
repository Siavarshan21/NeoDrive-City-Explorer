'use client';

/**
 * Buildings - Procedurally generated city buildings with collision boxes.
 * Creates a grid of buildings with varying heights and colors.
 */

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { collisionSystem } from '@/game/engine/CollisionSystem';
import { WORLD } from '@/game/utils/constants';
import { randomRange, randomInt } from '@/game/utils/math';
import { mapBuildings } from '@/game/data/mapData';

/** Single building component */
function Building({ id, position, width, height, depth, color }: {
  id: string;
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}) {
  // Register collision box
  useEffect(() => {
    const halfW = width / 2;
    const halfD = depth / 2;
    collisionSystem.addBox({
      entityId: id,
      min: new THREE.Vector3(position[0] - halfW, 0, position[2] - halfD),
      max: new THREE.Vector3(position[0] + halfW, height, position[2] + halfD),
    });

    return () => {
      collisionSystem.removeBox(id);
    };
  }, [id, position, width, height, depth]);

  return (
    <group position={position}>
      {/* Main building body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Window strips (emissive for night lighting) */}
      {Array.from({ length: Math.floor(height / 3) }, (_, i) => (
        <mesh key={i} position={[0, i * 3 + 2, depth / 2 + 0.01]}>
          <planeGeometry args={[width * 0.8, 1.5]} />
          <meshStandardMaterial
            color="#ffffcc"
            emissive="#ffffaa"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Renders all buildings in the city */
export function Buildings() {
  return (
    <group>
      {mapBuildings.map((b) => (
        <Building
          key={b.id}
          id={b.id}
          position={b.position}
          width={b.width}
          height={b.height}
          depth={b.depth}
          color={b.color}
        />
      ))}
    </group>
  );
}
