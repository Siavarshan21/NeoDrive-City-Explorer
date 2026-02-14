/**
 * PhysicsWorld - Optional cannon-es physics integration.
 * Provides a thin wrapper around cannon-es World for vehicle physics,
 * rigid body dynamics, and raycasting.
 *
 * Currently uses simplified custom physics.
 * To enable cannon-es, uncomment the cannon-es integration below.
 */

import * as THREE from 'three';

/** Simplified physics body for vehicle simulation */
export interface PhysicsBody {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number; // Y-axis rotation in radians
  angularVelocity: number;
  mass: number;
  friction: number;
}

class PhysicsWorld {
  private bodies: Map<string, PhysicsBody> = new Map();
  private gravity = -9.81;

  /** Create a physics body */
  createBody(id: string, mass: number, position: THREE.Vector3): PhysicsBody {
    const body: PhysicsBody = {
      id,
      position: position.clone(),
      velocity: new THREE.Vector3(0, 0, 0),
      rotation: 0,
      angularVelocity: 0,
      mass,
      friction: 0.98,
    };
    this.bodies.set(id, body);
    return body;
  }

  /** Remove a physics body */
  removeBody(id: string) {
    this.bodies.delete(id);
  }

  /** Get a physics body by ID */
  getBody(id: string): PhysicsBody | undefined {
    return this.bodies.get(id);
  }

  /** Step the physics simulation forward */
  step(deltaTime: number) {
    this.bodies.forEach((body) => {
      // Apply friction
      body.velocity.x *= body.friction;
      body.velocity.z *= body.friction;
      body.angularVelocity *= body.friction;

      // Apply gravity if above ground
      if (body.position.y > 0) {
        body.velocity.y += this.gravity * deltaTime;
      } else {
        body.position.y = 0;
        body.velocity.y = 0;
      }

      // Integrate position
      body.position.x += body.velocity.x * deltaTime;
      body.position.y += body.velocity.y * deltaTime;
      body.position.z += body.velocity.z * deltaTime;

      // Integrate rotation
      body.rotation += body.angularVelocity * deltaTime;
    });
  }

  /** Apply a force to a body in its local forward direction */
  applyForwardForce(id: string, force: number) {
    const body = this.bodies.get(id);
    if (!body) return;
    const forceX = Math.sin(body.rotation) * force / body.mass;
    const forceZ = Math.cos(body.rotation) * force / body.mass;
    body.velocity.x += forceX;
    body.velocity.z += forceZ;
  }

  /** Apply steering to a body */
  applySteering(id: string, steerAmount: number) {
    const body = this.bodies.get(id);
    if (!body) return;
    const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.z ** 2);
    body.angularVelocity += steerAmount * Math.min(speed * 0.1, 1);
  }

  /** Clear all bodies */
  clear() {
    this.bodies.clear();
  }
}

/** Singleton physics world */
export const physicsWorld = new PhysicsWorld();
