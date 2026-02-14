/** Save data structure stored in IndexedDB */
export interface SaveData {
  id: string;
  timestamp: number;
  version: number;
  player: PlayerSaveData;
  quests: QuestSaveData;
  vehicles: VehicleSaveData[];
  world: WorldSaveData;
  settings: SettingsSaveData;
}

export interface PlayerSaveData {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  health: number;
  isInVehicle: boolean;
  currentVehicleId: string | null;
}

export interface QuestSaveData {
  activeQuests: string[];
  completedQuests: string[];
  failedQuests: string[];
  objectiveProgress: Record<string, number>;
}

export interface VehicleSaveData {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isUnlocked: boolean;
}

export interface WorldSaveData {
  timeOfDay: number;
  dayCount: number;
}

export interface SettingsSaveData {
  musicVolume: number;
  sfxVolume: number;
  mouseSensitivity: number;
  renderDistance: number;
  showFps: boolean;
}

/** Current save system version for migration compatibility */
export const SAVE_VERSION = 1;
