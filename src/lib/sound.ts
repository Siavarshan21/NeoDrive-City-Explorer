/**
 * Sound helper - Convenience functions for loading and playing game audio.
 * Wraps the audioSystem for common use cases.
 */

import { audioSystem } from '@/game/systems/audioSystem';

/** Preload all game sounds */
export function preloadGameSounds() {
  // Ambient
  audioSystem.preload('ambient-city', '/assets/sounds/ambient.mp3', 'ambient', true);

  // SFX
  audioSystem.preload('footsteps', '/assets/sounds/footsteps.mp3', 'sfx', true);
  audioSystem.preload('engine', '/assets/sounds/engine.mp3', 'sfx', true);

  // Note: Actual sound files need to be placed in public/assets/sounds/
  // These will fail silently if files don't exist (browser Audio behavior)
}

/** Start ambient city sounds */
export function startAmbientSounds() {
  audioSystem.play('ambient-city');
}

/** Stop all ambient sounds */
export function stopAmbientSounds() {
  audioSystem.stop('ambient-city');
}

/** Play footstep sound */
export function playFootsteps() {
  audioSystem.play('footsteps');
}

/** Stop footstep sound */
export function stopFootsteps() {
  audioSystem.stop('footsteps');
}

/** Play engine sound */
export function playEngine() {
  audioSystem.play('engine');
}

/** Stop engine sound */
export function stopEngine() {
  audioSystem.stop('engine');
}
