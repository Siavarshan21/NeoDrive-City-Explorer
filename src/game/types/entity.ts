import * as THREE from 'three';

/** Base interface for all game entities */
export interface Entity {
  id: string;
  name: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  active: boolean;
}

/** Player entity with health, speed, and state */
export interface PlayerEntity extends Entity {
  health: number;
  maxHealth: number;
  speed: number;
  isRunning: boolean;
  isInVehicle: boolean;
  currentVehicleId: string | null;
}

/** Vehicle entity with driving properties */
export interface VehicleEntity extends Entity {
  type: VehicleType;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  isOccupied: boolean;
  occupantId: string | null;
  color: string;
}

/** NPC entity with AI behavior */
export interface NPCEntity extends Entity {
  type: NPCType;
  routeId: string;
  currentWaypointIndex: number;
  walkSpeed: number;
  isInteractable: boolean;
  dialogueId: string | null;
  questId: string | null;
}

/** Building entity */
export interface BuildingEntity extends Entity {
  width: number;
  height: number;
  depth: number;
  color: string;
  hasCollision: boolean;
}

/** Prop entity (street lights, benches, etc.) */
export interface PropEntity extends Entity {
  propType: PropType;
  hasCollision: boolean;
}

export type VehicleType = 'sedan' | 'sports' | 'truck' | 'suv';
export type NPCType = 'pedestrian' | 'quest_giver' | 'shopkeeper';
export type PropType = 'streetlight' | 'bench' | 'tree' | 'hydrant' | 'dumpster' | 'barrier';

/** Collision box for simple AABB collision detection */
export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  entityId: string;
}
