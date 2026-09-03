import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import {
  ArrowRight,
  Compass,
  Sparkles,
  FlaskConical,
  Leaf,
  Droplets,
  Home,
  Clock,
  Flame,
} from 'lucide-react';

// Macro Specimen Imagery
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const totalXP = completedMissions.length * 40 + discoveries.length * 25 + 120;
  const streakDays = 3 + Math.min(completedMissions.length, 7);

  const handleLaunch = (path: string) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(path);
  };

  return (
    <PersistentAppShell activeDestination="home">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        {/* ── Top Explorer Greeting & Summary Bar ── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/70 inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Late Elementary STEM • Grade 5</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">CBSE & NCERT Aligned</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Welcome back, Young Explorer 👋
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Your science universe is active. Ready to continue today’s inquiry journey?
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="edtech-card px-4 py-2.5 flex items-center gap-3 bg-white">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block leading-tight">Streak</span>
                <span className="text-sm font-extrabold text-slate-800">{streakDays} Days</span>
              </div>
            </div>

            <div className="edtech-card px-4 py-2.5 flex items-center gap-3 bg-white">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block leading-tight">Total XP</span>
                <span className="text-sm font-extrabold text-slate-800">{totalXP}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hero Stage: Continue Your Journey ── */}
        <section className="w-full edtech-card overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold tracking-wide uppercase border border-emerald-400/30 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Expedition
                </span>
                <span className="text-xs text-slate-400 font-medium">Theme 1 • Super Senses</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  Plants & Living World: Super Senses
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Discover how ant pheromone highways guide trails, how snake jawbones detect ground acoustics, 
                  and how burdock seed hooks inspired the invention of Velcro.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Expedition Progress</span>
                  <span className="font-mono text-emerald-400">4 of 4 Chapters Unlocked</span>
                </div>
                <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-3/4 transition-all duration-700" />
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleLaunch('/theme/1/hub')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>Continue Expedition</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleLaunch('/subjects')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
                >
                  <span>Explore All Subjects</span>
                </button>
              </div>
            </div>

            {/* Specimen Visual Artwork Thumbnail */}
            <div className="w-full md:w-72 shrink-0 flex flex-col gap-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40 aspect-4/3">
                <img
                  src={burdockVelcroImg}
                  alt="Burdock Velcro Macro Specimen"
                  className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-300 font-bold text-[11px]">
                    HOOK RETENTION // 450 N/m
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/60 text-white/90 text-[10px] font-mono">
                    3D Lab
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Today's Missions (4 Meaningful Educational Quests) ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
                Today’s Exploration Quests
              </h2>
              <p className="text-xs text-slate-500">
                Four bite-sized inquiries designed for deep comprehension today.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">EST. TIME: ~20 MIN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quest 1: Learn */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleLaunch('/theme/1/chapter/1')}
              className="edtech-card p-5 cursor-pointer group flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase border border-emerald-200/60">
                    Learn
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 8 min
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base leading-snug">
                  Ant Pheromone Trails
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Simulate sugar trail navigation and test scent path blockage.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Launch Lab</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Quest 2: Explore */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleLaunch('/chapter/3/mission/3')}
              className="edtech-card p-5 cursor-pointer group flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase border border-blue-200/60">
                    Explore
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 5 min
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base leading-snug">
                  Tensile Strength Rig
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Pull test cotton fibers vs nylon ropes under heavy weights.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Start Simulation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Quest 3: Practice */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleLaunch('/mystery-lab')}
              className="edtech-card p-5 cursor-pointer group flex flex-col justify-between hover:border-violet-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-[10px] font-bold tracking-wider uppercase border border-violet-200/60">
                    Practice
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 4 min
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors text-base leading-snug">
                  Mystery Object Scan
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Analyze microscopic fiber structures and identify hidden materials.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
                <span>Open Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Quest 4: Recall */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleLaunch('/discovery-book')}
              className="edtech-card p-5 cursor-pointer group flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold tracking-wider uppercase border border-amber-200/60">
                    Recall
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3 min
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors text-base leading-snug">
                  Field Discovery Journal
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  Review specimen badges and retrieve key scientific definitions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Review Notes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Curriculum Thematic Portals (All 4 Subject Worlds) ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
                Curriculum Exploration Worlds
              </h2>
              <p className="text-xs text-slate-500">
                Choose a domain to start or continue your themed learning expedition.
              </p>
            </div>
            <button
              onClick={() => handleLaunch('/subjects')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* World 1: Plants & Living World */}
            <div
              onClick={() => handleLaunch('/theme/1/hub')}
              className="edtech-card p-5 cursor-pointer group flex items-start gap-4 hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                    THEME 1 • LIVING SYSTEMS
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100/70 text-emerald-800 text-[9px] font-bold">
                    4 Chapters
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base">
                  Plants & Living World: Super Senses
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  ThreeUI Sylva moss canopy, ant scent trails, snake seismic vibration, and Velcro biomimicry.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all mt-1" />
            </div>

            {/* World 2: Synthetic Materials & Inventions */}
            <div
              onClick={() => handleLaunch('/chapter-hub')}
              className="edtech-card p-5 cursor-pointer group flex items-start gap-4 hover:border-blue-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-600 shrink-0">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                    THEME 6 • MATERIALS SCIENCE
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-blue-100/70 text-blue-800 text-[9px] font-bold">
                    13 Missions
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">
                  Materials, Polymers & Inventions
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Hydrophobic raincoat tests, nylon tensile pulling, electric circuits, and plastic molding.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
            </div>

            {/* World 3: Water & Aquatic Wonders */}
            <div
              onClick={() => handleLaunch('/theme/water/hub')}
              className="edtech-card p-5 cursor-pointer group flex items-start gap-4 hover:border-cyan-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200/70 flex items-center justify-center text-cyan-600 shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">
                    THEME 2 • HYDROLOGY
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-cyan-100/70 text-cyan-800 text-[9px] font-bold">
                    4 Chapters
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors text-base">
                  Water & Aquatic Experiments
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Density columns, buoyancy tests, water evaporation cycles, and ancient stepwell conservation.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all mt-1" />
            </div>

            {/* World 4: Shelter & Earth Expeditions */}
            <div
              onClick={() => handleLaunch('/theme/shelter/hub')}
              className="edtech-card p-5 cursor-pointer group flex items-start gap-4 hover:border-purple-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-center text-purple-600 shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-purple-700 uppercase">
                    THEME 5 • ARCHITECTURE & EARTH
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-purple-100/70 text-purple-800 text-[9px] font-bold">
                    5 Chapters
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors text-base">
                  Shelter, Earth & High Altitudes
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Everest atmospheric pressure, pashmina microscope scans, and earthquake-resistant Bhunga dampers.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all mt-1" />
            </div>
          </div>
        </section>
      </div>
    </PersistentAppShell>
  );
};
