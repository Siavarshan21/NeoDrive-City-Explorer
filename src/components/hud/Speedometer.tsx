'use client';

/**
 * Speedometer - Displays vehicle speed with a neo-styled gauge.
 * Only visible when the player is in a vehicle.
 */

import { useGameStore } from '@/store/gameStore';

export function Speedometer() {
  const isInVehicle = useGameStore((s) => s.isInVehicle);
  const playerSpeed = useGameStore((s) => s.playerSpeed);

  if (!isInVehicle) return null;

  // Convert internal speed units to display km/h
  const displaySpeed = Math.round(playerSpeed * 3.6);
  const maxDisplay = 200;
  const percentage = Math.min((displaySpeed / maxDisplay) * 100, 100);

  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full border-2 border-neo-cyan bg-neo-panel flex items-center justify-center relative">
        {/* Speed arc indicator */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#333"
            strokeWidth="4"
            strokeDasharray="198"
            strokeDashoffset="66"
            transform="rotate(120 50 50)"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="4"
            strokeDasharray="198"
            strokeDashoffset={198 - (percentage / 100) * 132}
            transform="rotate(120 50 50)"
            className="transition-all duration-100"
          />
        </svg>
        <div className="text-center z-10">
          <span className="text-2xl font-bold text-white font-mono">{displaySpeed}</span>
          <span className="block text-[10px] text-neo-cyan font-mono">KM/H</span>
        </div>
      </div>
    </div>
  );
}
