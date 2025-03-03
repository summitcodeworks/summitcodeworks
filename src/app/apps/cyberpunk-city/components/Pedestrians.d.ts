import { ReactNode } from 'react';

export interface PedestrianProps {
  position: [number, number, number];
  color?: string;
  speed?: number;
  walkingArea?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

// Define sidewalk paths
export const SIDEWALKS: Array<{
  x: number;
  direction: [number, number, number];
}>;

export function Pedestrian(props: PedestrianProps): ReactNode;

export interface PedestrianGroupProps {
  count?: number;
  walkingArea?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

export function PedestrianGroup(props: PedestrianGroupProps): ReactNode; 