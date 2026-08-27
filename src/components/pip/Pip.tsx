import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipState, PipMood } from '@/types';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useProgressStore } from '@/stores/progressStore';
import { usePipStore } from '@/stores/pipStore';

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

      const maxRadius = 4.2;
      const factor = Math.min(distance / 28, maxRadius);
      setEyeOffset({
        x: (dx / distance) * factor,
        y: (dy / distance) * factor,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── 2. NATURAL CALM BLINKING (Every 4.5s) ──
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // ── 3. SPEECH LIP-SYNC VISEMES ──
  useEffect(() => {
    let visemeTimer: number;
    if (currentState === 'speaking' || isSpeakingStore) {
      const visemes: ('closed' | 'open-small' | 'open-wide' | 'smile')[] = [
        'open-small',
        'open-wide',
        'open-small',
        'smile',
        'closed',
      ];
      let i = 0;
      visemeTimer = window.setInterval(() => {
        setMouthViseme(visemes[i % visemes.length]);
        i++;
      }, 140);
    } else {
      setMouthViseme('smile');
    }
    return () => clearInterval(visemeTimer);
  }, [currentState, isSpeakingStore]);

  // ── 4. CLICK / TAP INTERACTION ──
  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;

    if (currentState === 'high_five' || isHighFiveReadyStore) {
      handleHighFiveClick(e);
      return;
    }

    const phrase = handleMascotClick();
    const icons = ['⭐', '❤️', '💡', '🧪', '✨', '🥽', '🎉', '🪙'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newId = Date.now() + Math.random();

    setTapEffect((prev) => [...prev.slice(-3), { id: newId, icon: randomIcon }]);
    setTimeout(() => {
      setTapEffect((prev) => prev.filter((p) => p.id !== newId));
    }, 1100);
  };

  const handleHighFiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.fanfare();
    setHighFiveImpact(true);
    completeHighFive();
    if (onHighFive) onHighFive();
    setTimeout(() => setHighFiveImpact(false), 1200);
  };

  // ── 5. STATE MACHINE ANIMATIONS (CALM DEFAULT, INTENTIONAL MOVEMENT) ──
  const bodyVariants = {
    idle: {
      scaleY: [1, 1.018, 1],
      y: [0, -2, 0],
      transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
    },
    curious: {
      rotate: [-3, 6, -3],
      y: -4,
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
      rotate: -4,
      y: -3,
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
    correct: {
      y: [0, -10, 0],
      scale: [1, 1.08, 1],
      transition: { duration: 0.7, ease: 'easeOut' },
    },
    try_again: {
      rotate: [-2, 2, -2],
      y: [0, -2, 0],
      transition: { duration: 1.4, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -18, 0],
      rotate: [-6, 6, -6],
      scale: [1, 1.12, 1],
      transition: { duration: 0.6, repeat: 3, ease: 'easeOut' },
    },
    high_five: {
      scale: 1.05,
      y: -3,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    speaking: {
      y: [0, -3, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const isTeaching = currentState === 'teaching' || showPointerStick;
  const isListening = currentState === 'listening' || isListeningStore;
  const isHighFive = currentState === 'high_five' || isHighFiveReadyStore;

  return (
    <motion.div
      ref={containerRef}
      onClick={handleClick}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      className={`relative inline-flex items-center justify-center select-none ${interactive ? 'cursor-pointer' : ''} ${sizeClasses[size]} ${className}`}
      variants={bodyVariants}
      animate={currentState}
      title={interactive ? "Pip the Learning Companion • Tap to interact!" : undefined}
    >
      {/* ── HIGH-FIVE IMPACT BURST ── */}
      <AnimatePresence>
        {highFiveImpact && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none text-4xl filter drop-shadow-lg"
          >
            ✨💥✋⭐
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING TAP ICONS ── */}
      <AnimatePresence>
        {tapEffect.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -45, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute text-2xl pointer-events-none z-50 select-none filter drop-shadow-md"
            style={{ top: '10%' }}
          >
            {p.icon}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* ── LISTENING ACOUSTIC WAVE AURA ── */}
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border-4 border-indigo-400/60 bg-indigo-400/10 pointer-events-none z-0 filter blur-[2px]"
        />
      )}

      <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-lg overflow-visible relative z-10">
        <defs>
          <linearGradient id="pipBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <linearGradient id="pipCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="pipAstroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="pipParkaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="pipGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="pipDetectiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <radialGradient id="pipCheekGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pipGogglesGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id="pipVisorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* ── LAYER 1: GROUND SHADOW ── */}
        <ellipse cx="70" cy="128" rx="42" ry="7" fill="#000000" fillOpacity="0.14" />

        {/* ── LAYER 2: EXPRESSIVE EARS (ATTENTIVE LISTENING / PERKED) ── */}
        {/* Left Ear */}
        <motion.g
          animate={
            isListening
              ? { rotate: 18, x: 4, y: 2 }
              : currentState === 'curious'
              ? { rotate: 12, y: -2 }
              : currentState === 'celebrating' || currentState === 'correct'
              ? { rotate: [-4, 8, -4], y: -4 }
              : currentState === 'thinking'
              ? { rotate: -8, y: 1 }
              : { rotate: 0, x: 0, y: 0 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '32px 30px' }}
        >
          <path d="M30 36 C20 22 28 8 36 18 C40 24 38 32 30 36 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
          <path d="M30 30 C25 20 30 14 34 20" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={
            isListening
              ? { rotate: -18, x: -4, y: 2 }
              : currentState === 'curious'
              ? { rotate: -4, y: 1 }
              : currentState === 'celebrating' || currentState === 'correct'
              ? { rotate: [4, -8, 4], y: -4 }
              : currentState === 'thinking'
              ? { rotate: 12, y: -2 }
              : { rotate: 0, x: 0, y: 0 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '108px 30px' }}
        >
          <path d="M110 36 C120 22 112 8 104 18 C100 24 102 32 110 36 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
          <path d="M110 30 C115 20 110 14 106 20" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* ── LAYER 3: ROUND MASCOT BODY & HEAD ── */}
        <path
          d="M70 18 C38 18 20 44 20 76 C20 108 40 124 70 124 C100 124 120 108 120 76 C120 44 102 18 70 18 Z"
          fill="url(#pipBodyGrad)"
          stroke="#4C1D95"
          strokeWidth="3.5"
        />

        {/* Antenna Spark */}
        <path d="M70 18 Q72 8 76 6" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="77" cy="6" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />

        {/* ── LAYER 4: PROPERLY FITTED TAILORED WARDROBE ── */}
        {currentOutfit === 'lab-coat' && (
          <g>
            {/* Coat Body following natural shoulder contour */}
            <path
              d="M28 82 C28 108 42 123 70 123 C98 123 112 108 112 82 C98 85 86 87 70 87 C54 87 42 85 28 82 Z"
              fill="url(#pipCoatGrad)"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Natural V-Neck Lapels */}
            <path d="M46 84 L70 105 L94 84" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="70" cy="110" r="2" fill="#F59E0B" />
            <circle cx="70" cy="117" r="2" fill="#F59E0B" />
            {/* Breast Pocket with Mini Pipette */}
            <rect x="84" y="96" width="14" height="12" rx="2" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
            <rect x="88" y="91" width="3.5" height="7" rx="1.5" fill="#10B981" />
          </g>
        )}

        {currentOutfit === 'astronaut' && (
          <g>
            <path
              d="M28 80 C28 110 42 124 70 124 C98 124 112 110 112 80 C98 84 86 86 70 86 C54 86 42 84 28 80 Z"
              fill="url(#pipAstroGrad)"
              stroke="#075985"
              strokeWidth="3"
            />
            {/* Center Dial & Life Support Badge */}
            <rect x="56" y="95" width="28" height="18" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="64" cy="104" r="2.5" fill="#22C55E" />
            <circle cx="76" cy="104" r="2.5" fill="#EF4444" />
          </g>
        )}

        {currentOutfit === 'winter-parka' && (
          <g>
            <path
              d="M28 80 C28 110 42 124 70 124 C98 124 112 110 112 80 C98 84 86 86 70 86 C54 86 42 84 28 80 Z"
              fill="url(#pipParkaGrad)"
              stroke="#881337"
              strokeWidth="3"
            />
            {/* Fluffy Fur Collar */}
            <path d="M38 82 C55 94 85 94 102 82" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
            <circle cx="70" cy="106" r="3" fill="#FFFFFF" />
            <circle cx="70" cy="116" r="3" fill="#FFFFFF" />
          </g>
        )}

        {currentOutfit === 'gold-champion' && (
          <g>
            <path
              d="M28 80 C28 110 42 124 70 124 C98 124 112 110 112 80 C98 84 86 86 70 86 C54 86 42 84 28 80 Z"
              fill="url(#pipGoldGrad)"
              stroke="#CA8A04"
              strokeWidth="3"
            />
            <circle cx="70" cy="104" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <path d="M70 99 L72 103 L76 104 L73 107 L74 111 L70 108 L66 111 L67 107 L64 104 L68 103 Z" fill="#EAB308" />
          </g>
        )}

        {currentOutfit === 'detective' && (
          <g>
            <path
              d="M28 80 C28 110 42 124 70 124 C98 124 112 110 112 80 C98 84 86 86 70 86 C54 86 42 84 28 80 Z"
              fill="url(#pipDetectiveGrad)"
              stroke="#92400E"
              strokeWidth="3"
            />
            <path d="M46 84 L70 104 L94 84" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="112" r="3" fill="#78350F" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />

        {/* ── LAYER 5: EYES & PUPILS (INTELLIGENT CURSOR/CONTENT TRACKING) ── */}
        {!isBlinking ? (
          <g>
            {/* Left Eye White Base */}
            <circle cx="52" cy="64" r="9.5" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" />
            {/* Left Moving Pupil */}
            <circle cx={52 + eyeOffset.x} cy={64 + eyeOffset.y} r="6" fill="#1E1B4B" />
            {/* Reflections */}
            <circle cx={54 + eyeOffset.x * 0.8} cy={62 + eyeOffset.y * 0.8} r="2.2" fill="#FFFFFF" />
            <circle cx={50 + eyeOffset.x * 0.8} cy={66 + eyeOffset.y * 0.8} r="1.2" fill="#FFFFFF" />

            {/* Right Eye White Base */}
            <circle cx="88" cy="64" r="9.5" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" />
            {/* Right Moving Pupil */}
            <circle cx={88 + eyeOffset.x} cy={64 + eyeOffset.y} r="6" fill="#1E1B4B" />
            {/* Reflections */}
            <circle cx={90 + eyeOffset.x * 0.8} cy={62 + eyeOffset.y * 0.8} r="2.2" fill="#FFFFFF" />
            <circle cx={86 + eyeOffset.x * 0.8} cy={66 + eyeOffset.y * 0.8} r="1.2" fill="#FFFFFF" />
          </g>
        ) : (
          <g>
            <path d="M43 64 Q52 70 61 64" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M79 64 Q88 70 97 64" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {/* ── LAYER 6: MOUTH & SPEECH VISEMES ── */}
        {currentState === 'speaking' || isSpeakingStore ? (
          mouthViseme === 'open-wide' ? (
            <ellipse cx="70" cy="78" rx="7" ry="5.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'open-small' ? (
            <ellipse cx="70" cy="77" rx="5" ry="3.5" fill="#BE185D" stroke="#1E1B4B" strokeWidth="2" />
          ) : mouthViseme === 'closed' ? (
            <line x1="64" y1="76" x2="76" y2="76" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M62 74 Q70 82 78 74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="#BE185D" />
          )
        ) : currentState === 'try_again' ? (
          <path d="M64 77 Q70 79 76 77" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        ) : currentState === 'thinking' ? (
          <path d="M63 76 Q70 77 77 74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        ) : currentState === 'listening' ? (
          <path d="M65 76 Q70 79 75 76" stroke="#1E1B4B" strokeWidth="2.2" strokeLinecap="round" fill="#BE185D" />
        ) : (
          <path d="M62 74 Q70 82 78 74" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="#BE185D" />
        )}

        {/* ── LAYER 7: HEADWEAR & GLASSES ── */}
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
            {/* Glowing Target Ring */}
            <circle cx="122" cy="70" r="16" fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
            {/* Raised Hand Arm */}
            <line x1="105" y1="90" x2="122" y2="70" stroke="#8B5CF6" strokeWidth="9" strokeLinecap="round" />
            {/* Open Palm */}
            <circle cx="122" cy="70" r="9" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2.5" />
            <circle cx="122" cy="62" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx="128" cy="65" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
            <circle cx="116" cy="65" r="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1.5" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};
