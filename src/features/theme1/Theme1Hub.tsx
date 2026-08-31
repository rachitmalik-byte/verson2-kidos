import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { THEME_1_CHAPTERS } from '@/data/theme1Missions';
import { ArrowLeft, Sparkles, BookOpen, ArrowRight, Leaf, Eye, Apple, Wind } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { LivingWorldAnimatedForestBackground } from '@/components/effects/LivingWorldAnimatedForestBackground';

export function Theme1Hub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/1/chapter/${chapterNum}`);
  };

  const theme1Illustrations = [
    {
      bgGradient: 'from-emerald-500/20 via-teal-400/10 to-amber-400/20',
      badgeColor: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-400 hover:border-emerald-500 hover:shadow-emerald-200/80',
      icon: '🐾',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          🦅🐜
        </div>
      ),
      highlight: 'Eagle 100m Zoom & Ant Pheromones',
    },
    {
      bgGradient: 'from-amber-500/20 via-orange-400/10 to-emerald-400/20',
      badgeColor: 'bg-amber-600 text-white',
      accentBorder: 'border-amber-400 hover:border-amber-500 hover:shadow-amber-200/80',
      icon: '🐍',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          🐍🎶
        </div>
      ),
      highlight: 'Ground Vibration Acoustics & Fangs',
    },
    {
      bgGradient: 'from-rose-500/20 via-pink-400/10 to-emerald-400/20',
      badgeColor: 'bg-rose-600 text-white',
      accentBorder: 'border-rose-400 hover:border-rose-500 hover:shadow-rose-200/80',
      icon: '👅',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          👅🍎
        </div>
      ),
      highlight: 'Taste Bud Mapping & Saliva Enzyme Lab',
    },
    {
      bgGradient: 'from-teal-500/20 via-sky-400/10 to-emerald-400/20',
      badgeColor: 'bg-teal-600 text-white',
      accentBorder: 'border-teal-400 hover:border-teal-500 hover:shadow-teal-200/80',
      icon: '🌱',
      vectorArt: (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-3xl shadow-md border-2 border-white/80 shrink-0">
          🌱🌬️
        </div>
      ),
      highlight: 'Burdock Velcro Hooks & Wind Gliders',
    },
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans overflow-x-hidden">
      {/* ── Rich Animated Jungle, Butterflies & Fireflies Background ── */}
      <LivingWorldAnimatedForestBackground />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        {/* ── Top Game Navbar ── */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-emerald-200 shadow-lg">
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

            <span className="text-xs font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
              <span>Theme 1: Super Senses & Living World</span>
            </span>
          </div>

          <AudioNavBarControls />
        </div>

        {/* ── Hero Banner ── */}
        <div className="w-full bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-emerald-400 shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-emerald-600 pointer-events-none">
            <Leaf className="w-48 h-48" />
          </div>

          <div className="relative shrink-0">
            <Pip mood="idle" size="lg" />
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <span className="px-3.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>NCERT Class 5 EVS • Living Systems</span>
            </span>

            <h1
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-2.5"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Super Senses & Living Creatures 🐾🌿
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1.5 max-w-xl leading-relaxed">
              Explore animal sense superpowers, snake ground vibration acoustics, digestive saliva enzymes, and plant seed dispersal inventions!
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start">
              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Field Journal ({discoveries.length} Notes)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 4 Illustrated Chapter Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {THEME_1_CHAPTERS.map((ch, idx) => {
            const ill = theme1Illustrations[idx] || theme1Illustrations[0];
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
                        className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors"
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
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1 group-hover:text-emerald-700">
                    <span>Enter Interactive Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                  </span>

                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
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
