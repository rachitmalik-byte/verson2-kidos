import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { SHELTER_CHAPTERS } from '@/data/themeShelterMissions';
import { ArrowLeft, Sparkles, BookOpen, ArrowRight, Home, Mountain, Rocket, Castle, Zap, Compass } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { ShelterAnimatedMountainBackground } from '@/components/effects/ShelterAnimatedMountainBackground';

export function ThemeShelterHub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/shelter/chapter/${chapterNum}`);
  };

  const shelterIllustrations = [
    {
      bgGradient: 'from-amber-500/20 via-indigo-400/10 to-blue-400/20',
      badgeColor: 'bg-indigo-600 text-white',
      accentBorder: 'border-indigo-400 hover:border-indigo-500 hover:shadow-indigo-200/80',
      icon: '🏔️',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          ⛺🏔️
        </div>
      ),
      highlight: '5,000m Ladakh Changpa Yak-Wool Rebo',
    },
    {
      bgGradient: 'from-sky-500/20 via-teal-400/10 to-indigo-400/20',
      badgeColor: 'bg-sky-600 text-white',
      accentBorder: 'border-sky-400 hover:border-sky-500 hover:shadow-sky-200/80',
      icon: '🧗‍♀️',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          🏔️🧗‍♀️
        </div>
      ),
      highlight: '8,848m Mount Everest Expedition',
    },
    {
      bgGradient: 'from-purple-500/20 via-pink-400/10 to-indigo-400/20',
      badgeColor: 'bg-purple-600 text-white',
      accentBorder: 'border-purple-400 hover:border-purple-500 hover:shadow-purple-200/80',
      icon: '🚀',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-700 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          👨‍🚀🛰️
        </div>
      ),
      highlight: 'Zero-G Space Station Habitat',
    },
    {
      bgGradient: 'from-amber-600/20 via-orange-400/10 to-amber-400/20',
      badgeColor: 'bg-amber-700 text-white',
      accentBorder: 'border-amber-400 hover:border-amber-500 hover:shadow-amber-200/80',
      icon: '🏰',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          👑🏰
        </div>
      ),
      highlight: '87 Bastions & Persian Water Wheel',
    },
    {
      bgGradient: 'from-rose-500/20 via-orange-400/10 to-amber-400/20',
      badgeColor: 'bg-rose-600 text-white',
      accentBorder: 'border-rose-400 hover:border-rose-500 hover:shadow-rose-200/80',
      icon: '⛽',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          ⚡☀️
        </div>
      ),
      highlight: 'Fossil Fuels & Clean Solar Grid',
    },
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans overflow-x-hidden">
      {/* ── Rich Animated Himalayan Mountain & Snow Background ── */}
      <ShelterAnimatedMountainBackground />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        {/* ── Top Game Navbar ── */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-indigo-200 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Subjects</span>
            </button>

            <span className="text-xs font-black text-indigo-950 bg-indigo-100 border border-indigo-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Home className="w-3.5 h-3.5 text-indigo-600" />
              <span>Theme 3 & 5: Shelter, Mountains & Fort Architecture</span>
            </span>
          </div>

          <AudioNavBarControls />
        </div>

        {/* ── Hero Banner ── */}
        <div className="w-full bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-indigo-400 shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-indigo-600 pointer-events-none">
            <Mountain className="w-48 h-48" />
          </div>

          <div className="relative shrink-0">
            <Pip mood="idle" size="lg" />
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <span className="px-3.5 py-1 bg-indigo-100 border border-indigo-300 text-indigo-950 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <Mountain className="w-3.5 h-3.5 text-indigo-600" />
              <span>NCERT Class 5 EVS • Earth Habitats & Explorers</span>
            </span>

            <h1
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2.5"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Shelters, High Altitudes & Space 🏔️🚀🏰
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1.5 max-w-xl leading-relaxed">
              Explore 5,000m Ladakh Changpa nomadic tents, Bachendri Pal's Everest climb, Sunita Williams in zero gravity, Golconda fort hydraulics, and petroleum refineries!
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start">
              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-300 text-indigo-950 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Field Journal ({discoveries.length} Notes)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 5 Illustrated Chapter Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {SHELTER_CHAPTERS.map((ch, idx) => {
            const ill = shelterIllustrations[idx] || shelterIllustrations[0];
            return (
              <motion.button
                key={ch.id}
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className={`p-6 rounded-[32px] bg-white/95 backdrop-blur-md border-4 ${ill.accentBorder} shadow-xl text-left cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ill.bgGradient} opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 ${ill.badgeColor} text-xs font-black rounded-full uppercase shadow-xs`}>
                        Chapter {ch.chapterNumber}
                      </span>
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        {ch.curriculumCode}
                      </span>
                    </div>

                    <span className="text-2xl filter drop-shadow-sm group-hover:scale-125 transition-transform">{ch.icon}</span>
                  </div>

                  <div className="flex items-start gap-4 my-2">
                    {ill.vectorArt}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        {ch.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {ch.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {ch.concepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-2.5 py-0.5 bg-white/90 border border-slate-200 text-slate-700 text-[10px] font-black rounded-lg shadow-2xs"
                      >
                        #{concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <span className="text-xs font-black text-indigo-600 flex items-center gap-1 group-hover:text-indigo-700">
                    <span>Enter Interactive Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                  </span>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {ill.highlight}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
