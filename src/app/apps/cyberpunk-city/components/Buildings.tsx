'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type BuildingProps = {
  position: [number, number, number];
  size: [number, number, number];
  neonColors: [number, number, number];
  neonIntensity: number;
};

interface WindowLight {
  position: [number, number, number];
  rotation: [number, number, number];
  basePosition: [number, number, number];
  size: [number, number];
  color: number;
  flickerSpeed: number;
  flickerIntensity: number;
  timeOffset: number;
}

export function Building({ position, size, neonColors, neonIntensity }: BuildingProps) {
  const buildingRef = useRef<THREE.Group>(null);
  const [width, height, depth] = size;
  
  // Create building texture with windows
  const buildingTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark building base
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add grid pattern for windows
      const windowSize = 32;
      const windowSpacing = 48;
      
      for (let y = windowSpacing; y < 512 - windowSize; y += windowSpacing) {
        for (let x = windowSpacing; x < 512 - windowSize; x += windowSpacing) {
          // Skip some windows randomly
          if (Math.random() > 0.7) continue;
          
          // Window frame
          ctx.fillStyle = '#1a1a2a';
          ctx.fillRect(x, y, windowSize, windowSize);
          
          // Window light (some lit, some dark)
          const isLit = Math.random() > 0.4;
          if (isLit) {
            const colors = ['#ffcc66', '#66ccff', '#ff66cc', '#66ffcc'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(x + 4, y + 4, windowSize - 8, windowSize - 8);
            ctx.globalAlpha = 1.0;
          } else {
            ctx.fillStyle = '#111122';
            ctx.fillRect(x + 4, y + 4, windowSize - 8, windowSize - 8);
          }
        }
      }
      
      // Add some panel lines
      ctx.strokeStyle = '#2a2a3a';
      ctx.lineWidth = 3;
      
      // Horizontal dividers
      for (let y = 128; y < 512; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
      
      // Vertical dividers
      for (let x = 128; x < 512; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 10, height / 20);
    
    return texture;
  }, [width, height]);
  
  // Generate window lights
  const windowLights = useMemo(() => {
    const lights: WindowLight[] = [];
    const windowsPerSide = Math.max(2, Math.floor(width / 2));
    const floorsCount = Math.max(2, Math.floor(height / 3));
    
    // Create window lights for each side of the building
    const sides = [
      { dir: 'front', pos: [0, 0, depth/2 + 0.01] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
      { dir: 'back', pos: [0, 0, -depth/2 - 0.01] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
      { dir: 'left', pos: [-width/2 - 0.01, 0, 0] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number] },
      { dir: 'right', pos: [width/2 + 0.01, 0, 0] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number] }
    ];
    
    sides.forEach(side => {
      for (let floor = 0; floor < floorsCount; floor++) {
        for (let i = 0; i < windowsPerSide; i++) {
          // Skip some windows randomly
          if (Math.random() > 0.6) continue;
          
          const isLit = Math.random() > 0.3;
          if (!isLit) continue;
          
          // Calculate position
          let x = 0, y = 0;
          
          if (side.dir === 'front' || side.dir === 'back') {
            x = -width/2 + width * (i + 0.5) / windowsPerSide;
            y = -height/2 + height * (floor + 0.5) / floorsCount;
          } else {
            x = -depth/2 + depth * (i + 0.5) / windowsPerSide;
            y = -height/2 + height * (floor + 0.5) / floorsCount;
          }
          
          // Choose a random color for the window
          const colorIndex = Math.floor(Math.random() * 3);
          const color = [0xffcc66, 0x66ccff, 0xff66cc][colorIndex];
          
          // Add flicker parameters
          const flickerSpeed = 0.1 + Math.random() * 0.5;
          const flickerIntensity = Math.random() * 0.3;
          const timeOffset = Math.random() * 10;
          
          lights.push({
            position: [x, y, 0] as [number, number, number],
            rotation: side.rot,
            basePosition: side.pos,
            size: [0.8, 0.8] as [number, number],
            color,
            flickerSpeed,
            flickerIntensity,
            timeOffset
          });
        }
      }
    });
    
    return lights;
  }, [width, height, depth]);
  
  // Add animation to the neon lights and windows
  useFrame((state) => {
    if (!buildingRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Animate neon light on top
    const neonMesh = buildingRef.current.children[1] as THREE.Mesh;
    if (neonMesh && neonMesh.material) {
      const material = neonMesh.material as THREE.MeshStandardMaterial;
      // Create a subtle pulsing effect
      const pulseIntensity = 1 + Math.sin(time * 2) * 0.2;
      material.emissiveIntensity = neonIntensity * pulseIntensity;
    }
    
    // Animate window lights
    for (let i = 4; i < buildingRef.current.children.length; i++) {
      const windowLight = buildingRef.current.children[i] as THREE.Mesh;
      if (windowLight && windowLight.userData.isWindowLight) {
        const material = windowLight.material as THREE.MeshStandardMaterial;
        const { flickerSpeed, flickerIntensity, timeOffset } = windowLight.userData;
        
        // Calculate flicker effect
        const flicker = Math.sin((time + timeOffset) * flickerSpeed) * flickerIntensity;
        const intensity = Math.max(0.5, 1 + flicker);
        
        material.emissiveIntensity = intensity;
      }
    }
  });
  
  return (
    <group ref={buildingRef} position={position} userData={{ type: 'building' }}>
      {/* Main building structure with texture */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.7} 
          metalness={0.8}
          map={buildingTexture}
        />
      </mesh>
      
      {/* Neon light on top */}
      <mesh position={[0, height/2 + 0.1, 0]}>
        <boxGeometry args={[width - 0.5, 0.2, depth - 0.5]} />
        <meshStandardMaterial 
          color="#222222"
          emissive={new THREE.Color(neonColors[0])}
          emissiveIntensity={neonIntensity}
          toneMapped={false}
        />
      </mesh>
      
      {/* Add a few random neon accents */}
      <mesh position={[width/3, height/3, depth/2 + 0.02]}>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#222222"
          emissive={new THREE.Color(neonColors[1])}
          emissiveIntensity={neonIntensity * 1.2}
          toneMapped={false}
        />
      </mesh>
      
      <mesh position={[-width/4, -height/4, depth/2 + 0.02]}>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#222222"
          emissive={new THREE.Color(neonColors[2])}
          emissiveIntensity={neonIntensity * 1.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Window lights */}
      {windowLights.map((light, index) => {
        const [x, y, z] = light.position;
        const [bx, by, bz] = light.basePosition;
        
        return (
          <mesh 
            key={`window-${index}`}
            position={[bx + x, by + y, bz + z]}
            rotation={light.rotation}
            userData={{
              isWindowLight: true,
              flickerSpeed: light.flickerSpeed,
              flickerIntensity: light.flickerIntensity,
              timeOffset: light.timeOffset
            }}
          >
            <planeGeometry args={light.size} />
            <meshStandardMaterial 
              color="#222222"
              emissive={new THREE.Color(light.color)}
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
} 