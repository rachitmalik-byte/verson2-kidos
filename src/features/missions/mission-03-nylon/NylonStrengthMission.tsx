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
    failureReason: 'Fine caterpillar protein strands snapped under heavy tensile load!',
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
    simpleExplanation: 'Made from continuous, super-strong plastic polymer chains.',
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
        properties: ['Super High Tensile Strength', 'Elastic & Lightweight', 'Stronger than plant fibers'],
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
              <Pip mood="curious" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Great Tensile Strength Rig! 🏋️
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
                <span>Enter 1v1 Tensile Rig 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: 1v1 TENSILE TESTING RIG (Dropdown + Weight Slider)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-200 shadow-xl">
              {/* Top Dropdown / Specimen Selector Tabs */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Tensile Testing Workbench
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    1v1 Rope Breaking Test
                  </h3>
                </div>

                {/* Dropdown / Specimen Pill Selector */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {ROPES.map((rope) => {
                    const isSelected = rope.id === selectedRopeId;
                    const isDone = testedRopes[rope.id];
                    return (
                      <button
                        key={rope.id}
                        onClick={() => handleSelectRope(rope.id)}
                        className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{rope.icon}</span>
                        <span className="hidden sm:inline">{rope.name.split(' ')[1] || rope.name}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1v1 Rig Workbench Display */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                {/* Left: Dedicated Macro Photography Stage with Dynamic Snapping */}
                <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-300 shadow-xl flex items-center justify-center p-2">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${currentRope.id}-${isSnapped ? 'snapped' : 'intact'}`}
                      src={isSnapped ? currentRope.snappedImage : currentRope.intactImage}
                      alt={currentRope.name}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        scale: isSnapped ? [1, 1.05, 0.98, 1] : 1 + (appliedWeightKg / currentRope.breakingLimitKg) * 0.05,
                      }}
                      exit={{ opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </AnimatePresence>

                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3">
                    {isSnapped ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full border border-white shadow-lg flex items-center gap-1 animate-bounce"
                      >
                        ⚡ SNAPPED AT {appliedWeightKg} KG!
                      </motion.span>
                    ) : appliedWeightKg > 0 ? (
                      <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        ✓ Holding {appliedWeightKg} kg
                      </span>
                    ) : (
                      <span className="bg-slate-800/80 text-slate-300 font-bold text-xs px-3 py-1 rounded-full">
                        Ready for Test
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Interactive Controls & 5th Grade Science Explanations */}
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-500">{currentRope.category} Material</span>
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Snap Limit: {currentRope.breakingLimitKg} kg
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{currentRope.name}</h4>
                    <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                      {currentRope.simpleExplanation}
                    </p>
                  </div>

                  {/* Weight Slider (0 to 50 kg) */}
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                    <div className="flex items-center justify-between font-black text-xs sm:text-sm mb-2">
                      <span className="text-slate-700 flex items-center gap-1">
                        <Scale className="w-4 h-4 text-amber-500" /> Pulling Weight:
                      </span>
                      <span className={`text-base font-black ${isSnapped ? 'text-rose-600' : 'text-slate-900'}`}>
                        {appliedWeightKg} kg 🏋️
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={appliedWeightKg}
                      onChange={handleSliderChange}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-3"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-between">
                      {[2, 5, 15, 25, 50].map((kg) => (
                        <button
                          key={kg}
                          onClick={() => handleApplyPreset(kg)}
                          className={`px-2.5 py-1.5 rounded-lg font-black text-xs cursor-pointer transition-all ${
                            appliedWeightKg === kg
                              ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {kg} kg
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Explanation */}
                  {isSnapped ? (
                    <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs font-bold text-rose-900">
                      <span className="font-black block mb-0.5">⚡ Why It Snapped:</span>
                      {currentRope.failureReason}
                    </div>
                  ) : appliedWeightKg > 0 ? (
                    <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs font-bold text-emerald-900">
                      <span className="font-black block mb-0.5">💪 Holding Strong:</span>
                      This rope can still carry more weight without breaking!
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Progress & Next Step Action */}
              <div className="w-full flex items-center justify-between pt-4 border-t-2 border-slate-100 flex-wrap gap-3">
                <span className="text-xs font-bold text-slate-500">
                  Tested {Object.keys(testedRopes).length} of {ROPES.length} ropes
                </span>

                {Object.keys(testedRopes).length >= 2 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextPhase}
                    className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer flex items-center gap-2 animate-pulse"
                  >
                    <span>Examine Fibers Under 100x Microscope</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </motion.button>
                )}
              </div>
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
                Switch specimens to see why smooth unbroken synthetic filaments hold heavy loads while short natural fibers pull apart!
              </p>

              {/* Specimen Switcher */}
              <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
                {[
                  { id: 'cotton', label: 'Cotton (Short Fibers)', icon: '🧵', img: cottonMicrograph100xImg, note: 'Short plant fibers with tiny hollow pores that slide apart when pulled!' },
                  { id: 'nylon', label: 'Nylon (Solid Chains)', icon: '🪢', img: nylonMicrograph100xImg, note: 'Long unbroken solid polymer chains that lock tightly under tension!' },
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                {[
                  { id: 'cotton', title: 'Natural Cotton Rope', desc: 'Short fibers slide apart and snap under heavy opening shock.', isCorrect: false },
                  { id: 'nylon', title: 'Synthetic Nylon Cord', desc: 'Continuous polymer chains hold massive weight with safe elastic stretch.', isCorrect: true },
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
