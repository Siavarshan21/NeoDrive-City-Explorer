'use client';

/**
 * Vehicle - 3D vehicle entity rendered as placeholder box shapes.
 * Manages vehicle driving when occupied by the player.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { inputManager } from '@/game/engine/InputManager';
import { VehicleController } from './VehicleController';
import { vehicleConfigs } from './vehicleConfig';
import { KEYS } from '@/game/utils/constants';
import type { VehicleEntity } from '@/game/types/entity';

interface VehicleMeshProps {
  vehicle: VehicleEntity;
}

/** Renders a single vehicle with placeholder geometry */
function VehicleMesh({ vehicle }: VehicleMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const isInVehicle = useGameStore((s) => s.isInVehicle);
  const currentVehicleId = useGameStore((s) => s.currentVehicleId);
  const exitVehicle = useGameStore((s) => s.exitVehicle);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const isPaused = useUIStore((s) => s.isPaused);

  const config = vehicleConfigs[vehicle.type];
  const isCurrentVehicle = currentVehicleId === vehicle.id;

  // Create controller only for the active vehicle
  const controllerRef = useRef<VehicleController | null>(null);

  if (isCurrentVehicle && !controllerRef.current) {
    controllerRef.current = new VehicleController(config, vehicle.position, vehicle.rotation.y);
  } else if (!isCurrentVehicle) {
    controllerRef.current = null;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (isCurrentVehicle && isInVehicle && controllerRef.current && !isPaused) {
      const { position, rotation, speed } = controllerRef.current.update(delta);
      meshRef.current.position.copy(position);
      meshRef.current.rotation.y = rotation;
      setPlayerPosition(position);

      // Exit vehicle with F key
      if (inputManager.isKeyDown(KEYS.VEHICLE_ENTER)) {
        exitVehicle();
        controllerRef.current = null;
      }
    } else {
      // Parked vehicle - static position
      meshRef.current.position.copy(vehicle.position);
      meshRef.current.rotation.copy(vehicle.rotation);
    }
  });

  return (
    <group ref={meshRef} position={[vehicle.position.x, vehicle.position.y, vehicle.position.z]}>
      {/* Vehicle body */}
      <mesh castShadow receiveShadow position={[0, config.size.height / 2, 0]}>
        <boxGeometry args={[config.size.width, config.size.height, config.size.length]} />
        <meshStandardMaterial
          color={vehicle.color || config.color}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Vehicle cabin (top part) */}
      <mesh castShadow position={[0, config.size.height * 0.9, -config.size.length * 0.05]}>
        <boxGeometry
          args={[
            config.size.width * 0.85,
            config.size.height * 0.5,
            config.size.length * 0.5,
          ]}
        />
        <meshStandardMaterial color={vehicle.color || config.color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Wheels (4 corners) */}
      {[
        [-config.size.width / 2, 0.3, config.size.length * 0.3],
        [config.size.width / 2, 0.3, config.size.length * 0.3],
        [-config.size.width / 2, 0.3, -config.size.length * 0.3],
        [config.size.width / 2, 0.3, -config.size.length * 0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

/** Renders all vehicles in the scene */
export function VehicleManager() {
  const vehicles = useGameStore((s) => s.vehicles);

  return (
    <group>
      {vehicles.map((vehicle) => (
        <VehicleMesh key={vehicle.id} vehicle={vehicle} />
      ))}
    </group>
  );
}
