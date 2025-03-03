'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type RainEffectProps = {
  count?: number;
  area?: number;
  color?: string;
  speed?: number;
};

export function RainEffect({ 
  count = 1000, 
  area = 100, 
  color = '#88ccff',
  speed = 10
}: RainEffectProps) {
  const rainRef = useRef<THREE.Points>(null);
  
  // Create rain particles
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random position within the area
      const x = (Math.random() - 0.5) * area;
      const y = Math.random() * 100; // Height range
      const z = (Math.random() - 0.5) * area;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Random velocity for each raindrop
      velocities[i] = 0.5 + Math.random() * 0.5;
    }
    
    return { positions, velocities };
  }, [count, area]);
  
  // Animate rain
  useFrame((_, delta) => {
    if (!rainRef.current) return;
    
    const positions = (rainRef.current.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Move raindrops downward
      positions[i * 3 + 1] -= particles.velocities[i] * speed * delta;
      
      // Reset position when raindrop goes below ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 100; // Reset to top
        positions[i * 3] = (Math.random() - 0.5) * area; // Randomize x
        positions[i * 3 + 2] = (Math.random() - 0.5) * area; // Randomize z
      }
    }
    
    (rainRef.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.2}
        transparent
        opacity={0.6}
        fog={true}
      />
    </points>
  );
} 