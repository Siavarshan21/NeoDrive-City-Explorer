'use client';

/**
 * NPC - Non-player character rendered as a simple humanoid placeholder.
 * Walks along predefined waypoint routes with basic AI.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { npcTypeConfigs } from './npcConfig';
import { updateNPCMovement } from './npcAI';
import { npcRoutes } from '@/game/data/npcRoutes';
import { NPC as NPC_CONST } from '@/game/utils/constants';
import { distanceXZ } from '@/game/utils/math';
import type { NPCEntity } from '@/game/types/entity';

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

  // Local mutable state for this NPC's AI
  const aiState = useRef({
    position: npc.position.clone(),
    waypointIndex: npc.currentWaypointIndex,
    rotation: 0,
  });

  useFrame((_, delta) => {
    if (!groupRef.current || isPaused) return;

    // Update AI movement
    const npcState: NPCEntity = {
      ...npc,
      position: aiState.current.position,
      currentWaypointIndex: aiState.current.waypointIndex,
    };

    const result = updateNPCMovement(npcState, route, delta);
    aiState.current.position.copy(result.position);
    aiState.current.waypointIndex = result.waypointIndex;
    aiState.current.rotation = result.rotation;

    // Update mesh
    groupRef.current.position.copy(result.position);
    groupRef.current.rotation.y = result.rotation;

    // Check player proximity for interaction
    if (npc.isInteractable) {
      const dist = distanceXZ(playerPosition, result.position);
      if (dist < NPC_CONST.INTERACTION_DISTANCE) {
        setInteractionPrompt(`Press E to talk to ${npc.name}`);
      }
    }
  });

  return (
    <group ref={groupRef} position={[npc.position.x, 0, npc.position.z]}>
      {/* NPC body */}
      <mesh castShadow position={[0, npcConfig.height * 0.4, 0]}>
        <capsuleGeometry args={[npcConfig.radius, npcConfig.height * 0.5, 8, 12]} />
        <meshStandardMaterial color={npcConfig.color} />
      </mesh>
      {/* NPC head */}
      <mesh castShadow position={[0, npcConfig.height * 0.85, 0]}>
        <sphereGeometry args={[npcConfig.radius * 0.8, 12, 12]} />
        <meshStandardMaterial color={npcConfig.color} />
      </mesh>
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
