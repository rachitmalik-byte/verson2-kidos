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
  SpecimenPashminaVsHumanHair,
  SpecimenAirMoleculeBarometer,
  SpecimenZeroGravityWaterSphere,
  SpecimenGolcondaGearMechanics,
  SpecimenPetroleumPorousSandstone,
} from '@/components/microscope/MicroscopeSpecimenRenders';
import {
  ChangthangPashminaSim,
  EverestMountaineeringSim,
  ZeroGravitySpaceStationSim,
  GolcondaFortWaterAndDefenseSim,
  PetroleumRefineryAndSolarSim,
} from '@/components/interactive/ThemeShelterSimulators';
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
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-100 via-sky-50 to-amber-50 flex flex-col justify-between pt-4 sm:pt-6 pb-20 px-3 sm:px-6 md:px-8 font-sans relative">
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

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Navbar */}
        <div className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-indigo-200 shadow-md mb-4">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/theme/shelter/hub');
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Theme Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black">
              Chapter {chapter.chapterNumber} of {SHELTER_CHAPTERS.length}
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

                <button
                  onClick={handleNextPhase}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Enter Live Experiment Lab 🔬</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 2: EXPERIMENT (Hands-on Interactive Lab)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'EXPERIMENT' && (
              <div className="w-full flex flex-col items-center gap-6">
                {num === 1 && <ChangthangPashminaSim />}
                {num === 2 && <EverestMountaineeringSim />}
                {num === 3 && <ZeroGravitySpaceStationSim />}
                {num === 4 && <GolcondaFortWaterAndDefenseSim />}
                {num === 5 && <PetroleumRefineryAndSolarSim />}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                PHASE 3: MICROSCOPE (Optical Zoom Studio)
            ════════════════════════════════════════════════════════════════ */}
            {currentPhase === 'MICROSCOPE' && (
              <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-2xl flex flex-col items-center text-white text-center">
                <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/50 flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-indigo-400" />
                    <span>Microscopic Structural Studio ({zoomLevel}x)</span>
                  </span>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-700">
                    {[100, 250, 500].map((z) => (
                      <button
                        key={z}
                        onClick={() => {
                          sounds.pop();
                          setZoomLevel(z);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          zoomLevel === z ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {z}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative w-64 h-64 rounded-full border-8 border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center my-4 overflow-hidden ring-4 ring-indigo-400/70">
                  {num === 1 && <SpecimenPashminaVsHumanHair zoom={zoomLevel} />}
                  {num === 2 && <SpecimenAirMoleculeBarometer zoom={zoomLevel} />}
                  {num === 3 && <SpecimenZeroGravityWaterSphere zoom={zoomLevel} />}
                  {num === 4 && <SpecimenGolcondaGearMechanics zoom={zoomLevel} />}
                  {num === 5 && <SpecimenPetroleumPorousSandstone zoom={zoomLevel} />}

                  <div className="absolute inset-0 pointer-events-none border border-indigo-400/30 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-indigo-400/30 absolute" />
                    <div className="h-full w-[1px] bg-indigo-400/30 absolute" />
                    <div className="w-24 h-24 rounded-full border border-indigo-400/40 absolute" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-lg mt-2">
                  {num === 1 && '500x Microscope reveals Pashmina fiber is only 12 microns wide (6x thinner than human hair), trapping millions of insulating warm air pockets!'}
                  {num === 2 && 'Microscope shows high-altitude air molecular density drops sharply from sea level to 8,848m summit!'}
                  {num === 3 && 'Microscope reveals water molecules clustering tightly into minimum surface area spheres under microgravity surface tension!'}
                  {num === 4 && 'Cross-section shows interlocking wooden gear teeth and pulley chains lifting stepwell water buckets smoothly!'}
                  {num === 5 && 'Microscopic view of ancient fossilized marine plankton hydrocarbons converted into petroleum under geological pressure!'}
                </p>
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
