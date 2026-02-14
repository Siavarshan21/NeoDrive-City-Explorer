'use client';

/**
 * MiniMap - Top-down view of the player's surroundings.
 * Shows player position, nearby vehicles, NPCs, and quest markers
 * on a circular or square minimap overlay.
 */

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { WORLD } from '@/game/utils/constants';

const MAP_SIZE = 160; // pixel size of the minimap
const MAP_RANGE = 80; // world units shown on the minimap

/** Convert world position to minimap pixel coordinates */
function worldToMinimap(
  worldX: number,
  worldZ: number,
  playerX: number,
  playerZ: number
): { x: number; y: number; visible: boolean } {
  const relX = worldX - playerX;
  const relZ = worldZ - playerZ;
  const mapX = (relX / MAP_RANGE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
  const mapY = (relZ / MAP_RANGE) * (MAP_SIZE / 2) + MAP_SIZE / 2;
  const visible = mapX >= 0 && mapX <= MAP_SIZE && mapY >= 0 && mapY <= MAP_SIZE;
  return { x: mapX, y: mapY, visible };
}

export function MiniMap() {
  const showMiniMap = useUIStore((s) => s.showMiniMap);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const vehicles = useGameStore((s) => s.vehicles);
  const npcs = useGameStore((s) => s.npcs);
  const playerRotation = useGameStore((s) => s.playerRotation);

  if (!showMiniMap) return null;

  return (
    <div
      className="relative overflow-hidden rounded-full border-2 border-neo-cyan bg-neo-dark"
      style={{ width: MAP_SIZE, height: MAP_SIZE }}
    >
      {/* Grid lines for reference */}
      <svg
        width={MAP_SIZE}
        height={MAP_SIZE}
        className="absolute inset-0 opacity-20"
      >
        {/* Grid */}
        {Array.from({ length: 9 }, (_, i) => {
          const pos = (i / 8) * MAP_SIZE;
          return (
            <g key={i}>
              <line x1={pos} y1={0} x2={pos} y2={MAP_SIZE} stroke="#00f0ff" strokeWidth={0.5} />
              <line x1={0} y1={pos} x2={MAP_SIZE} y2={pos} stroke="#00f0ff" strokeWidth={0.5} />
            </g>
          );
        })}
      </svg>

      {/* Vehicle markers */}
      {vehicles.map((v) => {
        const pos = worldToMinimap(v.position.x, v.position.z, playerPosition.x, playerPosition.z);
        if (!pos.visible) return null;
        return (
          <div
            key={v.id}
            className="absolute w-2 h-2 bg-blue-400 rounded-sm"
            style={{ left: pos.x - 4, top: pos.y - 4 }}
          />
        );
      })}

      {/* NPC markers */}
      {npcs.map((npc) => {
        const pos = worldToMinimap(npc.position.x, npc.position.z, playerPosition.x, playerPosition.z);
        if (!pos.visible) return null;
        return (
          <div
            key={npc.id}
            className={`absolute w-1.5 h-1.5 rounded-full ${
              npc.type === 'quest_giver' ? 'bg-yellow-400' : 'bg-gray-400'
            }`}
            style={{ left: pos.x - 3, top: pos.y - 3 }}
          />
        );
      })}

      {/* Player marker (center, with rotation indicator) */}
      <div
        className="absolute"
        style={{
          left: MAP_SIZE / 2 - 6,
          top: MAP_SIZE / 2 - 6,
          transform: `rotate(${-playerRotation.y}rad)`,
        }}
      >
        <svg width={12} height={12} viewBox="0 0 12 12">
          <polygon points="6,0 12,12 6,9 0,12" fill="#00f0ff" />
        </svg>
      </div>

      {/* Compass label */}
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-neo-cyan font-mono">
        N
      </span>
    </div>
  );
}
