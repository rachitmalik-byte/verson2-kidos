import React, { useState } from 'react';
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
import { ExperimentFocusSpotlight } from '@/components/interactive/ExperimentFocusSpotlight';

// Real Studio Macro Educational Photography
import cottonThreadIntactImg from '@/assets/images/experiments/cotton_thread_intact.jpg';
import cottonThreadBreakingImg from '@/assets/images/experiments/cotton_thread_breaking.jpg';
import nylonCordIntactImg from '@/assets/images/experiments/nylon_cord_intact.jpg';
import nylonRopeHeavyWeightImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import nylonParachuteSkyImg from '@/assets/images/raincoat/nylon_parachute_sky.jpg';
import silkwormSilkCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import steelWireSpecimenImg from '@/assets/images/experiments/steel_wire_specimen.jpg';

// 100x SEM Micrographs
import cottonMicrograph100xImg from '@/assets/images/microscope/cotton_micrograph_100x.jpg';
import nylonMicrograph100xImg from '@/assets/images/microscope/nylon_micrograph_100x.jpg';
import silkMicrograph100xImg from '@/assets/images/microscope/silk_micrograph_100x.jpg';
import woolMicrograph100xImg from '@/assets/images/microscope/wool_micrograph_100x.jpg';

import { Sparkles, ArrowRight, ShieldCheck, Scale, Dumbbell, Zap, Check, AlertCircle, ZoomIn } from 'lucide-react';

type Phase = 'HOOK' | 'TENSILE_TEST' | 'MICROSCOPE' | 'APPLY';

