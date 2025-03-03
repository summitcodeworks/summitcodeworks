import { ReactNode } from 'react';

export interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  neonColors: [number, number, number];
  neonIntensity: number;
}

export interface WindowLight {
  position: [number, number, number];
  rotation: [number, number, number];
  basePosition: [number, number, number];
  size: [number, number];
  color: number;
  flickerSpeed: number;
  flickerIntensity: number;
  timeOffset: number;
}

export function Building(props: BuildingProps): ReactNode; 