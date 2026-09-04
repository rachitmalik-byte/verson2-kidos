import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { SylvaLivingGreenCanvas } from '@/components/effects/SylvaLivingGreenCanvas';
import { Pip } from '@/components/pip/Pip';
import {
  ArrowRight,
  Sparkles,
  Layers,
  FlaskConical,
  Microscope,
  Zap,
} from 'lucide-react';

// Hero & World Imagery
import polyquestHeroBanner from '@/assets/images/showcase/polyquest_hero_banner.jpg';
import kaykitForestBiome from '@/assets/images/nature/kaykit_forest_biome_sample.png';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked'>('all');

  const handleLaunch = (path: string) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(path);
  };

  const scienceWorlds = [
    {
      id: 'living-world',
      title: 'Super Senses & Biosphere',
      subtitle: 'Animal Superpowers & Biomimicry',
      themeNumber: 1,
      route: '/theme/1/hub',
      accentColor: 'from-emerald-950 via-slate-900 to-teal-950',
      borderColor: 'border-emerald-500/30',
      glowColor: 'group-hover:border-emerald-400/60 shadow-emerald-950/50',
      icon: '🌿',
      image: kaykitForestBiome,
      curiosityHook: 'How do ants communicate using invisible scent trails?',
      keyConcepts: ['Pheromone Trails', 'Snake Ground Vibrations', 'Burdock Seed Velcro'],
      unlocked: true,
    },
    {
      id: 'materials-science',
      title: 'Materials Science & Polymers',
      subtitle: 'Molecular Lattices & Inventions',
      themeNumber: 6,
      route: '/chapter-hub',
      accentColor: 'from-indigo-950 via-slate-900 to-blue-950',
      borderColor: 'border-indigo-500/30',
      glowColor: 'group-hover:border-indigo-400/60 shadow-indigo-950/50',
      icon: '🧪',
      image: polyquestHeroBanner,
      curiosityHook: 'What gives synthetic polymers their super tensile strength?',
      keyConcepts: ['Natural Fibers', 'Synthetic Polymers', 'Cross-Linked Rubber'],
      unlocked: true,
    },
    {
      id: 'hydrosphere',
      title: 'Oceans & Hydrosphere',
      subtitle: 'Water Physics & Atmosphere',
      themeNumber: 2,
      route: '/theme/water/hub',
      accentColor: 'from-cyan-950 via-slate-900 to-sky-950',
      borderColor: 'border-cyan-500/30',
      glowColor: 'group-hover:border-cyan-400/60 shadow-cyan-950/50',
      icon: '💧',
      image: burdockVelcroImg,
      curiosityHook: 'Why do heavy steel ships float while small pebbles sink?',
      keyConcepts: ['Water Cycle', 'Buoyancy & Salinity', 'Desert Stepwells'],
      unlocked: true,
    },
    {
      id: 'shelter-space',
      title: 'Shelter & Space Habitats',
      subtitle: 'Architecture & Extreme Climates',
      themeNumber: 5,
      route: '/theme/shelter/hub',
      accentColor: 'from-violet-950 via-slate-900 to-purple-950',
      borderColor: 'border-violet-500/30',
      glowColor: 'group-hover:border-violet-400/60 shadow-violet-950/50',
      icon: '🏔️',
      image: kaykitForestBiome,
      curiosityHook: 'How do round Bhunga walls withstand severe earthquakes?',
      keyConcepts: ['Yak Wool Tents', 'Earthquake Resistance', 'Orbital Living'],
      unlocked: true,
    },
  ];

  return (
    <PersistentAppShell activeDestination="home">
      {/* ── Ambient 3D Particle WebGL Atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <SylvaLivingGreenCanvas enableButterfly={false} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-12 pt-2 md:pt-4">
        {/* ── CINEMATIC EXPEDITION HERO STAGE ── */}
        <section className="portal-hero w-full bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border border-white/15 p-6 sm:p-10 md:p-12 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle radial light beam */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Explorer Identity & Story Hook */}
          <div className="max-w-2xl flex flex-col gap-5 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wide w-fit">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>ACTIVE EXPLORATION EXPEDITION</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
                Where shall we explore today, Explorer?
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mt-3 font-normal leading-relaxed">
                Ants build chemical superhighways without GPS, and snakes "hear" footsteps through their jawbones.
                Step inside the living universe to unlock nature's secrets.
              </p>
            </div>

            {/* Launch CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleLaunch('/theme/1/hub')}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/50 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                <span>Continue Living World Expedition</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleLaunch('/subjects')}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Explore All 4 Worlds</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual World Focal Specimen */}
          <div className="relative z-10 w-full max-w-sm lg:max-w-md shrink-0">
            <div className="specimen-lens relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
              <img
                src={polyquestHeroBanner}
                alt="Living World Expedition Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    Interactive World 01
                  </span>
                  <span className="text-xs font-bold text-white">
                    Plants & Animal Super Senses
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TODAY'S DISCOVERY WAYPOINTS (TACTILE WORLD NODES) ── */}
        <section className="flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                Today's Expedition Waypoints
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Hands-on discoveries waiting for you to investigate today
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Active Quests
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Waypoint 1: Microscopic Zoom Scan */}
            <div
              onClick={() => handleLaunch('/discovery-book')}
              className="world-gateway-card bg-slate-900/90 backdrop-blur-md p-5 border border-white/10 hover:border-blue-500/50 flex flex-col justify-between cursor-pointer group shadow-lg text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">
                  Investigation
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Burdock Seed Hooks
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Zoom into tiny plant hooks that inspired the invention of Velcro fasteners.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs font-bold text-slate-300 group-hover:text-blue-400">
                <span>Inspect Micrograph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 2: Hands-on Tensile Rig */}
            <div
              onClick={() => handleLaunch('/chapter/3/mission/4')}
              className="world-gateway-card bg-slate-900/90 backdrop-blur-md p-5 border border-white/10 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer group shadow-lg text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  Laboratory Test
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Fabric Crumple Rig
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Squeeze cotton and synthetic polyester in the press to compare wrinkle memory.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs font-bold text-slate-300 group-hover:text-emerald-400">
                <span>Enter Laboratory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 3: Spaced Recall Check */}
            <div
              onClick={() => handleLaunch('/chapter-hub')}
              className="world-gateway-card bg-slate-900/90 backdrop-blur-md p-5 border border-white/10 hover:border-amber-500/50 flex flex-col justify-between cursor-pointer group shadow-lg text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                  Memory Spark
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Pheromone Highway
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Recall how worker ants establish food trails when obstacles appear.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs font-bold text-slate-300 group-hover:text-amber-400">
                <span>Take Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 4: Pip AI Science Coach */}
            <div className="world-gateway-card bg-slate-900/90 backdrop-blur-md p-5 border border-white/10 flex flex-col justify-between shadow-lg text-left">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Pip mood="curious" size={44} interactive={false} />
                  <div>
                    <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider block">
                      Pip's Inquiry
                    </span>
                    <span className="text-xs font-bold text-white">Daily Mystery</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Why does ice float on liquid water when most solids sink in their own liquids?"
                </p>
              </div>

              <button
                onClick={() => handleLaunch('/chapter-hub')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-400/30 text-xs font-bold text-center transition-all cursor-pointer"
              >
                Discuss with Pip →
              </button>
            </div>
          </div>
        </section>

        {/* ── THEMATIC REALM PORTALS (EXPANSIVE VISUAL WORLDS) ── */}
        <section className="flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                Thematic Learning Realms
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Explore nature, chemistry, atmosphere, and space across dedicated realms
              </p>
            </div>

            <button
              onClick={() => handleLaunch('/subjects')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scienceWorlds.map((world) => (
              <div
                key={world.id}
                onClick={() => handleLaunch(world.route)}
                className={`world-gateway-card bg-gradient-to-br ${world.accentColor} border ${world.borderColor} hover:shadow-2xl transition-all cursor-pointer group p-6 sm:p-7 flex flex-col justify-between min-h-[240px] relative overflow-hidden`}
              >
                {/* Background Specimen Image Tint */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none overflow-hidden">
                  <img src={world.image} alt={world.title} className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-2 bg-white/10 rounded-2xl backdrop-blur-md">
                      {world.icon}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      World 0{world.themeNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                    {world.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    {world.subtitle}
                  </p>

                  <p className="text-xs text-slate-400 mt-3 italic">
                    "{world.curiosityHook}"
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-5 mt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {world.keyConcepts.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-blue-600 flex items-center justify-center text-white transition-colors shrink-0 ml-3">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PersistentAppShell>
  );
};
