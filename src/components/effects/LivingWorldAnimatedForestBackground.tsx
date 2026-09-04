import React from 'react';
import { motion } from 'framer-motion';
import { useEnvironmentStore } from '@/stores/environmentStore';

export const LivingWorldAnimatedForestBackground: React.FC = () => {
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-colors duration-1000">
      {/* ── Dynamic Atmospheric Jungle Canopy Gradient ── */}
      {timeOfDay === 'day' && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/90 via-teal-50/70 to-slate-50" />
      )}
      {timeOfDay === 'sunset' && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/70 via-emerald-900/80 to-slate-900" />
      )}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#06120d] via-[#0b1c14] to-[#0f172a]" />
      )}
      {timeOfDay === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-700/80 via-emerald-950/70 to-slate-900" />
      )}

      {/* ── Animated Canopy Sun (Day / Sunset) ── */}
      {(timeOfDay === 'day' || timeOfDay === 'sunset') && (
        <div className="absolute top-6 right-10 sm:right-24 z-0">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center ${
              timeOfDay === 'sunset'
                ? 'bg-gradient-to-r from-amber-500 to-rose-400 opacity-90 shadow-[0_0_60px_rgba(245,158,11,0.6)]'
                : 'bg-gradient-to-r from-amber-300 to-yellow-200 opacity-80 shadow-[0_0_60px_rgba(251,191,36,0.45)]'
            }`}
          />
        </div>
      )}

      {/* ── Animated Moon & Stars (Night) ── */}
      {timeOfDay === 'night' && (
        <>
          <div className="absolute top-8 right-12 sm:right-28 z-0">
            <motion.div
              animate={{ scale: [1, 1.04, 1], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-100 via-emerald-100 to-teal-200 shadow-[0_0_50px_rgba(167,243,208,0.5)] flex items-center justify-center relative border border-white/40"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-300/30 absolute top-3 left-4" />
              <div className="w-3 h-3 rounded-full bg-emerald-300/20 absolute bottom-4 right-5" />
            </motion.div>
          </div>

          {/* Twinkling Canopy Fireflies & Stars */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, i % 2 === 0 ? 30 : -30, 0],
                  y: [0, i % 3 === 0 ? -25 : 25, 0],
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${(i * 7) % 94}%`,
                  top: `${(i * 6) % 85}%`,
                }}
                className="absolute w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]"
              />
            ))}
          </div>
        </>
      )}

      {/* ── Layered Jungle Tree Silhouettes ── */}
      <div className="absolute bottom-0 inset-x-0 h-40 sm:h-48 pointer-events-none z-0 opacity-40">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none">
          <polygon points="0,220 180,60 360,220 540,80 720,220 900,50 1080,220 1260,70 1440,220" fill="#047857" opacity="0.4" />
          <polygon points="0,220 220,110 440,220 660,100 880,220 1100,120 1320,220 1440,110 1440,220" fill="#065F46" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};
