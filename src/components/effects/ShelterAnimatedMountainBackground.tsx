import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, Snowflake, Wind, Sparkles, Compass } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { useEnvironmentStore } from '@/stores/environmentStore';

export const ShelterAnimatedMountainBackground: React.FC = () => {
  const [weatherMode, setWeatherMode] = useState<'sunny' | 'snowing' | 'windy'>('sunny');
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  const handleToggleWeather = () => {
    sounds.pop();
    if (weatherMode === 'sunny') setWeatherMode('snowing');
    else if (weatherMode === 'snowing') setWeatherMode('windy');
    else setWeatherMode('sunny');
  };

  // Determine dynamic mountain sky gradient based on global atmosphere timeOfDay
  const getSkyGradient = () => {
    if (timeOfDay === 'night') {
      return 'bg-gradient-to-b from-[#090D16] via-[#111827] to-[#1e1b4b]';
    }
    if (timeOfDay === 'sunset') {
      return 'bg-gradient-to-b from-amber-600 via-rose-500 to-indigo-900';
    }
    if (timeOfDay === 'rain') {
      return 'bg-gradient-to-b from-slate-700 via-slate-600 to-cyan-950';
    }
    // Day mode with local weather modifier
    if (weatherMode === 'snowing') {
      return 'bg-gradient-to-b from-slate-700 via-sky-300 to-indigo-100';
    }
    if (weatherMode === 'windy') {
      return 'bg-gradient-to-b from-sky-400 via-teal-100 to-amber-50';
    }
    return 'bg-gradient-to-b from-sky-300 via-indigo-100 to-amber-50';
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Dynamic Sky Gradient ── */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${getSkyGradient()}`} />

      {/* ── 1. Animated High-Altitude Sun or Night Moon ── */}
      {timeOfDay !== 'night' ? (
        <div className="absolute top-6 right-10 sm:right-24 z-0">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: weatherMode === 'sunny' ? [1, 1.08, 1] : [0.9, 0.95, 0.9],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 opacity-85 shadow-[0_0_60px_rgba(251,191,36,0.7)] flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full border-4 border-dashed border-amber-200/50 animate-spin" />
          </motion.div>
        </div>
      ) : (
        <div className="absolute top-8 right-12 sm:right-28 z-0">
          <motion.div
            animate={{ scale: [1, 1.04, 1], y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[0_0_45px_rgba(224,242,254,0.6)] flex items-center justify-center text-3xl"
          >
            🌙
          </motion.div>
        </div>
      )}

      {/* ── 2. Floating High-Altitude Clouds ── */}
      <motion.div
        animate={{ x: [-100, 1400] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-12 left-0 opacity-60 z-0"
      >
        <div className="w-36 h-12 bg-white/90 rounded-full blur-xs shadow-md" />
      </motion.div>

      <motion.div
        animate={{ x: [1400, -150] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute top-28 right-0 opacity-40 z-0"
      >
        <div className="w-48 h-16 bg-white/80 rounded-full blur-xs shadow-sm" />
      </motion.div>

      {/* ── 3. Soaring Himalayan Golden Eagle ── */}
      <motion.div
        animate={{
          x: [-60, 400, -60],
          y: [0, -30, 0],
          rotate: [-4, 4, -4],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/4 z-0 text-xl opacity-75 pointer-events-none"
      >
        🦅
      </motion.div>

      {/* ── 4. Falling Snowflakes (Active in Snowing / Cold mode) ── */}
      {weatherMode === 'snowing' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, 800],
                x: [0, (i % 2 === 0 ? 30 : -30)],
                opacity: [0, 0.9, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay: (i * 0.25),
                ease: 'linear',
              }}
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${-20}px`,
              }}
              className="absolute text-white text-sm"
            >
              ❄️
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 5. Windy Breeze Gusts (Active in Windy mode) ── */}
      {weatherMode === 'windy' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [-100, 1000],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
              style={{ top: `${15 + i * 14}%` }}
              className="absolute flex items-center gap-2 text-teal-600/60 font-black text-xs"
            >
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent rounded-full" />
              <span>💨 5,000m Ladakh Gale</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 6. Layered Mountain Silhouettes with Snow Caps ── */}
      <div className="absolute bottom-0 inset-x-0 h-96 pointer-events-none z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 400"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Distant Himalayas (Lavender / Blue) */}
          <polygon
            points="0,400 120,180 260,260 440,110 620,240 820,90 1020,220 1240,140 1440,400"
            fill="#818CF8"
            opacity="0.35"
          />
          {/* Distant Snow Caps */}
          <polygon points="440,110 470,150 410,150" fill="#FFFFFF" opacity="0.9" />
          <polygon points="820,90 855,140 785,140" fill="#FFFFFF" opacity="0.9" />
          <polygon points="1240,140 1270,180 1210,180" fill="#FFFFFF" opacity="0.9" />

          {/* Mid-Range Mountains (Indigo / Teal) */}
          <polygon
            points="0,400 180,240 380,310 560,180 760,290 980,160 1200,280 1440,210 1440,400"
            fill="#4F46E5"
            opacity="0.25"
          />
          {/* Mid-Range Snow Caps */}
          <polygon points="560,180 590,220 530,220" fill="#FFFFFF" opacity="0.8" />
          <polygon points="980,160 1010,205 950,205" fill="#FFFFFF" opacity="0.8" />

          {/* Forefront Plateau & Changpa Hills */}
          <polygon
            points="0,400 220,310 460,360 700,290 940,350 1200,310 1440,340 1440,400"
            fill="#059669"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* ── 7. Interactive Weather Mode Switcher Badge (Top Right) ── */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleToggleWeather}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-indigo-300 text-indigo-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="Toggle Himalayan Weather!"
        >
          {weatherMode === 'sunny' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
          {weatherMode === 'snowing' && <Snowflake className="w-3.5 h-3.5 text-sky-500 animate-spin" />}
          {weatherMode === 'windy' && <Wind className="w-3.5 h-3.5 text-teal-600 animate-pulse" />}
          <span>
            {weatherMode === 'sunny' ? '☀️ Mountain Sun' : weatherMode === 'snowing' ? '❄️ Snowfall Active' : '💨 5000m Gale'}
          </span>
        </button>
      </div>
    </div>
  );
};
