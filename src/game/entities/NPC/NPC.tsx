'use client';

/**
 * NPC - Non-player character using a real 3D model (character.glb).
 * Falls back to capsule placeholder if model fails to load.
 * Walks along predefined waypoint routes with basic AI.
 */

import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { npcTypeConfigs } from './npcConfig';
import { updateNPCMovement } from './npcAI';
import { npcRoutes } from '@/game/data/npcRoutes';
import { NPC as NPC_CONST } from '@/game/utils/constants';
import { distanceXZ } from '@/game/utils/math';
import type { NPCEntity } from '@/game/types/entity';

// Preload the character model
useGLTF.preload('/assets/models/character.glb');

/** NPC colors by type for tinting */
const NPC_TINTS: Record<string, string> = {
  pedestrian: '#88aaff',
  quest_giver: '#ffdd00',
  shopkeeper: '#44ff88',
};

/** Real 3D character model */
function CharacterModel({ npcType }: { npcType: string }) {
  const { scene } = useGLTF('/assets/models/character.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const tint = new THREE.Color(NPC_TINTS[npcType] || '#ffffff');
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material = child.material.clone();
        child.material.color = tint;
      }
    });
    return clone;
  }, [scene, npcType]);

  return (
    <primitive object={clonedScene} scale={0.9} position={[0, 0, 0]} />
  );
}

/** Placeholder NPC (fallback capsule + head) */
function PlaceholderNPC({ npcConfig, npcType }: { npcConfig: { height: number; radius: number; color: string }; npcType: string }) {
  return (
    <>
      <mesh castShadow position={[0, npcConfig.height * 0.4, 0]}>
        <capsuleGeometry args={[npcConfig.radius, npcConfig.height * 0.5, 8, 12]} />
        <meshStandardMaterial color={npcConfig.color} />
      </mesh>
      <mesh castShadow position={[0, npcConfig.height * 0.85, 0]}>
        <sphereGeometry args={[npcConfig.radius * 0.8, 12, 12]} />
        <meshStandardMaterial color={npcConfig.color} />
      </mesh>
    </>
  );
}

interface NPCMeshProps {
  npc: NPCEntity;
}

function NPCMesh({ npc }: NPCMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isPaused = useUIStore((s) => s.isPaused);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const setInteractionPrompt = useUIStore((s) => s.setInteractionPrompt);
  const npcConfig = npcTypeConfigs[npc.type];
  const route = npcRoutes.find((r) => r.id === npc.routeId);

  const aiState = useRef({
    position: npc.position.clone(),
    waypointIndex: npc.currentWaypointIndex,
    rotation: 0,
  });

  useFrame((_, delta) => {
    if (!groupRef.current || isPaused) return;

    const npcState: NPCEntity = {
      ...npc,
      position: aiState.current.position,
      currentWaypointIndex: aiState.current.waypointIndex,
    };

    const result = updateNPCMovement(npcState, route, delta);
    aiState.current.position.copy(result.position);
    aiState.current.waypointIndex = result.waypointIndex;
    aiState.current.rotation = result.rotation;

    groupRef.current.position.copy(result.position);
    groupRef.current.rotation.y = result.rotation;

    if (npc.isInteractable) {
      const dist = distanceXZ(playerPosition, result.position);
      if (dist < NPC_CONST.INTERACTION_DISTANCE) {
        setInteractionPrompt(`Press E to talk to ${npc.name}`);
      }
    }
  });

  return (
    <group ref={groupRef} position={[npc.position.x, 0, npc.position.z]}>
      {/* Load real character model with fallback */}
      <Suspense fallback={<PlaceholderNPC npcConfig={npcConfig} npcType={npc.type} />}>
        <CharacterModel npcType={npc.type} />
      </Suspense>

      {/* Quest indicator for quest givers */}
      {npc.type === 'quest_giver' && (
        <mesh position={[0, npcConfig.height + 0.5, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#ffe600" emissive="#ffe600" emissiveIntensity={1} />
        </mesh>
      )}
    </group>
  );
}

/** Renders all NPCs in the scene */
export function NPCManager() {
  const npcs = useGameStore((s) => s.npcs);

  return (
    <group>
      {npcs.map((npc) => (
        <NPCMesh key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
