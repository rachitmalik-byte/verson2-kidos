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

        {/* ── 5 Curriculum Cards Grid with Minimal, Premium Architecture ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {SHELTER_CHAPTERS.map((ch, idx) => {
            const art = SHELTER_ARTWORK[ch.chapterNumber] || SHELTER_ARTWORK[1];
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className="bg-white dark:bg-[#0C1017] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left relative"
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
                      <span className="text-[11px] font-medium text-amber-200/90 drop-shadow-sm tracking-tight">
                        {art.quickFact}
                      </span>
                      <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        {art.stageCount} Stages
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400 font-sans block">
                      {art.badgeTitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {ch.subtitle}
                    </p>
                  </div>

                  {/* Minimal Inquiry Quote Accent */}
                  <div className="mt-3.5 pl-3 border-l-2 border-slate-200 dark:border-white/10 group-hover:border-amber-500/60 dark:group-hover:border-amber-400/60 transition-colors">
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic font-normal leading-relaxed line-clamp-2">
                      "{art.mysteryQuestion}"
                    </p>
                  </div>
                </div>

                {/* Minimal Footer Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Expedition</span>
                  </span>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
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
