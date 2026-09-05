import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { SHELTER_CHAPTERS } from '@/data/themeShelterMissions';
import { ArrowLeft, BookOpen, ArrowRight, Mountain, Sparkles, Compass } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { ShelterAnimatedMountainBackground } from '@/components/effects/ShelterAnimatedMountainBackground';

// High-Altitude & Habitat Specimen Assets
import pashminaMicroImg from '@/assets/images/theme-shelter/pashmina_microscope_macro.jpg';
import reboTentImg from '@/assets/images/specimens/rebo_yak_tent.jpg';
import cramponsImg from '@/assets/images/specimens/mountaineer_crampons.jpg';
import golcondaFortImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import bhungaHouseImg from '@/assets/images/specimens/kutch_bhunga_house.jpg';

const SHELTER_ARTWORK: Record<number, {
  imageSrc: string;
  badgeTitle: string;
  quickFact: string;
  mysteryQuestion: string;
  stageCount: number;
}> = {
  1: {
    imageSrc: reboTentImg,
    badgeTitle: 'Changpa Yak Tents',
    quickFact: 'Woven Yak Hair Warmth ⛺',
    mysteryQuestion: 'How does a tent made of woven yak hair keep nomadic families warm in freezing -40°C mountain storms?',
    stageCount: 5,
  },
  2: {
    imageSrc: cramponsImg,
    badgeTitle: 'Mountaineering Science',
    quickFact: 'Steel Crampons & Ice Grip 🏔️',
    mysteryQuestion: 'Why do mountain climbers strap sharp steel spikes under their boots to walk up slick glaciers?',
    stageCount: 5,
  },
  3: {
    imageSrc: golcondaFortImg,
    badgeTitle: 'Fortress Engineering',
    quickFact: 'Whispering Arches & Bastions 🏰',
    mysteryQuestion: 'How could a guard clapping their hands at the fortress entrance be heard clearly at the king’s hilltop palace?',
    stageCount: 5,
  },
  4: {
    imageSrc: bhungaHouseImg,
    badgeTitle: 'Earthquake Shelters',
    quickFact: 'Circular Mud Bhungas 🛖',
    mysteryQuestion: 'Why did circular mud huts in Kutch survive massive earthquakes when square modern concrete houses collapsed?',
    stageCount: 5,
  },
  5: {
    imageSrc: pashminaMicroImg,
    badgeTitle: 'Pashmina & Space Habitats',
    quickFact: 'Micro-Fibers & Microgravity 🚀',
    mysteryQuestion: 'How can a warm winter shawl be so incredibly thin that it easily slides right through a finger ring?',
    stageCount: 5,
  },
};

export function ThemeShelterHub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/shelter/chapter/${chapterNum}`);
  };

  return (
    <PersistentAppShell activeDestination="map">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-20 flex flex-col gap-8 relative z-10 font-sans">
        {/* Himalayan Mountain & Snow Animated Background */}
        <ShelterAnimatedMountainBackground />

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

          <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-900/80 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
            <span>Extreme Shelters & Habitats Realm</span>
          </span>
        </div>

        {/* ── Cinematic Alpine World Hero Stage ── */}
        <div className="portal-hero w-full bg-gradient-to-r from-stone-900 via-teal-950 to-stone-900 border border-teal-500/30 p-6 sm:p-10 rounded-3xl shadow-soft-float flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden text-white">
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>REALM 04 • HABITATS & EXTREME CLIMATES</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              High-Altitude Shelters & Space Habitats 🏔️🚀
            </h1>
            <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-xl leading-relaxed font-normal">
              Ascend to 5,000m Ladakh plateaus with woven yak-hair tents, climb icy summits with crampons,
              analyze Golconda Fort hydraulics, and test circular earthquake-dampened architecture.
            </p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <button
                onClick={() => handleChapterClick(1)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Start Chapter 1: Changpa Tents</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>

          {/* Pip Companion Terminal */}
          <div className="relative z-10 shrink-0 flex flex-col items-center bg-stone-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <Pip mood="thinking" size={72} interactive={false} />
            <span className="text-[11px] font-bold text-stone-200 mt-2">
              "Round walls dissipate tremors!"
            </span>
          </div>
        </div>

        {/* ── 5 Curriculum Cards Grid with Balanced Layout & Hover-Reveal ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {SHELTER_CHAPTERS.map((ch, idx) => {
            const art = SHELTER_ARTWORK[ch.chapterNumber] || SHELTER_ARTWORK[1];
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ scale: 1.015, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-stone-700/60 p-5 sm:p-6 rounded-3xl shadow-soft-card hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.25)] hover:border-amber-500/60 text-left cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
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
                      <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-mono font-extrabold rounded-full border border-amber-400/40 uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <span>Chapter {ch.chapterNumber}</span>
                        <span>•</span>
                        <span>{art.badgeTitle}</span>
                      </span>

                      <span className="text-xl filter drop-shadow-md">{ch.icon}</span>
                    </div>

                    {/* Bottom Image Facts */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[11px] font-mono font-bold text-amber-200 drop-shadow-md flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{art.quickFact}</span>
                      </span>

                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-xs">
                        {art.stageCount} Stages 🏔️
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {ch.subtitle}
                  </p>

                  {/* ── Hover-and-Reveal Pip Mystery Inquiry Box ── */}
                  <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/25 transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-100/70 dark:group-hover:bg-amber-900/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Pip mood="thinking" size={18} interactive={false} />
                        <span>Pip's Mystery Question</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 opacity-75 group-hover:opacity-100 transition-opacity">
                        Shelter Secret 🛖
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                      "{art.mysteryQuestion}"
                    </p>
                  </div>
                </div>

                {/* Action Launch Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    <span>Enter Expedition</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                  </span>

                  <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
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
