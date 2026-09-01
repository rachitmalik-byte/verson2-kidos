import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, Sun, Moon } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const LivingWorldAnimatedForestBackground: React.FC = () => {
  const [canopyMode, setCanopyMode] = useState<'day' | 'twilight' | 'firefly'>('day');

  const handleToggleCanopy = () => {
    sounds.pop();
    if (canopyMode === 'day') setCanopyMode('twilight');
    else if (canopyMode === 'twilight') setCanopyMode('firefly');
    else setCanopyMode('day');
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Dynamic Jungle Gradient ── */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          canopyMode === 'firefly'
            ? 'bg-gradient-to-b from-slate-900 via-emerald-950 to-teal-900'
            : canopyMode === 'twilight'
            ? 'bg-gradient-to-b from-amber-700 via-emerald-900 to-teal-900'
            : 'bg-gradient-to-b from-emerald-200 via-teal-50 to-amber-50'
        }`}
      />

      {/* ── Animated Canopy Sun / Moon ── */}
      <div className="absolute top-6 right-10 sm:right-24 z-0">
        <motion.div
          animate={{
            scale: canopyMode === 'day' ? [1, 1.06, 1] : [0.95, 1, 0.95],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center ${
            canopyMode === 'firefly'
              ? 'bg-gradient-to-r from-cyan-200 to-sky-300 opacity-90 shadow-[0_0_50px_rgba(103,232,249,0.7)]'
              : 'bg-gradient-to-r from-amber-300 to-yellow-200 opacity-80 shadow-[0_0_50px_rgba(251,191,36,0.6)]'
          }`}
        >
          {canopyMode === 'firefly' && <span className="text-3xl">🌙</span>}
        </motion.div>
      </div>

      {/* ── Fluttering Butterflies & Birds ── */}
      <motion.div
        animate={{
          x: [-60, 800],
          y: [0, -25, 20, 0],
          rotate: [-6, 6, -6],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-0 z-0 text-xl opacity-80 pointer-events-none"
      >
        🦋 🦜
      </motion.div>

      {/* ── Glowing Fireflies (Active in Twilight & Firefly modes) ── */}
      {(canopyMode === 'twilight' || canopyMode === 'firefly') && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, i % 2 === 0 ? 40 : -40, 0],
                y: [0, i % 3 === 0 ? -30 : 30, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2.5 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
              style={{
                left: `${(i * 7) % 95}%`,
                top: `${(i * 6) % 85}%`,
              }}
              className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,1)]"
            />
          ))}
        </div>
      )}

      {/* ── Floating Voxel Specimen Islands (Left & Right Horizon) ── */}
      <div className="absolute bottom-6 left-4 sm:left-12 opacity-40 pointer-events-none transform -scale-x-100">
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-4xl filter drop-shadow-lg"
        >
          🌲🪨
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-6 sm:right-16 opacity-40 pointer-events-none">
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-4xl filter drop-shadow-lg"
        >
          🫐🌲
        </motion.div>
      </div>

      {/* ── Layered Jungle Tree Silhouettes ── */}
      <div className="absolute bottom-0 inset-x-0 h-44 pointer-events-none z-0">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none">
          <polygon points="0,220 180,60 360,220 540,80 720,220 900,50 1080,220 1260,70 1440,220" fill="#047857" opacity="0.25" />
          <polygon points="0,220 220,110 440,220 660,100 880,220 1100,120 1320,220 1440,110 1440,220" fill="#065F46" opacity="0.35" />
        </svg>
      </div>

      {/* ── Interactive Canopy Switcher (Top Right) ── */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleToggleCanopy}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-emerald-300 text-emerald-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="Toggle Forest Senses!"
        >
          {canopyMode === 'day' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
          {canopyMode === 'twilight' && <Leaf className="w-3.5 h-3.5 text-emerald-600" />}
          {canopyMode === 'firefly' && <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />}
          <span>
            {canopyMode === 'day' ? '🌿 Sunny Forest' : canopyMode === 'twilight' ? '🌅 Sunset Canopy' : '✨ Firefly Senses'}
          </span>
        </button>
      </div>
    </div>
  );
};
