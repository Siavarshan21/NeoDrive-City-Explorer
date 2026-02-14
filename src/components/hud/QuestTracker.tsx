'use client';

/**
 * QuestTracker - Displays the active quest objectives on the HUD.
 * Shows quest title and a checklist of objectives with completion state.
 */

import { useGameStore } from '@/store/gameStore';

export function QuestTracker() {
  const quests = useGameStore((s) => s.quests);
  const activeQuestId = useGameStore((s) => s.activeQuestId);

  const activeQuest = quests.find((q) => q.id === activeQuestId);

  if (!activeQuest) {
    return (
      <div className="bg-neo-panel rounded border border-gray-700 p-3 max-w-xs">
        <p className="text-xs text-gray-400 font-mono">No active quest</p>
        <p className="text-[10px] text-gray-500 font-mono mt-1">
          Press J for quest log
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neo-panel rounded border border-neo-cyan/30 p-3 max-w-xs">
      <h3 className="text-sm font-bold text-neo-cyan font-mono mb-2">
        {activeQuest.title}
      </h3>
      <ul className="space-y-1">
        {activeQuest.objectives.map((obj) => (
          <li key={obj.id} className="flex items-start gap-2">
            <span className={`mt-0.5 text-xs ${obj.isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
              {obj.isCompleted ? '[x]' : '[ ]'}
            </span>
            <span
              className={`text-xs font-mono ${
                obj.isCompleted ? 'text-gray-500 line-through' : 'text-white'
              }`}
            >
              {obj.description}
              {obj.requiredCount && obj.requiredCount > 1 && (
                <span className="text-neo-cyan ml-1">
                  ({obj.currentCount}/{obj.requiredCount})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
