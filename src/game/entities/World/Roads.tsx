'use client';

/**
 * Roads - City road grid with lane markings.
 * Renders roads as flat planes with dashed center lines.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { WORLD } from '@/game/utils/constants';

/** A single road segment */
function RoadSegment({ position, size, rotation = 0 }: {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Road surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#333340" roughness={0.9} />
      </mesh>
      {/* Center dashed line */}
      {Array.from({ length: Math.floor(size[1] / 4) }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, -size[1] / 2 + i * 4 + 1]}
        >
          <planeGeometry args={[0.15, 2]} />
          <meshStandardMaterial color="#ffe600" emissive="#ffe600" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/** Renders the road grid for the city */
export function Roads() {
  const roadSegments = useMemo(() => {
    const segments: Array<{
      id: string;
      position: [number, number, number];
      size: [number, number];
      rotation: number;
    }> = [];

    const halfCity = WORLD.CITY_SIZE / 2;
    const blockSpacing = WORLD.BLOCK_SIZE + WORLD.ROAD_WIDTH;

    // Horizontal roads (along X axis)
    for (let z = -halfCity; z <= halfCity; z += blockSpacing) {
      segments.push({
        id: `road-h-${z}`,
        position: [0, 0, z],
        size: [WORLD.ROAD_WIDTH, WORLD.CITY_SIZE],
        rotation: Math.PI / 2,
      });
    }

    // Vertical roads (along Z axis)
    for (let x = -halfCity; x <= halfCity; x += blockSpacing) {
      segments.push({
        id: `road-v-${x}`,
        position: [x, 0, 0],
        size: [WORLD.ROAD_WIDTH, WORLD.CITY_SIZE],
        rotation: 0,
      });
    }

    return segments;
  }, []);

  return (
    <group>
      {roadSegments.map((seg) => (
        <RoadSegment
          key={seg.id}
          position={seg.position}
          size={seg.size}
          rotation={seg.rotation}
        />
      ))}
    </group>
  );
}
