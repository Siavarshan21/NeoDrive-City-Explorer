'use client';

/**
 * MainMenu - Title screen with New Game, Load Game, and Settings options.
 * Displayed when the game first launches or when returning to the main menu.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useLocalSave } from '@/hooks/useLocalSave';
import { initialVehicles } from '@/game/data/vehicles';
import { questDefinitions } from '@/game/data/quests';
import { SettingsMenu } from './SettingsMenu';
import * as THREE from 'three';
import type { NPCEntity } from '@/game/types/entity';

/** Initial NPC spawns for a new game */
const initialNpcs: NPCEntity[] = [
  {
    id: 'npc-ped-1', name: 'Pedestrian', type: 'pedestrian',
    position: new THREE.Vector3(5, 0, 5), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-sidewalk-1', currentWaypointIndex: 0,
    walkSpeed: 2, isInteractable: false, dialogueId: null, questId: null,
  },
  {
    id: 'npc-ped-2', name: 'Pedestrian', type: 'pedestrian',
    position: new THREE.Vector3(-10, 0, -10), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-sidewalk-2', currentWaypointIndex: 0,
    walkSpeed: 2, isInteractable: false, dialogueId: null, questId: null,
  },
  {
    id: 'npc-ped-3', name: 'Pedestrian', type: 'pedestrian',
    position: new THREE.Vector3(50, 0, 50), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-park', currentWaypointIndex: 0,
    walkSpeed: 2, isInteractable: false, dialogueId: null, questId: null,
  },
  {
    id: 'npc-ped-4', name: 'Pedestrian', type: 'pedestrian',
    position: new THREE.Vector3(-40, 0, 40), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-plaza', currentWaypointIndex: 0,
    walkSpeed: 2, isInteractable: false, dialogueId: null, questId: null,
  },
  {
    id: 'npc-quest-giver-1', name: 'City Guide Marcus', type: 'quest_giver',
    position: new THREE.Vector3(15, 0, 0), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-stationary-quest', currentWaypointIndex: 0,
    walkSpeed: 0, isInteractable: true, dialogueId: 'dlg-marcus', questId: 'quest-welcome',
  },
  {
    id: 'npc-shopkeeper-1', name: 'Shopkeeper Rosa', type: 'shopkeeper',
    position: new THREE.Vector3(-20, 0, 5), rotation: new THREE.Euler(),
    scale: new THREE.Vector3(1, 1, 1), active: true,
    routeId: 'route-stationary-shop', currentWaypointIndex: 0,
    walkSpeed: 0, isInteractable: true, dialogueId: 'dlg-rosa', questId: 'quest-delivery',
  },
];

export function MainMenu() {
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const setMainMenu = useUIStore((s) => s.setMainMenu);
  const setGameRunning = useGameStore((s) => s.setGameRunning);
  const setVehicles = useGameStore((s) => s.setVehicles);
  const setNpcs = useGameStore((s) => s.setNpcs);
  const setQuests = useGameStore((s) => s.setQuests);
  const setActiveQuest = useGameStore((s) => s.setActiveQuest);
  const { loadGame } = useLocalSave();
  const [showSettings, setShowSettings] = useState(false);

  if (!isMainMenu) return null;

  const startNewGame = () => {
    // Initialize world entities
    setVehicles(initialVehicles);
    setNpcs(initialNpcs);
    setQuests(questDefinitions.map((q) => ({ ...q })));
    setActiveQuest('quest-welcome');

    // Start game
    setGameRunning(true);
    setMainMenu(false);
  };

  const handleLoadGame = async () => {
    const success = await loadGame('auto');
    if (success) {
      setVehicles(initialVehicles);
      setNpcs(initialNpcs);
      setGameRunning(true);
      setMainMenu(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-dark">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neo-dark to-neo-dark" />
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="0" y1={`${(i / 20) * 100}%`}
                x2="100%" y2={`${(i / 20) * 100}%`}
                stroke="#00f0ff" strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={`${(i / 20) * 100}%`} y1="0"
                x2={`${(i / 20) * 100}%`} y2="100%"
                stroke="#00f0ff" strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Menu content */}
      <div className="relative z-10 text-center">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold font-mono text-neo-cyan mb-2 tracking-wider">
            NEOCITY
          </h1>
          <h2 className="text-2xl font-mono text-neo-magenta tracking-widest">
            EXPLORER
          </h2>
          <div className="mt-4 h-[1px] w-64 mx-auto bg-gradient-to-r from-transparent via-neo-cyan to-transparent" />
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-4 items-center">
          <Button size="lg" onClick={startNewGame} className="w-48">
            NEW GAME
          </Button>
          <Button size="lg" variant="secondary" onClick={handleLoadGame} className="w-48">
            LOAD GAME
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setShowSettings(true)} className="w-48">
            SETTINGS
          </Button>
        </div>

        {/* Version info */}
        <p className="mt-8 text-xs text-gray-600 font-mono">
          v0.1.0 | Frontend Only | Three.js + Next.js
        </p>
      </div>

      {/* Settings overlay */}
      {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}
    </div>
  );
}
