import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  tip?: string;
}

const SCIENCE_TIPS = [
  'Polyester fibers are thinner than human hair, yet strong enough to lift cars! 🪢',
  'Cotton fibers absorb water because they are made of natural cellulose! 🌿',
  'PVC plastic coating on wires stops dangerous electrical shocks! ⚡',
  'Vulcanized rubber was discovered when rubber and sulfur fell on a hot stove! 🛞',
  'Bakelite was the world\'s first 100% synthetic plastic invented in 1907! 🔬',
];

export const SciencePageLoader: React.FC<Props> = ({ tip }) => {
  const randomTip = tip || SCIENCE_TIPS[Math.floor(Math.random() * SCIENCE_TIPS.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center select-none font-sans"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full bg-white/80 backdrop-blur-md p-8 rounded-3xl border-2 border-amber-200/80 shadow-xl shadow-amber-500/5">
        {/* Animated Science Icon Stage */}
        <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
          {/* Pulsing glow ring */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-tr from-amber-300 via-sky-300 to-indigo-300 rounded-full blur-md"
          />

          {/* Bouncing Science Flask & Molecule */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-white shadow-lg flex items-center justify-center text-3xl"
          >
            🧪
          </motion.div>

          {/* Orbiting Sparkle */}
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
            className="absolute -top-1 -right-1 text-base z-20"
          >
            ✨
          </motion.span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-black text-slate-900 mb-1 tracking-tight"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Setting Up Experiment Lab...
        </h3>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          PolyQuest Science Academy 🔬
        </span>

        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 rounded-full"
          />
        </div>

        {/* Educational Did-You-Know Tip */}
        <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3 w-full text-left">
          <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block mb-0.5">
            💡 Science Secret
          </span>
          <p className="text-xs font-bold text-slate-700 leading-snug">
            {randomTip}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
