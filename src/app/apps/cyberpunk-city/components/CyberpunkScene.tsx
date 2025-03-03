'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import { RainEffect } from './RainEffect';
import { NeonSign } from './NeonSign';
import { BuildingGroup } from './BuildingGroup';
import { VehicleGroup } from './VehicleGroup';
import { PedestrianGroup } from './Pedestrians';

// Scene parameters context
type SceneParams = {
  neonIntensity: number;
  vehicleSpeed: number;
  fogDensity: number;
  rainIntensity: number;
};

// Main scene component
function CityScene() {
  const [sceneParams, setSceneParams] = useState<SceneParams>({
    neonIntensity: 1,
    vehicleSpeed: 1,
    fogDensity: 0.03,
    rainIntensity: 0.5
  });
  
  const [audioMuted, setAudioMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Scene setup
  const { scene } = useThree();
  
  // Set up fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x0a0a0a, sceneParams.fogDensity);
    
    // Initialize audio
    if (!audioRef.current) {
      try {
        const audio = new Audio('/sounds/cyberpunk-ambient.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
      } catch {
        console.warn("Audio file not found, continuing without audio");
      }
    }
    
    // Event listeners for UI controls
    const handleSceneParamsUpdate = (event: CustomEvent<SceneParams>) => {
      setSceneParams(event.detail);
    };
    
    const handleToggleAudio = (event: CustomEvent<{isMuted: boolean}>) => {
      setAudioMuted(event.detail.isMuted);
    };
    
    window.addEventListener('updateSceneParams', handleSceneParamsUpdate as EventListener);
    window.addEventListener('toggleAudio', handleToggleAudio as EventListener);
    
    return () => {
      window.removeEventListener('updateSceneParams', handleSceneParamsUpdate as EventListener);
      window.removeEventListener('toggleAudio', handleToggleAudio as EventListener);
    };
  }, [scene, sceneParams.fogDensity]);
  
  // Update fog density when it changes
  useEffect(() => {
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).density = sceneParams.fogDensity;
    }
  }, [scene, sceneParams.fogDensity]);
  
  // Handle audio muting
  useEffect(() => {
    if (audioRef.current) {
      if (audioMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioMuted]);
  
  // Create a fallback texture if the texture file is not available
  const createFallbackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a dark grid pattern
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 512, 512);
      
      // Draw grid lines
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      
      // Horizontal lines
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
      }
      
      // Add some neon-like effects
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 2 + Math.random() * 5;
        const colors = ['#ff00ff', '#00ffff', '#00ff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    
    return texture;
  };
  
  // Try to load the texture, use fallback if it fails
  const [groundTexture, setGroundTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const loadTexture = async () => {
      try {
        const textureLoader = new THREE.TextureLoader();
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/textures/cyberpunk-street.jpg',
            resolve,
            undefined,
            reject
          );
        });
        
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        texture.anisotropy = 16;
        setGroundTexture(texture);
      } catch {
        console.warn("Could not load texture, using fallback");
        setGroundTexture(createFallbackTexture());
      }
    };
    
    loadTexture();
  }, []);
  
  return (
    <>
      {/* Environment */}
      <color attach="background" args={[0x000000]} />
      <fog attach="fog" args={['#0a0a0a', 0.01, 500]} />
      <ambientLight intensity={0.2} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[0, 50, 0]} 
        intensity={0.3} 
        color="#5e17eb" 
      />
      
      {/* Ground */}
      {groundTexture && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial 
            map={groundTexture} 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      )}
      
      {/* Building Groups */}
      <BuildingGroup 
        count={30} 
        area={{ minX: -100, maxX: 100, minZ: -100, maxZ: 100 }}
        avoidCenter={true}
        centerRadius={30}
      />
      
      {/* Additional buildings for density */}
      <BuildingGroup 
        count={15} 
        area={{ minX: -150, maxX: 150, minZ: -150, maxZ: 150 }}
        avoidCenter={true}
        centerRadius={50}
      />
      
      {/* Vehicle Groups */}
      <VehicleGroup 
        groundCount={25} 
        flyingCount={15}
        area={{ minZ: -150, maxZ: 150 }}
      />
      
      {/* Pedestrians */}
      <PedestrianGroup 
        count={30}
        walkingArea={{ minX: -30, maxX: 30, minZ: -100, maxZ: 100 }}
      />
      
      {/* Neon Signs */}
      <NeonSign 
        position={[20, 20, -20]} 
        text="CYBER" 
        color="#ff00ff" 
        intensity={sceneParams.neonIntensity}
      />
      <NeonSign 
        position={[-20, 30, 10]} 
        text="PUNK" 
        color="#00ffff" 
        intensity={sceneParams.neonIntensity}
      />
      <NeonSign 
        position={[0, 40, -30]} 
        text="2077" 
        color="#00ff00" 
        intensity={sceneParams.neonIntensity}
      />
      
      {/* Rain Effect */}
      {sceneParams.rainIntensity > 0 && (
        <RainEffect 
          count={1000 * sceneParams.rainIntensity} 
          area={100}
          color="#88ccff"
          speed={10 * sceneParams.rainIntensity}
        />
      )}
      
      {/* Floating cyberpunk logo */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 60, -50]}>
          <boxGeometry args={[40, 5, 1]} />
          <meshStandardMaterial 
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={sceneParams.neonIntensity}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </>
  );
}

// Main component that sets up the Canvas
export default function CyberpunkScene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 30, 80]} fov={60} />
      <OrbitControls 
        target={[0, 20, 0]} 
        maxPolarAngle={Math.PI / 2 - 0.1} 
        minDistance={10}
        maxDistance={150}
      />
      <CityScene />
    </Canvas>
  );
} 