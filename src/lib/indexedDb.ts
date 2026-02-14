/**
 * IndexedDB helper - Opens and manages the game's IndexedDB database.
 * Used by the SaveSystem for persistent game state storage.
 */

import { DB } from '@/game/utils/constants';

let dbInstance: IDBDatabase | null = null;

/**
 * Open (or create) the IndexedDB database.
 * Returns a cached instance after the first call.
 */
export function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB.NAME, DB.VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // Create the saves object store if it doesn't exist
      if (!db.objectStoreNames.contains(DB.STORE_NAME)) {
        db.createObjectStore(DB.STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error}`));
    };
  });
}

/**
 * Close the database connection and clear the cached instance.
 */
export function closeDB() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Delete the entire database (for testing/reset).
 */
export function deleteDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    closeDB();
    const request = indexedDB.deleteDatabase(DB.NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
