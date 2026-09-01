import React from 'react';
import { ThreeTensileRigLab } from '@/components/three-lab/ThreeTensileRigLab';

interface Props {
  data?: any;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const TensileStrengthRigEngine: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="w-full flex justify-center">
      <ThreeTensileRigLab
        onTested={() => {
          if (onComplete) onComplete();
        }}
      />
    </div>
  );
};
