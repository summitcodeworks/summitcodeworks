'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type PedestrianProps = {
  position: [number, number, number];
  color?: string;
  speed?: number;
  walkingArea?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
};

// Define sidewalk paths
const SIDEWALKS = [
  { x: -25, direction: [0, 0, 1] as [number, number, number] },
  { x: -5, direction: [0, 0, 1] as [number, number, number] },
  { x: 5, direction: [0, 0, -1] as [number, number, number] },
  { x: 25, direction: [0, 0, -1] as [number, number, number] }
];

export function Pedestrian({ 
  position, 
  color = '#ffffff',
  speed = 0.2,
  walkingArea = { minX: -30, maxX: 30, minZ: -100, maxZ: 100 }
}: PedestrianProps) {
  const pedestrianRef = useRef<THREE.Group>(null);
  const [initialPosition] = useState(new THREE.Vector3(...position));
  const directionVector = useRef(new THREE.Vector3(0, 0, 1));
  const [sidewalkIndex, setSidewalkIndex] = useState<number | null>(null);
  const [pedestrianSpeed, setPedestrianSpeed] = useState(speed);
  const [walkCycle, setWalkCycle] = useState(0);
  
  // Random color for clothing
  const clothingColor = useMemo(() => {
    const colors = ['#ff3366', '#3366ff', '#66ff33', '#ffcc33', '#cc33ff', '#33ccff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  
  // Set up pedestrian sidewalk on mount
  useEffect(() => {
    // Find closest sidewalk
    let closestSidewalkIndex = 0;
    let minDistance = Math.abs(position[0] - SIDEWALKS[0].x);
    
    for (let i = 1; i < SIDEWALKS.length; i++) {
      const distance = Math.abs(position[0] - SIDEWALKS[i].x);
      if (distance < minDistance) {
        minDistance = distance;
        closestSidewalkIndex = i;
      }
    }
    
    setSidewalkIndex(closestSidewalkIndex);
    const sidewalkDirection = SIDEWALKS[closestSidewalkIndex].direction;
    directionVector.current.set(sidewalkDirection[0], sidewalkDirection[1], sidewalkDirection[2]);
    
    // Adjust x position to match sidewalk
    if (pedestrianRef.current) {
      pedestrianRef.current.position.x = SIDEWALKS[closestSidewalkIndex].x;
    }
  }, [position]);
  
  // Animate pedestrian movement
  useFrame((_, delta) => {
    if (!pedestrianRef.current) return;
    
    const currentPos = pedestrianRef.current.position.clone();
    let moveDirection = directionVector.current.clone();
    const moveDistance = pedestrianSpeed * delta * 5; // Adjust speed
    
    // Occasionally change direction or pause
    if (Math.random() < 0.005) {
      if (Math.random() < 0.7) {
        // Change direction
        const newDirection = [
          (Math.random() - 0.5) * 0.5,
          0,
          (Math.random() - 0.5) * 2
        ] as [number, number, number];
        directionVector.current.set(newDirection[0], newDirection[1], newDirection[2]);
        directionVector.current.normalize();
      } else {
        // Pause briefly
        setPedestrianSpeed(0);
        setTimeout(() => {
          setPedestrianSpeed(speed);
        }, 1000 + Math.random() * 2000);
      }
    }
    
    // Check if pedestrian is going out of bounds
    const nextPos = currentPos.clone().add(moveDirection.clone().multiplyScalar(moveDistance));
    if (
      nextPos.x < walkingArea.minX || 
      nextPos.x > walkingArea.maxX || 
      nextPos.z < walkingArea.minZ || 
      nextPos.z > walkingArea.maxZ
    ) {
      // Turn around
      directionVector.current.multiplyScalar(-1);
      moveDirection = directionVector.current.clone();
    }
    
    // Move pedestrian
    pedestrianRef.current.position.add(moveDirection.multiplyScalar(moveDistance));
    
    // Set rotation based on direction
    if (moveDirection.z !== 0 || moveDirection.x !== 0) {
      pedestrianRef.current.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
    }
    
    // Reset position when pedestrian goes too far
    const distanceFromStart = currentPos.distanceTo(initialPosition);
    if (distanceFromStart > 100) {
      // Reset to initial position but keep in the current sidewalk
      if (sidewalkIndex !== null) {
        pedestrianRef.current.position.set(
          SIDEWALKS[sidewalkIndex].x,
          initialPosition.y,
          initialPosition.z
        );
      } else {
        pedestrianRef.current.position.copy(initialPosition);
      }
    }
    
    // Animate walking cycle
    setWalkCycle(prev => prev + delta * 5 * pedestrianSpeed);
    
    // Animate legs
    const leftLeg = pedestrianRef.current.children[2] as THREE.Mesh;
    const rightLeg = pedestrianRef.current.children[3] as THREE.Mesh;
    
    if (leftLeg && rightLeg && pedestrianSpeed > 0) {
      leftLeg.rotation.x = Math.sin(walkCycle) * 0.4;
      rightLeg.rotation.x = Math.sin(walkCycle + Math.PI) * 0.4;
    }
    
    // Animate arms
    const leftArm = pedestrianRef.current.children[4] as THREE.Mesh;
    const rightArm = pedestrianRef.current.children[5] as THREE.Mesh;
    
    if (leftArm && rightArm && pedestrianSpeed > 0) {
      leftArm.rotation.x = Math.sin(walkCycle + Math.PI) * 0.3;
      rightArm.rotation.x = Math.sin(walkCycle) * 0.3;
    }
  });
  
  return (
    <group 
      ref={pedestrianRef} 
      position={position} 
      userData={{ type: 'pedestrian' }}
      scale={[0.4, 0.4, 0.4]}
    >
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.15, 1.0, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.15, 1.0, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
      
      <mesh position={[-0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
    </group>
  );
}

export function PedestrianGroup({ count = 20, walkingArea = { minX: -30, maxX: 30, minZ: -100, maxZ: 100 } }) {
  // Generate random pedestrians
  const pedestrians = useMemo(() => {
    const peds = [];
    
    for (let i = 0; i < count; i++) {
      // Choose a random sidewalk
      const sidewalkIndex = Math.floor(Math.random() * SIDEWALKS.length);
      const sidewalk = SIDEWALKS[sidewalkIndex];
      
      // Random position along the sidewalk
      const z = walkingArea.minZ + Math.random() * (walkingArea.maxZ - walkingArea.minZ);
      
      // Random skin tone
      const skinTones = [
        '#f5d0b9', // light
        '#e0b152', // medium
        '#b07840', // tan
        '#70461e', // brown
        '#4a2c13'  // dark
      ];
      const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
      
      // Random speed
      const speed = 0.1 + Math.random() * 0.2;
      
      peds.push({
        position: [sidewalk.x, 0, z] as [number, number, number],
        color: skinTone,
        speed,
        key: `pedestrian-${i}`
      });
    }
    
    return peds;
  }, [count, walkingArea]);
  
  return (
    <group>
      {pedestrians.map((ped) => (
        <Pedestrian 
          key={ped.key}
          position={ped.position}
          color={ped.color}
          speed={ped.speed}
          walkingArea={walkingArea}
        />
      ))}
    </group>
  );
} 