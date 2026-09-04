import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
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
      accentColor: 'from-emerald-600 via-teal-600 to-emerald-700',
      borderColor: 'border-emerald-400/40',
      glowColor: 'group-hover:border-emerald-300/80 shadow-emerald-600/20',
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
      accentColor: 'from-indigo-600 via-blue-600 to-indigo-700',
      borderColor: 'border-indigo-400/40',
      glowColor: 'group-hover:border-indigo-300/80 shadow-indigo-600/20',
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
      accentColor: 'from-cyan-600 via-sky-600 to-blue-600',
      borderColor: 'border-cyan-400/40',
      glowColor: 'group-hover:border-cyan-300/80 shadow-cyan-600/20',
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
      accentColor: 'from-violet-600 via-purple-600 to-indigo-700',
      borderColor: 'border-violet-400/40',
      glowColor: 'group-hover:border-violet-300/80 shadow-violet-600/20',
      icon: '🏔️',
      image: kaykitForestBiome,
      curiosityHook: 'How do round Bhunga walls withstand severe earthquakes?',
      keyConcepts: ['Yak Wool Tents', 'Earthquake Resistance', 'Orbital Living'],
      unlocked: true,
    },
  ];

  return (
    <PersistentAppShell activeDestination="home">
      {/* ── Soft Ambient CSS Light Diffusion (Clean & Airy, No Particles) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-200/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 pt-1 sm:pt-2">
        {/* ── EXPEDITION HERO STAGE ── */}
        <section className="portal-hero w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-slate-700/50 p-6 sm:p-10 md:p-12 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl shadow-xl shadow-blue-950/10">
          {/* Subtle luminous highlights */}
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
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                <span>Continue Living World Expedition</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleLaunch('/subjects')}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-100 border border-white/20 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Layers className="w-4 h-4 text-cyan-300" />
                <span>Explore All 4 Worlds</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual World Focal Specimen */}
          <div className="relative z-10 w-full max-w-sm lg:max-w-md shrink-0">
            <div className="specimen-lens relative aspect-video rounded-2xl overflow-hidden border border-white/25 shadow-2xl group">
              <img
                src={polyquestHeroBanner}
                alt="Living World Expedition Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    Interactive World 01
                  </span>
                  <span className="text-xs font-bold text-white">
                    Plants & Animal Super Senses
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TODAY'S DISCOVERY WAYPOINTS (BRIGHT, CRISP CARDS) ── */}
        <section className="flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight">
                Today's Expedition Waypoints
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Hands-on discoveries waiting for you to investigate today
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
              className="bg-white border border-slate-200/90 hover:border-blue-400/80 hover:shadow-xl hover:shadow-blue-500/5 rounded-2xl p-5 text-slate-800 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider block mb-1">
                  Investigation
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Burdock Seed Hooks
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Zoom into tiny plant hooks that inspired the invention of Velcro fasteners.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-500 group-hover:text-blue-600">
                <span>Inspect Micrograph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 2: Hands-on Tensile Rig */}
            <div
              onClick={() => handleLaunch('/chapter/3/mission/4')}
              className="bg-white border border-slate-200/90 hover:border-emerald-400/80 hover:shadow-xl hover:shadow-emerald-500/5 rounded-2xl p-5 text-slate-800 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider block mb-1">
                  Laboratory Test
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Fabric Crumple Rig
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Squeeze cotton and synthetic polyester in the press to compare wrinkle memory.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-500 group-hover:text-emerald-600">
                <span>Enter Laboratory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 3: Spaced Recall Check */}
            <div
              onClick={() => handleLaunch('/chapter-hub')}
              className="bg-white border border-slate-200/90 hover:border-amber-400/80 hover:shadow-xl hover:shadow-amber-500/5 rounded-2xl p-5 text-slate-800 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider block mb-1">
                  Memory Spark
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Pheromone Highway
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Recall how worker ants establish food trails when obstacles appear.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-500 group-hover:text-amber-600">
                <span>Take Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Waypoint 4: Pip AI Science Coach */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Pip mood="curious" size={44} interactive={false} />
                  <div>
                    <span className="text-[10px] font-mono text-violet-600 font-bold uppercase tracking-wider block">
                      Pip's Inquiry
                    </span>
                    <span className="text-xs font-bold text-slate-900">Daily Mystery</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Why does ice float on liquid water when most solids sink in their own liquids?"
                </p>
              </div>

              <button
                onClick={() => handleLaunch('/chapter-hub')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 text-xs font-bold text-center transition-all cursor-pointer active:scale-95"
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
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight">
                Thematic Learning Realms
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Explore nature, chemistry, atmosphere, and space across dedicated realms
              </p>
            </div>

            <button
              onClick={() => handleLaunch('/subjects')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
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
                className={`world-gateway-card bg-gradient-to-br ${world.accentColor} border ${world.borderColor} hover:shadow-2xl transition-all cursor-pointer group p-6 sm:p-7 flex flex-col justify-between min-h-[240px] relative overflow-hidden rounded-3xl shadow-lg`}
              >
                {/* Background Specimen Image Tint */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none overflow-hidden">
                  <img src={world.image} alt={world.title} className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-2 bg-white/15 rounded-2xl backdrop-blur-md">
                      {world.icon}
                    </span>
                    <span className="text-xs font-mono font-bold text-white/80 uppercase">
                      World 0{world.themeNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-white group-hover:text-white/90 transition-colors">
                    {world.title}
                  </h3>
                  <p className="text-xs text-white/85 mt-1 font-medium">
                    {world.subtitle}
                  </p>

                  <p className="text-xs text-white/75 mt-3 italic">
                    "{world.curiosityHook}"
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-5 mt-4 border-t border-white/20">
                  <div className="flex flex-wrap gap-1.5">
                    {world.keyConcepts.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-medium backdrop-blur-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white group-hover:text-slate-900 flex items-center justify-center text-white transition-colors shrink-0 ml-3">
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
