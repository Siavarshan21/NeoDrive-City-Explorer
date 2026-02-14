/**
 * Quest Definitions - All available quests in the game.
 * Quests include objectives, rewards, and prerequisites.
 */

import * as THREE from 'three';
import type { Quest } from '@/game/types/quest';

export const questDefinitions: Quest[] = [
  {
    id: 'quest-welcome',
    title: 'Welcome to NeoCity',
    description: 'Meet the city guide near the central plaza to learn about NeoCity.',
    giverNpcId: 'npc-quest-giver-1',
    status: 'available',
    objectives: [
      {
        id: 'obj-welcome-1',
        type: 'go_to',
        description: 'Walk to the central plaza',
        targetPosition: new THREE.Vector3(15, 0, 0),
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-welcome-2',
        type: 'talk_to',
        description: 'Talk to the city guide',
        targetEntityId: 'npc-quest-giver-1',
        currentCount: 0,
        isCompleted: false,
      },
    ],
    rewards: {
      experience: 50,
      unlockQuestId: 'quest-first-drive',
    },
    prerequisites: [],
  },
  {
    id: 'quest-first-drive',
    title: 'First Drive',
    description: 'Find a vehicle and take it for a test drive around the block.',
    giverNpcId: 'npc-quest-giver-1',
    status: 'available',
    objectives: [
      {
        id: 'obj-drive-1',
        type: 'go_to',
        description: 'Find a parked vehicle',
        targetPosition: new THREE.Vector3(10, 0, 10),
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-drive-2',
        type: 'drive_to',
        description: 'Drive to the highway entrance',
        targetPosition: new THREE.Vector3(80, 0, 0),
        currentCount: 0,
        isCompleted: false,
      },
    ],
    rewards: {
      experience: 100,
      unlockVehicleId: 'vehicle-sports',
      unlockQuestId: 'quest-delivery',
    },
    prerequisites: ['quest-welcome'],
  },
  {
    id: 'quest-delivery',
    title: 'Special Delivery',
    description: 'Pick up a package from the shopkeeper and deliver it across town.',
    giverNpcId: 'npc-shopkeeper-1',
    status: 'available',
    objectives: [
      {
        id: 'obj-delivery-1',
        type: 'talk_to',
        description: 'Talk to the shopkeeper',
        targetEntityId: 'npc-shopkeeper-1',
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-delivery-2',
        type: 'collect',
        description: 'Pick up the package',
        itemId: 'package-1',
        requiredCount: 1,
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-delivery-3',
        type: 'drive_to',
        description: 'Deliver the package to the warehouse',
        targetPosition: new THREE.Vector3(-60, 0, -60),
        currentCount: 0,
        isCompleted: false,
      },
    ],
    rewards: {
      experience: 200,
    },
    prerequisites: ['quest-first-drive'],
  },
  {
    id: 'quest-explore',
    title: 'City Explorer',
    description: 'Visit all four corners of NeoCity.',
    giverNpcId: 'npc-quest-giver-1',
    status: 'available',
    objectives: [
      {
        id: 'obj-explore-ne',
        type: 'go_to',
        description: 'Visit the Northeast district',
        targetPosition: new THREE.Vector3(80, 0, 80),
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-explore-nw',
        type: 'go_to',
        description: 'Visit the Northwest district',
        targetPosition: new THREE.Vector3(-80, 0, 80),
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-explore-se',
        type: 'go_to',
        description: 'Visit the Southeast district',
        targetPosition: new THREE.Vector3(80, 0, -80),
        currentCount: 0,
        isCompleted: false,
      },
      {
        id: 'obj-explore-sw',
        type: 'go_to',
        description: 'Visit the Southwest district',
        targetPosition: new THREE.Vector3(-80, 0, -80),
        currentCount: 0,
        isCompleted: false,
      },
    ],
    rewards: {
      experience: 500,
    },
    prerequisites: ['quest-welcome'],
  },
];
