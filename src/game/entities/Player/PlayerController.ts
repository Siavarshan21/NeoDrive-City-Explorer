/**
 * PlayerController - Handles first-person player movement and rotation.
 * Reads input from InputManager, applies movement with collision detection,
 * and updates the game store with the new position/rotation.
 */

import * as THREE from 'three';
import { inputManager } from '@/game/engine/InputManager';
import { collisionSystem } from '@/game/engine/CollisionSystem';
import { KEYS, PLAYER } from '@/game/utils/constants';
import { clamp } from '@/game/utils/math';

export class PlayerController {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  private yaw = 0;
  private pitch = 0;
  private velocity = new THREE.Vector3();

  constructor(startPosition?: THREE.Vector3) {
    this.position = startPosition?.clone() ?? new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
  }

  /** Update player position and rotation each frame */
  update(deltaTime: number): { position: THREE.Vector3; rotation: THREE.Euler; speed: number } {
    // Mouse look
    const mouseDelta = inputManager.getMouseDelta();
    this.yaw -= mouseDelta.x * PLAYER.MOUSE_SENSITIVITY;
    this.pitch -= mouseDelta.y * PLAYER.MOUSE_SENSITIVITY;
    this.pitch = clamp(this.pitch, -Math.PI / 2.2, Math.PI / 2.2);

    this.rotation.set(this.pitch, this.yaw, 0, 'YXZ');

    // Movement direction
    const isRunning = inputManager.isKeyDown(KEYS.SPRINT);
    const speed = isRunning ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyEuler(new THREE.Euler(0, this.yaw, 0));
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(new THREE.Euler(0, this.yaw, 0));

    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (inputManager.isKeyDown(KEYS.FORWARD)) moveDirection.add(forward);
    if (inputManager.isKeyDown(KEYS.BACKWARD)) moveDirection.sub(forward);
    if (inputManager.isKeyDown(KEYS.RIGHT)) moveDirection.add(right);
    if (inputManager.isKeyDown(KEYS.LEFT)) moveDirection.sub(right);

    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();
    }

    // Apply movement
    this.velocity.copy(moveDirection).multiplyScalar(speed * deltaTime);
    const desiredPos = this.position.clone().add(this.velocity);

    // Collision resolution
    const resolvedPos = collisionSystem.resolveMovement(
      this.position,
      desiredPos,
      PLAYER.RADIUS,
      'player'
    );

    // Keep player on ground
    resolvedPos.y = 0;

    this.position.copy(resolvedPos);

    const currentSpeed = this.velocity.length() / deltaTime;

    return {
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      speed: currentSpeed,
    };
  }

  /** Teleport player to a position */
  setPosition(pos: THREE.Vector3) {
    this.position.copy(pos);
  }
}
