import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Map,
  Sparkles,
  Flame,
  Shield,
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
      label: 'Dashboard',
      icon: Home,
      path: '/',
      active: activeDestination === 'home' || location.pathname === '/',
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: Layers,
      path: '/subjects',
      active: activeDestination === 'subjects' || location.pathname === '/subjects',
    },
    {
      id: 'map',
      label: 'Expedition Map',
      icon: Map,
      path: '/chapter-hub',
      active: activeDestination === 'map' || location.pathname === '/chapter-hub',
    },
    {
      id: 'journal',
      label: 'Field Journal',
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
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* ── Persistent Desktop & Tablet Top Navigation Header ── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
              title="Kidos Universe Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg tracking-tight font-extrabold text-slate-900 leading-none">
                    KIDOS
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-bold tracking-wider uppercase border border-blue-200/60">
                    v2.0
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wide">
                  Learning Universe
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.active
                        ? 'bg-blue-50 text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Gamification Status & Utility Controls */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{currentStreak}d Streak</span>
            </div>

            {/* Total XP Score */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/70 text-blue-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{totalXP} XP</span>
            </div>

            {/* Audio Controls */}
            <div className="hidden md:flex items-center border-l border-slate-200 pl-3">
              <AudioNavBarControls />
            </div>

            {/* Parent Portal Link */}
            <button
              onClick={() => handleNav('/parent/pin')}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Parent & Educator Settings"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Slot */}
      <main className="flex-1 w-full pb-18 md:pb-6">{children}</main>

      {/* ── Mobile Bottom Navigation Dock ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
                item.active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
