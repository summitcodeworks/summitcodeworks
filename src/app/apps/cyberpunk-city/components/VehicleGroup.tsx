'use client';

import { useMemo } from 'react';
import { Vehicle, LANES, FLIGHT_PATHS } from './Vehicles';

type VehicleGroupProps = {
  groundCount?: number;
  flyingCount?: number;
  area?: {
    minZ: number;
    maxZ: number;
  };
};

export function VehicleGroup({ 
  groundCount = 15, 
  flyingCount = 8,
  area = { minZ: -100, maxZ: 100 }
}: VehicleGroupProps) {
  // Generate random vehicles
  const vehicles = useMemo(() => {
    const vehicleConfigs = [];
    
    // Ground vehicles
    for (let i = 0; i < groundCount; i++) {
      // Choose a random lane
      const laneIndex = Math.floor(Math.random() * LANES.length);
      const lane = LANES[laneIndex];
      
      // Random position along the lane
      const z = area.minZ + Math.random() * (area.maxZ - area.minZ);
      
      // Random vehicle type
      const vehicleTypes = ['car', 'police', 'truck'];
      const typeIndex = Math.floor(Math.random() * vehicleTypes.length);
      const type = vehicleTypes[typeIndex];
      
      // Random color (except for police vehicles)
      const colors = [
        '#6a8ac2', // light blue
        '#c26a8a', // pink
        '#8ac26a', // light green
        '#c2a16a', // tan
        '#a16ac2', // purple
        '#6ac2a1'  // teal
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random speed
      const speed = 0.2 + Math.random() * 0.4;
      
      // Random scale (trucks are larger)
      const scale = type === 'truck' ? 1.5 : 1.0;
      
      vehicleConfigs.push({
        position: [lane.x, 0.5, z] as [number, number, number],
        direction: lane.direction,
        color,
        speed,
        type,
        scale,
        key: `ground-vehicle-${i}`
      });
    }
    
    // Flying vehicles
    for (let i = 0; i < flyingCount; i++) {
      // Choose a random flight path
      const pathIndex = Math.floor(Math.random() * FLIGHT_PATHS.length);
      const path = FLIGHT_PATHS[pathIndex];
      
      // Random position along the path
      const z = area.minZ + Math.random() * (area.maxZ - area.minZ);
      // Random x position with some variation
      const x = -50 + Math.random() * 100;
      
      // Random speed
      const speed = 0.3 + Math.random() * 0.5;
      
      // Random color for flying vehicles
      const flyingColors = [
        '#7ac2ff', // bright blue
        '#ff7ac2', // bright pink
        '#c2ff7a', // bright green
        '#ffaa55'  // orange
      ];
      const color = flyingColors[Math.floor(Math.random() * flyingColors.length)];
      
      vehicleConfigs.push({
        position: [x, path.y, z] as [number, number, number],
        direction: path.direction,
        speed,
        type: 'flying',
        color,
        key: `flying-vehicle-${i}`
      });
    }
    
    return vehicleConfigs;
  }, [groundCount, flyingCount, area]);
  
  return (
    <group>
      {vehicles.map((vehicle) => (
        <Vehicle 
          key={vehicle.key}
          position={vehicle.position}
          direction={vehicle.direction}
          color={vehicle.color}
          speed={vehicle.speed}
          type={vehicle.type}
          scale={vehicle.scale}
        />
      ))}
    </group>
  );
} 