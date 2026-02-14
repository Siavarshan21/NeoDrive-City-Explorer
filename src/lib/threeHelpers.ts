/**
 * Three.js helpers - Utility functions for common Three.js operations.
 * Includes geometry generation, material creation, and debug helpers.
 */

import * as THREE from 'three';

/** Create a wireframe box for debug visualization */
export function createDebugBox(
  min: THREE.Vector3,
  max: THREE.Vector3,
  color: string = '#ff0000'
): THREE.LineSegments {
  const size = new THREE.Vector3().subVectors(max, min);
  const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);

  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color });
  const wireframe = new THREE.LineSegments(edges, material);
  wireframe.position.copy(center);

  return wireframe;
}

/** Create a simple grid helper for the ground plane */
export function createGroundGrid(
  size: number = 200,
  divisions: number = 40,
  color1: string = '#333344',
  color2: string = '#222233'
): THREE.GridHelper {
  return new THREE.GridHelper(size, divisions, color1, color2);
}

/** Dispose of a Three.js object and its children */
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material?.dispose();
      }
    }
  });
}

/** Create a flat colored plane */
export function createPlane(
  width: number,
  height: number,
  color: string
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}

/** Smoothly interpolate a vector toward a target */
export function lerpVector3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  alpha: number
): THREE.Vector3 {
  return current.clone().lerp(target, alpha);
}
