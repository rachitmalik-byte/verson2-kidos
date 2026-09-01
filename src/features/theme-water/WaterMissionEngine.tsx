import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { WATER_CHAPTERS, WaterChapter } from '@/data/themeWaterMissions';
import { WATER_COURSE_CHAPTERS } from '@/data/masterCurriculum';
import { InteractiveChapterIntroCard } from '@/components/curriculum/InteractiveChapterIntroCard';
import { InteractiveDiagramEngine } from '@/components/engine/InteractiveDiagramEngine';
import { VoxelWaterCycleDiorama } from '@/components/voxel/VoxelWaterCycleDiorama';
import { WaterAnimatedOceanBackground } from '@/components/effects/WaterAnimatedOceanBackground';
import {
  GhadisarStepwellWaterSim,
  DensityBuoyancyDeadSeaSim,
  MosquitoLarvaeEcologySim,
} from '@/components/interactive/ThemeWaterSimulators';
import type { InteractiveDiagramData } from '@/types/lessonEngine';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

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
  const masterChapter = WATER_COURSE_CHAPTERS[num - 1] || WATER_COURSE_CHAPTERS[0];

  const [currentPhase, setCurrentPhase] = useState<'INTRO' | 'SIMULATOR'>('INTRO');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPhase('INTRO');
    setIsCompleted(false);
    setShowCelebration(false);
    voiceAssistant.stop();
  }, [num]);

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

        {/* Phase View Switcher */}
        <AnimatePresence mode="wait">
          {currentPhase === 'INTRO' ? (
            <motion.div
              key="water-intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              <InteractiveChapterIntroCard
                chapterData={masterChapter}
                onStartLab={() => setCurrentPhase('SIMULATOR')}
                accentBorderColor="border-sky-400"
              />
            </motion.div>
          ) : (
            <motion.div
              key="water-sim"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {/* Chapter 1: 3D Voxel Diorama + 2D Interactive Water Cycle Simulation */}
              {num === 1 && (
                <div className="w-full flex flex-col items-center gap-6">
                  {/* 3D Voxel Island Diorama */}
                  <VoxelWaterCycleDiorama onComplete={handleComplete} />

                  {/* 2D Step-by-Step Diagram Engine */}
                  <div className="w-full">
                    <InteractiveDiagramEngine
                      data={WATER_CYCLE_DATA}
                      onComplete={handleComplete}
                      isCompleted={isCompleted}
                    />
                  </div>
                </div>
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
