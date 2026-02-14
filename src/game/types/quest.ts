import * as THREE from 'three';

/** Quest status tracking */
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';

/** Types of quest objectives */
export type ObjectiveType = 'go_to' | 'collect' | 'deliver' | 'talk_to' | 'drive_to';

/** A single quest objective */
export interface QuestObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  targetPosition?: THREE.Vector3;
  targetEntityId?: string;
  itemId?: string;
  requiredCount?: number;
  currentCount: number;
  isCompleted: boolean;
}

/** Full quest definition */
export interface Quest {
  id: string;
  title: string;
  description: string;
  giverNpcId: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward;
  /** Quest IDs that must be completed before this one is available */
  prerequisites: string[];
}

/** Rewards for completing a quest */
export interface QuestReward {
  experience: number;
  unlockVehicleId?: string;
  unlockQuestId?: string;
}

/** Quest log entry for UI display */
export interface QuestLogEntry {
  quest: Quest;
  activeObjective: QuestObjective | null;
}
