'use client';

import { useRef } from 'react';
import * as THREE from 'three';

type NeonSignProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  text?: string;
  color?: string;
  intensity?: number;
};

export function NeonSign({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1, 
  text = 'NEON', 
  color = '#ff00ff',
  intensity = 2
}: NeonSignProps) {
  const signRef = useRef<THREE.Group>(null);
  
  return (
    <group 
      ref={signRef} 
      position={position} 
      rotation={rotation as [number, number, number]} 
      scale={[scale, scale, scale]}
    >
      {/* Sign background */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[text.length * 0.8, 1.2, 0.1]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Neon text representation (simplified as a glowing bar) */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[text.length * 0.7, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#222222"
          emissive={new THREE.Color(color)}
          emissiveIntensity={intensity}
          toneMapped={false}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight 
        position={[0, 0, 0.3]} 
        color={color} 
        intensity={intensity * 0.5} 
        distance={5}
      />
    </group>
  );
} 