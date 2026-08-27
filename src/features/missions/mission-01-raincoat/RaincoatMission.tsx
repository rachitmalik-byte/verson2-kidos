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
  WoolIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Droplet, Sparkles, Check, ArrowRight, ShieldCheck, Feather, Sun, AlertCircle, Lightbulb, ZoomIn } from 'lucide-react';
import { bgmEngine } from '@/lib/bgmEngine';

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
                <Pip mood="curious" size="lg" />
                <PipSpeechBubble
                  message="Look outside! A sudden rainstorm is rolling in! 🌧️ Which raincoat would you grab to stay completely dry?"
                  isVisible={true}
                />
              </div>

              <div id="mission-testing-rig" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
                {/* Coat A: Real Dry Cotton Trench Coat */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('A');
                  }}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden bg-white ${
                    initialChoice === 'A'
                      ? 'border-amber-500 shadow-2xl ring-6 ring-amber-300/60 scale-102'
                      : 'border-slate-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-amber-300">
                    Traditional Coat A
                  </span>
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                    <img
                      src={cottonCoatDryImg}
                      alt="Dry Natural Cotton Trench Coat"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Woven Cotton Fabric Coat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
                    Made from natural cotton plant fibers
                  </p>
                  {initialChoice === 'A' && (
                    <div className="mt-3 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" /> Selected
                    </div>
                  )}
                </motion.div>

                {/* Coat B: Real Dry Synthetic Polyester Raincoat */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('B');
                  }}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center cursor-pointer relative overflow-hidden bg-white ${
                    initialChoice === 'B'
                      ? 'border-sky-500 shadow-2xl ring-6 ring-sky-300/60 scale-102'
                      : 'border-slate-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-sky-300">
                    Modern Raincoat B
                  </span>
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                    <img
                      src={polyesterRaincoatDryImg}
                      alt="Dry Synthetic Polyester Raincoat"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Synthetic Polyester Raincoat
                  </h3>
                  <p className="text-xs text-slate-500 font-bold text-center mt-0.5">
                    Made from smooth man-made polymers
                  </p>
                  {initialChoice === 'B' && (
                    <div className="mt-3 px-4 py-1.5 bg-sky-500 text-white rounded-full text-xs font-black flex items-center gap-1 shadow-md">
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
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Let's spray water on both fabrics to see real water absorption vs water beading! Tap both spray buttons!"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Coat A Test Card: Cotton Absorption */}
                <div className="bg-white p-5 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase">
                      Plant Fibre (Natural Cotton)
                    </span>
                    {testedWater.a && (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 rounded-full text-[10px] font-black">
                        💦 Water Soaked In!
                      </span>
                    )}
                  </div>

                  {/* Real Photo with Live Wet Transformation */}
                  <div className="w-52 h-52 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center">
                    <img
                      src={testedWater.a ? cottonCoatSoakedImg : cottonCoatDryImg}
                      alt="Cotton Coat Experiment"
                      className="w-full h-full object-contain p-1 transition-all duration-500"
                    />
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
                    {testedWater.a ? 'Drenched & Heavy (Water Absorbed)' : 'Spray Water on Cotton! 🚿'}
                  </button>

                  {testedWater.a && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 w-full flex items-center gap-3"
                    >
                      <img
                        src={personWetCottonImg}
                        alt="Child drenched in cotton coat"
                        className="w-16 h-16 rounded-xl object-cover border border-amber-300 shadow-xs shrink-0"
                      />
                      <div className="text-left">
                        <span className="font-black text-xs text-rose-700 block">
                          Result: Child Gets Soaked! 🥶
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 block mt-0.5 leading-tight">
                          Natural cotton fibers drink up rain like a sponge, turning heavy and wet!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Coat B Test Card: Synthetic Polyester Water Beading */}
                <div className="bg-white p-5 rounded-3xl border-4 border-sky-200 shadow-xl flex flex-col items-center relative">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-black uppercase">
                      Synthetic Fibre (Polyester Polymer)
                    </span>
                    {testedWater.b && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full text-[10px] font-black">
                        ✨ 100% Water Beads Off!
                      </span>
                    )}
                  </div>

                  {/* Real Photo with Live Waterproof Droplets Transformation */}
                  <div className="w-52 h-52 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center">
                    <img
                      src={testedWater.b ? polyesterRaincoatWaterproofImg : polyesterRaincoatDryImg}
                      alt="Synthetic Raincoat Experiment"
                      className="w-full h-full object-contain p-1 transition-all duration-500"
                    />
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
                    {testedWater.b ? 'Waterproof (Droplets Roll Off)' : 'Spray Water on Polyester! 🚿'}
                  </button>

                  {testedWater.b && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-sky-50 p-3 rounded-2xl border border-sky-200 w-full flex items-center gap-3"
                    >
                      <img
                        src={personDryRaincoatImg}
                        alt="Child dry in synthetic raincoat"
                        className="w-16 h-16 rounded-xl object-cover border border-sky-300 shadow-xs shrink-0"
                      />
                      <div className="text-left">
                        <span className="font-black text-xs text-emerald-700 block">
                          Result: Child Stays 100% Dry! 😄
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 block mt-0.5 leading-tight">
                          Synthetic polyester fibers are hydrophobic. Rain beads into drops and slides off!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: CHOOSE & REASON (Backed by Real Evidence)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'CHOOSE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="thinking" size="lg" />
                <PipSpeechBubble
                  message="Now that you witnessed the real water spray test, which raincoat keeps you dry in heavy rain? And why?"
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
                  <img src={cottonCoatSoakedImg} alt="Cotton soaked" className="w-24 h-24 rounded-xl object-contain" />
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
                  <img src={polyesterRaincoatWaterproofImg} alt="Polyester waterproof" className="w-24 h-24 rounded-xl object-contain" />
                  <span>Choose Polyester (Coat B)</span>
                </button>
              </div>

              {finalChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center"
                >
                  <h4 className="text-sm font-black text-slate-800 mb-3">
                    Why did you pick {finalChoice === 'A' ? 'Coat A' : 'Coat B'}? (Select all that apply):
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
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
                          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {reason.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (Microscope Fabric Evidence + Science Law)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look closely under the microscope! You discovered the Golden Law of Materials Science!"
                  isVisible={true}
                />
              </div>

              {/* Real Microscope Zoom Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-6">
                <div className="bg-white p-5 rounded-3xl border-3 border-amber-300 shadow-md flex items-center gap-4">
                  <img
                    src={cottonFabricZoomImg}
                    alt="Cotton Microscope Zoom"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-200 shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      🔬 Natural Cotton Under Zoom
                    </span>
                    <h4 className="font-black text-sm text-slate-800 mt-1">Porous Absorbent Weave</h4>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      Open natural fibres pull in water molecules like a sponge — ideal for bath towels!
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border-3 border-sky-300 shadow-md flex items-center gap-4">
                  <img
                    src={polyesterFabricZoomImg}
                    alt="Polyester Microscope Zoom"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-200 shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      🔬 Synthetic Polyester Under Zoom
                    </span>
                    <h4 className="font-black text-sm text-slate-800 mt-1">Hydrophobic Beading Weave</h4>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      Tightly bonded polymer chains repel water droplets — ideal for raincoats & umbrellas!
                    </p>
                  </div>
                </div>
              </div>

              {/* Golden Science Law */}
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
                  Tap an object on the left, then tap its matching superpower property on the right!
                </p>
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
              <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl mb-5 w-full text-center flex flex-col items-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md mb-3">
                  <img src={nylonParachuteSkyImg} alt="Real Nylon Parachute" className="w-full h-full object-cover" />
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
