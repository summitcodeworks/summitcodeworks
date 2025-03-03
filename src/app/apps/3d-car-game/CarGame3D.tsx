'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sky, Text } from '@react-three/drei';
import * as THREE from 'three';
import Header from '@/app/components/Header';

// Car component using basic shapes
function Car({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  color = 'red', 
  controlsEnabled = false, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSpeedChange = (speed: number) => {},
  isAICar = false,
  aiSpeed = 0.1
}: { 
  position?: [number, number, number]; 
  rotation?: [number, number, number]; 
  color?: string; 
  controlsEnabled?: boolean;
  onSpeedChange?: (speed: number) => void;
  isAICar?: boolean;
  aiSpeed?: number;
}) {
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<(THREE.Mesh | null)[]>([]);
  const [carPosition, setCarPosition] = useState<[number, number, number]>(position as [number, number, number]);
  const [carRotation, setCarRotation] = useState<[number, number, number]>(rotation as [number, number, number]);
  const [speed, setSpeed] = useState(0);
  const [maxSpeed] = useState(0.5);
  const [acceleration] = useState(0.01);
  const [deceleration] = useState(0.005);
  const [steering] = useState(0.05);
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Handle keyboard input
  useEffect(() => {
    if (!controlsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setKeys((prev) => ({ ...prev, forward: true }));
      if (e.key === 'ArrowDown') setKeys((prev) => ({ ...prev, backward: true }));
      if (e.key === 'ArrowLeft') setKeys((prev) => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setKeys((prev) => ({ ...prev, right: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setKeys((prev) => ({ ...prev, forward: false }));
      if (e.key === 'ArrowDown') setKeys((prev) => ({ ...prev, backward: false }));
      if (e.key === 'ArrowLeft') setKeys((prev) => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setKeys((prev) => ({ ...prev, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controlsEnabled]);

  // Update car position and rotation based on input
  useFrame(() => {
    if (!carRef.current) return;
    
    // For AI cars, move them automatically
    if (isAICar) {
      // Move AI cars forward at constant speed
      const newPosition: [number, number, number] = [
        carPosition[0],
        carPosition[1],
        carPosition[2] + aiSpeed
      ];
      
      // If AI car goes too far, reset it to the back
      if (newPosition[2] > 50) {
        newPosition[2] = -50;
        // Randomize x position when respawning
        newPosition[0] = (Math.random() * 10) - 5; // Between -5 and 5
      }
      
      setCarPosition(newPosition);
      
      // Apply position to the car
      carRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
      
      // Rotate wheels
      wheelsRef.current.forEach((wheel) => {
        if (wheel) {
          wheel.rotation.x += aiSpeed * 0.5;
        }
      });
      
      // Set data attribute for speed to be used by Road component
      if (carRef.current) {
        carRef.current.userData.speed = speed;
        carRef.current.userData.position = newPosition;
      }
      
      return;
    }
    
    // Player car controls
    if (controlsEnabled) {
      // Update speed based on input
      if (keys.forward) {
        setSpeed((prev) => Math.min(prev + acceleration, maxSpeed));
      } else if (keys.backward) {
        setSpeed((prev) => Math.max(prev - acceleration, -maxSpeed / 2));
      } else {
        // Decelerate when no input
        setSpeed((prev) => {
          if (prev > 0) return Math.max(prev - deceleration, 0);
          if (prev < 0) return Math.min(prev + deceleration, 0);
          return 0;
        });
      }

      // Calculate new position and rotation
      const newRotation = [...carRotation] as [number, number, number];
      
      // Steering - Fixed the inverted controls
      if (speed !== 0) {
        if (keys.left) {
          // Left key should turn left (decrease angle when moving forward)
          newRotation[1] -= steering * (speed > 0 ? 1 : -1);
        }
        if (keys.right) {
          // Right key should turn right (increase angle when moving forward)
          newRotation[1] += steering * (speed > 0 ? 1 : -1);
        }
      }
      
      // Calculate movement direction based on rotation
      const direction = new THREE.Vector3(
        Math.sin(newRotation[1]),
        0,
        Math.cos(newRotation[1])
      );
      
      // Update position - forward is negative Z, backward is positive Z
      const newPosition: [number, number, number] = [
        carPosition[0] + direction.x * speed,
        carPosition[1],
        carPosition[2] - direction.z * speed
      ];
      
      // Boundary checks
      const boundaryLimit = 20;
      if (Math.abs(newPosition[0]) < boundaryLimit && Math.abs(newPosition[2]) < boundaryLimit) {
        setCarPosition(newPosition);
      } else {
        // Bounce off the boundary
        setSpeed((prev) => -prev * 0.5);
      }
      
      setCarRotation(newRotation);
      
      // Apply position and rotation to the car
      carRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
      carRef.current.rotation.set(newRotation[0], newRotation[1], newRotation[2]);
      
      // Rotate wheels based on speed
      wheelsRef.current.forEach((wheel) => {
        if (wheel) {
          wheel.rotation.x += speed * 0.5;
        }
      });

      // Set data attribute for speed to be used by Road component
      if (carRef.current) {
        carRef.current.userData.speed = speed;
        carRef.current.userData.position = newPosition;
      }

      // Update car speed for speedometer
      onSpeedChange(speed);
    }
  });

  return (
    <group 
      ref={carRef} 
      position={position as [number, number, number]} 
      rotation={rotation as [number, number, number]}
    >
      {/* Main car body - lower part (chassis) */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.2, 0.4, 4.5]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car body - upper part (more sporty) */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.3, 3.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car cabin - sloped design */}
      <mesh castShadow position={[0, 1.1, -0.2]}>
        <boxGeometry args={[1.8, 0.5, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Front hood - sloped */}
      <mesh castShadow position={[0, 0.7, -1.8]}>
        <boxGeometry args={[1.9, 0.15, 1]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rear spoiler */}
      <mesh castShadow position={[0, 1.3, 1.9]}>
        <boxGeometry args={[1.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Spoiler supports */}
      <mesh castShadow position={[-0.7, 1.1, 1.9]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>
      
      <mesh castShadow position={[0.7, 1.1, 1.9]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Front bumper */}
      <mesh castShadow position={[0, 0.4, -2.2]}>
        <boxGeometry args={[2, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Rear bumper */}
      <mesh castShadow position={[0, 0.4, 2.2]}>
        <boxGeometry args={[2, 0.3, 0.2]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Windshield */}
      <mesh castShadow position={[0, 1.2, -0.8]}>
        <boxGeometry args={[1.7, 0.6, 0.1]} />
        <meshStandardMaterial color="skyblue" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Rear window */}
      <mesh castShadow position={[0, 1.2, 0.8]}>
        <boxGeometry args={[1.7, 0.5, 0.1]} />
        <meshStandardMaterial color="skyblue" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Side windows */}
      <mesh castShadow position={[1, 1.2, 0]}>
        <boxGeometry args={[0.1, 0.5, 1.6]} />
        <meshStandardMaterial color="skyblue" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh castShadow position={[-1, 1.2, 0]}>
        <boxGeometry args={[0.1, 0.5, 1.6]} />
        <meshStandardMaterial color="skyblue" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Wheels - larger and more detailed */}
      <mesh 
        ref={(el) => { wheelsRef.current[0] = el; }} 
        castShadow 
        position={[-1.1, 0.4, -1.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
      </mesh>
      
      <mesh 
        ref={(el) => { wheelsRef.current[1] = el; }} 
        castShadow 
        position={[1.1, 0.4, -1.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
      </mesh>
      
      <mesh 
        ref={(el) => { wheelsRef.current[2] = el; }} 
        castShadow 
        position={[-1.1, 0.4, 1.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
      </mesh>
      
      <mesh 
        ref={(el) => { wheelsRef.current[3] = el; }} 
        castShadow 
        position={[1.1, 0.4, 1.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Wheel rims */}
      <mesh position={[-1.1, 0.4, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.31, 8]} />
        <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[1.1, 0.4, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.31, 8]} />
        <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[-1.1, 0.4, 1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.31, 8]} />
        <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[1.1, 0.4, 1.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.31, 8]} />
        <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Headlights - more detailed */}
      <mesh position={[-0.7, 0.6, -2.25]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshStandardMaterial color="white" emissive="yellow" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh position={[0.7, 0.6, -2.25]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshStandardMaterial color="white" emissive="yellow" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Taillights - more detailed */}
      <mesh position={[-0.7, 0.6, 2.25]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh position={[0.7, 0.6, 2.25]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Grille */}
      <mesh position={[0, 0.6, -2.25]} castShadow>
        <boxGeometry args={[1, 0.2, 0.1]} />
        <meshStandardMaterial color="black" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Exhaust pipes */}
      <group position={[-0.5, 0.3, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      <group position={[0.5, 0.3, 2.25]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Road component
function Road() {
  const roadRef = useRef<THREE.Group>(null);
  const [roadOffset, setRoadOffset] = useState(0);
  
  // Update road position to create scrolling effect
  useFrame(() => {
    if (!roadRef.current) return;
    
    // Use a fixed speed value for the road movement
    // This is simpler than trying to access the player car's speed
    const speed = 0.1;
    
    // Move road elements to create illusion of movement
    setRoadOffset(prev => {
      const newOffset = prev + speed;
      // Reset when offset gets too large to prevent floating point issues
      return newOffset > 100 ? 0 : newOffset;
    });
    
    // Apply the offset to road markings and other elements
    roadRef.current.position.z = roadOffset;
    
    // Ensure road is always centered on player
    const roadElements = roadRef.current.children;
    for (let i = 0; i < roadElements.length; i++) {
      const element = roadElements[i];
      
      // If this is a repeating element like a road marking
      if (element.userData.isRepeating) {
        // Check if element has moved too far behind the player
        if (element.position.z > 50) {
          // Move it back to the front
          element.position.z -= 100;
        }
      }
    }
  });

  return (
    <>
      {/* Static ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Moving road elements */}
      <group ref={roadRef}>
        {/* Road markings - center line */}
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh 
            key={`center-${i}`} 
            position={[0, -0.09, -50 + i * 2.5]} 
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ isRepeating: true }}
          >
            <planeGeometry args={[0.5, 2]} />
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
        
        {/* Side markings - left */}
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh 
            key={`left-${i}`} 
            position={[-25, -0.09, -50 + i * 2.5]} 
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ isRepeating: true }}
          >
            <planeGeometry args={[1, 2]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        ))}
        
        {/* Side markings - right */}
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh 
            key={`right-${i}`} 
            position={[25, -0.09, -50 + i * 2.5]} 
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ isRepeating: true }}
          >
            <planeGeometry args={[1, 2]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        ))}
      </group>
      
      {/* Grass on sides */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, -0.15, 0]} receiveShadow>
        <planeGeometry args={[50, 100]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, -0.15, 0]} receiveShadow>
        <planeGeometry args={[50, 100]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Trees on the sides */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={`tree-left-${i}`} position={[-35, 0, -40 + i * 10]}>
          {/* Tree trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.7, 4, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tree top */}
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[2, 6, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={`tree-right-${i}`} position={[35, 0, -40 + i * 10]}>
          {/* Tree trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.7, 4, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tree top */}
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[2, 6, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}
      
      {/* Mountains in the background */}
      <group position={[0, 0, -80]}>
        <mesh position={[-30, 10, 0]} castShadow>
          <coneGeometry args={[20, 30, 4]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
        <mesh position={[0, 15, -10]} castShadow>
          <coneGeometry args={[25, 40, 4]} />
          <meshStandardMaterial color="#455A64" />
        </mesh>
        <mesh position={[30, 10, 0]} castShadow>
          <coneGeometry args={[20, 30, 4]} />
          <meshStandardMaterial color="#607D8B" />
        </mesh>
      </group>
      
      {/* Guardrails */}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`rail-left-${i}`} position={[-26, 0.5, -45 + i * 5]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color="#9E9E9E" />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.1, 0.3, 4]} />
            <meshStandardMaterial color="#BDBDBD" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`rail-right-${i}`} position={[26, 0.5, -45 + i * 5]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color="#9E9E9E" />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.1, 0.3, 4]} />
            <meshStandardMaterial color="#BDBDBD" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Obstacle component with different types
function Obstacle({ position, color = 'blue', type = 'box' }: { position: [number, number, number]; color?: string; type?: 'box' | 'cone' | 'barrier' }) {
  switch (type) {
    case 'cone':
      return (
        <group position={position}>
          <mesh castShadow position={[0, 0.5, 0]}>
            <coneGeometry args={[0.5, 1, 16]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.2, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      );
    case 'barrier':
      return (
        <group position={position}>
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[3, 1, 0.3]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <mesh castShadow position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    default: // box
      return (
        <mesh position={position} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}

// Define types for game objects
interface GameObjectType {
  id: number;
  position: [number, number, number];
  speed: number;
  type: 'box' | 'cone' | 'barrier';
}

// Speedometer component
function Speedometer({ speed, maxSpeed }: { speed: number, maxSpeed: number }) {
  const percentage = Math.abs(speed) / maxSpeed * 100;
  const color = percentage > 80 ? 'red' : percentage > 50 ? 'orange' : 'green';
  
  return (
    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg text-white">
      <div className="text-center mb-2">Speed: {Math.round(percentage)}%</div>
      <div className="w-40 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-200`}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

// Game scene component
function GameScene({ 
  gameState, 
  score, 
  onGameOver,
  onSpeedChange
}: { 
  gameState: 'menu' | 'playing' | 'gameover'; 
  score: number; 
  onGameOver: (score: number) => void;
  onSpeedChange: (speed: number) => void;
}) {
  const [obstacles, setObstacles] = useState<GameObjectType[]>([]);
  const [obstacleTimer, setObstacleTimer] = useState(0);
  const [gameScore, setGameScore] = useState(score);
  const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
  const [aiCars] = useState([
    { position: [-3, 0.5, -15] as [number, number, number], color: 'blue', speed: 0.08 },
    { position: [3, 0.5, -25] as [number, number, number], color: 'green', speed: 0.12 },
    { position: [-2, 0.5, -35] as [number, number, number], color: 'purple', speed: 0.15 },
    { position: [4, 0.5, -45] as [number, number, number], color: 'orange', speed: 0.1 },
  ]);
  
  // Track player position for collision detection
  const trackPlayerPosition = () => {
    // Update player position based on the car's current position
    if (gameState === 'playing') {
      // We'll use the current position directly from the game state
      // This avoids the need to query DOM elements which won't work in Three.js
      setPlayerPosition(new THREE.Vector3(0, 0.5, 0));
    }
  };
  
  // Generate obstacles
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      setObstacleTimer((prev) => prev + 1);
      
      // Spawn new obstacle every 2 seconds
      if (obstacleTimer % 120 === 0) {
        // Randomly select obstacle type
        const obstacleTypes: ('box' | 'cone' | 'barrier')[] = ['box', 'cone', 'barrier'];
        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        // Random position on the road
        const randomX = Math.random() * 6 - 3; // -3 to 3
        
        setObstacles(prev => [
          ...prev,
          {
            id: Date.now(),
            position: [randomX, 0.5, -30],
            speed: 0.1 + (gameScore / 1000), // Increase speed as score increases
            type: randomType
          }
        ]);
      }
      
      // Increase score
      setGameScore((prev: number) => prev + 1);
    }, 1000 / 60); // 60 FPS
    
    return () => clearInterval(interval);
  }, [gameState, obstacleTimer, gameScore]);
  
  // Move obstacles and check collisions
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    // Update obstacles
    setObstacles(prev => {
      return prev
        .map(obstacle => ({
          ...obstacle,
          position: [
            obstacle.position[0],
            obstacle.position[1],
            obstacle.position[2] + obstacle.speed
          ] as [number, number, number]
        }))
        .filter(obstacle => obstacle.position[2] < 20); // Remove obstacles that are behind the player
    });
    
    // Check collisions
    obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - obstacle.position[0], 2) +
        Math.pow(playerPosition.z - obstacle.position[2], 2)
      );
      
      const collisionDistance = 1.5; // Adjust based on car and obstacle size
      
      if (distance < collisionDistance) {
        onGameOver(gameScore);
      }
    });
  }, [obstacles, gameState, onGameOver, gameScore, playerPosition]);
  
  return (
    <>
      <Car 
        position={[0, 0.5, 0]} 
        controlsEnabled={gameState === 'playing'} 
        onSpeedChange={(speed) => {
          onSpeedChange(speed);
          trackPlayerPosition();
        }}
      />
      
      <Road />
      
      {/* AI Cars */}
      {aiCars.map((car, index) => (
        <Car 
          key={`ai-car-${index}`}
          position={car.position}
          color={car.color}
          isAICar={true}
          aiSpeed={car.speed}
        />
      ))}
      
      {obstacles.map(obstacle => (
        <Obstacle 
          key={obstacle.id}
          position={obstacle.position}
          type={obstacle.type}
        />
      ))}
      
      <Text
        position={[0, 4, 0]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`Score: ${gameScore}`}
      </Text>
    </>
  );
}

// Main game component
export default function CarGame3D() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed] = useState(0.5);
  const [viewMode, setViewMode] = useState<'third-person' | 'first-person'>('third-person');
  const [activeControls, setActiveControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  
  // Listen for key presses to show active controls in UI
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setActiveControls(prev => ({ ...prev, up: true }));
      if (e.key === 'ArrowDown') setActiveControls(prev => ({ ...prev, down: true }));
      if (e.key === 'ArrowLeft') setActiveControls(prev => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setActiveControls(prev => ({ ...prev, right: true }));
      
      // Toggle view mode with 'V' key
      if (e.key === 'v' || e.key === 'V') {
        setViewMode(prev => prev === 'third-person' ? 'first-person' : 'third-person');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setActiveControls(prev => ({ ...prev, up: false }));
      if (e.key === 'ArrowDown') setActiveControls(prev => ({ ...prev, down: false }));
      if (e.key === 'ArrowLeft') setActiveControls(prev => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setActiveControls(prev => ({ ...prev, right: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);
  
  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };
  
  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    setGameState('gameover');
  };
  
  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed);
  };
  
  // First-person cockpit overlay
  const CockpitOverlay = () => {
    const speedPercentage = Math.abs(currentSpeed) / maxSpeed * 100;
    
    return (
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Cockpit frame */}
        <div className="absolute inset-0 border-[100px] border-black border-opacity-80 rounded-lg">
          {/* Windshield */}
          <div className="absolute inset-0 border-t-[20px] border-l-[40px] border-r-[40px] border-black border-opacity-70"></div>
          
          {/* Dashboard */}
          <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gray-900 bg-opacity-90 p-4 flex items-center justify-between">
            {/* Speedometer */}
            <div className="w-40 h-40 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">{Math.round(speedPercentage)}%</div>
                </div>
                <div 
                  className="absolute w-1 h-16 bg-red-500 origin-bottom transform -rotate-45"
                  style={{ 
                    transform: `rotate(${-90 + (speedPercentage * 1.8)}deg)`,
                    transformOrigin: 'bottom center'
                  }}
                ></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm">SPEED</div>
            </div>
            
            {/* Steering wheel */}
            <div className="w-60 h-60 relative">
              <div 
                className="absolute inset-0 border-8 border-gray-700 rounded-full transform"
                style={{ 
                  transform: `rotate(${activeControls.left ? -20 : activeControls.right ? 20 : 0}deg)`
                }}
              >
                {/* Wheel spokes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-2 bg-gray-700"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
                  <div className="w-full h-2 bg-gray-700"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
                  <div className="w-full h-2 bg-gray-700"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <div className="w-full h-2 bg-gray-700"></div>
                </div>
                
                {/* Center cap */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white font-bold">RC</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Control indicators */}
            <div className="w-40 h-40 grid grid-cols-3 grid-rows-3 gap-2">
              <div className="col-start-2 row-start-1">
                <div className={`w-12 h-12 mx-auto rounded-md flex items-center justify-center border-2 ${activeControls.up ? 'bg-green-500 border-green-600' : 'bg-gray-700 border-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
              <div className="col-start-1 row-start-2">
                <div className={`w-12 h-12 mx-auto rounded-md flex items-center justify-center border-2 ${activeControls.left ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-700 border-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
              <div className="col-start-2 row-start-2">
                <div className="w-12 h-12 mx-auto rounded-md flex items-center justify-center border-2 bg-gray-800 border-gray-700">
                  <span className="text-white font-bold">V</span>
                </div>
              </div>
              <div className="col-start-3 row-start-2">
                <div className={`w-12 h-12 mx-auto rounded-md flex items-center justify-center border-2 ${activeControls.right ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-700 border-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="col-start-2 row-start-3">
                <div className={`w-12 h-12 mx-auto rounded-md flex items-center justify-center border-2 ${activeControls.down ? 'bg-red-500 border-red-600' : 'bg-gray-700 border-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Motion blur effect when moving fast */}
        {speedPercentage > 50 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-10"></div>
          </div>
        )}
        
        {/* View mode indicator */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
          Press V: {viewMode === 'first-person' ? 'First-Person' : 'Third-Person'} View
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full h-screen relative">
      <Header />
      
      {/* Racing scene background for menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600"></div>
          
          {/* Track */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-800">
            {/* Road markings */}
            <div className="absolute inset-x-0 top-0 h-2 bg-white"></div>
            
            {/* Animated dashed line */}
            <div className="absolute inset-x-0 top-1/2 h-4 w-full overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="inline-block w-16 h-4 mx-8 bg-yellow-400"></span>
                ))}
              </div>
            </div>
            
            {/* Mountains in background */}
            <div className="absolute -top-40 left-0 right-0 h-40">
              <div className="absolute left-1/4 w-40 h-40 bg-gray-700 rounded-t-full"></div>
              <div className="absolute left-1/2 w-60 h-60 bg-gray-800 rounded-t-full"></div>
              <div className="absolute right-1/4 w-40 h-40 bg-gray-700 rounded-t-full"></div>
            </div>
          </div>
          
          {/* Animated cars */}
          <div className="absolute bottom-1/4 left-0 w-16 h-8 bg-red-600 rounded-md animate-car1"></div>
          <div className="absolute bottom-1/4 left-20 w-16 h-8 bg-blue-600 rounded-md animate-car2"></div>
          <div className="absolute bottom-1/4 left-60 w-16 h-8 bg-green-600 rounded-md animate-car3"></div>
        </div>
      )}
      
      <div className="absolute inset-0 z-10">
        <Canvas shadows>
          <PerspectiveCamera 
            makeDefault 
            position={viewMode === 'first-person' ? [0, 1.2, 0] : [0, 5, 10]} 
            rotation={viewMode === 'first-person' ? [0, Math.PI, 0] : [0, 0, 0]}
            fov={viewMode === 'first-person' ? 75 : 60}
          />
          <OrbitControls enabled={false} />
          
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <Sky sunPosition={[100, 10, 100]} />
          <Environment preset="sunset" />
          
          {gameState === 'playing' && (
            <GameScene 
              gameState={gameState}
              score={score}
              onGameOver={handleGameOver}
              onSpeedChange={handleSpeedChange}
            />
          )}
        </Canvas>
      </div>
      
      {/* First-person cockpit overlay */}
      {gameState === 'playing' && viewMode === 'first-person' && <CockpitOverlay />}
      
      {/* Speedometer UI - Only show in third-person view */}
      {gameState === 'playing' && viewMode === 'third-person' && (
        <Speedometer speed={currentSpeed} maxSpeed={maxSpeed} />
      )}
      
      {/* UI Overlays */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
          <div className="bg-white p-8 rounded-lg text-center max-w-2xl shadow-xl">
            <h1 className="text-4xl font-bold mb-4 text-blue-800">3D Car Racing</h1>
            
            {/* Racing scene description */}
            <div className="mb-6 text-left text-gray-700 italic border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
              <p className="mb-2">
                Welcome to the ultimate racing challenge! Feel the adrenaline as you navigate through 
                winding curves and straightaways, competing against other high-performance vehicles.
              </p>
              <p>
                Master your driving skills, avoid obstacles, and push your limits to achieve the highest score. 
                The track awaits your expertise - are you ready to claim victory?
              </p>
            </div>
            
            <p className="mb-2">Use arrow keys to drive. Avoid obstacles and other cars!</p>
            <p className="mb-6 text-blue-600 font-medium">Press &apos;V&apos; during gameplay to toggle between first-person and third-person view!</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={startGame}
              >
                Start Game
              </button>
              
              {/* Controls info button */}
              <button
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => window.alert('CONTROLS:\n• Up Arrow: Accelerate\n• Down Arrow: Brake/Reverse\n• Left Arrow: Turn Left\n• Right Arrow: Turn Right\n• V Key: Toggle View Mode')}
              >
                Controls
              </button>
            </div>
            
            {highScore > 0 && (
              <p className="mt-4 font-semibold">High Score: {highScore}</p>
            )}
          </div>
        </div>
      )}
      
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20">
          <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-xl border-t-8 border-red-600">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-2 text-red-600">Game Over</h1>
            <p className="text-gray-600 mb-6">Your race has come to an end!</p>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Your Score:</span>
                <span className="text-2xl font-bold text-blue-600">{score}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">High Score:</span>
                <span className="text-xl font-bold text-green-600">{highScore}</span>
              </div>
              
              {score === highScore && score > 0 && (
                <div className="mt-2 bg-yellow-100 p-2 rounded text-yellow-800 text-sm">
                  🏆 New High Score! Congratulations!
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                onClick={startGame}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Again
              </button>
              
              <button
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setGameState('menu')}
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 