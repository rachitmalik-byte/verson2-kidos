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
import { useFXStore } from '@/stores/fxStore';
import { ExperimentFocusSpotlight } from '@/components/interactive/ExperimentFocusSpotlight';
import {
  VectorCircuitWorkbench,
  VectorCopperRodSpecimen,
  VectorSteelKeySpecimen,
  VectorPlasticBrickSpecimen,
  VectorRubberBandSpecimen,
} from '@/components/interactive/VectorCircuitLab';

// Real Macro Studio Photography for Hook & Microscope
import copperWireMacroImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pvcInsulatedCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import electricianToolsSafetyImg from '@/assets/images/wire/electrician_tools_safety.jpg';

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
  category: 'Metal Conductor' | 'Plastic Insulator' | 'Rubber Insulator';
  conducts: boolean;
  material: string;
  hint: string;
  scienceDetail: string;
  renderGraphic: () => React.ReactNode;
}

const SPECIMENS: TestSpecimen[] = [
  {
    id: 'copper',
    name: 'Solid Copper Metal Rod',
    category: 'Metal Conductor',
    conducts: true,
    material: 'Red-orange metallic copper atoms with free valence electrons',
    hint: 'Electrons flow like water through copper metal!',
    scienceDetail: 'Copper is an exceptional electrical conductor with minimal electrical resistance.',
    renderGraphic: () => <VectorCopperRodSpecimen />,
  },
  {
    id: 'steel',
    name: 'Polished Steel Key',
    category: 'Metal Conductor',
    conducts: true,
    material: 'Iron-carbon metallic alloy lattice',
    hint: 'Metals have a sea of free electrons that carry current!',
    scienceDetail: 'Steel conducts electricity, though with slightly more resistance than copper.',
    renderGraphic: () => <VectorSteelKeySpecimen />,
  },
  {
    id: 'plastic',
    name: 'Plastic Toy Building Brick',
    category: 'Plastic Insulator',
    conducts: false,
    material: 'Molded synthetic polymer plastic with tightly locked covalent bonds',
    hint: 'Plastic holds its electrons tightly, blocking any electrical current!',
    scienceDetail: 'Synthetic plastic is a premier insulator used for plugs, switches, and appliance casings.',
    renderGraphic: () => <VectorPlasticBrickSpecimen />,
  },
  {
    id: 'rubber',
    name: 'Flexible Rubber Band',
    category: 'Rubber Insulator',
    conducts: false,
    material: 'Natural cross-linked rubber elastomer polymer',
    hint: 'Rubber stops electron transfer completely, preventing dangerous shocks!',
    scienceDetail: 'Rubber stops electric flow 100%, which is why electrician gloves are made of thick rubber.',
    renderGraphic: () => <VectorRubberBandSpecimen />,
  },
];

