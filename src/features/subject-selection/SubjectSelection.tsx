import { PipWardrobeShopModal } from '@/components/wardrobe/PipWardrobeShopModal';
import { Shirt } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { VoxelScienceWorldMap } from '@/components/voxel/VoxelScienceWorldMap';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  Sparkles,
  FlaskConical,
  Zap,
  Leaf,
  Droplets,
  Home,
  Utensils,
  Lock,
  ArrowRight,
  Star,
  BookOpen,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';

interface Subject {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  active: boolean;
  chapterCount: number;
  unlockedChapters: number;
  path?: string;
  syllabusCode: string;
}

const SUBJECTS: Subject[] = [
  {
    id: 'things-we-make',
    name: 'Things We Make & Do: Materials',
    subtitle: 'Natural vs Synthetic Materials, Fibres & Plastics (EVS Chapter 3)',
    icon: <FlaskConical className="w-10 h-10 text-amber-500" />,
    color: 'from-amber-400/20 via-orange-400/10 to-amber-500/20',
    border: 'border-amber-400 hover:border-amber-500',
    active: true,
    chapterCount: 5,
    unlockedChapters: 13,
    path: '/intro/materials',
    syllabusCode: 'CBSE EVS Class 5 • Theme 6',
  },
  {
    id: 'living-world',
    name: 'Super Senses & Living World',
    subtitle: 'Animals, Plant Senses, Seeds & Adaptations (CBSE EVS)',
    icon: <Leaf className="w-10 h-10 text-emerald-500" />,
    color: 'from-emerald-400/20 via-teal-400/10 to-emerald-500/20',
    border: 'border-emerald-400 hover:border-emerald-500',
    active: true,
    chapterCount: 4,
    unlockedChapters: 4,
    path: '/intro/senses',
    syllabusCode: 'CBSE EVS Class 5 • Theme 1',
  },
  {
    id: 'water-wonders',
    name: 'Water & Aquatic Experiments',
    subtitle: 'Floating & Sinking, Water Cycle & Preservation (CBSE EVS)',
    icon: <Droplets className="w-10 h-10 text-sky-500" />,
    color: 'from-sky-400/20 via-blue-400/10 to-sky-500/20',
    border: 'border-sky-400 hover:border-sky-500',
    active: true,
    chapterCount: 4,
    unlockedChapters: 4,
    path: '/intro/water',
    syllabusCode: 'CBSE EVS Class 5 • Theme 2 & 4',
  },
  {
    id: 'shelter-earth',
    name: 'Shelter, Mountains & Earth',
    subtitle: 'Habitats, High Altitudes & Travel Expeditions (CBSE EVS)',
    icon: <Home className="w-10 h-10 text-indigo-500" />,
    color: 'from-indigo-400/20 via-sky-400/10 to-indigo-500/20',
    border: 'border-indigo-400 hover:border-indigo-500',
    active: true,
    chapterCount: 5,
    unlockedChapters: 5,
    path: '/intro/shelter',
    syllabusCode: 'CBSE EVS Class 5 • Theme 3 & 5',
  },
  {
    id: 'food-nutrition',
    name: 'Food, Seeds & Farming',
    subtitle: 'Digestion, Spoilage, Crops & Preservation (CBSE EVS)',
    icon: <Utensils className="w-10 h-10 text-orange-500" />,
    color: 'from-orange-400/10 to-amber-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 4,
    unlockedChapters: 0,
    syllabusCode: 'CBSE EVS Class 5 • Theme 2',
  },
  {
    id: 'energy-resources',
    name: 'Fuels & Clean Energy',
    subtitle: 'What If It Finishes? Energy, Solar & Conservation (CBSE EVS)',
    icon: <Zap className="w-10 h-10 text-rose-500" />,
    color: 'from-rose-400/10 to-pink-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 3,
    unlockedChapters: 0,
    syllabusCode: 'CBSE EVS Class 5 • Theme 6',
  },
];

export const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d-voxel' | 'grid'>('grid');
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleSubjectClick = (subject: Subject) => {
    sounds.pop();
    if (subject.active && subject.path) {
      voiceAssistant.stop();
      navigate(subject.path);
    } else {
      sounds.boing();
      voiceAssistant.speak(`${subject.name} is aligned with CBSE Class 5 EVS and is launching in the next curriculum update!`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-50 to-amber-100 flex flex-col justify-between pt-6 pb-16 px-4 md:px-8 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 rounded-2xl shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 leading-none">POLYQUEST</h1>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                CBSE Class 5 EVS • Environmental Studies
              </span>
            </div>
          </div>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* Mascot Banner */}
        <div id="subject-intro-banner" className="bg-white/95 rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Pip mood="idle" size="lg" onOpenWardrobe={() => setIsWardrobeOpen(true)} />
            <button onClick={() => setIsWardrobeOpen(true)} className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer">
              <Shirt className="w-3.5 h-3.5" />
              <span>Dressing Room 🥼</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-2">
              CBSE Class 5 EVS Curriculum Hub 🌿
            </span>
            <h2
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Welcome to Class 5 EVS Science Academy! 🔬
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-bold mt-1.5 leading-relaxed">
              Explore hands-on interactive storybooks, tactile experiments, and field journals based on the NCERT Class 5 EVS (Environmental Studies) syllabus!
            </p>
          </div>
        </div>

        {/* View Switcher: 3D Voxel World Map vs Grid */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800">Select View:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('3d-voxel');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === '3d-voxel'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏝️ 3D Voxel World Map</span>
              </button>
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('grid');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗂️ Subject Cards Grid</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            Drag in 3D to spin science islands in 360°
          </span>
        </div>

        {/* 3D Voxel World Map or Grid View */}
        {viewMode === '3d-voxel' ? (
          <VoxelScienceWorldMap />
        ) : (
          <div id="subject-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECTS.map((sub) => (
            <motion.div
              key={sub.id}
              id={sub.id === 'chemistry' ? 'subject-chem-card' : undefined}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSubjectClick(sub)}
              className={`p-6 rounded-3xl border-4 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden bg-white ${
                sub.active
                  ? `${sub.border} shadow-xl hover:shadow-2xl ring-4 ring-amber-300/50`
                  : 'border-slate-200 opacity-75 hover:opacity-90 shadow-sm'
              }`}
            >
              {/* Active / Locked Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                  {sub.icon}
                </div>
                {sub.active ? (
                  <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Active Course</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 border border-slate-300 text-slate-500 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Coming Soon</span>
                  </span>
                )}
              </div>

              {/* Subject Title & Description */}
              <div className="space-y-1.5 mb-6">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide block">
                  {sub.syllabusCode}
                </span>
                <h3
                  className="text-xl md:text-2xl font-black text-slate-900"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {sub.name}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-snug">
                  {sub.subtitle}
                </p>
              </div>

              {/* Bottom Course Progress / CTA */}
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                {sub.active ? (
                  <>
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-950 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>
                        {sub.id === 'things-we-make'
                          ? `${completedMissions.length} / 13 Missions Complete`
                          : `${sub.chapterCount} Interactive Chapters`}
                      </span>
                    </div>
                    <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md">
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </>
                ) : (
                  <span className="text-xs font-black text-slate-400">
                    {sub.chapterCount} Chapters in Development
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
      <PipWardrobeShopModal isOpen={isWardrobeOpen} onClose={() => setIsWardrobeOpen(false)} />
    </div>
  );
}
