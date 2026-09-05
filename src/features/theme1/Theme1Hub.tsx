import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { THEME_1_CHAPTERS } from '@/data/theme1Missions';
import { ArrowLeft, BookOpen, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
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
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-xs text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
            <span>All Science Worlds</span>
          </button>

          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
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
        <main id="curriculum-chapters" className="w-full pt-6 flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 dark:border-white/10 pb-6">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 mb-2">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>NCERT Class 5 EVS • Living Systems</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Super Senses & Living Systems 🌿
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
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
                className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Field Journal ({discoveries.length} Notes)</span>
              </button>
            </div>
          </div>

          {/* 4 Curriculum Cards Grid with Balanced Layout & Hover-Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {THEME_1_CHAPTERS.map((ch, idx) => {
              const art = CHAPTER_ARTWORK[ch.chapterNumber] || CHAPTER_ARTWORK[1];
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.015, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChapterClick(ch.chapterNumber)}
                  className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-soft-card hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.28)] hover:border-emerald-500/60 transition-all flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden"
                >
                  <div>
                    {/* Visual Specimen Thumbnail */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200/70 dark:border-white/10 shadow-md mb-4 bg-slate-950">
                      <img
                        src={art.imageSrc}
                        alt={ch.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-emerald-300 text-[11px] font-mono font-extrabold rounded-full border border-emerald-400/40 uppercase tracking-wider shadow-md flex items-center gap-1.5">
                          <span>Chapter {ch.chapterNumber}</span>
                          <span>•</span>
                          <span>{art.badgeTitle}</span>
                        </span>

                        <span className="text-xl filter drop-shadow-md">{ch.icon}</span>
                      </div>

                      {/* Bottom Image Facts */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[11px] font-mono font-bold text-emerald-200 drop-shadow-md flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>{art.quickFact}</span>
                        </span>

                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-400/40 shadow-xs">
                          {art.stageCount} Lab Stages 🔬
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>

                    {/* Scientific Concept Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {ch.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold"
                        >
                          #{concept}
                        </span>
                      ))}
                    </div>

                    {/* ── Hover-and-Reveal Pip Mystery Inquiry Box ── */}
                    <div className="mt-4 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-500/25 transition-all duration-300 group-hover:border-emerald-400/60 group-hover:bg-emerald-100/70 dark:group-hover:bg-emerald-900/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <Pip mood="happy" size={18} interactive={false} />
                          <span>Pip's Mystery Question</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-75 group-hover:opacity-100 transition-opacity">
                          Lab Secret ✨
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                        "{art.mysteryQuestion}"
                      </p>
                    </div>
                  </div>

                  {/* Action Launch Bar */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      <span>Enter Interactive Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                    </span>

                    <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </span>
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


