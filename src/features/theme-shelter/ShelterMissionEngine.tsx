import { useNavigationProgressStore } from '@/stores/navigationProgressStore';
// Real 3-Tier Progressive Zoom Images
import pashmina1x from '@/assets/images/microscope/pashmina_1x.jpg';
import pashmina100x from '@/assets/images/microscope/pashmina_100x.jpg';
import pashmina500x from '@/assets/images/microscope/pashmina_500x.jpg';

import water1x from '@/assets/images/microscope/microgravity_water_1x.jpg';
import water100x from '@/assets/images/microscope/microgravity_water_100x.jpg';
import water500x from '@/assets/images/microscope/microgravity_water_500x.jpg';

import petroleum1x from '@/assets/images/microscope/petroleum_1x.jpg';
import petroleum100x from '@/assets/images/microscope/petroleum_100x.jpg';
import petroleum500x from '@/assets/images/microscope/petroleum_500x.jpg';
import sheepWoolImg from '@/assets/images/specimens/sheep_wool_fleece.jpg';
import pashminaMicroImg from '@/assets/images/theme-shelter/pashmina_microscope_macro.jpg';
import solarEvapImg from '@/assets/images/specimens/solar_evaporation_ocean.jpg';
import deadSeaSaltImg from '@/assets/images/specimens/dead_sea_salt_floating.jpg';
import earthquakeFaultImg from '@/assets/images/specimens/earthquake_fault_seismograph.jpg';
import timberWoodImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import { MultiTierMicroscopeStudio } from '@/components/microscope/MultiTierMicroscopeStudio';
import { InteractiveChapterIntroCard } from '@/components/curriculum/InteractiveChapterIntroCard';
import { SHELTER_COURSE_CHAPTERS } from '@/data/masterCurriculum';
import { ShelterAnimatedMountainBackground } from '@/components/effects/ShelterAnimatedMountainBackground';
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
import { SHELTER_CHAPTERS, ShelterChapter } from '@/data/themeShelterMissions';
import {
  SamplePashminaVsHumanHair,
  SampleAirMoleculeBarometer,
  SampleZeroGravityWaterSphere,
  SampleGolcondaGearMechanics,
  SamplePetroleumPorousSandstone,
} from '@/components/microscope/MicroscopeSampleRenders';
import { KutchBhungaArchitecturalLab } from '@/components/interactive/KutchBhungaArchitecturalLab';
import {
  ChangthangPashminaSim,
  EverestMountaineeringSim,
  GolcondaFortWaterAndDefenseSim,
  PetroleumRefineryAndSolarSim,
} from '@/components/interactive/ThemeShelterSimulators';
import { SunitaInSpaceMultiStationLab } from '@/components/interactive/SpaceHabitatLabs';
import { MechanicalCrossSectionStudio } from '@/components/studios/MechanicalCrossSectionStudio';
import { FortArchitectStudio } from '@/components/studios/FortArchitectStudio';
import { HighAltitudeBarometerStudio } from '@/components/studios/HighAltitudeBarometerStudio';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ZoomIn,
  Trophy,
} from 'lucide-react';

