import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  tagline: string;
  accentBorder: string;
}> = {
  1: {
    imageSrc: reboTentImg,
    tagline: 'Changpa Nomads & Woven Yak Hair Insulation',
    accentBorder: 'border-violet-500/40 group-hover:border-violet-400',
  },
  2: {
    imageSrc: cramponsImg,
    tagline: 'Mountaineer Crampons & Ice Wall Physics',
    accentBorder: 'border-purple-500/40 group-hover:border-purple-400',
  },
  3: {
    imageSrc: golcondaFortImg,
    tagline: 'Acoustic Whispering Arches & Fort Hydraulics',
    accentBorder: 'border-indigo-500/40 group-hover:border-indigo-400',
  },
  4: {
    imageSrc: bhungaHouseImg,
    tagline: 'Kutch Bhunga Mud Dampers & Earthquake Resistance',
    accentBorder: 'border-amber-500/40 group-hover:border-amber-400',
  },
  5: {
    imageSrc: pashminaMicroImg,
    tagline: 'Zero Gravity Water Droplets & Orbital Modules',
    accentBorder: 'border-cyan-500/40 group-hover:border-cyan-400',
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
      <div className="min-h-screen w-full relative flex flex-col justify-between pt-2 pb-20 px-4 sm:px-6 md:px-8 font-sans overflow-x-hidden text-white">
        {/* Himalayan Mountain & Snow Animated Background */}
        <ShelterAnimatedMountainBackground />

        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
          {/* ── Sub-Navigation Bar ── */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Science Worlds</span>
            </button>

            <span className="text-xs font-mono font-bold text-violet-300 bg-violet-950/80 border border-violet-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-violet-400" />
              <span>Extreme Shelters & Habitats Realm</span>
            </span>
          </div>

          {/* ── Cinematic Alpine World Hero Stage ── */}
          <div className="portal-hero w-full bg-gradient-to-r from-slate-950 via-violet-950/80 to-slate-950 border border-white/15 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-mono font-bold tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>REALM 04 • HABITATS & EXTREME CLIMATES</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                High-Altitude Shelters & Space Habitats 🏔️🚀
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed font-normal">
                Ascend to 5,000m Ladakh plateaus with woven yak-hair tents, climb icy summits with crampons,
                analyze Golconda Fort hydraulics, and test circular earthquake-dampened architecture.
              </p>

              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                <button
                  onClick={() => handleChapterClick(1)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-950/50 cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Chapter 1: Changpa Tents</span>
                </button>

                <button
                  onClick={() => {
                    sounds.pop();
                    navigate('/discovery-book');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                  <span>Field Journal ({discoveries.length})</span>
                </button>
              </div>
            </div>

            {/* Pip Companion Terminal */}
            <div className="relative z-10 shrink-0 flex flex-col items-center bg-slate-900/80 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
              <Pip mood="thinking" size={72} interactive={false} />
              <span className="text-[11px] font-bold text-slate-300 mt-2">
                "Round walls dissipate tremors!"
              </span>
            </div>
          </div>

          {/* ── 5 Re-Engineered 3D Specimen Chapter Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {SHELTER_CHAPTERS.map((ch) => {
              const art = SHELTER_ARTWORK[ch.chapterNumber] || SHELTER_ARTWORK[1];
              return (
                <div
                  key={ch.id}
                  onClick={() => handleChapterClick(ch.chapterNumber)}
                  className={`world-gateway-card bg-slate-900/90 backdrop-blur-md border ${art.accentBorder} p-5 sm:p-6 rounded-2xl shadow-xl text-left cursor-pointer transition-all flex flex-col justify-between group`}
                >
                  <div>
                    {/* Visual Specimen Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 shadow-md mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                      <img src={art.imageSrc} alt={ch.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-violet-300 bg-slate-950/70 px-2 py-0.5 rounded-md border border-violet-500/30">
                          Ch 0{ch.chapterNumber}
                        </span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {art.tagline.split('&')[0]}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-extrabold text-white group-hover:text-violet-300 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs font-bold text-slate-300 group-hover:text-violet-400">
                    <span>Enter Expedition</span>
                    <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-violet-600 flex items-center justify-center text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PersistentAppShell>
  );
}
