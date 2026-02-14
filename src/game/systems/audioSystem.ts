/**
 * Audio System - Manages game audio including music, SFX, and ambient sounds.
 * Uses the Web Audio API for positional audio and volume control.
 */

import { logger } from '@/game/utils/logger';

type SoundCategory = 'music' | 'sfx' | 'ambient';

interface SoundEntry {
  id: string;
  audio: HTMLAudioElement;
  category: SoundCategory;
  loop: boolean;
}

class AudioSystem {
  private sounds: Map<string, SoundEntry> = new Map();
  private volumes: Record<SoundCategory, number> = {
    music: 0.5,
    sfx: 0.7,
    ambient: 0.4,
  };
  private muted = false;

  /** Preload a sound file */
  preload(id: string, src: string, category: SoundCategory, loop = false) {
    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = this.volumes[category];
    audio.preload = 'auto';

    this.sounds.set(id, { id, audio, category, loop });
    logger.debug('AudioSystem', `Preloaded: ${id}`);
  }

  /** Play a sound by ID */
  play(id: string) {
    const entry = this.sounds.get(id);
    if (!entry) {
      logger.warn('AudioSystem', `Sound not found: ${id}`);
      return;
    }

    if (this.muted) return;

    entry.audio.currentTime = 0;
    entry.audio.volume = this.volumes[entry.category];
    entry.audio.play().catch((err) => {
      // Browser autoplay restrictions - ignore silently
      logger.debug('AudioSystem', `Play blocked for: ${id}`, err);
    });
  }

  /** Stop a sound by ID */
  stop(id: string) {
    const entry = this.sounds.get(id);
    if (!entry) return;

    entry.audio.pause();
    entry.audio.currentTime = 0;
  }

  /** Pause a sound (keeps current position) */
  pause(id: string) {
    const entry = this.sounds.get(id);
    if (!entry) return;
    entry.audio.pause();
  }

  /** Resume a paused sound */
  resume(id: string) {
    const entry = this.sounds.get(id);
    if (!entry || this.muted) return;
    entry.audio.play().catch(() => {});
  }

  /** Set volume for a category (0-1) */
  setVolume(category: SoundCategory, volume: number) {
    this.volumes[category] = Math.max(0, Math.min(1, volume));
    // Update all sounds in this category
    this.sounds.forEach((entry) => {
      if (entry.category === category) {
        entry.audio.volume = this.volumes[category];
      }
    });
  }

  /** Mute/unmute all sounds */
  setMuted(muted: boolean) {
    this.muted = muted;
    this.sounds.forEach((entry) => {
      if (muted) {
        entry.audio.pause();
      } else if (entry.loop) {
        entry.audio.play().catch(() => {});
      }
    });
  }

  /** Stop all sounds */
  stopAll() {
    this.sounds.forEach((entry) => {
      entry.audio.pause();
      entry.audio.currentTime = 0;
    });
  }

  /** Clean up all audio resources */
  dispose() {
    this.stopAll();
    this.sounds.clear();
  }
}

/** Singleton audio system */
export const audioSystem = new AudioSystem();
