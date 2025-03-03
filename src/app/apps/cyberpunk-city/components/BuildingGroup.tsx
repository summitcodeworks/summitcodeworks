'use client';

import { useMemo } from 'react';
import { Building } from './Buildings';

type BuildingGroupProps = {
  count?: number;
  area?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  avoidCenter?: boolean;
  centerRadius?: number;
};

export function BuildingGroup({ 
  count = 15, 
  area = { minX: -100, maxX: 100, minZ: -100, maxZ: 100 },
  avoidCenter = true,
  centerRadius = 30
}: BuildingGroupProps) {
  // Generate random buildings
  const buildings = useMemo(() => {
    const buildingConfigs = [];
    
    // Create a grid system to avoid overlapping buildings
    const gridSize = 20;
    const gridCells: Record<string, boolean> = {};
    
    for (let i = 0; i < count; i++) {
      // Try to find a valid position
      let attempts = 0;
      let validPosition = false;
      let gridX = 0;
      let gridZ = 0;
      
      while (!validPosition && attempts < 50) {
        // Generate random grid position
        gridX = Math.floor((Math.random() * (area.maxX - area.minX) + area.minX) / gridSize);
        gridZ = Math.floor((Math.random() * (area.maxZ - area.minZ) + area.minZ) / gridSize);
        
        // Check if this grid cell is already occupied
        const gridKey = `${gridX},${gridZ}`;
        
        // Calculate actual position
        const x = gridX * gridSize;
        const z = gridZ * gridSize;
        
        // Check if position is in the center area (which we might want to avoid)
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        const isTooCloseToCenter = avoidCenter && distanceFromCenter < centerRadius;
        
        if (!gridCells[gridKey] && !isTooCloseToCenter) {
          validPosition = true;
          gridCells[gridKey] = true;
        }
        
        attempts++;
      }
      
      if (validPosition) {
        // Calculate actual position from grid
        const x = gridX * gridSize;
        const z = gridZ * gridSize;
        
        // Random building size
        const width = 8 + Math.random() * 12;
        const height = 20 + Math.random() * 80;
        const depth = 8 + Math.random() * 12;
        
        // Random neon colors
        const neonColors: [number, number, number] = [
          Math.random() * 0xffffff,
          Math.random() * 0xffffff,
          Math.random() * 0xffffff
        ];
        
        // Random neon intensity
        const neonIntensity = 0.5 + Math.random() * 1.5;
        
        buildingConfigs.push({
          position: [x, height / 2, z] as [number, number, number],
          size: [width, height, depth] as [number, number, number],
          neonColors,
          neonIntensity,
          key: `building-${i}`
        });
      }
    }
    
    return buildingConfigs;
  }, [count, area, avoidCenter, centerRadius]);
  
  return (
    <group>
      {buildings.map((building) => (
        <Building 
          key={building.key}
          position={building.position}
          size={building.size}
          neonColors={building.neonColors}
          neonIntensity={building.neonIntensity}
        />
      ))}
    </group>
  );
} 