export function NylonStrengthMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [weightKg, setWeightKg] = useState(2);
  const [isTestingTensile, setIsTestingTensile] = useState(false);
  const [testedThreads, setTestedThreads] = useState<Record<string, { snapped: boolean; max: number }>>({});
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'cotton' | 'nylon' | 'silk' | 'wool'>('cotton');
  const [microscopeZoomLevel, setMicroscopeZoomLevel] = useState<number>(250);
  const [showCelebration, setShowCelebration] = useState(false);
  const [applyAnswer, setApplyAnswer] = useState<string | null>(null);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'TENSILE_TEST', 'MICROSCOPE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  React.useEffect(() => {
    voiceAssistant.stop();
    return () => {
      voiceAssistant.stop();
    };
  }, [currentPhase]);

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
        properties: ['High Tensile Strength', 'Stronger than Steel by weight', 'Elastic & Light'],
        uses: ['Climbing ropes', 'Parachutes', 'Fishing lines', 'Industrial cables'],
        scienceWord: 'High tensile strength',
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
    setWeightKg(2);
    setTestedThreads({});
    setApplyAnswer(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'TENSILE_TEST':
        return Object.keys(testedThreads).length >= 2;
      case 'MICROSCOPE':
        return true;
      case 'APPLY':
        return applyAnswer === 'nylon';
      default:
        return false;
    }
  };

  const THREADS = [
    {
      id: 'cotton',
      name: 'Natural Cotton Thread',
      max: 2,
      origin: 'Plant Cellulose (Short Overlapping Fibers)',
      color: 'amber',
      intactImage: cottonThreadIntactImg,
      breakingImage: cottonThreadBreakingImg,
      icon: '🧵',
    },
    {
      id: 'silk',
      name: 'Natural Silk Filament',
      max: 5,
      origin: 'Animal Fibroin (Continuous Smooth Triangular Strands)',
      color: 'purple',
      intactImage: silkwormSilkCocoonImg,
      breakingImage: silkwormSilkCocoonImg,
      icon: '🐛',
    },
    {
      id: 'nylon',
      name: 'Synthetic Nylon Cord',
      max: 25,
      origin: 'Polymer Chains (Continuous Unbroken Filaments)',
      color: 'sky',
      intactImage: nylonCordIntactImg,
      breakingImage: nylonRopeHeavyWeightImg,
      icon: '🪢',
    },
    {
      id: 'steel',
      name: 'Braided Stainless Steel Wire',
      max: 40,
      origin: 'Metallic Iron Alloy (Multi-Strand Braided Cable)',
      color: 'slate',
      intactImage: steelWireSpecimenImg,
      breakingImage: steelWireSpecimenImg,
      icon: '⚙️',
    },
  ];

  const handleApplyWeight = (threadId: string, kg: number) => {
    const thread = THREADS.find((t) => t.id === threadId);
    if (!thread) return;

    setIsTestingTensile(true);

    setTimeout(() => {
      if (kg > thread.max) {
        sounds.tensionSnap();
        setTestedThreads((prev) => ({ ...prev, [threadId]: { snapped: true, max: thread.max } }));
        voiceAssistant.speak(`Snap! The ${thread.name} snapped at ${kg} kilograms because pulling tension exceeded its breaking limit!`);
      } else {
        sounds.success();
        setTestedThreads((prev) => ({ ...prev, [threadId]: { snapped: false, max: thread.max } }));
        voiceAssistant.speak(`The ${thread.name} holds ${kg} kilograms with zero strain!`);
      }
      setIsTestingTensile(false);
    }, 600);
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
                The Great Tensile Strength Showdown! 🏋️
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Mountain climbers and skydivers trust thin cords with their lives! Can you test how much load{' '}
                <span className="text-amber-600 font-black">Cotton</span>, <span className="text-purple-600 font-black">Silk</span>,{' '}
                <span className="text-sky-600 font-black">Nylon</span>, and <span className="text-slate-800 font-black">Braided Steel</span> can hold before snapping?
              </p>

              {/* 4 Clean Specimen Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
                {THREADS.map((t) => (
                  <div key={t.id} className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-md flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 bg-slate-900 border border-slate-100 p-0.5">
                      <img src={t.intactImage} alt={t.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="font-black text-xs text-slate-800 truncate w-full">{t.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">{t.origin.split('(')[0]}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter the Tensile Rig Lab 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: TENSILE LAB (Weight Drop Sandbox with 4 Materials)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <Pip mood="thinking" size="sm" />
                <span className="text-base md:text-lg font-black text-slate-800">
                  Select a weight and pull the load on each material!
                </span>
              </div>

              {/* Weight Selector Stepper */}
              <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-sm flex-wrap justify-center">
                <span className="font-black text-xs text-slate-600 mr-2 flex items-center gap-1">
                  <Scale className="w-4 h-4 text-amber-500" /> Choose Weight Load:
                </span>
                {[2, 5, 15, 25, 40].map((kg) => (
                  <button
                    key={kg}
                    onClick={() => {
                      sounds.pop();
                      setWeightKg(kg);
                    }}
                    className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                      weightKg === kg
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {kg} kg 🏋️
                  </button>
                ))}
              </div>

              {/* 4 Materials Testing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {THREADS.map((thread) => {
                  const testResult = testedThreads[thread.id];
                  const hasSnapped = testResult?.snapped === true;
                  const hasPassed = testResult && !testResult.snapped;

                  return (
                    <div
                      key={thread.id}
                      className={`p-4 rounded-3xl border-3 bg-white shadow-md flex flex-col justify-between transition-all ${
                        hasSnapped
                          ? 'border-rose-400 bg-rose-50/40'
                          : hasPassed
                          ? 'border-emerald-400 bg-emerald-50/40'
                          : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{thread.icon}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            Limit: {thread.max}kg
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 truncate">{thread.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500 line-clamp-2 mt-0.5">{thread.origin}</p>

                        {/* Visual Rig Inset */}
                        <div className="w-full h-32 rounded-2xl overflow-hidden my-3 bg-slate-950 border border-slate-200 relative">
                          <img
                            src={hasSnapped ? thread.breakingImage : thread.intactImage}
                            alt={thread.name}
                            className="w-full h-full object-cover"
                          />
                          {hasSnapped && (
                            <div className="absolute inset-0 bg-rose-950/60 flex items-center justify-center">
                              <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full border border-white shadow-md">
                                ⚡ SNAPPED!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyWeight(thread.id, weightKg)}
                        disabled={isTestingTensile}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all disabled:opacity-50"
                      >
                        Apply {weightKg}kg Pull ⬇️
                      </button>
                    </div>
                  );
                })}
              </div>

              {Object.keys(testedThreads).length >= 2 && (
                <button
                  onClick={handleNextPhase}
                  className="mt-6 py-3 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl cursor-pointer shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Examine Fibers Under Microscope ➔</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: MICROSCOPE (True 100x SEM Micrographs)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'MICROSCOPE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <Pip mood="explaining" size="sm" />
                <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  100x Electron Microscope Inspection 🔬
                </h3>
              </div>

              {/* Specimen Switcher */}
              <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-wrap justify-center">
                {[
                  { id: 'cotton', label: 'Cotton (Porous)', icon: '🧵', img: cottonMicrograph100xImg, note: 'Twisted, hollow ribbon-like tubes with microscopic pores.' },
                  { id: 'nylon', label: 'Nylon (Solid)', icon: '🪢', img: nylonMicrograph100xImg, note: 'Solid, perfectly smooth cylindrical polymer filaments.' },
                  { id: 'silk', label: 'Silk (Triangular)', icon: '🐛', img: silkMicrograph100xImg, note: 'Smooth continuous filaments with rounded triangular cross-sections.' },
                  { id: 'wool', label: 'Wool (Scales)', icon: '🐑', img: woolMicrograph100xImg, note: 'Overlapping keratin cuticle scales that trap warm air.' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen(s.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      activeMicroscopeSpecimen === s.id
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Circular Reticle Lens */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-950 mb-4">
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

              <p className="text-xs sm:text-sm font-bold text-slate-600 text-center max-w-lg mb-6">
                {activeMicroscopeSpecimen === 'nylon'
                  ? 'Continuous unbroken polymer chains allow synthetic nylon to stretch and withstand immense tension!'
                  : activeMicroscopeSpecimen === 'silk'
                  ? 'Triangular natural fibroin protein filaments give silk its lustrous sheen and surprising tensile strength!'
                  : activeMicroscopeSpecimen === 'wool'
                  ? 'Overlapping keratin cuticle scales act as thermal insulators in cold weather!'
                  : 'Hollow, porous cellulose tubes absorb water easily but pull apart under heavy mechanical tension.'}
              </p>

              <button
                onClick={handleNextPhase}
                className="py-3 px-8 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Take the Parachute Challenge ➔</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Skydiver Challenge)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border-3 border-amber-400 shadow-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🪂
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Paratrooper Equipment Challenge!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 mb-6">
                A skydiving team needs cords that are lightweight, flexible, and capable of holding hundreds of kilograms of sudden opening shock. Which material must they choose?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                {[
                  { id: 'cotton', title: 'Natural Cotton Cord', desc: 'Lightweight but snaps under sudden opening shock.', isCorrect: false },
                  { id: 'nylon', title: 'Synthetic Nylon Cord', desc: 'High tensile strength & elasticity for safe deceleration.', isCorrect: true },
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
