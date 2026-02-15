'use client';

/**
 * Vehicle - 3D vehicle entity using real GLB models.
 * Falls back to placeholder geometry if model fails to load.
 */

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { inputManager } from '@/game/engine/InputManager';
import { VehicleController } from './VehicleController';
import { vehicleConfigs } from './vehicleConfig';
import { KEYS } from '@/game/utils/constants';
import type { VehicleEntity } from '@/game/types/entity';

/** Model paths for each vehicle type */
const VEHICLE_MODELS: Record<string, { path: string; scale: number; yOffset: number }> = {
  sedan: { path: '/assets/models/sedan.glb', scale: 0.8, yOffset: 0 },
  sports: { path: '/assets/models/sports_car.glb', scale: 2.5, yOffset: 0.5 },
  truck: { path: '/assets/models/sedan.glb', scale: 1.1, yOffset: 0 },
  suv: { path: '/assets/models/sedan.glb', scale: 1.0, yOffset: 0 },
};

// Preload models
useGLTF.preload('/assets/models/sedan.glb');
useGLTF.preload('/assets/models/sports_car.glb');

/** Loaded 3D model for a vehicle */
function VehicleModel({ type, color }: { type: string; color: string }) {
  const modelInfo = VEHICLE_MODELS[type] || VEHICLE_MODELS.sedan;
  const { scene } = useGLTF(modelInfo.path);
  const clonedScene = scene.clone();

  // Apply custom color to all meshes
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <primitive
      object={clonedScene}
      scale={modelInfo.scale}
      position={[0, modelInfo.yOffset, 0]}
    />
  );
}

/** Placeholder box vehicle (fallback) */
function PlaceholderVehicle({ config, color }: { config: typeof vehicleConfigs.sedan; color: string }) {
  return (
    <>
      <mesh castShadow receiveShadow position={[0, config.size.height / 2, 0]}>
        <boxGeometry args={[config.size.width, config.size.height, config.size.length]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, config.size.height * 0.9, -config.size.length * 0.05]}>
        <boxGeometry args={[config.size.width * 0.85, config.size.height * 0.5, config.size.length * 0.5]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
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
    </>
  );
}

interface VehicleMeshProps {
  vehicle: VehicleEntity;
}

/** Renders a single vehicle with real 3D model */
function VehicleMesh({ vehicle }: VehicleMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const isInVehicle = useGameStore((s) => s.isInVehicle);
  const currentVehicleId = useGameStore((s) => s.currentVehicleId);
  const exitVehicle = useGameStore((s) => s.exitVehicle);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const isPaused = useUIStore((s) => s.isPaused);

  const config = vehicleConfigs[vehicle.type];
  const isCurrentVehicle = currentVehicleId === vehicle.id;

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

      if (inputManager.isKeyDown(KEYS.VEHICLE_ENTER)) {
        exitVehicle();
        controllerRef.current = null;
      }
    } else {
      meshRef.current.position.copy(vehicle.position);
      meshRef.current.rotation.copy(vehicle.rotation);
    }
  });

  return (
    <group ref={meshRef} position={[vehicle.position.x, vehicle.position.y, vehicle.position.z]}>
      <Suspense fallback={<PlaceholderVehicle config={config} color={vehicle.color || config.color} />}>
        <VehicleModel type={vehicle.type} color={vehicle.color || config.color} />
      </Suspense>
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
