import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipState, PipMood } from '@/types';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useProgressStore } from '@/stores/progressStore';
import { usePipStore } from '@/stores/pipStore';
import { Sparkles, Shirt } from 'lucide-react';

export interface PipProps {
  mood?: PipMood;
  stateOverride?: PipState;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGoggles?: boolean;
  showPointerStick?: boolean;
  interactive?: boolean;
  outfitOverride?: string;
  headwearOverride?: string;
  onHighFive?: () => void;
  onOpenWardrobe?: () => void;
}

export const Pip: React.FC<PipProps> = ({
  mood = 'idle',
  stateOverride,
  className = '',
  size = 'md',
  showGoggles = true,
  showPointerStick = false,
  interactive = true,
  outfitOverride,
  headwearOverride,
  onHighFive,
  onOpenWardrobe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store bindings
  const storeOutfit = useProgressStore((s) => s.equippedOutfit);
  const storeHeadwear = useProgressStore((s) => s.equippedHeadwear);
  const storeState = usePipStore((s) => s.state);
  const isSpeakingStore = usePipStore((s) => s.isSpeaking);
  const isListeningStore = usePipStore((s) => s.isListening);
  const isHighFiveReadyStore = usePipStore((s) => s.isHighFiveReady);
  const handleMascotClick = usePipStore((s) => s.handleMascotClick);
  const completeHighFive = usePipStore((s) => s.completeHighFive);

  // Active state resolution
  let currentState: PipState = stateOverride || storeState || 'idle';
  if (mood && !stateOverride) {
    if (mood === 'explaining' || mood === 'hinting') currentState = 'teaching';
    else if (mood === 'concerned') currentState = 'try_again';
    else if (mood === 'encouraging') currentState = 'correct';
    else currentState = mood as PipState;
  }

  const currentOutfit = outfitOverride || storeOutfit || 'lab-coat';
  const currentHeadwear = headwearOverride || storeHeadwear || (showGoggles ? 'goggles' : 'none');

  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthViseme, setMouthViseme] = useState<'closed' | 'open-small' | 'open-wide' | 'smile'>('smile');
  const [tapEffect, setTapEffect] = useState<{ id: number; icon: string }[]>([]);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highFiveImpact, setHighFiveImpact] = useState(false);
  const [showWardrobeQuickBtn, setShowWardrobeQuickBtn] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  // ── 1. MOUSE CURSOR PUPIL TRACKING ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pipCenterX = rect.left + rect.width / 2;
      const pipCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - pipCenterX;
      const dy = e.clientY - pipCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance === 0) return;

      const maxRadius = 3.5;
      const factor = Math.min(distance / 35, maxRadius);
      setEyeOffset({
        x: (dx / distance) * factor,
        y: (dy / distance) * factor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── 2. ADORABLE BLINKING (Every 4.5s) ──
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // ── 3. LIP-SYNC VISEMES ──
  useEffect(() => {
    let visemeTimer: number | null = null;
    if (currentState === 'speaking' || isSpeakingStore) {
      const visemes: ('closed' | 'open-small' | 'open-wide' | 'smile')[] = [
        'open-small',
        'open-wide',
        'open-small',
        'smile',
        'open-small',
      ];
      let i = 0;
      visemeTimer = window.setInterval(() => {
        setMouthViseme(visemes[i % visemes.length]);
        i++;
      }, 140);
    } else {
      setMouthViseme('smile');
    }
    return () => {
      if (visemeTimer) clearInterval(visemeTimer);
    };
  }, [currentState, isSpeakingStore]);

  // ── 4. CLICK / TAP INTERACTION ──
  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;

    if (currentState === 'high_five' || isHighFiveReadyStore) {
      handleHighFiveClick(e);
      return;
    }

    const phrase = handleMascotClick();
    const icons = ['⭐', '❤️', '💡', '🧪', '✨', '🥽', '🎉', '🚀'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newId = Date.now() + Math.random();

    setTapEffect((prev) => [...prev.slice(-3), { id: newId, icon: randomIcon }]);
    setTimeout(() => {
      setTapEffect((prev) => prev.filter((p) => p.id !== newId));
    }, 1100);

    sounds.bubble();
    const greetings = [
      "Hi! I'm Pip! Let's explore science together!",
      "You're doing awesome, Young Scientist!",
      "What should we discover next? 🔬",
      "Science is full of amazing superpowers! ✨",
      "High five for curiosity! ✋",
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    voiceAssistant.speak(picked);
  };

  const handleHighFiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.fanfare();
    setHighFiveImpact(true);
    completeHighFive();
    if (onHighFive) onHighFive();
    setTimeout(() => setHighFiveImpact(false), 1200);
  };

  // ── 5. CUTE ANIMATIONS ──
  const bodyVariants = {
    idle: {
      scaleY: [1, 1.025, 1],
      y: [0, -2, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    },
    curious: {
      rotate: [-4, 6, -4],
      y: -4,
      transition: { duration: 1.2, ease: 'easeOut' },
    },
    teaching: {
      y: [0, -4, 0],
      rotate: [0, 2, 0],
      transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
    },
    listening: {
      y: 2,
      scale: 1.04,
      rotate: -3,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    thinking: {
      rotate: [0, -5, 0],
      y: [0, -3, 0],
      transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
    },
    correct: {
      y: [0, -14, 0],
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    try_again: {
      x: [0, -4, 4, -2, 2, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -16, 0],
      rotate: [0, -8, 8, 0],
      scale: [1, 1.12, 1],
      transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1.0, ease: 'easeInOut' },
    },
    high_five: {
      scale: [1, 1.05, 1],
      y: [0, -3, 0],
      transition: { duration: 1.0, repeat: Infinity, ease: 'easeInOut' },
    },
    speaking: {
      scaleY: [1, 1.03, 1],
      transition: { duration: 0.35, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const isTeaching = currentState === 'teaching' || showPointerStick;
  const isHighFive = currentState === 'high_five' || isHighFiveReadyStore;

  return (
    <motion.div
      ref={containerRef}
      variants={bodyVariants}
      animate={currentState}
      onClick={handleClick}
      onMouseEnter={() => setShowWardrobeQuickBtn(true)}
      onMouseLeave={() => setShowWardrobeQuickBtn(false)}
      className={`relative select-none inline-block ${interactive ? 'cursor-pointer' : 'cursor-default'} ${sizeClasses[size]} ${className}`}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(124, 58, 237, 0.22))' }}
    >
      {/* Tap Floating Emojis */}
      <AnimatePresence>
        {tapEffect.map((eff) => (
          <motion.span
            key={eff.id}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -45, scale: 1.4, x: (Math.random() - 0.5) * 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl pointer-events-none z-30"
          >
            {eff.icon}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* High-Five Golden Starburst */}
      <AnimatePresence>
        {highFiveImpact && (
          <motion.div
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: 2.2, opacity: 0, rotate: 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute -top-4 -right-4 z-40 pointer-events-none"
          >
            <Sparkles className="w-16 h-16 text-amber-400 fill-amber-300 filter drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Vector SVG */}
      <svg
        viewBox="-40 -20 220 180"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pipBodyGrad" x1="20" y1="16" x2="120" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C4B5FD" />
            <stop offset="0.4" stopColor="#A78BFA" />
            <stop offset="0.8" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>

          <radialGradient id="pipBellyGrad" cx="70" cy="88" r="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#EDE9FE" />
            <stop offset="1" stopColor="#DDD6FE" />
          </radialGradient>

          <radialGradient id="pipCheekGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(8 5)">
            <stop stopColor="#FB7185" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="pipCoatGrad" x1="30" y1="80" x2="110" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.9" stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="pipGogglesGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="pipVisorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F43F5E" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FB7185" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="pipGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FDE047" />
            <stop offset="1" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="pipParkaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#BE123C" />
          </linearGradient>

          <linearGradient id="pipAstroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F0F9FF" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="pipDetectiveGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="pipSafariGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#84CC16" />
            <stop offset="1" stopColor="#4D7C0F" />
          </linearGradient>

          <linearGradient id="pipScubaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#0891B2" />
          </linearGradient>

          <linearGradient id="pipRoyalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#5B21B6" />
          </linearGradient>

          <linearGradient id="pipHeroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#EF4444" />
            <stop offset="1" stopColor="#B91C1C" />
          </linearGradient>

          <linearGradient id="pipRaincoatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FDE047" />
            <stop offset="1" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="pipCyberGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="pipNinjaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#27272A" />
            <stop offset="1" stopColor="#09090B" />
          </linearGradient>
        </defs>

        {/* ── LAYER 1: CUTE TWITCHING EARS ── */}
        <motion.g
          animate={
            currentState === 'listening'
              ? { rotate: [-12, 12, -12] }
              : currentState === 'curious'
              ? { rotate: -10, y: -2 }
              : { rotate: [-3, 3, -3] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '34px 34px' }}
        >
          <path d="M34 36 C18 14 24 2 38 10 C46 16 44 28 40 38 Z" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="2.5" />
          <path d="M34 30 C26 18 28 10 36 16 C40 20 39 26 36 32 Z" fill="#DDD6FE" />
        </motion.g>

        <motion.g
          animate={
            currentState === 'listening'
              ? { rotate: [12, -12, 12] }
              : currentState === 'curious'
              ? { rotate: 12, y: -2 }
              : { rotate: [3, -3, 3] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '106px 34px' }}
        >
          <path d="M106 36 C122 14 116 2 102 10 C94 16 96 28 100 38 Z" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="2.5" />
          <path d="M106 30 C114 18 112 10 104 16 C100 20 101 26 104 32 Z" fill="#DDD6FE" />
        </motion.g>

        {/* ── LAYER 2: CHUBBY BODY & BELLY ── */}
        <path
          d="M20 70 C20 32 42 16 70 16 C98 16 120 32 120 70 C120 104 98 128 70 128 C42 128 20 104 20 70 Z"
          fill="url(#pipBodyGrad)"
          stroke="#5B21B6"
          strokeWidth="3.5"
        />

        {/* Cute Soft Belly */}
        <ellipse cx="70" cy="86" rx="36" ry="32" fill="url(#pipBellyGrad)" />

        {/* Little Paws / Feet */}
        <ellipse cx="48" cy="126" rx="14" ry="7" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2.5" />
        <ellipse cx="92" cy="126" rx="14" ry="7" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2.5" />

        {/* ── LAYER 3 & 4: ORGANICALLY FITTED OUTFITS ── */}
        {currentOutfit === 'lab-coat' && (
          <g>
            <path
              d="M24 78 C24 110 40 126 70 126 C100 126 116 110 116 78 C98 84 86 86 70 86 C54 86 42 84 24 78 Z"
              fill="url(#pipCoatGrad)"
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            {/* Blue Collar V-Neck */}
            <path d="M42 80 L54 94 L70 86 L86 94 L98 80" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#E2E8F0" />
            <circle cx="70" cy="98" r="2.5" fill="#38BDF8" />
            <circle cx="70" cy="110" r="2.5" fill="#38BDF8" />
            <rect x="84" y="94" width="14" height="12" rx="2" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="88" y1="92" x2="88" y2="98" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="93" y1="92" x2="93" y2="98" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {currentOutfit === 'detective' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipDetectiveGrad)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            <path d="M42 82 L54 96 L70 88 L86 96 L98 82" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#92400E" />
            <circle cx="62" cy="98" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="98" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="62" cy="108" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="108" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <path d="M30 114 C55 118 85 118 110 114" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <rect x="64" y="112" width="12" height="7" rx="2" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'astronaut' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipAstroGrad)"
              stroke="#0369A1"
              strokeWidth="2.5"
            />
            <rect x="52" y="92" width="36" height="20" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="60" cy="102" r="3" fill="#22C55E" className="animate-pulse" />
            <circle cx="70" cy="102" r="3" fill="#38BDF8" />
            <circle cx="80" cy="102" r="3" fill="#EF4444" />
          </g>
        )}

        {currentOutfit === 'winter-parka' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipParkaGrad)"
              stroke="#881337"
              strokeWidth="2.5"
            />
            <path d="M34 82 C55 92 85 92 106 82" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
            <circle cx="70" cy="100" r="3" fill="#FEF08A" />
            <circle cx="70" cy="110" r="3" fill="#FEF08A" />
          </g>
        )}

        {currentOutfit === 'gold-champion' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipGoldGrad)"
              stroke="#A16207"
              strokeWidth="2.5"
            />
            <circle cx="70" cy="102" r="8" fill="#FEF08A" stroke="#A16207" strokeWidth="2" />
            <path d="M70 96 L72 100 L77 101 L73 105 L74 110 L70 107 L66 110 L67 105 L63 101 L68 100 Z" fill="#CA8A04" />
          </g>
        )}

        {currentOutfit === 'safari-vest' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipSafariGrad)"
              stroke="#365314"
              strokeWidth="2.5"
            />
            <rect x="36" y="94" width="14" height="14" rx="3" fill="#4D7C0F" stroke="#365314" strokeWidth="1.5" />
            <rect x="90" y="94" width="14" height="14" rx="3" fill="#4D7C0F" stroke="#365314" strokeWidth="1.5" />
            <path d="M70 88 L70 121" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {currentOutfit === 'scuba-suit' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipScubaGrad)"
              stroke="#155E75"
              strokeWidth="2.5"
            />
            <path d="M70 86 L70 122" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="48" cy="100" r="5" fill="#0E7490" stroke="#155E75" strokeWidth="1.5" />
            <circle cx="92" cy="100" r="5" fill="#0E7490" stroke="#155E75" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'royal-cape' && (
          <g>
            <path
              d="M22 80 C22 114 40 126 70 126 C100 126 118 114 118 80 C98 86 86 88 70 88 C54 88 42 86 22 80 Z"
              fill="url(#pipRoyalGrad)"
              stroke="#FDE047"
              strokeWidth="3"
            />
            <path d="M32 82 C55 92 85 92 108 82" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="70" cy="90" r="5" fill="#EF4444" stroke="#FDE047" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'superhero' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipHeroGrad)"
              stroke="#991B1B"
              strokeWidth="2.5"
            />
            <polygon points="72,90 64,102 71,102 67,116 77,100 70,100" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          </g>
        )}

        {currentOutfit === 'raincoat-yellow' && (
          <g>
            <path
              d="M24 78 C24 110 40 126 70 126 C100 126 116 110 116 78 C98 84 86 86 70 86 C54 86 42 84 24 78 Z"
              fill="url(#pipRaincoatGrad)"
              stroke="#CA8A04"
              strokeWidth="2.5"
            />
            <path d="M70 86 L70 124" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="62" cy="98" r="3" fill="#1E293B" />
            <circle cx="62" cy="110" r="3" fill="#1E293B" />
          </g>
        )}

        {currentOutfit === 'cyber-armor' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipCyberGrad)"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <circle cx="70" cy="102" r="7" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" className="animate-pulse" />
            <circle cx="70" cy="102" r="3" fill="#E0F2FE" />
          </g>
        )}

        {currentOutfit === 'ninja-gi' && (
          <g>
            <path
              d="M24 80 C24 110 40 124 70 124 C100 124 116 110 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipNinjaGrad)"
              stroke="#DC2626"
              strokeWidth="2.5"
            />
            <path d="M30 112 C55 116 85 116 110 112" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="8" ry="5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="8" ry="5" fill="url(#pipCheekGrad)" />

        {/* ── LAYER 5: BIG SPARKLING ANIME EYES ── */}
        {!isBlinking ? (
          <g>
            {/* Left Eye */}
            <circle cx="52" cy="62" r="10" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.8" />
            <circle cx={52 + eyeOffset.x} cy={62 + eyeOffset.y} r="6.5" fill="#1E1B4B" />
            {/* Double Sparkle Highlights */}
            <circle cx={54 + eyeOffset.x * 0.8} cy={60 + eyeOffset.y * 0.8} r="2.5" fill="#FFFFFF" />
            <circle cx={50 + eyeOffset.x * 0.8} cy={64 + eyeOffset.y * 0.8} r="1.4" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="88" cy="62" r="10" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.8" />
            <circle cx={88 + eyeOffset.x} cy={62 + eyeOffset.y} r="6.5" fill="#1E1B4B" />
            {/* Double Sparkle Highlights */}
            <circle cx={90 + eyeOffset.x * 0.8} cy={60 + eyeOffset.y * 0.8} r="2.5" fill="#FFFFFF" />
            <circle cx={86 + eyeOffset.x * 0.8} cy={64 + eyeOffset.y * 0.8} r="1.4" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <path d="M43 62 Q52 68 61 62" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M79 62 Q88 68 97 62" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {/* ── LAYER 6: CUTE EXPRESSIVE SMILE ── */}
        {currentState === 'speaking' && isSpeakingStore ? (
          mouthViseme === 'open-wide' ? (
            <ellipse cx="70" cy="76" rx="7" ry="5.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'open-small' ? (
            <ellipse cx="70" cy="75" rx="5" ry="3.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'closed' ? (
            <line x1="64" y1="74" x2="76" y2="74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M62 73 Q70 81 78 73" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="#F472B6" />
          )
        ) : currentState === 'try_again' ? (
          <path d="M64 76 Q70 73 76 76" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : currentState === 'thinking' ? (
          <ellipse cx="73" cy="75" rx="3.5" ry="3" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
        ) : currentState === 'listening' ? (
          <path d="M65 74 Q70 78 75 74" stroke="#1E1B4B" strokeWidth="2.2" strokeLinecap="round" fill="#BE185D" />
        ) : (
          /* Sweet Happy Open Smile */
          <path d="M62 73 Q70 82 78 73" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="#F472B6" />
        )}

        {/* ── LAYER 7: 11 FIT HEADWEARS ── */}
        {currentHeadwear === 'goggles' && (
          <g>
            <path d="M22 52 C35 48 105 48 118 52" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="52" cy="50" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="48" cy="46" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="88" cy="50" r="14" fill="url(#pipGogglesGrad)" stroke="#0284C7" strokeWidth="3" />
            <ellipse cx="84" cy="46" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.8" />
            <path d="M66 50 Q70 48 74 50" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {currentHeadwear === 'party-hat' && (
          <g>
            <polygon points="52,24 70,0 88,24" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <path d="M57,18 L83,18" stroke="#FBBF24" strokeWidth="3" />
            <path d="M63,10 L77,10" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="70" cy="0" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          </g>
        )}

        {currentHeadwear === 'visor' && (
          <g>
            <path d="M26 48 C40 43 100 43 114 48 L110 58 C96 54 44 54 30 58 Z" fill="url(#pipVisorGrad)" stroke="#0284C7" strokeWidth="2" />
            <path d="M36 51 L104 51" stroke="#E0F2FE" strokeWidth="1.5" strokeDasharray="4 2" />
          </g>
        )}

        {currentHeadwear === 'grad-cap' && (
          <g>
            <polygon points="70,10 115,22 70,34 25,22" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="52" y="30" width="36" height="10" rx="3" fill="#334155" />
            <path d="M70 22 L105 30 L105 42" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <circle cx="105" cy="43" r="3" fill="#F59E0B" />
          </g>
        )}

        {currentHeadwear === 'crown' && (
          <g>
            <polygon points="40,26 45,12 58,20 70,6 82,20 95,12 100,26" fill="url(#pipGoldGrad)" stroke="#A16207" strokeWidth="2" />
            <circle cx="45" cy="12" r="2.5" fill="#EF4444" />
            <circle cx="70" cy="6" r="3" fill="#3B82F6" />
            <circle cx="95" cy="12" r="2.5" fill="#10B981" />
          </g>
        )}

        {currentHeadwear === 'fedora' && (
          <g>
            <ellipse cx="70" cy="24" rx="42" ry="7" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <path d="M46 24 C46 10 56 6 70 6 C84 6 94 10 94 24 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <rect x="46" y="20" width="48" height="4" fill="#78350F" />
          </g>
        )}

        {currentHeadwear === 'headphones' && (
          <g>
            <path d="M24 60 C24 20 116 20 116 60" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <rect x="18" y="52" width="12" height="22" rx="6" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
            <rect x="110" y="52" width="12" height="22" rx="6" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
          </g>
        )}

        {currentHeadwear === 'snorkel' && (
          <g>
            <rect x="36" y="46" width="68" height="24" rx="8" fill="url(#pipGogglesGrad)" stroke="#0E7490" strokeWidth="2.5" />
            <path d="M104 58 C114 58 118 43 118 18 C118 8 110 4 104 4" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="104" cy="4" rx="4" ry="2" fill="#CA8A04" />
          </g>
        )}

        {currentHeadwear === 'astronaut-helmet' && (
          <g>
            <ellipse cx="70" cy="58" rx="44" ry="38" fill="url(#pipVisorGrad)" stroke="#0284C7" strokeWidth="3" opacity="0.85" />
            <ellipse cx="56" cy="46" rx="14" ry="6" fill="#FFFFFF" opacity="0.6" />
          </g>
        )}

        {currentHeadwear === 'fur-hat' && (
          <g>
            <path d="M38 26 C38 8 52 2 70 2 C88 2 102 8 102 26 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            <rect x="34" y="22" width="72" height="10" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <rect x="34" y="30" width="10" height="16" rx="3" fill="#FDE68A" />
            <rect x="96" y="30" width="10" height="16" rx="3" fill="#FDE68A" />
          </g>
        )}

        {currentHeadwear === 'ninja-headband' && (
          <g>
            <rect x="28" y="32" width="84" height="12" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="62" y="34" width="16" height="8" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            <path d="M112 38 C122 34 130 44 136 40" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M112 42 C120 40 126 52 134 48" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ── LAYER 8: TEACHER POINTER WAND ── */}
        {isTeaching && (
          <motion.g
            animate={{ rotate: [-3, 7, -3], y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '25px 95px' }}
          >
            <circle cx="26" cy="94" r="7" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
            <line x1="26" y1="94" x2="-22" y2="45" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="26" y1="94" x2="-22" y2="45" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-24" cy="43" r="8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <path d="M-24 38 L-22 42 L-18 43 L-21 46 L-20 50 L-24 47 L-28 50 L-27 46 L-30 43 L-26 42 Z" fill="#EAB308" />
          </motion.g>
        )}

        {/* ── LAYER 9: HIGH-FIVE RAISED HAND ── */}
        {isHighFive && (
          <motion.g
            animate={{ scale: [1, 1.15, 1], rotate: [-4, 6, -4] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '115px 75px' }}
            onClick={handleHighFiveClick}
            className="cursor-pointer"
          >
            <circle cx="122" cy="70" r="16" fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="105" y1="90" x2="122" y2="70" stroke="#8B5CF6" strokeWidth="9" strokeLinecap="round" />
            <circle cx="122" cy="70" r="9" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
            <circle cx="122" cy="62" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx="128" cy="65" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx="116" cy="65" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
          </motion.g>
        )}
      </svg>

      {/* Floating Wardrobe Quick Customizer Button */}
      {showWardrobeQuickBtn && onOpenWardrobe && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenWardrobe();
          }}
          className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg border-2 border-white z-40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Customize Pip's Outfit & Hats!"
        >
          <Shirt className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
};
