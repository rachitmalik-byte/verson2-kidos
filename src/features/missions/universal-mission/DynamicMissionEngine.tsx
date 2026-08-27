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
  Layers,
  Wrench,
  Trophy,
  Sparkles,
  Zap,
  Gauge,
  Thermometer,
  AlertTriangle,
  Droplet,
  CheckCircle2,
  Clock,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

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

  const totalSteps = mission.steps.length;
  const currentStep = mission.steps[currentStepIndex] || mission.steps[0];

  const handleNextStep = () => {
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
  // RENDER DEDICATED EXPERIMENTS FOR EVERY STEP OF MISSIONS 4 TO 13
  // ═════════════════════════════════════════════════════════════════════════
  const renderExperimentContent = () => {
    switch (mission.number) {
      /* ─────────────────────────────────────────────────────────────
         MISSION 4: FABRIC LAB (Polyester, Rayon, Acrylic)
      ───────────────────────────────────────────────────────────── */
      case 4:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <span className="text-5xl mb-2 block">✨🧵</span>
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Fabric Laboratory</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Synthetic fibres can mimic expensive natural materials like silk and wool at a fraction of the cost! Let's discover Rayon, Acrylic, and Polyester!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Fabric Lab 🔬
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <Pip mood="explaining" size="md" />
                  <PipSpeechBubble message="Inspect the 3 synthetic fabric superstars below! Tap each one to reveal its superpower!" isVisible={true} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'rayon', name: 'Rayon (Artificial Silk)', origin: 'Wood Pulp Chemistry', superpower: 'Silky smooth, drapes beautifully, absorbs color vividly', icon: '✨' },
                    { id: 'acrylic', name: 'Acrylic (Artificial Wool)', origin: 'Petroleum Polymers', superpower: 'Warm, fluffy, moth-resistant, lightweight winter wear', icon: '🧶' },
                    { id: 'polyester', name: 'Polyester (Terylene)', origin: 'Ester Chemical Chains', superpower: '100% wrinkle-free, easy to wash, dries immediately', icon: '👕' },
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
                        className={`p-5 rounded-3xl border-3 text-left transition-all cursor-pointer ${
                          isPicked ? 'bg-sky-100 border-sky-500 shadow-md' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{f.icon}</span>
                        <h4 className="font-black text-base text-slate-900">{f.name}</h4>
                        <span className="text-[10px] font-black text-sky-700 bg-sky-200 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                          {f.origin}
                        </span>
                        <p className="text-xs font-bold text-slate-600 mt-2">{f.superpower}</p>
                      </button>
                    );
                  })}
                </div>
                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900">
                    🎉 Fantastic! All 3 synthetic fabrics inspected! Tap Next Step → to continue!
                  </div>
                )}
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-2">👕❄️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Why Synthetics are Popular</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  Natural silk and wool are expensive and attacked by moths. Synthetic rayon and acrylic look and feel just as luxurious, but last for years without shrinking!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Mastered Fabric Science ✓
                </button>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 5: FIRE SAFETY STATION (Flame Reaction Test)
      ───────────────────────────────────────────────────────────── */
      case 5:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <Flame className="w-20 h-20 text-rose-500 mx-auto mb-3 animate-pulse" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Fire Safety Station 🔥</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Why must you NEVER wear synthetic polyester or nylon clothes near kitchen stoves or Diwali firecrackers? Let's test the flame chamber!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Start Flame Test Chamber 🔬
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <Pip mood="concerned" size="md" />
                  <PipSpeechBubble message="Apply flame to Cotton and Polyester to see how their fibres react!" isVisible={true} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-3xl border-4 border-emerald-300 shadow-md text-center flex flex-col items-center">
                    <span className="font-black text-lg text-slate-900 mb-2">Natural Cotton</span>
                    <CottonIllustration className="w-16 h-16 my-2" />
                    <button
                      onClick={() => {
                        sounds.success();
                        setInteractiveState((p) => {
                          const next = { ...p, burnCotton: true };
                          if (next.burnPoly) next[`step_${currentStepIndex}`] = true;
                          return next;
                        });
                      }}
                      className={`w-full py-3 rounded-2xl font-black text-xs md:text-sm mt-3 cursor-pointer ${
                        interactiveState.burnCotton
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                      }`}
                    >
                      {interactiveState.burnCotton ? '✓ Burns Cleanly to Soft Ash' : 'Apply Flame to Cotton 🔥'}
                    </button>
                    {interactiveState.burnCotton && (
                      <p className="text-xs font-bold text-slate-500 mt-2">
                        Cotton burns like paper, turning into safe crumbly gray ash!
                      </p>
                    )}
                  </div>

                  <div className="p-6 bg-white rounded-3xl border-4 border-rose-300 shadow-md text-center flex flex-col items-center">
                    <span className="font-black text-lg text-slate-900 mb-2">Synthetic Polyester</span>
                    <PolyesterIllustration className="w-16 h-16 my-2" />
                    <button
                      onClick={() => {
                        sounds.boing();
                        setInteractiveState((p) => {
                          const next = { ...p, burnPoly: true };
                          if (next.burnCotton) next[`step_${currentStepIndex}`] = true;
                          return next;
                        });
                      }}
                      className={`w-full py-3 rounded-2xl font-black text-xs md:text-sm mt-3 cursor-pointer ${
                        interactiveState.burnPoly
                          ? 'bg-rose-100 text-rose-900 border border-rose-400'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                      }`}
                    >
                      {interactiveState.burnPoly ? '⚠️ MELTS into Scalding Beads!' : 'Apply Flame to Polyester 🔥'}
                    </button>
                    {interactiveState.burnPoly && (
                      <p className="text-xs font-bold text-rose-600 mt-2">
                        Polyester melts and sticks tightly to skin, causing severe burns!
                      </p>
                    )}
                  </div>
                </div>

                {interactiveState[`step_${currentStepIndex}`] && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900">
                    🎉 Great observation! You discovered that synthetics melt while cotton burns to ash! Tap Next Step →
                  </div>
                )}
              </div>
            )}

            {currentStepIndex >= 2 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-400 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-2">🪔🛡️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">The Golden Rule of Fire Safety</h3>
                <p className="text-sm text-slate-600 font-bold mb-6 leading-relaxed">
                  Always wear 100% natural cotton clothes during festival fireworks or cooking. Never wear synthetic fabrics near open heat!
                </p>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  I Promise to Wear Cotton Near Fire! ✓
                </button>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 6: SUMMER COMFORT (Inquiry Question Card)
      ───────────────────────────────────────────────────────────── */
      case 6:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <Sun className="w-20 h-20 text-amber-500 mx-auto mb-3 animate-spin" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Summer Comfort Challenge ☀️</h2>
                <p className="text-slate-600 font-bold mb-6">
                  It's 42°C in the summer heat! Which shirt will keep you cool and allow sweat to evaporate?
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Test Summer Fabrics 👕
                </button>
              </div>
            )}

            {currentStepIndex >= 1 && (
              <InquiryQuestionCard
                title="Summer Heat Outfit Selector"
                question="You are heading outside in 42°C blazing summer sun. Which shirt will keep your body cool?"
                scenarioEmoji="☀️👕"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'cotton',
                    label: '100% Natural Cotton Shirt',
                    icon: '🌿👕',
                    isCorrect: true,
                    explanation: 'Cotton has microscopic pores that absorb perspiration and allow cool air to circulate, cooling your body!',
                    hint: 'Natural cotton fibres absorb sweat and breathe freely!',
                  },
                  {
                    id: 'poly',
                    label: 'Synthetic Polyester Shirt',
                    icon: '👕🧴',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Synthetic polyester does not absorb moisture and traps body heat, causing rashes in hot weather!',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 7: PLASTIC WORLD (Speech Read Aloud + Moulding Press)
      ───────────────────────────────────────────────────────────── */
      case 7:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <PlasticIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Why is Plastic Everywhere?</h2>
                <p className="text-slate-600 font-bold mb-6">
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
                <span className="text-5xl mb-2">🔄🏭</span>
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
                    <span className="text-4xl block mb-1">🦆✨</span>
                    <span className="font-black text-sm text-emerald-950 block">
                      Moulding Complete! A perfect toy duck popped out of the press!
                    </span>
                  </div>
                )}
              </div>
            )}

            {currentStepIndex >= 3 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl text-center flex flex-col items-center">
                <span className="text-5xl mb-2">💡🎯</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Plastic Superpower Review!</h3>
                <p className="text-sm text-slate-600 font-bold mb-6">
                  Because plastics are non-reactive, lightweight, and easily moulded, they are used for electrical wire coating, water bottles, and lightweight luggage!
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
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 8: PIP'S ELECTRICAL WIRE (4 Steps)
      ───────────────────────────────────────────────────────────── */
      case 8:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <WireIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Bare Wire Mystery! ⚡</h2>
                <p className="text-slate-600 font-bold mb-6">
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
                  Assemble Safe Wire 🛡️
                </button>
              </div>
            )}

            {/* Step 1: Interactive Wire Assembler */}
            {currentStepIndex === 1 && (
              <div className="w-full flex flex-col items-center max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <Pip mood="thinking" size="lg" />
                  <PipSpeechBubble message="Assemble a safe electrical wire! Place copper inside for electricity, and plastic outside for safety!" isVisible={true} />
                </div>
                <div className="grid grid-cols-2 gap-6 w-full mb-6">
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
                      interactiveState.copper ? 'bg-amber-100 border-amber-500 shadow-md ring-4 ring-amber-200' : 'bg-white border-slate-200 hover:bg-slate-50'
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
                      interactiveState.plastic ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200' : 'bg-white border-slate-200 hover:bg-slate-50'
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

            {/* Step 2: Understand Conductors & Insulators */}
            {currentStepIndex === 2 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl">
                <span className="text-5xl block mb-2">⚡🛡️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Conductors vs Insulators</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  A <span className="text-amber-600 font-black">Conductor</span> (like Copper metal) lets electric charges race through freely. An <span className="text-sky-600 font-black">Insulator</span> (like PVC Plastic) traps electricity so it never touches your skin!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Understood Conductor & Insulator Law! ✓
                </button>
              </div>
            )}

            {/* Step 3: Practice Electric Tool Challenge without spoiler labels */}
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
         MISSION 9: SAVE PIP'S HAND! (4 Steps)
      ───────────────────────────────────────────────────────────── */
      case 9:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <KettleIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Save Pip's Hand! 🫖</h2>
                <p className="text-slate-600 font-bold mb-6">
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

            {/* Step 1: Handle Test without spoilers */}
            {currentStepIndex === 1 && (
              <InquiryQuestionCard
                title="Kettle Handle Material Test"
                question="The kettle is bubbling with 100°C steam. Which material should Pip choose for the lifting handle?"
                scenarioEmoji="🫖🌡️"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'bakelite',
                    label: 'Thermosetting Bakelite Plastic',
                    icon: '🛡️🫖',
                    isCorrect: true,
                    explanation: 'Bakelite plastic is a thermal insulator and does not soften or conduct heat, staying cool at room temperature!',
                    hint: 'Choose the synthetic polymer known for resisting heat in kitchen appliances!',
                  },
                  {
                    id: 'iron',
                    label: 'Cast Iron Metal Grip',
                    icon: '🔥🍳',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Iron is a thermal conductor! Heat from boiling water travels right up the metal handle.',
                  },
                ]}
              />
            )}

            {/* Step 2: Understand Thermal Insulation */}
            {currentStepIndex === 2 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center">
                <span className="text-5xl mb-2">🍳🛡️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Thermal Engineering in the Kitchen</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  Frying pans and pressure cookers combine TWO materials: <br />
                  1. <span className="text-amber-600 font-black">Aluminium/Steel base</span> (Thermal Conductor) to cook food evenly. <br />
                  2. <span className="text-sky-600 font-black">Bakelite Plastic handle</span> (Thermal Insulator) to protect chef hands!
                </p>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Mastered Thermal Insulation! ✓
                </button>
              </div>
            )}

            {/* Step 3: Apply - Cookware Safety Designer */}
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
         MISSION 10: THE PLASTIC PROBLEM (5 Steps)
      ───────────────────────────────────────────────────────────── */
      case 10:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <Layers className="w-24 h-24 text-sky-500 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Plastic Challenge 🌍</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Because plastics never rot, every piece of plastic ever made still exists somewhere on Earth! Let's travel through the Time Tunnel!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Soil Time Tunnel ⏳
                </button>
              </div>
            )}

            {/* Step 1: Time Tunnel Interactive */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-emerald-300 shadow-xl text-center flex flex-col items-center">
                <h3 className="text-xl font-black text-slate-900 mb-3">Underground Time Decay Test</h3>
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
                    <span className="text-4xl block mb-1">🍌</span>
                    <span className="font-black text-sm text-slate-900">Banana Peel</span>
                    <span className="text-xs text-emerald-700 font-bold block mt-1">Biodegradable</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full mt-2 inline-block">
                      Rots in 2 Weeks ✓
                    </span>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 text-center">
                    <span className="text-4xl block mb-1">🫙</span>
                    <span className="font-black text-sm text-slate-900">Plastic Bottle</span>
                    <span className="text-xs text-rose-600 font-bold block mt-1">Non-Biodegradable</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full mt-2 inline-block">
                      Takes 450+ Years! ⚠️
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  I Understand Biodegradability ✓
                </button>
              </div>
            )}

            {/* Step 2: Understand Biodegradable vs Non-Biodegradable */}
            {currentStepIndex === 2 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center">
                <span className="text-5xl mb-2">🦠⚗️</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Microbes Cannot Eat Synthetic Polymers!</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  Bacteria and fungi in soil eat natural organic matter (cotton, wood, fruit peels). But synthetic plastics have synthetic carbon chains that bacteria cannot digest!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Understood Microbe Digestion! ✓
                </button>
              </div>
            )}

            {/* Step 3: Solve - Arjun's Shopping Dilemma without spoilers */}
            {currentStepIndex === 3 && (
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

            {/* Step 4: Apply - Environmental 3 R's Pledge */}
            {currentStepIndex >= 4 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center">
                <span className="text-5xl mb-2">♻️🌱</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">The 3 R's Planet Pledge</h3>
                <div className="grid grid-cols-3 gap-2 w-full my-4 text-xs font-black">
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
                    1. REDUCE <br /> Use metal bottles
                  </div>
                  <div className="p-3 bg-sky-100 text-sky-900 rounded-2xl">
                    2. REUSE <br /> Carry cloth bags
                  </div>
                  <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                    3. RECYCLE <br /> Sort blue bins
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Take the Planet Pledge 🌿
                </button>
              </div>
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 11: STRETCH LAB (4 Steps)
      ───────────────────────────────────────────────────────────── */
      case 11:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <RubberIllustration className="w-24 h-24 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Stretchy Mystery! 🛞</h2>
                <p className="text-slate-600 font-bold mb-6">
                  Natural rubber comes from milky tree sap (latex). Synthetic rubber is formulated with petrochemicals to handle race car speed and blazing friction!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                    handleNextStep();
                  }}
                  className="btn-3d-amber text-slate-950 font-black text-base py-3.5 px-10 rounded-2xl cursor-pointer"
                >
                  Enter Rubber Test Bench 🔬
                </button>
              </div>
            )}

            {/* Step 1: Stretch and Compare */}
            {currentStepIndex === 1 && (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-sky-300 shadow-xl text-center flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                    <span className="text-4xl block mb-1">🌳</span>
                    <h4 className="font-black text-sm text-slate-900">Natural Rubber (Latex)</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1">Soft & stretchy for balloons & erasers</p>
                  </div>

                  <div className="p-5 bg-sky-50 rounded-2xl border-2 border-sky-200">
                    <span className="text-4xl block mb-1">🛞</span>
                    <h4 className="font-black text-sm text-slate-900">Synthetic Buna Rubber</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1">Resists 200°C friction for car tyres!</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Test Friction & Stretch ✓
                </button>
              </div>
            )}

            {/* Step 2: Understand Vulcanization */}
            {currentStepIndex === 2 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center">
                <span className="text-5xl mb-2">⚗️🚗</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">How Rubber is Toughened</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  Raw tree latex melts when hot and turns brittle when cold. Scientists heat rubber with sulphur (Vulcanization) and blend synthetic polymers so vehicle tyres never melt on scorching summer roads!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Mastered Rubber Vulcanization! ✓
                </button>
              </div>
            )}

            {/* Step 3: Practice Rubber Match without spoilers */}
            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Vehicle Tyre Engineering Challenge"
                question="Formula 1 race cars travel at 300 km/h with tyres reaching 120°C. Which rubber formulation must engineers specify?"
                scenarioEmoji="🏎️🛞"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'synthetic-rubber',
                    label: 'Vulcanized Synthetic Buna Rubber',
                    icon: '🛞⚙️',
                    isCorrect: true,
                    explanation: 'Synthetic rubber combined with vulcanized sulphur creates heat-resistant cross-links that withstand immense road friction!',
                    hint: 'Which rubber is chemically engineered to withstand extreme heat and friction?',
                  },
                  {
                    id: 'latex-rubber',
                    label: 'Pure Uncured Tree Latex Sap',
                    icon: '🌳🎈',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Natural uncured tree latex becomes sticky and melts into liquid under high road friction.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 12: THE REPAIR STATION (4 Steps)
      ───────────────────────────────────────────────────────────── */
      case 12:
        return (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Step 0: Hook */}
            {currentStepIndex === 0 && (
              <div className="text-center max-w-2xl">
                <Wrench className="w-24 h-24 text-amber-500 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">The Emergency Repair Station! 🧴</h2>
                <p className="text-slate-600 font-bold mb-6">
                  A high-pressure water pipe cracked! Water is spraying everywhere! Let's choose the right synthetic adhesive to seal it!
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

            {/* Step 1: Repair Interactive without spoilers */}
            {currentStepIndex === 1 && (
              <InquiryQuestionCard
                title="Emergency High-Pressure Pipe Seal"
                question="Water is blasting out of a cracked plumbing pipe at 80 PSI. Which adhesive will stop the pressurized leak?"
                scenarioEmoji="🚿🔧"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'epoxy-sealant',
                    label: 'Synthetic Epoxy Waterproof Sealant',
                    icon: '🧴✨',
                    isCorrect: true,
                    explanation: 'Synthetic epoxy cures into an insoluble cross-linked polymer network that withstands hundreds of pounds of water pressure!',
                    hint: 'Choose the synthetic adhesive designed for waterproof plumbing repairs!',
                  },
                  {
                    id: 'pine-resin',
                    label: 'Natural Pine Tree Sticky Resin',
                    icon: '🌲💧',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Natural tree resin is water-soluble and washes away instantly under high water pressure.',
                  },
                ]}
              />
            )}

            {/* Step 2: Understand How Adhesives Work */}
            {currentStepIndex === 2 && (
              <div className="text-center max-w-2xl bg-white p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center">
                <span className="text-5xl mb-2">🔬🔗</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Molecular Polymer Cross-Linking</h3>
                <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
                  Synthetic super glues contain liquid monomers (Cyanoacrylate). When they touch moisture in the air, they instantly link into millions of unbreakable polymer chains that interlock with microscopic crevices!
                </p>
                <button
                  onClick={() => {
                    sounds.success();
                    setInteractiveState({ [`step_${currentStepIndex}`]: true });
                  }}
                  className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                >
                  Understood Molecular Adhesion! ✓
                </button>
              </div>
            )}

            {/* Step 3: Practice Glue Match without spoilers */}
            {currentStepIndex >= 3 && (
              <InquiryQuestionCard
                title="Adhesive Matcher Challenge"
                question="You are building a wooden birdhouse and assembling paper crafts. Which adhesive is non-toxic and bonds cellulose wood fibres best?"
                scenarioEmoji="🪵🧵"
                isCompleted={interactiveState[`step_${currentStepIndex}`] === true}
                onSuccess={() => setInteractiveState({ [`step_${currentStepIndex}`]: true })}
                options={[
                  {
                    id: 'pva-glue',
                    label: 'PVA White Wood & Paper Glue',
                    icon: '🪵🏷️',
                    isCorrect: true,
                    explanation: 'Polyvinyl acetate (PVA) absorbs into wood grain and cellulose paper to form a permanent, non-toxic craft bond!',
                    hint: 'Which white glue is specially formulated for woodworking and school craft projects?',
                  },
                  {
                    id: 'epoxy-resin',
                    label: 'Heavy Industrial Epoxy Resin',
                    icon: '🔩🧪',
                    isCorrect: false,
                    explanation: '',
                    hint: 'Industrial epoxy is a heavy chemical compound intended for pipes, engine blocks, and metals.',
                  },
                ]}
              />
            )}
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 13: PIP'S SCIENCE CAMP (All 5 Inquiry Challenges Unbiased!)
      ───────────────────────────────────────────────────────────── */
      case 13:
        return (
          <div className="w-full max-w-3xl flex flex-col items-center text-center">
            {/* Step 0: Challenge 1 - Camp Clothing without spoilers */}
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

            {/* Step 1: Challenge 2 - Camp Rope without spoilers */}
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

            {/* Step 2: Challenge 3 - Campfire Safety (FIXED USER ISSUE - NO SPOILERS!) */}
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

            {/* Step 3: Challenge 4 - Camp Kettle without spoilers */}
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

            {/* Step 4: Challenge 5 - Leave No Trace without spoilers */}
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

            {/* Step 5: Grand Graduation Ceremony */}
            {currentStepIndex >= 5 && (
              <div className="flex flex-col items-center">
                <Trophy className="w-28 h-28 text-amber-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Grand Science Champion! 🏕️
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-bold mb-6 max-w-lg mx-auto">
                  You've tested raincoats, stretched super-nylon, explored polymers, mastered electrical insulation, passed fire safety, and cleaned up planet Earth! You are now an official Master of Synthetic Materials!
                </p>
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
