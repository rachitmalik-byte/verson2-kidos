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
  RaincoatCottonIllustration,
  RaincoatSyntheticIllustration,
  ParachuteIllustration,
  NylonIllustration,
  WoolIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Droplet, Sparkles, Check, ArrowRight, ShieldCheck, Feather, Sun, AlertCircle, Lightbulb } from 'lucide-react';
import { bgmEngine } from '@/lib/bgmEngine';

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

  // Pedagogical coaching feedback state
  const [feedback, setFeedback] = useState<{ message: string; mood: 'curious' | 'encouraging' | 'celebrating' | 'thinking'; type: 'correct' | 'hint' | 'neutral' } | null>(null);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const isTourActive = useProgressStore((state) => state.isTourActive);
  const endTour = useProgressStore((state) => state.endTour);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'INSPECT', 'CHOOSE', 'UNDERSTANDING', 'PRACTICE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  // Dynamic Case-Themed BGM Track Switching
  React.useEffect(() => {
    if (currentPhase === 'HOOK' || currentPhase === 'INSPECT') {
      bgmEngine.setTrack('rainy-storm');
    } else if (currentPhase === 'PRACTICE') {
      bgmEngine.setTrack('high-energy-sprint');
    } else if (currentPhase === 'APPLY') {
      bgmEngine.setTrack('sky-rescue');
    } else {
      bgmEngine.setTrack('playful-lab');
    }
  }, [currentPhase]);


  const handleNextPhase = () => {
    setFeedback(null);
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      if (isTourActive) endTour();
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
    setFeedback(null);
    if (currentStepIndex > 0) {
      sounds.pop();
      setCurrentPhase(phaseOrder[currentStepIndex - 1]);
    }
  };

  const handleRedoPhase = () => {
    sounds.pop();
    setFeedback(null);
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

  const isStepComplete = (): boolean => {
    switch (currentPhase) {
      case 'HOOK':
        return initialChoice !== null;
      case 'INSPECT':
        return testedWater.a && testedWater.b;
      case 'CHOOSE':
        return finalChoice !== null && selectedReasons.length > 0;
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

  // Mismatch Pedagogical Explanations
  const getMismatchFeedback = (objectId: string, propId: string): string => {
    if (objectId === 'raincoat') {
      if (propId === 'strong') {
        return "Raincoats don't need to lift heavy mountain climbers! Their main superpower is shedding water droplets so you stay 100% dry in a downpour.";
      }
      if (propId === 'warm') {
        return "Raincoats are thin shells designed to block water, not thick fluffy sweaters. What does a raincoat do when it rains?";
      }
    }
    if (objectId === 'rope') {
      if (propId === 'water') {
        return "While synthetic nylon doesn't rot in rain, a climber's life depends on its extreme tensile strength — holding heavy pulling force without snapping!";
      }
      if (propId === 'warm') {
        return "Climbing ropes don't keep you cozy like a blanket! Their superpower is holding 50+ kilograms of pulling weight.";
      }
    }
    if (objectId === 'blanket') {
      if (propId === 'water') {
        return "Remember our rain test! Natural wool fibres soak up water like a sponge! Wool's true superpower is trapping warm air to keep you cozy.";
      }
      if (propId === 'strong') {
        return "Wool yarn can be snapped apart by hand. Wool's superpower is its curly fibres that trap body heat!";
      }
    }
    return 'Hmm! Think about what this object is used for in everyday life. Try matching its main superpower!';
  };

  return (
    <MissionLayout
      missionId="mission-01"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedoPhase}
    >
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => setShowCelebration(false)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center py-4"
        >
          {/* Assisted Level 1 Walkthrough Banner */}
          {isTourActive && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl mx-auto mb-4 p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 rounded-2xl font-black text-xs md:text-sm shadow-xl flex items-center justify-between gap-3 border-2 border-amber-300"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-slate-950 shrink-0 animate-spin" />
                <span>
                  {currentPhase === 'HOOK' && '🌧️ Assisted Tour: Tap either raincoat card above to begin your rain test!'}
                  {currentPhase === 'INSPECT' && '💧 Assisted Tour: Tap "Pour Rain Water" on both coats to test water resistance!'}
                  {currentPhase === 'CHOOSE' && '✨ Assisted Tour: Select Raincoat B and pick why it works best!'}
                  {currentPhase === 'UNDERSTANDING' && '🧱 Assisted Tour: Review the golden rule: Material → Property → Use!'}
                  {currentPhase === 'PRACTICE' && '🎯 Assisted Tour: Tap an object on the left, then tap its matching superpower on the right!'}
                  {currentPhase === 'APPLY' && '🪂 Assisted Tour: Select Nylon for Pip’s parachute — it’s strong and lightweight!'}
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.pop();
                  endTour();
                }}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs shrink-0"
              >
                End Tour
              </button>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 1: HOOK (Storm Arrival)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="curious" size="lg" />
                <PipSpeechBubble
                  message="Look outside! A sudden rainstorm is rolling in! 🌧️ Which raincoat would you grab to stay dry?"
                  isVisible={true}
                />
              </div>

              <div id="mission-testing-rig" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
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
                  <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-amber-300">
                    Traditional Coat A
                  </span>
                  <div className="w-40 h-40 flex items-center justify-center my-2">
                    <RaincoatCottonIllustration className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Woven Fabric Coat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-1">
                    Made of thick natural cotton weave
                  </p>
                  {initialChoice === 'A' && (
                    <div className="mt-4 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" /> Selected
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
                  <span className="px-3 py-1 bg-sky-200 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-sky-300">
                    Modern Coat B
                  </span>
                  <div className="w-40 h-40 flex items-center justify-center my-2">
                    <RaincoatSyntheticIllustration className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Sleek Shiny Coat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-1">
                    Made of smooth synthetic polyester
                  </p>
                  {initialChoice === 'B' && (
                    <div className="mt-4 px-4 py-1.5 bg-sky-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" /> Selected
                    </div>
                  )}
                </motion.div>
              </div>

              {initialChoice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex flex-col items-center"
                >
                  <p className="text-sm font-extrabold text-slate-700 mb-3 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-xs">
                    Great pick! Tap <span className="text-amber-600 font-black">Next Step →</span> below to test them with the water sprayer!
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: INSPECT (Hydro-Dropper Spray Test)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'INSPECT' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Let's spray water on both fabrics to see what happens under heavy rain! Tap both spray buttons!"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Coat A Test Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase mb-3">
                    Plant Fibre (Cotton)
                  </span>
                  <div className="w-36 h-36 flex items-center justify-center my-2 relative">
                    <RaincoatCottonIllustration className="w-full h-full" />
                    {testedWater.a && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-blue-900/20 rounded-2xl flex items-center justify-center backdrop-blur-xs"
                      >
                        <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                          💦 Soaked & Absorbed!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      setTestedWater((prev) => ({ ...prev, a: true }));
                    }}
                    className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.a
                        ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md active:scale-95'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    {testedWater.a ? 'Soaked (Absorbs Water)' : 'Spray Water on Cotton! 🚿'}
                  </button>

                  {testedWater.a && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs font-bold text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 w-full text-center"
                    >
                      Cotton fibres have tiny pores that soak up water like a sponge.
                    </motion.div>
                  )}
                </div>

                {/* Coat B Test Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-sky-200 shadow-xl flex flex-col items-center relative">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-black uppercase mb-3">
                    Synthetic Fibre (Polyester)
                  </span>
                  <div className="w-36 h-36 flex items-center justify-center my-2 relative">
                    <RaincoatSyntheticIllustration className="w-full h-full" />
                    {testedWater.b && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                          ✨ 100% Water Beads Off!
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      setTestedWater((prev) => ({ ...prev, b: true }));
                    }}
                    className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.b
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    {testedWater.b ? 'Waterproof (Rolls Off)' : 'Spray Water on Polyester! 🚿'}
                  </button>

                  {testedWater.b && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs font-bold text-slate-600 bg-sky-50 p-3 rounded-xl border border-sky-200 w-full text-center"
                    >
                      Synthetic polyester fibres are non-porous. Rain beads up and slides off!
                    </motion.div>
                  )}
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
                  message="Now that you tested both, which raincoat is best for heavy rain? And why?"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <button
                  onClick={() => {
                    sounds.pop();
                    setFinalChoice('A');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    finalChoice === 'A'
                      ? 'bg-amber-100 border-amber-500 shadow-lg scale-102 ring-4 ring-amber-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <RaincoatCottonIllustration className="w-16 h-16" />
                  <span>Choose Cotton (Coat A)</span>
                </button>

                <button
                  onClick={() => {
                    sounds.pop();
                    setFinalChoice('B');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    finalChoice === 'B'
                      ? 'bg-sky-100 border-sky-500 shadow-lg scale-102 ring-4 ring-sky-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <RaincoatSyntheticIllustration className="w-16 h-16" />
                  <span>Choose Polyester (Coat B)</span>
                </button>
              </div>

              {finalChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white p-6 rounded-3xl border-3 border-amber-300 shadow-xl"
                >
                  <h4 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-3 text-center">
                    Why did you pick that one? (Select all that apply)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'waterproof', label: 'Repels water & stays dry 💧' },
                      { id: 'light', label: 'Lightweight to carry 🪶' },
                      { id: 'quickdry', label: 'Dries very quickly ☀️' },
                      { id: 'comfort', label: 'Feels soft on skin ☁️' },
                    ].map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => {
                          sounds.pop();
                          setSelectedReasons((prev) =>
                            prev.includes(reason.id)
                              ? prev.filter((r) => r !== reason.id)
                              : [...prev, reason.id]
                          );
                        }}
                        className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                          selectedReasons.includes(reason.id)
                            ? 'bg-amber-100 border-amber-500 text-amber-950 font-black'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{reason.label}</span>
                        {selectedReasons.includes(reason.id) && (
                          <Check className="w-4 h-4 text-amber-600 stroke-[3]" />
                        )}
                      </button>
                    ))}
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
                  message="Look at that! You just discovered one of the golden laws of science: Material decides Property, which decides Use!"
                  isVisible={true}
                />
              </div>

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
              PHASE 5: PRACTICE (Match Superpowers with Pedagogical Coaching)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'PRACTICE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Match Objects to Superpowers! 🎯
                </h2>
                <p className="text-slate-600 font-bold text-xs md:text-sm">
                  Tap an object on the left, then tap its matching superpower property on the right!
                </p>
              </div>

              {/* Pip Active Coaching & Explanation Speech Bubble */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full mb-5 flex items-center gap-3 bg-white p-4 rounded-3xl border-3 border-amber-400 shadow-lg"
                >
                  <Pip mood={feedback.mood} size="md" />
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {feedback.type === 'correct' ? '🎉 Great Science Observation!' : '💡 Pip\'s Science Coach'}
                    </span>
                    <p className="text-xs md:text-sm font-extrabold text-slate-800 mt-1 leading-snug">
                      {feedback.message}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                {/* Left: Objects */}
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
                          if (!isMatched) {
                            setActiveMatchObject(obj.id);
                            setFeedback({
                              mood: 'curious',
                              type: 'hint',
                              message: `You selected "${obj.label}". Now look on the right: what is its most important superpower?`,
                            });
                            voiceAssistant.speak(`You selected ${obj.label}. Now tap its superpower property on the right!`);
                          }
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
                    { id: 'water', label: 'Water-Resistant & Repellent', icon: '💧', desc: 'Raindrops bead up and roll off!' },
                    { id: 'strong', label: 'High Tensile Strength (Super Tough)', icon: '💪', desc: 'Holds extreme weight without snapping!' },
                    { id: 'warm', label: 'Traps Body Heat (Warm & Fluffy)', icon: '🔥', desc: 'Curly fibres hold cozy warm air!' },
                  ].map((prop) => {
                    const isMatched = Object.values(matches).includes(prop.id);

                    return (
                      <button
                        key={prop.id}
                        onClick={() => {
                          if (activeMatchObject) {
                            const target = [
                              { id: 'raincoat', matchId: 'water', name: 'Raincoat' },
                              { id: 'rope', matchId: 'strong', name: 'Nylon Climbing Rope' },
                              { id: 'blanket', matchId: 'warm', name: 'Wool Blanket' },
                            ].find((o) => o.id === activeMatchObject);

                            if (target?.matchId === prop.id) {
                              sounds.success();
                              setMatches((prev) => ({ ...prev, [activeMatchObject]: prop.id }));
                              setActiveMatchObject(null);

                              let correctReason = '';
                              if (prop.id === 'water') correctReason = 'Spot on! Raincoats are made of synthetic polyester so water droplets bead right off!';
                              if (prop.id === 'strong') correctReason = 'Bingo! Nylon fibres are stronger than steel wire of the same thickness — holding heavy climbers safely!';
                              if (prop.id === 'warm') correctReason = 'Exactly! Wool fibres have tiny curly pockets that trap warm body heat during cold nights!';

                              setFeedback({
                                mood: 'celebrating',
                                type: 'correct',
                                message: correctReason,
                              });
                              voiceAssistant.speak(correctReason);
                            } else {
                              sounds.boing();
                              const explanation = getMismatchFeedback(activeMatchObject, prop.id);
                              setFeedback({
                                mood: 'thinking',
                                type: 'hint',
                                message: explanation,
                              });
                              voiceAssistant.speak(explanation);
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
                        <div className="text-left">
                          <span className="font-extrabold text-xs md:text-sm text-slate-800 block">{prop.label}</span>
                          <span className="text-[10px] text-slate-500 font-bold block">{prop.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {Object.keys(matches).length === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-800 shadow-md w-full"
                >
                  🎉 Fantastic thinking! All 3 superpowers connected! Tap Next Step → below for the Parachute challenge!
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 6: APPLY (Parachute Drop Challenge with Coaching)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl mb-5 w-full text-center flex flex-col items-center">
                <div className="w-24 h-24 mb-2 animate-bounce">
                  <ParachuteIllustration className="w-full h-full" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pip's Rescue Parachute Mission! 🪂
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  Pip needs to drop a heavy emergency supply crate safely from the sky. <br />
                  The parachute canopy must be <span className="text-sky-600 font-black">super strong</span> to hold the weight, but{' '}
                  <span className="text-emerald-600 font-black">feather-light and flexible</span> so it catches the wind!
                </p>
              </div>

              {/* Pip Feedback Banner for Parachute Challenge */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-4 flex items-center gap-3 bg-white p-4 rounded-3xl border-3 border-indigo-400 shadow-md"
                >
                  <Pip mood={feedback.mood} size="md" />
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      {feedback.type === 'correct' ? '🎉 Mission Success!' : '💡 Think About Material Properties'}
                    </span>
                    <p className="text-xs md:text-sm font-extrabold text-slate-800 mt-1">
                      {feedback.message}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  {
                    id: 'wood',
                    name: 'Solid Oak Wood',
                    icon: <WoodIllustration className="w-14 h-14" />,
                    isCorrect: false,
                    wrongExplanation: 'Wood is strong, but it is way too heavy and rigid to fold into a parachute canopy! We need a feather-light flexible fabric.',
                  },
                  {
                    id: 'nylon',
                    name: 'Synthetic Nylon / Polyester',
                    icon: <NylonIllustration className="w-14 h-14" />,
                    isCorrect: true,
                    correctExplanation: 'Brilliant scientist thinking! Synthetic nylon is ultra-strong, tear-resistant, and feather-light — catching the wind to float down safely!',
                  },
                  {
                    id: 'glass',
                    name: 'Glass Window Plate',
                    icon: <span className="text-5xl">🪟</span>,
                    isCorrect: false,
                    wrongExplanation: 'Glass is stiff and brittle — it would shatter into sharp pieces immediately under air pressure! Parachutes need flexible woven fibres.',
                  },
                  {
                    id: 'clay',
                    name: 'Wet Mud & Clay',
                    icon: <span className="text-5xl">🧱</span>,
                    isCorrect: false,
                    wrongExplanation: 'Wet clay is heavy, sticky, and crumbles apart when pulled! It has almost zero tensile strength.',
                  },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (item.isCorrect) {
                        sounds.fanfare();
                        setFeedback({
                          mood: 'celebrating',
                          type: 'correct',
                          message: item.correctExplanation,
                        });
                        voiceAssistant.speak(item.correctExplanation, () => {
                          handleNextPhase();
                        });
                      } else {
                        sounds.boing();
                        setFeedback({
                          mood: 'thinking',
                          type: 'hint',
                          message: item.wrongExplanation,
                        });
                        voiceAssistant.speak(item.wrongExplanation);
                      }
                    }}
                    className={`p-5 rounded-3xl border-4 text-center flex flex-col items-center transition-all cursor-pointer ${
                      item.isCorrect
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-400 shadow-lg hover:shadow-2xl'
                        : 'bg-white hover:bg-rose-50 border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <span className="font-black text-sm md:text-base text-slate-800 mb-1">{item.name}</span>
                    <span className="text-[11px] font-extrabold text-slate-500">Tap to test material</span>
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
