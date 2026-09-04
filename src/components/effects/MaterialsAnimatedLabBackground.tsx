import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const MaterialsAnimatedLabBackground: React.FC = () => {
  const [labMode, setLabMode] = useState<'molecular' | 'atomic_reaction'>('molecular');

  const handleToggleLab = () => {
    sounds.pop();
    setLabMode((prev) => (prev === 'molecular' ? 'atomic_reaction' : 'molecular'));
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* ── Dynamic Lab Subtle Tint ── */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          labMode === 'atomic_reaction'
            ? 'bg-gradient-to-b from-teal-500/5 via-amber-500/5 to-purple-500/5'
            : 'bg-gradient-to-b from-teal-500/5 via-orange-500/5 to-emerald-500/5'
        }`}
      />

      {/* ── Floating Molecular Hexagons & Atoms (Muted & Soft) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.12, 0.28, 0.12],
            }}
            transition={{
              duration: 10 + (i % 4),
              repeat: Infinity,
              delay: i * 0.9,
              ease: 'easeInOut',
            }}
            style={{
              left: `${(i * 12) % 90}%`,
              top: `${(i * 10) % 80}%`,
            }}
            className="absolute text-[#F59E0B]/25 text-2xl font-bold"
          >
            {i % 2 === 0 ? '⬡' : '⚛️'}
          </motion.div>
        ))}
      </div>

      {/* ── Interactive Lab Mode Switcher ── */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={handleToggleLab}
          className="pill-btn-secondary px-3.5 py-1.5 text-xs shadow-soft-pill flex items-center gap-1.5"
          title="Toggle Atmosphere"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>{labMode === 'molecular' ? '⚛️ Molecular Lab' : '🧪 Polymer Synthesis'}</span>
        </button>
      </div>
    </div>
  );
};

