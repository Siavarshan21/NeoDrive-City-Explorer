import { create } from 'zustand';
import * as THREE from 'three';
import type { Quest, QuestStatus } from '@/game/types/quest';
import type { VehicleEntity, NPCEntity } from '@/game/types/entity';
import { PLAYER } from '@/game/utils/constants';

/** Core game state: player, vehicles, NPCs, quests, world time */
interface GameState {
  // -- Player --
  playerPosition: THREE.Vector3;
  playerRotation: THREE.Euler;
  playerHealth: number;
  playerMaxHealth: number;
  playerSpeed: number;
  isRunning: boolean;
  isInVehicle: boolean;
  currentVehicleId: string | null;

  // -- Vehicles --
  vehicles: VehicleEntity[];
  unlockedVehicleIds: string[];

  // -- NPCs --
  npcs: NPCEntity[];

  // -- Quests --
  quests: Quest[];
  activeQuestId: string | null;

  // -- World --
  timeOfDay: number; // 0-1 normalized (0 = midnight, 0.5 = noon)
  dayCount: number;
  isGameRunning: boolean;

  // -- Actions --
  setPlayerPosition: (pos: THREE.Vector3) => void;
  setPlayerRotation: (rot: THREE.Euler) => void;
  setPlayerHealth: (health: number) => void;
  setIsRunning: (running: boolean) => void;
  enterVehicle: (vehicleId: string) => void;
  exitVehicle: () => void;
  setTimeOfDay: (time: number) => void;
  advanceDay: () => void;
  setGameRunning: (running: boolean) => void;
  updateQuestStatus: (questId: string, status: QuestStatus) => void;
  setActiveQuest: (questId: string | null) => void;
  updateObjectiveProgress: (questId: string, objectiveId: string, count: number) => void;
  unlockVehicle: (vehicleId: string) => void;
  setQuests: (quests: Quest[]) => void;
  setVehicles: (vehicles: VehicleEntity[]) => void;
  setNpcs: (npcs: NPCEntity[]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Player defaults
  playerPosition: new THREE.Vector3(0, 0, 0),
  playerRotation: new THREE.Euler(0, 0, 0),
  playerHealth: PLAYER.MAX_HEALTH,
  playerMaxHealth: PLAYER.MAX_HEALTH,
  playerSpeed: 0,
  isRunning: false,
  isInVehicle: false,
  currentVehicleId: null,

  // Vehicles
  vehicles: [],
  unlockedVehicleIds: [],

  // NPCs
  npcs: [],

  // Quests
  quests: [],
  activeQuestId: null,

  // World
  timeOfDay: 0.35, // Start at morning
  dayCount: 1,
  isGameRunning: false,

  // Actions
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  setPlayerHealth: (health) =>
    set({ playerHealth: Math.max(0, Math.min(health, get().playerMaxHealth)) }),
  setIsRunning: (running) => set({ isRunning: running }),

  enterVehicle: (vehicleId) =>
    set((state) => ({
      isInVehicle: true,
      currentVehicleId: vehicleId,
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, isOccupied: true, occupantId: 'player' } : v
      ),
    })),

  exitVehicle: () =>
    set((state) => ({
      isInVehicle: false,
      currentVehicleId: null,
      vehicles: state.vehicles.map((v) =>
        v.id === state.currentVehicleId
          ? { ...v, isOccupied: false, occupantId: null }
          : v
      ),
    })),

  setTimeOfDay: (time) => set({ timeOfDay: time % 1 }),
  advanceDay: () => set((state) => ({ dayCount: state.dayCount + 1 })),
  setGameRunning: (running) => set({ isGameRunning: running }),

  updateQuestStatus: (questId, status) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, status } : q
      ),
    })),

  setActiveQuest: (questId) => set({ activeQuestId: questId }),

  updateObjectiveProgress: (questId, objectiveId, count) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? {
              ...q,
              objectives: q.objectives.map((obj) =>
                obj.id === objectiveId
                  ? {
                      ...obj,
                      currentCount: count,
                      isCompleted: count >= (obj.requiredCount ?? 1),
                    }
                  : obj
              ),
            }
          : q
      ),
    })),

  unlockVehicle: (vehicleId) =>
    set((state) => ({
      unlockedVehicleIds: state.unlockedVehicleIds.includes(vehicleId)
        ? state.unlockedVehicleIds
        : [...state.unlockedVehicleIds, vehicleId],
    })),

  setQuests: (quests) => set({ quests }),
  setVehicles: (vehicles) => set({ vehicles }),
  setNpcs: (npcs) => set({ npcs }),
}));
