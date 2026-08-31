import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { WATER_CHAPTERS } from '@/data/themeWaterMissions';
import { ArrowLeft, Sparkles, BookOpen, ArrowRight, Droplets, Waves } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { WaterAnimatedOceanBackground } from '@/components/effects/WaterAnimatedOceanBackground';

export function ThemeWaterHub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/water/chapter/${chapterNum}`);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans overflow-x-hidden">
      {/* ── Rich Themed Animated Background (SVG Waves, Sunbeams & Marine Life) ── */}
      <WaterAnimatedOceanBackground />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        {/* ── Top Game Navbar ── */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-sky-300 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Subjects</span>
            </button>

            <span className="text-xs font-black text-sky-900 bg-sky-100 border border-sky-300 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>Theme 2 & 4: Water & Aquatic Experiments</span>
            </span>
          </div>

          <AudioNavBarControls />
        </div>

        {/* ── Hero Banner ── */}
        <div className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-4 border-sky-400 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <Pip mood="idle" size="lg" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="px-3 py-1 bg-sky-100 border border-sky-300 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              <span>CBSE Class 5 EVS • Theme 2 & 4</span>
            </span>

            <h1
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Water, Experiments & Water Cycle 🌊☀️☁️🌧️
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1 max-w-xl">
              Explore the animated 2D water cycle simulator, Ghadisar lake stepwells, density physics with floating eggs, and microscope mosquito ecology!
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start">
              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-900 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Clean 4 Chapter Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {WATER_CHAPTERS.map((ch) => (
            <motion.button
              key={ch.id}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChapterClick(ch.chapterNumber)}
              className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-sky-200 hover:border-sky-500 shadow-md text-left cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-sky-100 text-sky-900 text-[11px] font-black rounded-full uppercase">
                    Chapter {ch.chapterNumber}
                  </span>
                  <span className="text-2xl">{ch.icon}</span>
                </div>

                <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider block mb-1">
                  {ch.cbseChapterRef}
                </span>

                <h3
                  className="text-lg font-black text-slate-900 leading-snug"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {ch.title}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1 line-clamp-2">
                  {ch.subtitle}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ch.concepts.slice(0, 3).map((concept) => (
                    <span
                      key={concept}
                      className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg"
                    >
                      #{concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-sky-600 flex items-center gap-1">
                  <span>Enter Interactive Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </span>

                <span className="text-[10px] font-bold text-slate-400">
                  Interactive 🔬
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
