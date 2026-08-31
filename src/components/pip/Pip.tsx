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

      const maxRadius = 4.0;
      const factor = Math.min(distance / 30, maxRadius);
      setEyeOffset({
        x: (dx / distance) * factor,
        y: (dy / distance) * factor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── 2. NATURAL CALM BLINKING (Every 4.8s) ──
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4800);
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
      }, 150);
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
    const icons = ['⭐', '❤️', '💡', '🧪', '✨', '🥽', '🎉', '🪙', '🚀', '🏔️', '🌊'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newId = Date.now() + Math.random();

    setTapEffect((prev) => [...prev.slice(-3), { id: newId, icon: randomIcon }]);
    setTimeout(() => {
      setTapEffect((prev) => prev.filter((p) => p.id !== newId));
    }, 1100);

    // Speak cheerful reaction with voiceAssistant
    sounds.bubble();
    const greetings = [
      "I'm Pip, your science buddy!",
      "Ready to discover something amazing?",
      "Science is full of superpowers!",
      "Looking sharp and ready to learn!",
      "High five for curiosity!",
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

  // ── 5. ANIMATIONS ──
  const bodyVariants = {
    idle: {
      scaleY: [1, 1.015, 1],
      y: [0, -1.5, 0],
      transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
    },
    curious: {
      rotate: [-3, 6, -3],
      y: -3,
      transition: { duration: 1.2, ease: 'easeOut' },
    },
    teaching: {
      y: [0, -3, 0],
      rotate: [0, 2, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
    },
    listening: {
      y: 2,
      scale: 1.03,
      rotate: -2,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    thinking: {
      rotate: [0, -4, 0],
      y: [0, -2, 0],
      transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
    },
    correct: {
      y: [0, -12, 0],
      scale: [1, 1.08, 1],
      rotate: [0, -4, 4, 0],
      transition: { duration: 0.7, ease: 'easeOut' },
    },
    try_again: {
      x: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -14, 0],
      rotate: [0, -6, 6, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' },
    },
    high_five: {
      scale: [1, 1.04, 1],
      y: [0, -2, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    speaking: {
      scaleY: [1, 1.02, 1],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
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
      style={{ filter: 'drop-shadow(0 6px 12px rgba(109, 40, 217, 0.18))' }}
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
          <linearGradient id="pipBodyGrad" x1="20" y1="20" x2="120" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="0.6" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>

          <radialGradient id="pipBellyGrad" cx="70" cy="85" r="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EDE9FE" />
            <stop offset="0.8" stopColor="#DDD6FE" />
            <stop offset="1" stopColor="#C4B5FD" />
          </radialGradient>

          <radialGradient id="pipCheekGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(7 4.5)">
            <stop stopColor="#F472B6" stopOpacity="0.75" />
            <stop offset="1" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="pipCoatGrad" x1="30" y1="80" x2="110" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.9" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="pipGogglesGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="1" stopColor="#0284C7" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="pipVisorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FB7185" stopOpacity="0.9" />
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
            <stop stopColor="#E0F2FE" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="pipDetectiveGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#D97706" />
            <stop offset="1" stopColor="#92400E" />
          </linearGradient>

          <linearGradient id="pipSafariGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#65A30D" />
            <stop offset="1" stopColor="#3F6212" />
          </linearGradient>

          <linearGradient id="pipScubaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#0891B2" />
          </linearGradient>

          <linearGradient id="pipRoyalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id="pipHeroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#EF4444" />
            <stop offset="1" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="pipRaincoatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FACC15" />
            <stop offset="1" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="pipCyberGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="pipNinjaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#18181B" />
            <stop offset="1" stopColor="#27272A" />
          </linearGradient>
        </defs>

        {/* ── LAYER 1: EARS ── */}
        <motion.g
          animate={
            currentState === 'listening'
              ? { rotate: [-10, 10, -10] }
              : currentState === 'curious'
              ? { rotate: -8, y: -2 }
              : { rotate: [-2, 2, -2] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 36px' }}
        >
          <path d="M32 36 C18 16 22 2 36 12 C44 18 42 30 38 38 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <path d="M32 30 C25 18 27 10 35 16 C39 20 38 27 35 32 Z" fill="#DDD6FE" />
        </motion.g>

        <motion.g
          animate={
            currentState === 'listening'
              ? { rotate: [10, -10, 10] }
              : currentState === 'curious'
              ? { rotate: 12, y: -2 }
              : { rotate: [2, -2, 2] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '108px 36px' }}
        >
          <path d="M108 36 C122 16 118 2 104 12 C96 18 98 30 102 38 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2.5" />
          <path d="M108 30 C115 18 113 10 105 16 C101 20 102 27 105 32 Z" fill="#DDD6FE" />
        </motion.g>

        {/* ── LAYER 2: BODY & BELLY ── */}
        <path
          d="M20 72 C20 34 42 16 70 16 C98 16 120 34 120 72 C120 106 98 128 70 128 C42 128 20 106 20 72 Z"
          fill="url(#pipBodyGrad)"
          stroke="#4C1D95"
          strokeWidth="3.5"
        />

        <ellipse cx="70" cy="85" rx="36" ry="32" fill="url(#pipBellyGrad)" />

        {/* Feet / Paws */}
        <ellipse cx="48" cy="126" rx="14" ry="7" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.5" />
        <ellipse cx="92" cy="126" rx="14" ry="7" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.5" />

        {/* ── LAYER 3 & 4: 12 HIGH-FIDELITY FORM-FITTED OUTFITS ── */}
        {currentOutfit === 'lab-coat' && (
          <g>
            <path
              d="M24 80 C24 112 40 126 70 126 C100 126 116 112 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipCoatGrad)"
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            <path d="M42 82 L54 96 L70 88 L86 96 L98 82" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#E2E8F0" />
            <circle cx="70" cy="100" r="2.5" fill="#38BDF8" />
            <circle cx="70" cy="112" r="2.5" fill="#38BDF8" />
            <rect x="84" y="96" width="14" height="12" rx="2" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.5" />
            <line x1="88" y1="94" x2="88" y2="100" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="93" y1="94" x2="93" y2="100" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {currentOutfit === 'detective' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipDetectiveGrad)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            <path d="M42 86 L54 100 L70 92 L86 100 L98 86" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#92400E" />
            <circle cx="62" cy="102" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="102" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="62" cy="112" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="112" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <path d="M30 116 C55 120 85 120 110 116" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <rect x="64" y="114" width="12" height="7" rx="2" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'astronaut' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipAstroGrad)"
              stroke="#075985"
              strokeWidth="2.5"
            />
            <rect x="52" y="94" width="36" height="20" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="60" cy="104" r="3" fill="#22C55E" className="animate-pulse" />
            <circle cx="70" cy="104" r="3" fill="#38BDF8" />
            <circle cx="80" cy="104" r="3" fill="#EF4444" />
          </g>
        )}

        {currentOutfit === 'winter-parka' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipParkaGrad)"
              stroke="#881337"
              strokeWidth="2.5"
            />
            <path d="M34 86 C55 96 85 96 106 86" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx="70" cy="104" r="3" fill="#FEF08A" />
            <circle cx="70" cy="114" r="3" fill="#FEF08A" />
          </g>
        )}

        {currentOutfit === 'gold-champion' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipGoldGrad)"
              stroke="#A16207"
              strokeWidth="2.5"
            />
            <circle cx="70" cy="104" r="8" fill="#FEF08A" stroke="#A16207" strokeWidth="2" />
            <path d="M70 98 L72 102 L77 103 L73 107 L74 112 L70 109 L66 112 L67 107 L63 103 L68 102 Z" fill="#CA8A04" />
          </g>
        )}

        {currentOutfit === 'safari-vest' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipSafariGrad)"
              stroke="#365314"
              strokeWidth="2.5"
            />
            <rect x="36" y="98" width="14" height="14" rx="3" fill="#4D7C0F" stroke="#365314" strokeWidth="1.5" />
            <rect x="90" y="98" width="14" height="14" rx="3" fill="#4D7C0F" stroke="#365314" strokeWidth="1.5" />
            <path d="M70 90 L70 123" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {currentOutfit === 'scuba-suit' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipScubaGrad)"
              stroke="#155E75"
              strokeWidth="2.5"
            />
            {/* Center Neon Oxygen Strip */}
            <path d="M70 88 L70 124" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="104" r="5" fill="#0E7490" stroke="#155E75" strokeWidth="1.5" />
            <circle cx="90" cy="104" r="5" fill="#0E7490" stroke="#155E75" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'royal-cape' && (
          <g>
            <path
              d="M22 84 C22 116 40 128 70 128 C100 128 118 116 118 84 C98 88 86 90 70 90 C54 90 42 88 22 84 Z"
              fill="url(#pipRoyalGrad)"
              stroke="#FDE047"
              strokeWidth="3"
            />
            {/* Gold Trim Collar & Ruby Gem */}
            <path d="M32 86 C55 96 85 96 108 86" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="70" cy="94" r="5" fill="#EF4444" stroke="#FDE047" strokeWidth="1.5" />
          </g>
        )}

        {currentOutfit === 'superhero' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipHeroGrad)"
              stroke="#991B1B"
              strokeWidth="2.5"
            />
            {/* Golden Lightning Crest */}
            <polygon points="72,92 64,104 71,104 67,118 77,102 70,102" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          </g>
        )}

        {currentOutfit === 'raincoat-yellow' && (
          <g>
            <path
              d="M24 80 C24 112 40 126 70 126 C100 126 116 112 116 80 C98 86 86 88 70 88 C54 88 42 86 24 80 Z"
              fill="url(#pipRaincoatGrad)"
              stroke="#CA8A04"
              strokeWidth="2.5"
            />
            <path d="M70 88 L70 126" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="62" cy="102" r="3" fill="#1E293B" />
            <circle cx="62" cy="114" r="3" fill="#1E293B" />
          </g>
        )}

        {currentOutfit === 'cyber-armor' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipCyberGrad)"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Glowing Cyan Arc Reactor */}
            <circle cx="70" cy="104" r="7" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" className="animate-pulse" />
            <circle cx="70" cy="104" r="3" fill="#E0F2FE" />
          </g>
        )}

        {currentOutfit === 'ninja-gi' && (
          <g>
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipNinjaGrad)"
              stroke="#DC2626"
              strokeWidth="2.5"
            />
            {/* Red Ninja Sash */}
            <path d="M30 114 C55 118 85 118 110 114" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />

        {/* ── LAYER 5: EYES & PUPILS ── */}
        {!isBlinking ? (
          <g>
            {/* Left Eye */}
            <circle cx="52" cy="64" r="9.5" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx={52 + eyeOffset.x} cy={64 + eyeOffset.y} r="6" fill="#1E1B4B" />
            <circle cx={54 + eyeOffset.x * 0.8} cy={62 + eyeOffset.y * 0.8} r="2.2" fill="#FFFFFF" />
            <circle cx={50 + eyeOffset.x * 0.8} cy={66 + eyeOffset.y * 0.8} r="1.2" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="88" cy="64" r="9.5" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx={88 + eyeOffset.x} cy={64 + eyeOffset.y} r="6" fill="#1E1B4B" />
            <circle cx={90 + eyeOffset.x * 0.8} cy={62 + eyeOffset.y * 0.8} r="2.2" fill="#FFFFFF" />
            <circle cx={86 + eyeOffset.x * 0.8} cy={66 + eyeOffset.y * 0.8} r="1.2" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <path d="M43 64 Q52 70 61 64" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M79 64 Q88 70 97 64" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {/* ── LAYER 6: MOUTH ── */}
        {currentState === 'speaking' && isSpeakingStore ? (
          mouthViseme === 'open-wide' ? (
            <ellipse cx="70" cy="78" rx="7" ry="5.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'open-small' ? (
            <ellipse cx="70" cy="77" rx="5" ry="3.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'closed' ? (
            <line x1="64" y1="76" x2="76" y2="76" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M62 75 Q70 81 78 75" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )
        ) : currentState === 'try_again' ? (
          <path d="M64 77 Q70 79 76 77" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : currentState === 'thinking' ? (
          <path d="M63 76 Q70 77 77 74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : currentState === 'listening' ? (
          <path d="M65 76 Q70 79 75 76" stroke="#1E1B4B" strokeWidth="2.2" strokeLinecap="round" fill="#BE185D" />
        ) : (
          <path d="M63 75 Q70 82 77 75" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* ── LAYER 7: 11 ALIGNED HEADWEAR & ACCESSORIES ── */}
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

        {currentHeadwear === 'party-hat' && (
          <g>
            <polygon points="52,26 70,2 88,26" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <path d="M57,20 L83,20" stroke="#FBBF24" strokeWidth="3" />
            <path d="M63,12 L77,12" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="70" cy="2" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
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
            <polygon points="40,28 45,14 58,22 70,8 82,22 95,14 100,28" fill="url(#pipGoldGrad)" stroke="#A16207" strokeWidth="2" />
            <circle cx="45" cy="14" r="2.5" fill="#EF4444" />
            <circle cx="70" cy="8" r="3" fill="#3B82F6" />
            <circle cx="95" cy="14" r="2.5" fill="#10B981" />
          </g>
        )}

        {currentHeadwear === 'fedora' && (
          <g>
            <ellipse cx="70" cy="26" rx="42" ry="7" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <path d="M46 26 C46 12 56 8 70 8 C84 8 94 12 94 26 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <rect x="46" y="22" width="48" height="4" fill="#78350F" />
          </g>
        )}

        {currentHeadwear === 'headphones' && (
          <g>
            <path d="M24 64 C24 24 116 24 116 64" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <rect x="18" y="56" width="12" height="22" rx="6" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
            <rect x="110" y="56" width="12" height="22" rx="6" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
          </g>
        )}

        {currentHeadwear === 'snorkel' && (
          <g>
            <rect x="36" y="48" width="68" height="24" rx="8" fill="url(#pipGogglesGrad)" stroke="#0E7490" strokeWidth="2.5" />
            <path d="M104 60 C114 60 118 45 118 20 C118 10 110 6 104 6" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="104" cy="6" rx="4" ry="2" fill="#CA8A04" />
          </g>
        )}

        {currentHeadwear === 'astronaut-helmet' && (
          <g>
            <ellipse cx="70" cy="60" rx="44" ry="40" fill="url(#pipVisorGrad)" stroke="#0284C7" strokeWidth="3" opacity="0.85" />
            <ellipse cx="56" cy="48" rx="14" ry="6" fill="#FFFFFF" opacity="0.6" />
          </g>
        )}

        {currentHeadwear === 'fur-hat' && (
          <g>
            <path d="M38 28 C38 10 52 4 70 4 C88 4 102 10 102 28 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            <rect x="34" y="24" width="72" height="10" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            {/* Ear Flaps */}
            <rect x="34" y="32" width="10" height="16" rx="3" fill="#FDE68A" />
            <rect x="96" y="32" width="10" height="16" rx="3" fill="#FDE68A" />
          </g>
        )}

        {currentHeadwear === 'ninja-headband' && (
          <g>
            <rect x="28" y="34" width="84" height="12" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="62" y="36" width="16" height="8" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            {/* Flying Tie Tails */}
            <path d="M112 40 C122 36 130 46 136 42" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M112 44 C120 42 126 54 134 50" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
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
