import { create } from 'zustand';

/** UI state for menus, HUD visibility, and overlays */
interface UIState {
  // Menu states
  isMainMenu: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isQuestLogOpen: boolean;

  // HUD visibility
  showHUD: boolean;
  showMiniMap: boolean;
  showFps: boolean;

  // Interaction
  interactionPrompt: string | null;
  notificationMessage: string | null;
  notificationTimeout: number | null;

  // Actions
  setMainMenu: (open: boolean) => void;
  setPaused: (paused: boolean) => void;
  togglePause: () => void;
  setSettingsOpen: (open: boolean) => void;
  setQuestLogOpen: (open: boolean) => void;
  setShowHUD: (show: boolean) => void;
  setShowMiniMap: (show: boolean) => void;
  setShowFps: (show: boolean) => void;
  setInteractionPrompt: (prompt: string | null) => void;
  showNotification: (message: string, durationMs?: number) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isMainMenu: true,
  isPaused: false,
  isSettingsOpen: false,
  isQuestLogOpen: false,

  showHUD: true,
  showMiniMap: true,
  showFps: false,

  interactionPrompt: null,
  notificationMessage: null,
  notificationTimeout: null,

  setMainMenu: (open) => set({ isMainMenu: open }),
  setPaused: (paused) => set({ isPaused: paused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setQuestLogOpen: (open) => set({ isQuestLogOpen: open }),
  setShowHUD: (show) => set({ showHUD: show }),
  setShowMiniMap: (show) => set({ showMiniMap: show }),
  setShowFps: (show) => set({ showFps: show }),
  setInteractionPrompt: (prompt) => set({ interactionPrompt: prompt }),

  showNotification: (message, durationMs = 3000) => {
    const existing = get().notificationTimeout;
    if (existing !== null) {
      window.clearTimeout(existing);
    }
    const timeout = window.setTimeout(() => {
      set({ notificationMessage: null, notificationTimeout: null });
    }, durationMs);
    set({ notificationMessage: message, notificationTimeout: timeout });
  },

  clearNotification: () => {
    const existing = get().notificationTimeout;
    if (existing !== null) {
      window.clearTimeout(existing);
    }
    set({ notificationMessage: null, notificationTimeout: null });
  },
}));
