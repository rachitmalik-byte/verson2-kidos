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

// Specimen Photography & 3D Artwork
import voxelForestImg from '@/assets/images/nature/kaykit_forest_biome_sample.png';
import snakeVibrationImg from '@/assets/images/specimens/snake_jawbone_vibrations.jpg';
import tonguePapillaeImg from '@/assets/images/specimens/tongue_taste_papillae.jpg';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

const CHAPTER_ARTWORK: Record<number, {
  imageSrc: string;
  tagline: string;
  telemetry: string;
  frequency: string;
}> = {
  1: {
    imageSrc: voxelForestImg,
    tagline: '3D Voxel Canopy & Scent Navigation',
    telemetry: 'PHEROMONE MATRIX',
    frequency: '0.002 ppm Trail Density',
  },
  2: {
    imageSrc: snakeVibrationImg,
    tagline: 'Ground Compression & Seismic Ear',
    telemetry: 'SEISMIC ACOUSTICS',
    frequency: '12 – 40 Hz Ground Waves',
  },
  3: {
    imageSrc: tonguePapillaeImg,
    tagline: 'Papillae Micro-Receptors & Amylase',
    telemetry: 'BIO-CHEMISTRY',
    frequency: '9,000+ Gustatory Cones',
  },
  4: {
    imageSrc: burdockVelcroImg,
    tagline: 'Micro-Hook Mechanics & Velcro Genesis',
    telemetry: 'BIOMIMETIC HOOKS',
    frequency: '450 N/m Radial Retention',
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

          {/* 4 Specimen Cards Grid with Staggered Motion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {THEME_1_CHAPTERS.map((ch, idx) => {
              const art = CHAPTER_ARTWORK[ch.chapterNumber] || CHAPTER_ARTWORK[1];
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.015, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChapterClick(ch.chapterNumber)}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-emerald-500/30 rounded-3xl shadow-soft-card hover:shadow-soft-float overflow-hidden flex flex-col justify-between group cursor-pointer transition-all"
                >
                  {/* ── Specimen Optical Viewport ── */}
                  <div className="w-full h-48 sm:h-52 relative overflow-hidden bg-slate-950">
                    <img
                      src={art.imageSrc}
                      alt={ch.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-emerald-300 text-[11px] font-mono font-extrabold rounded-full border border-emerald-400/35 uppercase tracking-wider shadow-md">
                        Chapter {ch.chapterNumber} • {art.telemetry}
                      </span>

                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono font-bold rounded-full border border-white/20">
                        {ch.curriculumCode}
                      </span>
                    </div>

                    {/* Frequency Overlay */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-emerald-200 drop-shadow-md">
                        {art.frequency}
                      </span>
                      <span className="text-2xl filter drop-shadow-md">{ch.icon}</span>
                    </div>
                  </div>

                  {/* ── Card Content ── */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {ch.subtitle}
                      </p>

                      {/* Scientific Concept Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {ch.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold"
                          >
                            #{concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Launch Bar */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        <span>Enter Interactive Lab</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>

                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        5 Lab Stages 🔬
                      </span>
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


