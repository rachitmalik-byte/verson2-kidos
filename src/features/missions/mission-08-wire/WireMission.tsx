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
import { ExperimentFocusSpotlight } from '@/components/interactive/ExperimentFocusSpotlight';

// Real Macro Studio Photography
import copperWireMacroImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pvcInsulatedCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import lightbulbGlowingBrightImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import electricianToolsSafetyImg from '@/assets/images/wire/electrician_tools_safety.jpg';
import cottonFabricZoomImg from '@/assets/images/raincoat/cotton_fabric_zoom.jpg';
import polyesterFabricZoomImg from '@/assets/images/raincoat/polyester_fabric_zoom.jpg';

import {
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ZoomIn,
  Battery,
  Lightbulb,
  Shield,
  Layers,
  Key,
} from 'lucide-react';

type Phase = 'HOOK' | 'CIRCUIT_TEST' | 'MICROSCOPE' | 'APPLY';

interface TestSpecimen {
  id: string;
  name: string;
  category: 'Metal Conductor' | 'Plastic Insulator';
  image: string;
  conducts: boolean;
  material: string;
  hint: string;
  scienceDetail: string;
}

const SPECIMENS: TestSpecimen[] = [
  {
    id: 'copper',
    name: 'Raw Copper Metal Wire',
    category: 'Metal Conductor',
    image: copperWireMacroImg,
    conducts: true,
    material: 'Red-orange metallic copper atoms with free valence electrons',
    hint: 'Electrons flow like water through copper metal!',
    scienceDetail: 'Copper is an exceptional electrical conductor with minimal electrical resistance.',
  },
  {
    id: 'pvc-plastic',
    name: 'Flexible PVC Plastic Sheath',
    category: 'Plastic Insulator',
    image: pvcInsulatedCableImg,
    conducts: false,
    material: 'Polyvinyl Chloride (PVC) synthetic polymer chain',
    hint: 'Plastic locks all electrons tightly inside covalent chemical bonds!',
    scienceDetail: 'PVC plastic is a high-grade electrical insulator that blocks up to 10,000 Volts.',
  },
  {
    id: 'steel',
    name: 'Polished Steel Key',
    category: 'Metal Conductor',
    image: copperWireMacroImg,
    conducts: true,
    material: 'Iron-carbon metallic alloy lattice',
    hint: 'Metals have a sea of free electrons that carry current!',
    scienceDetail: 'Steel conducts electricity, though with slightly more resistance than copper.',
  },
  {
    id: 'rubber',
    name: 'Vulcanized Rubber Eraser',
    category: 'Plastic Insulator',
    image: pvcInsulatedCableImg,
    conducts: false,
    material: 'Cross-linked elastomer polymer matrix',
    hint: 'Rubber tightly resists any electric current passing through!',
    scienceDetail: 'Rubber stops electron transfer completely, making it ideal for electrician safety gloves.',
  },
];