type Phase = 'HOOK' | 'EXPERIMENT' | 'MICROSCOPE' | 'SCIENCE_LAW' | 'SPEECH_COACH' | 'QUIZ_LAB';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SHELTER_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: 'How warm is one genuine Pashmina shawl compared to normal sweaters?',
      options: [
        'As warm as 6 thick sweaters! 🧥',
        'Just like a thin cotton handkerchief',
        'Not warm at all',
      ],
      correctIndex: 0,
      explanation: 'Pashmina goat fleece is 6 times finer than human hair and traps immense body heat!',
    },
    {
      question: 'What material do Changpa nomads use to weave their Rebo mountain tents?',
      options: [
        'Woven Yak hair strips (windproof and warm)',
        'Thin tissue paper',
        'Solid iron sheets',
      ],
      correctIndex: 0,
      explanation: 'Changpa people weave yak hair into strong strips stitched together into Rebo tents that withstand -40°C winds!',
    },
    {
      question: 'How long does it take a skilled Kashmiri craftsman to hand-weave 1 plain Pashmina shawl?',
      options: [
        'About 250 hours on a handloom',
        '5 seconds on a machine',
        '10 years',
      ],
      correctIndex: 0,
      explanation: 'Because Pashmina fibers are so ultra-fine (12 microns), they cannot be woven by machines; each shawl takes ~250 hours of handloom work!',
    },
  ],
  2: [
    {
      question: 'Who was the first Indian woman to reach the 8,848m summit of Mount Everest (1984)?',
      options: [
        'Bachendri Pal 🇮🇳',
        'Kalpana Chawla',
        'Sunita Williams',
      ],
      correctIndex: 0,
      explanation: 'Bachendri Pal reached the Everest summit on May 23, 1984, after training at the Nehru Institute of Mountaineering!',
    },
    {
      question: 'Why do mountaineers need bottled oxygen tanks past 8,000 meters altitude?',
      options: [
        'Atmospheric air pressure drops and oxygen is only 33% of sea level',
        'To blow bubbles in the snow',
        'Air has zero gravity',
      ],
      correctIndex: 0,
      explanation: 'At high altitudes, air is thin and atmospheric pressure is extremely low, requiring supplemental oxygen!',
    },
    {
      question: 'What special steel-spiked gear is strapped under boots to walk on steep glacier ice?',
      options: [
        'Steel Crampons 🧗',
        'Roller skates',
        'Rubber flip-flops',
      ],
      correctIndex: 0,
      explanation: 'Crampons have sharp steel spikes that dig into hard glacier ice to prevent slipping down crevasses!',
    },
  ],
  3: [
    {
      question: 'How does water behave in zero gravity aboard the International Space Station?',
      options: [
        'It forms floating round spheres due to surface tension 💧',
        'It pours into a cup normally',
        'It instantly turns into solid ice',
      ],
      correctIndex: 0,
      explanation: 'Without gravity pulling water down, surface tension pulls water into floating spherical bubbles!',
    },
    {
      question: 'How do astronauts sleep in space so they don’t drift into walls and computers?',
      options: [
        'They strap themselves into sleeping bags tied to the wall 🛌',
        'They sleep on regular fluffy mattresses',
        'They don’t sleep for 6 months',
      ],
      correctIndex: 0,
      explanation: 'Astronauts use sleeping bags secured to module walls with tether straps so they stay in place!',
    },
    {
      question: 'What did astronaut Sunita Williams observe when looking at Earth from orbit?',
      options: [
        'No country borders are visible; Earth is one shared, glowing blue planet 🌍',
        'Bright red boundary lines between countries',
        'Earth is flat like a plate',
      ],
      correctIndex: 0,
      explanation: 'From space, political borders do not exist; we see our shared blue oceans, green land, and white cloud atmosphere!',
    },
  ],
  4: [
    {
      question: 'What were the curved, protruding stone bastions (burj) of Golconda Fort used for?',
      options: [
        'To give soldiers a 360° panoramic viewing angle to defend the fort 🏰',
        'As giant water swimming pools',
        'As decorative garden planters',
      ],
      correctIndex: 0,
      explanation: 'Curved bastions (burj) allowed guards to see in all directions and fire cannons safely from behind stone slits!',
    },
    {
      question: 'How did the ancient Persian water wheel (Rahat) lift water from deep stepwells (baolis)?',
      options: [
        'A gear wheel with an endless chain of water buckets turned by bullocks 💧',
        'Electric submersible pumps',
        'Carrying one cup at a time by hand',
      ],
      correctIndex: 0,
      explanation: 'The Persian wheel (Rahat) used mechanical wooden/iron gears and bucket chains to lift water 100 feet upwards!',
    },
    {
      question: 'What acoustic mystery exists at the Fateh Darwaza entrance of Golconda Fort?',
      options: [
        'Whispering or clapping at the gate echoes and is heard 1 km away at the top palace',
        'Sound gets absorbed and disappears instantly',
        'It plays recorded radio music',
      ],
      correctIndex: 0,
      explanation: 'Parabolic architectural arches carried acoustic sounds 1 kilometer uphill to warn the King of approaching enemies!',
    },
  ],
  5: [
    {
      question: 'How did crude oil (petroleum) form deep underground?',
      options: [
        'Millions of years of intense heat & pressure on ancient sea organisms 🛢️',
        'Made overnight in plastic factories',
        'Dug up from ordinary topsoil',
      ],
      correctIndex: 0,
      explanation: 'Petroleum formed over hundreds of millions of years from decomposed microscopic marine organisms buried under sediment!',
    },
    {
      question: 'What is the black, sticky residue left at the bottom of the oil refinery tower used for?',
      options: [
        'Bitumen / Asphalt for paving smooth tar roads 🛣️',
        'Drinking water syrup',
        'Making glass windows',
      ],
      correctIndex: 0,
      explanation: 'Bitumen (asphalt) is the heavy boiling fraction of crude oil used worldwide for tarring roads and waterproofing roofs!',
    },
    {
      question: 'Why should drivers switch off car engines at red traffic lights?',
      options: [
        'To save non-renewable petroleum and reduce air pollution 🛑',
        'Because cars don’t like the color red',
        'To make the traffic light change faster',
      ],
      correctIndex: 0,
      explanation: 'Switching off idling engines saves precious petroleum and stops toxic exhaust smoke from polluting city air!',
    },
  ],
};

