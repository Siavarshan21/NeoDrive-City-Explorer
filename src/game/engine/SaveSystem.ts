/**
 * SaveSystem - Manages saving and loading game state to/from IndexedDB.
 * Provides slot-based saving with automatic serialization of game state.
 */

import { openDB } from '@/lib/indexedDb';
import type { SaveData } from '@/game/types/save';
import { SAVE_VERSION } from '@/game/types/save';
import { DB } from '@/game/utils/constants';
import { logger } from '@/game/utils/logger';

class SaveSystem {
  /** Save game state to a slot */
  async save(slotId: string, data: Omit<SaveData, 'id' | 'timestamp' | 'version'>): Promise<void> {
    try {
      const db = await openDB();
      const saveData: SaveData = {
        ...data,
        id: slotId,
        timestamp: Date.now(),
        version: SAVE_VERSION,
      };

      const tx = db.transaction(DB.STORE_NAME, 'readwrite');
      const store = tx.objectStore(DB.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.put(saveData);
        request.onsuccess = () => {
          logger.info('SaveSystem', `Game saved to slot: ${slotId}`);
          resolve();
        };
        request.onerror = () => {
          logger.error('SaveSystem', `Failed to save: ${request.error}`);
          reject(request.error);
        };
      });
    } catch (err) {
      logger.error('SaveSystem', 'Save failed', err);
      throw err;
    }
  }

  /** Load game state from a slot */
  async load(slotId: string): Promise<SaveData | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(DB.STORE_NAME, 'readonly');
      const store = tx.objectStore(DB.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(slotId);
        request.onsuccess = () => {
          const data = request.result as SaveData | undefined;
          if (data) {
            logger.info('SaveSystem', `Game loaded from slot: ${slotId}`);
            resolve(data);
          } else {
            logger.info('SaveSystem', `No save found in slot: ${slotId}`);
            resolve(null);
          }
        };
        request.onerror = () => {
          logger.error('SaveSystem', `Failed to load: ${request.error}`);
          reject(request.error);
        };
      });
    } catch (err) {
      logger.error('SaveSystem', 'Load failed', err);
      return null;
    }
  }

  /** Delete a save slot */
  async deleteSave(slotId: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(DB.STORE_NAME, 'readwrite');
      const store = tx.objectStore(DB.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.delete(slotId);
        request.onsuccess = () => {
          logger.info('SaveSystem', `Save deleted: ${slotId}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      logger.error('SaveSystem', 'Delete failed', err);
      throw err;
    }
  }

  /** List all save slots */
  async listSaves(): Promise<SaveData[]> {
    try {
      const db = await openDB();
      const tx = db.transaction(DB.STORE_NAME, 'readonly');
      const store = tx.objectStore(DB.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          resolve((request.result as SaveData[]) ?? []);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      logger.error('SaveSystem', 'List saves failed', err);
      return [];
    }
  }
}

/** Singleton save system */
export const saveSystem = new SaveSystem();
