import { ThreeTensileRigLab } from "@/components/three-lab/ThreeTensileRigLab";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MissionLayout } from '../MissionLayout';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

// Real Dedicated Laboratory Rope Photography
import cottonRopeIntactImg from '@/assets/images/experiments/cotton_rope_intact.jpg';
import cottonRopeSnappedImg from '@/assets/images/experiments/cotton_rope_snapped.jpg';
import woolRopeIntactImg from '@/assets/images/experiments/wool_rope_intact.jpg';
import woolRopeSnappedImg from '@/assets/images/experiments/wool_rope_snapped.jpg';
import silkCordIntactImg from '@/assets/images/experiments/silk_cord_intact.jpg';
import silkCordSnappedImg from '@/assets/images/experiments/silk_cord_snapped.jpg';
import nylonRopeIntactImg from '@/assets/images/experiments/nylon_rope_intact.jpg';
import nylonRopeSnappedImg from '@/assets/images/experiments/nylon_rope_snapped.jpg';
import steelCableIntactImg from '@/assets/images/experiments/steel_cable_intact.jpg';
import steelCableHoldingImg from '@/assets/images/experiments/steel_cable_holding.jpg';

// 100x SEM Micrographs
import cottonMicrograph100xImg from '@/assets/images/microscope/cotton_micrograph_100x.jpg';
import nylonMicrograph100xImg from '@/assets/images/microscope/nylon_micrograph_100x.jpg';
import silkMicrograph100xImg from '@/assets/images/microscope/silk_micrograph_100x.jpg';
import woolMicrograph100xImg from '@/assets/images/microscope/wool_micrograph_100x.jpg';

import { Sparkles, ArrowRight, ShieldCheck, Scale, Dumbbell, Zap, Check, AlertCircle, ZoomIn, RotateCcw, CheckCircle2 } from 'lucide-react';

type Phase = 'HOOK' | 'TENSILE_TEST' | 'MICROSCOPE' | 'APPLY';

interface RopeSpecimen {
  id: string;
  name: string;
  category: 'Natural' | 'Synthetic' | 'Metal';
  icon: string;
  breakingLimitKg: number;
  simpleExplanation: string;
  failureReason: string;
  intactImage: string;
  snappedImage: string;
  color: string;
}

const ROPES: RopeSpecimen[] = [
  {
    id: 'cotton',
    name: 'Natural Cotton Rope',
    category: 'Natural',
    icon: '🧵',
    breakingLimitKg: 2,
    simpleExplanation: 'Made from short fluffy plant fibers twisted together.',
    failureReason: 'The short plant fibers pulled apart and unraveled under heavy weight!',
    intactImage: cottonRopeIntactImg,
    snappedImage: cottonRopeSnappedImg,
    color: 'amber',
  },
  {
    id: 'wool',
    name: 'Natural Wool Cord',
    category: 'Natural',
    icon: '🧶',
    breakingLimitKg: 3,
    simpleExplanation: 'Made from soft, curly sheep fleece hairs.',
    failureReason: 'Curly animal hairs stretched out and snapped apart in the clamps!',
    intactImage: woolRopeIntactImg,
    snappedImage: woolRopeSnappedImg,
    color: 'amber',
  },
  {
    id: 'silk',
    name: 'Natural Silk Cord',
    category: 'Natural',
    icon: '🐛',
    breakingLimitKg: 5,
    simpleExplanation: 'Spun by silkworm caterpillars into smooth shiny threads.',
    failureReason: 'Fine caterpillar protein strands snapped under heavy pulling force!',
    intactImage: silkCordIntactImg,
    snappedImage: silkCordSnappedImg,
    color: 'purple',
  },
  {
    id: 'nylon',
    name: 'Synthetic Nylon Climbing Rope',
    category: 'Synthetic',
    icon: '🪢',
    breakingLimitKg: 25,
    simpleExplanation: 'Made from continuous, super-strong synthetic threads.',
    failureReason: 'Held immense weight before finally snapping at extreme force!',
    intactImage: nylonRopeIntactImg,
    snappedImage: nylonRopeSnappedImg,
    color: 'sky',
  },
  {
    id: 'steel',
    name: 'Braided Stainless Steel Wire Cable',
    category: 'Metal',
    icon: '⚙️',
    breakingLimitKg: 50,
    simpleExplanation: 'Made of strong braided metal wires locked tightly together.',
    failureReason: 'Never snaps! Steel wire cables can easily lift cars and elevators!',
    intactImage: steelCableIntactImg,
    snappedImage: steelCableHoldingImg,
    color: 'slate',
  },
];

