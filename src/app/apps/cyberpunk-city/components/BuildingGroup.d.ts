import { ReactNode } from 'react';

export interface BuildingGroupProps {
  count?: number;
  area?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  avoidCenter?: boolean;
  centerRadius?: number;
}

export function BuildingGroup(props: BuildingGroupProps): ReactNode; 