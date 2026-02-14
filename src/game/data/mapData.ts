/**
 * Map Data - Static data for building positions, prop placements,
 * and other world geometry. Defines the city layout.
 */

import type { PropType } from '@/game/types/entity';
import { WORLD } from '@/game/utils/constants';

export interface BuildingData {
  id: string;
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}

export interface PropData {
  id: string;
  type: PropType;
  position: [number, number, number];
}

const BUILDING_COLORS = [
  '#2a2a4a', '#3a3a5a', '#4a3a4a', '#2a3a5a',
  '#3a4a5a', '#4a4a5a', '#2a2a3a', '#3a2a4a',
];

/** Procedurally generate building data for city blocks */
function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const halfCity = WORLD.CITY_SIZE / 2;
  const blockSpacing = WORLD.BLOCK_SIZE + WORLD.ROAD_WIDTH;
  let id = 0;

  for (let bx = -halfCity + WORLD.ROAD_WIDTH; bx < halfCity; bx += blockSpacing) {
    for (let bz = -halfCity + WORLD.ROAD_WIDTH; bz < halfCity; bz += blockSpacing) {
      // Place 2-4 buildings per block
      const buildingsPerBlock = 2 + Math.floor(Math.abs(Math.sin(bx * 0.1 + bz * 0.2)) * 3);

      for (let i = 0; i < buildingsPerBlock; i++) {
        const width = 5 + Math.abs(Math.sin(id * 1.7)) * 12;
        const depth = 5 + Math.abs(Math.cos(id * 2.3)) * 12;
        const height = 8 + Math.abs(Math.sin(id * 0.8 + bx)) * 40;

        // Offset within the block
        const offsetX = (Math.sin(id * 3.1) * WORLD.BLOCK_SIZE * 0.3);
        const offsetZ = (Math.cos(id * 2.7) * WORLD.BLOCK_SIZE * 0.3);

        const color = BUILDING_COLORS[id % BUILDING_COLORS.length];

        buildings.push({
          id: `building-${id}`,
          position: [bx + offsetX, 0, bz + offsetZ],
          width,
          height,
          depth,
          color,
        });
        id++;
      }
    }
  }

  return buildings;
}

/** Generate street props along roads */
function generateProps(): PropData[] {
  const props: PropData[] = [];
  const halfCity = WORLD.CITY_SIZE / 2;
  const blockSpacing = WORLD.BLOCK_SIZE + WORLD.ROAD_WIDTH;
  let id = 0;

  // Street lights along roads
  for (let x = -halfCity; x <= halfCity; x += blockSpacing) {
    for (let z = -halfCity; z <= halfCity; z += 20) {
      props.push({
        id: `prop-light-${id++}`,
        type: 'streetlight',
        position: [x + WORLD.ROAD_WIDTH / 2 + 1, 0, z],
      });
    }
  }

  // Trees in some blocks
  for (let x = -halfCity + 15; x < halfCity; x += blockSpacing) {
    for (let z = -halfCity + 15; z < halfCity; z += blockSpacing) {
      props.push({
        id: `prop-tree-${id++}`,
        type: 'tree',
        position: [x + 5, 0, z + 5],
      });
      props.push({
        id: `prop-tree-${id++}`,
        type: 'tree',
        position: [x - 3, 0, z - 2],
      });
    }
  }

  // Benches along sidewalks
  for (let x = -halfCity + 25; x < halfCity; x += blockSpacing * 2) {
    for (let z = -halfCity + 10; z < halfCity; z += blockSpacing * 2) {
      props.push({
        id: `prop-bench-${id++}`,
        type: 'bench',
        position: [x, 0, z],
      });
    }
  }

  return props;
}

/** Pre-generated building data */
export const mapBuildings = generateBuildings();

/** Pre-generated prop data */
export const mapProps = generateProps();
