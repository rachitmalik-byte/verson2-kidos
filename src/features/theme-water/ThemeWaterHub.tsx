import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { WATER_CHAPTERS } from '@/data/themeWaterMissions';
import { ArrowLeft, BookOpen, ArrowRight, Droplets, Sparkles, Compass } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { WaterAnimatedOceanBackground } from '@/components/effects/WaterAnimatedOceanBackground';

// Clean 3D Specimen Artwork Assets
import cloudsRainImg from '@/assets/images/specimens/clouds_condensation_rain.jpg';
import stepwellBawriImg from '@/assets/images/specimens/stepwell_bawri_rajasthan.jpg';
import cargoShipImg from '@/assets/images/specimens/cargo_ship_buoyancy.jpg';
import mosquitoLarvaImg from '@/assets/images/specimens/mosquito_larva_microscope.jpg';

const WATER_ARTWORK: Record<number, {
  imageSrc: string;
  badgeTitle: string;
  quickFact: string;
  mysteryQuestion: string;
  stageCount: number;
}> = {
  1: {
    imageSrc: cloudsRainImg,
    badgeTitle: 'Water Cycle & Rain',
    quickFact: 'Evaporation & Clouds ☁️',
    mysteryQuestion: 'Why does a wet handkerchief dry faster spread out flat under the sun than scrunched into a ball?',
    stageCount: 5,
  },
  2: {
    imageSrc: stepwellBawriImg,
    badgeTitle: 'Ancient Desert Bawris',
    quickFact: 'Jaisalmer Ghadisar Lake 🏛️',
    mysteryQuestion: 'How did rainwater stepwells in Rajasthan store crystal cool drinking water for an entire town all year?',
    stageCount: 5,
  },
  3: {
    imageSrc: cargoShipImg,
    badgeTitle: 'Floating & Sinking',
    quickFact: 'Water Buoyancy & Density 🚢',
    mysteryQuestion: 'Why does a tiny iron nail sink straight to the bottom, while a giant 100,000-ton cargo ship floats easily?',
    stageCount: 5,
  },
  4: {
    imageSrc: mosquitoLarvaImg,
    badgeTitle: 'Clean Water Ecology',
    quickFact: 'Larvae Siphons & Prevention 🦟',
    mysteryQuestion: 'How does a single drop of vegetable oil stop mosquito larvae from breathing through the water surface?',
    stageCount: 5,
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
    <PersistentAppShell activeDestination="map">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-20 flex flex-col gap-8 relative z-10 font-sans">
        {/* Themed Animated Ocean Canvas */}
        <WaterAnimatedOceanBackground />

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

          <span className="text-xs font-mono font-bold text-teal-800 dark:text-cyan-300 bg-teal-50 dark:bg-cyan-950/80 border border-teal-200 dark:border-cyan-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-teal-600" />
            <span>Oceans, Density & Hydrosphere Realm</span>
          </span>
        </div>

        {/* ── Cinematic Aquatic World Hero Stage ── */}
        <div className="portal-hero w-full bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 border border-teal-500/30 p-6 sm:p-10 rounded-3xl shadow-soft-float flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-white">
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>REALM 03 • HYDROSPHERE & DENSITY</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Water Physics & Ocean Wonders 🌊
            </h1>
            <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-xl leading-relaxed font-normal">
              Explore solar evaporation cycles, water density in the Dead Sea, why 50,000-ton cargo ships float,
              and how ancient desert stepwells captured water for centuries.
            </p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <button
                onClick={() => handleChapterClick(1)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Start Chapter 1: Water Cycle</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>

          {/* Pip Companion Terminal */}
          <div className="relative z-10 shrink-0 flex flex-col items-center bg-slate-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <Pip mood="curious" size={72} interactive={false} />
            <span className="text-[11px] font-bold text-cyan-200 mt-2">
              "Water has zero gravity in orbit!"
            </span>
          </div>
        </div>

        {/* ── 4 Curriculum Cards Grid with Balanced Layout & Hover-Reveal ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {WATER_CHAPTERS.map((ch, idx) => {
            const art = WATER_ARTWORK[ch.chapterNumber] || WATER_ARTWORK[1];
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ scale: 1.015, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-teal-500/30 p-5 sm:p-6 rounded-3xl shadow-soft-card hover:shadow-[0_20px_45px_-12px_rgba(14,165,233,0.28)] hover:border-teal-400/60 text-left cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
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
                      <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-teal-300 text-[11px] font-mono font-extrabold rounded-full border border-teal-400/40 uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <span>Chapter {ch.chapterNumber}</span>
                        <span>•</span>
                        <span>{art.badgeTitle}</span>
                      </span>

                      <span className="text-xl filter drop-shadow-md">{ch.icon}</span>
                    </div>

                    {/* Bottom Image Facts */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[11px] font-mono font-bold text-teal-200 drop-shadow-md flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-500/30">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        <span>{art.quickFact}</span>
                      </span>

                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-950/80 backdrop-blur-md text-teal-300 border border-teal-400/40 shadow-xs">
                        {art.stageCount} Lab Stages 🔬
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {ch.subtitle}
                  </p>

                  {/* ── Hover-and-Reveal Pip Mystery Inquiry Box ── */}
                  <div className="mt-4 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-500/25 transition-all duration-300 group-hover:border-teal-400/60 group-hover:bg-teal-100/70 dark:group-hover:bg-teal-900/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                        <Pip mood="curious" size={18} interactive={false} />
                        <span>Pip's Mystery Question</span>
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 opacity-75 group-hover:opacity-100 transition-opacity">
                        Water Secret 💧
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                      "{art.mysteryQuestion}"
                    </p>
                  </div>
                </div>

                {/* Action Launch Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-700 dark:text-teal-400 flex items-center gap-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    <span>Enter Laboratory Experiment</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                  </span>

                  <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PersistentAppShell>
  );
}
