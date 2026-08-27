import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MissionLayout } from '../MissionLayout';
import { missions } from '@/data/missions';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { bgmEngine } from '@/lib/bgmEngine';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';
import {
  PlasticIllustration,
  WireIllustration,
  KettleIllustration,
  RubberIllustration,
  ParachuteIllustration,
  CottonIllustration,
  NylonIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import {
  Flame,
  Sun,
  ShieldCheck,
  Check,
  ArrowRight,
  Layers,
  Wrench,
  Trophy,
  Sparkles,
  Zap,
  Gauge,
  Thermometer,
} from 'lucide-react';

export const DynamicMissionEngine: React.FC = () => {
  const { missionNum } = useParams<{ missionNum: string }>();
  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);

  const missionNumber = parseInt(missionNum || '5', 10);
  const mission = missions.find((m) => m.number === missionNumber) || missions[4];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactiveState, setInteractiveState] = useState<Record<string, any>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setCurrentStepIndex(0);
    setInteractiveState({});
    sounds.pop();

    // Set BGM theme
    if (missionNumber === 7) bgmEngine.setTrack('playful-lab');
    else if (missionNumber === 8) bgmEngine.setTrack('high-energy-sprint');
    else if (missionNumber === 10) bgmEngine.setTrack('cosmic-explorer');
    else if (missionNumber === 13) bgmEngine.setTrack('carnival-celebration');
    else bgmEngine.setTrack('playful-lab');
  }, [missionNumber]);

  const totalSteps = mission.steps.length;
  const currentStep = mission.steps[currentStepIndex] || mission.steps[0];

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sounds.fanfare();
      completeMission(mission.id);
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
    // If step is hook or understanding, it's always ready to advance
    if (
      currentStep.type === 'hook' ||
      currentStep.type === 'understanding' ||
      currentStep.type === 'remember'
    ) {
      return true;
    }
    // Interactive step completed
    return interactiveState[`step_${currentStepIndex}`] === true;
  };

  // Render rich custom experiment based on mission number
  const renderExperimentContent = () => {
    switch (mission.number) {
      /* ─────────────────────────────────────────────────────────────
         MISSION 7: PLASTIC WORLD (Speech-to-Text Read Aloud + Moulding Machine)
      ───────────────────────────────────────────────────────────── */
      case 7:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <PlasticIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Why is Plastic Everywhere?</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Look around! Water bottles, chair legs, charging cords, and toys are all made of plastic. What gives synthetic plastic its superpowers?
                </p>
                <div className="flex items-center gap-4 justify-center">
                  <Pip mood="curious" size="md" />
                  <PipSpeechBubble message="Let's discover and read aloud the 4 biggest superpowers of plastics!" isVisible={true} />
                </div>
              </div>
            )}

            {/* Step 1: Read Aloud Voice Coach for 4 Superpowers */}
            {currentStepIndex === 1 && (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 mb-3 justify-center">
                  <Pip mood="explaining" size="md" />
                  <PipSpeechBubble message="Read aloud each plastic superpower using your mic, or listen to Pip to master all 4!" isVisible={true} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'mould',
                      title: '1. Easily Moulded',
                      sentence: 'Plastic can be melted and pressed into any shape using heat and pressure.',
                      icon: '🔄',
                    },
                    {
                      id: 'rust',
                      title: '2. Never Rusts or Rots',
                      sentence: 'Plastic is completely waterproof and will never rust or corrode like iron.',
                      icon: '🛡️',
                    },
                    {
                      id: 'light',
                      title: '3. Lightweight & Tough',
                      sentence: 'Plastic is far lighter than steel and will not shatter into pieces like glass.',
                      icon: '🪶',
                    },
                    {
                      id: 'insulate',
                      title: '4. Electric Insulator',
                      sentence: 'Plastic blocks electric current to keep our hands safe from electric shocks.',
                      icon: '⚡',
                    },
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900 shadow-md"
                  >
                    🎉 Awesome speech practice! All 4 superpowers mastered! Tap Next Step → to operate the Moulding Press!
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Interactive Heat & Pressure Moulding Simulator */}
            {currentStepIndex === 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center text-center">
                <span className="text-5xl mb-2">🔄🏭</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Interactive Heat & Pressure Moulding Simulator!
                </h3>
                <p className="text-xs md:text-sm text-slate-600 font-bold mb-6">
                  Synthetic plastic polymers melt at moderate heat and take any mould shape under pressure. Operate the factory press below!
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  {/* Heat Lever */}
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

                  {/* Pressure Clamp */}
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

                {interactiveState.pressureApplied ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl w-full"
                  >
                    <span className="text-4xl block mb-1">🦆✨</span>
                    <span className="font-black text-sm text-emerald-950 block">
                      Moulding Complete! A perfect toy duck popped out of the press!
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      Tap Next Step → to continue!
                    </span>
                  </motion.div>
                ) : (
                  <div className="text-xs font-bold text-slate-400">
                    Step 1: Heat plastic ➔ Step 2: Clamp with high pressure
                  </div>
                )}
              </div>
            )}

            {/* Step 3 & 4: Understanding & Practice */}
            {currentStepIndex >= 3 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-2">💡🎯</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Plastic Superpower Review!
                </h3>
                <p className="text-sm text-slate-600 font-bold mb-6">
                  Because plastics are non-reactive, lightweight, and easily moulded, they are used for electrical wire coating, water bottles, and lightweight luggage!
                </p>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer active:scale-95"
                >
                  {interactiveState[`step_${currentStepIndex}`] ? '✓ Review Complete!' : 'Confirm Mastery 🎯'}
                </button>
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
                  <PipSpeechBubble message="Assemble a safe electrical wire! Place copper inside for electricity, and plastic outside for safety!" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-6 w-full max-w-xl mb-6">
                  <button
                    onClick={() => {
                      sounds.success();
                      setInteractiveState((p) => {
                        const next = { ...p, copper: true };
                        if (next.plastic) next[`step_${currentStepIndex}`] = true;
                        return next;
                      });
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
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl"
                >
                  Understood Conductor & Insulator! ✓
                </button>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 9: SAVE PIP'S HAND! (Heat Insulation)
      ───────────────────────────────────────────────────────────── */
      case 9:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="text-center max-w-2xl mb-6">
              <KettleIllustration className="w-24 h-24 mx-auto mb-3" />
              <h2 className="text-3xl font-black text-slate-900 mb-2">Save Pip's Hand! 🫖</h2>
              <p className="text-slate-600 font-bold">
                The tea kettle is boiling at 100°C! Which material should we attach to the handle so Pip can lift it safely without burning his fingers?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              {[
                { id: 'metal', name: 'Iron Metal Handle', correct: false, hint: 'Burns hand! (Thermal Conductor)' },
                { id: 'bakelite', name: 'Bakelite Plastic Handle', correct: true, hint: 'Safe! (Thermal Insulator) ✓' },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    if (h.correct) {
                      sounds.fanfare();
                      setInteractiveState({ [`step_${currentStepIndex}`]: true, pickedSafe: true });
                    } else {
                      sounds.boing();
                      voiceAssistant.speak('Metal absorbs boiling heat quickly and would burn Pip’s fingers! Try Bakelite plastic!');
                    }
                  }}
                  className={`p-6 rounded-3xl border-4 text-center cursor-pointer transition-all ${
                    h.correct && interactiveState.pickedSafe
                      ? 'bg-emerald-50 border-emerald-400 shadow-xl'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <h4 className="font-black text-base text-slate-900">{h.name}</h4>
                  <span className="text-xs font-bold text-slate-500 mt-1 block">{h.hint}</span>
                </button>
              ))}
            </div>
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 10: THE PLASTIC PROBLEM (Biodegradable vs Microplastics)
      ───────────────────────────────────────────────────────────── */
      case 10:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="text-center max-w-2xl mb-6">
              <Layers className="w-24 h-24 text-sky-500 mx-auto mb-3" />
              <h2 className="text-3xl font-black text-slate-900 mb-2">The Plastic Challenge 🌍</h2>
              <p className="text-slate-600 font-bold">
                Plastics do not rot or decay naturally. Over 450 years, they break down into tiny microplastics. We must practice the 3 Rs: Reduce, Reuse, and Recycle!
              </p>
            </div>

            <button
              onClick={() => {
                sounds.fanfare();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
            >
              Take the 3 R's Planet Pledge 🌿
            </button>
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
            <button
              onClick={() => {
                sounds.success();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
            >
              Test Rubber Elasticity & Friction ✓
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
                Synthetic adhesives create unbreakable molecular seals that can even stop high-pressure pipe leaks!
              </p>
            </div>
            <button
              onClick={() => {
                sounds.fanfare();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
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
            <button
              onClick={() => {
                sounds.fanfare();
                setInteractiveState({ [`step_${currentStepIndex}`]: true });
              }}
              className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
            >
              Claim Scientist Master Badge ⭐
            </button>
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
              className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
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
