'use client';

/**
 * Props - Street furniture and decorations (street lights, trees, benches, etc.)
 * Adds detail and atmosphere to the city environment.
 */

import { useEffect } from 'react';
import * as THREE from 'three';
import { collisionSystem } from '@/game/engine/CollisionSystem';
import { mapProps } from '@/game/data/mapData';
import type { PropType } from '@/game/types/entity';

interface PropMeshProps {
  id: string;
  type: PropType;
  position: [number, number, number];
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
        <meshStandardMaterial color="#555566" metalness={0.8} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.8, 5.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
        <meshStandardMaterial color="#555566" metalness={0.8} />
      </mesh>
      {/* Light */}
      <mesh position={[1.2, 5.8, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffcc" emissiveIntensity={2} />
      </mesh>
      {/* Point light */}
      <pointLight
        position={[1.2, 5.5, 0]}
        color="#ffffcc"
        intensity={15}
        distance={20}
        castShadow={false}
      />
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 3, 6]} />
        <meshStandardMaterial color="#664422" />
      </mesh>
      {/* Canopy */}
      <mesh castShadow position={[0, 4, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#226633" />
      </mesh>
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#885533" />
      </mesh>
      {/* Legs */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.4]} />
          <meshStandardMaterial color="#444" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Single prop entity with collision */
function PropMesh({ id, type, position }: PropMeshProps) {
  useEffect(() => {
    const radius = type === 'tree' ? 0.3 : 0.2;
    collisionSystem.addBox({
      entityId: id,
      min: new THREE.Vector3(position[0] - radius, 0, position[2] - radius),
      max: new THREE.Vector3(position[0] + radius, 2, position[2] + radius),
    });
    return () => collisionSystem.removeBox(id);
  }, [id, type, position]);

  switch (type) {
    case 'streetlight':
      return <StreetLight position={position} />;
    case 'tree':
      return <Tree position={position} />;
    case 'bench':
      return <Bench position={position} />;
    default:
      return null;
  }
}

/** Renders all props in the scene */
export function Props() {
  return (
    <group>
      {mapProps.map((prop) => (
        <PropMesh key={prop.id} id={prop.id} type={prop.type} position={prop.position} />
      ))}
    </group>
  );
}
