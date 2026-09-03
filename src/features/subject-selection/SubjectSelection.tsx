import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PipWardrobeShopModal } from '@/components/wardrobe/PipWardrobeShopModal';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';
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
  Shirt,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';

interface Subject {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
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
    icon: <FlaskConical className="w-8 h-8 text-[#EA580C]" />,
    badgeBg: 'bg-[#FFF7ED]',
    badgeBorder: 'border-[#FED7AA]',
    badgeText: 'text-[#9A3412]',
    iconBg: 'bg-[#FFEDD5]',
    active: true,
    chapterCount: 5,
    unlockedChapters: 13,
    path: '/intro/materials',
    syllabusCode: 'CBSE EVS Class 5 • Theme 6',
  },
  {
    id: 'living-world',
    name: 'Plants & Living World: Super Senses',
    subtitle: 'Plant Adaptations, Botanical Inventions, Seeds & Sensory Biomes (CBSE EVS)',
    icon: <Leaf className="w-8 h-8 text-[#10B981]" />,
    badgeBg: 'bg-[#062014]',
    badgeBorder: 'border-[#34D399]/40',
    badgeText: 'text-[#6EE7B7]',
    iconBg: 'bg-[#0d2a1b]',
    active: true,
    chapterCount: 4,
    unlockedChapters: 4,
    path: '/theme/1/hub',
    syllabusCode: 'CBSE EVS Class 5 • Theme 1',
  },
  {
    id: 'water-wonders',
    name: 'Water & Aquatic Experiments',
    subtitle: 'Floating & Sinking, Water Cycle & Preservation (CBSE EVS)',
    icon: <Droplets className="w-8 h-8 text-[#0284C7]" />,
    badgeBg: 'bg-[#F0F9FF]',
    badgeBorder: 'border-[#BAE6FD]',
    badgeText: 'text-[#075985]',
    iconBg: 'bg-[#E0F2FE]',
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
    icon: <Home className="w-8 h-8 text-[#7C3AED]" />,
    badgeBg: 'bg-[#F5F3FF]',
    badgeBorder: 'border-[#DDD6FE]',
    badgeText: 'text-[#5B21B6]',
    iconBg: 'bg-[#EDE9FE]',
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
    icon: <Utensils className="w-8 h-8 text-[#D97706]" />,
    badgeBg: 'bg-[#FEFCE8]',
    badgeBorder: 'border-[#FEF08A]',
    badgeText: 'text-[#854D0E]',
    iconBg: 'bg-[#FEF9C3]',
    active: false,
    chapterCount: 4,
    unlockedChapters: 0,
    syllabusCode: 'CBSE EVS Class 5 • Theme 2',
  },
  {
    id: 'energy-resources',
    name: 'Fuels & Clean Energy',
    subtitle: 'What If It Finishes? Energy, Solar & Conservation (CBSE EVS)',
    icon: <Zap className="w-8 h-8 text-[#E11D48]" />,
    badgeBg: 'bg-[#FFF1F2]',
    badgeBorder: 'border-[#FECDD3]',
    badgeText: 'text-[#9F1239]',
    iconBg: 'bg-[#FFE4E6]',
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
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#262930] flex flex-col justify-between pt-5 pb-14 px-4 sm:px-6 md:px-8 font-sans select-none">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        {/* Top Navbar */}
        <div className="flex items-center justify-between squircle-card p-3 sm:p-4 shadow-soft-card">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/chapter-hub');
            }}
            className="flex items-center gap-3 cursor-pointer text-left hover:opacity-85 transition-opacity active:scale-98"
            title="Go to Chapter Hub"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#262930] fill-[#262930]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-[#262930] leading-none">
                KIDOS <span className="font-normal text-[#7E8494] text-xs">• Class 5 EVS</span>
              </h1>
              <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block mt-0.5">
                Environmental Studies Curriculum
              </span>
            </div>
          </button>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* Mascot Banner (Sparky Warm Welcome) */}
        <div id="subject-intro-banner" className="squircle-card p-5 sm:p-6 md:p-7 shadow-soft-card flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEF9C3]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center gap-2 relative z-10 shrink-0">
            <SparkyMascot mood="welcoming" size={120} animate />
            <button
              onClick={() => setIsWardrobeOpen(true)}
              className="pill-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
            >
              <Shirt className="w-3.5 h-3.5 text-[#5A6072]" />
              <span>Wardrobe</span>
            </button>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <span className="px-3 py-1 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] rounded-full text-xs font-extrabold uppercase tracking-wide inline-block mb-2">
              CBSE Class 5 EVS Curriculum Hub 🌿
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#262930] tracking-tight">
              Class 5 Science Exploration Academy
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6072] font-medium mt-1.5 leading-relaxed max-w-xl">
              Step into interactive storybooks, hands-on digital experiments, and scientific field investigations designed with care to make learning easy, calm, and memorable.
            </p>
          </div>
        </div>

        {/* View Switcher: High-Contrast Pill Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3 squircle-card p-2.5 sm:p-3 shadow-soft-card">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold text-[#262930]">View:</span>
            <div className="flex items-center gap-1 bg-[#F1EFEA] p-1 rounded-full border border-slate-200/80">
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('3d-voxel');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === '3d-voxel'
                    ? 'bg-[#262930] text-white shadow-soft-pill'
                    : 'text-[#5A6072] hover:text-[#262930]'
                }`}
              >
                <span>🏝️ 3D Voxel World</span>
              </button>
              <button
                onClick={() => {
                  sounds.pop();
                  setViewMode('grid');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-[#262930] text-white shadow-soft-pill'
                    : 'text-[#5A6072] hover:text-[#262930]'
                }`}
              >
                <span>🗂️ Subject Cards Grid</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] font-medium text-[#7E8494] hidden sm:inline">
            Curriculum aligned with NCERT Environmental Studies
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
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubjectClick(sub)}
                className={`squircle-card p-5 sm:p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden transition-all ${
                  sub.id === 'living-world'
                    ? 'border-[#34D399]/40 shadow-[0_8px_30px_rgba(16,185,129,0.12)] hover:border-[#34D399]'
                    : sub.active
                    ? 'hover:border-slate-300 shadow-soft-card'
                    : 'opacity-70 hover:opacity-85 bg-[#FAF8F5]/80'
                }`}
              >
                {/* Header: Icon & Pastel Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${sub.iconBg} flex items-center justify-center shadow-xs`}>
                      {sub.icon}
                    </div>
                    {sub.id === 'living-world' ? (
                      <span className="sylva-radar-pill text-[10px] py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                        <span>SYLVA LIVING BIOME</span>
                      </span>
                    ) : sub.active ? (
                      <span className={`px-3 py-1 ${sub.badgeBg} ${sub.badgeBorder} border ${sub.badgeText} rounded-full text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3" />
                        <span>Active Course</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Coming Soon</span>
                      </span>
                    )}
                  </div>

                  {/* Subject Title & Subtitle */}
                  <div className="space-y-1 mb-5">
                    <span className="text-[10px] font-bold text-[#7E8494] uppercase tracking-wider block">
                      {sub.syllabusCode}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#262930] leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-[#5A6072] font-medium leading-relaxed mt-1">
                      {sub.subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer: Progress & Pill CTA */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  {sub.active ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#262930]">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        <span>
                          {sub.id === 'things-we-make'
                            ? `${completedMissions.length}/13 Missions Done`
                            : `${sub.chapterCount} Chapters`}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#262930] text-white flex items-center justify-center shadow-soft-pill group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-[#7E8494]">
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
    </div>
  );
};

