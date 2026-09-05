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

        {/* ── 4 Curriculum Cards Grid with Minimal, Premium Architecture ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {WATER_CHAPTERS.map((ch, idx) => {
            const art = WATER_ARTWORK[ch.chapterNumber] || WATER_ARTWORK[1];
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className="bg-white dark:bg-[#0C1017] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left relative"
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
                      <span className="text-[11px] font-medium text-cyan-200/90 drop-shadow-sm tracking-tight">
                        {art.quickFact}
                      </span>
                      <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        {art.stageCount} Stages
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 font-sans block">
                      {art.badgeTitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {ch.subtitle}
                    </p>
                  </div>

                  {/* Minimal Inquiry Quote Accent */}
                  <div className="mt-3.5 pl-3 border-l-2 border-slate-200 dark:border-white/10 group-hover:border-cyan-500/60 dark:group-hover:border-cyan-400/60 transition-colors">
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic font-normal leading-relaxed line-clamp-2">
                      "{art.mysteryQuestion}"
                    </p>
                  </div>
                </div>

                {/* Minimal Footer Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    <span>Water Lab</span>
                  </span>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    <span>Start Mission</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PersistentAppShell>
  );
}
