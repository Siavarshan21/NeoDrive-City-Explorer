/**
 * NPC AI - Simple waypoint-based walking AI for NPCs.
 * NPCs follow a predefined route, walking from waypoint to waypoint
 * and looping back to the start when they reach the end.
 */

import * as THREE from 'three';
import { NPC as NPC_CONST } from '@/game/utils/constants';
import type { NPCEntity } from '@/game/types/entity';

export interface WaypointRoute {
  id: string;
  waypoints: THREE.Vector3[];
  loop: boolean;
}

/**
 * Update NPC position along its route.
 * Returns the new position and waypoint index.
 */
export function updateNPCMovement(
  npc: NPCEntity,
  route: WaypointRoute | undefined,
  deltaTime: number
): { position: THREE.Vector3; waypointIndex: number; rotation: number } {
  if (!route || route.waypoints.length === 0) {
    return {
      position: npc.position.clone(),
      waypointIndex: npc.currentWaypointIndex,
      rotation: 0,
    };
  }

  const targetWaypoint = route.waypoints[npc.currentWaypointIndex];
  const direction = new THREE.Vector3()
    .subVectors(targetWaypoint, npc.position)
    .setY(0);

  const distToTarget = direction.length();

  // Calculate rotation to face movement direction
  const rotation = Math.atan2(direction.x, direction.z);

  // If close enough to waypoint, advance to next one
  let nextIndex = npc.currentWaypointIndex;
  if (distToTarget < NPC_CONST.WAYPOINT_THRESHOLD) {
    nextIndex = npc.currentWaypointIndex + 1;
    if (nextIndex >= route.waypoints.length) {
      nextIndex = route.loop ? 0 : route.waypoints.length - 1;
    }
  }

  // Move towards current waypoint
  direction.normalize();
  const step = direction.multiplyScalar(npc.walkSpeed * deltaTime);
  const newPosition = npc.position.clone().add(step);
  newPosition.y = 0;

  return {
    position: newPosition,
    waypointIndex: nextIndex,
    rotation,
  };
}
