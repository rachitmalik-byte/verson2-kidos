import { useNavigationProgressStore } from '@/stores/navigationProgressStore';
import { VoxelNatureBiome } from '@/components/voxel/VoxelNatureBiome';
// Real 3-Tier Progressive Zoom Images
import ant1x from '@/assets/images/microscope/ant_1x.jpg';
import ant100x from '@/assets/images/microscope/ant_100x.jpg';
import ant500x from '@/assets/images/microscope/ant_500x.jpg';

import snake1x from '@/assets/images/microscope/snake_1x.jpg';
import snake100x from '@/assets/images/microscope/snake_100x.jpg';
import snake500x from '@/assets/images/microscope/snake_500x.jpg';

import tongue1x from '@/assets/images/microscope/tongue_1x.jpg';
import tongue100x from '@/assets/images/microscope/tongue_100x.jpg';
import tongue500x from '@/assets/images/microscope/tongue_500x.jpg';

import burdock1x from '@/assets/images/microscope/burdock_1x.jpg';
import burdock100x from '@/assets/images/microscope/burdock_100x.jpg';
import burdock500x from '@/assets/images/microscope/burdock_500x.jpg';
import antsSugarImg from '@/assets/images/theme1/ants_trail_sugar.jpg';
import eagleMouseImg from '@/assets/images/theme1/eagle_view_mouse.jpg';
import snakeVibrationImg from '@/assets/images/specimens/snake_jawbone_vibrations.jpg';
import fourSnakesImg from '@/assets/images/specimens/four_venomous_snakes.jpg';
import tonguePapillaeImg from '@/assets/images/specimens/tongue_taste_papillae.jpg';
import drBeaumontImg from '@/assets/images/specimens/dr_beaumont_stomach.jpg';
import dandelionSeedImg from '@/assets/images/specimens/dandelion_seed_dispersal.jpg';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';
import { MultiTierMicroscopeStudio } from '@/components/microscope/MultiTierMicroscopeStudio';
import { InteractiveChapterIntroCard } from '@/components/curriculum/InteractiveChapterIntroCard';
import { SUPER_SENSES_COURSE_CHAPTERS } from '@/data/masterCurriculum';
import { LivingWorldAnimatedForestBackground } from '@/components/effects/LivingWorldAnimatedForestBackground';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';
import { THEME_1_CHAPTERS, Theme1Chapter } from '@/data/theme1Missions';
import {
  SpecimenAntAntennaSensilla,
  SpecimenSnakeHollowFang,
  SpecimenTonguePapillaeTasteBud,
  SpecimenBurdockVelcroHooks,
} from '@/components/microscope/MicroscopeSpecimenRenders';
import {
  AntTrailPheromoneSim,
  EagleZoomVisionSim,
  SnakeGroundVibrationSim,
  TongueTasteAndBeaumontSim,
  SeedDispersalVelcroSim,
} from '@/components/interactive/Theme1Simulators';
import { SnakeInfraredThermalVisionLab } from '@/components/interactive/SuperSensesLabs';
import {
  TongueTasteInteractiveTrayLab,
  BreadMoldEnvironmentalTimelapseLab,
} from '@/components/interactive/FoodDigestionLabs';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ZoomIn,
  Check,
  Trophy,
} from 'lucide-react';

