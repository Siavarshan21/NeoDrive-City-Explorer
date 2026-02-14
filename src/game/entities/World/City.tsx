'use client';

/**
 * City - Root world component that composes all world elements:
 * ground plane, roads, buildings, and props.
 */

import { WORLD } from '@/game/utils/constants';
import { Roads } from './Roads';
import { Buildings } from './Buildings';
import { Props } from './Props';

/** Ground plane beneath the city */
function Ground() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[WORLD.CITY_SIZE * 2, WORLD.CITY_SIZE * 2]} />
      <meshStandardMaterial color="#1a1a2e" roughness={1} />
    </mesh>
  );
}

/** Complete city scene */
export function City() {
  return (
    <group>
      <Ground />
      <Roads />
      <Buildings />
      <Props />
    </group>
  );
}
