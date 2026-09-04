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
import { FloatingMissionPip } from '@/components/pip/FloatingMissionPip';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  WoolIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Droplet, Sparkles, Check, ArrowRight, ShieldCheck, Feather, Sun, AlertCircle, Lightbulb, ZoomIn, Compass, Shield, CheckCircle2, Layers, Zap, Box, Wind, Flame } from 'lucide-react';
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
              className="w-full max-w-2xl mx-auto mb-4 p-3.5 bg-amber-50 text-amber-950 rounded-2xl font-bold text-xs md:text-sm shadow-xs flex items-center justify-between gap-3 border border-amber-200"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {currentPhase === 'HOOK' && 'Assisted Tour: Tap either raincoat card above to begin your rain test.'}
                  {currentPhase === 'INSPECT' && 'Assisted Tour: Tap "Spray Water" on both coats to test water resistance.'}
                  {currentPhase === 'CHOOSE' && 'Assisted Tour: Select Raincoat B and pick why it works best.'}
                  {currentPhase === 'UNDERSTANDING' && 'Assisted Tour: Review the golden rule: Material → Property → Use.'}
                  {currentPhase === 'PRACTICE' && 'Assisted Tour: Tap an object on the left, then tap its matching property on the right.'}
                  {currentPhase === 'APPLY' && 'Assisted Tour: Select Ripstop Nylon for Pip’s rescue parachute.'}
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.pop();
                  endTour();
                }}
                className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
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
              <FloatingMissionPip mood="curious" message="A sudden rainstorm is rolling in! Which raincoat would you grab to stay completely dry?" isVisible={true} />

              {/* Contextual Action Instruction Banner */}
              <div className="w-full flex justify-center mb-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-md text-slate-800 rounded-full font-heading font-bold text-xs sm:text-sm border border-slate-200/90 shadow-xs">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>Choose a raincoat below to begin the investigation</span>
                </div>
              </div>

              <div id="mission-testing-rig" className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-1">
                {/* Coat A: Real Dry Cotton Trench Coat */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('A');
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center cursor-pointer relative overflow-hidden bg-white shadow-sm group ${
                    initialChoice === 'A'
                      ? 'border-amber-500 shadow-xl ring-4 ring-amber-500/20'
                      : 'border-slate-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-amber-600" />
                      <span>Specimen A: Traditional Trench</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Ref #01
                    </span>
                  </div>

                  <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden my-2 relative bg-gradient-to-b from-slate-50 to-amber-50/30 border border-slate-200/70 flex items-center justify-center">
                    <img
                      src={cottonCoatDryImg}
                      alt="Dry Natural Cotton Trench Coat"
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-slate-600 border border-slate-200 flex items-center gap-1 shadow-xs">
                      <ZoomIn className="w-3 h-3 text-slate-500" />
                      <span>Natural Cotton Fibers</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-2 tracking-tight">
                    Woven Cotton Fabric Coat
                  </h3>
                  <p className="text-xs text-slate-500 font-medium text-center mt-1 max-w-xs leading-relaxed">
                    Woven from natural plant cellulose fibers with open, breathable pores.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex justify-center">
                    {initialChoice === 'A' ? (
                      <span className="px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Selected Specimen</span>
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium group-hover:bg-amber-50 group-hover:text-amber-900 transition-colors">
                        Tap to Select
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Coat B: Real Dry Synthetic Polyester Raincoat */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setInitialChoice('B');
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center cursor-pointer relative overflow-hidden bg-white shadow-sm group ${
                    initialChoice === 'B'
                      ? 'border-teal-500 shadow-xl ring-4 ring-teal-500/20'
                      : 'border-slate-200/90 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200/80 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Specimen B: Modern Raincoat</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Ref #02
                    </span>
                  </div>

                  <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden my-2 relative bg-gradient-to-b from-slate-50 to-teal-50/30 border border-slate-200/70 flex items-center justify-center">
                    <img
                      src={polyesterRaincoatDryImg}
                      alt="Dry Synthetic Polyester Raincoat"
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-slate-600 border border-slate-200 flex items-center gap-1 shadow-xs">
                      <ZoomIn className="w-3 h-3 text-slate-500" />
                      <span>Synthetic Polymer Weave</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 mt-2 tracking-tight">
                    Synthetic Polyester Raincoat
                  </h3>
                  <p className="text-xs text-slate-500 font-medium text-center mt-1 max-w-xs leading-relaxed">
                    Extruded from dense synthetic polymers engineered to repel liquid moisture.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 w-full flex justify-center">
                    {initialChoice === 'B' ? (
                      <span className="px-4 py-1.5 bg-teal-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Selected Specimen</span>
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium group-hover:bg-teal-50 group-hover:text-teal-900 transition-colors">
                        Tap to Select
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {initialChoice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex flex-col items-center"
                >
                  <div className="text-xs sm:text-sm font-heading font-bold text-slate-700 bg-white px-5 py-2.5 rounded-full border border-slate-200/90 shadow-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Specimen chosen! Tap <strong className="text-teal-700">Next Phase</strong> in the dock below to begin testing with water.</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: INSPECT (Real Before & After Rain Water Spray Experiment)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'INSPECT' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <FloatingMissionPip mood="explaining" message="Spray water on both fabrics to observe water absorption versus hydrophobic beading." isVisible={true} />

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-700 rounded-full font-heading font-bold text-xs border border-slate-200 shadow-2xs">
                  <Droplet className="w-3.5 h-3.5 text-teal-600" />
                  <span>Spray water on both coats to test water absorption and surface repellency</span>
                </span>
              </div>

              <ExperimentFocusSpotlight
                isActive={isSprayingA || isSprayingB}
                activeLabel="Conducting Fabric Water Penetration Test..."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  {/* Coat A Test Card: Cotton Absorption */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center relative overflow-hidden group">
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/70 rounded-full text-[11px] font-heading font-bold tracking-wide">
                        Plant Fiber (Natural Cotton)
                      </span>
                      {testedWater.a && (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-rose-600 fill-rose-600" />
                          <span>Water Absorbed</span>
                        </span>
                      )}
                    </div>

                    {/* Real Photo with Live Wet Transition */}
                    <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-inner my-2 border border-slate-200/80 relative bg-slate-50 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={testedWater.a ? 'soaked' : 'dry'}
                          src={testedWater.a ? cottonCoatSoakedImg : cottonCoatDryImg}
                          alt="Cotton Coat Experiment"
                          initial={{ opacity: 0.4, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.04 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="w-full h-full object-contain p-2"
                        />
                      </AnimatePresence>

                      {/* Spray Shower Particle Wave Effect */}
                      {isSprayingA && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 bg-sky-500/15 backdrop-blur-[1px] rounded-2xl pointer-events-none flex flex-col items-center justify-center gap-1.5"
                        >
                          <div className="flex items-center gap-2 text-sky-600">
                            <Droplet className="w-6 h-6 animate-bounce" />
                            <Droplet className="w-8 h-8 animate-pulse" />
                            <Droplet className="w-6 h-6 animate-bounce" />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-sky-800 bg-white/95 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-xs">
                            Spray Test Active
                          </span>
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
                      className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        testedWater.a
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-98'
                      }`}
                    >
                      <Droplet className="w-4 h-4" />
                      <span>{testedWater.a ? 'Drenched & Heavy (Water Absorbed)' : 'Spray Water on Cotton'}</span>
                    </button>

                    {testedWater.a && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="mt-3.5 bg-gradient-to-b from-amber-50/60 to-rose-50/60 p-3.5 rounded-2xl border border-rose-200/80 w-full flex flex-col items-center text-center shadow-2xs"
                      >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-rose-200 shadow-2xs mb-2 bg-white flex items-center justify-center p-1">
                          <img
                            src={personWetCottonImg}
                            alt="Child drenched in cotton coat"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-heading font-extrabold text-xs text-rose-700 block tracking-tight">
                          Observation: Fabric Absorbs Liquid Moisture
                        </span>
                        <p className="text-[11px] font-medium text-slate-600 mt-1 leading-snug max-w-xs">
                          Water soaked straight through the natural cotton fibers, making the underlayers cold and wet.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Coat B Test Card: Synthetic Polyester Water Beading */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center relative overflow-hidden group">
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className="px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200/70 rounded-full text-[11px] font-heading font-bold tracking-wide">
                        Synthetic Fiber (Polyester)
                      </span>
                      {testedWater.b && (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>100% Water Repelled</span>
                        </span>
                      )}
                    </div>

                    {/* Real Photo with Live Waterproof Droplets Transformation */}
                    <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-inner my-2 border border-slate-200/80 relative bg-slate-50 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={testedWater.b ? 'waterproof' : 'dry'}
                          src={testedWater.b ? polyesterRaincoatWaterproofImg : polyesterRaincoatDryImg}
                          alt="Synthetic Raincoat Experiment"
                          initial={{ opacity: 0.4, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.04 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="w-full h-full object-contain p-2"
                        />
                      </AnimatePresence>

                      {/* Spray Shower Particle Wave Effect */}
                      {isSprayingB && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 bg-teal-500/15 backdrop-blur-[1px] rounded-2xl pointer-events-none flex flex-col items-center justify-center gap-1.5"
                        >
                          <div className="flex items-center gap-2 text-teal-600">
                            <Droplet className="w-6 h-6 animate-bounce" />
                            <Sparkles className="w-7 h-7 text-teal-500 animate-spin" />
                            <Droplet className="w-6 h-6 animate-bounce" />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-900 bg-white/95 px-2.5 py-0.5 rounded-full border border-teal-200 shadow-xs">
                            Spray Test Active
                          </span>
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
                      className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        testedWater.b
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-98'
                      }`}
                    >
                      <Droplet className="w-4 h-4" />
                      <span>{testedWater.b ? 'Waterproof (Droplets Roll Off)' : 'Spray Water on Polyester'}</span>
                    </button>

                    {testedWater.b && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="mt-3.5 bg-gradient-to-b from-teal-50/60 to-emerald-50/60 p-3.5 rounded-2xl border border-teal-200/80 w-full flex flex-col items-center text-center shadow-2xs"
                      >
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-emerald-200 shadow-2xs mb-2 bg-white flex items-center justify-center p-1">
                          <img
                            src={personDryRaincoatImg}
                            alt="Child dry in synthetic raincoat"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-heading font-extrabold text-xs text-emerald-800 block tracking-tight">
                          Observation: Wearer Stays Completely Dry
                        </span>
                        <p className="text-[11px] font-medium text-slate-600 mt-1 leading-snug max-w-xs">
                          Water droplets beaded into spherical shapes and rolled right off the hydrophobic surface weave.
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
            <div className="w-full max-w-3xl flex flex-col items-center gap-4">
              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-700 rounded-full font-heading font-bold text-xs border border-slate-200 shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span>Choose your preferred outerwear for heavy rain, then record your scientific reasons</span>
                </span>
              </div>

              {/* Pip Speech Banner */}
              <div className="flex items-center gap-3 w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <Pip mood="thinking" size="sm" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-teal-600" />
                    <span>Scientific Hypothesis</span>
                  </span>
                  <p className="text-xs sm:text-sm font-heading font-bold text-slate-800 mt-1.5 leading-relaxed">
                    Now that you tested both fabrics with water, which material reliably keeps the wearer dry in torrential rain?
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
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2.5 ${
                    finalChoice === 'A'
                      ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="w-full h-36 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 overflow-hidden">
                    <img src={cottonCoatSoakedImg} alt="Cotton soaked" className="h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-slate-900 block">Specimen A: Natural Cotton</span>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5 border border-rose-100">
                      <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>Water Absorbent</span>
                    </span>
                  </div>
                </button>

                {/* Coat B: Polyester */}
                <button
                  onClick={() => {
                    sounds.pop();
                    setFinalChoice('B');
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2.5 ${
                    finalChoice === 'B'
                      ? 'bg-teal-50/70 border-teal-600 shadow-md ring-2 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="w-full h-36 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 overflow-hidden">
                    <img src={polyesterRaincoatWaterproofImg} alt="Polyester waterproof" className="h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-slate-900 block">Specimen B: Synthetic Polyester</span>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5 border border-teal-200/60">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Hydrophobic & Waterproof</span>
                    </span>
                  </div>
                </button>
              </div>

              {/* Reason Selector */}
              {finalChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center"
                >
                  <h4 className="text-xs sm:text-sm font-heading font-bold text-slate-800 mb-3 text-center">
                    Why did you select {finalChoice === 'A' ? 'Natural Cotton' : 'Synthetic Polyester'}? (Select all applicable reasons):
                  </h4>
                  <div className="flex flex-wrap gap-2.5 justify-center w-full">
                    {[
                      { id: 'waterproof', label: 'Raindrops bead up and roll off surface', icon: Droplet, correctFor: 'B' },
                      { id: 'light', label: 'Lightweight and easy to carry', icon: Feather, correctFor: 'B' },
                      { id: 'fast_dry', label: 'Dries quickly when exposed to breeze', icon: Sun, correctFor: 'B' },
                      { id: 'soft', label: 'Soft and breathable fiber texture', icon: Layers, correctFor: 'A' },
                    ].map((reason) => {
                      const isSelected = selectedReasons.includes(reason.id);
                      const IconComponent = reason.icon;
                      return (
                        <button
                          key={reason.id}
                          onClick={() => {
                            sounds.pop();
                            setSelectedReasons((prev) =>
                              isSelected ? prev.filter((r) => r !== reason.id) : [...prev, reason.id]
                            );
                          }}
                          className={`px-3.5 py-2 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          <span>{reason.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
              <FloatingMissionPip mood="celebrating" message="Examine both specimens under the high-resolution optical microscope. Toggle magnification and materials." isVisible={true} />

              {/* ── IMMERSIVE INTERACTIVE MICROSCOPE STAGE ── */}
              <div className="w-full bg-slate-900/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-xl flex flex-col items-center relative overflow-hidden mb-8">
                {/* Header & Reticle HUD */}
                <div className="flex items-center justify-between w-full mb-4 z-10 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-teal-400 bg-teal-950/70 border border-teal-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
                    <span>Optical Fabric Microscope Studio</span>
                  </span>

                  {/* Magnification Zoom Selector */}
                  <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
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
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          microscopeZoomLevel === z.level
                            ? 'bg-teal-500 text-slate-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Microscope Lens Viewport */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-950 ring-4 ring-teal-500/30 my-2 flex items-center justify-center">
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
                  <div className="absolute inset-0 pointer-events-none border border-teal-400/20 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-teal-400/25 absolute" />
                    <div className="h-full w-[1px] bg-teal-400/25 absolute" />
                    <div className="w-24 h-24 rounded-full border border-teal-400/30 absolute" />
                    <div className="w-44 h-44 rounded-full border border-teal-400/15 absolute" />
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
                    className={`p-3 rounded-xl font-heading font-bold text-xs md:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'cotton'
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Examine Natural Cotton</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('polyester');
                    }}
                    className={`p-3 rounded-xl font-heading font-bold text-xs md:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'polyester'
                        ? 'bg-teal-600 border-teal-500 text-white shadow-sm ring-2 ring-teal-400/40'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Examine Synthetic Polyester</span>
                  </button>
                </div>

                {/* Explanatory Callout Box */}
                <motion.div
                  key={activeMicroscopeSpecimen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 w-full max-w-xl text-center z-10"
                >
                  {activeMicroscopeSpecimen === 'cotton' ? (
                    <div>
                      <span className="font-heading font-bold text-xs md:text-sm text-amber-300 block mb-1">
                        Natural Cotton: Porous Capillary Network
                      </span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        Notice the open, twisted plant fibers. Natural cotton fibers contain microscopic channels that draw liquid inward through capillary action, retaining water like a sponge.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-heading font-bold text-xs md:text-sm text-teal-300 block mb-1">
                        Synthetic Polyester: Hydrophobic Shield
                      </span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        Notice the smooth, uniform synthetic polymer filaments. Non-porous fibers prevent water penetration, causing droplets to form spherical beads that roll away cleanly.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── THE GOLDEN SCIENCE LAW ── */}
              <div className="w-full bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="px-4 py-1.5 bg-teal-50 text-teal-900 border border-teal-200/80 rounded-full font-heading font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-2xs">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>Scientific Foundation: Material to Application</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center flex flex-col items-center shadow-2xs">
                    <Box className="w-7 h-7 text-amber-600 mb-2" />
                    <span className="font-heading font-bold text-slate-800 text-sm tracking-wide">1. MATERIAL</span>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">What it is made of</p>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-3 py-0.5 rounded-full mt-2.5">
                      Synthetic Polyester
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-center flex flex-col items-center shadow-2xs">
                    <ShieldCheck className="w-7 h-7 text-teal-600 mb-2" />
                    <span className="font-heading font-bold text-slate-800 text-sm tracking-wide">2. PROPERTY</span>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">What it can do</p>
                    <span className="text-[11px] font-bold text-teal-900 bg-teal-100/80 px-3 py-0.5 rounded-full mt-2.5">
                      Water-Resistant & Lightweight
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-center flex flex-col items-center shadow-2xs">
                    <Compass className="w-7 h-7 text-indigo-600 mb-2" />
                    <span className="font-heading font-bold text-slate-800 text-sm tracking-wide">3. APPLICATION</span>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">What it is used for</p>
                    <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100/80 px-3 py-0.5 rounded-full mt-2.5">
                      Raincoats & Outdoor Shells
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
                <h2 className="text-xl md:text-2xl font-heading font-extrabold text-slate-900 mb-1">
                  Match Everyday Materials with Functional Properties
                </h2>
                <p className="text-slate-500 font-medium text-xs md:text-sm">
                  Connect each everyday item with its primary scientific property.
                </p>
              </div>

              {/* Contextual Action Instruction Banner */}
              <div className="w-full text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-700 rounded-full font-heading font-bold text-xs border border-slate-200 shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tap an item on the left, then select its matching superpower on the right</span>
                </span>
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full mb-5 flex items-center gap-3 bg-white p-4 rounded-2xl border border-teal-200 shadow-sm"
                >
                  <Pip mood={feedback.mood} size="md" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>{feedback.type === 'correct' ? 'Scientific Verification' : 'Material Property Insight'}</span>
                    </span>
                    <p className="text-xs md:text-sm font-heading font-bold text-slate-800 mt-1 leading-snug">
                      {feedback.message}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                {/* Left: Objects */}
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
                    Everyday Item
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
                              message: `You selected "${obj.label}". Now identify its primary functional superpower on the right.`,
                            });
                            voiceAssistant.speak(`You selected ${obj.label}. Now tap its superpower property on the right.`);
                          }
                        }}
                        disabled={isMatched}
                        className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-slate-800 opacity-90'
                            : isSelected
                            ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-400/30'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center flex-shrink-0 bg-slate-50">
                          {obj.img ? <img src={obj.img} alt={obj.label} className="w-full h-full object-cover" /> : obj.icon}
                        </div>
                        <span className="font-heading font-bold text-sm text-slate-800 text-left">{obj.label}</span>
                        {isMatched && <Check className="w-5 h-5 text-emerald-600 stroke-[3] ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Properties */}
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
                    Functional Property
                  </span>
                  {[
                    { id: 'water', label: 'Water-Resistant & Repellent', icon: Droplet, desc: 'Liquid moisture beads and rolls off' },
                    { id: 'strong', label: 'High Tensile Strength (Tough)', icon: Zap, desc: 'Supports heavy loads without snapping' },
                    { id: 'warm', label: 'Thermal Heat Retention', icon: Sun, desc: 'Porous crimped fibers trap insulating air' },
                  ].map((prop) => {
                    const isMatched = Object.values(matches).includes(prop.id);
                    const PropIcon = prop.icon;

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
                              if (prop.id === 'water') correctReason = 'Correct. Raincoats use synthetic polymers so water droplets bead right off without wetting the fabric.';
                              if (prop.id === 'strong') correctReason = 'Correct. Nylon fibers possess high tensile strength, holding substantial weight without tearing.';
                              if (prop.id === 'warm') correctReason = 'Correct. Wool fibers feature natural crimp channels that trap air pockets, providing thermal insulation.';

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
                        className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-slate-800 opacity-90 cursor-default'
                            : activeMatchObject
                            ? 'bg-teal-50/60 border-teal-400 hover:bg-teal-100 cursor-pointer shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <PropIcon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="text-left">
                          <span className="font-heading font-bold text-xs md:text-sm text-slate-800 block">{prop.label}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">{prop.desc}</span>
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
                  className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center text-xs sm:text-sm font-heading font-bold text-teal-900 shadow-2xs w-full flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>All material properties verified. Tap Next Phase in the dock to proceed to the Parachute challenge.</span>
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
              <div className="w-full text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-700 rounded-full font-heading font-bold text-xs border border-slate-200 shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select the optimal material to construct a lightweight, high-strength parachute</span>
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-5 w-full text-center flex flex-col items-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs mb-3">
                  <img src={nylonParachuteSkyImg} alt="Real Nylon Parachute" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-900 mb-1.5">
                  Rescue Parachute Engineering Challenge
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
                  A supply crate must descend safely from altitude. <br />
                  The parachute canopy requires <span className="text-teal-700 font-bold">high tensile strength</span> to withstand air resistance, combined with <span className="text-teal-700 font-bold">ultra-low mass and flexibility</span> to billow effectively.
                </p>
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-4 flex items-center gap-3 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs"
                >
                  <Pip mood={feedback.mood} size="md" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>{feedback.type === 'correct' ? 'Engineering Success' : 'Material Property Evaluation'}</span>
                    </span>
                    <p className="text-xs md:text-sm font-heading font-bold text-slate-800 mt-1">
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
                    icon: <WoodIllustration className="w-12 h-12" />,
                    isCorrect: false,
                    wrongExplanation: 'Wood has rigid compressive strength, but excessive density and zero flexibility prevent it from forming a deployable canopy.',
                  },
                  {
                    id: 'nylon',
                    name: 'Synthetic Ripstop Nylon',
                    img: nylonParachuteSkyImg,
                    isCorrect: true,
                    correctExplanation: 'Optimal selection. Synthetic ripstop nylon delivers superior strength-to-weight ratio, low permeability, and tear resistance under tension.',
                  },
                  {
                    id: 'glass',
                    name: 'Glass Sheet Panel',
                    icon: (
                      <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-mono text-xs font-bold">
                        GLS
                      </div>
                    ),
                    isCorrect: false,
                    wrongExplanation: 'Glass is rigid and brittle. Under dynamic aerodynamic drag, it fractures immediately without flexibility.',
                  },
                  {
                    id: 'clay',
                    name: 'Wet Clay & Silt',
                    icon: (
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-mono text-xs font-bold">
                        CLY
                      </div>
                    ),
                    isCorrect: false,
                    wrongExplanation: 'Wet clay has virtually zero tensile cohesion and excessive moisture mass, disintegrating under tension.',
                  },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
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
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2.5 cursor-pointer transition-all bg-white hover:border-slate-300 shadow-2xs ${
                      feedback?.type === 'correct' && item.isCorrect
                        ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-400/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-200/80">
                      {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" /> : item.icon}
                    </div>
                    <span className="font-heading font-bold text-sm text-slate-800">{item.name}</span>
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
