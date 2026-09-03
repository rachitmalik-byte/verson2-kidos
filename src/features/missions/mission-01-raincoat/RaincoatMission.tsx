import cottonZoomGif from '@/assets/videos/cotton_zoom_microstructure.gif';
import polyesterZoomGif from '@/assets/videos/polyester_zoom_weave.gif';
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
import {
  WoolIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Droplet, Sparkles, Check, ArrowRight, ShieldCheck, Feather, Sun, AlertCircle, Lightbulb, ZoomIn } from 'lucide-react';
import { bgmEngine } from '@/lib/bgmEngine';
import { ExperimentFocusSpotlight } from '@/components/interactive/ExperimentFocusSpotlight';
import { useFXStore } from '@/stores/fxStore';

// Real Minimal Isolated Photography Assets
import cottonCoatDryImg from '@/assets/images/raincoat/cotton_coat_dry.jpg';
import cottonCoatSoakedImg from '@/assets/images/raincoat/cotton_coat_soaked.jpg';
import polyesterRaincoatDryImg from '@/assets/images/raincoat/polyester_raincoat_dry.jpg';
import polyesterRaincoatWaterproofImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import personWetCottonImg from '@/assets/images/raincoat/person_wet_cotton.jpg';
import personDryRaincoatImg from '@/assets/images/raincoat/person_dry_raincoat.jpg';
import cottonFabricZoomImg from '@/assets/images/raincoat/cotton_fabric_zoom.jpg';
import polyesterFabricZoomImg from '@/assets/images/raincoat/polyester_fabric_zoom.jpg';
import nylonParachuteSkyImg from '@/assets/images/raincoat/nylon_parachute_sky.jpg';

type Phase = 'HOOK' | 'INSPECT' | 'CHOOSE' | 'UNDERSTANDING' | 'PRACTICE' | 'APPLY';

