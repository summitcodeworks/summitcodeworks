'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

type VehicleProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  headlightColor?: string;
  direction?: [number, number, number];
  speed?: number;
  type?: string;
};

// Define road lanes to keep vehicles organized
export const LANES = [
  { x: -20, direction: [0, 0, 1] as [number, number, number] },
  { x: -10, direction: [0, 0, 1] as [number, number, number] },
  { x: 0, direction: [0, 0, -1] as [number, number, number] },
  { x: 10, direction: [0, 0, -1] as [number, number, number] },
  { x: 20, direction: [0, 0, 1] as [number, number, number] }
];

// Flying vehicle paths at different heights
export const FLIGHT_PATHS = [
  { y: 15, direction: [0, 0, 1] as [number, number, number] },
  { y: 25, direction: [0, 0, -1] as [number, number, number] },
  { y: 35, direction: [0, 0, 1] as [number, number, number] },
  { y: 45, direction: [0, 0, -1] as [number, number, number] }
];

export function Vehicle({ 
  position, 
  color = '#6a6a8a',
  headlightColor = '#ffff99',
  direction = [0, 0, 1],
  speed = 0.5,
  type = 'car',
  scale = 1
}: VehicleProps) {
  const vehicleRef = useRef<THREE.Group>(null);
  const [initialPosition] = useState(new THREE.Vector3(...position));
  const directionVector = useRef(new THREE.Vector3(...direction));
  const [vehicleLane, setVehicleLane] = useState<number | null>(null);
  const [vehicleFlightPath, setVehicleFlightPath] = useState<number | null>(null);
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const [isAvoiding, setIsAvoiding] = useState(false);
  const [vehicleSpeed, setVehicleSpeed] = useState(speed);
  const { scene } = useThree();
  
  // Set up vehicle lane or flight path on mount
  useEffect(() => {
    if (type === 'flying') {
      // Find closest flight path
      let closestPathIndex = 0;
      let minDistance = Math.abs(position[1] - FLIGHT_PATHS[0].y);
      
      for (let i = 1; i < FLIGHT_PATHS.length; i++) {
        const distance = Math.abs(position[1] - FLIGHT_PATHS[i].y);
        if (distance < minDistance) {
          minDistance = distance;
          closestPathIndex = i;
        }
      }
      
      setVehicleFlightPath(closestPathIndex);
      const flightDirection = FLIGHT_PATHS[closestPathIndex].direction;
      directionVector.current.set(flightDirection[0], flightDirection[1], flightDirection[2]);
      
      // Adjust y position to match flight path
      if (vehicleRef.current) {
        vehicleRef.current.position.y = FLIGHT_PATHS[closestPathIndex].y;
      }
    } else {
      // Find closest lane
      let closestLaneIndex = 0;
      let minDistance = Math.abs(position[0] - LANES[0].x);
      
      for (let i = 1; i < LANES.length; i++) {
        const distance = Math.abs(position[0] - LANES[i].x);
        if (distance < minDistance) {
          minDistance = distance;
          closestLaneIndex = i;
        }
      }
      
      setVehicleLane(closestLaneIndex);
      const laneDirection = LANES[closestLaneIndex].direction;
      directionVector.current.set(laneDirection[0], laneDirection[1], laneDirection[2]);
      
      // Adjust x position to match lane
      if (vehicleRef.current) {
        vehicleRef.current.position.x = LANES[closestLaneIndex].x;
      }
    }
  }, [position, type]);
  
  // Check for potential collisions
  const checkCollisions = (currentPosition: THREE.Vector3, moveDirection: THREE.Vector3, moveDistance: number) => {
    if (!vehicleRef.current || type === 'flying') return false;
    
    // Create a raycaster to detect obstacles ahead
    const raycaster = new THREE.Raycaster();
    const rayDirection = moveDirection.clone().normalize();
    
    // Position the ray at the front of the vehicle
    const rayOrigin = currentPosition.clone().add(
      rayDirection.clone().multiplyScalar(2) // Start from the front of the vehicle
    );
    
    // Set the ray direction
    raycaster.set(rayOrigin, rayDirection);
    
    // Get all objects in the scene
    const allObjects = scene.children.filter(child => {
      // Filter out the current vehicle and non-mesh objects
      return child !== vehicleRef.current && 
             child.type === 'Group' && 
             child.userData.type !== 'vehicle';
    });
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(allObjects, true);
    
    // If there's an intersection within a certain distance, return true
    const collisionDetectionDistance = 10 + moveDistance * 5; // Adjust based on speed
    return intersects.length > 0 && intersects[0].distance < collisionDetectionDistance;
  };
  
  // Animate vehicle movement
  useFrame((_, delta) => {
    if (!vehicleRef.current) return;
    
    const currentPos = vehicleRef.current.position.clone();
    let moveDirection = directionVector.current.clone();
    let moveDistance = vehicleSpeed * delta * 10; // Multiply by 10 to make movement more visible
    
    // Check for collisions (only for ground vehicles)
    if (type !== 'flying' && checkCollisions(currentPos, moveDirection, moveDistance)) {
      if (!isAvoiding) {
        // Start avoidance maneuver
        setIsAvoiding(true);
        
        // Slow down
        setVehicleSpeed(speed * 0.3);
        
        // Try to change lanes if possible
        if (vehicleLane !== null) {
          const currentLane = vehicleLane;
          const newLane = (currentLane + 1) % LANES.length;
          
          // Set target position in the new lane
          const targetPos = new THREE.Vector3(
            LANES[newLane].x,
            currentPos.y,
            currentPos.z + (Math.random() > 0.5 ? 10 : -10) // Move forward or backward a bit
          );
          
          setTargetPosition(targetPos);
          setVehicleLane(newLane);
          
          // Update direction based on new lane
          const newDirection = LANES[newLane].direction;
          directionVector.current.set(newDirection[0], newDirection[1], newDirection[2]);
        }
      }
    } else if (isAvoiding && targetPosition) {
      // Continue avoidance maneuver
      const toTarget = targetPosition.clone().sub(currentPos);
      
      if (toTarget.length() < 1) {
        // Reached target, resume normal driving
        setIsAvoiding(false);
        setTargetPosition(null);
        setVehicleSpeed(speed);
      } else {
        // Move toward target
        moveDirection = toTarget.normalize();
        moveDistance = vehicleSpeed * delta * 5; // Slower during avoidance
      }
    } else if (isAvoiding) {
      // No target but still avoiding, resume normal driving
      setIsAvoiding(false);
      setVehicleSpeed(speed);
    }
    
    // Move vehicle
    vehicleRef.current.position.add(moveDirection.multiplyScalar(moveDistance));
    
    // Set rotation based on direction
    if (moveDirection.z !== 0 || moveDirection.x !== 0) {
      vehicleRef.current.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
    }
    
    // Reset position when vehicle goes too far
    const distanceFromStart = currentPos.distanceTo(initialPosition);
    if (distanceFromStart > 200) {
      // Reset to initial position but keep in the current lane
      if (type === 'flying' && vehicleFlightPath !== null) {
        vehicleRef.current.position.set(
          initialPosition.x,
          FLIGHT_PATHS[vehicleFlightPath].y,
          initialPosition.z
        );
      } else if (vehicleLane !== null) {
        vehicleRef.current.position.set(
          LANES[vehicleLane].x,
          initialPosition.y,
          initialPosition.z
        );
      } else {
        vehicleRef.current.position.copy(initialPosition);
      }
    }
    
    // Add hover effect for flying vehicles
    if (type === 'flying') {
      const time = performance.now() * 0.001;
      vehicleRef.current.position.y += Math.sin(time * 2) * 0.02;
      vehicleRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }
    
    // Animate lights
    const headlights = [vehicleRef.current.children[2], vehicleRef.current.children[3]];
    headlights.forEach(light => {
      if (light && light.type === 'Mesh') {
        const material = (light as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (material) {
          // Create a pulsing effect
          const time = performance.now() * 0.001;
          const pulseIntensity = 1 + Math.sin(time * 3) * 0.2;
          material.emissiveIntensity = 2 * pulseIntensity;
        }
      }
    });
  });
  
  // Determine vehicle color based on type
  const vehicleColor = type === 'police' 
    ? '#3a5a9a' 
    : type === 'flying' 
      ? '#5a8ac2' 
      : color;
  
  // Determine headlight color based on type
  const lightColor = type === 'police' 
    ? '#ff0000' 
    : type === 'flying' 
      ? '#00ffff' 
      : headlightColor;
  
  return (
    <group 
      ref={vehicleRef} 
      position={position} 
      userData={{ type: 'vehicle' }}
      scale={[scale, scale, scale]}
    >
      {/* Vehicle body */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color={vehicleColor} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 2]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.1} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[0.5, 0, 2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={new THREE.Color(lightColor)}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      <mesh position={[-0.5, 0, 2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={new THREE.Color(lightColor)}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.5, 0, -2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial 
          color="#330000" 
          emissive="#ff0000"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      
      <mesh position={[-0.5, 0, -2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial 
          color="#330000" 
          emissive="#ff0000"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      
      {/* Police lights if applicable */}
      {type === 'police' && (
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.8, 0.2, 0.4]} />
          <meshStandardMaterial 
            color="#222222" 
            emissive="#0000ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      )}
      
      {/* Flying vehicle engines if applicable */}
      {type === 'flying' && (
        <>
          <group position={[1.1, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
              <meshStandardMaterial 
                color="#444444" 
                emissive="#00ffff"
                emissiveIntensity={1.5}
                toneMapped={false}
              />
            </mesh>
          </group>
          
          <group position={[-1.1, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
              <meshStandardMaterial 
                color="#444444" 
                emissive="#00ffff"
                emissiveIntensity={1.5}
                toneMapped={false}
              />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
} 