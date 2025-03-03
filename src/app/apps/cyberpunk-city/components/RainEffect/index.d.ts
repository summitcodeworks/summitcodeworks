import { ReactNode } from 'react';

export interface RainEffectProps {
  count?: number;
  area?: number;
  color?: string;
  speed?: number;
}

export function RainEffect(props: RainEffectProps): ReactNode; 