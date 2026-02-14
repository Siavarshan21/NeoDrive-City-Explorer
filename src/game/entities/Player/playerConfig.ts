/** Player configuration values */
export const playerConfig = {
  /** Walk speed (units/second) */
  walkSpeed: 5,
  /** Run speed (units/second) */
  runSpeed: 10,
  /** Player capsule height */
  height: 1.8,
  /** Player collision radius */
  radius: 0.4,
  /** Camera height offset from player feet */
  cameraHeight: 1.6,
  /** Maximum health points */
  maxHealth: 100,
  /** Starting health */
  startHealth: 100,
  /** Color for the placeholder player model */
  color: '#00f0ff',
} as const;
