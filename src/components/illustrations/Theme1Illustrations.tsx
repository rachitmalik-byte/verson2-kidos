import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   1. 🐍 THE 4 POISONOUS SNAKES OF INDIA (CBSE CLASS 5 EVS)
   ============================================================================ */

export const VectorIndianCobra: React.FC<{ isStriking?: boolean }> = ({ isStriking }) => (
  <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-lg">
    <defs>
      <linearGradient id="cobraSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="50%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <radialGradient id="hoodMarkingGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
    </defs>
    {/* Raised Expanded Hood */}
    <ellipse cx="90" cy="55" rx="45" ry="38" fill="url(#cobraSkinGrad)" stroke="#1e293b" strokeWidth="2.5" />
    {/* Distinct Spectacle Marking on Hood */}
    <circle cx="75" cy="52" r="10" fill="none" stroke="url(#hoodMarkingGrad)" strokeWidth="3.5" />
    <circle cx="105" cy="52" r="10" fill="none" stroke="url(#hoodMarkingGrad)" strokeWidth="3.5" />
    <path d="M 85 52 Q 90 44 95 52" fill="none" stroke="url(#hoodMarkingGrad)" strokeWidth="3" />
    <path d="M 85 55 Q 90 62 95 55" fill="none" stroke="url(#hoodMarkingGrad)" strokeWidth="3" />

    {/* Cobra Head & Eyes */}
    <ellipse cx="90" cy="30" rx="16" ry="18" fill="#78350f" stroke="#1e293b" strokeWidth="2" />
    <circle cx="82" cy="26" r="3" fill="#f59e0b" />
    <circle cx="82" cy="26" r="1.5" fill="#000000" />
    <circle cx="98" cy="26" r="3" fill="#f59e0b" />
    <circle cx="98" cy="26" r="1.5" fill="#000000" />

    {/* Forked Tongue Flicking */}
    <motion.path
      d="M 90 14 L 90 4 L 86 0 M 90 4 L 94 0"
      fill="none"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
      animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ repeat: Infinity, duration: 0.4 }}
    />

    {/* Body Coils */}
    <path d="M 90 92 C 90 120, 150 120, 140 140 C 130 148, 40 148, 40 135 C 40 115, 90 110, 90 92 Z" fill="url(#cobraSkinGrad)" stroke="#1e293b" strokeWidth="2" />
  </svg>
);

export const VectorCommonKrait: React.FC = () => (
  <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-lg">
    <defs>
      <linearGradient id="kraitSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>
    {/* Glossy Steel-Black Coiled Body */}
    <path
      d="M 30 75 C 30 30, 150 30, 150 75 C 150 120, 40 125, 40 140 C 40 148, 140 148, 140 135"
      fill="none"
      stroke="url(#kraitSteelGrad)"
      strokeWidth="20"
      strokeLinecap="round"
    />
    {/* Thin Distinct White Twin Crossbands */}
    {[45, 65, 85, 105, 125].map((x, i) => (
      <line key={i} x1={x} y1="36" x2={x + 3} y2="52" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    ))}
    {/* Krait Head */}
    <circle cx="30" cy="75" r="13" fill="#0f172a" stroke="#475569" strokeWidth="2" />
    <circle cx="26" cy="71" r="2.5" fill="#f59e0b" />
  </svg>
);

export const VectorRussellsViper: React.FC = () => (
  <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-lg">
    <defs>
      <linearGradient id="viperBrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Thick Heavy Body */}
    <path
      d="M 35 75 C 35 35, 145 35, 145 75 C 145 115, 50 120, 50 135 C 50 145, 130 145, 130 135"
      fill="none"
      stroke="url(#viperBrownGrad)"
      strokeWidth="24"
      strokeLinecap="round"
    />
    {/* Chain-like Oval Spots with Dark Borders & White Trim */}
    {[55, 80, 105, 130].map((x, i) => (
      <ellipse key={i} cx={x} cy="45" rx="8" ry="6" fill="#451a03" stroke="#ffffff" strokeWidth="2" />
    ))}
    {/* Triangular Head (Viper characteristic) */}
    <polygon points="35,62 18,75 35,88" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    <circle cx="28" cy="70" r="2.5" fill="#ef4444" />
  </svg>
);

export const VectorSawScaledViper: React.FC = () => (
  <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-lg">
    <defs>
      <linearGradient id="sawViperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="50%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    </defs>
    {/* S-shaped defensive coil */}
    <path
      d="M 50 40 Q 130 50 90 90 Q 50 130 130 130"
      fill="none"
      stroke="url(#sawViperGrad)"
      strokeWidth="18"
      strokeLinecap="round"
    />
    {/* Serrated Keel Cross Marks */}
    {[60, 80, 100, 120].map((x, i) => (
      <text key={i} x={x} y={70 + (i % 2) * 20} fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
        ✕
      </text>
    ))}
    {/* Head with Cross Mark on Crown */}
    <circle cx="50" cy="40" r="12" fill="#713f12" stroke="#451a03" strokeWidth="2" />
    <text x="50" y="44" fill="#fef08a" fontSize="10" fontWeight="900" textAnchor="middle">†</text>
  </svg>
);

/* ============================================================================
   2. 👅 ANATOMICAL HUMAN TONGUE TASTE ZONE MAP
   ============================================================================ */
