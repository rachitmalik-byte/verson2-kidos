import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Map,
  Sparkles,
  Flame,
  Home,
  Layers,
  Coins,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';
import { AudioNavBarControls } from './AudioNavBarControls';
import { ReadingLevelToggle } from '@/components/accessibility/ReadingLevelToggle';
import { AtmosphereHeaderPill } from '@/components/effects/AtmosphereControlWidget';
import { AiScienceLabModal } from '@/components/ai/AiScienceLabModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { sounds } from '@/lib/sounds';

interface PersistentAppShellProps {
  children?: React.ReactNode;
  activeDestination?: 'home' | 'subjects' | 'map' | 'journal' | 'lab';
}

export const PersistentAppShell: React.FC<PersistentAppShellProps> = ({
  children,
  activeDestination,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAiLabModal, setShowAiLabModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);

  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const credits = useProgressStore((state) => state.credits);
  const showAiLabButton = useUiSettingsStore((state) => state.showAiLabButton);

  const totalXP = completedMissions.length * 40 + discoveries.length * 25 + 120;
  const currentStreak = 3 + Math.min(completedMissions.length, 7);

  const navItems = [
    {
      id: 'home',
      label: 'Universe',
      icon: Home,
      path: '/',
      active: activeDestination === 'home' || location.pathname === '/',
    },
    {
      id: 'subjects',
      label: 'Worlds',
      icon: Layers,
      path: '/subjects',
      active: activeDestination === 'subjects' || location.pathname === '/subjects',
    },
    {
      id: 'map',
      label: 'Expedition',
      icon: Map,
      path: '/chapter-hub',
      active:
        activeDestination === 'map' ||
        location.pathname === '/chapter-hub' ||
        location.pathname.startsWith('/theme') ||
        location.pathname.startsWith('/chapter'),
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: BookOpen,
      path: '/discovery-book',
      active:
        activeDestination === 'journal' ||
        location.pathname === '/discovery-book' ||
        location.pathname === '/guidebook',
    },
  ];

  const handleNav = (path: string) => {
    sounds.pop();
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white relative">
      {/* ── Unified Floating Light-Glass Taskbar (Desktop & Tablet) ── */}
      <header className="fixed top-3 inset-x-0 mx-auto max-w-7xl z-50 px-3 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-slate-200/40 rounded-2xl md:rounded-full px-4 sm:px-5 py-2 flex items-center justify-between transition-all gap-2 text-slate-800">
          {/* Left: Brand Identity */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
            title="Kidos Universe Dashboard"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base tracking-tight font-black text-slate-900">
                KIDOS
              </span>
              <span className="text-[10px] font-mono tracking-wider text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full font-bold uppercase">
                Universe
              </span>
            </div>
          </button>

          {/* Center: Core Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/60 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Perfectly Aligned HUD & Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Learning Streak */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0"
              title={`${currentStreak}-day learning streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentStreak}d</span>
            </div>

            {/* Science XP */}
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shrink-0"
              title={`${totalXP} Science XP`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{totalXP}</span>
            </div>

            {/* PolyCredits Badge */}
            <button
              onClick={() => {
                sounds.pop();
                setShowClosetModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-900 text-xs font-bold shrink-0 cursor-pointer transition-colors"
              title={`${credits} PolyCredits • Tap to open Wardrobe`}
            >
              <Coins className="w-3.5 h-3.5 text-yellow-600 animate-bounce" />
              <span className="font-mono">{credits}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />

            {/* Reading Level Accessibility */}
            <div className="hidden md:block shrink-0">
              <ReadingLevelToggle compact={true} />
            </div>

            {/* Integrated Atmosphere Time-of-Day Selector */}
            <AtmosphereHeaderPill />

            {/* AI Science Lab Quick Launcher */}
            {showAiLabButton && (
              <button
                onClick={() => {
                  sounds.sparkle();
                  setShowAiLabModal(true);
                }}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
                title="Open Gemini AI Science Lab"
              >
                <Sparkles className="w-3 h-3 text-amber-200 animate-spin" />
                <span>AI Lab ✨</span>
              </button>
            )}

            {/* Audio Controls & Settings */}
            <AudioNavBarControls showProfile={false} />
          </div>
        </div>
      </header>

      {/* ── Main Canvas Viewport (Comfortably padded for top taskbar) ── */}
      <main className="flex-1 w-full pt-18 sm:pt-20 pb-24 md:pb-12 relative z-10">
        {children}
      </main>

      {/* ── Floating Mobile Bottom Dock ── */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-1.5 flex items-center justify-around text-slate-700">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
                item.active
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Integrated Modal Overlays */}
      <AiScienceLabModal isOpen={showAiLabModal} onClose={() => setShowAiLabModal(false)} />
      <PipClosetModal isOpen={showClosetModal} onClose={() => setShowClosetModal(false)} />
    </div>
  );
};
