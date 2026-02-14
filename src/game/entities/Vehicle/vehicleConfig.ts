import * as THREE from 'three';
import type { VehicleType } from '@/game/types/entity';

/** Configuration for each vehicle type */
export interface VehicleConfig {
  type: VehicleType;
  maxSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  color: string;
  size: { width: number; height: number; length: number };
}

export const vehicleConfigs: Record<VehicleType, VehicleConfig> = {
  sedan: {
    type: 'sedan',
    maxSpeed: 30,
    acceleration: 15,
    braking: 25,
    handling: 2.5,
    color: '#4488ff',
    size: { width: 2, height: 1.4, length: 4.5 },
  },
  sports: {
    type: 'sports',
    maxSpeed: 50,
    acceleration: 25,
    braking: 30,
    handling: 3,
    color: '#ff2244',
    size: { width: 2, height: 1.2, length: 4.2 },
  },
  truck: {
    type: 'truck',
    maxSpeed: 20,
    acceleration: 8,
    braking: 20,
    handling: 1.5,
    color: '#886644',
    size: { width: 2.5, height: 2, length: 6 },
  },
  suv: {
    type: 'suv',
    maxSpeed: 28,
    acceleration: 12,
    braking: 22,
    handling: 2,
    color: '#222222',
    size: { width: 2.2, height: 1.8, length: 5 },
  },
};

/** Default spawn positions for vehicles in the city */
export const vehicleSpawns: Array<{ type: VehicleType; position: THREE.Vector3; rotation: number }> = [
  { type: 'sedan', position: new THREE.Vector3(10, 0, 10), rotation: 0 },
  { type: 'sports', position: new THREE.Vector3(-15, 0, 30), rotation: Math.PI / 2 },
  { type: 'truck', position: new THREE.Vector3(40, 0, -10), rotation: Math.PI },
  { type: 'suv', position: new THREE.Vector3(-30, 0, -25), rotation: -Math.PI / 4 },
];
