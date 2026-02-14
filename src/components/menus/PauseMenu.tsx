'use client';

/**
 * PauseMenu - In-game pause overlay with resume, settings, save, and quit options.
 * Triggered by pressing Escape during gameplay.
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { useLocalSave } from '@/hooks/useLocalSave';
import { SettingsMenu } from './SettingsMenu';
import { KEYS } from '@/game/utils/constants';

export function PauseMenu() {
  const isPaused = useUIStore((s) => s.isPaused);
  const togglePause = useUIStore((s) => s.togglePause);
  const setPaused = useUIStore((s) => s.setPaused);
  const setMainMenu = useUIStore((s) => s.setMainMenu);
  const setGameRunning = useGameStore((s) => s.setGameRunning);
  const isMainMenu = useUIStore((s) => s.isMainMenu);
  const { saveGame, isSaving } = useLocalSave();
  const [showSettings, setShowSettings] = useState(false);

  // Listen for Escape key to toggle pause
  useEffect(() => {
    if (isMainMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KEYS.PAUSE) {
        e.preventDefault();
        if (showSettings) {
          setShowSettings(false);
        } else {
          togglePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, isMainMenu, showSettings]);

  if (!isPaused || isMainMenu) return null;

  const handleResume = () => {
    setPaused(false);
  };

  const handleSave = async () => {
    await saveGame('auto');
  };

  const handleQuit = () => {
    setPaused(false);
    setGameRunning(false);
    setMainMenu(true);
  };

  return (
    <Modal isOpen={isPaused} onClose={handleResume} title="PAUSED">
      <div className="flex flex-col gap-3 items-center py-4">
        <Button size="lg" onClick={handleResume} className="w-48">
          RESUME
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={handleSave}
          disabled={isSaving}
          className="w-48"
        >
          {isSaving ? 'SAVING...' : 'SAVE GAME'}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => setShowSettings(true)}
          className="w-48"
        >
          SETTINGS
        </Button>
        <div className="h-2" />
        <Button size="lg" variant="danger" onClick={handleQuit} className="w-48">
          QUIT TO MENU
        </Button>
      </div>

      {/* Settings overlay within pause */}
      {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}
    </Modal>
  );
}
