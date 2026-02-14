/**
 * AI System - Coordinates NPC AI behaviors across the scene.
 * Provides a central update function called each frame to
 * process all NPC movement, interaction triggers, and state changes.
 */

import * as THREE from 'three';
import type { NPCEntity } from '@/game/types/entity';
import { updateNPCMovement, type WaypointRoute } from '@/game/entities/NPC/npcAI';
import { distanceXZ } from '@/game/utils/math';
import { NPC } from '@/game/utils/constants';

export interface AIUpdateResult {
  npcId: string;
  position: THREE.Vector3;
  waypointIndex: number;
  rotation: number;
  isPlayerNearby: boolean;
}

/**
 * Update all NPC AI in a single pass.
 * Returns updated state for each NPC.
 */
export function updateAllNPCs(
  npcs: NPCEntity[],
  routes: WaypointRoute[],
  playerPosition: THREE.Vector3,
  deltaTime: number
): AIUpdateResult[] {
  const routeMap = new Map(routes.map((r) => [r.id, r]));

  return npcs.map((npc) => {
    const route = routeMap.get(npc.routeId);
    const result = updateNPCMovement(npc, route, deltaTime);

    const isPlayerNearby = distanceXZ(playerPosition, result.position) < NPC.INTERACTION_DISTANCE;

    return {
      npcId: npc.id,
      position: result.position,
      waypointIndex: result.waypointIndex,
      rotation: result.rotation,
      isPlayerNearby,
    };
  });
}

/**
 * Get NPCs that the player can currently interact with.
 */
export function getInteractableNPCs(
  npcs: NPCEntity[],
  playerPosition: THREE.Vector3
): NPCEntity[] {
  return npcs.filter(
    (npc) =>
      npc.isInteractable &&
      distanceXZ(playerPosition, npc.position) < NPC.INTERACTION_DISTANCE
  );
}
