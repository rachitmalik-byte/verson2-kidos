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
import {
  RaincoatCottonIllustration,
  RaincoatSyntheticIllustration,
  ParachuteIllustration,
  NylonIllustration,
  WoolIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Droplet, Sparkles, Check, ArrowRight, ShieldCheck, Feather, Sun, AlertCircle } from 'lucide-react';

type Phase = 'HOOK' | 'INSPECT' | 'CHOOSE' | 'UNDERSTANDING' | 'PRACTICE' | 'APPLY';

export function RaincoatMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [initialChoice, setInitialChoice] = useState<'A' | 'B' | null>(null);
  const [testedWater, setTestedWater] = useState<{ a: boolean; b: boolean }>({ a: false, b: false });
  const [finalChoice, setFinalChoice] = useState<'A' | 'B' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeMatchObject, setActiveMatchObject] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'INSPECT', 'CHOOSE', 'UNDERSTANDING', 'PRACTICE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      // Complete mission and celebrate
      sounds.fanfare();
      completeMission('mission-01');
      addDiscovery({
        materialId: 'polyester',
        discoveredAt: Date.now(),
        properties: ['Water-resistant', 'Lightweight', 'Wrinkle-free'],
        uses: ['Raincoats', 'Sportswear', 'Umbrellas'],
        scienceWord: 'Synthetic fibre',
      });
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/2');
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
    if (currentPhase === 'HOOK') setInitialChoice(null);
    if (currentPhase === 'INSPECT') setTestedWater({ a: false, b: false });
    if (currentPhase === 'CHOOSE') {
      setFinalChoice(null);
      setSelectedReasons([]);
    }
    if (currentPhase === 'PRACTICE') {
      setMatches({});
      setActiveMatchObject(null);
    }
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return initialChoice !== null;
      case 'INSPECT':
        return testedWater.a && testedWater.b;
      case 'CHOOSE':
        return finalChoice === 'B' && selectedReasons.length >= 2;
      case 'UNDERSTANDING':
        return true;
      case 'PRACTICE':
        return Object.keys(matches).length === 3;
      case 'APPLY':
        return false;
      default:
        return false;
    }
  };

  return (
    <MissionLayout
      missionId="mission-01"
      missionNumber={1}
      missionTitle="The Raincoat Mystery"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-sky-100 via-blue-50 to-indigo-100"
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
              PHASE 1: HOOK (Storm Arrival)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Pip Dialogue Header */}
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="curious" size="lg" />
                <PipSpeechBubble
                  message="Look outside! A sudden rainstorm is rolling in! 🌧️ Which raincoat would you grab to stay dry?"
                  isVisible={true}
                />
              </div>

              {/* Raincoat Choice Bento Cards with Vector Illustrations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
                {/* Coat A: Cotton */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('A');
                  }}
                  className={`p-6 md:p-8 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden ${
                    initialChoice === 'A'
                      ? 'bg-amber-100/90 border-amber-500 shadow-2xl ring-6 ring-amber-300/60 scale-102'
                      : 'bg-white/95 border-amber-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="w-32 h-32 md:w-36 md:h-36 mb-3 flex items-center justify-center">
                    <RaincoatCottonIllustration className="w-full h-full" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-amber-200 text-amber-900 rounded-full mb-1">
                    Natural Cotton Weave
                  </span>
                  <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Raincoat A (Cotton)
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">Soft, woven natural plant fibre</p>

                  {initialChoice === 'A' && (
                    <div className="mt-4 px-4 py-1.5 bg-amber-500 text-white font-extrabold text-sm rounded-full flex items-center gap-1.5 shadow-md animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" /> Selected!
                    </div>
                  )}
                </motion.div>

                {/* Coat B: Polyester */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('B');
                  }}
                  className={`p-6 md:p-8 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden ${
                    initialChoice === 'B'
                      ? 'bg-sky-100/90 border-sky-500 shadow-2xl ring-6 ring-sky-300/60 scale-102'
                      : 'bg-white/95 border-sky-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="w-32 h-32 md:w-36 md:h-36 mb-3 flex items-center justify-center">
                    <RaincoatSyntheticIllustration className="w-full h-full" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-sky-200 text-sky-900 rounded-full mb-1">
                    Synthetic Polyester
                  </span>
                  <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Raincoat B (Polyester)
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">Smooth, waterproof polymer fabric</p>

                  {initialChoice === 'B' && (
                    <div className="mt-4 px-4 py-1.5 bg-sky-500 text-white font-extrabold text-sm rounded-full flex items-center gap-1.5 shadow-md animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" /> Selected!
                    </div>
                  )}
                </motion.div>
              </div>

              {initialChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={handleNextPhase}
                    className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    <span>Test In Hydro-Lab! 💧</span>
                    <ArrowRight className="w-6 h-6 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: INSPECT (Hydro-Dropper Test)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'INSPECT' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Let's spray water on both fabrics to see what happens under heavy rain! Tap both buttons!"
                  isVisible={true}
                />
              </div>

              {/* Two Hydro Testing Stations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Station A: Cotton */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-extrabold text-lg text-slate-800">Raincoat A (Cotton)</span>
                    <span className="text-xs font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase">
                      Plant Fibre
                    </span>
                  </div>

                  {/* Visual Test Screen */}
                  <div
                    className={`w-full h-48 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 border-3 ${
                      testedWater.a
                        ? 'bg-amber-100/90 border-amber-400'
                        : 'bg-slate-50 border-dashed border-slate-300'
                    }`}
                  >
                    {testedWater.a ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center text-center p-4"
                      >
                        <div className="w-16 h-16 mb-2">
                          <RaincoatCottonIllustration className="w-full h-full opacity-60 filter brightness-90" />
                        </div>
                        <span className="text-sm font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full mb-2">
                          ⚠️ Soaked Right In! (100% Wet)
                        </span>
                        <p className="text-xs font-bold text-slate-600 leading-snug">
                          Cotton absorbs water deep into its fibres, becoming soggy, heavy, and very slow to dry.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-2">
                          <RaincoatCottonIllustration className="w-full h-full" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          Ready for Water Test
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      setTestedWater((p) => ({ ...p, a: true }));
                    }}
                    disabled={testedWater.a}
                    className={`mt-5 w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.a
                        ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-default'
                        : 'bg-sky-500 hover:bg-sky-400 border-2 border-sky-700 shadow-[0_5px_0_#0369A1] active:translate-y-1 text-white'
                    }`}
                  >
                    <Droplet className="w-5 h-5 fill-current" />
                    <span>{testedWater.a ? '✓ Tested (Absorbs Water)' : 'Squirt Water Droplet! 💧'}</span>
                  </button>
                </div>

                {/* Station B: Polyester */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-200 shadow-xl flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-extrabold text-lg text-slate-800">Raincoat B (Polyester)</span>
                    <span className="text-xs font-black bg-sky-100 text-sky-800 px-3 py-1 rounded-full uppercase">
                      Synthetic Fibre
                    </span>
                  </div>

                  {/* Visual Test Screen */}
                  <div
                    className={`w-full h-48 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 border-3 ${
                      testedWater.b
                        ? 'bg-sky-100/90 border-sky-400'
                        : 'bg-slate-50 border-dashed border-slate-300'
                    }`}
                  >
                    {testedWater.b ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center text-center p-4"
                      >
                        <div className="w-16 h-16 mb-2">
                          <RaincoatSyntheticIllustration className="w-full h-full" />
                        </div>
                        <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-2">
                          ✨ Water Beads Up & Rolls Off! (0% Wet)
                        </span>
                        <p className="text-xs font-bold text-slate-600 leading-snug">
                          Polyester fibres do not absorb moisture. Rain slides off instantly, keeping you lightweight and dry!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-2">
                          <RaincoatSyntheticIllustration className="w-full h-full" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          Ready for Water Test
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      setTestedWater((p) => ({ ...p, b: true }));
                    }}
                    disabled={testedWater.b}
                    className={`mt-5 w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.b
                        ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-default'
                        : 'bg-sky-500 hover:bg-sky-400 border-2 border-sky-700 shadow-[0_5px_0_#0369A1] active:translate-y-1 text-white'
                    }`}
                  >
                    <Droplet className="w-5 h-5 fill-current" />
                    <span>{testedWater.b ? '✓ Tested (Waterproof)' : 'Squirt Water Droplet! 💧'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: CHOOSE & REASON
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'CHOOSE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="thinking" size="lg" />
                <PipSpeechBubble
                  message="Now that we saw the test, which raincoat keeps you dry in heavy rain? Pick it and select the reasons!"
                  isVisible={true}
                />
              </div>

              {/* Raincoat Choice Cards */}
              <div className="grid grid-cols-2 gap-6 w-full mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.boing();
                    setFinalChoice('A');
                  }}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer ${
                    finalChoice === 'A'
                      ? 'border-rose-400 bg-rose-50 shadow-md ring-4 ring-rose-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 h-20 mb-2">
                    <RaincoatCottonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-extrabold text-base text-slate-800">Raincoat A (Cotton)</span>
                  <span className="text-xs font-black text-rose-500 mt-1">Soaks up water (Not Waterproof)</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.success();
                    setFinalChoice('B');
                  }}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer ${
                    finalChoice === 'B'
                      ? 'border-emerald-500 bg-emerald-50 shadow-xl ring-6 ring-emerald-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 h-20 mb-2">
                    <RaincoatSyntheticIllustration className="w-full h-full" />
                  </div>
                  <span className="font-extrabold text-base text-slate-800">Raincoat B (Polyester)</span>
                  <span className="text-xs font-black text-emerald-600 mt-1">Waterproof & Repellent ✓</span>
                </motion.button>
              </div>

              {/* Reason Selection Bento */}
              {finalChoice === 'B' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white p-6 rounded-3xl border-3 border-emerald-200 shadow-xl"
                >
                  <h3 className="font-black text-slate-800 text-sm md:text-base mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Why is Polyester perfect for rain? (Select at least 2 superpower chips)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'bead', text: 'Water beads up & rolls right off', icon: '💧' },
                      { id: 'light', text: 'Stays feather-light and never soggy', icon: '🪶' },
                      { id: 'dry', text: 'Dries in just a few minutes', icon: '☀️' },
                      { id: 'wrinkle', text: 'Durable and wrinkle-free', icon: '✨' },
                    ].map((reason) => {
                      const isSelected = selectedReasons.includes(reason.id);
                      return (
                        <button
                          key={reason.id}
                          onClick={() => {
                            sounds.pop();
                            setSelectedReasons((prev) =>
                              isSelected ? prev.filter((r) => r !== reason.id) : [...prev, reason.id]
                            );
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl font-black text-xs md:text-sm border-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_#059669]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-xs'
                          }`}
                        >
                          <span className="text-2xl">{reason.icon}</span>
                          <span className="flex-1 text-left">{reason.text}</span>
                          {isSelected && <Check className="w-5 h-5 stroke-[3] ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (The Core Science Law)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look at that! You just discovered one of the golden laws of science and engineering!"
                  isVisible={true}
                />
              </div>

              {/* The 3-Step Science Conveyor Bento */}
              <div className="w-full bg-white p-6 md:p-10 rounded-3xl border-4 border-sky-300 shadow-2xl">
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-sky-600 mb-6 bg-sky-100 px-4 py-1.5 rounded-full w-fit mx-auto">
                  ⚡ The Golden Science Law
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Step 1: Material */}
                  <div className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-5xl mb-3">🧱</span>
                    <span className="font-black text-slate-800 text-lg">1. MATERIAL</span>
                    <p className="text-xs font-bold text-slate-500 mt-1">What something is MADE OF</p>
                    <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full mt-3">
                      e.g., Synthetic Polyester
                    </span>
                  </div>

                  {/* Step 2: Property */}
                  <div className="p-6 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-5xl mb-3">⚡</span>
                    <span className="font-black text-slate-800 text-lg">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-1">What it CAN DO</p>
                    <span className="text-xs font-black text-sky-900 bg-sky-200 px-3 py-1 rounded-full mt-3">
                      e.g., Water-Resistant & Light
                    </span>
                  </div>

                  {/* Step 3: Use */}
                  <div className="p-6 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-5xl mb-3">🎯</span>
                    <span className="font-black text-slate-800 text-lg">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-1">What it is USED FOR</p>
                    <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full mt-3">
                      e.g., Raincoats & Umbrellas
                    </span>
                  </div>
                </div>

                <div className="mt-8 text-center bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 text-sm text-slate-700 font-bold">
                  💡 <span className="text-sky-700 font-black">Scientist Secret:</span> We choose materials specifically for their superpower properties!
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 5: PRACTICE (Match Superpowers)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'PRACTICE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Match Objects to Superpowers! 🎯
                </h2>
                <p className="text-slate-600 font-bold text-sm">
                  Tap an object on the left, then tap its matching property on the right!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                {/* Left: Objects with Vector Icons */}
                <div className="space-y-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block text-center">
                    Everyday Object
                  </span>
                  {[
                    { id: 'raincoat', label: 'Raincoat', icon: <RaincoatSyntheticIllustration className="w-8 h-8" />, matchId: 'water' },
                    { id: 'rope', label: 'Nylon Climbing Rope', icon: <NylonIllustration className="w-8 h-8" />, matchId: 'strong' },
                    { id: 'blanket', label: 'Wool Blanket', icon: <WoolIllustration className="w-8 h-8" />, matchId: 'warm' },
                  ].map((obj) => {
                    const isMatched = matches[obj.id] !== undefined;
                    const isSelected = activeMatchObject === obj.id;

                    return (
                      <button
                        key={obj.id}
                        onClick={() => {
                          sounds.pop();
                          if (!isMatched) setActiveMatchObject(obj.id);
                        }}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border-3 flex items-center gap-3 transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-slate-800 opacity-90'
                            : isSelected
                            ? 'bg-sky-100 border-sky-500 shadow-lg ring-4 ring-sky-300 scale-102'
                            : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'
                        }`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                          {obj.icon}
                        </div>
                        <span className="font-extrabold text-sm text-slate-800 text-left">{obj.label}</span>
                        {isMatched && <Check className="w-5 h-5 text-emerald-600 stroke-[3] ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Properties */}
                <div className="space-y-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block text-center">
                    Superpower Property
                  </span>
                  {[
                    { id: 'water', label: 'Water-Resistant & Repellent', icon: '💧' },
                    { id: 'strong', label: 'High Tensile Strength (Super Tough)', icon: '💪' },
                    { id: 'warm', label: 'Traps Body Heat (Warm & Fluffy)', icon: '🔥' },
                  ].map((prop) => {
                    const isMatched = Object.values(matches).includes(prop.id);

                    return (
                      <button
                        key={prop.id}
                        onClick={() => {
                          if (activeMatchObject) {
                            const target = [
                              { id: 'raincoat', matchId: 'water' },
                              { id: 'rope', matchId: 'strong' },
                              { id: 'blanket', matchId: 'warm' },
                            ].find((o) => o.id === activeMatchObject);

                            if (target?.matchId === prop.id) {
                              sounds.success();
                              setMatches((prev) => ({ ...prev, [activeMatchObject]: prop.id }));
                              setActiveMatchObject(null);
                            } else {
                              sounds.boing();
                              setActiveMatchObject(null);
                            }
                          }
                        }}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border-3 flex items-center gap-3 transition-all ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-slate-800 opacity-90 cursor-default'
                            : activeMatchObject
                            ? 'bg-amber-50 border-amber-400 hover:bg-amber-100 cursor-pointer animate-pulse shadow-md'
                            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                        }`}
                      >
                        <span className="text-3xl">{prop.icon}</span>
                        <span className="font-extrabold text-xs text-slate-800">{prop.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {Object.keys(matches).length === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-800 shadow-md"
                >
                  🎉 Fantastic! All 3 superpowers connected! Ready for the Parachute challenge!
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 6: APPLY (Parachute Drop Challenge with Parachute Illustration)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl mb-6 w-full text-center flex flex-col items-center">
                <div className="w-24 h-24 mb-2 animate-bounce">
                  <ParachuteIllustration className="w-full h-full" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pip's Rescue Parachute Mission!
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  Pip needs to drop a heavy emergency supply crate safely from the sky. <br />
                  The parachute canopy must be <span className="text-sky-600 font-black">super strong</span> to hold the weight, but{' '}
                  <span className="text-emerald-600 font-black">feather-light</span> so it catches the wind!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  { id: 'wood', name: 'Solid Oak Wood', icon: <WoodIllustration className="w-14 h-14" />, isCorrect: false, hint: 'Too heavy to float!' },
                  { id: 'nylon', name: 'Synthetic Nylon / Polyester', icon: <NylonIllustration className="w-14 h-14" />, isCorrect: true, hint: 'Ultra-Strong & Feather-Light! ✓' },
                  { id: 'glass', name: 'Glass Window Plate', icon: <span className="text-5xl">🪟</span>, isCorrect: false, hint: 'Brittle — will shatter!' },
                  { id: 'clay', name: 'Wet Mud & Clay', icon: <span className="text-5xl">🧱</span>, isCorrect: false, hint: 'Too weak — will crumble!' },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (item.isCorrect) {
                        sounds.fanfare();
                        handleNextPhase();
                      } else {
                        sounds.boing();
                      }
                    }}
                    className={`p-6 rounded-3xl border-4 text-center flex flex-col items-center transition-all cursor-pointer ${
                      item.isCorrect
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-400 shadow-lg hover:shadow-2xl'
                        : 'bg-white hover:bg-rose-50 border-slate-200 shadow-sm opacity-80'
                    }`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <span className="font-black text-base text-slate-800 mb-1">{item.name}</span>
                    <span className="text-xs font-bold text-slate-500">{item.hint}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