type Phase = 'HOOK' | 'EXPERIMENT' | 'MICROSCOPE' | 'SCIENCE_LAW' | 'SPEECH_COACH' | 'QUIZ_LAB';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const THEME_1_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: 'How do ants find their way back to food in a neat, straight line?',
      options: [
        'They leave behind invisible chemical scents called pheromones',
        'They use Google Maps on tiny phones',
        'They follow bright neon footprints',
      ],
      correctIndex: 0,
      explanation: 'Ants secrete chemical scent trails called pheromones that guide the entire colony!',
    },
    {
      question: 'How much sharper is an eagle’s eyesight compared to a human?',
      options: [
        '4 times sharper (can spot a mouse 2 km away)',
        'Exactly the same as humans',
        'Eagles can only see in black and white',
      ],
      correctIndex: 0,
      explanation: 'Eagles have 4x more foveal cones in their retinas, giving them telescopic zoom vision!',
    },
    {
      question: 'How does a male silkworm moth locate a female moth from kilometers away?',
      options: [
        'Large feathery antennae that detect her airborne scent',
        'By listening to high-pitched songs',
        'By using binoculars',
      ],
      correctIndex: 0,
      explanation: 'Feathery antennae on male silkworm moths can detect even a single scent molecule from miles away!',
    },
  ],
  2: [
    {
      question: 'How do snakes hear footsteps when they have NO external ears?',
      options: [
        'They feel ground compression vibrations through their lower jaw',
        'They read human lips',
        'They hear through their tongue',
      ],
      correctIndex: 0,
      explanation: 'Snakes sense soundwaves as seismic vibrations traveling through the soil into their jawbone!',
    },
    {
      question: 'How many types of poisonous snakes live in India (CBSE Class 5)?',
      options: [
        'Only 4 types (Cobra, Common Krait, Russell’s Viper, Saw-scaled Viper)',
        'All 300 snake species are deadly poisonous',
        'Zero, all Indian snakes are harmless pets',
      ],
      correctIndex: 0,
      explanation: 'Only 4 snakes in India are venomous! Most other snakes are harmless and eat farm pests.',
    },
    {
      question: 'What is medical antivenom serum made from?',
      options: [
        'The venom (poison) of the snake itself!',
        'Boiled tree bark',
        'Crushed plastic pellets',
      ],
      correctIndex: 0,
      explanation: 'Antivenom is manufactured by processing small amounts of purified snake venom in laboratory serums!',
    },
  ],
  3: [
    {
      question: 'Which zone of the human tongue detects Sweet taste first?',
      options: [
        'The front tip of the tongue 🍯',
        'The deep back of the tongue',
        'Underneath the teeth',
      ],
      correctIndex: 0,
      explanation: 'Sweet taste receptors are most densely concentrated on the very front tip of your tongue!',
    },
    {
      question: 'Why does plain roti or bread taste sweet after chewing it for 30 seconds?',
      options: [
        'Saliva amylase enzymes break plain starch into sweet maltose sugar',
        'Sugar magically teleports into your mouth',
        'Your teeth turn into candy',
      ],
      correctIndex: 0,
      explanation: 'Salivary amylase is a digestive enzyme that turns long starch chains into sweet sugar molecules!',
    },
    {
      question: 'What did Dr. William Beaumont discover from his stomach experiment?',
      options: [
        'Food digests much faster inside the warm acidic stomach than in a cold glass beaker',
        'The stomach doesn’t digest food at all',
        'Chewing is completely unnecessary',
      ],
      correctIndex: 0,
      explanation: 'Dr. Beaumont proved that body warmth and acidic gastric juices digest food in half the time of an outside beaker!',
    },
  ],
  4: [
    {
      question: 'How do Dandelion seeds travel long distances across fields?',
      options: [
        'Feathery parachute bristles (pappus) that glide on wind breezes 🌬️',
        'They roll on wheels',
        'They swim like fish',
      ],
      correctIndex: 0,
      explanation: 'Dandelion seeds use feathery umbrellas to float miles on gentle wind currents!',
    },
    {
      question: 'In 1948, Swiss engineer George de Mestral invented Velcro by examining what under a microscope?',
      options: [
        'Tiny microscopic hooks on Burdock seeds stuck to dog fur 🪝',
        'A piece of metal chainmail',
        'A bird’s feather',
      ],
      correctIndex: 0,
      explanation: 'George de Mestral saw how burdock hooks latched onto fabric loops and created Velcro fasteners!',
    },
    {
      question: 'Why can a coconut seed float across whole oceans without drowning?',
      options: [
        'Its thick, fibrous outer husk is filled with trapped air pockets 🥥',
        'It has an engine inside',
        'It is made of solid stone',
      ],
      correctIndex: 0,
      explanation: 'The fibrous husk of a coconut traps air, making it buoyant and waterproof during ocean journeys!',
    },
  ],
};

