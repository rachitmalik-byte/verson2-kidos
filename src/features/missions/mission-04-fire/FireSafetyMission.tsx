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
  CottonIllustration,
  PolyesterIllustration,
  RaincoatSyntheticIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Flame, ShieldAlert, Sun, ArrowRight, Check, AlertTriangle } from 'lucide-react';

type Phase = 'HOOK' | 'BURN_TEST' | 'SUMMER_TEST' | 'APPLY';

export function FireSafetyMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [burnedCotton, setBurnedCotton] = useState(false);
  const [burnedPolyester, setBurnedPolyester] = useState(false);
  const [summerChoice, setSummerChoice] = useState<'cotton' | 'polyester' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'BURN_TEST', 'SUMMER_TEST', 'APPLY'];
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
        properties: ['Cotton burns to ash', 'Synthetic melts into sticky bead', 'Breathable vs Non-breathable'],
        uses: ['Kitchen apron (Cotton)', 'Fire festival safety'],
        scienceWord: 'Melt vs Burn safety',
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
    setBurnedCotton(false);
    setBurnedPolyester(false);
    setSummerChoice(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'BURN_TEST':
        return burnedCotton && burnedPolyester;
      case 'SUMMER_TEST':
        return summerChoice === 'cotton';
      case 'APPLY':
        return false;
      default:
        return false;
    }
  };

  return (
    <MissionLayout
      missionId="mission-04"
      missionNumber={4}
      missionTitle="Fire Safety & Summer Comfort"
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
          {/* ════ PHASE 1: HOOK ════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-3 flex items-center justify-center text-rose-500">
                <Flame className="w-20 h-20 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Why Must You NEVER Wear Synthetic Clothes Near Fire? 🔥
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-8">
                Synthetic fabrics are strong and wrinkle-free, but they hide a dangerous secret when near heat.
                Let's perform a controlled science flame test to see how <span className="text-emerald-600 font-black">Natural Cotton</span> vs{' '}
                <span className="text-sky-600 font-black">Synthetic Polyester</span> react to fire!
              </p>

              <button
                onClick={handleNextPhase}
                className="btn-3d-amber text-slate-950 font-black text-xl py-4 px-12 rounded-3xl cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter Flame Test Chamber 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════ PHASE 2: FLAME BURN TEST ════ */}
          {currentPhase === 'BURN_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="concerned" size="lg" />
                <PipSpeechBubble
                  message="Tap both flame buttons to test how each fabric reacts to a flame! Watch what happens to the fibres!"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Station A: Cotton */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-emerald-200 shadow-xl flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-black text-lg text-slate-900">Natural Cotton</span>
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      Plant Fibre
                    </span>
                  </div>

                  <div className="w-full h-48 rounded-2xl bg-slate-50 border-3 border-dashed border-slate-300 flex flex-col items-center justify-center p-4">
                    {burnedCotton ? (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-2 inline-block">
                          ✓ Burns Cleanly into Soft Ash
                        </span>
                        <p className="text-xs font-bold text-slate-600 mt-2">
                          Cotton burns like paper, turning into harmless powdery gray ash. It does NOT melt or stick to skin!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <CottonIllustration className="w-16 h-16 mb-2" />
                        <span className="text-xs font-bold text-slate-400">Ready for flame test</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setBurnedCotton(true);
                    }}
                    disabled={burnedCotton}
                    className="mt-5 w-full py-4 rounded-2xl btn-3d-emerald font-black text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
                  >
                    <Flame className="w-5 h-5" />
                    <span>{burnedCotton ? '✓ Tested (Burns to Ash)' : 'Apply Flame to Cotton'}</span>
                  </button>
                </div>

                {/* Station B: Polyester */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-4 border-rose-200 shadow-xl flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-black text-lg text-slate-900">Synthetic Polyester</span>
                    <span className="text-xs font-black bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                      Petrochemical Fibre
                    </span>
                  </div>

                  <div className="w-full h-48 rounded-2xl bg-slate-50 border-3 border-dashed border-slate-300 flex flex-col items-center justify-center p-4">
                    {burnedPolyester ? (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                        <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full mb-2 inline-block flex items-center gap-1 mx-auto w-fit">
                          <AlertTriangle className="w-3.5 h-3.5" /> MELTS into Hot Sticky Beads!
                        </span>
                        <p className="text-xs font-bold text-rose-600 mt-2">
                          Polyester melts into scalding plastic beads that fuse and stick tightly to skin, causing severe burns!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <PolyesterIllustration className="w-16 h-16 mb-2" />
                        <span className="text-xs font-bold text-slate-400">Ready for flame test</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.boing();
                      setBurnedPolyester(true);
                    }}
                    disabled={burnedPolyester}
                    className="mt-5 w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 border-2 border-rose-700 shadow-[0_5px_0_#9F1239] text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
                  >
                    <Flame className="w-5 h-5" />
                    <span>{burnedPolyester ? '⚠️ Tested (Melts & Sticks)' : 'Apply Flame to Polyester'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ PHASE 3: SUMMER COMFORT TEST ════ */}
          {currentPhase === 'SUMMER_TEST' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="It's 40°C in the middle of summer! Which shirt will keep you cool and prevent sweat allergies?"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 w-full mb-6">
                <button
                  onClick={() => {
                    sounds.success();
                    setSummerChoice('cotton');
                  }}
                  className={`p-6 rounded-3xl border-4 flex flex-col items-center transition-all cursor-pointer ${
                    summerChoice === 'cotton'
                      ? 'border-emerald-500 bg-emerald-50 shadow-xl ring-4 ring-emerald-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 h-20 mb-2">
                    <CottonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-lg text-slate-900">100% Cotton Shirt</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mt-2">
                    ✓ Breathes & Absorbs Sweat
                  </span>
                </button>

                <button
                  onClick={() => {
                    sounds.boing();
                    setSummerChoice('polyester');
                  }}
                  className={`p-6 rounded-3xl border-4 flex flex-col items-center transition-all cursor-pointer ${
                    summerChoice === 'polyester'
                      ? 'border-rose-400 bg-rose-50 shadow-md ring-4 ring-rose-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 h-20 mb-2">
                    <PolyesterIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-lg text-slate-900">Synthetic Shirt</span>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-3 py-1 rounded-full mt-2">
                    Traps Sweat & Causes Irritation
                  </span>
                </button>
              </div>

              {summerChoice === 'cotton' && (
                <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900 shadow-md">
                  🎉 Correct! Cotton fibres absorb perspiration, allowing it to evaporate and cool the skin naturally!
                </div>
              )}
            </div>
          )}

          {/* ════ PHASE 4: DIWALI & KITCHEN SAFETY APPLY ════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-2xl mb-6 w-full text-center">
                <span className="text-5xl mb-2 block animate-bounce">🪔✨</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  The Festival of Lights Safety Dilemma
                </h2>
                <p className="text-base text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  A child is getting dressed to light oil lamps (diyas) and celebrate with fireworks on Diwali night.
                  Her mother insists she must change out of her shiny polyester outfit into a cotton kurta. Why?
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
                  <span className="text-4xl mb-2">🛡️</span>
                  <span className="font-black text-xl text-slate-900 mb-1">
                    Cotton is safe around flames
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    Polyester melts & sticks to skin in a fire ✓
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sounds.boing()}
                  className="p-8 rounded-3xl bg-white hover:bg-rose-50 border-4 border-slate-200 opacity-60 text-center flex flex-col items-center cursor-pointer"
                >
                  <span className="text-4xl mb-2">👕</span>
                  <span className="font-black text-xl text-slate-900 mb-1">
                    Polyester is too heavy for parties
                  </span>
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    Incorrect reason
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
