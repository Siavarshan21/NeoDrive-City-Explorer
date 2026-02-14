/**
 * Interaction System - Handles player interactions with NPCs, vehicles,
 * and world objects. Manages proximity detection and action triggers.
 */

import * as THREE from 'three';
import type { NPCEntity, VehicleEntity } from '@/game/types/entity';
import { distanceXZ } from '@/game/utils/math';
import { NPC, VEHICLE } from '@/game/utils/constants';

export type InteractionTarget =
  | { type: 'npc'; entity: NPCEntity; distance: number }
  | { type: 'vehicle'; entity: VehicleEntity; distance: number }
  | null;

/**
 * Find the nearest interactable entity to the player.
 */
export function findNearestInteraction(
  playerPosition: THREE.Vector3,
  npcs: NPCEntity[],
  vehicles: VehicleEntity[]
): InteractionTarget {
  let nearest: InteractionTarget = null;
  let nearestDist = Infinity;

  // Check NPCs
  for (const npc of npcs) {
    if (!npc.isInteractable) continue;
    const dist = distanceXZ(playerPosition, npc.position);
    if (dist < NPC.INTERACTION_DISTANCE && dist < nearestDist) {
      nearestDist = dist;
      nearest = { type: 'npc', entity: npc, distance: dist };
    }
  }

  // Check vehicles
  for (const vehicle of vehicles) {
    if (vehicle.isOccupied) continue;
    const dist = distanceXZ(playerPosition, vehicle.position);
    if (dist < VEHICLE.ENTER_DISTANCE && dist < nearestDist) {
      nearestDist = dist;
      nearest = { type: 'vehicle', entity: vehicle, distance: dist };
    }
  }

  return nearest;
}

/**
 * Get the interaction prompt text for the current target.
 */
export function getInteractionPrompt(target: InteractionTarget): string | null {
  if (!target) return null;

  switch (target.type) {
    case 'npc':
      return `Press E to talk to ${target.entity.name}`;
    case 'vehicle':
      return `Press F to enter ${target.entity.name}`;
    default:
      return null;
  }
}
