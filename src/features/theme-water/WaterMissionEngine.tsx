import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { WATER_CHAPTERS, WaterChapter } from '@/data/themeWaterMissions';
import { InteractiveDiagramEngine } from '@/components/engine/InteractiveDiagramEngine';
import type { InteractiveDiagramData } from '@/types/lessonEngine';
import { ArrowLeft, Sparkles, Droplets, CheckCircle2, RotateCcw } from 'lucide-react';

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
      id: 'collect',
      name: 'Collection & Runoff',
      stageNumber: 4,
      icon: '🌊',
      xPercent: 42,
      yPercent: 86,
      title: '4. Collection & Reservoir Storage',
      explanation: 'Rainwater flows down mountains into rivers, streams, and oceans. The cycle is complete and ready to begin all over again!',
      animationType: 'flow_water',
      funFact: "97% of Earth's water is stored in oceans, while only 1% is accessible fresh drinking water!",
    },
  ],
};

export function WaterMissionEngine() {
  const { chapterNum } = useParams<{ chapterNum: string }>();
  const navigate = useNavigate();
  const num = parseInt(chapterNum || '1', 10);
  const chapter: WaterChapter = WATER_CHAPTERS.find((c) => c.chapterNumber === num) || WATER_CHAPTERS[0];

  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    sounds.pop();
    voiceAssistant.stop();
    setIsCompleted(false);
  }, [num]);

  const handleComplete = () => {
    sounds.fanfare();
    setIsCompleted(true);
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 via-blue-50 to-indigo-100 flex flex-col pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden">
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
            <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black">
              Chapter {chapter.chapterNumber} of {WATER_CHAPTERS.length}
            </span>
          </div>
        </div>

        {/* Chapter 1: The Interactive 2D Water Cycle Simulation */}
        {num === 1 && (
          <InteractiveDiagramEngine
            data={WATER_CYCLE_DATA}
            onComplete={handleComplete}
            isCompleted={isCompleted}
          />
        )}

        {/* Chapter 2, 3, 4: Rich Interactive Water Labs */}
        {num > 1 && (
          <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-sky-400 shadow-xl flex flex-col items-center text-center">
            <Pip mood="explaining" size="xl" />
            <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full text-xs font-black uppercase mt-3">
              {chapter.cbseChapterRef}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {chapter.title} {chapter.icon}
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl leading-relaxed mb-6">
              {chapter.subtitle}
            </p>

            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 text-xs font-bold text-sky-900 mb-6 w-full max-w-md">
              💡 <strong>Key Concepts:</strong> {chapter.concepts.join(' • ')}
            </div>

            <button
              onClick={handleComplete}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer active:scale-95"
            >
              Complete Chapter & Unlock Next ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
