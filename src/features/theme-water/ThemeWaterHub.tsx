import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  tagline: string;
  accentBorder: string;
}> = {
  1: {
    imageSrc: cloudsRainImg,
    tagline: 'Solar Evaporation & Cumulus Condensation',
    accentBorder: 'border-sky-500/40 group-hover:border-sky-400',
  },
  2: {
    imageSrc: stepwellBawriImg,
    tagline: 'Jaisalmer Ghadisar & Rajasthani Bawris',
    accentBorder: 'border-blue-500/40 group-hover:border-blue-400',
  },
  3: {
    imageSrc: cargoShipImg,
    tagline: 'Displaced Volume & Dead Sea Salinity',
    accentBorder: 'border-cyan-500/40 group-hover:border-cyan-400',
  },
  4: {
    imageSrc: mosquitoLarvaImg,
    tagline: 'Mosquito Larval Siphons & Eco-Oil Barrier',
    accentBorder: 'border-teal-500/40 group-hover:border-teal-400',
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
      <div className="min-h-screen w-full relative flex flex-col justify-between pt-2 pb-20 px-4 sm:px-6 md:px-8 font-sans overflow-x-hidden text-white">
        {/* Themed Animated Ocean Canvas */}
        <WaterAnimatedOceanBackground />

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

            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Oceans, Density & Hydrosphere Realm</span>
            </span>
          </div>

          {/* ── Cinematic Aquatic World Hero Stage ── */}
          <div className="portal-hero w-full bg-gradient-to-r from-slate-950 via-cyan-950/80 to-slate-950 border border-white/15 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>REALM 03 • HYDROSPHERE & DENSITY</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                Water Physics & Ocean Wonders 🌊
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed font-normal">
                Explore solar evaporation cycles, water density in the Dead Sea, why 50,000-ton cargo ships float,
                and how ancient desert stepwells captured water for centuries.
              </p>

              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                <button
                  onClick={() => handleChapterClick(1)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Chapter 1: Water Cycle</span>
                </button>

                <button
                  onClick={() => {
                    sounds.pop();
                    navigate('/discovery-book');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Field Journal ({discoveries.length})</span>
                </button>
              </div>
            </div>

            {/* Pip Companion Terminal */}
            <div className="relative z-10 shrink-0 flex flex-col items-center bg-slate-900/80 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
              <Pip mood="curious" size={72} interactive={false} />
              <span className="text-[11px] font-bold text-slate-300 mt-2">
                "Water has zero gravity in orbit!"
              </span>
            </div>
          </div>

          {/* ── 4 Re-Engineered 3D Chapter Portals ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {WATER_CHAPTERS.map((ch) => {
              const art = WATER_ARTWORK[ch.chapterNumber] || WATER_ARTWORK[1];
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
                        <span className="font-mono font-bold text-cyan-300 bg-slate-950/70 px-2 py-0.5 rounded-md border border-cyan-500/30">
                          Ch 0{ch.chapterNumber}
                        </span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {art.tagline}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs font-bold text-slate-300 group-hover:text-cyan-400">
                    <span>Enter Laboratory Experiment</span>
                    <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-cyan-600 flex items-center justify-center text-white transition-all">
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
