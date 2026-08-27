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
      setTimeout(() => setIsBlinking(false), 150);
    }, 4800);
    return () => clearInterval(blinkInterval);
  }, []);

  // ── 3. STRICT SPEECH LIP-SYNC VISEMES (ONLY WHEN ACTUALLY SPEAKING) ──
  useEffect(() => {
    let visemeTimer: number | undefined;
    if (currentState === 'speaking' && isSpeakingStore) {
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

  // ── 5. CALM STATE MACHINE ANIMATIONS (CALM DEFAULT, INTENTIONAL MOVEMENT) ──
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
      y: [0, -16, 0],
      rotate: [-5, 5, -5],
      scale: [1, 1.12, 1],
      transition: { duration: 0.6, repeat: 3, ease: 'easeOut' },
    },
    high_five: {
      scale: 1.05,
      y: -3,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    speaking: {
      y: [0, -2, 0],
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
      whileHover={interactive ? { scale: 1.04 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
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
          animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0.7, 0.3] }}
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
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="pipDetectiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="pipAstroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="pipParkaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="pipGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
          <linearGradient id="pipSafariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="60%" stopColor="#65A30D" />
            <stop offset="100%" stopColor="#365314" />
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
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipCoatGrad)"
              stroke="#334155"
              strokeWidth="2.5"
            />
            {/* Curved Notched Lapels */}
            <path d="M44 86 L56 102 L70 93 L84 102 L96 86" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" />
            <path d="M70 93 L70 123" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <circle cx="70" cy="104" r="2.2" fill="#F59E0B" />
            <circle cx="70" cy="114" r="2.2" fill="#F59E0B" />
            {/* Pocket with Pen */}
            <rect x="86" y="98" width="14" height="12" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
            <rect x="90" y="93" width="3" height="7" rx="1.5" fill="#10B981" />
          </g>
        )}

        {currentOutfit === 'detective' && (
          <g>
            {/* Natural Form-Fitted Double-Breasted Trenchcoat */}
            <path
              d="M26 84 C26 112 42 124 70 124 C98 124 114 112 114 84 C98 88 86 90 70 90 C54 90 42 88 26 84 Z"
              fill="url(#pipDetectiveGrad)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            {/* Dark Storm Lapels */}
            <path d="M42 86 L54 100 L70 92 L86 100 L98 86" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#92400E" />
            {/* Double-Breasted Gold Buttons */}
            <circle cx="62" cy="102" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="102" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="62" cy="112" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            <circle cx="78" cy="112" r="2.2" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
            {/* Waist Belt with Brass Buckle */}
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
            {/* Chest Telemetry Computer */}
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
            {/* Thick Fluffy Fleece Collar */}
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

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />
        <ellipse cx="96" cy="74" rx="7" ry="4.5" fill="url(#pipCheekGrad)" />

        {/* ── LAYER 5: EYES & PUPILS (INTELLIGENT CURSOR TRACKING) ── */}
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

        {/* ── LAYER 6: MOUTH & SPEECH (CALM SMILE WHEN IDLE, MOVES ONLY WHEN SPEAKING) ── */}
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

        {currentHeadwear === 'party-hat' && (
          <g>
            {/* Properly Fitted Party Hat Sitting Snugly on Crown */}
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
    </motion.div>
  );
};
