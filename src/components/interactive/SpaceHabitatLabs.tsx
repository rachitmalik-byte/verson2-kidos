import React from 'react';
import { ThreeSpaceHabitatLab } from '@/components/three-lab/ThreeSpaceHabitatLab';

export const SunitaInSpaceMultiStationLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return <ThreeSpaceHabitatLab onCompleted={onCompleted} />;
};
