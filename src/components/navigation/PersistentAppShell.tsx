import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Map,
  Sparkles,
  Flame,
  Home,
  Layers,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { AudioNavBarControls } from './AudioNavBarControls';
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

  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

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
      active: activeDestination === 'map' || location.pathname === '/chapter-hub',
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: BookOpen,
      path: '/discovery-book',
      active: activeDestination === 'journal' || location.pathname === '/discovery-book',
    },
  ];

  const handleNav = (path: string) => {
    sounds.pop();
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-blue-600 selection:text-white relative">
      {/* ── Cinematic Floating Glass Island Dock (Desktop / Tablet) ── */}
      <header className="fixed top-4 inset-x-0 mx-auto max-w-4xl z-50 px-4 hidden md:block pointer-events-none">
        <div className="world-glass-dock px-5 py-2.5 rounded-full flex items-center justify-between text-white shadow-2xl pointer-events-auto">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
            title="Kidos Universe Dashboard"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base tracking-tight font-extrabold text-white">
                KIDOS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                UNIVERSE
              </span>
            </div>
          </button>

          {/* Core Navigation Links */}
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status HUD & Audio */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold"
                title={`${currentStreak}-day learning streak`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentStreak}d</span>
              </div>

              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold"
                title={`${totalXP} Science XP`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{totalXP}</span>
              </div>
            </div>

            <div className="h-4 w-px bg-white/15" />

            <AudioNavBarControls showProfile={false} />
          </div>
        </div>
      </header>

      {/* ── Main Canvas Viewport (Padded for floating dock) ── */}
      <main className="flex-1 w-full pt-4 md:pt-20 pb-24 md:pb-12 relative z-10">
        {children}
      </main>

      {/* ── Floating Mobile Bottom Dock ── */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50 world-glass-dock rounded-2xl p-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
                item.active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
