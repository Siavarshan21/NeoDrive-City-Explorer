/** Game world constants */
export const WORLD = {
  /** Size of the city grid (units) */
  CITY_SIZE: 200,
  /** Road width in units */
  ROAD_WIDTH: 10,
  /** Block size between roads */
  BLOCK_SIZE: 40,
  /** Sidewalk width */
  SIDEWALK_WIDTH: 2,
  /** Ground Y level */
  GROUND_LEVEL: 0,
} as const;

/** Player constants */
export const PLAYER = {
  WALK_SPEED: 5,
  RUN_SPEED: 10,
  HEIGHT: 1.8,
  RADIUS: 0.4,
  MAX_HEALTH: 100,
  CAMERA_HEIGHT: 1.6,
  MOUSE_SENSITIVITY: 0.002,
} as const;

/** Vehicle constants */
export const VEHICLE = {
  ENTER_DISTANCE: 3,
  MAX_SPEED_SEDAN: 30,
  MAX_SPEED_SPORTS: 50,
  ACCELERATION: 15,
  BRAKING: 25,
  HANDLING: 2.5,
  FRICTION: 0.98,
} as const;

/** NPC constants */
export const NPC = {
  WALK_SPEED: 2,
  INTERACTION_DISTANCE: 3,
  WAYPOINT_THRESHOLD: 0.5,
} as const;

/** Day/Night cycle constants */
export const DAY_NIGHT = {
  /** Full cycle duration in seconds */
  CYCLE_DURATION: 300,
  /** Dawn start (0-1 normalized time) */
  DAWN: 0.2,
  /** Day start */
  DAY: 0.3,
  /** Dusk start */
  DUSK: 0.7,
  /** Night start */
  NIGHT: 0.8,
} as const;

/** Rendering constants */
export const RENDERING = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  SHADOW_MAP_SIZE: 2048,
} as const;

/** Input key bindings */
export const KEYS = {
  FORWARD: 'KeyW',
  BACKWARD: 'KeyS',
  LEFT: 'KeyA',
  RIGHT: 'KeyD',
  SPRINT: 'ShiftLeft',
  INTERACT: 'KeyE',
  PAUSE: 'Escape',
  VEHICLE_ENTER: 'KeyF',
  VEHICLE_BRAKE: 'Space',
  QUEST_LOG: 'KeyJ',
} as const;

/** IndexedDB constants */
export const DB = {
  NAME: 'NeoCityExplorer',
  VERSION: 1,
  STORE_NAME: 'saves',
} as const;
