import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipMood } from '@/types';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

export interface PipProps {
  mood?: PipMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGoggles?: boolean;
  interactive?: boolean;
}

const PIP_QUOTES = [
  "Pip loves science! Let's explore together! 🔬",
  "Hehe, that tickles! What are we testing next? ✨",
  "Synthetic materials are like molecular superpower chains! 🧪",
  "You're thinking like a real master scientist! ⭐",
  "Pip's safety goggles are calibrated and ready! 🥽",
  "Did you know nylon was the very first 100% synthetic fibre? 🧵",
  "Science high-five! Let's keep discovering! ✋",
];

export const Pip: React.FC<PipProps> = ({
  mood = 'idle',
  className = '',
  size = 'md',
  showGoggles = true,
  interactive = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [gogglesOn, setGogglesOn] = useState(showGoggles);
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

    // Spawn floating emoji particle
    const icons = ['⭐', '❤️', '💡', '🧪', '✨', '🥽', '🎉'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newId = Date.now() + Math.random();

    setTapEffect((prev) => [...prev.slice(-4), { id: newId, icon: randomIcon, x: 0, y: -20 }]);
    setTimeout(() => {
      setTapEffect((prev) => prev.filter((p) => p.id !== newId));
    }, 1200);

    // Speak a fun voice quote occasionally
    const nextQ = (quoteIndex + 1) % PIP_QUOTES.length;
    setQuoteIndex(nextQ);
    if (Math.random() > 0.4) {
      voiceAssistant.speak(PIP_QUOTES[nextQ]);
    }
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
      title={interactive ? "Click me to play with Pip!" : undefined}
    >
      {/* Floating Interactive Hearts & Sparkles Particles */}
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
          <linearGradient id="pipGogglesGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="pipCheekGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="70" cy="128" rx="42" ry="7" fill="#000000" fillOpacity="0.14" />

        {/* Body */}
        <motion.path
          d="M70 18 C38 18 20 44 20 76 C20 108 40 124 70 124 C100 124 120 108 120 76 C120 44 102 18 70 18 Z"
          fill="url(#pipBodyGrad)"
          stroke="#4C1D95"
          strokeWidth="3.5"
          animate={interactive ? { d: ["M70 18 C38 18 20 44 20 76 C20 108 40 124 70 124 C100 124 120 108 120 76 C120 44 102 18 70 18 Z", "M70 16 C37 16 19 43 19 76 C19 109 40 125 70 125 C100 125 121 109 121 76 C121 43 103 16 70 16 Z", "M70 18 C38 18 20 44 20 76 C20 108 40 124 70 124 C100 124 120 108 120 76 C120 44 102 18 70 18 Z"] } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Cute Antenna / Scientist Spark */}
        <path d="M70 18 Q72 8 76 6" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="77" cy="6" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />

        {/* Scientist Lab Coat */}
        <path
          d="M32 82 C32 108 44 123 70 123 C96 123 108 108 108 82 C98 84 86 86 70 86 C54 86 42 84 32 82 Z"
          fill="url(#pipCoatGrad)"
          stroke="#475569"
          strokeWidth="2.5"
        />
        {/* Coat Lapels */}
        <path d="M50 84 L70 104 L90 84" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Coat Buttons */}
        <circle cx="70" cy="109" r="2" fill="#F59E0B" />
        <circle cx="70" cy="116" r="2" fill="#F59E0B" />

        {/* Pocket with Mini Test Tube */}
        <rect x="84" y="97" width="14" height="12" rx="2" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
        <rect x="88" y="92" width="3" height="7" rx="1.5" fill="#10B981" />
        <circle cx="89.5" cy="94" r="0.8" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />

        {/* Eyes (With Natural Blinking Animation) */}
        {!isBlinking ? (
          <g>
            {/* Left Eye */}
            <circle cx="52" cy="64" r="8" fill="#1E1B4B" />
            <circle cx="55" cy="61" r="3" fill="#FFFFFF" />
            <circle cx="50" cy="66" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="88" cy="64" r="8" fill="#1E1B4B" />
            <circle cx="91" cy="61" r="3" fill="#FFFFFF" />
            <circle cx="86" cy="66" r="1.5" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            {/* Left Eye Blink */}
            <path d="M44 64 Q52 69 60 64" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            {/* Right Eye Blink */}
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

        {/* Scientist Goggles */}
        {gogglesOn && (
          <g
            onClick={(e) => {
              e.stopPropagation();
              sounds.pop();
              setGogglesOn(!gogglesOn);
            }}
            className="cursor-pointer"
          >
            {/* Strap */}
            <path d="M22 54 C35 50 105 50 118 54" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
            {/* Left Lens */}
            <circle cx="52" cy="52" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="48" cy="48" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            {/* Right Lens */}
            <circle cx="88" cy="52" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="84" cy="48" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            {/* Bridge */}
            <path d="M66 52 Q70 50 74 52" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