export function WireMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [activeSpecimenId, setActiveSpecimenId] = useState<string>('copper');
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
    setActiveSpecimenId('copper');
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
      useFXStore.getState().triggerFX('spark', 2500);
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
      missionTitle="Electric Wire & Cable Anatomy"
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
        onComplete={() => {
          setShowCelebration(false);
          navigate('/chapter/3/mission/9');
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="w-full flex-1 flex flex-col items-center justify-center py-4"
        >
          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 1: HOOK (The Dual Layer Wire Mystery)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Electrical Cable Anatomy Mystery! ⚡
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Why does EVERY power cord have <span className="text-amber-600 font-black">shiny Copper metal on the inside</span>, but is wrapped in{' '}
                <span className="text-sky-600 font-black">tough PVC Plastic on the outside</span>?
              </p>

              {/* Clean Macro Photo Pair Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
                {/* Copper Wire Core Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center text-center overflow-hidden">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase mb-2">
                    1. Inside Core: Pure Copper Wire
                  </span>
                  <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-inner my-2 border-2 border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={copperWireMacroImg}
                      alt="Raw Copper Metal Wire Strands"
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
              PHASE 2: LIVE 3D VECTOR CIRCUIT BENCH (Interactive Electrical Lab)
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
                {/* ── HIGH-DEFINITION 3D VECTOR CIRCUIT BENCH ── */}
                <div className="w-full mb-6">
                  <VectorCircuitWorkbench
                    specimenId={activeSpecimen.id}
                    conducts={activeSpecimen.conducts}
                    specimenName={activeSpecimen.name}
                    isFlowing={isCircuitFlowing}
                  />

                  {/* Live Science Feedback Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-2xl w-full text-center text-xs font-bold border-2 ${
                      activeSpecimen.conducts
                        ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md'
                    }`}
                  >
                    {activeSpecimen.conducts ? (
                      <span>
                        ⚡ <strong>ELECTRICAL CONDUCTOR:</strong> {activeSpecimen.name} contains free electrons that carry electrical charge instantly through the circuit into the lamp!
                      </span>
                    ) : (
                      <span>
                        🛡️ <strong>ELECTRICAL INSULATOR:</strong> {activeSpecimen.name} tightly locks its electrons inside polymer bonds, completely shielding human skin from electric shocks!
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* ── 4 TACTILE SPECIMEN CARDS WITH CLEAN VECTOR ART ── */}
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
                        <div className="w-full h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs mb-2 bg-slate-900 flex items-center justify-center p-1">
                          {s.renderGraphic()}
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
                      src={activeMicroscopeSpecimen === 'copper' ? copperWireMacroImg : pvcInsulatedCableImg}
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
                    <span>🛡️ PVC Plastic: Bound Covalent Polymers</span>
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
                      Copper Metal (Core) + PVC Plastic (Shell)
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. PROPERTY</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it CAN DO</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      Conductor carries charge; Insulator blocks shock
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What it is USED FOR</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      Safe household appliance cables & plugs
                    </span>
                  </div>
                </div>
              </div>

              {/* Real World Life-Saving Application Card */}
              <div className="w-full bg-slate-900 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg shrink-0">
                  <img
                    src={electricianToolsSafetyImg}
                    alt="Electrician Safety Insulated Pliers and Screwdriver"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Real-World Life-Saving Science
                    </span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-white mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Why Electrician Tools Have Thick Rubber & Plastic Grips
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 font-bold leading-relaxed">
                    Electricians cut live wires with high voltages. Their pliers have thick, vulcanized rubber and PVC handles that block 1,000+ Volts from traveling into their body!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: APPLY (Real-World Electrician Dilemma)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <Pip mood="explaining" size="xl" />
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Electrician Safety Challenge 🧰
              </h3>
              <p className="text-sm md:text-base text-slate-600 font-bold max-w-xl text-center mb-6 leading-relaxed">
                You are repairing a power box at home. Which screwdriver handle MUST you choose to prevent lethal electric shocks?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.boing();
                    voiceAssistant.speak('DANGER! Metal conducts electricity straight into your hand and causes severe electric shocks!');
                    setApplyChoice('metal-grip');
                  }}
                  className={`p-6 rounded-3xl border-4 text-center cursor-pointer transition-all flex flex-col items-center ${
                    applyChoice === 'metal-grip'
                      ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-300 shadow-xl'
                      : 'bg-white border-slate-200 hover:border-rose-300 shadow-md'
                  }`}
                >
                  <span className="text-4xl mb-3">🗡️</span>
                  <span className="font-black text-lg text-slate-900 mb-1">A. Solid Steel Handle</span>
                  <p className="text-xs font-bold text-slate-500 leading-snug">
                    Uninsulated bare steel metal handle with shiny finish.
                  </p>
                  <span className="mt-4 text-xs font-black px-4 py-1.5 rounded-full bg-rose-100 text-rose-800">
                    ⚠️ DANGEROUS CONDUCTOR
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.success();
                    voiceAssistant.speak('CORRECT! Thick plastic and rubber handles block electric charge completely, keeping you 100% safe!');
                    setApplyChoice('plastic-grip');
                  }}
                  className={`p-6 rounded-3xl border-4 text-center cursor-pointer transition-all flex flex-col items-center ${
                    applyChoice === 'plastic-grip'
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 shadow-xl'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-md'
                  }`}
                >
                  <span className="text-4xl mb-3">🛡️</span>
                  <span className="font-black text-lg text-slate-900 mb-1">B. Rubber / PVC Insulated Handle</span>
                  <p className="text-xs font-bold text-slate-500 leading-snug">
                    Heavy-duty dual-layer plastic and rubber shockproof jacket.
                  </p>
                  <span className="mt-4 text-xs font-black px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
                    ✓ 100% SHOCKPROOF INSULATOR
                  </span>
                </motion.button>
              </div>

              {applyChoice === 'plastic-grip' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 w-full"
                >
                  🎉 Brilliant! You've mastered why electrical devices wrap conductors in synthetic plastic insulators!
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