export function RaincoatMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [initialChoice, setInitialChoice] = useState<'A' | 'B' | null>(null);
  const [testedWater, setTestedWater] = useState<{ a: boolean; b: boolean }>({ a: false, b: false });
  const [isSprayingA, setIsSprayingA] = useState(false);
  const [isSprayingB, setIsSprayingB] = useState(false);
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'cotton' | 'polyester'>('cotton');
  const [microscopeZoomLevel, setMicroscopeZoomLevel] = useState<number>(250);
  const [finalChoice, setFinalChoice] = useState<'A' | 'B' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeMatchObject, setActiveMatchObject] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Pedagogical coaching feedback state
  const [feedback, setFeedback] = useState<{
    message: string;
    mood: 'curious' | 'encouraging' | 'celebrating' | 'thinking';
    type: 'correct' | 'hint' | 'neutral';
  } | null>(null);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const isTourActive = useProgressStore((state) => state.isTourActive);
  const endTour = useProgressStore((state) => state.endTour);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'INSPECT', 'CHOOSE', 'UNDERSTANDING', 'PRACTICE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  // Dynamic Case-Themed BGM Track Switching & Speech Cancellation
  React.useEffect(() => {
    voiceAssistant.stop();
    if (currentPhase === 'HOOK' || currentPhase === 'INSPECT') {
      bgmEngine.setTrack('rainy-storm');
    } else if (currentPhase === 'PRACTICE') {
      bgmEngine.setTrack('high-energy-sprint');
    } else if (currentPhase === 'APPLY') {
      bgmEngine.setTrack('sky-rescue');
    } else {
      bgmEngine.setTrack('playful-lab');
    }
    return () => {
      voiceAssistant.stop();
    };
  }, [currentPhase]);

  const handleNextPhase = () => {
    voiceAssistant.stop();
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
        onComplete={() => {
          setShowCelebration(false);
          navigate('/chapter/3/mission/2');
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center py-4 font-sans"
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
              PHASE 1: HOOK (Storm Arrival - Real Isolated Photo Comparison)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="curious" size="md" />
                <PipSpeechBubble
                  message="Look outside! A sudden rainstorm is rolling in! 🌧️ Which raincoat would you grab to stay completely dry?"
                  isVisible={true}
                />
              </div>

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-950 rounded-full font-black text-xs sm:text-sm border border-amber-300 animate-pulse shadow-xs">
                  👇 Choose a raincoat below to continue!
                </span>
              </div>

              <div id="mission-testing-rig" className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-1">
                {/* Coat A: Real Dry Cotton Trench Coat */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('A');
                  }}
                  className={`p-4 sm:p-5 rounded-3xl border-3 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden bg-white ${
                    initialChoice === 'A'
                      ? 'border-amber-500 shadow-xl ring-4 ring-amber-300/60 scale-102'
                      : 'border-slate-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  <span className="px-3 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
                    Traditional Coat A
                  </span>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-inner my-1.5 border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                    <img
                      src={cottonCoatDryImg}
                      alt="Dry Natural Cotton Trench Coat"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Woven Cotton Fabric Coat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
                    Made from natural cotton plant fibers
                  </p>
                  {initialChoice === 'A' && (
                    <div className="mt-2 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
                    </div>
                  )}
                </motion.div>

                {/* Coat B: Real Dry Synthetic Polyester Raincoat */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('B');
                  }}
                  className={`p-4 sm:p-5 rounded-3xl border-3 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden bg-white ${
                    initialChoice === 'B'
                      ? 'border-sky-500 shadow-xl ring-4 ring-sky-300/60 scale-102'
                      : 'border-slate-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  <span className="px-3 py-0.5 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-sky-300">
                    Modern Raincoat B
                  </span>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-inner my-1.5 border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                    <img
                      src={polyesterRaincoatDryImg}
                      alt="Dry Synthetic Polyester Raincoat"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Synthetic Polyester Raincoat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
                    Made from smooth water-resistant fibers
                  </p>
                  {initialChoice === 'B' && (
                    <div className="mt-2 px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
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
                  <p className="text-sm font-extrabold text-slate-700 mb-3 bg-white px-5 py-2.5 rounded-full border-2 border-slate-200 shadow-sm">
                    Great pick! Tap <span className="text-amber-600 font-black">Next Step →</span> below to test them with the water sprayer!
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: INSPECT (Real Before & After Rain Water Spray Experiment)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'INSPECT' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="md" />
                <PipSpeechBubble
                  message="Let's spray water on both fabrics to see real water absorption vs water beading! Tap both spray buttons!"
                  isVisible={true}
                />
              </div>

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-100 text-sky-950 rounded-full font-black text-xs sm:text-sm border border-sky-300 animate-pulse shadow-xs">
                  👇 Tap "Spray Water" on BOTH coats to test them!
                </span>
              </div>

              <ExperimentFocusSpotlight
                isActive={isSprayingA || isSprayingB}
                activeLabel="💧 Water Spray Absorption & Beading Test..."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {/* Coat A Test Card: Cotton Absorption */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-3 border-amber-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <span className="px-3 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase">
                      Plant Fibre (Natural Cotton)
                    </span>
                    {testedWater.a && (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 rounded-full text-[10px] font-black">
                        💦 Water Soaked In!
                      </span>
                    )}
                  </div>

                  {/* Real Photo with Live Wet Transition & Water Mist Ripple */}
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-inner my-1.5 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={testedWater.a ? 'soaked' : 'dry'}
                        src={testedWater.a ? cottonCoatSoakedImg : cottonCoatDryImg}
                        alt="Cotton Coat Experiment"
                        initial={{ opacity: 0.4, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.4, scale: 1.04 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full h-full object-contain p-1"
                      />
                    </AnimatePresence>

                    {/* Spray Shower Particle Wave Effect */}
                    {isSprayingA && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1.8] }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 bg-blue-500/20 rounded-2xl pointer-events-none flex items-center justify-center text-4xl"
                      >
                        🚿💦💧
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      useFXStore.getState().triggerFX('rain', 3500);
                      setIsSprayingA(true);
                      setTimeout(() => {
                        setTestedWater((prev) => ({ ...prev, a: true }));
                        setIsSprayingA(false);
                      }, 400);
                    }}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.a
                        ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md active:scale-95'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    {testedWater.a ? 'Drenched & Heavy (Water Absorbed)' : 'Spray Water on Cotton! 🚿'}
                  </button>

                  {testedWater.a && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="mt-3 bg-gradient-to-b from-amber-50 to-rose-50 p-3 rounded-2xl border-2 border-amber-300 w-full flex flex-col items-center text-center shadow-sm"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-rose-300 shadow-sm mb-1.5 bg-white flex items-center justify-center p-1">
                        <img
                          src={personWetCottonImg}
                          alt="Child drenched in cotton coat"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-black text-xs text-rose-700 block">
                        🥶 RESULT: Child Gets Soaked & Cold!
                      </span>
                      <p className="text-[11px] font-bold text-slate-600 mt-0.5 leading-snug max-w-xs">
                        Water soaked straight through the natural cotton fibers! The clothes underneath are wet.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Coat B Test Card: Synthetic Polyester Water Beading */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-3 border-sky-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <span className="px-3 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs font-black uppercase">
                      Synthetic Fibre (Polyester)
                    </span>
                    {testedWater.b && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full text-[10px] font-black">
                        ✨ 100% Water Beads Off!
                      </span>
                    )}
                  </div>

                  {/* Real Photo with Live Waterproof Droplets Transformation */}
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-inner my-1.5 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={testedWater.b ? 'waterproof' : 'dry'}
                        src={testedWater.b ? polyesterRaincoatWaterproofImg : polyesterRaincoatDryImg}
                        alt="Synthetic Raincoat Experiment"
                        initial={{ opacity: 0.4, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.4, scale: 1.04 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full h-full object-contain p-1"
                      />
                    </AnimatePresence>

                    {/* Spray Shower Particle Wave Effect */}
                    {isSprayingB && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1.8] }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 bg-sky-400/20 rounded-2xl pointer-events-none flex items-center justify-center text-4xl"
                      >
                        🚿✨💧
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.splash();
                      useFXStore.getState().triggerFX('rain', 3500);
                      setIsSprayingB(true);
                      setTimeout(() => {
                        setTestedWater((prev) => ({ ...prev, b: true }));
                        setIsSprayingB(false);
                      }, 400);
                    }}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      testedWater.b
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    {testedWater.b ? 'Waterproof (Droplets Roll Off)' : 'Spray Water on Polyester! 🚿'}
                  </button>

                  {testedWater.b && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="mt-3 bg-gradient-to-b from-sky-50 to-emerald-50 p-3 rounded-2xl border-2 border-sky-300 w-full flex flex-col items-center text-center shadow-sm"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-sm mb-1.5 bg-white flex items-center justify-center p-1">
                        <img
                          src={personDryRaincoatImg}
                          alt="Child dry in synthetic raincoat"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-black text-xs text-emerald-700 block">
                        😄 RESULT: Child Stays 100% Cozy & Dry!
                      </span>
                      <p className="text-[11px] font-bold text-slate-600 mt-0.5 leading-snug max-w-xs">
                        Raindrops formed round beads and rolled right off the coat like an invisible shield!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </ExperimentFocusSpotlight>
          </div>
        )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: CHOOSE & REASON (Clean, Well-Formatted Layout)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'CHOOSE' && (
            <div className="w-full max-w-3xl flex flex-col items-center gap-3">
              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-100 text-sky-950 rounded-full font-black text-xs sm:text-sm border border-sky-300 animate-pulse shadow-xs">
                  👇 Choose which coat you would wear, then select your reasons!
                </span>
              </div>

              {/* Pip Speech Banner (Neat & Aligned) */}
              <div className="flex items-center gap-3 w-full bg-white/90 p-3 rounded-2xl border-2 border-violet-200 shadow-sm">
                <Pip mood="thinking" size="sm" />
                <div className="flex-1">
                  <span className="text-[11px] font-black uppercase text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full">
                    Pip's Science Question 💡
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1">
                    Now that you tested both coats with water, which raincoat keeps you dry in heavy rain? And why?
                  </p>
                </div>
              </div>

              {/* 2 Clean Raincoat Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* Coat A: Cotton */}
                <button
                  onClick={() => {
                    sounds.pop();
                    setFinalChoice('A');
                  }}
                  className={`p-4 rounded-3xl border-3 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    finalChoice === 'A'
                      ? 'bg-amber-50 border-amber-500 shadow-lg scale-102 ring-4 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 overflow-hidden">
                    <img src={cottonCoatSoakedImg} alt="Cotton soaked" className="h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-slate-900 block">🌿 Coat A: Natural Cotton</span>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      Soaks in Water 💦
                    </span>
                  </div>
                </button>

                {/* Coat B: Polyester */}
                <button
                  onClick={() => {
                    sounds.pop();
                    setFinalChoice('B');
                  }}
                  className={`p-4 rounded-3xl border-3 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    finalChoice === 'B'
                      ? 'bg-sky-50 border-sky-500 shadow-lg scale-102 ring-4 ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 overflow-hidden">
                    <img src={polyesterRaincoatWaterproofImg} alt="Polyester waterproof" className="h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-slate-900 block">🧥 Coat B: Synthetic Polyester</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      100% Waterproof ✨
                    </span>
                  </div>
                </button>
              </div>

              {/* Reason Selector (Clean & Uncluttered) */}
              {finalChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center"
                >
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 mb-2.5 text-center">
                    Why did you pick {finalChoice === 'A' ? 'Coat A' : 'Coat B'}? (Select all reasons):
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    {[
                      { id: 'waterproof', label: 'Raindrops bead up and roll off 💧', correctFor: 'B' },
                      { id: 'light', label: 'It is lightweight and easy to carry 🪶', correctFor: 'B' },
                      { id: 'fast_dry', label: 'It dries quickly in the wind ☀️', correctFor: 'B' },
                      { id: 'soft', label: 'It feels soft like a normal shirt ☁️', correctFor: 'A' },
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
                          className={`px-3.5 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-xs scale-102'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{reason.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (Interactive Microscope Lab Stage + Science Law)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="md" />
                <PipSpeechBubble
                  message="Let's place both fabrics under the high-powered microscope! Tap the buttons below to switch materials and zoom in!"
                  isVisible={true}
                />
              </div>

              {/* ── IMMERSIVE INTERACTIVE MICROSCOPE STAGE ── */}
              <div className="w-full bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center relative overflow-hidden mb-8">
                {/* Header & Reticle HUD */}
                <div className="flex items-center justify-between w-full mb-4 z-10 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Optical Fabric Microscope Studio</span>
                  </span>

                  {/* Magnification Zoom Selector */}
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

                  {/* Optical Reticle Crosshairs & Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-cyan-400/30 absolute" />
                    <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
                    <div className="w-24 h-24 rounded-full border border-cyan-400/40 absolute" />
                    <div className="w-44 h-44 rounded-full border border-cyan-400/20 absolute" />
                  </div>

                  {/* Glass Reflection Flare */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                </div>

                {/* Specimen Switcher Buttons */}
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
                    <span>🌿 Examine Natural Cotton</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('polyester');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'polyester'
                        ? 'bg-sky-400 border-sky-300 text-slate-950 shadow-lg scale-102 ring-4 ring-sky-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>⚡ Examine Synthetic Polyester</span>
                  </button>
                </div>

                {/* Explanatory Callout Box */}
                <motion.div
                  key={activeMicroscopeSpecimen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 w-full max-w-xl text-center z-10"
                >
                  {activeMicroscopeSpecimen === 'cotton' ? (
                    <div>
                      <span className="font-black text-xs md:text-sm text-amber-300 block mb-1">
                        🔬 Natural Cotton: Porous Spongy Network 🧽
                      </span>
                      <p className="text-xs text-slate-300 font-bold leading-relaxed">
                        Notice the open woven plant fibers! Natural cotton threads have microscopic channels that pull in water molecules and trap them inside like a sponge.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-black text-xs md:text-sm text-sky-300 block mb-1">
                        🔬 Synthetic Polyester: Hydrophobic Shield 🛡️
                      </span>
                      <p className="text-xs text-slate-300 font-bold leading-relaxed">
                        Notice the tight, smooth synthetic polymer weave! Water cannot penetrate the surface tension — raindrops are forced to bead into perfect spheres and roll right off!
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── THE GOLDEN SCIENCE LAW ── */}
              <div className="w-full bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl">
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-sky-600 mb-6 bg-sky-100 px-4 py-1.5 rounded-full w-fit mx-auto">
                  ⚡ The Golden Science Law
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🧱</span>
                    <span className="font-black text-slate-800 text-base">1. MATERIAL</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is MADE OF</p>
                    <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full mt-2">
                      Synthetic Polyester
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it CAN DO</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      Water-Resistant & Light
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is USED FOR</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      Raincoats & Umbrellas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 5: PRACTICE (Match Superpowers)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'PRACTICE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Match Objects to Superpowers! 🎯
                </h2>
                <p className="text-slate-600 font-bold text-xs md:text-sm">
                  Match each everyday object with its most useful superpower!
                </p>
              </div>

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-950 rounded-full font-black text-xs sm:text-sm border border-amber-300 animate-pulse shadow-xs">
                  👇 Tap an object on the left, then tap its matching superpower on the right!
                </span>
              </div>

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
                    { id: 'raincoat', label: 'Synthetic Raincoat', img: polyesterRaincoatWaterproofImg, matchId: 'water' },
                    { id: 'rope', label: 'Nylon Climbing Rope', img: nylonParachuteSkyImg, matchId: 'strong' },
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
                        className={`w-full p-3.5 rounded-2xl border-3 flex items-center gap-3 transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-400 text-slate-800 opacity-90'
                            : isSelected
                            ? 'bg-sky-100 border-sky-500 shadow-lg ring-4 ring-sky-300 scale-102'
                            : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0 bg-slate-50">
                          {obj.img ? <img src={obj.img} alt={obj.label} className="w-full h-full object-cover" /> : obj.icon}
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
                    { id: 'strong', label: 'Super Strong Pulling Power (Tough)', icon: '💪', desc: 'Holds extreme weight without snapping!' },
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
                        className={`w-full p-3.5 rounded-2xl border-3 flex items-center gap-3 transition-all ${
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
              PHASE 6: APPLY (Real Photo Parachute Drop Challenge)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-100 text-indigo-950 rounded-full font-black text-xs sm:text-sm border border-indigo-300 animate-pulse shadow-xs">
                  👇 Tap the best material for Pip's rescue parachute!
                </span>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-indigo-300 shadow-xl mb-4 w-full text-center flex flex-col items-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md mb-2">
                  <img src={nylonParachuteSkyImg} alt="Real Nylon Parachute" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pip's Rescue Parachute Mission! 🪂
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  Pip needs to drop a heavy supply crate safely from the sky. <br />
                  The parachute canopy must be <span className="text-sky-600 font-black">super strong</span> to hold the weight, but{' '}
                  <span className="text-emerald-600 font-black">feather-light and flexible</span> so it catches the wind!
                </p>
              </div>

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
                    name: 'Synthetic Ripstop Nylon',
                    img: nylonParachuteSkyImg,
                    isCorrect: true,
                    correctExplanation: 'Brilliant scientist thinking! Synthetic ripstop nylon is ultra-strong, tear-resistant, and feather-light — catching the wind to float down safely!',
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
                    wrongExplanation: 'Wet clay is heavy, sticky, and crumbles apart when pulled! It has almost zero pulling strength.',
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
                        voiceAssistant.speak(item.correctExplanation);
                        setTimeout(() => {
                          handleNextPhase();
                        }, 2200);
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
                    className={`p-4 rounded-3xl border-3 flex flex-col items-center gap-2 cursor-pointer transition-all bg-white hover:border-indigo-400 shadow-sm ${
                      feedback?.type === 'correct' && item.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-200">
                      {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" /> : item.icon}
                    </div>
                    <span className="font-black text-sm text-slate-800">{item.name}</span>
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
