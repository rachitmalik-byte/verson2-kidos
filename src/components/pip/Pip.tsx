import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipMood } from '@/types';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useProgressStore } from '@/stores/progressStore';

export interface PipProps {
  mood?: PipMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGoggles?: boolean;
  showPointerStick?: boolean;
  interactive?: boolean;
  outfitOverride?: string;
  headwearOverride?: string;
}

const PIP_QUOTES = [
  "Pip loves science! Let's explore together! 🔬",
  "Hehe, that tickles! What are we testing next? ✨",
  "Synthetic materials are like molecular superpower chains! 🧪",
  "You're thinking like a real master scientist! ⭐",
  "Pip's safety gear is calibrated and ready! 🥽",
  "Did you know nylon was the very first 100% synthetic fibre? 🧵",
  "Science high-five! Let's keep discovering! ✋",
];

export const Pip: React.FC<PipProps> = ({
  mood = 'idle',
  className = '',
  size = 'md',
  showGoggles = true,
  showPointerStick = false,
  interactive = true,
  outfitOverride,
  headwearOverride,
}) => {
  const storeOutfit = useProgressStore((state) => state.equippedOutfit);
  const storeHeadwear = useProgressStore((state) => state.equippedHeadwear);

  const currentOutfit = outfitOverride || storeOutfit || 'lab-coat';
  const currentHeadwear = headwearOverride || storeHeadwear || (showGoggles ? 'goggles' : 'none');

  const [isBlinking, setIsBlinking] = useState(false);
  const [tapEffect, setTapEffect] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const handlePipClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    sounds.sparkle();

    const icons = ['⭐', '❤️', '💡', '🧪', '✨', '🥽', '🎉', '🪙'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newId = Date.now() + Math.random();

    setTapEffect((prev) => [...prev.slice(-4), { id: newId, icon: randomIcon, x: 0, y: -20 }]);
    setTimeout(() => {
      setTapEffect((prev) => prev.filter((p) => p.id !== newId));
    }, 1200);

    const nextQ = (quoteIndex + 1) % PIP_QUOTES.length;
    setQuoteIndex(nextQ);
    if (Math.random() > 0.45) {
      voiceAssistant.speak(PIP_QUOTES[nextQ]);
    }
  };

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
      scale: [1, 1.06, 1],
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
      scale: [1, 1.12, 1],
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
      onClick={handlePipClick}
      whileHover={interactive ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
      whileTap={interactive ? { scale: 0.92, rotate: 10 } : undefined}
      className={`relative inline-flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${sizeClasses[size]} ${className}`}
      variants={bodyVariants}
      animate={mood}
      title={interactive ? "Click to play with Pip!" : undefined}
    >
      <AnimatePresence>
        {tapEffect.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -45, scale: 1.4, x: (Math.random() - 0.5) * 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute -top-3 text-2xl pointer-events-none z-30 filter drop-shadow-md"
          >
            {p.icon}
          </motion.span>
        ))}
      </AnimatePresence>

      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-xl"
      >
        <defs>
          <radialGradient id="pipBodyGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="85%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </radialGradient>
          <linearGradient id="pipCoatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="pipAstroGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="pipParkaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="pipGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="pipDetectiveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="pipGogglesGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="pipVisorGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="pipCheekGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="70" cy="128" rx="42" ry="7" fill="#000000" fillOpacity="0.14" />

        {/* Round Body */}
        <motion.path
          d="M70 18 C38 18 20 44 20 76 C20 108 40 124 70 124 C100 124 120 108 120 76 C120 44 102 18 70 18 Z"
          fill="url(#pipBodyGrad)"
          stroke="#4C1D95"
          strokeWidth="3.5"
        />

        {/* Antenna / Spark */}
        <path d="M70 18 Q72 8 76 6" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="77" cy="6" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />

        {/* ── CUSTOMIZABLE OUTFITS ── */}
        {currentOutfit === 'lab-coat' && (
          <g>
            <path
              d="M32 82 C32 108 44 123 70 123 C96 123 108 108 108 82 C98 84 86 86 70 86 C54 86 42 84 32 82 Z"
              fill="url(#pipCoatGrad)"
              stroke="#475569"
              strokeWidth="2.5"
            />
            <path d="M50 84 L70 104 L90 84" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="70" cy="109" r="2" fill="#F59E0B" />
            <circle cx="70" cy="116" r="2" fill="#F59E0B" />
            <rect x="84" y="97" width="14" height="12" rx="2" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
            <rect x="88" y="92" width="3" height="7" rx="1.5" fill="#10B981" />
          </g>
        )}

        {currentOutfit === 'astronaut' && (
          <g>
            <path
              d="M30 80 C30 110 42 124 70 124 C98 124 110 110 110 80 C98 83 86 85 70 85 C54 85 42 83 30 80 Z"
              fill="url(#pipAstroGrad)"
              stroke="#075985"
              strokeWidth="3"
            />
            <rect x="58" y="96" width="24" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="65" cy="104" r="2" fill="#22C55E" />
            <circle cx="75" cy="104" r="2" fill="#EF4444" />
          </g>
        )}

        {currentOutfit === 'winter-parka' && (
          <g>
            <path
              d="M30 80 C30 110 42 124 70 124 C98 124 110 110 110 80 C98 83 86 85 70 85 C54 85 42 83 30 80 Z"
              fill="url(#pipParkaGrad)"
              stroke="#881337"
              strokeWidth="3"
            />
            {/* Fur Collar */}
            <path d="M40 82 C55 92 85 92 100 82" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx="70" cy="106" r="3" fill="#FFFFFF" />
            <circle cx="70" cy="116" r="3" fill="#FFFFFF" />
          </g>
        )}

        {currentOutfit === 'gold-champion' && (
          <g>
            <path
              d="M30 80 C30 110 42 124 70 124 C98 124 110 110 110 80 C98 83 86 85 70 85 C54 85 42 83 30 80 Z"
              fill="url(#pipGoldGrad)"
              stroke="#854D0E"
              strokeWidth="3"
            />
            <circle cx="70" cy="104" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <path d="M70 99 L72 103 L76 104 L73 107 L74 111 L70 108 L66 111 L67 107 L64 104 L68 103 Z" fill="#EAB308" />
          </g>
        )}

        {currentOutfit === 'detective' && (
          <g>
            <path
              d="M30 80 C30 110 42 124 70 124 C98 124 110 110 110 80 C98 83 86 85 70 85 C54 85 42 83 30 80 Z"
              fill="url(#pipDetectiveGrad)"
              stroke="#92400E"
              strokeWidth="3"
            />
            <path d="M48 83 L70 102 L92 83" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="112" r="3" fill="#78350F" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />

        {/* Eyes */}
        {!isBlinking ? (
          <g>
            <circle cx="52" cy="64" r="8" fill="#1E1B4B" />
            <circle cx="55" cy="61" r="3" fill="#FFFFFF" />
            <circle cx="50" cy="66" r="1.5" fill="#FFFFFF" />

            <circle cx="88" cy="64" r="8" fill="#1E1B4B" />
            <circle cx="91" cy="61" r="3" fill="#FFFFFF" />
            <circle cx="86" cy="66" r="1.5" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <path d="M44 64 Q52 69 60 64" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M80 64 Q88 69 96 64" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Mouth */}
        {mood === 'concerned' ? (
          <path d="M62 80 Q70 74 78 80" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <path d="M63 77 Q70 78 77 75" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M62 74 Q70 82 78 74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="#BE185D" />
        )}

        {/* ── CUSTOMIZABLE HEADWEAR & GLASSES ── */}
        {currentHeadwear === 'goggles' && (
          <g>
            <path d="M22 54 C35 50 105 50 118 54" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="52" cy="52" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="48" cy="48" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="88" cy="52" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="84" cy="48" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            <path d="M66 52 Q70 50 74 52" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {currentHeadwear === 'visor' && (
          <g>
            <path d="M26 50 C40 45 100 45 114 50 L110 60 C96 56 44 56 30 60 Z" fill="url(#pipVisorGrad)" stroke="#0284C7" strokeWidth="2" />
            <path d="M36 53 L104 53" stroke="#E0F2FE" strokeWidth="1.5" strokeDasharray="4 2" />
          </g>
        )}

        {currentHeadwear === 'grad-cap' && (
          <g>
            <polygon points="70,12 115,24 70,36 25,24" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="52" y="32" width="36" height="10" rx="3" fill="#334155" />
            <path d="M70 24 L105 32 L105 44" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <circle cx="105" cy="45" r="3" fill="#F59E0B" />
          </g>
        )}

        {currentHeadwear === 'crown' && (
          <g>
            <polygon points="40,32 45,16 58,26 70,10 82,26 95,16 100,32" fill="url(#pipGoldGrad)" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="45" cy="16" r="2.5" fill="#EF4444" />
            <circle cx="70" cy="10" r="3" fill="#3B82F6" />
            <circle cx="95" cy="16" r="2.5" fill="#10B981" />
          </g>
        )}

        {currentHeadwear === 'party-hat' && (
          <g>
            <polygon points="50,30 70,4 90,30" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <path d="M56 22 L84 22" stroke="#FBBF24" strokeWidth="2.5" />
            <circle cx="70" cy="4" r="4" fill="#FBBF24" />
          </g>
        )}

        {/* ── TEACHER POINTER WAND / STICK ── */}
        {showPointerStick && (
          <motion.g
            animate={{ rotate: [-4, 6, -4], y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '25px 95px' }}
          >
            {/* Pip's Little Hand */}
            <circle cx="26" cy="94" r="7" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
            {/* Wooden Pointer Stick */}
            <line x1="26" y1="94" x2="-22" y2="45" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="26" y1="94" x2="-22" y2="45" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Glowing Golden Star Tip */}
            <circle cx="-24" cy="43" r="8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <path d="M-24 38 L-22 42 L-18 43 L-21 46 L-20 50 L-24 47 L-28 50 L-27 46 L-30 43 L-26 42 Z" fill="#EAB308" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};
