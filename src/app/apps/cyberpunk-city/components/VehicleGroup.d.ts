import { ReactNode } from 'react';

export interface VehicleGroupProps {
  groundCount?: number;
  flyingCount?: number;
  area?: {
    minZ: number;
    maxZ: number;
  };
}

export function VehicleGroup(props: VehicleGroupProps): ReactNode; 