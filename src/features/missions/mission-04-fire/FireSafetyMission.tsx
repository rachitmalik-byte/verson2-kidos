import { ThreeFlameBurnLab } from "@/components/three-lab/ThreeFlameBurnLab";
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
import { ExperimentFocusSpotlight } from '@/components/interactive/ExperimentFocusSpotlight';

// Real Studio Macro Educational Photography (Clean Before & After Pairs)
import cottonSwatchCleanImg from '@/assets/images/experiments/cotton_swatch_clean.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyesterSwatchCleanImg from '@/assets/images/experiments/polyester_swatch_clean.jpg';
import polyesterMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import cottonFabricZoomImg from '@/assets/images/raincoat/cotton_fabric_zoom.jpg';
import polyesterFabricZoomImg from '@/assets/images/raincoat/polyester_fabric_zoom.jpg';
import { Flame, ArrowRight, ZoomIn } from 'lucide-react';

type Phase = 'HOOK' | 'BURN_TEST' | 'MICROSCOPE' | 'APPLY';

export function FireSafetyMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [burnedCotton, setBurnedCotton] = useState(false);
  const [burnedPolyester, setBurnedPolyester] = useState(false);
  const [isIgnitingCotton, setIsIgnitingCotton] = useState(false);
  const [isIgnitingPolyester, setIsIgnitingPolyester] = useState(false);
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'cotton' | 'polyester'>('cotton');
  const [safetyChoice, setSafetyChoice] = useState<'cotton' | 'polyester' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'BURN_TEST', 'MICROSCOPE', 'APPLY'];
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
      completeMission('mission-05');
      addDiscovery({
        materialId: 'fire-safety',
        discoveredAt: Date.now(),
        properties: ['Cotton burns to crumbly ash', 'Synthetic melts into hot sticky bead', 'Kitchen safety critical'],
        uses: ['Chef kitchen aprons (100% Cotton)', 'Fire festival safety'],
        scienceWord: 'Melt vs Burn safety',
      });
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/6');
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
    setBurnedCotton(false);
    setBurnedPolyester(false);
    setSafetyChoice(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'BURN_TEST':
        return burnedCotton && burnedPolyester;
      case 'MICROSCOPE':
        return true;
      case 'APPLY':
        return safetyChoice === 'cotton';
      default:
        return false;
    }
  };

  const triggerBurnCotton = () => {
    sounds.flameIgnite();
    setIsIgnitingCotton(true);
    setTimeout(() => {
      setBurnedCotton(true);
      setIsIgnitingCotton(false);
      voiceAssistant.speak('Look at that! Natural cotton burns like paper and turns into soft, harmless gray ash!');
    }, 700);
  };

  const triggerBurnPolyester = () => {
    sounds.flameIgnite();
    setIsIgnitingPolyester(true);
    setTimeout(() => {
      setBurnedPolyester(true);
      setIsIgnitingPolyester(false);
      voiceAssistant.speak('Watch out! Synthetic polyester shrinks, curls, and melts into a hot sticky plastic bead!');
    }, 700);
  };

  return (
    <MissionLayout
      missionId="mission-05"
      missionNumber={5}
      missionTitle="Fire Safety Station"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-amber-100 via-rose-50 to-orange-100"
    >
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => {
          setShowCelebration(false);
          navigate('/chapter/3/mission/6');
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
              PHASE 1: HOOK (The Fire & Kitchen Question)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="md" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Heat & Flame Safety Mystery! 🔥
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Why do professional chefs and blacksmiths always wear{' '}
                <span className="text-amber-600 font-black">100% Cotton aprons</span> near hot stoves, but NEVER wear synthetic polyester clothes?
              </p>

              {/* Clean Swatch Pair Preview */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                <div className="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-md flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-slate-50 border border-slate-100 p-1">
                    <img src={cottonSwatchCleanImg} alt="Clean Cotton Swatch" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="font-black text-xs text-slate-800">1. Natural Cotton</span>
                  <span className="text-[10px] font-bold text-amber-700">Natural Plant Cotton</span>
                </div>

                <div className="bg-white p-4 rounded-3xl border-3 border-rose-300 shadow-md flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-slate-50 border border-slate-100 p-1">
                    <img src={polyesterSwatchCleanImg} alt="Clean Polyester Swatch" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="font-black text-xs text-slate-800">2. Synthetic Polyester</span>
                  <span className="text-[10px] font-bold text-rose-700">Synthetic Plastic</span>
                </div>
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter the Flame Lab 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: BURN TEST SANDBOX (True Before vs After Transformations)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'BURN_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <Pip mood="explaining" size="md" />
                <PipSpeechBubble
                  message="Ignite both fabric swatches on the ceramic lab plate to see how natural fibers vs synthetic plastics react to heat!"
                  isVisible={true}
                />
              </div>

              {/* Dual Flame Experiment Cards Wrapped in Focus Spotlight */}
              <ExperimentFocusSpotlight
                isActive={isIgnitingCotton || isIgnitingPolyester}
                activeLabel="🔥 Flame Test in Progress..."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Cotton Flame Test */}
                  <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-1">
                      Natural Cotton (Natural Plant Cotton)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mb-3">
                      {burnedCotton ? '✅ Result: Burns cleanly into soft gray ash' : 'Unburned specimen on ceramic lab tile'}
                    </span>

                    <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={burnedCotton ? 'cotton-burned' : 'cotton-clean'}
                          src={burnedCotton ? cottonBurningAshImg : cottonSwatchCleanImg}
                          alt={burnedCotton ? 'Cotton Burned into Soft Ash' : 'Clean Unburned Cotton Swatch'}
                          initial={{ opacity: 0.4, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </AnimatePresence>

                      {/* Flame Ignition Wave */}
                      {isIgnitingCotton && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1.6] }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 bg-amber-500/30 rounded-2xl flex items-center justify-center text-5xl pointer-events-none"
                        >
                          🔥✨
                        </motion.div>
                      )}
                    </div>

                    <button
                      onClick={triggerBurnCotton}
                      className={`w-full py-3.5 mt-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        burnedCotton
                          ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
                          : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md active:scale-95'
                      }`}
                    >
                      <Flame className="w-4 h-4 text-amber-900" />
                      <span>{burnedCotton ? '✅ Result: Soft Gray Ash' : 'Test Cotton in Flame! 🔥'}</span>
                    </button>

                    {burnedCotton && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-slate-800 text-xs font-bold text-center"
                      >
                        🌱 Cotton behaves like wood and paper: it burns cleanly into light crumbly ash that easily brushes away!
                      </motion.div>
                    )}
                  </div>

                  {/* Polyester Flame Test */}
                  <div className="bg-white p-6 rounded-3xl border-4 border-rose-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                    <span className="px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-black uppercase mb-1">
                      Synthetic Polyester (Plastic Polymer)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mb-3">
                      {burnedPolyester ? '⚠️ Result: Melts into hot sticky black bead' : 'Unburned specimen on ceramic lab tile'}
                    </span>

                    <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={burnedPolyester ? 'polyester-melted' : 'polyester-clean'}
                          src={burnedPolyester ? polyesterMeltingBeadImg : polyesterSwatchCleanImg}
                          alt={burnedPolyester ? 'Polyester Melted into Hard Bead' : 'Clean Unburned Polyester Swatch'}
                          initial={{ opacity: 0.4, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.4, scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </AnimatePresence>

                      {/* Flame Ignition Wave */}
                      {isIgnitingPolyester && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1.6] }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 bg-rose-500/30 rounded-2xl flex items-center justify-center text-5xl pointer-events-none"
                        >
                          🔥⚠️
                        </motion.div>
                      )}
                    </div>

                    <button
                      onClick={triggerBurnPolyester}
                      className={`w-full py-3.5 mt-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        burnedPolyester
                          ? 'bg-rose-100 text-rose-900 border-2 border-rose-300'
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md active:scale-95'
                      }`}
                    >
                      <Flame className="w-4 h-4 text-white" />
                      <span>{burnedPolyester ? '⚠️ Result: Melted Sticky Bead' : 'Test Polyester in Flame! 🔥'}</span>
                    </button>

                    {burnedPolyester && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold text-center"
                      >
                        ⚠️ DANGER: Polyester is petroleum plastic! High heat causes it to melt into scalding sticky black beads that glue to skin!
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
                <Pip mood="celebrating" size="md" />
                <PipSpeechBubble
                  message="Look under the microscope! See how natural cotton burns into soft ash, while synthetic polyester melts into hot sticky beads!"
                  isVisible={true}
                />
              </div>

              {/* ── FIRE OBSERVATION LAB ── */}
              <div className="w-full bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-rose-500 shadow-2xl flex flex-col items-center relative overflow-hidden mb-8">
                <div className="flex items-center justify-between w-full mb-4 z-10 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-950/60 border border-rose-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Fire Observation Lab</span>
                  </span>
                </div>

                {/* Observation Viewport */}
                <div className="relative w-full max-w-2xl aspect-video rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-slate-900 ring-2 ring-rose-500/50 my-2 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeMicroscopeSpecimen}
                      src={activeMicroscopeSpecimen === 'cotton' ? cottonBurningAshImg : polyesterMeltingBeadImg}
                      alt="Observation Specimen"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.05, opacity: 0 }}
                      transition={{ type: 'tween', duration: 0.3 }}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </AnimatePresence>
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
                    <span>🌿 Cotton Ash: Soft Gray Ash</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('polyester');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'polyester'
                        ? 'bg-rose-500 border-rose-400 text-white shadow-lg scale-102 ring-4 ring-rose-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>⚠️ Polyester: Melted Sticky Beads</span>
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
                      100% Natural Cotton
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it CAN DO</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      Burns to Ash / Never Melts
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is USED FOR</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      Kitchen Aprons & Fire Suits
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Chef Kitchen Decision)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="md" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Chef Apron Safety Decision 🍳
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-bold mb-6">
                Pip is designing a protective apron for a busy restaurant kitchen with open gas stove flames. Which fabric must Pip use?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                <button
                  onClick={() => {
                    sounds.boing();
                    setSafetyChoice('polyester');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    safetyChoice === 'polyester'
                      ? 'bg-rose-100 border-rose-500 text-rose-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">👕❌</span>
                  <span>100% Synthetic Polyester</span>
                  <span className="text-xs font-bold text-slate-500">Will melt and stick to skin if spark touches</span>
                </button>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    setSafetyChoice('cotton');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    safetyChoice === 'cotton'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-300 scale-105'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">🥼✨</span>
                  <span>100% Heavy Natural Cotton</span>
                  <span className="text-xs font-bold text-slate-500">Safe: does not melt or stick to skin</span>
                </button>
              </div>

              {safetyChoice === 'polyester' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs max-w-md"
                >
                  ⚠️ Severe Hazard! Polyester melts into scalding plastic when exposed to stove sparks!
                </motion.div>
              )}

              {safetyChoice === 'cotton' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs max-w-md"
                >
                  🎉 Certified Chef Safe! Natural cotton protects the body without dangerous melting!
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
