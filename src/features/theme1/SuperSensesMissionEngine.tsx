import { useNavigationProgressStore } from '@/stores/navigationProgressStore';
import { VoxelNatureBiome } from '@/components/voxel/VoxelNatureBiome';
// Real 3-Tier Progressive Zoom Images
import ant1x from '@/assets/images/microscope/ant_scope_1x.jpg';
import ant10x from '@/assets/images/microscope/ant_scope_10x.jpg';
import ant100x from '@/assets/images/microscope/ant_scope_100x.jpg';

import snake1x from '@/assets/images/microscope/snake_scope_1x.jpg';
import snake10x from '@/assets/images/microscope/snake_scope_10x.jpg';
import snake100x from '@/assets/images/microscope/snake_scope_100x.jpg';

import tongue1x from '@/assets/images/microscope/tongue_scope_1x.jpg';
import tongue10x from '@/assets/images/microscope/tongue_scope_10x.jpg';
import tongue100x from '@/assets/images/microscope/tongue_scope_100x.jpg';

import burdock1x from '@/assets/images/microscope/burdock_scope_1x.jpg';
import burdock10x from '@/assets/images/microscope/burdock_scope_10x.jpg';
import burdock100x from '@/assets/images/microscope/burdock_scope_100x.jpg';
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
  SampleAntAntennaSensilla,
  SampleSnakeHollowFang,
  SampleTonguePapillaeTasteBud,
  SampleBurdockVelcroHooks,
} from '@/components/microscope/MicroscopeSampleRenders';
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
  const [zoomLevel, setZoomLevel] = useState<number>(10);
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;
  const quizList = THEME_1_QUIZZES[num] || THEME_1_QUIZZES[1];

  useEffect(() => {
    setCurrentPhase('HOOK');
    setZoomLevel(10);
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
                {num === 1 && <AntTrailPheromoneSim />}
                {num === 2 && <SnakeGroundVibrationSim />}
                {num === 3 && (
                  <div className="w-full flex flex-col gap-6">
                    <TongueTasteAndBeaumontSim />
                    <BreadMoldEnvironmentalTimelapseLab />
                  </div>
                )}
                {num === 4 && <SeedDispersalVelcroSim />}
              </div>
            )}

                                    {/* ════════════════════════════════════════════════════════════════
                PHASE 3: SCIENTIFIC SPECIMEN & MICROSCOPE STUDIO (Clean Light Theme)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'MICROSCOPE' && (() => {
              const sampleImages: Record<number, Record<number, { img: string; title: string; desc: string; fact: string; tag: string }>> = {
                1: {
                  1: {
                    img: ant1x,
                    title: '1x Macro View: Ant Worker on Trail',
                    desc: 'Macroscopic anatomical view of a black ant worker. Notice the large compound eyes, powerful mandibles, and two long jointed antennae continuously scanning the terrain.',
                    fact: 'Ants use their antennae like steering antennae and chemical noses, sweeping them across the ground 10 times a second!',
                    tag: 'Macroscopic Specimen'
                  },
                  10: {
                    img: ant10x,
                    title: '10x Stereo Zoom: Antenna Base & Scape Joint',
                    desc: '10x magnification showing the mobile ball-and-socket scape joint, allowing 360° rotational freedom to locate scent direction.',
                    fact: 'The elbowed joint lets the ant point each antenna independently toward different scent sources to compare pheromone strength.',
                    tag: '10x Stereo Optical'
                  },
                  100: {
                    img: ant100x,
                    title: '100x High-Power: Sensilla Scent Pores (SEM)',
                    desc: 'Scanning Electron Micrograph (SEM) showing individual sensory hairs (sensilla basiconica) covered with microscopic chemical receptor pores.',
                    fact: 'Airborne pheromone molecules enter through these nano-scale pores and bind directly to olfactory receptor neurons inside!',
                    tag: '100x Electron Micrograph (SEM)'
                  },
                },
                2: {
                  1: {
                    img: snake1x,
                    title: '1x Macro View: Spectacled Cobra Jaw on Ground',
                    desc: 'Sample showing the lower jaw resting directly against the sandy ground substrate to detect seismic ground vibrations.',
                    fact: 'Snakes have no external ears or eardrums! They detect the vibrations of footsteps walking hundreds of feet away through the ground.',
                    tag: 'Macroscopic Specimen'
                  },
                  10: {
                    img: snake10x,
                    title: '10x Stereo Zoom: Quadrate Jaw & Keeled Scales',
                    desc: '10x magnification showing keeled keratin scales and the flexible quadrate bone coupling the lower jaw directly to the inner ear columella.',
                    fact: 'Ground vibration waves travel up through the jawbone directly into the inner ear fluid, allowing instantaneous predator warning.',
                    tag: '10x Stereo Optical'
                  },
                  100: {
                    img: snake100x,
                    title: '100x High-Power: Hollow Venom Canal Anatomy',
                    desc: 'Anatomical cross-section showing the internal hypodermic needle venom canal, dentin sheath, and sharp discharge exit aperture.',
                    fact: 'The venom canal works like a doctor’s hollow injection needle! Muscular contractions squeeze venom from the gland right through the canal tip.',
                    tag: '100x Anatomical Cross-Section'
                  },
                },
                3: {
                  1: {
                    img: tongue1x,
                    title: '1x Macro View: Tongue & Papillae Distribution',
                    desc: 'Full anatomical diagram showing the distribution of Circumvallate, Foliate, Fungiform, and Filiform papillae across the human tongue.',
                    fact: 'Your tongue has thousands of tiny bumps called papillae, and each papilla can contain between 1 and 100 taste buds!',
                    tag: 'Macroscopic Specimen'
                  },
                  10: {
                    img: tongue10x,
                    title: '10x Stereo Zoom: Fungiform & Foliate Papilla Cross-Section',
                    desc: 'Enlarged cross-section showing embedded taste buds lining the epithelial side crevices of each papilla bump.',
                    fact: 'Saliva dissolves food chemicals so they can wash into the side grooves where sensitive taste buds are sheltered from damage.',
                    tag: '10x Tissue Histology'
                  },
                  100: {
                    img: tongue100x,
                    title: '100x High-Power: Cellular Taste Bud Cross-Section',
                    desc: 'Cellular anatomy showing microscopic taste hairs (microvilli) protruding through the taste pore to contact dissolved chemicals.',
                    fact: 'Receptor cells trigger sensory nerves that shoot taste signals to your brain in under 150 milliseconds!',
                    tag: '100x Cellular Histology'
                  },
                },
                4: {
                  1: {
                    img: burdock1x,
                    title: '1x Macro View: Burdock Seed Clinging to Fur',
                    desc: 'Macro photograph of a brown burdock seed burr latching firmly into animal fur for plant seed dispersal.',
                    fact: 'In 1941, Swiss engineer George de Mestral examined these burrs sticking to his dog after an Alpine hike, inspiring the invention of Velcro!',
                    tag: 'Macroscopic Specimen'
                  },
                  10: {
                    img: burdock10x,
                    title: '10x Stereo Zoom: Spherical Burr & Curved Hook Array',
                    desc: '10x stereo micrograph showing hundreds of stiff, elastic, curved micro-hooks radiating outward in every direction.',
                    fact: 'Each spine tip curves into an elastic hook that bends smoothly to slip into fur or fabric, then springs back to latch tight!',
                    tag: '10x Stereo Optical'
                  },
                  100: {
                    img: burdock100x,
                    title: '100x High-Power: Burdock Hook Interlocked in Nylon Loop (SEM)',
                    desc: 'Scanning Electron Micrograph (SEM) showing a natural burdock hook locked inside a woven synthetic nylon loop fiber of Velcro.',
                    fact: 'This biomimetic discovery led to the dual-sided fastener: one side covered in rigid hooks, the opposite side with soft nylon loops!',
                    tag: '100x Electron Micrograph (SEM)'
                  },
                },
              };

              const tiers = [
                { label: '1x Macro', val: 1 },
                { label: '10x Stereo', val: 10 },
                { label: '100x High-Power', val: 100 },
              ];

              const currentSample = sampleImages[num]?.[zoomLevel] || sampleImages[num]?.[10] || sampleImages[1][10];

              return (
                <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-emerald-400 shadow-xl flex flex-col items-center select-none font-sans">
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-1">
                        🔬 High-Resolution Scientific Microscope Studio • {currentSample.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {currentSample.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      {tiers.map((tier) => (
                        <button
                          key={tier.val}
                          onClick={() => {
                            sounds.pop();
                            setZoomLevel(tier.val);
                            const t = sampleImages[num]?.[tier.val];
                            if (t) {
                              voiceAssistant.speak(`${t.title}. ${t.desc}`);
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            zoomLevel === tier.val
                              ? 'bg-emerald-500 text-white shadow-md scale-105 font-black'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean Square Image Display Container with Clear Micrograph View */}
                  <div className="w-full max-w-2xl h-[340px] sm:h-[420px] bg-slate-950 border-3 border-slate-200 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center p-2 sm:p-3 my-2 relative">
                    <motion.img
                      key={`${num}-${zoomLevel}`}
                      initial={{ scale: 0.95, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      src={currentSample.img}
                      alt={currentSample.title}
                      className="w-full h-full object-contain select-none"
                    />

                    {/* Magnification Badge */}
                    <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-emerald-300 border border-emerald-500/50 shadow-md">
                      {zoomLevel}x Magnification
                    </div>

                    {/* Audio Listen Button */}
                    <button
                      onClick={() => {
                        sounds.pop();
                        voiceAssistant.speak(`${currentSample.title}. ${currentSample.desc} Fun fact: ${currentSample.fact}`);
                      }}
                      className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                      title="Read Aloud"
                    >
                      <span>🔊 Listen</span>
                    </button>
                  </div>

                  {/* Scientific Description Caption */}
                  <div className="w-full max-w-2xl bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm text-slate-800 font-bold text-center mt-3 shadow-xs">
                    {currentSample.desc}
                  </div>

                  {/* Did You Know Discovery Fact Callout */}
                  <div className="w-full max-w-2xl bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 mt-2.5 flex items-center gap-3 text-left">
                    <span className="text-2xl shrink-0">💡</span>
                    <div>
                      <span className="text-[11px] font-black uppercase text-emerald-800 block">
                        Scientific Secret:
                      </span>
                      <p className="text-xs font-bold text-emerald-950">
                        {currentSample.fact}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

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
