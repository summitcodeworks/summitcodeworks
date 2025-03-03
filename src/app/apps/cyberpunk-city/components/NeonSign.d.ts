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
