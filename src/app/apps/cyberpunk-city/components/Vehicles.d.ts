import { ReactNode } from 'react';

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

// Define road lanes to keep vehicles organized
export const LANES: Array<{
  x: number;
  direction: [number, number, number];
}>;

// Flying vehicle paths at different heights
export const FLIGHT_PATHS: Array<{
  y: number;
  direction: [number, number, number];
}>;

export function Vehicle(props: VehicleProps): ReactNode; 