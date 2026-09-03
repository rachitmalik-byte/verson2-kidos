import React from 'react';
import { motion } from 'framer-motion';

export type SparkyMood = 'welcoming' | 'thinking' | 'celebrating' | 'oops' | 'empty' | 'reading';

export interface SparkyMascotProps {
  mood?: SparkyMood;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
  animate?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: 72,
  md: 110,
  lg: 160,
  xl: 220,
};

export const SparkyMascot: React.FC<SparkyMascotProps> = ({
  mood = 'welcoming',
  size = 'md',
  className = '',
  showSpeechBubble = false,
  speechText,
  animate = true,
  onClick,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 110;

  // Subtle natural breathing float
  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div
      className={`inline-flex flex-col items-center select-none relative ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Speech Bubble Option */}
      {showSpeechBubble && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2.5 px-3.5 py-1.5 bg-white text-[#262930] text-xs font-bold rounded-2xl shadow-soft-card border border-slate-200/80 max-w-[220px] text-center relative"
        >
          {speechText}
          <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200/80 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </motion.div>
      )}

      {/* Mascot Graphic with Clean Line Art */}
      <motion.div
        variants={animate ? floatVariants : undefined}
        initial="initial"
        animate={animate ? 'animate' : undefined}
        style={{ width: pixelSize, height: pixelSize }}
        className="relative flex items-center justify-center shrink-0"
      >
        <svg
          viewBox="0 0 140 140"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          {/* Defs for soft pastel gradients */}
          <defs>
            <linearGradient id="sparkyBodyGrad" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>
            <linearGradient id="sparkySparkGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="softGaze" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#262930" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* ── SPARK ANTENNA / HAIR TUFT ── */}
          <g>
            <path
              d="M70 30 C69 18 64 12 70 8 C77 12 71 20 70 30Z"
              fill="url(#sparkySparkGrad)"
              stroke="#262930"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkle star near antenna */}
            <path
              d="M82 14 L84 10 L88 12 L85 15 L88 18 L84 19 L82 15 Z"
              fill="#F59E0B"
              stroke="#262930"
              strokeWidth="1.5"
            />
          </g>

          {/* ── EARS (Rounded Squircles) ── */}
          {/* Left Ear */}
          <g>
            <rect
              x="22"
              y="32"
              width="24"
              height="28"
              rx="12"
              transform="rotate(-20 34 46)"
              fill="#FEF08A"
              stroke="#262930"
              strokeWidth="3.5"
            />
            <rect
              x="26"
              y="36"
              width="14"
              height="18"
              rx="7"
              transform="rotate(-20 33 45)"
              fill="#FED7AA"
            />
          </g>

          {/* Right Ear */}
          <g>
            <rect
              x="94"
              y="32"
              width="24"
              height="28"
              rx="12"
              transform="rotate(20 106 46)"
              fill="#FEF08A"
              stroke="#262930"
              strokeWidth="3.5"
            />
            <rect
              x="100"
              y="36"
              width="14"
              height="18"
              rx="7"
              transform="rotate(20 107 45)"
              fill="#FED7AA"
            />
          </g>

          {/* ── MAIN HEAD / BODY (Squircle Shape) ── */}
          <rect
            x="26"
            y="26"
            width="88"
            height="80"
            rx="36"
            fill="url(#sparkyBodyGrad)"
            stroke="#262930"
            strokeWidth="3.8"
            strokeLinejoin="round"
          />

          {/* ── SOFT PEACH BLUSH CHEEKS ── */}
          <ellipse cx="40" cy="74" rx="7" ry="4.5" fill="#FED7AA" />
          <ellipse cx="100" cy="74" rx="7" ry="4.5" fill="#FED7AA" />

          {/* ── MOOD-SPECIFIC EXPRESSIONS ── */}

          {/* 1. WELCOMING: Bright open eyes, happy smile, waving hand */}
          {mood === 'welcoming' && (
            <g>
              {/* Left Eye */}
              <circle cx="50" cy="62" r="6" fill="#262930" />
              <circle cx="48" cy="60" r="2.2" fill="#FFFFFF" />
              <circle cx="51.5" cy="63.5" r="1.1" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="90" cy="62" r="6" fill="#262930" />
              <circle cx="88" cy="60" r="2.2" fill="#FFFFFF" />
              <circle cx="91.5" cy="63.5" r="1.1" fill="#FFFFFF" />

              {/* Cheerful Smile */}
              <path
                d="M62 72 Q70 82 78 72"
                stroke="#262930"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="#FF8080"
              />

              {/* Waving Paw (Right) */}
              <motion.g
                animate={animate ? { rotate: [-10, 15, -10] } : undefined}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '116px 82px' }}
              >
                <path
                  d="M112 82 C120 75 128 78 126 86 C124 92 116 93 112 88Z"
                  fill="#FEF08A"
                  stroke="#262930"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Left resting paw */}
              <path
                d="M28 84 C22 88 22 94 28 96 C34 97 36 91 32 86Z"
                fill="#FEF08A"
                stroke="#262930"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* 2. THINKING: Curious tilted brow, looking up, finger on chin */}
          {mood === 'thinking' && (
            <g>
              {/* Curious Eyebrows */}
              <path d="M46 52 Q52 48 58 53" stroke="#262930" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M82 55 Q88 52 94 54" stroke="#262930" strokeWidth="2.8" strokeLinecap="round" />

              {/* Eyes looking up-right */}
              <circle cx="52" cy="60" r="6" fill="#262930" />
              <circle cx="51" cy="58" r="2.2" fill="#FFFFFF" />

              <circle cx="92" cy="60" r="6" fill="#262930" />
              <circle cx="91" cy="58" r="2.2" fill="#FFFFFF" />

              {/* Thoughtful curved mouth */}
              <path d="M64 74 Q70 71 76 74" stroke="#262930" strokeWidth="3.2" strokeLinecap="round" />

              {/* Paw touching cheek */}
              <path
                d="M76 80 C84 76 88 84 82 89 C77 92 73 86 76 80Z"
                fill="#FEF08A"
                stroke="#262930"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Tiny thought bubble */}
              <circle cx="106" cy="40" r="3" fill="#BAE6FD" stroke="#262930" strokeWidth="1.5" />
              <circle cx="114" cy="30" r="5" fill="#BAE6FD" stroke="#262930" strokeWidth="1.8" />
            </g>
          )}

          {/* 3. CELEBRATING: Star eyes, big open happy mouth, both hands in air */}
          {mood === 'celebrating' && (
            <g>
              {/* Star Eyes */}
              <path
                d="M50 56 L52 61 L57 62 L53 66 L54 71 L50 68 L46 71 L47 66 L43 62 L48 61 Z"
                fill="#F59E0B"
                stroke="#262930"
                strokeWidth="2.2"
              />
              <path
                d="M90 56 L92 61 L97 62 L93 66 L94 71 L90 68 L86 71 L87 66 L83 62 L88 61 Z"
                fill="#F59E0B"
                stroke="#262930"
                strokeWidth="2.2"
              />

              {/* Open Cheerful Laugh */}
              <path
                d="M60 72 Q70 86 80 72 Z"
                fill="#F87171"
                stroke="#262930"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Both Hands High in the air */}
              <path
                d="M18 52 C15 44 24 40 28 47 C30 52 26 58 20 56Z"
                fill="#FEF08A"
                stroke="#262930"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M122 52 C125 44 116 40 112 47 C110 52 114 58 120 56Z"
                fill="#FEF08A"
                stroke="#262930"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Confetti specs */}
              <circle cx="30" cy="22" r="2.5" fill="#86EFAC" />
              <circle cx="110" cy="20" r="2.5" fill="#C4B5FD" />
              <rect x="68" y="10" width="4" height="4" rx="1" transform="rotate(45 70 12)" fill="#FDBA74" />
            </g>
          )}

          {/* 4. OOPS: Cute band-aid, soft reassuring smile, "let's fix it" */}
          {mood === 'oops' && (
            <g>
              {/* Cute Pastel Band-aid on Forehead */}
              <g transform="rotate(-15 70 42)">
                <rect x="58" y="38" width="24" height="9" rx="4.5" fill="#FED7AA" stroke="#262930" strokeWidth="2.2" />
                <circle cx="68" cy="42.5" r="1" fill="#EA580C" />
                <circle cx="72" cy="42.5" r="1" fill="#EA580C" />
              </g>

              {/* Soft Eyes */}
              <circle cx="50" cy="63" r="5" fill="#262930" />
              <circle cx="48.5" cy="61.5" r="1.8" fill="#FFFFFF" />

              <circle cx="90" cy="63" r="5" fill="#262930" />
              <circle cx="88.5" cy="61.5" r="1.8" fill="#FFFFFF" />

              {/* Gentle Comforting Smile */}
              <path
                d="M62 76 Q70 82 78 76"
                stroke="#262930"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Paws held together softly */}
              <path
                d="M60 88 C58 96 82 96 80 88 Z"
                fill="#FEF08A"
                stroke="#262930"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* 5. EMPTY: Holding a soft pastel magnifying glass */}
          {mood === 'empty' && (
            <g>
              {/* Wide Curious Eyes */}
              <circle cx="50" cy="62" r="6" fill="#262930" />
              <circle cx="48" cy="60" r="2.2" fill="#FFFFFF" />

              <circle cx="90" cy="62" r="6" fill="#262930" />
              <circle cx="88" cy="60" r="2.2" fill="#FFFFFF" />

              {/* Cute O-mouth */}
              <circle cx="70" cy="74" r="3.5" fill="#262930" />

              {/* Magnifying Glass in hand */}
              <g transform="translate(86, 68) rotate(-15)">
                <circle cx="16" cy="16" r="12" fill="#E0F2FE" stroke="#262930" strokeWidth="3" />
                <rect x="25" y="24" width="6" height="14" rx="3" transform="rotate(-45 28 31)" fill="#CBD5E1" stroke="#262930" strokeWidth="2.5" />
                <path d="M12 12 Q16 10 20 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* 6. READING: Reading a little guidebook */}
          {mood === 'reading' && (
            <g>
              {/* Happy closed arched eyes (smiling) */}
              <path d="M44 63 Q50 56 56 63" stroke="#262930" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M84 63 Q90 56 96 63" stroke="#262930" strokeWidth="3.2" strokeLinecap="round" />

              {/* Sweet smile */}
              <path d="M64 73 Q70 78 76 73" stroke="#262930" strokeWidth="2.8" strokeLinecap="round" />

              {/* Little Book in Hands */}
              <g transform="translate(48, 76)">
                <rect x="0" y="2" width="22" height="18" rx="3" fill="#DDD6FE" stroke="#262930" strokeWidth="2.5" />
                <rect x="22" y="2" width="22" height="18" rx="3" fill="#EDE9FE" stroke="#262930" strokeWidth="2.5" />
                <line x1="5" y1="7" x2="17" y2="7" stroke="#262930" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="12" x2="15" y2="12" stroke="#262930" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="27" y1="7" x2="39" y2="7" stroke="#262930" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="27" y1="12" x2="37" y2="12" stroke="#262930" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ── LITTLE ROUND FEET ── */}
          <ellipse cx="50" cy="108" rx="14" ry="7" fill="#FEF08A" stroke="#262930" strokeWidth="3.2" />
          <ellipse cx="90" cy="108" rx="14" ry="7" fill="#FEF08A" stroke="#262930" strokeWidth="3.2" />
        </svg>
      </motion.div>
    </div>
  );
};
