import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  BookOpen,
  Map,
  Sparkles,
  Flame,
  Home,
  Layers,
  Coins,
  Moon,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';
import { useEnvironmentStore, TimeOfDay } from '@/stores/environmentStore';
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
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  useEffect(() => {
    document.documentElement.setAttribute('data-atmosphere', timeOfDay);
  }, [timeOfDay]);

  // Deterministic stable starfield for night atmosphere
  const nightStars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      top: `${(i * 17 + 5) % 94}%`,
      left: `${(i * 23 + 7) % 96}%`,
      size: (i % 3) === 0 ? 3 : (i % 2) === 0 ? 2 : 1.5,
      delay: (i % 5) * 0.5,
      duration: 2 + (i % 4) * 0.8,
    }));
  }, []);

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

  // Atmosphere dynamic styling maps
  const atmosphereStyles = {
    day: {
      container: 'bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white',
      taskbar: 'bg-white/90 border-slate-200/90 shadow-md shadow-slate-200/40 text-slate-800',
      brandText: 'text-slate-900',
      brandPill: 'text-teal-700 bg-teal-50 border-teal-200/60',
      navContainer: 'bg-slate-100/90 border-slate-200/60',
      navActive: 'bg-white text-teal-700 shadow-xs',
      navInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/50',
      streakPill: 'bg-amber-50 border-amber-200 text-amber-900',
      xpPill: 'bg-teal-50 border-teal-200 text-teal-900',
      mobileNav: 'bg-white/95 border-slate-200 text-slate-700',
    },
    sunset: {
      container: 'bg-gradient-to-b from-[#FFF5EB] via-[#FDF2E9] to-[#F7EBE1] text-amber-950 selection:bg-amber-600 selection:text-white',
      taskbar: 'bg-white/92 border-amber-200/80 shadow-md shadow-amber-900/10 text-amber-950',
      brandText: 'text-amber-950',
      brandPill: 'text-amber-800 bg-amber-50 border-amber-200/60',
      navContainer: 'bg-amber-100/70 border-amber-200/60',
      navActive: 'bg-white text-amber-800 shadow-xs',
      navInactive: 'text-amber-900/70 hover:text-amber-950 hover:bg-white/50',
      streakPill: 'bg-amber-100 border-amber-300 text-amber-950',
      xpPill: 'bg-orange-50 border-orange-200 text-orange-950',
      mobileNav: 'bg-white/95 border-amber-200 text-amber-950',
    },
    night: {
      container: 'bg-[#090D16] text-slate-100 selection:bg-teal-400 selection:text-slate-950',
      taskbar: 'bg-slate-900/90 border-slate-700/80 shadow-xl shadow-black/50 text-slate-100',
      brandText: 'text-white',
      brandPill: 'text-teal-300 bg-teal-950/80 border-teal-500/40',
      navContainer: 'bg-slate-800/80 border-slate-700/60',
      navActive: 'bg-slate-800 text-teal-300 shadow-xs',
      navInactive: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
      streakPill: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      xpPill: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
      mobileNav: 'bg-slate-900/95 border-slate-700 text-slate-200',
    },
    rain: {
      container: 'bg-[#EDF2F7] text-slate-900 selection:bg-sky-500 selection:text-white',
      taskbar: 'bg-white/92 border-sky-200/80 shadow-md shadow-sky-900/10 text-slate-800',
      brandText: 'text-slate-900',
      brandPill: 'text-sky-700 bg-sky-50 border-sky-200/60',
      navContainer: 'bg-sky-50/80 border-sky-200/60',
      navActive: 'bg-white text-sky-700 shadow-xs',
      navInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/50',
      streakPill: 'bg-amber-50 border-amber-200 text-amber-900',
      xpPill: 'bg-sky-50 border-sky-200 text-sky-900',
      mobileNav: 'bg-white/95 border-sky-200 text-slate-800',
    },
  }[timeOfDay] || {
    container: 'bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white',
    taskbar: 'bg-white/90 border-slate-200/90 shadow-md shadow-slate-200/40 text-slate-800',
    brandText: 'text-slate-900',
    brandPill: 'text-teal-700 bg-teal-50 border-teal-200/60',
    navContainer: 'bg-slate-100/90 border-slate-200/60',
    navActive: 'bg-white text-teal-700 shadow-xs',
    navInactive: 'text-slate-600 hover:text-slate-900 hover:bg-white/50',
    streakPill: 'bg-amber-50 border-amber-200 text-amber-900',
    xpPill: 'bg-teal-50 border-teal-200 text-teal-900',
    mobileNav: 'bg-white/95 border-slate-200 text-slate-700',
  };

  return (
    <div
      data-atmosphere={timeOfDay}
      className={`min-h-screen w-full flex flex-col transition-colors duration-700 relative overflow-x-hidden ${atmosphereStyles.container}`}
    >
      {/* ── Dynamic Atmospheric Background Layer (Transitions smoothly) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="wait">
          {timeOfDay === 'day' && (
            <motion.div
              key="day-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <div className="w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-amber-300/20 via-amber-200/15 to-transparent blur-3xl absolute -top-20 -right-20" />
              <div className="w-[480px] h-[480px] rounded-full bg-gradient-to-br from-teal-400/15 via-emerald-300/10 to-transparent blur-3xl absolute top-1/3 -left-20" />
            </motion.div>
          )}

          {timeOfDay === 'sunset' && (
            <motion.div
              key="sunset-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <div className="w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/25 to-orange-400/20 blur-3xl absolute -top-32 right-0" />
              <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-400/10 to-transparent blur-3xl absolute bottom-0 -left-10" />
            </motion.div>
          )}

          {timeOfDay === 'night' && (
            <motion.div
              key="night-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              {/* Soft lunar glow halo */}
              <div className="w-[500px] h-[500px] rounded-full bg-cyan-200/10 blur-3xl absolute -top-20 right-20" />
              <div className="w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl absolute bottom-0 left-0" />

              {/* Shimmering Starfield */}
              {nightStars.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.2, 0.85, 0.2] }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                    ease: 'easeInOut',
                  }}
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size,
                    height: star.size,
                  }}
                  className="absolute rounded-full bg-white shadow-[0_0_6px_#fff]"
                />
              ))}
            </motion.div>
          )}

          {timeOfDay === 'rain' && (
            <motion.div
              key="rain-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <div className="w-[600px] h-[600px] rounded-full bg-sky-400/15 blur-3xl absolute -top-20 right-1/4" />
              <div className="w-[500px] h-[500px] rounded-full bg-slate-400/15 blur-3xl absolute bottom-0 left-1/4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Unified Floating Glass Taskbar (Desktop & Tablet) ── */}
      <header className="fixed top-3 inset-x-0 mx-auto max-w-7xl z-50 px-3 sm:px-6 pointer-events-none">
        <div className={`pointer-events-auto backdrop-blur-xl border rounded-2xl md:rounded-full px-4 sm:px-5 py-2 flex items-center justify-between transition-all duration-500 gap-2 ${atmosphereStyles.taskbar}`}>
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
              <span className={`font-display text-base tracking-tight font-black transition-colors ${atmosphereStyles.brandText}`}>
                KIDOS
              </span>
              <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full font-bold uppercase transition-colors ${atmosphereStyles.brandPill}`}>
                Universe
              </span>
            </div>
          </button>

          {/* Center: Core Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all ${atmosphereStyles.navContainer}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    item.active
                      ? atmosphereStyles.navActive
                      : atmosphereStyles.navInactive
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${atmosphereStyles.streakPill}`}
              title={`${currentStreak}-day learning streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentStreak}d</span>
            </div>

            {/* Science XP */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${atmosphereStyles.xpPill}`}
              title={`${totalXP} Science XP`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>{totalXP}</span>
            </div>

            {/* PolyCredits Badge */}
            <button
              onClick={() => {
                sounds.pop();
                setShowClosetModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0 cursor-pointer transition-colors"
              title={`${credits} PolyCredits • Tap to open Wardrobe`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span className="font-mono font-black">{credits}</span>
            </button>

            <div className="h-4 w-px bg-slate-200/60 dark:bg-slate-700/60 shrink-0 hidden sm:block" />

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
      <nav className={`md:hidden fixed bottom-4 inset-x-4 z-50 backdrop-blur-xl border rounded-2xl p-1.5 flex items-center justify-around transition-all ${atmosphereStyles.mobileNav}`}>
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

