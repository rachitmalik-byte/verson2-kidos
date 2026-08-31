import React from 'react';
import { motion } from 'framer-motion';

export const WaterAnimatedOceanBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* ── 1. Sky-to-Ocean Deep Lagoon Gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-blue-200" />

      {/* ── 2. Shimmering Sun with Rotating Rays (Top Right) ── */}
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
          {/* Dashed Corona Orbit */}
          <div className="w-full h-full rounded-full border-4 border-dashed border-amber-200/60 animate-spin" />
        </motion.div>
      </div>

      {/* ── 3. Light Atmospheric Clouds (Top Left) ── */}
      <motion.div
        animate={{ x: [-20, 40, -20] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-10 opacity-60 text-4xl"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ x: [30, -30, 30] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/3 opacity-40 text-3xl"
      >
        ☁️
      </motion.div>

      {/* ── 4. Swimming Marine Life (Sea Turtle & Tropical Fish) ── */}
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

      {/* ── 5. Translucent Rising Water Bubbles ── */}
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

      {/* ── 6. Layered Animated Rolling Ocean Waves at Bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden z-0">
        {/* Back Wave */}
        <motion.svg
          animate={{ x: [-80, 0, -80] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-[200%] h-36 opacity-30 text-sky-600"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" />
        </motion.svg>

        {/* Middle Wave */}
        <motion.svg
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-[200%] h-28 opacity-45 text-blue-500"
          fill="currentColor"
        >
          <path d="M0,40 C300,100 600,0 900,60 C1050,90 1150,30 1200,50 L1200,120 L0,120 Z" />
        </motion.svg>

        {/* Foreground Wave */}
        <motion.svg
          animate={{ x: [-40, 40, -40] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-[200%] h-20 opacity-60 text-cyan-600"
          fill="currentColor"
        >
          <path d="M0,60 C150,20 350,80 500,40 C700,0 900,80 1200,30 L1200,120 L0,120 Z" />
        </motion.svg>
      </div>
    </div>
  );
};
