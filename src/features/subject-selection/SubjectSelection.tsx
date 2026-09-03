import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PipWardrobeShopModal } from '@/components/wardrobe/PipWardrobeShopModal';
import { VoxelScienceWorldMap } from '@/components/voxel/VoxelScienceWorldMap';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { SylvaLivingGreenCanvas } from '@/components/effects/SylvaLivingGreenCanvas';
import { Pip } from '@/components/pip/Pip';
import {
  Sparkles,
  FlaskConical,
  Leaf,
  Droplets,
  Home,
  ArrowRight,
  Shirt,
  Box,
  CheckCircle2,
} from 'lucide-react';

// Macro Specimen and Biome Imagery
import polyquestHeroBanner from '@/assets/images/showcase/polyquest_hero_banner.jpg';
import kaykitForestBiome from '@/assets/images/nature/kaykit_forest_biome_sample.png';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

interface ScienceWorldPortal {
  id: string;
  name: string;
  tagline: string;
  missionBrief: string;
  icon: React.ReactNode;
  accentGradient: string;
  borderColor: string;
  glowHover: string;
  path: string;
  image: string;
  unlockedMissions: number;
  totalMissions: number;
  curiosityHook: string;
  concepts: string[];
}

const SCIENCE_WORLDS: ScienceWorldPortal[] = [
  {
    id: 'living-world',
    name: 'Living Biosphere & Super Senses',
    tagline: 'Animal Radar, Sensory Organs & Biomimetic Inventions',
    missionBrief: 'Follow invisible ant pheromone superhighways, investigate snake seismic jawbone acoustics, and discover how burdock plant hooks inspired Velcro.',
    icon: <Leaf className="w-6 h-6 text-emerald-400" />,
    accentGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    borderColor: 'border-emerald-500/30',
    glowHover: 'hover:border-emerald-400/60 shadow-emerald-950/40',
    path: '/theme/1/hub',
    image: kaykitForestBiome,
    unlockedMissions: 4,
    totalMissions: 4,
    curiosityHook: 'How can an eagle spot a small mouse from two kilometers above in the sky?',
    concepts: ['Ant Pheromones', 'Seismic Jawbones', 'Burdock Seed Hooks', 'Amylase Starch Lab'],
  },
  {
    id: 'materials-science',
    name: 'Materials Science & Polymers',
    tagline: 'Natural vs. Synthetic Fibres, Molecular Lattices & Hydraulic Rigs',
    missionBrief: 'Step into the material testing laboratory. Crumple cotton versus polyester in the hydraulic press, stretch nylon cords to failure, and inspect microstructures under the electron lens.',
    icon: <FlaskConical className="w-6 h-6 text-blue-400" />,
    accentGradient: 'from-indigo-950 via-slate-900 to-blue-950',
    borderColor: 'border-indigo-500/30',
    glowHover: 'hover:border-blue-400/60 shadow-indigo-950/40',
    path: '/chapter-hub',
    image: polyquestHeroBanner,
    unlockedMissions: 13,
    totalMissions: 13,
    curiosityHook: 'Why does synthetic polyester resist wrinkles while natural cotton creases easily?',
    concepts: ['Polymer Molecular Chains', 'Tensile Break Points', 'Hydrophobic Micropores', 'Thermoplastic Moulding'],
  },
  {
    id: 'water-wonders',
    name: 'Oceans, Density & Hydrosphere',
    tagline: 'Buoyancy Forces, Salinity Gradients & Desert Water Architecture',
    missionBrief: 'Investigate why massive 50,000-ton cargo ships float effortlessly while small iron nails sink. Explore ancient Jaisalmer stepwells and watch water behave without gravity in space.',
    icon: <Droplets className="w-6 h-6 text-cyan-400" />,
    accentGradient: 'from-cyan-950 via-slate-900 to-sky-950',
    borderColor: 'border-cyan-500/30',
    glowHover: 'hover:border-cyan-400/60 shadow-cyan-950/40',
    path: '/theme/water/hub',
    image: burdockVelcroImg,
    unlockedMissions: 4,
    totalMissions: 4,
    curiosityHook: 'How do desert stepwells stay 10 degrees cooler than the scorching summer air outside?',
    concepts: ['Buoyant Force & Displacement', 'Dead Sea Salt Density', 'Water Condensation Cycle', 'Bawri Rain Catchers'],
  },
  {
    id: 'shelter-earth',
    name: 'Extreme Shelters & Habitats',
    tagline: 'High-Altitude Everest Expeditions, Yak Wool & Round Architecture',
    missionBrief: 'Travel with Changpa nomads across freezing Himalayan plateaus at 5,000 meters. Test round Bhunga earthquake dampers and design thermal habitats for outer space.',
    icon: <Home className="w-6 h-6 text-purple-400" />,
    accentGradient: 'from-violet-950 via-slate-900 to-purple-950',
    borderColor: 'border-violet-500/30',
    glowHover: 'hover:border-purple-400/60 shadow-violet-950/40',
    path: '/theme/shelter/hub',
    image: kaykitForestBiome,
    unlockedMissions: 4,
    totalMissions: 4,
    curiosityHook: 'Why do circular houses survive major earthquakes while square buildings crack and collapse?',
    concepts: ['Woven Yak Hair Insulators', 'Atmospheric Barometer Pressure', 'Earthquake Wave Dissipation', 'Orbital Module Seals'],
  },
];

