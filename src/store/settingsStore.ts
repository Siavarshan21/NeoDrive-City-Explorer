import { create } from 'zustand';

/** Persistent game settings */
interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  mouseSensitivity: number;
  renderDistance: number;
  showFps: boolean;
  invertMouseY: boolean;
  fullscreen: boolean;

  // Actions
  setMusicVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  setMouseSensitivity: (sens: number) => void;
  setRenderDistance: (dist: number) => void;
  setShowFps: (show: boolean) => void;
  setInvertMouseY: (invert: boolean) => void;
  setFullscreen: (fs: boolean) => void;
  resetDefaults: () => void;
}

const DEFAULTS = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  mouseSensitivity: 0.5,
  renderDistance: 500,
  showFps: false,
  invertMouseY: false,
  fullscreen: false,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULTS,

  setMusicVolume: (vol) => set({ musicVolume: Math.max(0, Math.min(1, vol)) }),
  setSfxVolume: (vol) => set({ sfxVolume: Math.max(0, Math.min(1, vol)) }),
  setMouseSensitivity: (sens) => set({ mouseSensitivity: Math.max(0.1, Math.min(2, sens)) }),
  setRenderDistance: (dist) => set({ renderDistance: Math.max(100, Math.min(1000, dist)) }),
  setShowFps: (show) => set({ showFps: show }),
  setInvertMouseY: (invert) => set({ invertMouseY: invert }),
  setFullscreen: (fs) => set({ fullscreen: fs }),
  resetDefaults: () => set(DEFAULTS),
}));
