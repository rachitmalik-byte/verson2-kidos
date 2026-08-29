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

// Real Studio Macro Educational Photography (Clean Before & After Pairs)
import cottonThreadIntactImg from '@/assets/images/experiments/cotton_thread_intact.jpg';
import cottonThreadBreakingImg from '@/assets/images/experiments/cotton_thread_breaking.jpg';
import nylonCordIntactImg from '@/assets/images/experiments/nylon_cord_intact.jpg';
import nylonRopeHeavyWeightImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import nylonParachuteSkyImg from '@/assets/images/raincoat/nylon_parachute_sky.jpg';
import cottonFabricZoomImg from '@/assets/images/raincoat/cotton_fabric_zoom.jpg';
import polyesterFabricZoomImg from '@/assets/images/raincoat/polyester_fabric_zoom.jpg';
import { Sparkles, ArrowRight, ShieldCheck, Scale, Dumbbell, Zap, Check, AlertCircle, ZoomIn } from 'lucide-react';

type Phase = 'HOOK' | 'TENSILE_TEST' | 'MICROSCOPE' | 'APPLY';

export function NylonStrengthMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [weightKg, setWeightKg] = useState(2);
  const [isTestingTensile, setIsTestingTensile] = useState(false);
  const [testedThreads, setTestedThreads] = useState<Record<string, { snapped: boolean; max: number }>>({});
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'cotton' | 'nylon'>('cotton');
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
        properties: ['High Tensile Strength', 'Stronger than Steel', 'Elastic & Light'],
        uses: ['Climbing ropes', 'Toothbrush bristles', 'Parachutes', 'Sleeping bags'],
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
    },
    {
      id: 'nylon',
      name: 'Synthetic Nylon Cord',
      max: 25,
      origin: 'Polymer Chains (Continuous Unbroken Filaments)',
      color: 'sky',
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
        voiceAssistant.speak(`Snap! The ${thread.name} snapped at ${kg} kilograms because its natural fibers pulled apart!`);
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
        onComplete={() => setShowCelebration(false)}
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
                Mountain climbers and skydivers trust thin cords with their lives! Can you test how much weight a thin{' '}
                <span className="text-amber-600 font-black">Cotton thread</span> can hold before snapping versus synthetic{' '}
                <span className="text-sky-600 font-black">Nylon cord</span>?
              </p>

              {/* Clean Intact Specimen Preview */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                <div className="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-md flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-slate-50 border border-slate-100 p-1">
                    <img src={cottonThreadIntactImg} alt="Intact Cotton Thread" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="font-black text-xs text-slate-800">1. Natural Cotton</span>
                  <span className="text-[10px] font-bold text-amber-700">Short Plant Cellulose Fibers</span>
                </div>

                <div className="bg-white p-4 rounded-3xl border-3 border-sky-300 shadow-md flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-slate-50 border border-slate-100 p-1">
                    <img src={nylonCordIntactImg} alt="Intact Nylon Cord" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="font-black text-xs text-slate-800">2. Synthetic Nylon</span>
                  <span className="text-[10px] font-bold text-sky-700">Continuous Polymer Cables</span>
                </div>
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter the Tensile Lab 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: TENSILE LAB (Weight Drop Sandbox with True Before/After)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Hang different cast-iron weights on both cords to test their breaking limit!"
                  isVisible={true}
                />
              </div>

              {/* Weight Selector Bar */}
              <div className="bg-white p-4 rounded-3xl border-3 border-slate-200 shadow-md flex items-center gap-3 mb-6 flex-wrap justify-center">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>Select Test Weight:</span>
                </span>
                {[1, 2, 5, 10, 25].map((kg) => (
                  <button
                    key={kg}
                    onClick={() => {
                      sounds.pop();
                      setWeightKg(kg);
                    }}
                    className={`px-4 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                      weightKg === kg
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-105 ring-2 ring-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{kg} kg</span>
                  </button>
                ))}
              </div>

              {/* Dual Test Rig Cards Wrapped in Focus Spotlight */}
              <ExperimentFocusSpotlight
                isActive={isTestingTensile}
                activeLabel={`🏋️ Testing ${weightKg}kg Tension Stress...`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Cotton Test Rig */}
                  <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-1">
                      Natural Cotton Thread
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mb-3">
                      {testedThreads['cotton']?.snapped
                        ? `💥 Snapped under ${weightKg}kg load`
                        : 'Intact thread suspended on test hook'}
                    </span>

                    {/* Real Photo with True Before/After */}
                    <motion.div
                      animate={isTestingTensile ? { x: [-3, 3, -3, 3, 0] } : {}}
                      transition={{ duration: 0.2, repeat: 3 }}
                      className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2"
                    >
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={testedThreads['cotton']?.snapped ? 'cotton-snapped' : 'cotton-intact'}
                          src={testedThreads['cotton']?.snapped ? cottonThreadBreakingImg : cottonThreadIntactImg}
                          alt={testedThreads['cotton']?.snapped ? 'Cotton Thread Snapped' : 'Cotton Thread Intact'}
                          initial={{ opacity: 0.4, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </AnimatePresence>
                      {testedThreads['cotton']?.snapped && (
                        <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-4xl animate-bounce">🧵💥</span>
                        </div>
                      )}
                    </motion.div>

                    <button
                      onClick={() => handleApplyWeight('cotton', weightKg)}
                      className="w-full py-3.5 mt-3 rounded-2xl font-black text-sm bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>Hang {weightKg} kg Weight on Cotton</span>
                    </button>

                    {testedThreads['cotton'] && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-3 p-3 rounded-2xl w-full text-center border font-bold text-xs ${
                          testedThreads['cotton'].snapped
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        }`}
                      >
                        {testedThreads['cotton'].snapped
                          ? `💥 SNAPPED! Cotton broke under ${weightKg}kg (Natural fibers separated)`
                          : `✅ Cotton held ${weightKg}kg successfully!`}
                      </motion.div>
                    )}
                  </div>

                  {/* Synthetic Nylon Test Rig */}
                  <div className="bg-white p-6 rounded-3xl border-4 border-sky-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                    <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase mb-1">
                      Synthetic Nylon Cord
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mb-3">
                      {testedThreads['nylon']
                        ? `✨ Holds ${weightKg}kg with zero strain`
                        : 'Intact polymer cord on test hook'}
                    </span>

                    {/* Real Photo with True Before/After */}
                    <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={testedThreads['nylon'] ? 'nylon-heavy' : 'nylon-intact'}
                          src={testedThreads['nylon'] ? nylonRopeHeavyWeightImg : nylonCordIntactImg}
                          alt={testedThreads['nylon'] ? 'Nylon Holding Heavy Weight' : 'Intact Nylon Cord'}
                          initial={{ opacity: 0.4, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </AnimatePresence>
                      {testedThreads['nylon'] && !testedThreads['nylon'].snapped && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-xs font-black shadow-md">
                          ✨ Holds Effortlessly!
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleApplyWeight('nylon', weightKg)}
                      className="w-full py-3.5 mt-3 rounded-2xl font-black text-sm bg-sky-500 hover:bg-sky-600 text-white shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>Hang {weightKg} kg Weight on Nylon</span>
                    </button>

                    {testedThreads['nylon'] && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-2xl w-full text-center border font-bold text-xs bg-emerald-50 border-emerald-300 text-emerald-700"
                      >
                        🌟 UNSTOPPABLE! Nylon holds {weightKg}kg with zero strain!
                      </motion.div>
                    )}
                  </div>
                </div>
              </ExperimentFocusSpotlight>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: OPTICAL MICROSCOPE STUDIO + GOLDEN SCIENCE LAW
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'MICROSCOPE' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look at both fibers under high magnification! See how polymer chains form unbreakable molecular cables!"
                  isVisible={true}
                />
              </div>

              {/* ── OPTICAL MICROSCOPE STAGE ── */}
              <div className="w-full bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center relative overflow-hidden mb-8">
                <div className="flex items-center justify-between w-full mb-4 z-10 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Molecular Fiber Tensile Studio</span>
                  </span>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-700">
                    {[
                      { level: 100, label: '100x' },
                      { level: 250, label: '250x' },
                      { level: 500, label: '500x' },
                    ].map((z) => (
                      <button
                        key={z.level}
                        onClick={() => {
                          sounds.pop();
                          setMicroscopeZoomLevel(z.level);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          microscopeZoomLevel === z.level
                            ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Microscope Lens Viewport */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-900 ring-4 ring-amber-400/80 my-2 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeMicroscopeSpecimen}-${microscopeZoomLevel}`}
                      src={activeMicroscopeSpecimen === 'cotton' ? cottonFabricZoomImg : polyesterFabricZoomImg}
                      alt="Microscope Specimen"
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: microscopeZoomLevel === 100 ? 1.05 : microscopeZoomLevel === 250 ? 1.45 : 2.0,
                        opacity: 1,
                      }}
                      exit={{ scale: 1.2, opacity: 0.3 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-cyan-400/30 absolute" />
                    <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
                    <div className="w-24 h-24 rounded-full border border-cyan-400/40 absolute" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-4 z-10">
                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('cotton');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'cotton'
                        ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-lg scale-102 ring-4 ring-amber-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🌿 Cotton: Short Plant Staples</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('nylon');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'nylon'
                        ? 'bg-sky-400 border-sky-300 text-slate-950 shadow-lg scale-102 ring-4 ring-sky-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>⚡ Nylon: Long Polymer Cables</span>
                  </button>
                </div>
              </div>

              {/* ── THE GOLDEN SCIENCE LAW ── */}
              <div className="w-full bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl mb-6">
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-sky-600 mb-6 bg-sky-100 px-4 py-1.5 rounded-full w-fit mx-auto">
                  ⚡ The Golden Science Law
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🧱</span>
                    <span className="font-black text-slate-800 text-base">1. MATERIAL</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is MADE OF</p>
                    <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full mt-2">
                      Synthetic Nylon Polymer
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it CAN DO</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      High Tensile Strength & Elastic
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is USED FOR</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      Climbing Ropes & Parachutes
                    </span>
                  </div>
                </div>
              </div>

              {/* Real World Life-Saving Application Card */}
              <div className="w-full bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg shrink-0">
                  <img
                    src={nylonParachuteSkyImg}
                    alt="Nylon Parachute in Sky"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full">
                    🪂 Real-World Application: Skydiving Parachutes
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-2 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Why Chemists Replaced Silk & Cotton With Nylon
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 font-bold leading-relaxed">
                    Before 1935, parachutes were made of fragile natural silk. Synthetic Nylon was invented with extreme tensile strength: a cord as thin as a pencil can lift a family car without snapping!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Rock Climbing Challenge)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="lg" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Rock Climbing Safety Challenge 🧗
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-bold mb-6">
                Pip is preparing for a mountain expedition. Which rope material should Pip pack to ensure 100% safety against heavy falls?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                <button
                  onClick={() => {
                    sounds.boing();
                    setApplyAnswer('cotton');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    applyAnswer === 'cotton'
                      ? 'bg-rose-100 border-rose-500 text-rose-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">🧵</span>
                  <span>Natural Cotton Rope</span>
                  <span className="text-xs font-bold text-slate-500">Snaps easily under sudden shock load</span>
                </button>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    setApplyAnswer('nylon');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    applyAnswer === 'nylon'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-300 scale-105'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">🪢✨</span>
                  <span>Synthetic Nylon Dynamic Rope</span>
                  <span className="text-xs font-bold text-slate-500">High tensile strength & elastic shock absorber</span>
                </button>
              </div>

              {applyAnswer === 'cotton' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs max-w-md"
                >
                  ⚠️ Danger! Natural cotton fibers break under sudden shock weight. Climbers need synthetic Nylon cords!
                </motion.div>
              )}

              {applyAnswer === 'nylon' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs max-w-md"
                >
                  🎉 Perfect scientific choice! Nylon stretches to absorb fall energy and will never snap!
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
