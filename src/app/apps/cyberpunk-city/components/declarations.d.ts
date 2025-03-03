declare module './RainEffect' {
  import { ReactNode } from 'react';
  
  export interface RainEffectProps {
    count?: number;
    area?: number;
    color?: string;
    speed?: number;
  }
  
  export function RainEffect(props: RainEffectProps): ReactNode;
}

declare module './NeonSign' {
  import { ReactNode } from 'react';
  
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

declare module './BuildingGroup' {
  import { ReactNode } from 'react';
  
  export interface BuildingGroupProps {
    count?: number;
    area?: number;
    neonIntensity?: number;
  }
  
  export function BuildingGroup(props: BuildingGroupProps): ReactNode;
}

declare module './VehicleGroup' {
  import { ReactNode } from 'react';
  
  export interface VehicleGroupProps {
    count?: number;
    area?: number;
    speed?: number;
  }
  
  export function VehicleGroup(props: VehicleGroupProps): ReactNode;
}

declare module './Pedestrians' {
  import { ReactNode } from 'react';
  
  export interface PedestrianGroupProps {
    count?: number;
    area?: number;
  }
  
  export function PedestrianGroup(props: PedestrianGroupProps): ReactNode;
} 