export const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [showVoxelWorld, setShowVoxelWorld] = useState(false);

  const handleSelectWorld = (world: ScienceWorldPortal) => {
    sounds.fanfare();
    voiceAssistant.speak(`Entering ${world.name}. ${world.missionBrief}`);
    navigate(world.path);
  };

  return (
    <PersistentAppShell activeDestination="subjects">
      {/* ── Ambient WebGL Particle Canvas ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <SylvaLivingGreenCanvas enableButterfly={false} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 pt-2 md:pt-4">
        {/* ── CINEMATIC SCIENCE UNIVERSE PORTAL HERO ── */}
        <section className="portal-hero w-full bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 border border-white/15 p-6 sm:p-10 md:p-12 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Radial Atmospheric Lighting */}
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Universe Identity & Overview */}
          <div className="max-w-2xl flex flex-col gap-5 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold tracking-wide w-fit">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>THE INTERACTIVE SCIENCE UNIVERSE</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
                Four Scientific Realms to Investigate
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mt-3 font-normal leading-relaxed">
                Step inside living ecosystems, molecular synthesis laboratories, ocean physics, and high-altitude shelters.
                Every realm features interactive PhET-style simulators, ocular microscope zooms, and real field notes.
              </p>
            </div>

            {/* Quick World Navigation & Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowVoxelWorld(!showVoxelWorld)}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-100 border border-white/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Box className="w-4 h-4 text-cyan-400" />
                <span>{showVoxelWorld ? 'Hide 3D Voxel World' : 'View 3D Voxel World Model'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  setIsWardrobeOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Shirt className="w-4 h-4 text-violet-400" />
                <span>Pip's Outfits</span>
              </button>
            </div>
          </div>

          {/* Right: Pip Research Mentor Terminal */}
          <div className="relative z-10 w-full max-w-sm shrink-0">
            <div className="world-gateway-card bg-slate-900/90 backdrop-blur-md p-6 border border-white/15 flex flex-col items-center text-center gap-3 shadow-2xl">
              <Pip mood="celebrating" size={72} interactive={true} />
              
              <div>
                <h3 className="text-base font-bold text-white">
                  Pip's Research Terminal
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  "Ready to explore, Scientist! Which realm are you curious about today?"
                </p>
              </div>

              <div className="w-full pt-3 mt-1 border-t border-white/10 flex items-center justify-around text-xs font-mono font-bold text-slate-400">
                <span>4 Realms Active</span>
                <span>•</span>
                <span className="text-emerald-400">100% Interactive</span>
              </div>
            </div>
          </div>
        </section>

        {/* Optional 3D Voxel World Preview Canvas */}
        {showVoxelWorld && (
          <section className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Interactive 3D Voxel Exploration World
              </span>
              <button
                onClick={() => setShowVoxelWorld(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close Model ✕
              </button>
            </div>
            <VoxelScienceWorldMap />
          </section>
        )}

        {/* ── THE 4 IMMERSIVE REALM GATEWAYS (FULL-BLEED LANDSCAPES) ── */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-left">
            <div>
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
                Select Your Learning Realm
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Each realm contains dedicated simulators, chapter expedition maps, and specimen field logs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SCIENCE_WORLDS.map((world, idx) => (
              <div
                key={world.id}
                onClick={() => handleSelectWorld(world)}
                className={`world-gateway-card bg-gradient-to-br ${world.accentGradient} border ${world.borderColor} ${world.glowHover} p-6 sm:p-8 flex flex-col justify-between cursor-pointer group shadow-2xl transition-all min-h-[320px] relative overflow-hidden text-left`}
              >
                {/* Background Specimen Image Layer */}
                <div className="absolute -right-6 -bottom-6 w-3/5 h-4/5 opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 pointer-events-none overflow-hidden rounded-2xl">
                  <img src={world.image} alt={world.name} className="w-full h-full object-cover" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                      {world.icon}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                        World 0{idx + 1}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                    {world.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-1">
                    {world.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 mt-3 font-normal leading-relaxed line-clamp-3">
                    {world.missionBrief}
                  </p>

                  <div className="p-3 mt-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                      Curiosity Question:
                    </span>
                    <p className="text-xs text-slate-200 italic font-medium">
                      "{world.curiosityHook}"
                    </p>
                  </div>
                </div>

                {/* Bottom Concepts & Launch CTA */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {world.concepts.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-cyan-300 shrink-0">
                    <span>Enter Learning World</span>
                    <span className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-blue-600 flex items-center justify-center text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Wardrobe Modal */}
      <PipWardrobeShopModal isOpen={isWardrobeOpen} onClose={() => setIsWardrobeOpen(false)} />
    </PersistentAppShell>
  );
};
