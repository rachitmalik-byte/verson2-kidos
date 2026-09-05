import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { THEME_1_CHAPTERS } from '@/data/theme1Missions';
import { ArrowLeft, BookOpen, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { Pip } from '@/components/pip/Pip';
import { LivingWorldAnimatedForestBackground } from '@/components/effects/LivingWorldAnimatedForestBackground';

// Specimen Photography & Educational Artwork
import antsTrailImg from '@/assets/images/theme1/ants_trail_sugar.jpg';
import snakeVibrationImg from '@/assets/images/specimens/snake_jawbone_vibrations.jpg';
import openstaxTongueImg from '@/assets/images/specimens/openstax_tongue_full.jpg';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

const CHAPTER_ARTWORK: Record<number, {
  imageSrc: string;
  badgeTitle: string;
  quickFact: string;
  mysteryQuestion: string;
  stageCount: number;
}> = {
  1: {
    imageSrc: antsTrailImg,
    badgeTitle: 'Ant Scent Trails',
    quickFact: 'Antennae Smell Radar 🐜',
    mysteryQuestion: 'Why do ants always march in a neat line, and what happens if you place a pencil across their path?',
    stageCount: 5,
  },
  2: {
    imageSrc: snakeVibrationImg,
    badgeTitle: 'Seismic Ground Hearing',
    quickFact: '12 – 40 Hz Ground Waves 🐍',
    mysteryQuestion: "Snakes don't have ears on their heads! How do their jawbones feel footprints on the earth?",
    stageCount: 5,
  },
  3: {
    imageSrc: openstaxTongueImg,
    badgeTitle: 'Taste Buds & Digestion',
    quickFact: 'Sweet, Sour, Salty & Bitter 👅',
    mysteryQuestion: 'How does saliva turn chewed bread from plain starch into sweet sugar right on your tongue?',
    stageCount: 5,
  },
  4: {
    imageSrc: burdockVelcroImg,
    badgeTitle: 'Velcro Seed Hooks',
    quickFact: 'Microscopic Grip Loops 🌱',
    mysteryQuestion: 'How did prickly burrs sticking to a dog inspire the invention of astronaut Velcro fasteners?',
    stageCount: 5,
  },
};

export function Theme1Hub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);
  const isDay = timeOfDay === 'day';

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/1/chapter/${chapterNum}`);
  };

  return (
    <PersistentAppShell activeDestination="map">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-20 flex flex-col gap-8 relative z-10 font-sans">
        {/* ── Forest Background FX ── */}
        <LivingWorldAnimatedForestBackground />

        {/* ── Sub-Navigation Breadcrumb Bar ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/subjects');
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all ${
              isDay
                ? 'bg-white/90 hover:bg-white text-slate-700 border-slate-200 shadow-xs'
                : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-white/15 shadow-md'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-500" />
            <span>All Science Worlds</span>
          </button>

          <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border backdrop-blur-md ${
            isDay
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
              : 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40'
          }`}>
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Living Biosphere & Super Senses Realm</span>
          </span>
        </div>

        {/* ── Cinematic Living World Hero Stage ── */}
        <div className="portal-hero w-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-10 rounded-3xl shadow-soft-float flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-white">
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>REALM 01 • LIVING SYSTEMS & SUPER SENSES</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Super Senses & Living Systems 🐾🌿
            </h1>
            <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-xl leading-relaxed font-normal">
              Explore 4 interactive chapters spanning ant chemical scent trails, snake seismic vibration detection, 
              tongue papillae micro-receptors, and burdock seed biomimicry.
            </p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <button
                onClick={() => handleChapterClick(1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
              >
                <Compass className="w-4 h-4" />
                <span>Start Chapter 1: Scent Trails</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all active:scale-98"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>

          {/* Pip Companion Terminal */}
          <div className="relative z-10 shrink-0 flex flex-col items-center bg-slate-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <Pip mood="curious" size={72} interactive={false} />
            <span className="text-[11px] font-bold text-emerald-200 mt-2">
              "Ants smell through their antennae!"
            </span>
          </div>
        </div>

        {/* ── Living World Curriculum Chapters & Interactive Bio-Labs ── */}
        <main id="curriculum-chapters" className="w-full pt-4 flex flex-col gap-6">
          {/* Section Header with High-Contrast Frosted Panel */}
          <div className={`p-6 sm:p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
            isDay 
              ? 'bg-white/90 border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
              : 'bg-slate-950/80 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}>
            <div>
              <span className={`px-3.5 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 mb-2 ${
                isDay
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
              }`}>
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>NCERT Class 5 EVS • Living Systems</span>
              </span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                isDay ? 'text-slate-900' : 'text-white'
              }`}>
                Super Senses & Living Systems 🌿
              </h2>
              <p className={`text-xs sm:text-sm font-medium mt-1 max-w-2xl leading-relaxed ${
                isDay ? 'text-slate-600' : 'text-slate-300'
              }`}>
                Explore 4 interactive chapters spanning ant scent trails, snake seismic hearing, 
                taste papillae biochemistry, and burdock seed biomimicry.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className={`px-4 py-2.5 rounded-xl border shadow-xs text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  isDay
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-md'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Field Journal ({discoveries.length} Notes)</span>
              </button>
            </div>
          </div>

          {/* 4 Curriculum Cards Grid with Minimal, Premium Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {THEME_1_CHAPTERS.map((ch, idx) => {
              const art = CHAPTER_ARTWORK[ch.chapterNumber] || CHAPTER_ARTWORK[1];
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleChapterClick(ch.chapterNumber)}
                  className={`rounded-2xl sm:rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left relative ${
                    isDay
                      ? 'bg-white border border-slate-200/90 text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:border-emerald-500/50'
                      : 'bg-[#0C1017] border border-white/[0.08] text-white shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-emerald-500/30'
                  }`}
                >
                  <div>
                    {/* Visual Media Canvas */}
                    <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 mb-4">
                      <img
                        src={art.imageSrc}
                        alt={ch.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Top Minimal Pill */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white/95 text-[11px] font-semibold tracking-wide rounded-lg border border-white/15">
                          Chapter 0{ch.chapterNumber}
                        </span>

                        <span className="text-lg filter drop-shadow-sm">{ch.icon}</span>
                      </div>

                      {/* Bottom Media Subtle Label */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-emerald-200/90 drop-shadow-sm tracking-tight">
                          {art.quickFact}
                        </span>
                        <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                          {art.stageCount} Stages
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-1.5">
                      <span className={`text-[11px] font-semibold tracking-wider uppercase font-sans block ${
                        isDay ? 'text-emerald-600' : 'text-emerald-400'
                      }`}>
                        {art.badgeTitle}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                        isDay
                          ? 'text-slate-900 group-hover:text-emerald-600'
                          : 'text-white group-hover:text-emerald-400'
                      }`}>
                        {ch.title}
                      </h3>
                      <p className={`text-xs sm:text-[13px] leading-relaxed mt-1 line-clamp-2 ${
                        isDay ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {ch.subtitle}
                      </p>
                    </div>

                    {/* Minimal Inquiry Quote Accent */}
                    <div className={`mt-3.5 pl-3 border-l-2 transition-colors ${
                      isDay
                        ? 'border-slate-200 group-hover:border-emerald-500/60'
                        : 'border-white/10 group-hover:border-emerald-400/60'
                    }`}>
                      <p className={`text-xs italic font-normal leading-relaxed line-clamp-2 ${
                        isDay ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        "{art.mysteryQuestion}"
                      </p>
                    </div>
                  </div>

                  {/* Minimal Footer Row */}
                  <div className={`mt-5 pt-3.5 border-t flex items-center justify-between ${
                    isDay ? 'border-slate-100' : 'border-white/[0.06]'
                  }`}>
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${
                      isDay ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Interactive Lab</span>
                    </span>

                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isDay
                        ? 'text-emerald-600 group-hover:text-emerald-700'
                        : 'text-emerald-400 group-hover:text-emerald-300'
                    }`}>
                      <span>Start Mission</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </PersistentAppShell>
  );
}