export function ShelterMissionEngine() {
  const { chapterNum } = useParams<{ chapterNum: string }>();
  const navigate = useNavigate();
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const num = Math.max(1, Math.min(5, parseInt(chapterNum || '1', 10)));
  const chapter: ShelterChapter =
    SHELTER_CHAPTERS.find((c) => c.chapterNumber === num) || SHELTER_CHAPTERS[0];

  const phaseOrder: Phase[] = ['HOOK', 'EXPERIMENT', 'MICROSCOPE', 'SCIENCE_LAW', 'SPEECH_COACH', 'QUIZ_LAB'];
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [zoomLevel, setZoomLevel] = useState<number>(250);
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;
  const quizList = SHELTER_QUIZZES[num] || SHELTER_QUIZZES[1];

  const setExperimentProgress = useNavigationProgressStore((state) => state.setExperimentProgress);
  const setExerciseProgress = useNavigationProgressStore((state) => state.setExerciseProgress);

  useEffect(() => {
    const stepIdx = currentStepIndex + 1;
    const stepsDone = currentStepIndex;
    const stepsLeft = totalSteps - stepIdx;

    if (currentPhase === 'QUIZ_LAB') {
      const answeredCount = Object.keys(quizAnswers).length;
      setExerciseProgress({
        exerciseName: `${chapter.title} Quiz Lab`,
        currentIndex: Math.min(quizList.length, answeredCount + 1),
        totalCount: quizList.length,
        completedCount: answeredCount,
      });
    } else {
      setExerciseProgress(null);
      setExperimentProgress({
        phaseName: currentPhase,
        stepIndex: stepIdx,
        totalSteps: totalSteps,
        stepsDone: stepsDone,
        stepsLeft: stepsLeft,
      });
    }

    return () => {
      setExperimentProgress(null);
      setExerciseProgress(null);
    };
  }, [currentPhase, currentStepIndex, totalSteps, quizAnswers, chapter.title, quizList.length]);


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
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between pt-4 sm:pt-6 pb-20 px-3 sm:px-6 md:px-8 font-sans relative">
      <ShelterAnimatedMountainBackground />
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => {
          setShowCelebration(false);
          if (num < SHELTER_CHAPTERS.length) {
            navigate(`/theme/shelter/chapter/${num + 1}`);
          } else {
            navigate('/theme/shelter/hub');
          }
        }}
      />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Top Navbar with Instant Phase Jumper & Skip Intro */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-indigo-200 shadow-md mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/theme/shelter/hub');
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Theme Hub</span>
            </button>

            <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black hidden sm:inline-block">
              Chapter {chapter.chapterNumber}: {chapter.title}
            </span>
          </div>

          {/* Interactive Phase Navigation Pills (Jump to any phase directly!) */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {phaseOrder.map((phase, idx) => {
              const phaseLabels: Record<string, string> = {
                HOOK: '1. Intro 📖',
                EXPERIMENT: '2. Live Lab 🔬',
                MICROSCOPE: '3. Scope 🔍',
                SCIENCE_LAW: '4. Principle 💡',
                SPEECH_COACH: '5. Coach 🗣️',
                QUIZ_LAB: '6. Quiz 🎯',
              };
              const isCurrent = currentPhase === phase;
              return (
                <button
                  key={phase}
                  onClick={() => {
                    sounds.pop();
                    setCurrentPhase(phase);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  title={`Jump to ${phaseLabels[phase] || phase}`}
                >
                  {phaseLabels[phase] || phase}
                </button>
              );
            })}
          </div>

          {/* Direct "Skip Intro" Quick Action */}
          {currentPhase === 'HOOK' && (
            <button
              onClick={() => {
                sounds.fanfare();
                voiceAssistant.stop();
                setCurrentPhase('EXPERIMENT');
              }}
              className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all border border-amber-500"
              title="Skip introduction and jump straight into the interactive lab"
            >
              <span>⚡ Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
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
                PHASE 1: HOOK (The Real-World Wonder Hook)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'HOOK' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center text-center">
                <Pip mood="thinking" size="xl" />
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase mt-3">
                  {chapter.cbseChapterRef}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {chapter.title} {chapter.icon}
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl leading-relaxed mb-6">
                  {chapter.realWorldWonder}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleNextPhase}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Enter Live Experiment Lab 🔬</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      sounds.fanfare();
                      voiceAssistant.stop();
                      setCurrentPhase('EXPERIMENT');
                    }}
                    className="px-6 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 border-2 border-amber-500"
                  >
                    <span>⚡ Skip Intro & Start Lab</span>
                  </button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 2: EXPERIMENT (Hands-on Interactive Lab)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'EXPERIMENT' && (
              <div className="w-full flex flex-col items-center gap-6">
                {num === 1 && <ChangthangPashminaSim />}
                {num === 2 && <EverestMountaineeringSim />}
                {num === 3 && <SunitaInSpaceMultiStationLab />}
                {num === 4 && <GolcondaFortWaterAndDefenseSim />}
                {num === 5 && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <KutchBhungaArchitecturalLab />
                    <div className="w-full pt-4 border-t-2 border-slate-200">
                      <PetroleumRefineryAndSolarSim />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 3: PROGRESSIVE 3-TIER MICROSCOPE STUDIO (1x -> 100x -> 500x)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'MICROSCOPE' && (
              <div className="w-full flex flex-col items-center gap-6">
                {/* Chapter 1: Pashmina Cashmere vs Human Hair */}
                {num === 1 && (
                  <MultiTierMicroscopeStudio
                    config={{
                      sampleId: 'pashmina-fiber',
                      sampleName: 'Changthang Pashmina Underfleece',
                      themeColor: 'bg-indigo-600',
                      borderColor: 'border-indigo-400',
                      tiers: {
                        '1x': {
                          zoomLevel: '1x',
                          zoomMultiplier: 1,
                          label: '1x Macro: Changthang Mountain Goat in Ladakh',
                          tagline: 'NATURAL -40°C HABITAT',
                          imageSrc: pashmina1x,
                          observation: 'In the freezing high-altitude winds of Ladakh (-40°C), Changpa mountain goats grow an ultra-fine soft underwool beneath their thick outer coat.',
                          keyDiscovery: 'Natural biological adaptation: Ultra-fine underwool grows exclusively during severe winter freeze!',
                        },
                        '100x': {
          instrumentType: 'Compound Light',
          scaleBar: '50 µm',
                          zoomLevel: '200x Optical',
                          zoomMultiplier: 100,
                          label: '100x Optical: Pashmina (12µm) vs Human Hair (75µm)',
                          tagline: 'OPTICAL FIBER COMPARISON',
                          imageSrc: pashmina100x,
                          observation: 'At 100x optical magnification, Pashmina cashmere fiber measures only 12 to 15 microns in diameter — over 6 times thinner than a human hair (75 microns)!',
                          keyDiscovery: '12µm thickness allows 6 Pashmina fibers to match the width of a single human hair!',
                        },
                        '500x': {
          instrumentType: 'Scanning Electron (SEM)',
          scaleBar: '5 µm',
                          zoomLevel: '1,500x FE-SEM',
                          zoomMultiplier: 500,
                          label: '500x Ultra-Micro: Insulating Air-Pocket Cuticle Scales',
                          tagline: 'SEM ELECTRON MICROGRAPH',
                          imageSrc: pashmina500x,
                          observation: 'At 500x magnification, microscopic crimped cuticle scales create millions of tiny dead-air pockets that block radiant body heat loss.',
                          keyDiscovery: 'Trapped microscopic air pockets provide the warmest natural weight-to-heat ratio on Earth.',
                        },
                      },
                    }}
                  />
                )}

                {/* Chapter 2: High Altitude Mountain Barometer Scale */}
                {num === 2 && <HighAltitudeBarometerStudio />}

                {/* Chapter 3: Sunita Williams Microgravity Water Sphere */}
                {num === 3 && (
                  <MultiTierMicroscopeStudio
                    config={{
                      sampleId: 'microgravity-water',
                      sampleName: 'Zero-G Water Sphere & Surface Cohesion',
                      themeColor: 'bg-sky-600',
                      borderColor: 'border-sky-400',
                      tiers: {
                        '1x': {
                          zoomLevel: '1x',
                          zoomMultiplier: 1,
                          label: '1x Macro: Free-Floating Water Blob in Space Station',
                          tagline: '400km ORBITAL FREEFALL',
                          imageSrc: water1x,
                          observation: 'Inside the International Space Station in continuous freefall, gravity cannot pull water down into cups. Astronauts drink water floating as hovering liquid bubbles!',
                          keyDiscovery: 'In microgravity, surface tension becomes the dominant physical force shaping liquid water.',
                        },
                        '100x': {
          instrumentType: 'Compound Light',
          scaleBar: '50 µm',
                          zoomLevel: '200x Optical',
                          zoomMultiplier: 100,
                          label: '100x Optical: Spherical Surface Tension Meniscus',
                          tagline: 'MINIMUM SURFACE MENISCUS',
                          imageSrc: water100x,
                          observation: 'At 100x optical magnification, the outer boundary of the water bubble forms a seamless curved elastic skin pulling inward in all directions with equal force.',
                          keyDiscovery: 'Geometric physics: A sphere is the exact mathematical shape that has the minimum surface area for any volume!',
                        },
                        '500x': {
          instrumentType: 'Scanning Electron (SEM)',
          scaleBar: '5 µm',
                          zoomLevel: '1,500x FE-SEM',
                          zoomMultiplier: 500,
                          label: '500x Ultra-Micro: Cohesive Hydrogen Bond Lattice (H₂O)',
                          tagline: 'MOLECULAR COHESION LATTICE',
                          imageSrc: water500x,
                          observation: 'At 500x magnification, trillions of polar water molecules (H₂O) form powerful cohesive hydrogen bonds, pulling the entire liquid mass inward into a tight droplet.',
                          keyDiscovery: 'Hydrogen bonds between oxygen and hydrogen atoms pull all molecules toward the center of mass.',
                        },
                      },
                    }}
                  />
                )}

                {/* Chapter 4: Golconda Fort Stepwells & Bastions */}
                {num === 4 && (
                  <div className="w-full flex flex-col items-center gap-6">
                    <MechanicalCrossSectionStudio />
                    <FortArchitectStudio />
                  </div>
                )}

                {/* Chapter 5: Petroleum Porous Sandstone Geology Studio */}
                {num === 5 && (
                  <MultiTierMicroscopeStudio
                    config={{
                      sampleId: 'petroleum-sandstone',
                      sampleName: 'Porous Sandstone Hydrocarbon Trap',
                      themeColor: 'bg-amber-600',
                      borderColor: 'border-amber-400',
                      tiers: {
                        '1x': {
                          zoomLevel: '1x',
                          zoomMultiplier: 1,
                          label: '1x Macro: Underground Sedimentary Cap Rock',
                          tagline: 'DEEP CRUSTAL STRATA',
                          imageSrc: petroleum1x,
                          observation: 'Petroleum does not sit in open underground lakes; it is trapped inside microscopic sponge-like pores of ancient sandstone sealed by dense shale cap rock.',
                          keyDiscovery: 'Sedimentary geology: Impermeable cap rocks prevent buoyant crude oil and gas from escaping to the surface.',
                        },
                        '100x': {
          instrumentType: 'Compound Light',
          scaleBar: '50 µm',
                          zoomLevel: '200x Optical',
                          zoomMultiplier: 100,
                          label: '100x Optical: Quartz Sand Grains & Interlocking Pores',
                          tagline: 'POROUS SANDSTONE MATRIX',
                          imageSrc: petroleum100x,
                          observation: 'At 100x magnification, individual rounded quartz sand grains form an interconnected labyrinth of microscopic void channels where ancient hydrocarbons seep and pool.',
                          keyDiscovery: 'Porosity & Permeability allow fluids to flow through microscopic rock pathways toward oil wells.',
                        },
                        '500x': {
          instrumentType: 'Scanning Electron (SEM)',
          scaleBar: '5 µm',
                          zoomLevel: '1,500x FE-SEM',
                          zoomMultiplier: 500,
                          label: '500x Ultra-Micro: Trapped Viscous Hydrocarbon Droplets',
                          tagline: 'HYDROCARBON PORE FLUID',
                          imageSrc: petroleum500x,
                          observation: 'At 500x magnification, black viscous hydrocarbon molecules cling to quartz mineral surfaces under intense geological heat and pressure (3,000 meters deep).',
                          keyDiscovery: 'Petroleum formed over 300 million years from ancient prehistoric ocean phytoplankton and algae!',
                        },
                      },
                    }}
                  />
                )}
              </div>
            )}
            {/* ════════════════════════════════════════════════════════════════
                PHASE 4: SCIENCE_LAW (The 3-Pillar Golden Science Law)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'SCIENCE_LAW' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl">
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-indigo-700 mb-6 bg-indigo-100 px-4 py-1.5 rounded-full w-fit mx-auto">
                  ⚡ The Golden Science Law
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🏔️</span>
                    <span className="font-black text-slate-800 text-base">1. HABITAT / RESOURCE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">Where it COMES FROM</p>
                    <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? '5,000m Ladakh Plateau' : num === 2 ? '8,848m Everest Peak' : num === 3 ? '400km Space Orbit' : num === 4 ? 'Golconda Stepwell' : 'Underground Marine Fossils'}
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-sky-50 border-3 border-sky-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">⚡</span>
                    <span className="font-black text-slate-800 text-base">2. SCIENTIFIC PRINCIPLE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">How it FUNCTIONS</p>
                    <span className="text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? 'Micro-Air Heat Trapping' : num === 2 ? 'Atmospheric Barometric Drop' : num === 3 ? 'Surface Tension in Freefall' : num === 4 ? 'Mechanical Gear Advantage' : 'Fractional Boiling Points'}
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-emerald-50 border-3 border-emerald-300 text-center flex flex-col items-center shadow-md">
                    <span className="text-4xl mb-2">🎯</span>
                    <span className="font-black text-slate-800 text-base">3. REAL-WORLD USE</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">How HUMANS benefit</p>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full mt-2">
                      {num === 1 ? 'Pashmina Thermal Shawls' : num === 2 ? 'High-Altitude Oxygen Systems' : num === 3 ? 'Space Station Living' : num === 4 ? 'Gravity-Fed Water Systems' : 'Clean Solar Transition'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 5: SPEECH_COACH (Real-Time Speech Karaoke Coach)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'SPEECH_COACH' && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center text-center">
                <Pip mood="explaining" size="lg" />
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase mt-3 mb-2">
                  🎙️ AI Speech & Pronunciation Coach
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Read the Discovery Fact Aloud!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold mb-6 max-w-md">
                  Speak clearly into your microphone word by word. Spoken words will glow vibrant green!
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
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center">
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
                        <span className="text-xs font-black uppercase text-indigo-700 mb-1 block">
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
                                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
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
        <div className="w-full flex items-center justify-between mt-6 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-indigo-200 shadow-md">
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
            className="px-7 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Claim Discovery Badge 🏆' : 'Next Step →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
