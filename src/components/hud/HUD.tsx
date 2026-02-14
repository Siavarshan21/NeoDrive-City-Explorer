'use client';

/**
 * HUD - Main heads-up display overlay.
 * Composes all HUD elements: minimap, health bar, speedometer,
 * quest tracker, interaction prompts, and notifications.
 */

import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { MiniMap } from './MiniMap';
import { HealthBar } from './HealthBar';
import { Speedometer } from './Speedometer';
import { QuestTracker } from './QuestTracker';

export function HUD() {
  const showHUD = useUIStore((s) => s.showHUD);
  const interactionPrompt = useUIStore((s) => s.interactionPrompt);
  const notificationMessage = useUIStore((s) => s.notificationMessage);
  const isInVehicle = useGameStore((s) => s.isInVehicle);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const dayCount = useGameStore((s) => s.dayCount);

  if (!showHUD) return null;

  // Format time for display
  const hours = Math.floor(timeOfDay * 24);
  const minutes = Math.floor((timeOfDay * 24 - hours) * 60);
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top-left: Health + Day/Time */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <HealthBar />
        <div className="flex items-center gap-3">
          <span className="text-xs text-neo-cyan font-mono">Day {dayCount}</span>
          <span className="text-xs text-white font-mono">{timeStr}</span>
        </div>
      </div>

      {/* Top-right: Minimap */}
      <div className="absolute top-4 right-4">
        <MiniMap />
      </div>

      {/* Right side: Quest tracker */}
      <div className="absolute top-48 right-4">
        <QuestTracker />
      </div>

      {/* Bottom-right: Speedometer (vehicle only) */}
      {isInVehicle && (
        <div className="absolute bottom-8 right-8">
          <Speedometer />
        </div>
      )}

      {/* Bottom-center: Interaction prompt */}
      {interactionPrompt && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <div className="bg-neo-panel border border-neo-cyan/50 rounded px-4 py-2 animate-pulse-glow">
            <span className="text-sm text-neo-cyan font-mono">{interactionPrompt}</span>
          </div>
        </div>
      )}

      {/* Top-center: Notification */}
      {notificationMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="bg-neo-panel border border-neo-yellow/50 rounded px-6 py-3">
            <span className="text-sm text-neo-yellow font-mono">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Bottom-left: Controls hint */}
      <div className="absolute bottom-4 left-4">
        <div className="text-[10px] text-gray-500 font-mono space-y-0.5">
          <p>WASD - Move | SHIFT - Run</p>
          <p>E - Interact | F - Vehicle</p>
          <p>ESC - Pause | J - Quests</p>
        </div>
      </div>

      {/* Crosshair (center) */}
      {!isInVehicle && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-1 h-1 bg-white rounded-full opacity-50" />
        </div>
      )}
    </div>
  );
}
