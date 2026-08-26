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
import {
  NylonIllustration,
  CottonIllustration,
  SilkIllustration,
  ParachuteIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Sparkles, ArrowRight, ShieldCheck, Scale, Dumbbell, Zap, Check } from 'lucide-react';

type Phase = 'HOOK' | 'TENSILE_TEST' | 'COMPARE' | 'APPLY';

interface ThreadTest {
  id: string;
  name: string;
  maxWeight: number; // in kg
  renderIcon: () => React.ReactNode;
  isSnapped: boolean;
}

export function NylonStrengthMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [weightKg, setWeightKg] = useState(5);
  const [testedThreads, setTestedThreads] = useState<Record<string, number>>({});
  const [activeThread, setActiveThread] = useState<string>('cotton');
  const [showCelebration, setShowCelebration] = useState(false);

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
        navigate('/chapter-hub');
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
    setWeightKg(5);
    setTestedThreads({});
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'TENSILE_TEST':
        return Object.keys(testedThreads).length >= 3;
      case 'COMPARE':
        return true;
      case 'APPLY':
        return false;
      default:
        return false;
    }
  };

  const THREADS = [
    { id: 'cotton', name: 'Cotton Thread', max: 10, renderIcon: () => <CottonIllustration className="w-10 h-10" /> },
    { id: 'silk', name: 'Silk Filament', max: 20, renderIcon: () => <SilkIllustration className="w-10 h-10" /> },
    { id: 'steel', name: 'Steel Wire (Same Gauge)', max: 40, renderIcon: () => <Dumbbell className="w-10 h-10 text-slate-500" /> },
    { id: 'nylon', name: 'Nylon Polymer Fibre', max: 55, renderIcon: () => <NylonIllustration className="w-10 h-10" /> },
  ];

  const handleAddWeight = () => {
    const thread = THREADS.find((t) => t.id === activeThread);
    if (!thread) return;

    const nextWeight = weightKg + 10;
    setWeightKg(nextWeight);

    if (nextWeight > thread.max) {
      sounds.boing();
      setTestedThreads((p) => ({ ...p, [activeThread]: thread.max }));
    } else {
      sounds.pop();
    }
  };

  return (
    <MissionLayout
      missionId="mission-03"
      missionNumber={3}
      missionTitle="The Super-Nylon Strength Test"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-indigo-100 via-sky-50 to-amber-50"
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
          {/* ════ PHASE 1: HOOK ════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <NylonIllustration className="w-full h-full" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Can a Thread Be Stronger Than Steel? ⚡
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-8">
                In 1935, chemists synthesized <span className="text-sky-600 font-black">Nylon</span> from petroleum, limestone, and coal.
                Scientists made an unbelievable claim: a single strand of nylon can hold more weight than a steel wire of the same thickness!
                Let's test this in Pip's Tensile Machine!
              </p>

              <button
                onClick={handleNextPhase}
                className="btn-3d-amber text-slate-950 font-black text-xl py-4 px-12 rounded-3xl cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Load the Tensile Tester! 🏋️</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════ PHASE 2: TENSILE TEST INTERACTIVE ════ */}
          {currentPhase === 'TENSILE_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Pip Dialogue Header */}
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="thinking" size="lg" />
                <PipSpeechBubble
                  message="Select a thread, then keep adding iron weights until the strand snaps! Watch when Nylon breaks!"
                  isVisible={true}
                />
              </div>

              {/* Thread Selector Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-6 w-full">
                {THREADS.map((t) => {
                  const tested = testedThreads[t.id] !== undefined;
                  const isSelected = activeThread === t.id;

                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        sounds.pop();
                        setActiveThread(t.id);
                        setWeightKg(5);
                      }}
                      className={`p-3.5 rounded-2xl border-3 flex items-center gap-2.5 font-black text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-700 shadow-md scale-105'
                          : tested
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-7 h-7">{t.renderIcon()}</div>
                      <span>{t.name}</span>
                      {tested && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Tensile Testing Rig */}
              <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 flex flex-col items-center">
                {/* Rig Frame */}
                <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 text-white flex flex-col items-center shadow-2xl relative overflow-hidden border-4 border-slate-800">
                  <div className="text-xs font-black uppercase text-amber-400 mb-2">
                    Active Test: {THREADS.find((t) => t.id === activeThread)?.name}
                  </div>

                  {/* Suspended Cord Graphic */}
                  <div className="h-32 w-full flex flex-col items-center justify-between my-2">
                    {/* Top Clamp */}
                    <div className="w-24 h-4 bg-slate-700 rounded-full border border-slate-600" />

                    {/* The Strand */}
                    {testedThreads[activeThread] !== undefined ? (
                      <div className="text-rose-500 font-black text-sm bg-rose-950/80 px-4 py-1.5 rounded-full border border-rose-500 animate-pulse">
                        💥 SNAPPED at {testedThreads[activeThread]} kg!
                      </div>
                    ) : (
                      <motion.div
                        animate={{ height: ['80px', `${80 + weightKg * 0.8}px`] }}
                        className="w-2 bg-gradient-to-b from-sky-400 to-amber-300 rounded-full shadow-[0_0_10px_#38BDF8]"
                      />
                    )}

                    {/* Bottom Weight Hanger */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-12 bg-amber-500 border-2 border-amber-600 rounded-2xl flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                        {weightKg} kg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight Control Controls */}
                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleAddWeight}
                    disabled={testedThreads[activeThread] !== undefined}
                    className="btn-3d-amber text-slate-950 font-black text-lg py-3.5 px-8 rounded-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Dumbbell className="w-5 h-5" />
                    <span>Add +10 kg Weight!</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setWeightKg(5);
                      setTestedThreads((p) => {
                        const next = { ...p };
                        delete next[activeThread];
                        return next;
                      });
                    }}
                    className="btn-3d-slate font-black text-sm py-3.5 px-6 rounded-2xl cursor-pointer"
                  >
                    Reset Thread
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ PHASE 3: SCIENCE LAW COMPARE ════ */}
          {currentPhase === 'COMPARE' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look at the scientific results! Nylon held 55 kg — even more than steel wire of identical thickness!"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="bg-white p-8 rounded-3xl border-4 border-emerald-300 shadow-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🏆</span>
                    <div>
                      <span className="text-xs font-black uppercase text-emerald-600">The Wow Science Fact</span>
                      <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Super-Strength of Nylon
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-700 font-bold leading-relaxed mb-6">
                    A nylon fibre is stronger than a steel wire of the same thickness! It is lightweight, flexible, and resists rot from water and microbes.
                  </p>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-black text-emerald-900 mt-auto">
                    🧪 Raw Materials: Petroleum, limestone, water, coal.
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border-4 border-sky-300 shadow-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12">
                      <ParachuteIllustration className="w-full h-full" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase text-sky-600">Everyday Uses</span>
                      <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Where Do We Use Nylon?
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-extrabold text-slate-800">
                    <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">🪂 Parachutes</span>
                    <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">🪢 Climbing Ropes</span>
                    <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">🪥 Toothbrush Bristles</span>
                    <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">🏕️ Sleeping Bags</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ PHASE 4: APPLY ════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-white p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl mb-6 w-full text-center">
                <span className="text-5xl mb-2 block animate-bounce">🧗‍♂️🪂</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Mountain Rescue Dilemma
                </h2>
                <p className="text-base text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  A rescue team needs a climbing rope that can hold the weight of 3 climbers, but is lightweight enough to carry up Mount Everest in a backpack.
                  Which material should the expedition choose?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sounds.fanfare();
                    handleNextPhase();
                  }}
                  className="p-8 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-4 border-emerald-400 shadow-lg text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="w-16 h-16 mb-2">
                    <NylonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-2xl text-slate-900 mb-1">Nylon Climbing Rope</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    Stronger than steel & feather-light ✓
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sounds.boing()}
                  className="p-8 rounded-3xl bg-white hover:bg-rose-50 border-4 border-slate-200 opacity-60 text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="w-16 h-16 mb-2">
                    <CottonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-2xl text-slate-900 mb-1">Cotton Rope</span>
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    Too weak — would snap under climber weight!
                  </span>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
