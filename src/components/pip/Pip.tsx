import React from 'react';
import { motion } from 'framer-motion';
import type { PipMood } from '@/types';

export interface PipProps {
  mood?: PipMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGoggles?: boolean;
}

export const Pip: React.FC<PipProps> = ({
  mood = 'idle',
  className = '',
  size = 'md',
  showGoggles = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  // Body motion based on mood
  const bodyVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
    },
    curious: {
      rotate: [-4, 8, -4],
      y: [0, -8, 0],
      transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
    },
    encouraging: {
      y: [0, -14, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeOut' },
    },
    thinking: {
      rotate: [-6, -2, -6],
      y: [0, -4, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -24, 0],
      rotate: [-8, 8, -8],
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeOut' },
    },
    hinting: {
      x: [-4, 6, -4],
      rotate: [0, 4, 0],
      transition: { duration: 1.2, repeat: Infinity },
    },
    explaining: {
      y: [0, -8, 0],
      scaleX: [1, 1.03, 1],
      transition: { duration: 1.4, repeat: Infinity },
    },
    concerned: {
      x: [-4, 4, -4, 4, 0],
      y: [0, -2, 0],
      transition: { duration: 0.4, repeat: Infinity },
    },
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      variants={bodyVariants}
      animate={mood}
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-xl"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="pipBodyGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </radialGradient>
          <linearGradient id="pipCoatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="pipGogglesGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="pipCheekGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="70" cy="130" rx="42" ry="7" fill="#000000" opacity="0.15" />

        {/* Main Body (Cute Fluffy Blob) */}
        <circle cx="70" cy="65" r="50" fill="url(#pipBodyGrad)" stroke="#5B21B6" strokeWidth="4" />

        {/* Soft Belly Light */}
        <ellipse cx="70" cy="74" rx="34" ry="28" fill="#DDD6FE" opacity="0.35" />

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="8" ry="5" fill="url(#pipCheekGrad)" opacity="0.8" />
        <ellipse cx="96" cy="74" rx="8" ry="5" fill="url(#pipCheekGrad)" opacity="0.8" />

        {/* Scientist Mini Lab Coat */}
        <path
          d="M 32 68 Q 70 82 108 68 L 112 110 Q 70 118 28 110 Z"
          fill="url(#pipCoatGrad)"
          stroke="#475569"
          strokeWidth="3.5"
        />
        {/* Coat Lapels & Buttons */}
        <path d="M 70 76 L 70 114" stroke="#64748B" strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="70" cy="86" r="3" fill="#F59E0B" />
        <circle cx="70" cy="98" r="3" fill="#F59E0B" />
        {/* Cute Pocket with Pen */}
        <rect x="84" y="86" width="14" height="14" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
        <rect x="88" y="80" width="3" height="8" rx="1.5" fill="#EF4444" />
        <rect x="93" y="82" width="3" height="6" rx="1.5" fill="#3B82F6" />

        {/* Left Arm */}
        <motion.path
          d="M 28 75 Q 12 85 18 100"
          stroke="url(#pipBodyGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          animate={{
            rotate: mood === 'celebrating' ? [0, -40, 0] : mood === 'encouraging' ? [0, -20, 0] : 0,
            originX: '28px',
            originY: '75px',
          }}
          transition={{ repeat: Infinity, duration: 0.7 }}
        />
        {/* Right Arm */}
        <motion.path
          d="M 112 75 Q 128 85 122 100"
          stroke="url(#pipBodyGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          animate={{
            rotate: mood === 'celebrating' ? [0, 40, 0] : mood === 'hinting' ? [0, -35, 0] : 0,
            originX: '112px',
            originY: '75px',
          }}
          transition={{ repeat: Infinity, duration: 0.7 }}
        />

        {/* Big Sparkly Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="52" cy="54" rx="9" ry="12" fill="#0F172A" />
          <circle cx="49" cy="49" r="4.5" fill="#FFFFFF" />
          <circle cx="55" cy="58" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="88" cy="54" rx="9" ry="12" fill="#0F172A" />
          <circle cx="85" cy="49" r="4.5" fill="#FFFFFF" />
          <circle cx="91" cy="58" r="2" fill="#FFFFFF" />

          {/* Happy Eye Arches for Celebrating */}
          {mood === 'celebrating' && (
            <>
              <path d="M 44 54 Q 52 44 60 54" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 80 54 Q 88 44 96 54" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Expressive Mouth */}
        {mood === 'celebrating' || mood === 'encouraging' ? (
          <path d="M 58 68 Q 70 82 82 68 Z" fill="#E11D48" stroke="#0F172A" strokeWidth="3" />
        ) : mood === 'concerned' ? (
          <path d="M 58 72 Q 70 64 82 72" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : mood === 'thinking' ? (
          <ellipse cx="70" cy="70" rx="4" ry="5" fill="#0F172A" />
        ) : (
          <path d="M 60 68 Q 70 76 80 68" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}

        {/* Scientist Goggles perched on head */}
        {showGoggles && (
          <g>
            <rect x="36" y="24" width="28" height="20" rx="6" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <rect x="76" y="24" width="28" height="20" rx="6" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <path d="M 64 34 L 76 34" stroke="#0284C7" strokeWidth="4" />
            <path d="M 28 34 L 36 34" stroke="#0284C7" strokeWidth="4" />
            <path d="M 104 34 L 112 34" stroke="#0284C7" strokeWidth="4" />
            {/* Goggle Lens Glint */}
            <path d="M 40 28 L 48 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 80 28 L 88 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
