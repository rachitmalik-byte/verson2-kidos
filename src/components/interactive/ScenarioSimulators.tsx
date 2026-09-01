import { ThreeTireFrictionLab } from "@/components/three-lab/ThreeTireFrictionLab";
import { ThreeEpoxyChemistryLab } from "@/components/three-lab/ThreeEpoxyChemistryLab";
import { ThreePipeLeakLab } from "@/components/three-lab/ThreePipeLeakLab";
import { ThreeRubberStretchLab } from "@/components/three-lab/ThreeRubberStretchLab";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Sparkles, AlertTriangle, CheckCircle2, Flame, Droplet, Zap, RotateCcw, Wrench } from 'lucide-react';

/* ============================================================================
   1. 3D HIGH-PRESSURE PIPE BURST & EPOXY SEAL LAB (Three.js Hydrodynamic Engine)
   ============================================================================ */
export const HighPressurePipeLeakSim: React.FC<{
  onSealed?: () => void;
}> = ({ onSealed }) => {
  return <ThreePipeLeakLab onSealed={onSealed} />;
};

/* ============================================================================
   2. 3D HIGH-SPEED RACE CAR TIRE FRICTION LAB (Three.js Physics Engine)
   ============================================================================ */
export const RaceCarTireFrictionSim: React.FC<{
  onTested?: () => void;
}> = ({ onTested }) => {
  return <ThreeTireFrictionLab onTested={onTested} />;
};

/* ============================================================================
   4. 3D ELASTIC RUBBER STRETCH & SLINGSHOT LAB (Three.js Physics Engine)
   ============================================================================ */
export const MolecularVulcanizationSim: React.FC<{
  onComplete?: () => void;
  onCompleted?: () => void;
}> = ({ onComplete, onCompleted }) => {
  return <ThreeRubberStretchLab onCompleted={onCompleted || onComplete} />;
};

/* ============================================================================
   5. 3D DUAL-CHAMBER EPOXY CHEMISTRY LAB (Three.js Polymerization & Pull Test)
   ============================================================================ */
export const EpoxySyringeMixerSim: React.FC<{
  onMixed?: () => void;
}> = ({ onMixed }) => {
  return <ThreeEpoxyChemistryLab onMixed={onMixed} />;
};
