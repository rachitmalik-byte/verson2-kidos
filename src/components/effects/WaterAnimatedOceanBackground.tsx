import React from 'react';
import { motion } from 'framer-motion';
import { useEnvironmentStore } from '@/stores/environmentStore';

export const WaterAnimatedOceanBackground: React.FC = () => {
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-colors duration-1000">
      {/* ── 1. DYNAMIC ATMOSPHERIC GRADIENT ── */}
      {timeOfDay === 'day' && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-blue-200" />
      )}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#1e1b4b]" />
      )}
      {timeOfDay === 'sunset' && (
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500 via-rose-400 to-indigo-900" />
      )}
      {timeOfDay === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-cyan-900" />
      )}

      {/* ── 2. CELESTIAL BODIES (SUN VS MOON) ── */}
      {timeOfDay === 'day' && (
        <div className="absolute top-6 right-10 sm:right-24 z-0">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 35, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-orange-400 opacity-90 shadow-[0_0_60px_rgba(251,191,36,0.65)] flex items-center justify-center relative"
          >
            <div className="w-full h-full rounded-full border-4 border-dashed border-amber-200/60 animate-spin" />
          </motion.div>
        </div>
      )}

      {timeOfDay === 'night' && (
        <>
          {/* Glowing Crescent Moon */}
          <div className="absolute top-8 right-12 sm:right-28 z-0">
            <motion.div
              animate={{ scale: [1, 1.04, 1], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-slate-100 via-sky-100 to-slate-300 shadow-[0_0_50px_rgba(224,242,254,0.7)] flex items-center justify-center relative border-2 border-white/50"
            >
              <div className="w-6 h-6 rounded-full bg-slate-300/40 absolute top-4 left-6" />
              <div className="w-4 h-4 rounded-full bg-slate-300/30 absolute bottom-6 right-7" />
              <div className="text-3xl absolute">🌙</div>
            </motion.div>
          </div>

          {/* Twinkling Constellation Stars */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.7, 1.3, 0.7],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${(i * 17) % 95 + 2}%`,
                  top: `${(i * 13) % 45 + 3}%`,
                }}
                className="absolute text-amber-200 text-xs sm:text-sm filter drop-shadow-[0_0_6px_#fef08a]"
              >
                ✦
              </motion.div>
            ))}
          </div>
        </>
      )}

      {timeOfDay === 'sunset' && (
        <div className="absolute top-16 right-16 sm:right-32 z-0">
          <motion.div
            animate={{ scale: [1, 1.03, 1], y: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-rose-500 via-orange-400 to-amber-300 opacity-95 shadow-[0_0_80px_rgba(244,63,94,0.7)] flex items-center justify-center"
          >
            <div className="text-4xl">🌅</div>
          </motion.div>
        </div>
      )}

      {timeOfDay === 'rain' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '-10vh', opacity: 0.8 }}
              animate={{ y: '110vh', opacity: [0.2, 0.8, 0.2] }}
              transition={{
                repeat: Infinity,
                duration: 0.45 + (i % 3) * 0.1,
                delay: (i * 0.05) % 0.4,
                ease: 'linear',
              }}
              style={{ left: `${(i * 2.5) % 100}%` }}
              className="absolute top-0 w-1 h-20 bg-gradient-to-b from-transparent via-cyan-300 to-sky-100 rounded-full shadow-[0_0_8px_#38bdf8]"
            />
          ))}
        </div>
      )}

      {/* ── 3. CLOUDS ── */}
      <motion.div
        animate={{ x: [-20, 40, -20] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-12 left-10 text-4xl ${
          timeOfDay === 'night' ? 'opacity-20 filter invert' : 'opacity-60'
        }`}
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ x: [30, -30, 30] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-20 left-1/3 text-3xl ${
          timeOfDay === 'night' ? 'opacity-15 filter invert' : 'opacity-40'
        }`}
      >
        ☁️
      </motion.div>

      {/* ── 4. MARINE LIFE (TURTLE, TROPICAL FISH, DOLPHIN, JELLYFISH) ── */}
      <motion.div
        animate={{
          x: [-100, 1400],
          y: [0, 20, -15, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-0 z-0 text-3xl opacity-80"
      >
        🐢
      </motion.div>

      <motion.div
        animate={{
          x: [1400, -100],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 right-0 z-0 text-2xl opacity-75"
      >
        🐠 🐟 🐡
      </motion.div>

      <motion.div
        animate={{
          x: [-100, 1400],
          y: [0, -20, 10, 0],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        className="absolute top-2/3 left-0 z-0 text-3xl opacity-70"
      >
        🐬
      </motion.div>

      {timeOfDay === 'night' && (
        <motion.div
          animate={{
            y: [500, -50],
            x: [-20, 20, -20],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/4 z-0 text-4xl filter drop-shadow-[0_0_20px_#38bdf8]"
        >
          🪼
        </motion.div>
      )}

      {/* ── 5. RISING WATER BUBBLES ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [800, -60],
              x: [0, (i % 2 === 0 ? 25 : -25)],
              opacity: [0, 0.75, 0],
              scale: [0.6, 1.2],
            }}
            transition={{
              duration: 7 + (i % 4),
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            style={{
              left: `${(i * 7.5) % 100}%`,
              bottom: 0,
            }}
            className="absolute text-sky-400 text-sm"
          >
            🫧
          </motion.div>
        ))}
      </div>
    </div>
  );
};
