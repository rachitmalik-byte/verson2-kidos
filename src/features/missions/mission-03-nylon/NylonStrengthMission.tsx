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
import cottonThreadBreakingImg from '@/assets/images/experiments/cotton_thread_breaking.jpg';
import nylonRopeHeavyWeightImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import nylonParachuteSkyImg from '@/assets/images/raincoat/nylon_parachute_sky.jpg';
import { Sparkles, ArrowRight, ShieldCheck, Scale, Dumbbell, Zap, Check, AlertCircle, ZoomIn } from 'lucide-react';

type Phase = 'HOOK' | 'TENSILE_TEST' | 'COMPARE' | 'APPLY';

export function NylonStrengthMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [weightKg, setWeightKg] = useState(2);
  const [testedThreads, setTestedThreads] = useState<Record<string, { snapped: boolean; max: number }>>({});
  const [activeThread, setActiveThread] = useState<string>('cotton');
  const [showCelebration, setShowCelebration] = useState(false);
  const [applyAnswer, setApplyAnswer] = useState<string | null>(null);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'TENSILE_TEST', 'COMPARE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
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
      case 'COMPARE':
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

    if (kg > thread.max) {
      sounds.tensionSnap();
      setTestedThreads((prev) => ({ ...prev, [threadId]: { snapped: true, max: thread.max } }));
      voiceAssistant.speak(`Snap! The ${thread.name} snapped at ${kg} kilograms because its natural fibers pulled apart!`);
    } else {
      sounds.success();
      setTestedThreads((prev) => ({ ...prev, [threadId]: { snapped: false, max: thread.max } }));
      voiceAssistant.speak(`The ${thread.name} holds ${kg} kilograms with zero strain!`);
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
              PHASE 2: TENSILE LAB (Weight Drop Sandbox)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
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

              {/* Dual Test Rig Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                {/* Cotton Test Rig */}
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-2">
                    Natural Cotton Thread
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mb-3">Plant Cellulose Fibers</span>

                  {/* Real Photo Experiment View */}
                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={cottonThreadBreakingImg}
                      alt="Cotton Thread Snap Experiment"
                      className="w-full h-full object-contain"
                    />
                    {testedThreads['cotton']?.snapped && (
                      <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-4xl animate-bounce">🧵💥</span>
                      </div>
                    )}
                  </div>

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
                        ? `💥 SNAPPED! Cotton broke under ${weightKg}kg (Limit: 2kg)`
                        : `✅ Cotton held ${weightKg}kg successfully!`}
                    </motion.div>
                  )}
                </div>

                {/* Synthetic Nylon Test Rig */}
                <div className="bg-white p-6 rounded-3xl border-4 border-sky-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                  <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase mb-2">
                    Synthetic Nylon Cord
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mb-3">Long Polymer Molecular Chains</span>

                  {/* Real Photo Experiment View */}
                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={nylonRopeHeavyWeightImg}
                      alt="Nylon Cord 25lb Dumbbell Test"
                      className="w-full h-full object-contain"
                    />
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
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: COMPARE (Why is Nylon So Strong?)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'COMPARE' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look at why Nylon is so strong! Continuous polymer chains act like unbreakable steel cables at the molecular scale!"
                  isVisible={true}
                />
              </div>

              {/* Real World Life-Saving Application Card */}
              <div className="w-full bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col md:flex-row items-center gap-6 mb-6">
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
