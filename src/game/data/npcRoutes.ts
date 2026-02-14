/**
 * NPC Routes - Waypoint paths that NPCs follow as they walk around the city.
 * Each route is a series of 3D positions forming a loop or one-way path.
 */

import * as THREE from 'three';
import type { WaypointRoute } from '@/game/entities/NPC/npcAI';

export const npcRoutes: WaypointRoute[] = [
  {
    id: 'route-sidewalk-1',
    loop: true,
    waypoints: [
      new THREE.Vector3(5, 0, 5),
      new THREE.Vector3(5, 0, 30),
      new THREE.Vector3(30, 0, 30),
      new THREE.Vector3(30, 0, 5),
    ],
  },
  {
    id: 'route-sidewalk-2',
    loop: true,
    waypoints: [
      new THREE.Vector3(-10, 0, -10),
      new THREE.Vector3(-10, 0, 20),
      new THREE.Vector3(-35, 0, 20),
      new THREE.Vector3(-35, 0, -10),
    ],
  },
  {
    id: 'route-park',
    loop: true,
    waypoints: [
      new THREE.Vector3(50, 0, 50),
      new THREE.Vector3(55, 0, 60),
      new THREE.Vector3(60, 0, 55),
      new THREE.Vector3(55, 0, 45),
    ],
  },
  {
    id: 'route-plaza',
    loop: true,
    waypoints: [
      new THREE.Vector3(-40, 0, 40),
      new THREE.Vector3(-30, 0, 45),
      new THREE.Vector3(-25, 0, 40),
      new THREE.Vector3(-30, 0, 35),
    ],
  },
  {
    id: 'route-stationary-quest',
    loop: false,
    waypoints: [
      new THREE.Vector3(15, 0, 0),
    ],
  },
  {
    id: 'route-stationary-shop',
    loop: false,
    waypoints: [
      new THREE.Vector3(-20, 0, 5),
    ],
  },
];
