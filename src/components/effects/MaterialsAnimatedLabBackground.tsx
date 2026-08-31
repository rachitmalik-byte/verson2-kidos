import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FlaskConical, Atom } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const MaterialsAnimatedLabBackground: React.FC = () => {
  const [labMode, setLabMode] = useState<'molecular' | 'atomic_reaction'>('molecular');

  const handleToggleLab = () => {
    sounds.pop();
    setLabMode((prev) => (prev === 'molecular' ? 'atomic_reaction' : 'molecular'));
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Dynamic Lab Warm Gradient ── */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          labMode === 'atomic_reaction'
            ? 'bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100'
            : 'bg-gradient-to-b from-amber-100 via-sky-50 to-indigo-50'
        }`}
      />

      {/* ── Floating Molecular Hexagons & Atoms ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
            style={{
              left: `${(i * 10) % 90}%`,
              top: `${(i * 9) % 80}%`,
            }}
            className="absolute text-amber-500/30 text-3xl font-black"
          >
            {i % 2 === 0 ? '⬡' : '⚛️'}
          </motion.div>
        ))}
      </div>

      {/* ── Interactive Lab Mode Switcher ── */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleToggleLab}
          className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-amber-300 text-amber-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-white active:scale-95 transition-all"
          title="Toggle Molecular Atmosphere!"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
          <span>{labMode === 'molecular' ? '⚛️ Molecular Lab' : '🧪 Polymer Synthesis'}</span>
        </button>
      </div>
    </div>
  );
};
