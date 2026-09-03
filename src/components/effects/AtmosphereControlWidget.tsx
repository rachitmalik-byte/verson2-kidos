import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEnvironmentStore, TimeOfDay } from '@/stores/environmentStore';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sun, Moon, Sunset, CloudRain, Sparkles } from 'lucide-react';

const ATMOSPHERE_MODES: { id: TimeOfDay; label: string; icon: string; bg: string }[] = [
  { id: 'day', label: 'Day (Sun ☀️)', icon: '☀️', bg: 'hover:bg-amber-100 text-amber-900' },
  { id: 'night', label: 'Night (Moon 🌙)', icon: '🌙', bg: 'hover:bg-indigo-900 text-indigo-200' },
  { id: 'sunset', label: 'Sunset (Dusk 🌅)', icon: '🌅', bg: 'hover:bg-rose-100 text-rose-900' },
  { id: 'rain', label: 'Rain (Storm 🌧️)', icon: '🌧️', bg: 'hover:bg-sky-100 text-sky-900' },
];

// Only display the atmosphere time-of-day widget on global exploration hubs and worlds
// where environmental lighting and skies actually react to it.
const ALLOWED_ATMOSPHERE_PATHS = [
  '/',
  '/subjects',
  '/chapter-hub',
  '/theme/1/hub',
  '/theme/water/hub',
  '/theme/shelter/hub',
];

export const AtmosphereControlWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);
  const setTimeOfDay = useEnvironmentStore((state) => state.setTimeOfDay);
  const isLivePipOpen = useUiSettingsStore((state) => state.isLivePipOpen);

  // Do NOT render on mission steps, experiments, quizzes, or tools where it clutters the UI
  if (!ALLOWED_ATMOSPHERE_PATHS.includes(location.pathname)) {
    return null;
  }

  const currentModeObj = ATMOSPHERE_MODES.find((m) => m.id === timeOfDay) || ATMOSPHERE_MODES[0];

  const handleSelectMode = (mode: TimeOfDay) => {
    sounds.pop();
    setTimeOfDay(mode);
    setIsOpen(false);

    if (mode === 'day') {
      sounds.sparkle();
      voiceAssistant.speak('Day mode activated! Sunny skies and radiant solar heat!');
    } else if (mode === 'night') {
      sounds.bubble();
      voiceAssistant.speak('Night mode activated! Glowing moon, starry skies and deep ocean bioluminescence!');
    } else if (mode === 'sunset') {
      sounds.pop();
      voiceAssistant.speak('Sunset mode activated! Warm golden dusk horizon!');
    } else if (mode === 'rain') {
      sounds.bubble();
      voiceAssistant.speak('Rainstorm mode activated! Fresh atmospheric precipitation!');
    }
  };

  return (
    <motion.div
      animate={{
        x: isLivePipOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? -70 : -395) : 0,
        scale: isLivePipOpen ? 0.92 : 1,
      }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="fixed top-14 right-3 sm:top-18 sm:right-6 z-[999990] flex items-center gap-2 select-none font-sans"
    >
      <div className="relative">
        <button
          onClick={() => {
            sounds.pop();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border-2 shadow-md text-slate-800 text-xs font-black cursor-pointer active:scale-95 transition-all ${
            isLivePipOpen ? 'border-violet-400 ring-2 ring-violet-300/50 shadow-violet-200' : 'border-slate-300'
          }`}
          title="Change Atmosphere (Day / Night / Sunset / Rain)"
        >
          <span className="text-base">{currentModeObj.icon}</span>
          <span className="hidden sm:inline capitalize font-black">{timeOfDay}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-44 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-300 shadow-2xl p-1.5 z-50 flex flex-col gap-1"
              >
                <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Atmosphere</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>

                {ATMOSPHERE_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleSelectMode(mode.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      timeOfDay === mode.id
                        ? 'bg-slate-900 text-white font-black shadow-xs'
                        : `${mode.bg} hover:scale-[1.02]`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{mode.icon}</span>
                      <span>{mode.label.split(' ')[0]}</span>
                    </div>
                    {timeOfDay === mode.id && <span className="text-emerald-400 text-xs">✓</span>}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
