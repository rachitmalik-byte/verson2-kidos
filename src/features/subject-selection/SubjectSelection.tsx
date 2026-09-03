import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PipWardrobeShopModal } from '@/components/wardrobe/PipWardrobeShopModal';
import { VoxelScienceWorldMap } from '@/components/voxel/VoxelScienceWorldMap';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { Pip } from '@/components/pip/Pip';
import {
  Sparkles,
  FlaskConical,
  Leaf,
  Droplets,
  Home,
  Utensils,
  Lock,
  ArrowRight,
  Shirt,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';

interface Subject {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  active: boolean;
  chapterCount: number;
  unlockedChapters: number;
  path?: string;
  syllabusCode: string;
  keyConcepts: string[];
}

const SUBJECTS: Subject[] = [
  {
    id: 'things-we-make',
    name: 'Materials, Polymers & Inventions',
    subtitle: 'Natural vs. Synthetic Fibres, Hydrophobic Tests, Tensile Rig & Circuits',
    icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
    themeColor: 'blue',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200/80',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-50 border border-blue-200/60',
    active: true,
    chapterCount: 5,
    unlockedChapters: 13,
    path: '/chapter-hub',
    syllabusCode: 'CBSE EVS • Theme 6 (Chapter 3)',
    keyConcepts: ['Hydrophobic Pores', 'Nylon Tensile', 'PVC Insulators', 'Molding'],
  },
  {
    id: 'living-world',
    name: 'Plants & Living World: Super Senses',
    subtitle: 'Sylva Living Green 3D World, Ant Pheromones, Snake Hearing & Velcro',
    icon: <Leaf className="w-6 h-6 text-emerald-600" />,
    themeColor: 'emerald',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200/80',
    badgeText: 'text-emerald-800',
    iconBg: 'bg-emerald-50 border border-emerald-200/60',
    active: true,
    chapterCount: 4,
    unlockedChapters: 4,
    path: '/theme/1/hub',
    syllabusCode: 'CBSE EVS • Theme 1',
    keyConcepts: ['Pheromone Matrix', 'Seismic Jawbone', 'Amylase Starch', 'Velcro Hooks'],
  },
  {
    id: 'water-wonders',
    name: 'Water & Aquatic Experiments',
    subtitle: 'Floating & Sinking, Density Columns, Water Cycle & Ancient Stepwells',
    icon: <Droplets className="w-6 h-6 text-cyan-600" />,
    themeColor: 'cyan',
    badgeBg: 'bg-cyan-50',
    badgeBorder: 'border-cyan-200/80',
    badgeText: 'text-cyan-800',
    iconBg: 'bg-cyan-50 border border-cyan-200/60',
    active: true,
    chapterCount: 4,
    unlockedChapters: 4,
    path: '/theme/water/hub',
    syllabusCode: 'CBSE EVS • Theme 2 & 4',
    keyConcepts: ['Buoyancy Force', 'Evaporation', 'Salinity Density', 'Bawri Wells'],
  },
  {
    id: 'shelter-earth',
    name: 'Shelter, Mountains & Earth',
    subtitle: 'High Altitude Everest Barometers, Pashmina Wool & Earthquake Dampers',
    icon: <Home className="w-6 h-6 text-purple-600" />,
    themeColor: 'purple',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200/80',
    badgeText: 'text-purple-800',
    iconBg: 'bg-purple-50 border border-purple-200/60',
    active: true,
    chapterCount: 5,
    unlockedChapters: 5,
    path: '/theme/shelter/hub',
    syllabusCode: 'CBSE EVS • Theme 3 & 5',
    keyConcepts: ['Atmospheric Barometer', 'Pashmina Micro-Fibers', 'Bhunga Dampers'],
  },
  {
    id: 'food-nutrition',
    name: 'Food, Seeds & Farming',
    subtitle: 'Digestion Enzymes, Spoilage Chemistry & Seed Germination Mechanics',
    icon: <Utensils className="w-6 h-6 text-amber-600" />,
    themeColor: 'amber',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200/80',
    badgeText: 'text-amber-800',
    iconBg: 'bg-amber-50 border border-amber-200/60',
    active: false,
    chapterCount: 4,
    unlockedChapters: 0,
    syllabusCode: 'CBSE EVS • Theme 2 (Food)',
    keyConcepts: ['Digestive Enzymes', 'Spore Preservation', 'Sprouting Seeds'],
  },
];

export const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d-voxel' | 'grid'>('grid');
  const completedMissions = useProgressStore((state) => state.completedMissions);

  const handleSubjectClick = (subject: Subject) => {
    sounds.pop();
    if (subject.active && subject.path) {
      voiceAssistant.stop();
      navigate(subject.path);
    } else {
      sounds.boing();
      voiceAssistant.speak(
        `${subject.name} is aligned with CBSE Class 5 EVS and is releasing in the upcoming curriculum expansion!`
      );
    }
  };

  return (
    <PersistentAppShell activeDestination="subjects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* ── Explorer Portal Header & Calm Pip Mascot Welcome ── */}
        <section className="edtech-card p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 bg-white relative overflow-hidden">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/70 inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>NCERT & CBSE Environmental Studies</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Grade 5 Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Science Exploration Academy
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Step into interactive virtual laboratories, biophilic 3D ecosystems, and physical inquiry sandboxes 
              engineered to make scientific concepts intuitive, tactile, and memorable.
            </p>
          </div>

          {/* Calm Mascot Companion */}
          <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <Pip mood="idle" size="sm" interactive={false} />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-700">Pip AI Companion</span>
              <button
                onClick={() => setIsWardrobeOpen(true)}
                className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Shirt className="w-3.5 h-3.5 text-slate-500" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── View Switcher: Interactive 3D World vs Grid ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700">Display View:</span>
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('grid');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Subject Portals Grid</span>
              </button>
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('3d-voxel');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '3d-voxel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>3D Voxel World Map</span>
              </button>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            4 ACTIVE SCIENCE BIOMES
          </span>
        </div>

        {/* ── 3D Voxel World Map OR Grid View ── */}
        {viewMode === '3d-voxel' ? (
          <div className="edtech-card overflow-hidden p-2">
            <VoxelScienceWorldMap />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SUBJECTS.map((sub) => (
              <motion.div
                key={sub.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSubjectClick(sub)}
                className={`edtech-card p-6 flex flex-col justify-between transition-all cursor-pointer group ${
                  sub.active
                    ? 'hover:border-slate-300'
                    : 'opacity-65 hover:opacity-80 bg-slate-50/80 cursor-not-allowed'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Status Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${sub.iconBg} flex items-center justify-center`}>
                      {sub.icon}
                    </div>

                    {sub.id === 'living-world' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>THREEUI LIVING BIOME</span>
                      </span>
                    ) : sub.active ? (
                      <span className={`px-2.5 py-1 ${sub.badgeBg} ${sub.badgeBorder} border ${sub.badgeText} rounded-full text-[11px] font-bold flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3" />
                        <span>Active Course</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-[11px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Coming Soon</span>
                      </span>
                    )}
                  </div>

                  {/* Syllabus Tag & Title */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {sub.syllabusCode}
                    </span>
                    <h2 className="text-xl font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {sub.name}
                    </h2>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      {sub.subtitle}
                    </p>
                  </div>

                  {/* Key Concepts Tags */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {sub.keyConcepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/60"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Progress Count & Launch Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {sub.active ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          {sub.id === 'things-we-make'
                            ? `${completedMissions.length}/13 Missions Completed`
                            : `${sub.chapterCount} Chapters Available`}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Enter Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      {sub.chapterCount} Chapters Planned
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PipWardrobeShopModal isOpen={isWardrobeOpen} onClose={() => setIsWardrobeOpen(false)} />
    </PersistentAppShell>
  );
};
