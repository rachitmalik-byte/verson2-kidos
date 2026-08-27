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
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyesterMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import { Flame, ShieldAlert, Sun, ArrowRight, Check, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

type Phase = 'HOOK' | 'BURN_TEST' | 'SAFETY_REASON' | 'APPLY';

export function FireSafetyMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [burnedCotton, setBurnedCotton] = useState(false);
  const [burnedPolyester, setBurnedPolyester] = useState(false);
  const [isIgnitingCotton, setIsIgnitingCotton] = useState(false);
  const [isIgnitingPolyester, setIsIgnitingPolyester] = useState(false);
  const [safetyChoice, setSafetyChoice] = useState<'cotton' | 'polyester' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'BURN_TEST', 'SAFETY_REASON', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      completeMission('mission-04');
      addDiscovery({
        materialId: 'fire-safety',
        discoveredAt: Date.now(),
        properties: ['Cotton burns to crumbly ash', 'Synthetic melts into hot sticky bead', 'Kitchen safety critical'],
        uses: ['Chef kitchen aprons (100% Cotton)', 'Fire festival safety'],
        scienceWord: 'Melt vs Burn safety',
      });
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/5');
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
      case 'SAFETY_REASON':
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
    }, 450);
  };

  const triggerBurnPolyester = () => {
    sounds.flameIgnite();
    setIsIgnitingPolyester(true);
    setTimeout(() => {
      setBurnedPolyester(true);
      setIsIgnitingPolyester(false);
      voiceAssistant.speak('Watch out! Synthetic polyester shrinks, curls, and melts into a hot sticky plastic bead!');
    }, 450);
  };

  return (
    <MissionLayout
      missionId="mission-04"
      missionNumber={4}
      missionTitle="Fire Safety & Heat Lab"
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
              PHASE 1: HOOK (The Fire & Kitchen Question)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Heat & Flame Safety Mystery! 🔥
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Why do professional chefs and blacksmiths always wear{' '}
                <span className="text-amber-600 font-black">100% Cotton aprons</span> near hot stoves, but NEVER wear synthetic polyester clothes?
              </p>

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
              PHASE 2: BURN TEST SANDBOX (Real Fabric Flame Reactions)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'BURN_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Ignite both fabric swatches on the ceramic lab plate to see how natural fibers vs synthetic plastics react to heat!"
                  isVisible={true}
                />
              </div>

              {/* Dual Flame Experiment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                {/* Cotton Flame Test */}
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-xl flex flex-col items-center relative overflow-hidden">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-1">
                    Natural Cotton (Plant Cellulose)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mb-3">Burns cleanly without melting</span>

                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={cottonBurningAshImg}
                      alt="Cotton Burning into Soft Ash"
                      className="w-full h-full object-contain"
                    />
                    {isIgnitingCotton && (
                      <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center text-4xl animate-ping">
                        🔥
                      </div>
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
                  <span className="text-[11px] font-bold text-slate-500 mb-3">Melts into hot molten plastic</span>

                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 relative bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={polyesterMeltingBeadImg}
                      alt="Polyester Melting into Hard Bead"
                      className="w-full h-full object-contain"
                    />
                    {isIgnitingPolyester && (
                      <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center text-4xl animate-ping">
                        🔥
                      </div>
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
                    <span>{burnedPolyester ? '⚠️ Result: Molten Plastic Bead' : 'Test Polyester in Flame! 🔥'}</span>
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
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: SAFETY REASONING (Golden Rule)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'SAFETY_REASON' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Now you discovered the golden fire safety rule of materials science!"
                  isVisible={true}
                />
              </div>

              <div className="w-full bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-4 py-1.5 rounded-full mb-3">
                  🛡️ Critical Materials Science Safety Rule
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-amber-300 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Never Wear Synthetic Clothes Near Open Fire!
                </h3>
                <p className="text-xs md:text-sm text-slate-300 font-bold max-w-xl leading-relaxed">
                  Natural cotton and wool burn to harmless ash and do not stick. Synthetic clothes (nylon, polyester, acrylic) liquefy under heat and cause severe contact burns. Always choose natural fabrics for kitchen cooking, campfires, and fire festivals!
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Chef Kitchen Decision)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="lg" />
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
