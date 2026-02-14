/**
 * Quest System - Manages quest progression, objective tracking,
 * and completion logic. Updates the game store when objectives change.
 */

import * as THREE from 'three';
import type { Quest, QuestObjective, QuestStatus } from '@/game/types/quest';
import { distanceXZ } from '@/game/utils/math';
import { logger } from '@/game/utils/logger';

/** Distance threshold to count as "arrived at location" */
const LOCATION_THRESHOLD = 5;

/**
 * Check if a quest's objectives are all completed.
 */
export function isQuestComplete(quest: Quest): boolean {
  return quest.objectives.every((obj) => obj.isCompleted);
}

/**
 * Check location-based objectives against player position.
 * Returns updated objectives list if any changed.
 */
export function checkLocationObjectives(
  quest: Quest,
  playerPosition: THREE.Vector3
): QuestObjective[] {
  return quest.objectives.map((obj) => {
    if (obj.isCompleted) return obj;
    if (
      (obj.type === 'go_to' || obj.type === 'drive_to') &&
      obj.targetPosition
    ) {
      const dist = distanceXZ(playerPosition, obj.targetPosition);
      if (dist < LOCATION_THRESHOLD) {
        logger.info('QuestSystem', `Objective completed: ${obj.description}`);
        return { ...obj, currentCount: 1, isCompleted: true };
      }
    }
    return obj;
  });
}

/**
 * Progress a "collect" objective by incrementing its count.
 */
export function progressCollectObjective(
  quest: Quest,
  objectiveId: string,
  amount: number = 1
): QuestObjective[] {
  return quest.objectives.map((obj) => {
    if (obj.id === objectiveId && obj.type === 'collect' && !obj.isCompleted) {
      const newCount = obj.currentCount + amount;
      const completed = newCount >= (obj.requiredCount ?? 1);
      if (completed) {
        logger.info('QuestSystem', `Collect objective completed: ${obj.description}`);
      }
      return { ...obj, currentCount: newCount, isCompleted: completed };
    }
    return obj;
  });
}

/**
 * Get quests available to the player based on prerequisites.
 */
export function getAvailableQuests(
  allQuests: Quest[],
  completedQuestIds: string[]
): Quest[] {
  return allQuests.filter(
    (q) =>
      q.status === 'available' &&
      q.prerequisites.every((prereq) => completedQuestIds.includes(prereq))
  );
}

/**
 * Get currently active quests.
 */
export function getActiveQuests(allQuests: Quest[]): Quest[] {
  return allQuests.filter((q) => q.status === 'active');
}
