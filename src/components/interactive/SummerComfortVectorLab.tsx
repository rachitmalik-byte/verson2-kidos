import React from 'react';
import { ThreeSummerComfortLab } from '@/components/three-lab/ThreeSummerComfortLab';

interface Props {
  onComplete: () => void;
  isCompleted?: boolean;
}

export const SummerComfortVectorLab: React.FC<Props> = ({ onComplete }) => {
  return <ThreeSummerComfortLab onComplete={onComplete} />;
};
