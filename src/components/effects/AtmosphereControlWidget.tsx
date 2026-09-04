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

export const AtmosphereHeaderPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);
  const setTimeOfDay = useEnvironmentStore((state) => state.setTimeOfDay);

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

  const buttonThemeClass = {
    day: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900',
    sunset: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-950',
    night: 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100',
    rain: 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-950',
  }[timeOfDay] || 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700';

  const dropdownThemeClass = timeOfDay === 'night'
    ? 'bg-slate-900/95 border-slate-700 text-slate-100'
    : 'bg-white/95 border-slate-200 text-slate-800';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => {
          sounds.pop();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all shrink-0 ${buttonThemeClass}`}
        title="Change Atmosphere (Day / Night / Sunset / Rain)"
      >
        <span className="text-sm">{currentModeObj.icon}</span>
        <span className="hidden sm:inline capitalize font-bold">{timeOfDay}</span>
        <span className="text-[8px] opacity-60 ml-0.5">▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.12 }}
              className={`absolute right-0 top-10 w-44 backdrop-blur-xl rounded-2xl border shadow-2xl p-1.5 z-50 flex flex-col gap-1 ${dropdownThemeClass}`}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider opacity-60 border-b border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between">
                <span>Atmosphere</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>

              {ATMOSPHERE_MODES.map((mode) => {
                const isSelected = timeOfDay === mode.id;
                const activeColor = {
                  day: 'bg-amber-600 text-white',
                  night: 'bg-teal-600 text-white',
                  sunset: 'bg-orange-600 text-white',
                  rain: 'bg-sky-600 text-white',
                }[mode.id] || 'bg-slate-900 text-white';

                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelectMode(mode.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${activeColor} shadow-xs`
                        : `${mode.bg} hover:bg-slate-100 dark:hover:bg-slate-800`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{mode.icon}</span>
                      <span className="capitalize">{mode.id}</span>
                    </div>
                    {isSelected && <span className="text-white text-xs font-black">✓</span>}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Legacy stand-alone widget (rendered only if needed, disabled by default to keep viewport clean)
export const AtmosphereControlWidget: React.FC = () => {
  return null;
};

