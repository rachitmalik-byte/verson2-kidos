import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { WATER_CHAPTERS } from '@/data/themeWaterMissions';
import { ArrowLeft, BookOpen, ArrowRight, Droplets, Waves } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { WaterAnimatedOceanBackground } from '@/components/effects/WaterAnimatedOceanBackground';

// Clean 3D Specimen Artwork Assets
import cloudsRainImg from '@/assets/images/specimens/clouds_condensation_rain.jpg';
import stepwellBawriImg from '@/assets/images/specimens/stepwell_bawri_rajasthan.jpg';
import cargoShipImg from '@/assets/images/specimens/cargo_ship_buoyancy.jpg';
import mosquitoLarvaImg from '@/assets/images/specimens/mosquito_larva_microscope.jpg';

const WATER_ARTWORK: Record<number, {
  imageSrc: string;
  tagline: string;
  badgeGradient: string;
  borderAccent: string;
}> = {
  1: {
    imageSrc: cloudsRainImg,
    tagline: 'Solar Evaporation & Cumulus Condensation',
    badgeGradient: 'from-sky-600 to-blue-700',
    borderAccent: 'border-sky-300 hover:border-sky-500 hover:shadow-sky-200/80',
  },
  2: {
    imageSrc: stepwellBawriImg,
    tagline: 'Jaisalmer Ghadisar & Rajasthani Bawris',
    badgeGradient: 'from-blue-600 to-indigo-700',
    borderAccent: 'border-blue-300 hover:border-blue-500 hover:shadow-blue-200/80',
  },
  3: {
    imageSrc: cargoShipImg,
    tagline: 'Displaced Volume & Dead Sea Salinity',
    badgeGradient: 'from-cyan-600 to-sky-700',
    borderAccent: 'border-cyan-300 hover:border-cyan-500 hover:shadow-cyan-200/80',
  },
  4: {
    imageSrc: mosquitoLarvaImg,
    tagline: 'Mosquito Larval Siphons & Eco-Oil Barrier',
    badgeGradient: 'from-teal-600 to-blue-700',
    borderAccent: 'border-teal-300 hover:border-teal-500 hover:shadow-teal-200/80',
  },
};

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
      {/* ── Rich Themed Animated Background ── */}
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
        <div className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-sky-400 shadow-xl flex flex-col md:flex-row items-center gap-6">
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
              Explore the animated water cycle simulator, Ghadisar lake stepwells, displaced volume density physics, and microscope mosquito ecology!
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

        {/* ── 4 Re-Engineered 3D Chapter Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {WATER_CHAPTERS.map((ch) => {
            const art = WATER_ARTWORK[ch.chapterNumber] || WATER_ARTWORK[1];
            return (
              <motion.button
                key={ch.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className={`rounded-[32px] bg-white border-4 ${art.borderAccent} shadow-xl text-left cursor-pointer transition-all flex flex-col overflow-hidden group select-none`}
              >
                {/* ── Top 3D Chapter Banner ── */}
                <div className="w-full h-44 sm:h-48 relative overflow-hidden bg-slate-900">
                  <img
                    src={art.imageSrc}
                    alt={ch.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className={`px-3 py-1 bg-gradient-to-r ${art.badgeGradient} text-white text-xs font-black rounded-full uppercase tracking-wider shadow-md`}>
                      Chapter {ch.chapterNumber}
                    </span>
                    <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono font-black rounded-full border border-white/20">
                      {ch.cbseChapterRef}
                    </span>
                  </div>

                  {/* Bottom Image Tagline */}
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold text-sky-300 drop-shadow-md">
                      {art.tagline}
                    </span>
                    <span className="text-xl filter drop-shadow-md">{ch.icon}</span>
                  </div>
                </div>

                {/* ── Card Content Body ── */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3
                      className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-sky-700 transition-colors"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {ch.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>

                    {/* Concept Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ch.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black rounded-xl shadow-2xs"
                        >
                          #{concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Launch Bar */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-sky-600 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Launch Interactive Mission</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </span>

                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
                      5 Lab Stages 🔬
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
