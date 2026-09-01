import React from 'react';
import type { WaterAbsorptionLabData } from '@/types/lessonEngine';
import { ThreeFabricDropletLab } from '@/components/three-lab/ThreeFabricDropletLab';

interface Props {
  data?: WaterAbsorptionLabData;
  onComplete: () => void;
  onStepComplete?: () => void;
  isCompleted?: boolean;
}

export const WaterAbsorptionLabEngine: React.FC<Props> = ({ onComplete, onStepComplete }) => {
  const handleComplete = () => {
    if (onComplete) onComplete();
    if (onStepComplete) onStepComplete();
  };

  return (
    <div className="w-full flex flex-col items-center select-none font-sans max-w-3xl mx-auto">
      <ThreeFabricDropletLab onCompleted={handleComplete} />
    </div>
  );
};