export function WireMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [activeSpecimenId, setActiveSpecimenId] = useState<string | null>('copper');
  const [testedSpecimens, setTestedSpecimens] = useState<Record<string, boolean>>({});
  const [isCircuitFlowing, setIsCircuitFlowing] = useState(false);
  const [activeMicroscopeSpecimen, setActiveMicroscopeSpecimen] = useState<'copper' | 'pvc'>('copper');
  const [microscopeZoomLevel, setMicroscopeZoomLevel] = useState<number>(250);
  const [applyChoice, setApplyChoice] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'CIRCUIT_TEST', 'MICROSCOPE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      completeMission('mission-08');
      addDiscovery({
        materialId: 'pvc-insulator',
        discoveredAt: Date.now(),
        properties: ['Electrical Insulator', 'Shockproof', 'Flexible PVC Polymer'],
        uses: ['Electric wire coating', 'Electrician tool handles', 'Wall plug insulation'],
        scienceWord: 'Electrical insulator',
      });
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/9');
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
    setActiveSpecimenId(null);
    setTestedSpecimens({});
    setIsCircuitFlowing(false);
    setApplyChoice(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'CIRCUIT_TEST':
        return Object.keys(testedSpecimens).length >= 2;
      case 'MICROSCOPE':
        return true;
      case 'APPLY':
        return applyChoice === 'plastic-grip';
      default:
        return false;
    }
  };

  const handleTestSpecimen = (specimen: TestSpecimen) => {
    setActiveSpecimenId(specimen.id);
    setIsCircuitFlowing(true);

    if (specimen.conducts) {
      sounds.sparkle();
      voiceAssistant.speak(
        `⚡ ${specimen.name} conducts electric current! Look at the lightbulb blazing with bright light!`
      );
    } else {
      sounds.pop();
      voiceAssistant.speak(
        `🛡️ ${specimen.name} is a powerful electrical insulator! It completely blocks electric current and keeps our hands 100% safe!`
      );
    }

    setTimeout(() => {
      setTestedSpecimens((prev) => ({ ...prev, [specimen.id]: true }));
      setIsCircuitFlowing(false);
    }, 900);
  };

  const activeSpecimen = SPECIMENS.find((s) => s.id === activeSpecimenId) || SPECIMENS[0];

  return (
    <MissionLayout
      missionId="mission-08"
      missionNumber={8}
      missionTitle="Pip's Electric Wire & Shock Defenders"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-amber-100 via-sky-50 to-indigo-100"
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
              PHASE 1: HOOK (The Bare Wire Mystery - Real Photo Comparison)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-4xl flex flex-col items-center text-center">
              <Pip mood="curious" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Live Wire & Shockproof Shield Mystery! ⚡
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Every electrical cord in your house has shiny reddish-orange{' '}
                <span className="text-amber-600 font-black">Copper wire</span> inside, but it is ALWAYS coated in thick colorful{' '}
                <span className="text-sky-600 font-black">PVC plastic</span> on the outside! Why do we need both?
              </p>

              {/* Real Studio Photo Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
                {/* Copper Metal Photo Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center text-center overflow-hidden">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-2">
                    1. Inside Core: Pure Copper Wire
                  </span>
                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={copperWireMacroImg}
                      alt="Raw Copper Metallic Wire Strands"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-sm font-black text-amber-800 mt-2">Electrical Conductor ⚡</span>
                  <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs leading-snug">
                    Red-orange metallic atoms with free valence electrons that let electrical current stream effortlessly!
                  </p>
                </div>

                {/* PVC Plastic Insulation Photo Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-sky-300 shadow-xl flex flex-col items-center text-center overflow-hidden">
                  <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase mb-2">
                    2. Outside Layer: PVC Plastic Sheath
                  </span>
                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={pvcInsulatedCableImg}
                      alt="Colorful PVC Insulated Multi-Core Cable"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-sm font-black text-sky-800 mt-2">Electrical Insulator 🛡️</span>
                  <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs leading-snug">
                    Polymer chains lock all electrons tightly in place, shielding human hands from lethal 240V shocks!
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Enter Live Circuit Lab 🔬</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: LIVE CIRCUIT BENCH (Interactive Real Electrical Lab)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'CIRCUIT_TEST' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Tap any material below to snap it into the circuit alligator clips and test if current flows!"
                  isVisible={true}
                />
              </div>

              {/* High-Tech Circuit Test Bench Wrapped in Focus Spotlight */}
              <ExperimentFocusSpotlight
                isActive={isCircuitFlowing}
                activeLabel={
                  activeSpecimen.conducts
                    ? '⚡ Live Electricity Flowing Through Conductor...'
                    : '🛡️ Plastic Insulator Blocking Electric Current...'
                }
              >
                {/* ── THE INTERACTIVE DIGITAL CIRCUIT BOARD ── */}
                <div className="w-full bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center relative overflow-hidden mb-6 text-white">
                  {/* Glowing Circuit Lines Header */}
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-black text-amber-300">
                      <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>12V DC Laboratory Test Rig</span>
                    </div>

                    <div className="text-xs font-bold text-slate-400">
                      {Object.keys(testedSpecimens).length} of {SPECIMENS.length} Specimens Tested
                    </div>
                  </div>

                  {/* Circuit Physical Schematic Layout */}
                  <div className="w-full max-w-3xl bg-slate-900/90 rounded-2xl p-6 border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    {/* Left: 12V Power Battery */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-300 flex flex-col items-center justify-center shadow-lg relative">
                        <div className="w-6 h-2 bg-slate-300 rounded-t-sm absolute -top-2" />
                        <Battery className="w-6 h-6 text-slate-950" />
                        <span className="text-[10px] font-black text-slate-950 mt-1">12V DC</span>
                      </div>
                      <span className="text-[11px] font-black text-amber-400 mt-2">Power Source</span>
                    </div>

                    {/* Connecting Wire Left with Moving Electricity Pulse */}
                    <div className="hidden md:flex flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                      {activeSpecimen.conducts && (
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-12 h-full bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 rounded-full shadow-[0_0_12px_#38BDF8]"
                        />
                      )}
                    </div>

                    {/* Center: The Active Test Gap with Real Specimen Photo */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-amber-400/80 bg-slate-950/80 min-w-[220px] text-center relative">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                        [ Alligator Test Clips ]
                      </span>

                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-700 shadow-md mb-2 bg-slate-900">
                          <img
                            src={activeSpecimen.image}
                            alt={activeSpecimen.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-black text-xs text-white">{activeSpecimen.name}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-1.5 ${
                            activeSpecimen.conducts
                              ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_#FBBF24]'
                              : 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10B981]'
                          }`}
                        >
                          {activeSpecimen.conducts ? '⚡ CONDUCTOR (Current Flows)' : '🛡️ INSULATOR (Current Blocked)'}
                        </span>
                      </div>
                    </div>

                    {/* Connecting Wire Right with Moving Electricity Pulse */}
                    <div className="hidden md:flex flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                      {activeSpecimen.conducts && (
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-12 h-full bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 rounded-full shadow-[0_0_12px_#38BDF8]"
                        />
                      )}
                    </div>

                    {/* Right: The Tungsten Filament Indicator Lamp with Real Glowing Photo */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg relative bg-slate-950 flex items-center justify-center p-1">
                        {activeSpecimen.conducts ? (
                          <motion.img
                            src={lightbulbGlowingBrightImg}
                            alt="Tungsten Lightbulb Glowing Bright"
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full object-cover rounded-xl filter drop-shadow-[0_0_20px_#FBBF24]"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-600">
                            <Lightbulb className="w-10 h-10" />
                            <span className="text-[9px] font-black uppercase text-slate-500 mt-1">Dark (Off)</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-black text-slate-400 mt-2">
                        {activeSpecimen.conducts ? '✨ 100% LIGHTS UP!' : 'Dark (Current Blocked)'}
                      </span>
                    </div>
                  </div>

                  {/* Live Science Feedback Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-2xl w-full text-center text-xs font-bold border-2 ${
                      activeSpecimen.conducts
                        ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                        : 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                    }`}
                  >
                    {activeSpecimen.conducts ? (
                      <span>
                        ⚡ <strong>ELECTRICAL CONDUCTOR:</strong> {activeSpecimen.name} contains free electrons that carry electrical charge instantly into the lamp!
                      </span>
                    ) : (
                      <span>
                        🛡️ <strong>ELECTRICAL INSULATOR:</strong> {activeSpecimen.name} tightly locks its electrons in place, completely shielding against electric shocks!
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* ── 4 TACTILE SPECIMEN CARDS WITH REAL PHOTOS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
                  {SPECIMENS.map((s) => {
                    const isTested = testedSpecimens[s.id];
                    const isSelected = activeSpecimenId === s.id;

                    return (
                      <motion.button
                        key={s.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTestSpecimen(s)}
                        className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 shadow-xl ring-4 ring-amber-300 scale-102'
                            : 'bg-white border-slate-200 hover:bg-slate-50 shadow-md'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs mb-2 bg-slate-50 flex items-center justify-center p-1">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <h4 className="font-black text-sm text-slate-800">{s.name}</h4>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 line-clamp-2">
                          {s.hint}
                        </span>

                        <div className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 bg-slate-100 text-slate-700">
                          {isTested ? '✓ Tested in Circuit' : 'Tap to Test in Circuit ⚡'}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </ExperimentFocusSpotlight>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: OPTICAL MICROSCOPE STUDIO (100x / 250x / 500x Zoom)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'MICROSCOPE' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="celebrating" size="lg" />
                <PipSpeechBubble
                  message="Look under the microscope! See how metals have loose free electrons while synthetic polymers lock electrons tight!"
                  isVisible={true}
                />
              </div>

              {/* ── OPTICAL MICROSCOPE STAGE ── */}
              <div className="w-full bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center relative overflow-hidden mb-8">
                <div className="flex items-center justify-between w-full mb-4 z-10 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Conductor vs Insulator Electron Microscope</span>
                  </span>

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
                      src={activeMicroscopeSpecimen === 'copper' ? cottonFabricZoomImg : polyesterFabricZoomImg}
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

                  <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-cyan-400/30 absolute" />
                    <div className="h-full w-[1px] bg-cyan-400/30 absolute" />
                    <div className="w-24 h-24 rounded-full border border-cyan-400/40 absolute" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-4 z-10">
                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('copper');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'copper'
                        ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-lg scale-102 ring-4 ring-amber-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>⚡ Copper: Free Flowing Electron Sea</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveMicroscopeSpecimen('pvc');
                    }}
                    className={`p-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      activeMicroscopeSpecimen === 'pvc'
                        ? 'bg-sky-400 border-sky-300 text-slate-950 shadow-lg scale-102 ring-4 ring-sky-400/40'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🛡️ PVC Plastic: Bound Polymers</span>
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
                      Synthetic PVC Polymer
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it CAN DO</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      Electrical Insulator (Shockproof)
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is USED FOR</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      Power Cord Sheathing & Plugs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (The Electrician Tool Decision with Real Photo)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="lg" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Electrician Safety Challenge 🛠️⚡
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-bold mb-6">
                An electrician needs to repair a 240V high-voltage home wall socket. Which screwdriver grip is certified safe against fatal shocks?
              </p>

              {/* Real Photo of Electrician Insulated Tools */}
              <div className="w-full max-w-md bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-lg mb-6 flex flex-col items-center">
                <div className="w-full h-44 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center p-1">
                  <img
                    src={electricianToolsSafetyImg}
                    alt="Certified Insulated Electrician Tools"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-xs font-black text-slate-700 mt-2">
                  🛡️ Certified 10,000V Insulated Tool Grips
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                <button
                  onClick={() => {
                    sounds.boing();
                    setApplyChoice('steel-grip');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    applyChoice === 'steel-grip'
                      ? 'bg-rose-100 border-rose-500 text-rose-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">🔪⚡</span>
                  <span>Solid Steel Metal Handle</span>
                  <span className="text-xs font-bold text-slate-500">Conducts 240V electricity directly into hand</span>
                </button>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    setApplyChoice('plastic-grip');
                  }}
                  className={`p-5 rounded-3xl border-3 font-black text-sm transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    applyChoice === 'plastic-grip'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-300 scale-105'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">🪛🛡️</span>
                  <span>Moulded PVC Plastic Handle</span>
                  <span className="text-xs font-bold text-slate-500">100% Insulator blocks high-voltage current</span>
                </button>
              </div>

              {applyChoice === 'steel-grip' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs max-w-md"
                >
                  ⚠️ Severe Hazard! Metal conducts high voltage electricity directly into the body. Electricians always use plastic-insulated tool handles!
                </motion.div>
              )}

              {applyChoice === 'plastic-grip' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs max-w-md"
                >
                  🎉 Certified Shockproof! Synthetic PVC plastic completely stops electrical charge and protects the electrician!
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
