import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';
import { SHELTER_CHAPTERS, ShelterChapter } from '@/data/themeShelterMissions';
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
} from 'lucide-react';

export function ShelterMissionEngine() {
  const { chapterNum } = useParams<{ chapterNum: string }>();
  const navigate = useNavigate();
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const num = parseInt(chapterNum || '1', 10);
  const chapter: ShelterChapter =
    SHELTER_CHAPTERS.find((c) => c.chapterNumber === num) || SHELTER_CHAPTERS[0];

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [interactiveCompleted, setInteractiveCompleted] = useState<boolean>(false);
  const [speechCompleted, setSpeechCompleted] = useState<boolean>(false);
  const [inquiryChoice, setInquiryChoice] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const totalSteps = 4; // 0: Hook, 1: Sim, 2: Speech Coach, 3: Inquiry

  useEffect(() => {
    setCurrentStep(0);
    setInteractiveCompleted(false);
    setSpeechCompleted(false);
    setInquiryChoice(null);
    setShowCelebration(false);
  }, [num]);

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      sounds.success();
      setCurrentStep((p) => p + 1);
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

  const handlePrevStep = () => {
    if (currentStep > 0) {
      sounds.pop();
      setCurrentStep((p) => p - 1);
    }
  };

  const handleReset = () => {
    sounds.pop();
    setCurrentStep(0);
    setInteractiveCompleted(false);
    setSpeechCompleted(false);
    setInquiryChoice(null);
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return interactiveCompleted || true;
      case 2:
        return speechCompleted;
      case 3:
        return inquiryChoice !== null;
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
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Step Content View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center"
          >
            {/* ════════════════════════════════════════════════════════════════
                STEP 0: THE REAL-WORLD WONDER HOOK
            ════════════════════════════════════════════════════════════════ */}
            {currentStep === 0 && (
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
                  onClick={handleNextStep}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Enter Interactive Lab 🔬</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 1: LIVE EXPERIMENT SIMULATORS
            ════════════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="w-full flex flex-col items-center gap-6">
                {num === 1 && (
                  <ChangthangPashminaSim onCompleted={() => setInteractiveCompleted(true)} />
                )}
                {num === 2 && (
                  <EverestMountaineeringSim onCompleted={() => setInteractiveCompleted(true)} />
                )}
                {num === 3 && (
                  <ZeroGravitySpaceStationSim onCompleted={() => setInteractiveCompleted(true)} />
                )}
                {num === 4 && (
                  <GolcondaFortWaterAndDefenseSim onCompleted={() => setInteractiveCompleted(true)} />
                )}
                {num === 5 && (
                  <PetroleumRefineryAndSolarSim onCompleted={() => setInteractiveCompleted(true)} />
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 2: SPEECH READ-ALOUD KARAOKE COACH
            ════════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center text-center">
                <Pip mood="explaining" size="lg" />
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase mt-3 mb-2">
                  🎙️ AI Speech & Pronunciation Coach
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Read the Scientific Fact Aloud!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-bold mb-6 max-w-md">
                  Speak clearly into your microphone word by word. Each recognized word will glow green!
                </p>

                <div className="w-full max-w-xl">
                  <SpeechReadAloudCoach
                    targetSentence={chapter.sentenceForSpeechCoach}
                    onComplete={() => {
                      sounds.fanfare();
                      setSpeechCompleted(true);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 3: INQUIRY APPLICATION CHALLENGE
            ════════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center text-center">
                <Pip mood="celebrating" size="lg" />
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase mt-3 mb-2">
                  🧠 Real-World Science Challenge
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                  {num === 1 && 'Why is a Pashmina shawl 6 times warmer than a normal sweater?'}
                  {num === 2 && 'Why do mountaineers need bottled oxygen cylinders on Mount Everest?'}
                  {num === 3 && 'Why does water form floating spheres in zero gravity on the space station?'}
                  {num === 4 && 'How did ancient Golconda engineers lift stepwell water to rooftop gardens?'}
                  {num === 5 && 'Why must we switch off vehicle engines at traffic red lights?'}
                </h3>

                <div className="grid grid-cols-1 gap-3 w-full max-w-lg mb-4">
                  {[
                    num === 1
                      ? 'Pashmina goat micro-fibers are ultra-fine (12µm) and trap millions of warm air pockets'
                      : num === 2
                      ? 'At 8,848m altitude, atmospheric air pressure is low and oxygen is only 33% of sea level'
                      : num === 3
                      ? 'Surface tension pulls water molecules into minimum surface area spheres without gravity pull'
                      : num === 4
                      ? 'Gear-driven Persian water wheels (Rahat) with endless bucket chains lifted water 100 feet'
                      : 'Petroleum crude oil takes millions of years to form and will run out if wasted',
                    'Magic supernatural force',
                    'They just guessed random numbers',
                  ].map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === 0) {
                          sounds.success();
                          voiceAssistant.speak('Correct! Brilliant scientific mastery!');
                          setInquiryChoice(idx);
                        } else {
                          sounds.boing();
                          voiceAssistant.speak('Try again! Think back to the experiment!');
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm text-left cursor-pointer transition-all ${
                        inquiryChoice === idx
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-black'
                          : 'bg-slate-50 border-slate-200 hover:bg-indigo-50 text-slate-700'
                      }`}
                    >
                      <span>{ans}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Step Progression Controls */}
        <div className="w-full flex items-center justify-between mt-6 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-indigo-200 shadow-md">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
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
            onClick={handleNextStep}
            disabled={!isStepComplete()}
            className="px-7 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>{currentStep === totalSteps - 1 ? 'Claim Discovery Badge 🏆' : 'Next Step →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
