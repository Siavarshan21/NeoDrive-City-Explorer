'use client';

/**
 * HealthBar - Displays player health as a horizontal bar with neo-styled coloring.
 */

import { useGameStore } from '@/store/gameStore';

export function HealthBar() {
  const health = useGameStore((s) => s.playerHealth);
  const maxHealth = useGameStore((s) => s.playerMaxHealth);
  const percentage = (health / maxHealth) * 100;

  // Color transitions: green -> yellow -> red
  const getColor = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neo-cyan font-mono">HP</span>
      <div className="w-32 h-3 bg-gray-800 rounded-sm border border-gray-600 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-white font-mono">
        {Math.round(health)}/{maxHealth}
      </span>
    </div>
  );
}
