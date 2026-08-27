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
import {
  PlasticIllustration,
  WireIllustration,
  KettleIllustration,
  RubberIllustration,
  ParachuteIllustration,
  CottonIllustration,
  PolyesterIllustration,
  NylonIllustration,
  WoolIllustration,
  SilkIllustration,
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

    // Set BGM theme
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

  // Robust step completion - NEVER traps student
  const isStepComplete = () => {
    // If interactive state for this step is marked done, or step is inherently observational
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
  // RENDER DEDICATED EXPERIMENTS FOR EVERY MISSION (4 TO 13)
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
                  {/* Cotton Burn Test */}
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

                  {/* Polyester Melt Test */}
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
         MISSION 6: SUMMER COMFORT (Perspiration & Breathability)
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
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl border-4 border-amber-300 shadow-xl text-center flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <button
                    onClick={() => {
                      sounds.fanfare();
                      setInteractiveState({ [`step_${currentStepIndex}`]: true, pick: 'cotton' });
                    }}
                    className={`p-6 rounded-3xl border-3 flex flex-col items-center cursor-pointer transition-all ${
                      interactiveState.pick === 'cotton'
                        ? 'bg-emerald-100 border-emerald-500 shadow-md ring-4 ring-emerald-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CottonIllustration className="w-16 h-16 mb-2" />
                    <span className="font-black text-base text-slate-900">100% Cotton Shirt</span>
                    <span className="text-xs font-bold text-emerald-700 mt-1">Absorbs Sweat & Breathes ✓</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.boing();
                      voiceAssistant.speak('Synthetic polyester traps body heat and sweat, causing rashes in hot summer!');
                      setInteractiveState({ [`step_${currentStepIndex}`]: false, pick: 'poly' });
                    }}
                    className={`p-6 rounded-3xl border-3 flex flex-col items-center cursor-pointer transition-all ${
                      interactiveState.pick === 'poly'
                        ? 'bg-rose-100 border-rose-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <PolyesterIllustration className="w-16 h-16 mb-2" />
                    <span className="font-black text-base text-slate-900">Polyester Shirt</span>
                    <span className="text-xs font-bold text-rose-600 mt-1">Traps Sweat & Heat ❌</span>
                  </button>
                </div>
                {interactiveState.pick === 'cotton' && (
                  <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl w-full text-emerald-950 font-black text-sm">
                    🎉 Correct! Cotton absorbs perspiration, which evaporates into the air to cool your body!
                  </div>
                )}
              </div>
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
                  Inside charging cables flows powerful electrical current. Assemble a safe wire!
                </p>
              </div>
            )}

            {currentStepIndex >= 1 && (
              <div className="w-full flex flex-col items-center">
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
          </div>
        );

      /* ─────────────────────────────────────────────────────────────
         MISSION 9: SAVE PIP'S HAND! (Kettle Handle)
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
         MISSION 10: THE PLASTIC PROBLEM (3 R's & Microplastics)
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
         MISSION 11: STRETCH LAB (Natural vs Synthetic Rubber)
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
