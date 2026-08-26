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
import {
  RaincoatSyntheticIllustration,
  CottonIllustration,
  NylonIllustration,
  PolyesterIllustration,
  PlasticIllustration,
  RubberIllustration,
  WireIllustration,
  KettleIllustration,
  ParachuteIllustration,
  WoolIllustration,
  SilkIllustration,
  WoodIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Flame,
  Sun,
  Layers,
  Wrench,
  Trophy,
  RotateCcw,
  AlertTriangle,
  TreePine,
  Factory,
  Globe,
} from 'lucide-react';

export const DynamicMissionEngine: React.FC = () => {
  const { missionNum } = useParams<{ missionNum: string }>();
  const navigate = useNavigate();
  const missionNumber = parseInt(missionNum || '1', 10);
  const mission = missions.find((m) => m.number === missionNumber) || missions[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveState, setInteractiveState] = useState<Record<string, any>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  useEffect(() => {
    // Reset state on mission switch
    setCurrentStepIndex(0);
    setInteractiveState({});
    sounds.pop();
  }, [missionNumber]);

  const totalSteps = mission.steps.length;
  const currentStep = mission.steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sounds.fanfare();
      completeMission(mission.id);
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter-hub');
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
    if (currentStep.type === 'hook' || currentStep.type === 'understanding' || currentStep.type === 'remember') {
      return true;
    }
    return interactiveState[`step_${currentStepIndex}`] === true;
  };

  // Render rich custom experiment based on mission number
  const renderExperimentContent = () => {
    switch (mission.number) {
      /* ─────────────────────────────────────────────────────────────
         MISSION 7: PLASTIC WORLD (8 Advantages & Moulding)
      ───────────────────────────────────────────────────────────── */
      case 7:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <PlasticIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Why is Plastic Everywhere?</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Look around! Water bottles, chair legs, charging cords, and toys are all made of plastic. What makes crude petroleum plastic so versatile?
                </p>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full">
                <div className="flex items-center gap-4 mb-6 justify-center">
                  <Pip mood="explaining" size="lg" />
                  <PipSpeechBubble message="Tap on each plastic superpower to unlock the 4 biggest advantages of plastics!" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'mould', title: '1. Easily Moulded', desc: 'Can be pressed into any shape using heat & pressure', icon: '🔄' },
                    { id: 'rust', title: '2. Never Rusts or Rots', desc: 'Impermeable to water and does not corrode', icon: '🛡️' },
                    { id: 'light', title: '3. Lightweight & Tough', desc: 'Far lighter than iron and will not shatter like glass', icon: '🪶' },
                    { id: 'insulate', title: '4. Electric Insulator', desc: 'Blocks electric current to keep you safe from shocks', icon: '⚡' },
                  ].map((adv) => {
                    const isUnlocked = interactiveState[adv.id];
                    return (
                      <button
                        key={adv.id}
                        onClick={() => {
                          sounds.pop();
                          setInteractiveState((p) => {
                            const next = { ...p, [adv.id]: true };
                            if (['mould', 'rust', 'light', 'insulate'].every((k) => next[k])) {
                              next[`step_${currentStepIndex}`] = true;
                            }
                            return next;
                          });
                        }}
                        className={`p-5 rounded-3xl border-3 text-left transition-all cursor-pointer ${
                          isUnlocked
                            ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-3xl mb-1 block">{adv.icon}</span>
                        <h4 className="font-black text-base text-slate-900">{adv.title}</h4>
                        <p className="text-xs font-bold text-slate-500 mt-1">{adv.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="text-center max-w-2xl">
                <span className="text-5xl block mb-2">🔄🏭</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Heat + Pressure = Any Shape!</h3>
                <p className="text-slate-600 font-bold mb-6 leading-relaxed">
                  Unlike metals that require massive blast furnaces, synthetic plastics can be melted and injected into intricate moulds at moderate heat, producing chairs, bottles, and toys in seconds.
                </p>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 8: PIP'S ELECTRICAL WIRE (Conductor vs Insulator)
      ───────────────────────────────────────────────────────────── */
      case 8:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <WireIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">What Keeps Electricity Safe? ⚡</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Inside charging cables flows powerful electrical current. Why don't you get an electric shock when you touch a charging wire?
                </p>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center gap-4 mb-6">
                  <Pip mood="thinking" size="lg" />
                  <PipSpeechBubble message="Assemble a safe electrical wire! Place copper inside for the electricity, and plastic outside for safety!" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-6 w-full max-w-xl mb-6">
                  <button
                    onClick={() => {
                      sounds.success();
                      setInteractiveState((p) => ({ ...p, copper: true }));
                    }}
                    className={`p-6 rounded-3xl border-3 flex flex-col items-center transition-all cursor-pointer ${
                      interactiveState.copper ? 'bg-amber-100 border-amber-500 shadow-md' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-4xl mb-1">⚡</span>
                    <span className="font-black text-base text-slate-900">1. Copper Core</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-200 px-3 py-0.5 rounded-full mt-1">
                      Electrical Conductor ✓
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.success();
                      setInteractiveState((p) => {
                        const next = { ...p, plastic: true };
                        if (next.copper) next[`step_${currentStepIndex}`] = true;
                        return next;
                      });
                    }}
                    className={`p-6 rounded-3xl border-3 flex flex-col items-center transition-all cursor-pointer ${
                      interactiveState.plastic ? 'bg-sky-100 border-sky-500 shadow-md' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-4xl mb-1">🛡️</span>
                    <span className="font-black text-base text-slate-900">2. Plastic Sleeve</span>
                    <span className="text-xs font-bold text-sky-700 bg-sky-200 px-3 py-0.5 rounded-full mt-1">
                      Electrical Insulator ✓
                    </span>
                  </button>
                </div>
                {interactiveState.copper && interactiveState.plastic && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900">
                    🎉 Safe Wire Complete! Copper lets electricity flow, while plastic insulator keeps your hands 100% safe!
                  </div>
                )}
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="text-center max-w-2xl">
                <span className="text-5xl block mb-2">⚡🛡️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Conductors vs Insulators</h3>
                <p className="text-slate-600 font-bold mb-4 leading-relaxed">
                  A <span className="text-amber-600 font-black">Conductor</span> allows electric current to travel freely through it. An <span className="text-sky-600 font-black">Insulator</span> blocks electricity completely!
                </p>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 9: SAVE PIP'S HAND! (Heat Insulation & Kettle Handle)
      ───────────────────────────────────────────────────────────── */
      case 9:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <KettleIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Boiling Kettle Challenge! 🫖</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Water inside the kettle is boiling at 100°C! The metal pot is burning hot. What material should we use for the handle so Pip can pour tea safely?
                </p>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center gap-4 mb-6">
                  <Pip mood="thinking" size="lg" />
                  <PipSpeechBubble message="Test handle materials! Tap the material that will NOT burn Pip's hand!" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-6">
                  <button
                    onClick={() => sounds.boing()}
                    className="p-6 rounded-3xl border-3 bg-white hover:bg-rose-50 border-slate-200 opacity-60 flex flex-col items-center cursor-pointer"
                  >
                    <span className="text-4xl mb-1">🪙</span>
                    <span className="font-black text-base text-slate-900">Solid Aluminium Metal</span>
                    <span className="text-xs font-bold text-rose-600 mt-1">Heat Conductor (Burns Hand!)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.fanfare();
                      setInteractiveState((p) => ({ ...p, [`step_${currentStepIndex}`]: true, handlePicked: true }));
                    }}
                    className="p-6 rounded-3xl border-3 bg-emerald-50 hover:bg-emerald-100 border-emerald-400 flex flex-col items-center cursor-pointer shadow-md"
                  >
                    <span className="text-4xl mb-1">🛡️</span>
                    <span className="font-black text-base text-slate-900">Heat-Resistant Bakelite Plastic</span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-200 px-3 py-0.5 rounded-full mt-1">
                      Thermal Insulator (Safe & Cool) ✓
                    </span>
                  </button>
                </div>
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="text-center max-w-2xl">
                <span className="text-5xl block mb-2">🧤🔥</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Heat Insulators Protect Us!</h3>
                <p className="text-slate-600 font-bold mb-4 leading-relaxed">
                  Certain synthetic plastics (like Bakelite and Melamine) do not soften under heat and do not conduct thermal energy, making frying pans and kettles safe to hold.
                </p>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 10: THE PLASTIC PROBLEM (Microplastics & Recycling)
      ───────────────────────────────────────────────────────────── */
      case 10:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <Globe className="w-24 h-24 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Useful but Dangerous? 🌍</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Because plastics are non-biodegradable, a discarded bottle can stay in nature for over 400 years, breaking down into microplastics. Let's explore the solutions!
                </p>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full max-w-2xl flex flex-col items-center">
                <div className="flex items-center gap-4 mb-6">
                  <Pip mood="explaining" size="lg" />
                  <PipSpeechBubble message="Sort these 4 everyday items: Which will rot naturally (Biodegradable) vs Stay Forever (Non-biodegradable)?" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                  {[
                    { id: 'apple', label: 'Apple Core', type: 'Bio', icon: '🍎' },
                    { id: 'bag', label: 'Plastic Carry Bag', type: 'Non-Bio', icon: '🛍️' },
                    { id: 'paper', label: 'Paper Newspaper', type: 'Bio', icon: '📰' },
                    { id: 'bottle', label: 'PET Water Bottle', type: 'Non-Bio', icon: '🫙' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.pop();
                        setInteractiveState((p) => {
                          const next = { ...p, [item.id]: true };
                          if (['apple', 'bag', 'paper', 'bottle'].every((k) => next[k])) {
                            next[`step_${currentStepIndex}`] = true;
                          }
                          return next;
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between font-black text-sm cursor-pointer ${
                        interactiveState[item.id]
                          ? 'bg-emerald-100 border-emerald-400 text-slate-900'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      {interactiveState[item.id] && (
                        <span className="text-xs font-black bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="text-center max-w-2xl">
                <span className="text-5xl block mb-2">♻️🌱</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">The 3 R's: Reduce, Reuse, Recycle!</h3>
                <p className="text-slate-600 font-bold mb-4 leading-relaxed">
                  Scientists are developing biodegradable plastics made from corn starch and sugarcane to replace petroleum plastic!
                </p>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 11: STRETCH LAB (Natural Latex vs Synthetic Rubber)
      ───────────────────────────────────────────────────────────── */
      case 11:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="text-center max-w-2xl mb-6">
              <RubberIllustration className="w-24 h-24 mx-auto mb-3" />
              <h2 className="text-3xl font-black text-slate-900 mb-2">Natural Latex vs Synthetic Rubber 🛞</h2>
              <p className="text-slate-600 font-bold">
                Natural rubber comes from tree sap (latex). Synthetic rubber is engineered in factories to handle heavy trucks, high temperatures, and immense friction!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="p-6 bg-white rounded-3xl border-3 border-emerald-200 text-center">
                <span className="text-4xl mb-1 block">🌳</span>
                <h4 className="font-black text-lg text-slate-900">Natural Rubber</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">From tree latex • Soft, used for balloons & erasers</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border-3 border-sky-200 text-center">
                <span className="text-4xl mb-1 block">🏭</span>
                <h4 className="font-black text-lg text-slate-900">Synthetic Rubber</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">From petrochemicals • Heavy duty tyres & surgical gloves</p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.success();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="mt-6 btn-3d-amber text-slate-950 font-black text-base py-3 px-8 rounded-2xl cursor-pointer"
            >
              Test Rubber Elasticity ✓
            </button>
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 12: THE REPAIR STATION (Synthetic Adhesives)
      ───────────────────────────────────────────────────────────── */
      case 12:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="text-center max-w-2xl mb-6">
              <Wrench className="w-24 h-24 text-amber-500 mx-auto mb-3" />
              <h2 className="text-3xl font-black text-slate-900 mb-2">Synthetic Adhesives & Super Glues 🧴</h2>
              <p className="text-slate-600 font-bold">
                Adhesives stick surfaces together! Natural adhesives come from pine tree resin, but synthetic adhesives create unbreakable molecular seals that can even stop pressurized pipe leaks!
              </p>
            </div>
            <button
              onClick={() => {
                sounds.fanfare();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="btn-3d-emerald text-white font-black text-lg py-4 px-10 rounded-2xl cursor-pointer"
            >
              Seal Broken Pipe with Super Glue! 🧪
            </button>
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 13: PIP'S SCIENCE CAMP (Grand Master Quiz)
      ───────────────────────────────────────────────────────────── */
      case 13:
        return (
          <div className="w-full max-w-3xl flex flex-col items-center text-center">
            <Trophy className="w-28 h-28 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Grand Science Champion Camp! 🏕️
            </h2>
            <p className="text-base text-slate-600 font-bold mb-6 max-w-lg mx-auto">
              You've tested raincoats, stretched super-nylon, explored polymers, and mastered fire safety! You are now an official Master of Synthetic Materials!
            </p>
            <div className="p-6 bg-amber-50 rounded-3xl border-3 border-amber-300 w-full max-w-md mb-6">
              <div className="text-2xl font-black text-amber-900 mb-1">🏆 Master Scientist Certificate</div>
              <p className="text-xs font-bold text-amber-700">13 of 13 Missions Mastered</p>
            </div>
          </div>
        );

      /* Default Fallback */
      default:
        return (
          <div className="w-full max-w-3xl flex flex-col items-center text-center">
            <Pip mood="celebrating" size="xl" />
            <h2 className="text-3xl font-black text-slate-900 mb-2 mt-4">{mission.title}</h2>
            <p className="text-slate-600 font-bold mb-6 max-w-lg">{mission.subtitle}</p>
            <button
              onClick={() => {
                sounds.success();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="btn-3d-amber text-slate-950 font-black text-base py-3 px-8 rounded-2xl cursor-pointer"
            >
              Start Experiment Phase ✓
            </button>
          </div>
        );
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
