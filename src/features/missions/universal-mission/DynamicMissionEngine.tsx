import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MissionLayout } from '../MissionLayout';
import { missions } from '@/data/missions';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { bgmEngine } from '@/lib/bgmEngine';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';
import { InquiryQuestionCard } from '@/components/interactive/InquiryQuestionCard';
import {
  HighPressurePipeLeakSim,
  RaceCarTireFrictionSim,
  MolecularVulcanizationSim,
  EpoxySyringeMixerSim,
} from '@/components/interactive/ScenarioSimulators';
import {
  PlasticIllustration,
  WireIllustration,
  KettleIllustration,
  RubberIllustration,
  CottonIllustration,
  PolyesterIllustration,
  NylonIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import {
  Flame,
  Sun,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  Gauge,
  Thermometer,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
  Home,
} from 'lucide-react';

// Real Studio Macro Educational Photography
import cottonSwatchCleanImg from '@/assets/images/experiments/cotton_swatch_clean.jpg';
import cottonSwatchWrinkledImg from '@/assets/images/experiments/cotton_swatch_wrinkled.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyesterSwatchCleanImg from '@/assets/images/experiments/polyester_swatch_clean.jpg';
import polyesterMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import polyesterFabricRollImg from '@/assets/images/specimens/polyester_fabric_roll.jpg';
import syntheticAcrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import silkwormSilkCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import naturalWoodTimberImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import woodDecayDay1Img from '@/assets/images/decay/wood_day1.jpg';
import woodDecay2WeeksImg from '@/assets/images/decay/wood_2weeks.jpg';
import woodDecay100YrsImg from '@/assets/images/decay/wood_100yrs.jpg';
import woodDecay450YrsImg from '@/assets/images/decay/wood_450yrs.jpg';
import plasticDecayDay1Img from '@/assets/images/decay/plastic_day1.jpg';
import plasticDecay2WeeksImg from '@/assets/images/decay/plastic_2weeks.jpg';
import plasticDecay100YrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import plasticDecay450YrsImg from '@/assets/images/decay/plastic_450yrs.jpg';
import soilCottonDay1Img from '@/assets/images/decay/soil_cotton_day1.jpg';
import soilCottonRottedImg from '@/assets/images/decay/soil_cotton_rotted.jpg';
import soilPlasticDay1Img from '@/assets/images/decay/soil_plastic_day1.jpg';
import soilPlastic450yrsImg from '@/assets/images/decay/soil_plastic_450yrs.jpg';
import soilAppleDay1Img from '@/assets/images/decay/soil_apple_day1.jpg';
import soilAppleRottedImg from '@/assets/images/decay/soil_apple_rotted.jpg';
import copperWireMacroImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pvcInsulatedCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import steelKeyMacroImg from '@/assets/images/wire/steel_key_macro.jpg';
import rubberEraserMacroImg from '@/assets/images/wire/rubber_eraser_macro.jpg';
import lightbulbGlowingBrightImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import boilingTeaKettleSteamImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import bakelitePanHandleImg from '@/assets/images/experiments/bakelite_pan_handle.jpg';
import castIronScorchingHandleImg from '@/assets/images/experiments/cast_iron_scorching_handle.jpg';
import bakeliteHandleCleanImg from '@/assets/images/experiments/bakelite_handle_clean.jpg';
import bakeliteHandleSafeImg from '@/assets/images/experiments/bakelite_handle_safe.jpg';
import metalHandleCleanImg from '@/assets/images/experiments/metal_handle_clean.jpg';
import metalHandleScorchingImg from '@/assets/images/experiments/metal_handle_scorching.jpg';
import cottonFabricZoomImg from '@/assets/images/raincoat/cotton_fabric_zoom.jpg';
import polyesterSportShirtImg from '@/assets/images/experiments/polyester_sport_shirt.jpg';
import petWaterBottleMoldingImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import thermosetPlugSwitchImg from '@/assets/images/experiments/thermoset_plug_switch.jpg';
import vulcanizedCarTireTreadImg from '@/assets/images/experiments/vulcanized_car_tire_tread.jpg';
import epoxyResinAdhesiveGlueImg from '@/assets/images/experiments/epoxy_resin_adhesive_glue.jpg';
import parachuteCanopyJumpImg from '@/assets/images/experiments/parachute_canopy_jump.jpg';

export const DynamicMissionEngine: React.FC = () => {
  const { missionNum } = useParams<{ missionNum: string }>();
  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const missionNumber = parseInt(missionNum || '4', 10);
  const mission = missions.find((m) => m.number === missionNumber) || missions[3];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveState, setInteractiveState] = useState<Record<string, any>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    voiceAssistant.stop();
    setCurrentStepIndex(0);
    setInteractiveState({});
    sounds.pop();

    if (missionNumber === 5) bgmEngine.setTrack('rainy-storm');
    else if (missionNumber === 6) bgmEngine.setTrack('chill-study');
    else if (missionNumber === 7) bgmEngine.setTrack('playful-lab');
    else if (missionNumber === 8) bgmEngine.setTrack('high-energy-sprint');
    else if (missionNumber === 10) bgmEngine.setTrack('cosmic-explorer');
    else if (missionNumber === 13) bgmEngine.setTrack('carnival-celebration');
    else bgmEngine.setTrack('playful-lab');
  }, [missionNumber]);

  useEffect(() => {
    voiceAssistant.stop();
    return () => {
      voiceAssistant.stop();
    };
  }, [currentStepIndex]);

  const totalSteps = mission.steps.length;
  const currentStep = mission.steps[currentStepIndex] || mission.steps[0];

  const handleNextStep = () => {
    voiceAssistant.stop();
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sounds.fanfare();
      completeMission(mission.id);
      addDiscovery({
        materialId: mission.id,
        discoveredAt: Date.now(),
        properties: mission.concepts,
        uses: [mission.title],
        scienceWord: mission.title,
      });
      setShowCelebration(true);
      setTimeout(() => {
        if (mission.number < 13) {
          navigate(`/chapter/3/mission/${mission.number + 1}`);
        } else {
          navigate('/chapter-hub');
        }
      }, 2400);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      sounds.pop();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    sounds.pop();
    setInteractiveState({});
  };

  const isStepComplete = () => {
    if (interactiveState[`step_${currentStepIndex}`] === true) return true;
    if (
      currentStep.type === 'hook' ||
      currentStep.type === 'understanding' ||
      currentStep.type === 'remember' ||
      currentStep.type === 'explore' ||
      currentStep.type === 'define'
    ) {
      return true;
    }
    return false;
  };

  // ═════════════════════════════════════════════════════════════════════════
  // TANGIBLE PHET-STYLE DISCOVERY SIMULATIONS & EXPERIMENTS (MISSIONS 4–13)
  // ═════════════════════════════════════════════════════════════════════════
  const renderExperimentContent = () => {
    switch (mission.number) {
      /* ─────────────────────────────────────────────────────────────
         MISSION 4: FABRIC LAB (Interactive Crumple & Stretch Tester)
      ───────────────────────────────────────────────────────────── */
      case 4:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Everyday Mystery Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl md:rounded-[36px] border-4 border-sky-300 shadow-xl">
                <span className="text-6xl mb-3 block">✨👔</span>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Mystery of the Wrinkled Shirt</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base leading-relaxed">
                  Have you ever packed clothes in a suitcase? Some shirts come out covered in messy wrinkles, while others look crisp and freshly ironed! Why do different fabrics behave so differently?
                </p>
                <div className="flex items-center gap-4 justify-center mb-6">
                  <Pip mood="curious" size="md" />
                  <PipSpeechBubble message="Let's test Cotton vs. Polyester in our Fabric Crumple Rig!" isVisible={true} />
                </div>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Crumple Test Lab 🔬
                </button>
              </div>
            )}

            {/* Step 1: Tangible Crumple Sandbox with Real Macro Fabric Photography */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Interactive Fabric Crumple Rig</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  Tap 'Squeeze & Crumple Fabrics' to crush both fabric swatches tightly in the press, then release to inspect the wrinkle memory!
                </p>

                <div className="grid grid-cols-2 gap-6 w-full mb-6">
                  {/* Cotton Swatch */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border-3 border-amber-300 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-black text-slate-900 text-sm md:text-base">1. Natural Cotton</span>
                      <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Natural</span>
                    </div>
                    
                    <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-3 border-amber-300 bg-white shadow-md p-1 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={interactiveState.crumpled ? 'wrinkled' : 'clean'}
                          src={interactiveState.crumpled ? cottonSwatchWrinkledImg : cottonSwatchCleanImg}
                          alt="Cotton Swatch"
                          initial={{ opacity: 0.4, scale: interactiveState.crumpled ? 0.85 : 1.05 }}
                          animate={{ opacity: 1, scale: interactiveState.crumpled ? 0.95 : 1, rotate: interactiveState.crumpled ? 3 : 0 }}
                          exit={{ opacity: 0.4 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </AnimatePresence>
                      
                      {interactiveState.crumpled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full shadow-md"
                          title="Deep Creases"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-3 min-h-[38px] flex flex-col items-center justify-center">
                      <span className={`text-xs font-black ${interactiveState.crumpled ? 'text-rose-700' : 'text-slate-600'}`}>
                        {interactiveState.crumpled ? '❌ Deep Permanent Wrinkles Formed!' : 'Smooth unpressed cotton swatch'}
                      </span>
                      {interactiveState.crumpled && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full mt-1">
                          Hydrogen bonds broke & creased ♨️
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Polyester Swatch */}
                  <div className="p-5 rounded-2xl bg-sky-50/70 border-3 border-sky-300 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-black text-slate-900 text-sm md:text-base">2. Synthetic Polyester</span>
                      <span className="text-[10px] font-black bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">Synthetic</span>
                    </div>

                    <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-3 border-sky-300 bg-white shadow-md p-1 flex items-center justify-center">
                      <motion.img
                        src={polyesterSwatchCleanImg}
                        alt="Polyester Swatch"
                        animate={
                          interactiveState.crumpled
                            ? { scale: [1, 0.85, 1.05, 1], rotate: [0, -3, 2, 0] }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-full h-full object-cover rounded-xl"
                      />

                      {interactiveState.crumpled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md"
                          title="Wrinkle-Free Elastic Springs"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-3 min-h-[38px] flex flex-col items-center justify-center">
                      <span className={`text-xs font-black ${interactiveState.crumpled ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {interactiveState.crumpled ? '✓ Springs Back 100% Wrinkle-Free!' : 'Smooth synthetic polyester'}
                      </span>
                      {interactiveState.crumpled && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                          Elastic polymer chains snapped back ✨
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.pop();
                    setInteractiveState((p) => ({
                      ...p,
                      crumpled: !p.crumpled,
                      [`step_${currentStepIndex}`]: true,
                    }));
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  {interactiveState.crumpled ? '🔄 Smooth Out & Test Again' : '✊ Squeeze & Crumple Fabrics!'}
                </button>

                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 mt-4 w-full">
                    🎉 Aha Discovery! Polyester fibres act like tiny elastic polymer springs that resist wrinkling and never need ironing!
                  </div>
                )}
              </div>
            )}

            {/* Step 2: The 3 Synthetic Superstars */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-4xl space-y-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <Pip mood="explaining" size="md" />
                  <PipSpeechBubble message="Inspect the 3 synthetic fabric superstars below! Tap each one to see how it mimics nature!" isVisible={true} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'rayon', name: 'Rayon (Artificial Silk)', origin: 'From Wood Pulp', desc: 'Mimics expensive silk! Soft, smooth, and drapes elegantly.', image: silkwormSilkCocoonImg },
                    { id: 'acrylic', name: 'Acrylic (Artificial Wool)', origin: 'From Petrochemicals', desc: 'Mimics warm wool! Lightweight, fluffy, and moths cannot eat it.', image: syntheticAcrylicYarnImg },
                    { id: 'polyester', name: 'Polyester (Terylene)', origin: 'Polymer Ester Chains', desc: '100% wrinkle-free, washes easily, and dries in minutes.', image: polyesterFabricRollImg },
                  ].map((f) => {
                    const isPicked = interactiveState[f.id];
                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          sounds.pop();
                          setInteractiveState((p) => {
                            const next = { ...p, [f.id]: true };
                            if (['rayon', 'acrylic', 'polyester'].every((k) => next[k])) {
                              next[`step_${currentStepIndex}`] = true;
                            }
                            return next;
                          });
                        }}
                        className={`p-5 rounded-3xl border-3 text-left transition-all cursor-pointer flex flex-col items-center text-center ${
                          isPicked ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-24 h-24 rounded-2xl overflow-hidden mb-3 border border-slate-100 shadow-inner bg-slate-50 p-1">
                          <img src={f.image} alt={f.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <h4 className="font-black text-base text-slate-900">{f.name}</h4>
                        <span className="text-[10px] font-black text-sky-700 bg-sky-200 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                          {f.origin}
                        </span>
                        <p className="text-xs font-bold text-slate-600 mt-2">{f.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900">
                    🎉 Excellent! All 3 synthetic fibres mastered! Tap Next Step →
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Winter Wardrobe Challenge */}
            {currentStepIndex === 4 && (
              <InquiryQuestionCard
                title="Winter Wardrobe Challenge"
                question="You need a lightweight, warm sweater for mountain camping that won't get ruined by clothes moths. Which synthetic fabric mimics wool perfectly?"
                scenarioEmoji="🧶🏔️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'acrylic',
                    label: 'Acrylic (Artificial Wool)',
                    icon: '🧶❄️',
                    isCorrect: true,
                    explanation: 'Acrylic fibres trap air pockets just like natural sheep wool, but are much lighter, cheaper, and immune to moth damage!',
                    hint: 'Which synthetic fibre is known as Artificial Wool?',
                  },
                  {
                    id: 'rayon',
                    label: 'Rayon (Artificial Silk)',
                    icon: '✨👗',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Rayon mimics silky cool party dresses, not warm winter sweaters!',
                  },
                ]}
              />
            )}

            {/* Step 5+: Dress for the Occasion Challenge */}
            {currentStepIndex >= 5 && (
              <InquiryQuestionCard
                title="Formal Wedding Party Dress"
                question="A fashion designer needs a shiny, lustrous dress fabric with the elegant sheen of silk, but affordable and durable. Which fabric fits?"
                scenarioEmoji="👗✨"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'rayon',
                    label: 'Rayon (Artificial Silk from Wood Pulp)',
                    icon: '✨👗',
                    isCorrect: true,
                    explanation: 'Rayon has a luxurious silk-like gloss and drape, made by chemically regenerating plant cellulose!',
                    hint: 'Look for the regenerated fiber historically called "artificial silk"!',
                  },
                  {
                    id: 'jute',
                    label: 'Coarse Natural Jute Sack Cloth',
                    icon: '🌾🥔',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Jute is rough and stiff, used for potato sacks rather than formal dresses.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 5: FIRE SAFETY STATION (Controlled Flame Reaction Lab)
      ───────────────────────────────────────────────────────────── */
      case 5:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-rose-300 shadow-xl">
                <Flame className="w-20 h-20 text-rose-500 mx-auto mb-3 animate-pulse" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Festival Fire Safety Mystery</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base leading-relaxed">
                  During Diwali or when cooking near a hot kitchen stove, why do parents strictly warn: <em>"Never wear synthetic clothes near fire!"</em>? Let's bring fabric swatches into our controlled flame test chamber!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Flame Test Chamber 🔥
                </button>
              </div>
            )}

            {/* Step 1: Controlled Burner Reaction Simulator with Real Photos */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-rose-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Controlled Flame Burner Chamber</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  Tap 'Apply Flame' to test how Natural Cotton vs Synthetic Polyester react when touched by a flame!
                </p>

                <div className="grid grid-cols-2 gap-6 w-full mb-6">
                  {/* Cotton Burn Test */}
                  <div className="p-5 bg-emerald-50/70 border-3 border-emerald-300 rounded-2xl flex flex-col items-center text-center">
                    <span className="font-black text-slate-900 mb-2">1. 100% Natural Cotton</span>
                    <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-white shadow-md p-1 flex items-center justify-center">
                      <img
                        src={interactiveState.burnedCotton ? cottonBurningAshImg : cottonSwatchCleanImg}
                        alt="Cotton Swatch"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 mt-2">
                      {interactiveState.burnedCotton ? '✓ Soft Gray Ash (Harmless)' : 'Clean unburned cotton swatch'}
                    </span>
                    <button
                      onClick={() => {
                        sounds.flameIgnite();
                        setInteractiveState((p) => {
                          const next = { ...p, burnedCotton: true };
                          if (next.burnedPoly) next[`step_${currentStepIndex}`] = true;
                          return next;
                        });
                      }}
                      className="mt-3 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs"
                    >
                      {interactiveState.burnedCotton ? '✓ Tested (Safe Ash)' : 'Apply Flame 🔥'}
                    </button>
                  </div>

                  {/* Polyester Melt Test */}
                  <div className="p-5 bg-rose-50/70 border-3 border-rose-300 rounded-2xl flex flex-col items-center text-center">
                    <span className="font-black text-slate-900 mb-2">2. Synthetic Polyester</span>
                    <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-rose-300 bg-white shadow-md p-1 flex items-center justify-center">
                      <img
                        src={interactiveState.burnedPoly ? polyesterMeltingBeadImg : polyesterSwatchCleanImg}
                        alt="Polyester Swatch"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 mt-2">
                      {interactiveState.burnedPoly ? '⚠️ Sticky Molten Plastic Beads!' : 'Clean unburned polyester swatch'}
                    </span>
                    <button
                      onClick={() => {
                        sounds.flameIgnite();
                        setInteractiveState((p) => {
                          const next = { ...p, burnedPoly: true };
                          if (next.burnedCotton) next[`step_${currentStepIndex}`] = true;
                          return next;
                        });
                      }}
                      className="mt-3 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs"
                    >
                      {interactiveState.burnedPoly ? '⚠️ Melts & Sticks!' : 'Apply Flame 🔥'}
                    </button>
                  </div>
                </div>

                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 w-full">
                    🎉 Aha Discovery! Cotton burns safely to paper ash. But synthetic plastics MELT into scalding sticky liquid that clings to skin!
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Molecular Reaction & Safety Golden Rule */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-rose-400 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-3 block">🔬🔥</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Molecular Reaction: Why Synthetics Melt</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Synthetic fibres are long chemical polymer chains made from petroleum. When exposed to heat, the polymer chains collapse into a hot liquid plastic puddle that clings to skin.
                </p>
                <div className="p-5 bg-rose-100 border-2 border-rose-300 rounded-2xl w-full text-left font-black text-xs text-rose-950 mb-4">
                  <span className="block text-sm mb-1">🚨 Safety Golden Rule:</span>
                  Never wear synthetic clothes (Nylon, Polyester, Rayon) while cooking in the kitchen or lighting festival firecrackers!
                </div>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl cursor-pointer"
                >
                  I Understand the Safety Rule! 🛡️
                </button>
              </div>
            )}

            {/* Step 3: Kitchen Master Chef Apron */}
            {currentStepIndex === 3 && (
              <InquiryQuestionCard
                title="Kitchen Master Chef Safety Apron"
                question="A professional chef is frying food near open gas flames. Which apron material will protect him from fire accidents?"
                scenarioEmoji="👨‍🍳🍳"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'cotton-apron',
                    label: '100% Thick Cotton Canvas Apron',
                    icon: '🌿👨‍🍳',
                    isCorrect: true,
                    explanation: 'Cotton canvas does not melt when exposed to sparks, preventing severe molten plastic burns!',
                    hint: 'Choose the natural fibre that chars into ash rather than melting into sticky liquid!',
                  },
                  {
                    id: 'nylon-apron',
                    label: 'Thin Synthetic Nylon Windbreaker Apron',
                    icon: '🧥🔥',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Thin nylon catches heat in seconds and melts directly onto the skin.',
                  },
                ]}
              />
            )}

            {/* Step 4+: Diwali Fireworks Safety Challenge */}
            {currentStepIndex >= 4 && (
              <InquiryQuestionCard
                title="Diwali Fireworks Safety Challenge"
                question="You are helping your family light sparklers during a festival celebration. Which outfit is safe to wear near flames?"
                scenarioEmoji="🪔✨"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'cotton-kurta',
                    label: '100% Natural Cotton Kurta / Dress',
                    icon: '🌿✨',
                    isCorrect: true,
                    explanation: 'Cotton does not melt when exposed to heat, preventing severe plastic adhesion burns!',
                    hint: 'Which material burns to harmless ash without melting into hot sticky beads?',
                  },
                  {
                    id: 'nylon-kurta',
                    label: 'Synthetic Polyester / Nylon Party Outfit',
                    icon: '👗🔥',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Synthetics melt in a split second and stick tightly to skin. Never wear near fire!',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 6: SUMMER COMFORT (Breathability & Evaporative Cooling Lab)
      ───────────────────────────────────────────────────────────── */
      case 6:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={cottonFabricZoomImg} alt="Porous Cotton Weave Macro" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The 42°C Scorching Summer Mystery</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base leading-relaxed">
                  When you run outside in the summer sun, your body perspires (sweats) to cool you down. But why does wearing a synthetic shirt feel like wrapping yourself in plastic wrap?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Breathability Lab ☀️
                </button>
              </div>
            )}

            {/* Step 1: Evaporative Cooling Sandbox with Real Photos */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Perspiration & Evaporation Simulator</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  Spray water droplets onto each fabric and turn on the cooling breeze fan!
                </p>

                <div className="grid grid-cols-2 gap-6 w-full mb-6">
                  {/* Cotton */}
                  <div className="p-5 bg-emerald-50 rounded-2xl border-3 border-emerald-300 text-center flex flex-col items-center">
                    <span className="font-black text-slate-900 mb-2">1. Natural Cotton</span>
                    <div className="w-36 h-36 rounded-2xl bg-white border-2 border-emerald-300 overflow-hidden shadow-md p-1 flex items-center justify-center">
                      <img src={cottonSwatchCleanImg} alt="Breathable Cotton Fabric" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 mt-2">
                      {interactiveState.sprayed ? '✓ Absorbs Perspiration & Cools Skin!' : 'Porous natural plant cellulose'}
                    </span>
                  </div>

                  {/* Polyester */}
                  <div className="p-5 bg-rose-50 rounded-2xl border-3 border-rose-300 text-center flex flex-col items-center">
                    <span className="font-black text-slate-900 mb-2">2. Synthetic Polyester</span>
                    <div className="w-36 h-36 rounded-2xl bg-white border-2 border-rose-300 overflow-hidden shadow-md p-1 flex items-center justify-center">
                      <img src={polyesterSportShirtImg} alt="Polyester Shirt" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 mt-2">
                      {interactiveState.sprayed ? '⚠️ Traps Hot Sweat & Heat Pockets!' : 'Non-porous synthetic polymer'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.splash();
                    setInteractiveState({ sprayed: true, [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer active:scale-95"
                >
                  💦 Spray Perspiration & Turn On Fan!
                </button>
              </div>
            )}

            {/* Step 2: Microscopic Porosity Cross-Section */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-3 block">🔬💨</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Microscopic Porosity Cross-Section</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Cotton fibres have hollow microscopic pores (lumens) that wick liquid sweat away from your skin through capillary action, evaporating in the breeze and cooling you down!
                </p>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
                >
                  Got It! Capillary Evaporation Rules! 💨
                </button>
              </div>
            )}

            {/* Step 3+: Inquiry Challenge */}
            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Summer Marathon Runner Outfit"
                question="You are running a 5K race in 38°C outdoor summer heat. Which outfit will keep your body temperature lowest?"
                scenarioEmoji="🏃‍♂️☀️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'cotton',
                    label: '100% Breathable Cotton Jersey',
                    icon: '🌿👕',
                    isCorrect: true,
                    explanation: 'Cotton absorbs sweat immediately and lets air circulate, preventing heat exhaustion!',
                    hint: 'Choose the natural fibre with microscopic pores for sweat evaporation!',
                  },
                  {
                    id: 'poly',
                    label: 'Synthetic Plastic Rain Jacket',
                    icon: '🧥⚠️',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Non-porous synthetics trap hot sweat against your skin, causing overheating.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 7: PLASTIC WORLD (Speech Coach + Hydraulic Press)
      ───────────────────────────────────────────────────────────── */
      case 7:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-sky-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={petWaterBottleMoldingImg} alt="Plastic Bottle Molding" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Why is Plastic Everywhere?</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  Look around! Water bottles, chair legs, charging cords, and toys are all made of plastic. What gives synthetic plastic its superpowers?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Explore Plastic Superpowers 🫙
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 mb-3 justify-center">
                  <Pip mood="explaining" size="md" />
                  <PipSpeechBubble message="Read aloud each plastic superpower using your mic, or listen to Pip to master all 4!" isVisible={true} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'mould', title: '1. Easily Moulded', sentence: 'Plastic can be melted and pressed into any shape using heat and pressure.', icon: '🔄' },
                    { id: 'rust', title: '2. Never Rusts or Rots', sentence: 'Plastic is completely waterproof and will never rust or corrode like iron.', icon: '🛡️' },
                    { id: 'light', title: '3. Lightweight & Tough', sentence: 'Plastic is far lighter than steel and will not shatter into pieces like glass.', icon: '🪶' },
                    { id: 'insulate', title: '4. Electric Insulator', sentence: 'Plastic blocks electric current to keep our hands safe from electric shocks.', icon: '⚡' },
                  ].map((p) => (
                    <SpeechReadAloudCoach
                      key={p.id}
                      title={p.title}
                      sentence={p.sentence}
                      icon={<span>{p.icon}</span>}
                      isCompleted={interactiveState[p.id] === true}
                      onComplete={() => {
                        setInteractiveState((prev) => {
                          const next = { ...prev, [p.id]: true };
                          if (['mould', 'rust', 'light', 'insulate'].every((k) => next[k])) {
                            next[`step_${currentStepIndex}`] = true;
                          }
                          return next;
                        });
                      }}
                    />
                  ))}
                </div>
                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900">
                    🎉 Awesome speech practice! All 4 superpowers mastered! Tap Next Step → to operate the Moulding Press!
                  </div>
                )}
              </div>
            )}

            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-2xl overflow-hidden mb-3 border-2 border-slate-100 shadow-md">
                  <img src={petWaterBottleMoldingImg} alt="Moulded Plastic" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Interactive Heat & Pressure Moulding Simulator!
                </h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Synthetic plastic polymers melt at moderate heat and take any mould shape under pressure. Operate the factory press below!
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <button
                    onClick={() => {
                      sounds.splash();
                      setInteractiveState((p) => ({ ...p, heatApplied: true }));
                    }}
                    className={`p-4 rounded-2xl border-3 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      interactiveState.heatApplied
                        ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-md'
                        : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Thermometer className="w-6 h-6 text-rose-500" />
                    <span className="font-black text-xs md:text-sm">
                      {interactiveState.heatApplied ? '✓ 200°C Heat Applied' : '1. Apply 200°C Heat 🔥'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      if (!interactiveState.heatApplied) {
                        sounds.boing();
                        voiceAssistant.speak('Heat the plastic first so it turns soft and molten!');
                        return;
                      }
                      sounds.success();
                      setInteractiveState((p) => ({
                        ...p,
                        pressureApplied: true,
                        [`step_${currentStepIndex}`]: true,
                      }));
                    }}
                    className={`p-4 rounded-2xl border-3 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      interactiveState.pressureApplied
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md'
                        : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Gauge className="w-6 h-6 text-emerald-600" />
                    <span className="font-black text-xs md:text-sm">
                      {interactiveState.pressureApplied ? '✓ 500 PSI Pressed!' : '2. Apply 500 PSI Pressure ⚙️'}
                    </span>
                  </button>
                </div>
                {interactiveState.pressureApplied && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl w-full">
                    <span className="font-black text-sm text-emerald-950 block">
                      ✨ Moulding Complete! High-strength thermoplastic bottle formed!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Thermoplastics vs Thermosets */}
            {currentStepIndex === 3 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl text-center flex flex-col items-center">
                <div className="w-36 h-36 rounded-2xl overflow-hidden mb-3 border-2 border-slate-100 shadow-md">
                  <img src={thermosetPlugSwitchImg} alt="Thermoset Wall Switch" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Thermoplastics vs Thermosets</h3>
                <p className="text-sm text-slate-600 font-bold mb-6">
                  Thermoplastics (like PET bottles) can be remelted and recycled over and over. But Thermoset plastics (like Bakelite wall switches) stay permanently rigid and never melt!
                </p>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Confirm Plastic Mastery 🎯
                </button>
              </div>
            )}

            {/* Step 4+: Inquiry Challenge */}
            {currentStepIndex >= 4 && (
              <InquiryQuestionCard
                title="Chemical Storage Bottle Selector"
                question="A chemistry lab needs containers to store acidic liquids for 5 years. Why do they pick plastic bottles instead of iron cans?"
                scenarioEmoji="🧴🧪"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'non-reactive',
                    label: 'Plastic is Chemically Non-Reactive & Non-Rusting',
                    icon: '🛡️🧪',
                    isCorrect: true,
                    explanation: 'Plastics do not react with water, air, or acids, making them perfect for safe chemical storage!',
                    hint: 'Which property prevents plastic from corroding or rusting over time?',
                  },
                  {
                    id: 'rusting-metal',
                    label: 'Iron Cans that Rust and Corrode',
                    icon: '🛢️⚠️',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Iron reacts with water and acids, rusting through and spilling dangerous chemicals.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 8: PIP'S ELECTRICAL WIRE (Live Circuit Sandbox)
      ───────────────────────────────────────────────────────────── */
      case 8:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={copperWireMacroImg} alt="Copper Wire" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Bare Wire Mystery! ⚡</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  Pip is building an electrical circuit. Why do electric wires always have shiny copper inside and soft plastic on the outside?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Circuit Sandbox ⚡
                </button>
              </div>
            )}

            {/* Step 1: Live Circuit Sandbox */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Live Circuit Conductor Sandbox</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  Tap each material to place it into the open electrical circuit and see if the lightbulb glows!
                </p>

                {/* Circuit Lightbulb Display with Real Lightbulb Photo */}
                <div className="p-6 bg-slate-900 rounded-3xl w-full max-w-md mb-6 flex items-center justify-around text-white border-4 border-slate-700">
                  <div className="text-center">
                    <span className="text-3xl block">🔋</span>
                    <span className="text-[10px] font-bold text-slate-400">9V Battery</span>
                  </div>

                  <div className="flex-1 mx-4 text-center">
                    {interactiveState.testedMaterial ? (
                      <span className="text-xs font-black text-amber-300 bg-slate-800 px-3 py-1 rounded-full border border-amber-500/50">
                        {interactiveState.testedMaterial}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">--- [ Open Gap ] ---</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center p-1">
                      {interactiveState.conducts ? (
                        <img src={lightbulbGlowingBrightImg} alt="Bulb Lit" className="w-full h-full object-cover rounded-xl filter drop-shadow-[0_0_15px_#FBBF24]" />
                      ) : (
                        <Lightbulb className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">
                      {interactiveState.conducts ? 'LIGHTS UP! ✓' : 'Dark (Off)'}
                    </span>
                  </div>
                </div>

                {/* Material Selectors with Real Photos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-4">
                  {[
                    { id: 'copper', name: 'Copper Wire', image: copperWireMacroImg, conducts: true, type: 'Conductor' },
                    { id: 'steel', name: 'Steel Key', image: steelKeyMacroImg, conducts: true, type: 'Conductor' },
                    { id: 'plastic', name: 'PVC Cable Plastic', image: pvcInsulatedCableImg, conducts: false, type: 'Insulator' },
                    { id: 'rubber', name: 'Rubber Eraser', image: rubberEraserMacroImg, conducts: false, type: 'Insulator' },
                  ].map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => {
                        if (mat.conducts) sounds.sparkle();
                        else sounds.pop();

                        setInteractiveState((p) => {
                          const next = {
                            ...p,
                            testedMaterial: mat.name,
                            conducts: mat.conducts,
                            [mat.id]: true,
                          };
                          if (next.copper && next.plastic) next[`step_${currentStepIndex}`] = true;
                          return next;
                        });
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-center cursor-pointer transition-all flex flex-col items-center ${
                        interactiveState[mat.id]
                          ? 'bg-amber-100 border-amber-500 font-black'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden mb-1 border border-slate-200">
                        <img src={mat.image} alt={mat.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-black text-slate-900 block">{mat.name}</span>
                      <span className={`text-[10px] font-bold ${mat.conducts ? 'text-amber-700' : 'text-sky-700'}`}>
                        {mat.type}
                      </span>
                    </button>
                  ))}
                </div>

                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 w-full">
                    🎉 Aha Discovery! Copper conducts electricity to power the bulb, while PVC Plastic blocks electricity to protect our fingers from shocks!
                  </div>
                )}
              </div>
            )}

            {/* Step 2: PVC Extrusion Safety Lab */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-300 shadow-xl text-center flex flex-col items-center">
                <div className="w-36 h-36 rounded-2xl overflow-hidden mb-3 border-2 border-slate-100 shadow-md">
                  <img src={pvcInsulatedCableImg} alt="PVC Insulated Cable" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">PVC Extrusion Safety Lab</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  In electrical cable factories, molten PVC (Polyvinyl Chloride) plastic is extruded smoothly over the central copper wire to build an impenetrable insulating jacket.
                </p>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
                >
                  Jacket Extrusion Verified ⚡
                </button>
              </div>
            )}

            {/* Step 3+: Inquiry Challenge */}
            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Electrician Tool Challenge"
                question="An electrician is repairing a 240V live wall socket. Which tool handle should she use to stay safe?"
                scenarioEmoji="🛠️⚡"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'plastic-handle',
                    label: 'Screwdriver with Plastic-Moulded Grip',
                    icon: '🪛🛡️',
                    isCorrect: true,
                    explanation: 'Plastic is an electrical insulator! It completely blocks high-voltage electric current from entering the hands.',
                    hint: 'Look for the material that blocks electricity from passing through!',
                  },
                  {
                    id: 'metal-handle',
                    label: 'Screwdriver with Solid Steel Metal Grip',
                    icon: '🔪⚡',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Steel is a metal conductor! Electricity would travel directly through the handle into the body.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 9: SAVE PIP'S HAND! (Stove Heat Conductivity Lab)
      ───────────────────────────────────────────────────────────── */
      case 9:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-rose-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={boilingTeaKettleSteamImg} alt="Boiling Tea Kettle" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Save Pip's Hand! 🫖</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  The tea kettle is boiling at 100°C! The pot is made of metal to boil water fast, but what material will keep the handle cool?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Test Kettle Handle Materials 🌡️
                </button>
              </div>
            )}

            {/* Step 1: Real Photo Handle Test Bench with Live Thermal Physics */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Kettle Handle Thermal Test Chamber</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  The kettle is boiling at 100°C! Tap each handle below to test its heat transfer and see the thermal reaction:
                </p>

                {/* Central Boiling Kettle Status Banner */}
                <div className="w-full bg-slate-900 text-white p-4 rounded-2xl mb-6 flex items-center justify-between border-2 border-slate-700 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-600 shrink-0">
                      <img src={boilingTeaKettleSteamImg} alt="100C Steam Kettle" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">
                        HEAT SOURCE • BOILING WATER
                      </span>
                      <span className="text-sm font-black text-white">Metal Pot Core: 100°C Steam</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-amber-400 block">
                      {interactiveState.testedBakelite ? '❄️ INSULATED' : interactiveState.testedIron ? '🔥 SCORCHING' : 'READY TO TEST'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-6">
                  {/* Bakelite Handle Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sounds.success();
                      voiceAssistant.speak('Bakelite plastic blocks heat flow! The handle stays cool at 26°C, protecting your hand from burns!');
                      setInteractiveState((p) => ({ ...p, testedBakelite: true, [`step_${currentStepIndex}`]: true }));
                    }}
                    className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                      interactiveState.testedBakelite
                        ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 shadow-xl'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-md'
                    }`}
                  >
                    {/* State Header Tag */}
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {interactiveState.testedBakelite ? 'AFTER: 100°C STEAM TEST' : 'BEFORE: UNTESTED ROOM TEMP'}
                      </span>
                      {interactiveState.testedBakelite && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> SAFE
                        </span>
                      )}
                    </div>

                    {/* Real Macro Photography with dynamic swap */}
                    <div className="w-full aspect-square max-w-[220px] rounded-2xl overflow-hidden mb-3 border-2 border-slate-200 shadow-inner bg-slate-100 relative">
                      <img
                        src={interactiveState.testedBakelite ? bakeliteHandleSafeImg : bakeliteHandleCleanImg}
                        alt="Bakelite Handle"
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      {interactiveState.testedBakelite && (
                        <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                          <span>❄️ 26°C (Cool Grip)</span>
                        </div>
                      )}
                    </div>

                    <span className="font-black text-base text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      1. Thermosetting Bakelite Handle
                    </span>
                    <span className="text-xs text-slate-600 font-bold mb-3">
                      Cross-linked polymer insulator blocks heat
                    </span>

                    <span className={`text-xs font-black px-4 py-1.5 rounded-full transition-all ${
                      interactiveState.testedBakelite
                        ? 'bg-emerald-200 text-emerald-950 border border-emerald-400 shadow-xs'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs'
                    }`}>
                      {interactiveState.testedBakelite ? '✓ 26°C Cool & Safe To Hold! ❄️' : 'Tap to Test Temperature 🌡️'}
                    </span>
                  </motion.button>

                  {/* Cast Iron Handle Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sounds.boing();
                      voiceAssistant.speak('Ouch! Metal conducts scorching 100°C heat straight from the boiling water into the hand!');
                      setInteractiveState((p) => ({ ...p, testedIron: true }));
                    }}
                    className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                      interactiveState.testedIron
                        ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-300 shadow-xl'
                        : 'bg-white border-slate-200 hover:border-rose-300 shadow-md'
                    }`}
                  >
                    {/* State Header Tag */}
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {interactiveState.testedIron ? 'AFTER: 100°C STEAM TEST' : 'BEFORE: UNTESTED ROOM TEMP'}
                      </span>
                      {interactiveState.testedIron && (
                        <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> DANGER
                        </span>
                      )}
                    </div>

                    {/* Real Macro Photography with dynamic swap */}
                    <div className="w-full aspect-square max-w-[220px] rounded-2xl overflow-hidden mb-3 border-2 border-slate-200 shadow-inner bg-slate-100 relative">
                      <img
                        src={interactiveState.testedIron ? metalHandleScorchingImg : metalHandleCleanImg}
                        alt="Cast Iron Handle"
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      {interactiveState.testedIron && (
                        <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 animate-pulse">
                          <span>🔥 98°C (SCORCHING!)</span>
                        </div>
                      )}
                    </div>

                    <span className="font-black text-base text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      2. Bare Cast Iron Metal Grip
                    </span>
                    <span className="text-xs text-slate-600 font-bold mb-3">
                      High thermal conductor transfers boiling heat
                    </span>

                    <span className={`text-xs font-black px-4 py-1.5 rounded-full transition-all ${
                      interactiveState.testedIron
                        ? 'bg-rose-200 text-rose-950 border border-rose-400 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}>
                      {interactiveState.testedIron ? '⚠️ 98°C Scorching Heat Danger! 🔥' : 'Tap to Test Temperature 🌡️'}
                    </span>
                  </motion.button>
                </div>

                {interactiveState.testedBakelite && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 w-full animate-fade-in shadow-md">
                    🎉 Perfect Science Discovery! Bakelite is a thermosetting polymer insulator. Its cross-linked chemical network blocks heat conduction, keeping your fingers safe at 26°C even when boiling 100°C water!
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Molecular Heat Conduction */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-rose-300 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-3 block">🌡️🥘</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Molecular Heat Conduction</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Metals conduct heat because free electrons vibrate rapidly across their crystal lattice. But Bakelite's densely cross-linked polymer network traps heat vibrations in place!
                </p>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer"
                >
                  Thermal Conduction Mastered 🔥
                </button>
              </div>
            )}

            {/* Step 3+: Inquiry Challenge */}
            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Cookware Safety Designer"
                question="You are designing a chef frying pan that reaches 250°C on a gas burner. Which handle will protect the chef?"
                scenarioEmoji="🍲✨"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'bakelite-grip',
                    label: 'Moulded Bakelite Insulator Grip',
                    icon: '🛡️👨‍🍳',
                    isCorrect: true,
                    explanation: 'Bakelite prevents heat conduction, keeping the chef safe even when cooking over high flames!',
                    hint: 'Which material blocks heat transfer into the chef’s fingers?',
                  },
                  {
                    id: 'copper-grip',
                    label: 'Bare Copper Metal Grip',
                    icon: '🔥🍳',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Copper is one of the fastest heat conductors and will cause serious burns!',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 10: THE PLASTIC PROBLEM (500-Year Soil Time Chamber)
      ───────────────────────────────────────────────────────────── */
      case 10:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-emerald-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={naturalWoodTimberImg} alt="Decaying Wood in Soil" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The 500-Year Underground Time Travel</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  What happens when trash is buried underground? Why does natural wood vanish in weeks while synthetic plastic stays for 500 years?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Time Travel Soil Chamber ⏳
                </button>
              </div>
            )}

            {/* Step 1: Multi-Specimen Consistent Soil Decay Simulator */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-4xl flex flex-col items-center bg-white p-5 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⏳🌱</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    500-Year Soil Time Travel Chamber
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 text-center max-w-xl">
                  Choose a pair of materials below, then travel forward in time to discover why nature eats organic items but plastic trash stays for centuries!
                </p>

                {/* Specimen Category Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-5 w-full">
                  {[
                    { id: 'cotton', label: '👕 1. Cotton Fabric vs Plastic Bottle', natural: 'Cotton Fabric' },
                    { id: 'apple', label: '🍎 2. Apple Fruit vs Plastic Bottle', natural: 'Apple Fruit' },
                    { id: 'wood', label: '🪵 3. Wood Timber vs Plastic Pellets', natural: 'Wood Timber' },
                  ].map((pair) => {
                    const isSelected = (interactiveState.soilPair || 'cotton') === pair.id;
                    return (
                      <button
                        key={pair.id}
                        onClick={() => {
                          sounds.pop();
                          voiceAssistant.stop();
                          setInteractiveState((p) => ({ ...p, soilPair: pair.id }));
                        }}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-700 text-white shadow-md scale-102 ring-2 ring-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        }`}
                      >
                        {pair.label}
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Milestone Buttons */}
                <div className="w-full bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Time Travel Milestones:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { step: 0, label: '🌱 Day 1 (Fresh)', voice: 'Day 1: Both materials are freshly buried in dark garden soil.' },
                      { step: 1, label: '⏳ 2 Weeks', voice: '2 Weeks later: Soil bacteria and moisture begin decomposing the natural item.' },
                      { step: 2, label: '🍂 1 Year', voice: '1 Year later: Natural plant fibers crumble into rich garden compost!' },
                      { step: 3, label: '🚀 450+ Years', voice: '450 Years in the future: Natural organic matter vanished into fertile soil, but synthetic plastic is still polluting!' },
                    ].map((t) => {
                      const isCurrent = (interactiveState.timeStep ?? 0) === t.step;
                      return (
                        <button
                          key={t.step}
                          onClick={() => {
                            sounds.sparkle();
                            voiceAssistant.speak(t.voice);
                            setInteractiveState((p) => ({
                              ...p,
                              timeStep: t.step,
                              [`step_${currentStepIndex}`]: t.step >= 1,
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300 scale-105'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Side-by-Side Soil Decomposition Observation Cards */}
                {(() => {
                  const step = interactiveState.timeStep ?? 0;
                  const pair = interactiveState.soilPair || 'cotton';

                  let naturalImg = soilCottonDay1Img;
                  let naturalTitle = '100% Natural Cotton Swatch';
                  let naturalState = 'Freshly buried clean plant cellulose fibers in dark potting soil.';
                  let naturalBadge = '🌱 Fresh Organic Matter';

                  let syntheticImg = soilPlasticDay1Img;
                  let syntheticTitle = 'Synthetic PET Plastic Bottle';
                  let syntheticState = 'Brand new man-made polymer bottle resting in soil.';
                  let syntheticBadge = '🧪 Fresh Polymer Bottle';

                  if (pair === 'cotton') {
                    naturalImg = step >= 1 ? soilCottonRottedImg : soilCottonDay1Img;
                    naturalTitle = '100% Natural Cotton Fabric';
                    naturalState =
                      step === 0
                        ? 'Day 1: Clean woven cotton cloth buried fresh in soil cross-section.'
                        : 'Composted into dark, fertile garden humus soil feeding plant root systems! ✓';
                    naturalBadge = step >= 1 ? '✓ 100% Biodegraded Compost' : '🌱 Day 1 in Soil';

                    syntheticImg = step >= 2 ? soilPlastic450yrsImg : soilPlasticDay1Img;
                    syntheticTitle = 'Synthetic PET Plastic Bottle';
                    syntheticState =
                      step === 0
                        ? 'Day 1: Clean transparent plastic water bottle resting in soil.'
                        : '450+ Years: Microbes cannot eat synthetic bonds. Plastic turns brittle and shatters into toxic microplastics! ⚠️';
                    syntheticBadge = step >= 2 ? '⚠️ 450+ Yrs Non-Biodegradable' : '🧪 Day 1 in Soil';
                  } else if (pair === 'apple') {
                    naturalImg = step >= 1 ? soilAppleRottedImg : soilAppleDay1Img;
                    naturalTitle = 'Natural Fresh Apple Fruit Core';
                    naturalState =
                      step === 0
                        ? 'Day 1: Fresh fruit organic core buried in the glass soil study box.'
                        : '2 Weeks: Microbes completely broke down fruit into dark compost with a seedling growing! ✓';
                    naturalBadge = step >= 1 ? '✓ 100% Biodegraded Compost' : '🌱 Day 1 in Soil';

                    syntheticImg = step >= 2 ? soilPlastic450yrsImg : soilPlasticDay1Img;
                    syntheticTitle = 'Synthetic PET Plastic Bottle';
                    syntheticState =
                      step === 0
                        ? 'Day 1: Clean transparent plastic water bottle in soil.'
                        : '450+ Years: Still undigested in dirt! Soil bacteria cannot digest synthetic plastics. ⚠️';
                    syntheticBadge = step >= 2 ? '⚠️ 450+ Yrs Non-Biodegradable' : '🧪 Day 1 in Soil';
                  } else {
                    // Wood pair
                    const woodImgs = [woodDecayDay1Img, woodDecay2WeeksImg, woodDecay100YrsImg, woodDecay450YrsImg];
                    const plasticImgs = [plasticDecayDay1Img, plasticDecay2WeeksImg, plasticDecay100YrsImg, plasticDecay450YrsImg];
                    naturalImg = woodImgs[step] || woodImgs[0];
                    naturalTitle = 'Natural Fallen Wood Timber';
                    naturalState =
                      step === 0
                        ? 'Day 1: Solid natural tree cellulose block.'
                        : step === 1
                        ? '2 Weeks: Fungi and microbes soften wood fibers.'
                        : '100+ Years: Fully decomposed into fertile soil compost! ✓';
                    naturalBadge = step >= 2 ? '✓ 100% Recycled to Nature' : '🌱 Organic Cellulose';

                    syntheticImg = plasticImgs[step] || plasticImgs[0];
                    syntheticTitle = 'Synthetic Plastic Pellets';
                    syntheticState =
                      step === 0
                        ? 'Day 1: Brand new synthetic hydrocarbon plastic beads.'
                        : '450+ Years: Still undigested by bacteria, breaking into microplastics! ⚠️';
                    syntheticBadge = step >= 2 ? '⚠️ 450+ Yrs Non-Biodegradable' : '🧪 Synthetic Polymer';
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                      {/* Left: Natural Biodegradable Specimen Card */}
                      <div className="p-5 bg-gradient-to-b from-emerald-50 to-white rounded-3xl border-3 border-emerald-400 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
                        <div className="w-full flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                            NATURAL MATERIAL
                          </span>
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {naturalBadge}
                          </span>
                        </div>

                        <div className="w-full aspect-square max-w-[240px] rounded-2xl overflow-hidden mb-3 border-2 border-emerald-300 shadow-inner bg-slate-900 relative">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={`nat-${pair}-${step}`}
                              src={naturalImg}
                              alt={naturalTitle}
                              initial={{ opacity: 0.4, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0.4, scale: 1.04 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full object-cover"
                            />
                          </AnimatePresence>
                        </div>

                        <h4 className="font-black text-base text-emerald-950 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {naturalTitle}
                        </h4>
                        <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                          {naturalState}
                        </p>
                      </div>

                      {/* Right: Synthetic Non-Biodegradable Specimen Card */}
                      <div className="p-5 bg-gradient-to-b from-rose-50 to-white rounded-3xl border-3 border-rose-400 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
                        <div className="w-full flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-300">
                            SYNTHETIC MATERIAL
                          </span>
                          <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                            {syntheticBadge}
                          </span>
                        </div>

                        <div className="w-full aspect-square max-w-[240px] rounded-2xl overflow-hidden mb-3 border-2 border-rose-300 shadow-inner bg-slate-900 relative">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={`synth-${pair}-${step}`}
                              src={syntheticImg}
                              alt={syntheticTitle}
                              initial={{ opacity: 0.4, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0.4, scale: 1.04 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full object-cover"
                            />
                          </AnimatePresence>
                        </div>

                        <h4 className="font-black text-base text-rose-950 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {syntheticTitle}
                        </h4>
                        <p className="text-xs font-bold text-rose-800 leading-relaxed">
                          {syntheticState}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Clear Science Lesson Takeaway Box */}
                <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl text-slate-900 w-full shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                      Simple Science Takeaway:
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    🌿 <strong>Biodegradable:</strong> Earthworms and soil bacteria naturally eat organic plant fibers (cotton, wood, fruit), recycling them into rich garden food within weeks.  
                    <br />
                    ⚠️ <strong>Non-Biodegradable:</strong> Bacteria <em>cannot</em> digest man-made plastic chemicals, so plastics stay trapped in Earth's soil for over 450 years!
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Understand Biodegradable vs Non-Biodegradable */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-emerald-300 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-3 block">🌿🔬</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Biodegradable vs Non-Biodegradable</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Materials that break down naturally by microbes and fungi are <strong>BIODEGRADABLE</strong> (cotton, wood, fruit peel). Synthetic plastics are <strong>NON-BIODEGRADABLE</strong> and last over 450 years.
                </p>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl cursor-pointer"
                >
                  I Understand the Science Terms! 🌿
                </button>
              </div>
            )}

            {/* Step 3: The 4 R's Circular Economy Challenge */}
            {currentStepIndex === 3 && (
              <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 md:p-8 rounded-3xl border-4 border-teal-400 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2">The 4 R's Circular Economy Challenge!</h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6 text-center">
                  Tap each action to master the 4 R's that protect Earth's soil and oceans:
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  {[
                    { id: 'reduce', title: '1. REDUCE', desc: 'Use less single-use plastic packaging', icon: '📉' },
                    { id: 'reuse', title: '2. REUSE', desc: 'Carry reusable bottles and cloth totes', icon: '🔄' },
                    { id: 'recycle', title: '3. RECYCLE', desc: 'Sort plastics into blue recycling bins', icon: '♻️' },
                    { id: 'refuse', title: '4. REFUSE', desc: 'Say no to single-use plastic straws', icon: '🚫' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        sounds.pop();
                        setInteractiveState((p) => {
                          const next = { ...p, [r.id]: true };
                          if (['reduce', 'reuse', 'recycle', 'refuse'].every((k) => next[k])) {
                            next[`step_${currentStepIndex}`] = true;
                          }
                          return next;
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                        interactiveState[r.id] ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-3xl mb-1 block">{r.icon}</span>
                      <span className="font-black text-sm text-slate-900 block">{r.title}</span>
                      <span className="text-[11px] font-bold text-slate-600">{r.desc}</span>
                      {interactiveState[r.id] && <span className="text-xs font-black text-emerald-600 mt-1 block">✓ Mastered</span>}
                    </button>
                  ))}
                </div>
                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-950 w-full">
                    🎉 Outstanding! All 4 R's mastered! Tap Next Step → for the final eco-challenge!
                  </div>
                )}
              </div>
            )}

            {/* Step 4+: Inquiry Challenge */}
            {currentStepIndex >= 4 && (
              <InquiryQuestionCard
                title="Arjun's Grocery Shopping Choice"
                question="Arjun is at the market counter with 5 items. Which bag choice protects our oceans and soil?"
                scenarioEmoji="🛒🛍️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'jute-bag',
                    label: 'Reusable Jute Cloth Tote Bag',
                    icon: '🌿🛍️',
                    isCorrect: true,
                    explanation: 'Jute is a natural, 100% biodegradable plant fibre that can be reused hundreds of times without waste!',
                    hint: 'Choose the renewable plant material that can be reused over and over!',
                  },
                  {
                    id: 'plastic-bag',
                    label: 'Single-Use Thin Plastic Carrier Bag',
                    icon: '🫙⚠️',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Thin plastic bags take 450 years to break down and clog animal habitats and waterways.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 11: STRETCH LAB (Race Car Tires & Synthetic Rubber)
      ───────────────────────────────────────────────────────────── */
      case 11:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-sky-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={vulcanizedCarTireTreadImg} alt="Vulcanized Car Tire" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Race Track Rubber Mystery! 🏎️🛞</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  Natural rubber comes from milky tree latex. But racing cars at 300 km/h heat tyres up to 160°C! How did chemists transform rubber into high-grip racing tyres?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Tire Friction Lab 🛞
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center">
                <RaceCarTireFrictionSim onTested={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })} />
              </div>
            )}

            {currentStepIndex === 2 && (
              <div className="w-full max-w-3xl flex flex-col items-center">
                <MolecularVulcanizationSim onCompleted={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })} />
              </div>
            )}

            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Formula 1 Grand Prix Tire Engineering"
                question="Formula 1 race cars travel at 300 km/h with tyres reaching 160°C. Which rubber formulation must engineers specify?"
                scenarioEmoji="🏎️🛞"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'synthetic-rubber',
                    label: 'Vulcanized Synthetic Buna Rubber Tire',
                    icon: '🛞⚙️',
                    isCorrect: true,
                    explanation: 'Synthetic rubber combined with vulcanized sulphur creates heat-resistant 3D cross-links that withstand immense road friction!',
                    hint: 'Which rubber is chemically engineered with sulfur cross-links to withstand extreme heat and friction?',
                  },
                  {
                    id: 'latex-rubber',
                    label: 'Pure Uncured Tree Latex Sap',
                    icon: '🌳🎈',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Natural uncured tree latex becomes sticky and melts into liquid paste under high road friction.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 12: THE REPAIR STATION (Pressurized Pipe Simulator)
      ───────────────────────────────────────────────────────────── */
      case 12:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 mx-auto border-2 border-slate-100 shadow-md">
                  <img src={epoxyResinAdhesiveGlueImg} alt="Epoxy Adhesive Sealant" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Emergency Repair Station! 🧪🔧</h2>
                <p className="text-slate-600 font-bold mb-6 text-sm md:text-base">
                  A high-pressure plumbing pipe cracked! Water is blasting out at 80 PSI! Let's choose the right synthetic adhesive to seal the leak!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Start Pipe Repair 🔧
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full max-w-3xl flex flex-col items-center">
                <HighPressurePipeLeakSim onSealed={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })} />
              </div>
            )}

            {currentStepIndex === 2 && (
              <div className="w-full max-w-3xl flex flex-col items-center">
                <EpoxySyringeMixerSim onMixed={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })} />
              </div>
            )}

            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Aerospace Spacecraft Heat-Shield Repair"
                question="A spacecraft re-entering Earth's atmosphere experiences intense 1,500°C friction heat and mechanical vibration. Which adhesive bonds heat-shield tiles to the fuselage?"
                scenarioEmoji="🚀🛡️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'structural-epoxy',
                    label: 'High-Temperature Synthetic Structural Epoxy',
                    icon: '🧪🚀',
                    isCorrect: true,
                    explanation: 'Cross-linked synthetic polymer epoxies resist extreme thermal shock and hold space tiles securely during atmospheric re-entry!',
                    hint: 'Which adhesive cures into a cross-linked polymer network engineered for high-stress aerospace engineering?',
                  },
                  {
                    id: 'wheat-paste',
                    label: 'Natural Flour & Water Starch Paste',
                    icon: '🌾🍞',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Organic flour paste burns to ash at 180°C and has virtually zero water or shear resistance.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 13: PIP'S SCIENCE CAMP (Grand Master Finale)
      ───────────────────────────────────────────────────────────── */
      case 13:
        return (
          <div className="w-full max-w-3xl flex flex-col items-center text-center">
            {currentStepIndex === 0 && (
              <InquiryQuestionCard
                title="Challenge 1: Stormy Mountain Camp Shelter"
                question="A sudden mountain rainstorm hits your campsite! Which tent fabric will keep all campers 100% dry and resist mildew?"
                scenarioEmoji="🏕️🌧️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'poly-tent',
                    label: 'Synthetic Polyester Fabric Tent',
                    icon: '⛺💧',
                    isCorrect: true,
                    explanation: 'Polyester fibres are non-porous and hydrophobic, allowing rainwater to roll right off without soaking in!',
                    hint: 'Think about which fibre is naturally water-repellent and quick drying!',
                  },
                  {
                    id: 'cotton-tent',
                    label: 'Natural Cotton Linen Fabric Tent',
                    icon: '🌿⛺',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Cotton absorbs heavy water, gets heavy, and begins leaking in prolonged rain.',
                  },
                ]}
              />
            )}

            {currentStepIndex === 1 && (
              <InquiryQuestionCard
                title="Challenge 2: Mountain Climbing Rope"
                question="You are packing rope to climb a steep 500-meter rocky cliff. Which rope has tensile strength stronger than steel?"
                scenarioEmoji="🧗‍♂️🪢"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'nylon-rope',
                    label: 'Braided Synthetic Nylon Rope',
                    icon: '🪢💪',
                    isCorrect: true,
                    explanation: 'Nylon has extraordinary tensile strength, elasticity, and resists abrasion, making it the universal choice for mountain rescue!',
                    hint: 'Which synthetic fibre was famously proven stronger than steel of the same thickness?',
                  },
                  {
                    id: 'jute-rope',
                    label: 'Natural Jute Plant Twine String',
                    icon: '🌾🪢',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Plant twine has low tensile strength and snaps easily under heavy human climbing weight.',
                  },
                ]}
              />
            )}

            {currentStepIndex === 2 && (
              <InquiryQuestionCard
                title="Challenge 3: Campfire Cooking Safety"
                question="The campsite fire is blazing as you roast marshmallows on skewers. What should you wear near the open flames?"
                scenarioEmoji="🔥⛺"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'cotton-apron',
                    label: '100% Natural Cotton Apron',
                    icon: '🌿👨‍🍳',
                    isCorrect: true,
                    explanation: 'Cotton burns slowly to soft gray ash and never melts, keeping your skin safe from severe plastic burns!',
                    hint: 'Remember which fabric does NOT melt into scalding sticky beads when near fire!',
                  },
                  {
                    id: 'nylon-jacket',
                    label: 'Synthetic Nylon Windbreaker Jacket',
                    icon: '🧥🔥',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Synthetic nylon melts instantly near flame and sticks painfully to skin. Never wear near fire!',
                  },
                ]}
              />
            )}

            {currentStepIndex === 3 && (
              <InquiryQuestionCard
                title="Challenge 4: Campfire Tea Kettle Handle"
                question="The campfire kettle is whistling hot with boiling water. Which handle material will keep your fingers completely cool?"
                scenarioEmoji="🫖🔥"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'bakelite-kettle',
                    label: 'Thermosetting Bakelite Plastic Grip',
                    icon: '🛡️🫖',
                    isCorrect: true,
                    explanation: 'Bakelite is a thermosetting polymer that blocks thermal conduction, protecting hands from 100°C steam!',
                    hint: 'Look for the classic thermal insulator used across cookware handles!',
                  },
                  {
                    id: 'iron-kettle',
                    label: 'Solid Iron Metal Grip',
                    icon: '🔥🍳',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Iron is a thermal conductor and conducts the blazing heat directly into your palms.',
                  },
                ]}
              />
            )}

            {currentStepIndex === 4 && (
              <InquiryQuestionCard
                title="Challenge 5: Leave No Trace Planet Cleanup"
                question="Camp is ending! You have empty snack wrappers, juice bottles, and plastic containers. What is the scientist's duty?"
                scenarioEmoji="♻️🌿"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'recycle-bins',
                    label: 'Pack & Recycle in Designated Blue Bins',
                    icon: '♻️🌱',
                    isCorrect: true,
                    explanation: 'Recycling plastics prevents microplastic accumulation and turns discarded polymers into new useful materials!',
                    hint: 'Which choice follows the 3 R’s (Reduce, Reuse, Recycle) to protect forest wildlife?',
                  },
                  {
                    id: 'bury-soil',
                    label: 'Bury Plastic Wrappers in Forest Soil',
                    icon: '🌲⚠️',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Plastics take over 450 years to decay and release toxic microplastics into forest soil and groundwater.',
                  },
                ]}
              />
            )}

            {/* Step 5: Grand Graduation Ceremony + Home Quest */}
            {currentStepIndex >= 5 && (
              <div className="flex flex-col items-center">
                <div className="w-56 h-56 rounded-3xl overflow-hidden mb-4 border-4 border-amber-400 shadow-2xl">
                  <img src={parachuteCanopyJumpImg} alt="Graduation Skydive" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Grand Science Champion! 🏕️
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-bold mb-6 max-w-lg mx-auto">
                  You've tested raincoats, stretched super-nylon, explored polymers, mastered electrical insulation, passed fire safety, and cleaned up planet Earth! You are now an official Master of Synthetic Materials!
                </p>

                {/* Real-World Home Science Quest Badge */}
                <div className="p-5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-3xl border-3 border-sky-300 w-full max-w-md mb-6 text-left shadow-md flex items-start gap-3">
                  <div className="p-2.5 bg-sky-500 text-white rounded-2xl shrink-0">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 mb-1">🏠 1-Minute Home Science Quest</h4>
                    <p className="text-xs font-bold text-slate-600">
                      Check 3 clothing tags in your wardrobe! Can you find one 100% Cotton shirt and one Polyester jacket?
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-4 border-amber-300 w-full max-w-md mb-6 shadow-xl">
                  <div className="text-2xl font-black text-amber-900 mb-1">🏆 Master Scientist Certificate</div>
                  <p className="text-xs font-bold text-amber-700">13 of 13 Missions Mastered (100% Complete)</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-5 h-5 text-amber-500 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-xl cursor-pointer active:scale-95"
                >
                  Claim Master Scientist Trophy ⭐
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MissionLayout
      missionId={mission.id}
      missionNumber={mission.number}
      missionTitle={mission.title}
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
      onRedo={handleRedo}
      themeGradient="from-sky-100 via-indigo-50 to-amber-50"
    >
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => setShowCelebration(false)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mission.id}_${currentStepIndex}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full flex-1 flex flex-col items-center justify-center py-4"
        >
          {renderExperimentContent()}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
};