export function SuperSensesMissionEngine() {
  const { chapterNum } = useParams<{ chapterNum: string }>();
  const navigate = useNavigate();
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const num = Math.max(1, Math.min(4, parseInt(chapterNum || '1', 10)));
  const chapter: Theme1Chapter =
    THEME_1_CHAPTERS.find((c) => c.chapterNumber === num) || THEME_1_CHAPTERS[0];

  const phaseOrder: Phase[] = ['HOOK', 'EXPERIMENT', 'MICROSCOPE', 'SCIENCE_LAW', 'SPEECH_COACH', 'QUIZ_LAB'];
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [zoomLevel, setZoomLevel] = useState<number>(250);
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;
  const quizList = THEME_1_QUIZZES[num] || THEME_1_QUIZZES[1];

  useEffect(() => {
    setCurrentPhase('HOOK');
    setZoomLevel(250);
    setSpeechDone(false);
    setQuizAnswers({});
    setShowCelebration(false);
  }, [num]);

  const handleNextPhase = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      addDiscovery({
        materialId: chapter.discoveryBadge.id,
        discoveredAt: Date.now(),
        properties: chapter.discoveryBadge.properties,
        uses: chapter.discoveryBadge.uses,
        scienceWord: chapter.discoveryBadge.scienceWord,
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

  const handleReset = () => {
    sounds.pop();
    setCurrentPhase('HOOK');
    setSpeechDone(false);
    setQuizAnswers({});
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
      case 'EXPERIMENT':
      case 'MICROSCOPE':
      case 'SCIENCE_LAW':
        return true;
      case 'SPEECH_COACH':
        return speechDone;
      case 'QUIZ_LAB':
        return Object.keys(quizAnswers).length >= quizList.length;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between pt-4 sm:pt-6 pb-20 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden">
      <LivingWorldAnimatedForestBackground />
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => {
          setShowCelebration(false);
          if (num < THEME_1_CHAPTERS.length) {
            navigate(`/theme/1/chapter/${num + 1}`);
          } else {
            navigate('/theme/1/hub');
          }
        }}
      />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Top Navbar */}
        <div className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-emerald-200 shadow-md mb-4">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/theme/1/hub');
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Theme 1 Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black">
              Chapter {chapter.chapterNumber} of {THEME_1_CHAPTERS.length}
            </span>
            <span className="text-xs font-black text-slate-600">
              Phase {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Phase Content View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center"
          >
            {/* ════════════════════════════════════════════════════════════════
                PHASE 1: HOOK (The In-Depth Pip-Taught Chapter Intro)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'HOOK' && (
              <InteractiveChapterIntroCard
                chapterData={SUPER_SENSES_COURSE_CHAPTERS[num - 1] || SUPER_SENSES_COURSE_CHAPTERS[0]}
                onStartLab={handleNextPhase}
                accentBorderColor="border-emerald-400"
              />
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 2: EXPERIMENT (Hands-on Interactive Lab)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'EXPERIMENT' && (
              <div className="w-full flex flex-col items-center gap-6">
                {num === 1 && (
                  <>
                    <AntTrailPheromoneSim />
                    <EagleZoomVisionSim />
                  </>
                )}
                {num === 2 && (
                  <>
                    <SnakeGroundVibrationSim />
                    <SnakeInfraredThermalVisionLab />
                  </>
                )}
                {num === 3 && (
                  <>
                    <TongueTasteInteractiveTrayLab />
                    <TongueTasteAndBeaumontSim />
                    <BreadMoldEnvironmentalTimelapseLab />
                  </>
                )}
                {num === 4 && <SeedDispersalVelcroSim />}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 3: MICROSCOPE (Optical Zoom Studio)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'MICROSCOPE' && (
              <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-2xl flex flex-col items-center text-white text-center">
                <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50 flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-emerald-400" />
                    <span>Biological Microscope Studio ({zoomLevel}x)</span>
                  </span>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-700">
                    {(num === 1
                      ? [{ label: '1x Macro', val: 1 }, { label: '40x Stereo', val: 40 }, { label: '400x Optical', val: 400 }]
                      : num === 2
                      ? [{ label: '1x Macro', val: 1 }, { label: '30x Stereo', val: 30 }, { label: '350x SEM', val: 350 }]
                      : num === 3
                      ? [{ label: '1x Macro', val: 1 }, { label: '100x Optical', val: 100 }, { label: '600x Cell', val: 600 }]
                      : [{ label: '1x Macro', val: 1 }, { label: '50x Stereo', val: 50 }, { label: '1,200x SEM', val: 1200 }]
                    ).map((tier) => (
                      <button
                        key={tier.val}
                        onClick={() => {
                          sounds.pop();
                          setZoomLevel(tier.val);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          zoomLevel === tier.val ? 'bg-emerald-400 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-[10px] border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center my-4 overflow-hidden ring-4 ring-emerald-400/80">
                  {num === 1 && <SpecimenAntAntennaSensilla zoom={zoomLevel} />}
                  {num === 2 && <SpecimenSnakeHollowFang zoom={zoomLevel} />}
                  {num === 3 && <SpecimenTonguePapillaeTasteBud zoom={zoomLevel} />}
                  {num === 4 && <SpecimenBurdockVelcroHooks zoom={zoomLevel} />}

                  <div className="absolute inset-0 pointer-events-none border border-emerald-400/30 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-emerald-400/30 absolute" />
                    <div className="h-full w-[1px] bg-emerald-400/30 absolute" />
                    <div className="w-24 h-24 rounded-full border border-emerald-400/40 absolute" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-lg mt-2">
                  {num === 1 && 'Microscopic view shows thousands of chemical scent receptors on the ant antennae and silkworm feather branches!'}
                  {num === 2 && 'Microscope shows hollow hypodermic needle venom channels inside the cobra fangs!'}
                  {num === 3 && 'Microscope reveals mushroom-shaped fungiform papillae housing hundreds of microscopic taste buds on the tongue!'}
                  {num === 4 && 'Microscope shows hundreds of tiny curved elastic hooks on burdock burrs latching into woven fabric loops!'}
                </p>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 4: SCIENCE_LAW (The 3-Pillar Golden Science Law)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'SCIENCE_LAW' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl">
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-emerald-700 mb-6 bg-emerald-100 px-4 py-1.5 rounded-full w-fit mx-auto">
                  ⚡ The Golden Science Law
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🐾</span>
                    <span className="font-black text-slate-800 text-base">1. SENSORY ORGAN</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">What the animal HAS</p>
                    <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? 'Antennae / 4x Retina' : num === 2 ? 'Jawbone Sensor' : num === 3 ? '4-Zone Taste Buds' : 'Microscopic Seed Hooks'}
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. ADAPTATION</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">How it WORKS</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? 'Chemical Pheromones' : num === 2 ? 'Ground Acoustic Waves' : num === 3 ? 'Amylase Enzyme Breakdown' : 'Mechanical Hook Latch'}
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. REAL-WORLD USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">How HUMANS use it</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? 'Search & Rescue Dogs' : num === 2 ? 'Medical Antivenom' : num === 3 ? 'ORS Hydration Therapy' : 'Velcro Fasteners'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 5: SPEECH_COACH (Real-Time Speech Karaoke Coach)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'SPEECH_COACH' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center text-center">
                <Pip mood="explaining" size="lg" />
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase mt-3 mb-2">
                  🎙️ AI Speech & Pronunciation Coach
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Read the Discovery Fact Aloud!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold mb-6 max-w-md">
                  Speak clearly into your microphone word by word. Each recognized word will turn vibrant green!
                </p>

                <div className="w-full max-w-xl">
                  <SpeechReadAloudCoach
                    sentence={chapter.sentenceForSpeechCoach}
                    onComplete={() => {
                      sounds.fanfare();
                      setSpeechDone(true);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 6: QUIZ_LAB (3-Question Interactive Inquiry Quiz)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'QUIZ_LAB' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-black text-slate-900">
                    Chapter {num} Mastery Quiz ({Object.keys(quizAnswers).length}/{quizList.length})
                  </h3>
                </div>

                <div className="w-full flex flex-col gap-6">
                  {quizList.map((q, qIdx) => {
                    const selected = quizAnswers[qIdx];
                    const isAnswered = selected !== undefined;

                    return (
                      <div key={qIdx} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200">
                        <span className="text-xs font-black uppercase text-emerald-700 mb-1 block">
                          Question {qIdx + 1}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base mb-3">
                          {q.question}
                        </h4>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selected === oIdx;
                            const isCorrect = oIdx === q.correctIndex;

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (isAnswered) return;
                                  if (isCorrect) {
                                    sounds.success();
                                    voiceAssistant.speak(q.explanation);
                                  } else {
                                    sounds.boing();
                                  }
                                  setQuizAnswers((p) => ({ ...p, [qIdx]: oIdx }));
                                }}
                                className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                                  isAnswered && isCorrect
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                                    : isAnswered && isSelected && !isCorrect
                                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                                }`}
                              >
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Step Progression Controls */}
        <div className="w-full flex items-center justify-between mt-6 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-emerald-200 shadow-md">
          <button
            onClick={handlePrevPhase}
            disabled={currentStepIndex === 0}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleNextPhase}
            disabled={!isStepComplete()}
            className="px-7 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Claim Discovery Badge 🏆' : 'Next Step →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