export const VectorTongueTasteMapGraphic: React.FC<{ activeZone: string }> = ({ activeZone }) => (
  <svg width="220" height="260" viewBox="0 0 220 260" className="drop-shadow-xl">
    <defs>
      <linearGradient id="tongueBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="60%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    {/* Tongue Base Silhouette */}
    <path
      d="M 50 30 C 50 15, 170 15, 170 30 C 185 80, 195 180, 110 245 C 25 180, 35 80, 50 30 Z"
      fill="url(#tongueBodyGrad)"
      stroke="#be123c"
      strokeWidth="4"
    />
    {/* Median Sulcus (Center Line) */}
    <path d="M 110 40 L 110 215" fill="none" stroke="#be123c" strokeWidth="2.5" strokeDasharray="4,3" opacity="0.6" />

    {/* 1. Bitter Zone (Deep Back of Tongue) */}
    <path
      d="M 60 40 C 60 30, 160 30, 160 40 C 155 75, 65 75, 60 40 Z"
      fill={activeZone === 'bitter' ? '#10b981' : '#be123c'}
      fillOpacity={activeZone === 'bitter' ? '0.85' : '0.25'}
      stroke="#059669"
      strokeWidth={activeZone === 'bitter' ? '3' : '1'}
    />
    <text x="110" y="55" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">
      BITTER ZONE ☕
    </text>

    {/* 2. Sour Zones (Back Lateral Sides) */}
    <path
      d="M 40 85 C 38 120, 48 150, 75 160 C 68 130, 68 100, 75 80 Z"
      fill={activeZone === 'sour' ? '#eab308' : '#be123c'}
      fillOpacity={activeZone === 'sour' ? '0.85' : '0.25'}
      stroke="#ca8a04"
      strokeWidth={activeZone === 'sour' ? '3' : '1'}
    />
    <path
      d="M 180 85 C 182 120, 172 150, 145 160 C 152 130, 152 100, 145 80 Z"
      fill={activeZone === 'sour' ? '#eab308' : '#be123c'}
      fillOpacity={activeZone === 'sour' ? '0.85' : '0.25'}
      stroke="#ca8a04"
      strokeWidth={activeZone === 'sour' ? '3' : '1'}
    />
    <text x="56" y="125" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">SOUR 🍋</text>
    <text x="164" y="125" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">SOUR 🍋</text>

    {/* 3. Salty Zones (Front Lateral Sides) */}
    <path
      d="M 50 160 C 60 190, 80 215, 95 225 C 80 205, 75 185, 75 165 Z"
      fill={activeZone === 'salty' ? '#38bdf8' : '#be123c'}
      fillOpacity={activeZone === 'salty' ? '0.85' : '0.25'}
      stroke="#0284c7"
      strokeWidth={activeZone === 'salty' ? '3' : '1'}
    />
    <path
      d="M 170 160 C 160 190, 140 215, 125 225 C 140 205, 145 185, 145 165 Z"
      fill={activeZone === 'salty' ? '#38bdf8' : '#be123c'}
      fillOpacity={activeZone === 'salty' ? '0.85' : '0.25'}
      stroke="#0284c7"
      strokeWidth={activeZone === 'salty' ? '3' : '1'}
    />
    <text x="68" y="195" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">SALT 🥨</text>
    <text x="152" y="195" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">SALT 🥨</text>

    {/* 4. Sweet Zone (Front Tip of Tongue) */}
    <path
      d="M 85 220 C 110 245, 110 245, 135 220 C 125 210, 95 210, 85 220 Z"
      fill={activeZone === 'sweet' ? '#ec4899' : '#be123c'}
      fillOpacity={activeZone === 'sweet' ? '0.9' : '0.3'}
      stroke="#be185d"
      strokeWidth={activeZone === 'sweet' ? '3' : '1'}
    />
    <text x="110" y="235" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">SWEET 🍯</text>
  </svg>
);

/* ============================================================================
   3. 🔬 GEORGE DE MESTRAL VELCRO MICROSCOPE (BURRS & LOOPS)
   ============================================================================ */
export const VectorVelcroMicroscopeGraphic: React.FC = () => (
  <svg width="240" height="140" viewBox="0 0 240 140" className="drop-shadow-md">
    <defs>
      <linearGradient id="hookGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="loopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* Top Burdock Hook Surface */}
    <rect x="20" y="15" width="200" height="12" rx="4" fill="#047857" />
    <text x="120" y="24" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
      BURDOCK SEED TINY HOOKS (PLASTIC HOOK SIDE)
    </text>

    {/* Microscopic Hooks */}
    {[40, 75, 110, 145, 180].map((x, i) => (
      <path
        key={i}
        d={`M ${x} 27 L ${x} 60 Q ${x} 75 ${x + 12} 65 Q ${x + 16} 55 ${x + 10} 50`}
        fill="none"
        stroke="url(#hookGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    ))}

    {/* Microscopic Fabric Loops Interlocked */}
    {[48, 83, 118, 153, 188].map((x, i) => (
      <path
        key={i}
        d={`M ${x - 8} 115 C ${x - 8} 55, ${x + 14} 55, ${x + 14} 115`}
        fill="none"
        stroke="url(#loopGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    ))}

    {/* Bottom Fabric Base */}
    <rect x="20" y="115" width="200" height="12" rx="4" fill="#0369a1" />
    <text x="120" y="124" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
      WOOL SOCKS / FABRIC LOOPS (NYLON LOOP SIDE)
    </text>
  </svg>
);
