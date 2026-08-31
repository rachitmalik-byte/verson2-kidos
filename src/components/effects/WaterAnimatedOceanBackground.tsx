import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplets, CloudRain, Waves } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const WaterAnimatedOceanBackground: React.FC = () => {
  const [tideMode, setTideMode] = useState<'lagoon' | 'tropical_rain' | 'coral_reef'>('lagoon');

  const handleToggleTide = () => {
    sounds.pop();
    if (tideMode === 'lagoon') setTideMode('tropical_rain');
    else if (tideMode === 'tropical_rain') setTideMode('coral_reef');
    else setTideMode('lagoon');
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* ── Dynamic Sea Gradient ── */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          tideMode === 'tropical_rain'
            ? 'bg-gradient-to-b from-slate-600 via-sky-400 to-blue-200'
            : tideMode === 'coral_reef'
            ? 'bg-gradient-to-b from-sky-400 via-cyan-200 to-teal-100'
            : 'bg-gradient-to-b from-sky-300 via-blue-100 to-amber-50'
        }`}
      />

      {/* ── Animated Sun ── */}
      <div className="absolute top-6 right-10 sm:right-24 z-0">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: tideMode === 'coral_reef' ? [1, 1.1, 1] : [1, 1.04, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 opacity-80 shadow-[0_0_50px_rgba(251,191,36,0.6)] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full border-4 border-dashed border-amber-200/50 animate-spin" />
        </motion.div>
      </div>

      {/* ── Swimming Marine Life (Sea Turtle & Fish) ── */}
      <motion.div
        animate={{
          x: [-80, 800],
          y: [0, 15, -15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-0 z-0 text-2xl opacity-75 pointer-events-none"
      >
        🐢
      </motion.div>

      <motion.div
        animate={{
          x: [900, -80],
          y: [0, -10, 10, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-0 z-0 text-xl opacity-70 pointer-events-none"
      >
        🐠 🐟
      </motion.div>

      {/* ── Floating Rising Water Bubbles ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [600, -50],
              x: [0, (i % 2 === 0 ? 20 : -20)],
              opacity: [0, 0.7, 0],
              scale: [0.6, 1.2],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
            style={{
              left: `${(i * 8) % 100}%`,
              bottom: 0,
            }}
            className="absolute text-sky-400 text-sm"
          >
            🫧
          </motion.div>
        ))}
      </div>

      {/* ── Tropical Raindrops (If Tropical Rain Mode) ── */}
      {tideMode === 'tropical_rain' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, 700],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'linear',
              }}
              style={{ left: `${(i * 6) % 100}%` }}
              className="absolute w-1 h-6 bg-sky-400 rounded-full shadow-xs"
            />
          ))}
        </div>
      )}

      {/* ── Animated Ocean Wave Horizons (Bottom) ── */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-0">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <motion.path
            animate={{ d: [
              "M0,100 C320,130 420,70 720,100 C1020,130 1120,70 1440,100 L1440,200 L0,200 Z",
              "M0,90 C320,60 420,120 720,90 C1020,60 1120,120 1440,90 L1440,200 L0,200 Z",
              "M0,100 C320,130 420,70 720,100 C1020,130 1120,70 1440,100 L1440,200 L0,200 Z"
            ]}}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            fill="#0284C7"
            opacity="0.2"
          />
          <motion.path
            animate={{ d: [
              "M0,130 C360,90 500,160 760,130 C1020,100 1200,160 1440,130 L1440,200 L0,200 Z",
              "M0,140 C360,170 500,100 760,140 C1020,170 1200,100 1440,140 L1440,200 L0,200 Z",
              "M0,130 C360,90 500,160 760,130 C1020,100 1200,160 1440,130 L1440,200 L0,200 Z"
            ]}}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            fill="#0369A1"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* ── Interactive Tide Switcher (Top Right) ── */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleToggleTide}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-sky-300 text-sky-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="Toggle Water Horizon!"
        >
          {tideMode === 'lagoon' && <Waves className="w-3.5 h-3.5 text-sky-600" />}
          {tideMode === 'tropical_rain' && <CloudRain className="w-3.5 h-3.5 text-blue-600" />}
          {tideMode === 'coral_reef' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span>
            {tideMode === 'lagoon' ? '🌊 Calm Lagoon' : tideMode === 'tropical_rain' ? '🌧️ Tropical Rain' : '🐠 Coral Reef'}
          </span>
        </button>
      </div>
    </div>
  );
};