export function NylonStrengthMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [selectedRopeId, setSelectedRopeId] = useState<string>('cotton');
  const [appliedWeightKg, setAppliedWeightKg] = useState<number>(0);
  const [testedRopes, setTestedRopes] = useState<Record<string, boolean>>({});
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'cotton' | 'nylon' | 'silk' | 'wool'>('cotton');
  const [showCelebration, setShowCelebration] = useState(false);
  const [applyAnswer, setApplyAnswer] = useState<string | null>(null);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const currentRope = ROPES.find((r) => r.id === selectedRopeId) || ROPES[0];
  const isSnapped = appliedWeightKg >= currentRope.breakingLimitKg;
  const tensionPercent = Math.min(100, Math.round((appliedWeightKg / currentRope.breakingLimitKg) * 100));

  const phaseOrder: Phase[] = ['HOOK', 'TENSILE_TEST', 'MICROSCOPE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  React.useEffect(() => {
    voiceAssistant.stop();
    return () => {
      voiceAssistant.stop();
    };
  }, [currentPhase]);

  const handleSelectRope = (ropeId: string) => {
    sounds.pop();
    setSelectedRopeId(ropeId);
    setAppliedWeightKg(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAppliedWeightKg(val);

    if (val >= currentRope.breakingLimitKg) {
      sounds.tensionSnap();
      setTestedRopes((prev) => ({ ...prev, [selectedRopeId]: true }));
      voiceAssistant.speak(`Snap! The ${currentRope.name} snapped at ${val} kilograms!`);
    } else if (val > 0) {
      sounds.pop();
    }
  };

  const handleApplyPreset = (kg: number) => {
    setAppliedWeightKg(kg);
    if (kg >= currentRope.breakingLimitKg) {
      sounds.tensionSnap();
      setTestedRopes((prev) => ({ ...prev, [selectedRopeId]: true }));
      voiceAssistant.speak(`Snap! The ${currentRope.name} broke under ${kg} kilograms!`);
    } else {
      sounds.success();
      voiceAssistant.speak(`The ${currentRope.name} holds ${kg} kilograms easily!`);
    }
  };

  const handleNextPhase = () => {
    voiceAssistant.stop();
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      completeMission('mission-03');
      addDiscovery({
        materialId: 'nylon',
        discoveredAt: Date.now(),
        properties: ['Super Strong Pulling Power', 'Elastic & Lightweight', 'Stronger than plant fibers'],
        uses: ['Climbing ropes', 'Parachutes', 'Fishing nets', 'Tents'],
        scienceWord: 'Tensile Strength',
      });
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/4');
      }, 2400);
    }
  };

  const handlePrevPhase = () => {
    if (currentStepIndex > 0) {
      sounds.pop();
      setCurrentPhase(phaseOrder[currentStepIndex - 1]);
    }
  };

  const handleRedo = () => {
    sounds.pop();
    setAppliedWeightKg(0);
    setTestedRopes({});
    setApplyAnswer(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'TENSILE_TEST':
        return Object.keys(testedRopes).length >= 2;
      case 'MICROSCOPE':
        return true;
      case 'APPLY':
        return applyAnswer === 'nylon';
      default:
        return false;
    }
  };

  return (
    <MissionLayout
      missionId="mission-03"
      missionNumber={3}
      missionTitle="The Strength Championship"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-sky-100 via-indigo-50 to-amber-100"
    >
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => {
          setShowCelebration(false);
          navigate('/chapter/3/mission/4');
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full flex-1 flex flex-col items-center justify-center py-4"
        >
          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 1: HOOK (The Heavy Lift Mystery)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="curious" size="md" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Great Rope Strength Rig! 🏋️
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Mountain climbers and skydivers trust thin ropes with their lives! Which rope is strong enough to hold heavy weights without snapping?
              </p>

              {/* Ropes Lineup */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full mb-8">
                {ROPES.map((r) => (
                  <div key={r.id} className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">{r.icon}</span>
                    <span className="font-black text-xs text-slate-900 truncate w-full">{r.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">{r.category}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter Rope Strength Rig 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: 1v1 3D TENSILE TESTING RIG (Three.js Physics Engine)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-950 rounded-full font-black text-xs sm:text-sm border border-amber-300 animate-pulse shadow-xs">
                  👇 Tap weights to test pulling force on each rope!
                </span>
              </div>

              <ThreeTensileRigLab
                onTested={(ropeId) => {
                  setTestedRopes((prev) => ({ ...prev, [ropeId]: true }));
                }}
              />
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: MICROSCOPE (True 100x SEM Micrographs)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'MICROSCOPE' && (
            <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-200 shadow-xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
                100x Electron Microscope Inspection
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Why is Nylon so much Stronger than Cotton?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-lg mb-6">
                Switch materials to see why smooth unbroken synthetic threads hold heavy loads while short natural fibers pull apart!
              </p>

              {/* Material Switcher */}
              <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
                {[
                  { id: 'cotton', label: 'Cotton (Short Fibers)', icon: '🧵', img: cottonMicrograph100xImg, note: 'Short plant fibers with tiny hollow pores that slide apart when pulled!' },
                  { id: 'nylon', label: 'Nylon (Solid Threads)', icon: '🪢', img: nylonMicrograph100xImg, note: 'Long unbroken solid synthetic threads that stay super strong when pulled!' },
                  { id: 'silk', label: 'Silk (Triangular)', icon: '🐛', img: silkMicrograph100xImg, note: 'Smooth caterpillar silk filaments with rounded triangular strength.' },
                  { id: 'wool', label: 'Wool (Cuticle Scales)', icon: '🐑', img: woolMicrograph100xImg, note: 'Curly sheep hairs with overlapping scales that trap warm air.' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen(s.id as any);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      activeMicroscopeSpecimen === s.id
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Circular Reticle Lens */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-950 mb-4 mx-auto">
                <img
                  src={
                    activeMicroscopeSpecimen === 'nylon'
                      ? nylonMicrograph100xImg
                      : activeMicroscopeSpecimen === 'silk'
                      ? silkMicrograph100xImg
                      : activeMicroscopeSpecimen === 'wool'
                      ? woolMicrograph100xImg
                      : cottonMicrograph100xImg
                  }
                  alt="Micrograph"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none border border-amber-400/40 rounded-full flex items-center justify-center">
                  <div className="w-full h-0.5 bg-amber-400/30" />
                  <div className="h-full w-0.5 bg-amber-400/30 absolute" />
                  <div className="w-24 h-24 rounded-full border border-dashed border-amber-400/60" />
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-950/85 text-amber-300 font-black text-[10px] px-3 py-0.5 rounded-full border border-amber-400/40">
                  100x SEM Micrograph
                </div>
              </div>

              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl max-w-lg mb-6 text-xs sm:text-sm font-bold text-amber-950">
                {activeMicroscopeSpecimen === 'nylon'
                  ? '💡 Synthetic Nylon: Engineered from continuous unbroken plastic chains that never pull apart under heavy weight!'
                  : activeMicroscopeSpecimen === 'cotton'
                  ? '💡 Natural Cotton: Made of short separate plant fibers. When you pull hard, the short fibers slip and break!'
                  : activeMicroscopeSpecimen === 'silk'
                  ? '💡 Natural Silk: Strong continuous protein strands spun by silkworms!'
                  : '💡 Natural Wool: Curly sheep hair with microscopic scales that trap heat!'}
              </div>

              <button
                onClick={handleNextPhase}
                className="py-3.5 px-8 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Take the Paratrooper Challenge</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Skydiver Challenge)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🪂
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
                Real-World Science Challenge
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Which Rope for a Skydiver?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 mb-6">
                When a skydiver jumps from an airplane, the parachute lines must hold heavy body weight under extreme sudden wind force. Which material must engineers choose?
              </p>

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-950 rounded-full font-black text-xs sm:text-sm border border-amber-300 animate-pulse shadow-xs">
                  👇 Choose the safest rope for the skydiver!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                {[
                  { id: 'cotton', title: 'Natural Cotton Rope', desc: 'Short fibers slide apart and snap under heavy opening shock.', isCorrect: false },
                  { id: 'nylon', title: 'Synthetic Nylon Cord', desc: 'Continuous synthetic threads hold massive weight with safe springy stretch.', isCorrect: true },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.pop();
                      setApplyAnswer(opt.id);
                      if (opt.isCorrect) sounds.fanfare();
                      else sounds.boing();
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      applyAnswer === opt.id
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200'
                          : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-black text-sm text-slate-900 block">{opt.title}</span>
                    <span className="text-xs font-bold text-slate-500 mt-1 block">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {applyAnswer === 'nylon' && (
                <button
                  onClick={handleNextPhase}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-base rounded-2xl cursor-pointer shadow-lg active:scale-95 transition-all animate-pulse"
                >
                  Claim Mission 3 Trophy! ⭐⭐⭐
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
