/**
 * CollisionSystem - Simple AABB (Axis-Aligned Bounding Box) collision detection.
 * Used for player-building, vehicle-building, and NPC-building collisions.
 * Entities register their bounding boxes and queries check for overlaps.
 */

import * as THREE from 'three';
import type { CollisionBox } from '@/game/types/entity';

class CollisionSystem {
  private boxes: CollisionBox[] = [];

  /** Register a collision box */
  addBox(box: CollisionBox) {
    this.boxes.push(box);
  }

  /** Remove a collision box by entity ID */
  removeBox(entityId: string) {
    this.boxes = this.boxes.filter((b) => b.entityId !== entityId);
  }

  /** Clear all collision boxes */
  clear() {
    this.boxes = [];
  }

  /** Check if a point is inside any collision box, returns the colliding box or null */
  pointInBox(point: THREE.Vector3): CollisionBox | null {
    for (const box of this.boxes) {
      if (
        point.x >= box.min.x &&
        point.x <= box.max.x &&
        point.y >= box.min.y &&
        point.y <= box.max.y &&
        point.z >= box.min.z &&
        point.z <= box.max.z
      ) {
        return box;
      }
    }
    return null;
  }

  /** Check if a sphere overlaps any collision box (for player/vehicle collision) */
  sphereIntersectsBoxes(
    center: THREE.Vector3,
    radius: number,
    excludeEntityId?: string
  ): CollisionBox | null {
    for (const box of this.boxes) {
      if (excludeEntityId && box.entityId === excludeEntityId) continue;

      // Find closest point on the AABB to the sphere center
      const closestX = Math.max(box.min.x, Math.min(center.x, box.max.x));
      const closestY = Math.max(box.min.y, Math.min(center.y, box.max.y));
      const closestZ = Math.max(box.min.z, Math.min(center.z, box.max.z));

      const distSq =
        (center.x - closestX) ** 2 +
        (center.y - closestY) ** 2 +
        (center.z - closestZ) ** 2;

      if (distSq < radius * radius) {
        return box;
      }
    }
    return null;
  }

  /**
   * Attempt to move an entity from `currentPos` to `desiredPos` with collision response.
   * Returns the adjusted position that avoids penetration.
   */
  resolveMovement(
    currentPos: THREE.Vector3,
    desiredPos: THREE.Vector3,
    radius: number,
    excludeEntityId?: string
  ): THREE.Vector3 {
    const result = desiredPos.clone();

    // Try X movement
    const testX = new THREE.Vector3(desiredPos.x, currentPos.y, currentPos.z);
    if (this.sphereIntersectsBoxes(testX, radius, excludeEntityId)) {
      result.x = currentPos.x;
    }

    // Try Z movement
    const testZ = new THREE.Vector3(result.x, currentPos.y, desiredPos.z);
    if (this.sphereIntersectsBoxes(testZ, radius, excludeEntityId)) {
      result.z = currentPos.z;
    }

    return result;
  }

  /** Get all registered collision boxes (for debug visualization) */
  getBoxes(): readonly CollisionBox[] {
    return this.boxes;
  }
}

/** Singleton collision system */
export const collisionSystem = new CollisionSystem();
