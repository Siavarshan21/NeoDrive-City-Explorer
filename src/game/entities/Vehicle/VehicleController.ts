/**
 * VehicleController - Handles vehicle driving physics and input.
 * Reads keyboard input, applies acceleration/braking/steering,
 * and updates the vehicle's position and rotation.
 */

import * as THREE from 'three';
import { inputManager } from '@/game/engine/InputManager';
import { collisionSystem } from '@/game/engine/CollisionSystem';
import { KEYS, VEHICLE } from '@/game/utils/constants';
import { clamp } from '@/game/utils/math';
import type { VehicleConfig } from './vehicleConfig';

export class VehicleController {
  position: THREE.Vector3;
  rotation: number; // Y-axis rotation in radians
  speed: number = 0;
  private config: VehicleConfig;

  constructor(config: VehicleConfig, startPosition: THREE.Vector3, startRotation: number = 0) {
    this.config = config;
    this.position = startPosition.clone();
    this.rotation = startRotation;
  }

  /** Update vehicle physics each frame. Returns current speed for UI. */
  update(deltaTime: number): { position: THREE.Vector3; rotation: number; speed: number } {
    // Acceleration / braking
    if (inputManager.isKeyDown(KEYS.FORWARD)) {
      this.speed += this.config.acceleration * deltaTime;
    }
    if (inputManager.isKeyDown(KEYS.BACKWARD)) {
      this.speed -= this.config.braking * deltaTime;
    }

    // Brake (handbrake)
    if (inputManager.isKeyDown(KEYS.VEHICLE_BRAKE)) {
      this.speed *= 0.9;
      if (Math.abs(this.speed) < 0.1) this.speed = 0;
    }

    // Friction
    this.speed *= VEHICLE.FRICTION;

    // Clamp speed
    this.speed = clamp(this.speed, -this.config.maxSpeed * 0.3, this.config.maxSpeed);

    // Steering (only when moving)
    const steerFactor = Math.min(Math.abs(this.speed) * 0.05, 1);
    if (inputManager.isKeyDown(KEYS.LEFT)) {
      this.rotation += this.config.handling * steerFactor * deltaTime;
    }
    if (inputManager.isKeyDown(KEYS.RIGHT)) {
      this.rotation -= this.config.handling * steerFactor * deltaTime;
    }

    // Calculate forward movement
    const forward = new THREE.Vector3(
      Math.sin(this.rotation) * this.speed * deltaTime,
      0,
      Math.cos(this.rotation) * this.speed * deltaTime
    );

    const desiredPos = this.position.clone().add(forward);

    // Collision check
    const resolvedPos = collisionSystem.resolveMovement(
      this.position,
      desiredPos,
      this.config.size.width / 2,
      `vehicle-${this.config.type}`
    );

    // If we hit something, reduce speed
    if (!resolvedPos.equals(desiredPos)) {
      this.speed *= 0.5;
    }

    resolvedPos.y = 0;
    this.position.copy(resolvedPos);

    return {
      position: this.position.clone(),
      rotation: this.rotation,
      speed: Math.abs(this.speed),
    };
  }
}
