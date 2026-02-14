/**
 * Day/Night System - Controls the day/night cycle including
 * sun position, ambient light color, fog density, and sky color.
 */

import * as THREE from 'three';
import { DAY_NIGHT } from '@/game/utils/constants';
import { lerp, mapRange, clamp } from '@/game/utils/math';

export interface DayNightState {
  /** Normalized time of day (0 = midnight, 0.5 = noon, 1 = midnight) */
  time: number;
  /** Sun position in the sky */
  sunPosition: THREE.Vector3;
  /** Ambient light color */
  ambientColor: THREE.Color;
  /** Ambient light intensity */
  ambientIntensity: number;
  /** Directional light color */
  sunColor: THREE.Color;
  /** Directional light intensity */
  sunIntensity: number;
  /** Fog color */
  fogColor: THREE.Color;
  /** Sky color (zenith) */
  skyColor: THREE.Color;
  /** Is it night time */
  isNight: boolean;
}

/**
 * Calculate the complete day/night state from a normalized time value.
 * @param time 0 to 1 where 0 and 1 are midnight, 0.5 is noon
 */
export function calculateDayNightState(time: number): DayNightState {
  const t = time % 1;

  // Sun arc: rises at dawn (0.2), peaks at noon (0.5), sets at dusk (0.8)
  const sunAngle = (t - 0.25) * Math.PI * 2;
  const sunHeight = Math.sin(sunAngle);
  const sunX = Math.cos(sunAngle) * 100;
  const sunY = Math.max(sunHeight * 100, -20);
  const sunPosition = new THREE.Vector3(sunX, sunY, -50);

  const isNight = t < DAY_NIGHT.DAWN || t > DAY_NIGHT.NIGHT;
  const isDusk = t >= DAY_NIGHT.DUSK && t <= DAY_NIGHT.NIGHT;
  const isDawn = t >= DAY_NIGHT.DAWN && t <= DAY_NIGHT.DAY;

  // Ambient light
  let ambientIntensity: number;
  let ambientColor: THREE.Color;
  let sunIntensity: number;
  let sunColor: THREE.Color;
  let fogColor: THREE.Color;
  let skyColor: THREE.Color;

  if (isNight) {
    // Night
    ambientIntensity = 0.1;
    ambientColor = new THREE.Color('#0a0a2e');
    sunIntensity = 0;
    sunColor = new THREE.Color('#000000');
    fogColor = new THREE.Color('#050510');
    skyColor = new THREE.Color('#020208');
  } else if (isDawn) {
    // Dawn transition
    const f = mapRange(t, DAY_NIGHT.DAWN, DAY_NIGHT.DAY, 0, 1);
    ambientIntensity = lerp(0.1, 0.6, f);
    ambientColor = new THREE.Color('#0a0a2e').lerp(new THREE.Color('#ffeedd'), f);
    sunIntensity = lerp(0, 1.5, f);
    sunColor = new THREE.Color('#ff6633').lerp(new THREE.Color('#ffffee'), f);
    fogColor = new THREE.Color('#050510').lerp(new THREE.Color('#aabbcc'), f);
    skyColor = new THREE.Color('#1a0a2e').lerp(new THREE.Color('#5588cc'), f);
  } else if (isDusk) {
    // Dusk transition
    const f = mapRange(t, DAY_NIGHT.DUSK, DAY_NIGHT.NIGHT, 0, 1);
    ambientIntensity = lerp(0.6, 0.1, f);
    ambientColor = new THREE.Color('#ffeedd').lerp(new THREE.Color('#0a0a2e'), f);
    sunIntensity = lerp(1.5, 0, f);
    sunColor = new THREE.Color('#ffffee').lerp(new THREE.Color('#ff4411'), f);
    fogColor = new THREE.Color('#aabbcc').lerp(new THREE.Color('#050510'), f);
    skyColor = new THREE.Color('#5588cc').lerp(new THREE.Color('#1a0a2e'), f);
  } else {
    // Daytime
    ambientIntensity = 0.6;
    ambientColor = new THREE.Color('#ffeedd');
    sunIntensity = 1.5;
    sunColor = new THREE.Color('#ffffee');
    fogColor = new THREE.Color('#aabbcc');
    skyColor = new THREE.Color('#5588cc');
  }

  return {
    time: t,
    sunPosition,
    ambientColor,
    ambientIntensity,
    sunColor,
    sunIntensity,
    fogColor,
    skyColor,
    isNight,
  };
}
