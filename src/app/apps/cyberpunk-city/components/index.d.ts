import { ReactNode } from 'react';

declare module './Buildings' {
  export interface BuildingProps {
    position: [number, number, number];
    size: [number, number, number];
    neonColors: [number, number, number];
    neonIntensity: number;
  }
  
  export function Building(props: BuildingProps): ReactNode;
}

declare module './Vehicles' {
  export interface VehicleProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    color?: string;
    headlightColor?: string;
    direction?: [number, number, number];
    speed?: number;
    type?: string;
  }
  
  export function Vehicle(props: VehicleProps): ReactNode;
}

declare module './RainEffect' {
  export interface RainEffectProps {
    count?: number;
    area?: number;
    color?: string;
    speed?: number;
  }
  
  export function RainEffect(props: RainEffectProps): ReactNode;
}

declare module './NeonSign' {
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