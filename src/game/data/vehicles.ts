/**
 * Vehicle Spawn Data - Initial vehicle placements in the city.
 * Used when starting a new game or resetting the world.
 */

import * as THREE from 'three';
import type { VehicleEntity, VehicleType } from '@/game/types/entity';
import { vehicleConfigs } from '@/game/entities/Vehicle/vehicleConfig';

/** Create a vehicle entity with default values */
function createVehicle(
  id: string,
  type: VehicleType,
  position: [number, number, number],
  rotationY: number = 0,
  color?: string
): VehicleEntity {
  const config = vehicleConfigs[type];
  return {
    id,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id.split('-').pop()}`,
    position: new THREE.Vector3(...position),
    rotation: new THREE.Euler(0, rotationY, 0),
    scale: new THREE.Vector3(1, 1, 1),
    active: true,
    type,
    speed: 0,
    maxSpeed: config.maxSpeed,
    acceleration: config.acceleration,
    braking: config.braking,
    handling: config.handling,
    isOccupied: false,
    occupantId: null,
    color: color || config.color,
  };
}

/** Initial vehicle placements */
export const initialVehicles: VehicleEntity[] = [
  createVehicle('vehicle-sedan-1', 'sedan', [10, 0, 10], 0, '#4488ff'),
  createVehicle('vehicle-sedan-2', 'sedan', [-20, 0, 45], Math.PI / 2, '#88aacc'),
  createVehicle('vehicle-sports', 'sports', [-15, 0, 30], Math.PI / 4, '#ff2244'),
  createVehicle('vehicle-truck-1', 'truck', [40, 0, -10], Math.PI, '#886644'),
  createVehicle('vehicle-suv-1', 'suv', [-30, 0, -25], -Math.PI / 4, '#222222'),
  createVehicle('vehicle-sedan-3', 'sedan', [60, 0, 60], 0, '#44cc66'),
  createVehicle('vehicle-sports-2', 'sports', [-50, 0, -50], Math.PI, '#ffaa00'),
];
