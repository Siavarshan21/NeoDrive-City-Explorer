'use client';

/**
 * useLocalSave - React hook for saving and loading game state with IndexedDB.
 * Provides convenient methods to persist the current game state.
 */

import { useCallback, useState } from 'react';
import { saveSystem } from '@/game/engine/SaveSystem';
import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { SaveData } from '@/game/types/save';
import { logger } from '@/game/utils/logger';

export function useLocalSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** Save current game state to a slot */
  const saveGame = useCallback(async (slotId: string = 'auto') => {
    setIsSaving(true);
    try {
      const gameState = useGameStore.getState();
      const settings = useSettingsStore.getState();

      await saveSystem.save(slotId, {
        player: {
          position: {
            x: gameState.playerPosition.x,
            y: gameState.playerPosition.y,
            z: gameState.playerPosition.z,
          },
          rotation: {
            x: gameState.playerRotation.x,
            y: gameState.playerRotation.y,
            z: gameState.playerRotation.z,
          },
          health: gameState.playerHealth,
          isInVehicle: gameState.isInVehicle,
          currentVehicleId: gameState.currentVehicleId,
        },
        quests: {
          activeQuests: gameState.quests.filter((q) => q.status === 'active').map((q) => q.id),
          completedQuests: gameState.quests.filter((q) => q.status === 'completed').map((q) => q.id),
          failedQuests: gameState.quests.filter((q) => q.status === 'failed').map((q) => q.id),
          objectiveProgress: {},
        },
        vehicles: gameState.vehicles.map((v) => ({
          id: v.id,
          position: { x: v.position.x, y: v.position.y, z: v.position.z },
          rotation: { x: v.rotation.x, y: v.rotation.y, z: v.rotation.z },
          isUnlocked: gameState.unlockedVehicleIds.includes(v.id),
        })),
        world: {
          timeOfDay: gameState.timeOfDay,
          dayCount: gameState.dayCount,
        },
        settings: {
          musicVolume: settings.musicVolume,
          sfxVolume: settings.sfxVolume,
          mouseSensitivity: settings.mouseSensitivity,
          renderDistance: settings.renderDistance,
          showFps: settings.showFps,
        },
      });

      logger.info('useLocalSave', 'Game saved successfully');
    } catch (err) {
      logger.error('useLocalSave', 'Failed to save game', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  /** Load game state from a slot */
  const loadGame = useCallback(async (slotId: string = 'auto'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await saveSystem.load(slotId);
      if (!data) {
        logger.info('useLocalSave', 'No save data found');
        return false;
      }

      // Restore game state
      const gameStore = useGameStore.getState();
      const settingsStore = useSettingsStore.getState();

      // Note: Restoring Vector3/Euler from plain objects would need proper
      // deserialization in a full implementation
      gameStore.setPlayerHealth(data.player.health);
      gameStore.setTimeOfDay(data.world.timeOfDay);

      settingsStore.setMusicVolume(data.settings.musicVolume);
      settingsStore.setSfxVolume(data.settings.sfxVolume);
      settingsStore.setMouseSensitivity(data.settings.mouseSensitivity);
      settingsStore.setRenderDistance(data.settings.renderDistance);
      settingsStore.setShowFps(data.settings.showFps);

      logger.info('useLocalSave', 'Game loaded successfully');
      return true;
    } catch (err) {
      logger.error('useLocalSave', 'Failed to load game', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** List all available save slots */
  const listSaves = useCallback(async (): Promise<SaveData[]> => {
    return saveSystem.listSaves();
  }, []);

  /** Delete a save slot */
  const deleteSave = useCallback(async (slotId: string) => {
    return saveSystem.deleteSave(slotId);
  }, []);

  return { saveGame, loadGame, listSaves, deleteSave, isSaving, isLoading };
}
