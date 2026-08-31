import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { WATER_CHAPTERS, WaterChapter } from '@/data/themeWaterMissions';
import { InteractiveDiagramEngine } from '@/components/engine/InteractiveDiagramEngine';
import { WaterAnimatedOceanBackground } from '@/components/effects/WaterAnimatedOceanBackground';
import {
  GhadisarStepwellWaterSim,
  DensityBuoyancyDeadSeaSim,
  MosquitoLarvaeEcologySim,
} from '@/components/interactive/ThemeWaterSimulators';
import type { InteractiveDiagramData } from '@/types/lessonEngine';
import {
  ArrowLeft,
  Sparkles,
  Droplets,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Volume2,
  Zap,
  Layers,
  FlaskConical,
  HelpCircle,
  Check,
} from 'lucide-react';

// Specimen imagery for water chapters
import steamBoilingImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import persianWheelImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import plasticDecayImg from '@/assets/images/decay/plastic_100yrs.jpg';

interface ChapterIntroData {
  title: string;
  subtitle: string;
  pipTeaching: string;
  image: string;
  imageCaption: string;
  goldenLaw: string;
  keyConcepts: { icon: string; label: string; desc: string }[];
  inquiryCheck: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

const WATER_CHAPTER_INTROS: Record<number, ChapterIntroData> = {
  1: {
    title: 'The Water Cycle & States of Matter',
    subtitle: 'NCERT Class 5 EVS • Every Drop Counts',
    pipTeaching:
      'Water on Earth never disappears — it continuously transforms! Solar heat evaporates ocean water into invisible vapor, cold high-altitude air condenses it into fluffy clouds, and gravity pulls it back as rain!',
    image: steamBoilingImg,
    imageCaption: 'Macro view: Solar thermal energy converting liquid water into rising vapor',
    goldenLaw: '☀️ Solar Thermal Energy powers the endless recycling of Earth’s 4-billion-year-old water molecules!',
    keyConcepts: [
      { icon: '☀️', label: 'Evaporation', desc: 'Liquid water absorbs heat energy and turns into invisible vapor gas.' },
      { icon: '☁️', label: 'Condensation', desc: 'Warm vapor cools down in high cold skies, clumping into tiny cloud droplets.' },
      { icon: '🌧️', label: 'Precipitation', desc: 'Heavy cloud droplets fall to ground as rain, hail, or snow.' },
    ],
    inquiryCheck: {
      question: 'What provides the primary energy source that drives Earth’s water cycle?',
      options: [
        { text: 'Thermal heat radiation from the Sun ☀️', isCorrect: true },
        { text: 'Underground electric batteries 🔋', isCorrect: false },
      ],
      explanation: 'Solar thermal energy warms oceans and lakes, driving the entire continuous water cycle!',
    },
  },
  2: {
    title: 'Jaisalmer Ghadisar & Ancient Stepwell Engineering',
    subtitle: 'NCERT Class 5 EVS • Every Drop Counts',
    pipTeaching:
      '650 years ago, King Ghadsi of Jaisalmer engineered a masterwork in the dry Thar Desert: 9 interconnected lakes! Rainwater filled Lake 1, overflowed through stone channels into Lake 2, filling all 9 without wasting a single drop!',
    image: persianWheelImg,
    imageCaption: 'Historical hydraulic engineering: Persian wheels & gravity canals for desert water conservation',
    goldenLaw: '🏰 Ancient Stepwells (Bawris) harvest monsoon rain so desert communities have water all year!',
    keyConcepts: [
      { icon: '🏞️', label: '9 Interconnected Lakes', desc: 'Built at descending elevations so overflow water cascades into lower lakes.' },
      { icon: '🏛️', label: 'Bawri Stepwells', desc: 'Deep underground multi-story stone wells that prevent rapid sun evaporation.' },
      { icon: '💧', label: 'Catchment Canals', desc: 'Stone carved aqueducts that channel every monsoon raindrop.' },
    ],
    inquiryCheck: {
      question: 'How did King Ghadsi’s 9-tank system move water between lakes in Rajasthan?',
      options: [
        { text: 'Natural gravity flow through carved stone canals 🌊', isCorrect: true },
        { text: 'Giant electric water pumps ⚡', isCorrect: false },
      ],
      explanation: 'Ancient architects used natural elevation gradients and gravity canals 650 years before electricity!',
    },
  },
  3: {
    title: 'Experiments with Water & Dead Sea Density',
    subtitle: 'NCERT Class 5 EVS • Experiments with Water',
    pipTeaching:
      'Why does a fresh egg sink in pure water, but float when you add table salt? Salt increases water’s density! In the Dead Sea, with 300g of salt per liter, even people float effortlessly on the surface without swimming!',
    image: polyesterRaincoatImg,
    imageCaption: 'Buoyancy & Surface Physics: Heavy objects float when liquid density exceeds object density',
    goldenLaw: '🧂 Liquid Density Law: Objects float when their density is lower than the surrounding liquid!',
    keyConcepts: [
      { icon: '💧', label: 'Fresh Water', desc: 'Density = 1.0 g/cm³. Fresh eggs are denser and sink to the bottom.' },
      { icon: '🧂', label: 'Saltwater Buoyancy', desc: 'Dissolved salt molecules pack water tightly, increasing its upward buoyant force.' },
      { icon: '🌊', label: 'The Dead Sea', desc: 'Contains 300 grams of salt per liter — highest natural buoyancy on Earth!' },
    ],
    inquiryCheck: {
      question: 'Why does an egg float to the top when multiple spoonfuls of salt are stirred into the water?',
      options: [
        { text: 'Dissolved salt increases water density above the egg’s density 🥚', isCorrect: true },
        { text: 'The salt turns the egg into a helium balloon 🎈', isCorrect: false },
      ],
      explanation: 'Adding salt increases the water’s density, creating a strong upward buoyant force that lifts the egg!',
    },
  },
  4: {
    title: 'Water Ecology & Mosquito Prevention Science',
    subtitle: 'NCERT Class 5 EVS • A Treat for Mosquitoes',
    pipTeaching:
      'Female Anopheles mosquitoes lay eggs in still, stagnant water. The larvae breathe air through microscopic breathing tubes (siphons) at the water surface. Pouring a thin film of oil blocks their oxygen supply and stops malaria breeding!',
    image: plasticDecayImg,
    imageCaption: 'Microscopic water ecology: Larvae breathing siphon mechanics and surface barrier physics',
    goldenLaw: '🛡️ Eco-Oil Film Barrier floats on water, cutting off larvae oxygen siphons to prevent mosquito breeding!',
    keyConcepts: [
      { icon: '🦟', label: 'Stagnant Water', desc: 'Puddles and open tanks are breeding grounds for mosquito larvae.' },
      { icon: '🔬', label: 'Breathing Siphon', desc: 'Larvae hang upside down under the surface to take in atmospheric oxygen.' },
      { icon: '🛢️', label: 'Eco-Oil Layer', desc: 'A micro-thin oil film seals the water surface, suffocating larvae safely.' },
    ],
    inquiryCheck: {
      question: 'Why does applying a thin film of oil to stagnant water stop mosquito larvae from developing?',
      options: [
        { text: 'The oil film cuts off their atmospheric oxygen breathing siphon 🛡️', isCorrect: true },
        { text: 'It teaches mosquitoes how to sing 🎵', isCorrect: false },
      ],
      explanation: 'The oil barrier creates an impermeable layer that blocks the larvae’s surface air siphon tubes!',
    },
  },
};

const WATER_CYCLE_DATA: InteractiveDiagramData = {
  id: 'water-cycle-step',
  type: 'interactive_diagram',
  title: "Earth's Water Cycle Simulation",
  pipPrompt: 'Water on Earth travels in an endless circle! Tap each stage in the animated diagram or use the weather controls to see how it works.',
  topic: 'water_cycle',
  diagramTitle: "Earth's Water Cycle Simulation",
  backgroundTheme: 'sky_ocean',
  learningObjective: 'Explore how solar heat evaporates water into vapor, condenses it into clouds, and falls as rain!',
  summaryTakeaway: 'The water cycle has been recycling the exact same water molecules on Earth for over 4 billion years!',
  hotspots: [
    {
      id: 'evap',
      name: 'Evaporation',
      stageNumber: 1,
      icon: '☀️',
      xPercent: 28,
      yPercent: 45,
      title: '1. Evaporation & Solar Heating',
      explanation: 'Heat energy from the Sun warms oceans and lakes, turning liquid water into invisible water vapor gas that rises into the sky!',
      animationType: 'evaporate_steam',
      funFact: 'Over 1,000 cubic kilometers of water evaporate into the sky every single day!',
    },
    {
      id: 'cond',
      name: 'Condensation',
      stageNumber: 2,
      icon: '☁️',
      xPercent: 72,
      yPercent: 24,
      title: '2. Condensation & Cloud Formation',
      explanation: 'As warm water vapor climbs higher into the cold atmosphere, it cools down and clumps into billions of tiny droplets, creating clouds!',
      animationType: 'condense_cloud',
      funFact: 'A single fluffy cumulus cloud can weigh over 500,000 kilograms — as heavy as 100 elephants!',
    },
    {
      id: 'precip',
      name: 'Precipitation',
      stageNumber: 3,
      icon: '🌧️',
      xPercent: 78,
      yPercent: 58,
      title: '3. Precipitation (Rain, Snow & Hail)',
      explanation: 'When water droplets inside clouds get too heavy to float, gravity pulls them down to Earth as rain, snow, sleet, or hail!',
      animationType: 'rain_drops',
      funFact: 'The fastest falling raindrops can reach speeds over 30 kilometers per hour!',
    },
    {
      id: 'coll',
      name: 'Collection',
      stageNumber: 4,
      icon: '🌊',
      xPercent: 40,
      yPercent: 82,
      title: '4. Collection & Groundwater Infiltration',
      explanation: 'Precipitation collects in oceans, rivers, lakes, and seeps underground into freshwater aquifers and wells!',
      animationType: 'flow_water',
      funFact: 'Over 97% of all water on Earth is salty ocean water; only 1% is accessible liquid freshwater!',
    },
  ],
};

export function WaterMissionEngine() {
  const { chapterNum } = useParams<{ chapterNum: string }>();
  const navigate = useNavigate();

  const num = Math.max(1, Math.min(4, parseInt(chapterNum || '1', 10)));
  const chapter: WaterChapter =
    WATER_CHAPTERS.find((c) => c.chapterNumber === num) || WATER_CHAPTERS[0];
  const introData = WATER_CHAPTER_INTROS[num] || WATER_CHAPTER_INTROS[1];

  const [currentPhase, setCurrentPhase] = useState<'INTRO' | 'SIMULATOR'>('INTRO');
  const [selectedInquiryOption, setSelectedInquiryOption] = useState<number | null>(null);
  const [inquiryPassed, setInquiryPassed] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPhase('INTRO');
    setSelectedInquiryOption(null);
    setInquiryPassed(false);
    setIsCompleted(false);
    setShowCelebration(false);
    voiceAssistant.stop();
  }, [num]);

  const handleInquiryAnswer = (optIdx: number, isCorrect: boolean) => {
    setSelectedInquiryOption(optIdx);
    if (isCorrect) {
      sounds.fanfare();
      setInquiryPassed(true);
      voiceAssistant.speak(`Brilliant discovery, Young Scientist! ${introData.inquiryCheck.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Look closely at the scientific concepts above and try again!');
    }
  };

  const handleComplete = () => {
    sounds.fanfare();
    setIsCompleted(true);
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden select-none">
      <WaterAnimatedOceanBackground />
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => {
          setShowCelebration(false);
          if (num < WATER_CHAPTERS.length) {
            navigate(`/theme/water/chapter/${num + 1}`);
          } else {
            navigate('/theme/water/hub');
          }
        }}
      />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 gap-5">
        {/* Top Navbar */}
        <div className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-sky-300 shadow-md">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/theme/water/hub');
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Water Hub</span>
          </button>

          <div className="flex items-center gap-2">
            {currentPhase === 'SIMULATOR' && (
              <button
                onClick={() => {
                  sounds.pop();
                  setCurrentPhase('INTRO');
                }}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Review Intro</span>
              </button>
            )}
            <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black">
              Chapter {chapter.chapterNumber} of {WATER_CHAPTERS.length}
            </span>
          </div>
        </div>

        {/* ── PHASE 1: ACCURATE INTERACTIVE CHAPTER INTRO TAUGHT BY PIP ── */}
        <AnimatePresence mode="wait">
          {currentPhase === 'INTRO' ? (
            <motion.div
              key="chapter-intro-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col gap-5"
            >
              {/* Pip Teaching Header Card with Macro Photography */}
              <div className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-sky-400 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                <Pip mood="explaining" size="lg" />

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-sky-100 text-sky-950 font-black text-xs">
                      {introData.subtitle}
                    </span>
                    <button
                      onClick={() => {
                        sounds.pop();
                        voiceAssistant.speak(`${introData.title}. ${introData.pipTeaching} ${introData.goldenLaw}`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
                      title="Listen to Pip Read Aloud"
                    >
                      <Volume2 className="w-4 h-4 text-sky-600" />
                    </button>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {introData.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
                    {introData.pipTeaching}
                  </p>
                </div>
              </div>

              {/* Real Educational Macro Photography Showcase */}
              <div className="w-full bg-white/95 backdrop-blur-md p-5 rounded-3xl border-3 border-slate-200 shadow-md flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-sky-200 shadow-xs shrink-0 bg-slate-950">
                  <img
                    src={introData.image}
                    alt={introData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider block">
                    Real-World Science Specimen
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {introData.imageCaption}
                  </p>

                  <div className="mt-2.5 p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs font-black text-amber-950 flex items-start gap-2 shadow-2xs">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{introData.goldenLaw}</span>
                  </div>
                </div>
              </div>

              {/* 3 Core Scientific Concepts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {introData.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-3xl bg-white/90 backdrop-blur-md border-2 border-sky-200 shadow-xs flex flex-col items-center text-center"
                  >
                    <span className="text-3xl mb-1">{concept.icon}</span>
                    <span className="text-xs font-black text-slate-900">{concept.label}</span>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
                      {concept.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive Scientific Inquiry Checkpoint before Entering Simulator */}
              <div className="w-full bg-white/95 backdrop-blur-md p-6 rounded-3xl border-3 border-indigo-200 shadow-lg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-full flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Chapter Inquiry Checkpoint</span>
                  </span>

                  {inquiryPassed && (
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Unlocked!
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  {introData.inquiryCheck.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {introData.inquiryCheck.options.map((opt, oIdx) => {
                    const isSelected = selectedInquiryOption === oIdx;
                    return (
                      <motion.button
                        key={oIdx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInquiryAnswer(oIdx, opt.isCorrect)}
                        className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                            : isSelected && !opt.isCorrect
                            ? 'bg-rose-100 border-rose-400 text-rose-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Transition to Simulator Button (Unlocked after Inquiry) */}
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setCurrentPhase('SIMULATOR');
                    }}
                    className={`px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg cursor-pointer transition-all flex items-center gap-2 ${
                      inquiryPassed
                        ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white active:scale-95 animate-pulse'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <span>🚀 Launch Interactive Lab & Simulator ➔</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── PHASE 2: HANDS-ON INTERACTIVE SIMULATORS ── */
            <motion.div
              key="chapter-simulator-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {/* Chapter 1: The Interactive 2D Water Cycle Simulation */}
              {num === 1 && (
                <InteractiveDiagramEngine
                  data={WATER_CYCLE_DATA}
                  onComplete={handleComplete}
                  isCompleted={isCompleted}
                />
              )}

              {/* Chapter 2: Rajasthan Bawris & 9-Tank Interconnection Sim */}
              {num === 2 && (
                <div className="w-full flex flex-col items-center gap-4">
                  <GhadisarStepwellWaterSim onCompleted={handleComplete} />
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    <span>Complete Chapter 2 & Unlock Density Lab ➔</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chapter 3: Dead Sea Salt Density & Buoyancy Sim */}
              {num === 3 && (
                <div className="w-full flex flex-col items-center gap-4">
                  <DensityBuoyancyDeadSeaSim onCompleted={handleComplete} />
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    <span>Complete Chapter 3 & Unlock Ecology Lab ➔</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chapter 4: Mosquito Larvae & Water Ecology Sim */}
              {num === 4 && (
                <div className="w-full flex flex-col items-center gap-4">
                  <MosquitoLarvaeEcologySim onCompleted={handleComplete} />
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    <span>Claim Water Scientist Badge 🏆</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
