import type { NPCType } from '@/game/types/entity';

/** Visual and behavioral configuration for NPC types */
export interface NPCTypeConfig {
  type: NPCType;
  color: string;
  height: number;
  walkSpeed: number;
  radius: number;
}

export const npcTypeConfigs: Record<NPCType, NPCTypeConfig> = {
  pedestrian: {
    type: 'pedestrian',
    color: '#aaaacc',
    height: 1.7,
    walkSpeed: 2,
    radius: 0.35,
  },
  quest_giver: {
    type: 'quest_giver',
    color: '#ffcc00',
    height: 1.8,
    walkSpeed: 0, // Stationary
    radius: 0.4,
  },
  shopkeeper: {
    type: 'shopkeeper',
    color: '#44cc88',
    height: 1.75,
    walkSpeed: 0,
    radius: 0.4,
  },
};
