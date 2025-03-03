import { ReactNode } from 'react';

declare module '../components/RainEffect' {
  export interface RainEffectProps {
    count?: number;
    area?: number;
    color?: string;
    speed?: number;
  }
  
  export function RainEffect(props: RainEffectProps): ReactNode;
}

declare module '../components/NeonSign' {
  export interface NeonSignProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    text?: string;
    color?: string;
    intensity?: number;
  }
  
  export function NeonSign(props: NeonSignProps): ReactNode;
}

declare module '../components/BuildingGroup' {
  export interface BuildingGroupProps {
    count?: number;
    area?: number;
    neonIntensity?: number;
  }
  
  export function BuildingGroup(props: BuildingGroupProps): ReactNode;
}

declare module '../components/VehicleGroup' {
  export interface VehicleGroupProps {
    count?: number;
    area?: number;
    speed?: number;
  }
  
  export function VehicleGroup(props: VehicleGroupProps): ReactNode;
}

declare module '../components/Pedestrians' {
  export interface PedestrianGroupProps {
    count?: number;
    area?: number;
  }
  
  export function PedestrianGroup(props: PedestrianGroupProps): ReactNode;
} 