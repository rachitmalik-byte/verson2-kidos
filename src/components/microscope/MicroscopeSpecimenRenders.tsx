import React from 'react';

/* ============================================================================
   THEME 1: SUPER SENSES MICROSCOPIC SPECIMENS
   ============================================================================ */

/** Ch 1: Ant Olfactory Antenna Sensilla & Chemical Receptors */
export const SpecimenAntAntennaSensilla: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <defs>
      <radialGradient id="lensShadow" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="#0f172a" stopOpacity="0" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
      </radialGradient>
      <linearGradient id="antennaStem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
    </defs>
    {/* Background */}
    <circle cx="110" cy="110" r="105" fill="#0f172a" />
    <circle cx="110" cy="110" r="105" fill="url(#lensShadow)" />

    {/* Main Antenna Segment */}
    <path
      d="M 40 180 Q 90 120 160 50"
      fill="none"
      stroke="url(#antennaStem)"
      strokeWidth={zoom === 100 ? 18 : zoom === 250 ? 28 : 40}
      strokeLinecap="round"
    />

    {/* Olfactory Sensilla Hair Bristles (Microscopic Scent Receptors) */}
    {[
      { x1: 55, y1: 160, x2: 25, y2: 145 },
      { x1: 70, y1: 145, x2: 45, y2: 125 },
      { x1: 85, y1: 130, x2: 60, y2: 105 },
      { x1: 100, y1: 115, x2: 75, y2: 85 },
      { x1: 115, y1: 100, x2: 90, y2: 65 },
      { x1: 130, y1: 85, x2: 110, y2: 45 },
      { x1: 145, y1: 70, x2: 130, y2: 30 },
      // Opposite side
      { x1: 75, y1: 165, x2: 105, y2: 180 },
      { x1: 90, y1: 150, x2: 120, y2: 165 },
      { x1: 105, y1: 135, x2: 140, y2: 145 },
      { x1: 120, y1: 120, x2: 155, y2: 125 },
      { x1: 135, y1: 105, x2: 170, y2: 105 },
      { x1: 150, y1: 90, x2: 185, y2: 85 },
    ].map((h, i) => (
      <g key={i}>
        <line x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={h.x2} cy={h.y2} r="2" fill="#34d399" />
      </g>
    ))}

    {/* Floating Chemical Pheromone Molecules entering Sensilla */}
    {[
      { cx: 50, cy: 90 },
      { cx: 80, cy: 50 },
      { cx: 140, cy: 40 },
      { cx: 170, cy: 70 },
      { cx: 130, cy: 155 },
    ].map((m, i) => (
      <circle key={i} cx={m.cx} cy={m.cy} r="3.5" fill="#34d399" stroke="#ffffff" strokeWidth="1" />
    ))}

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#34d399" strokeWidth="1" />
    <text x="110" y="198" fill="#34d399" fontSize="8" fontWeight="900" textAnchor="middle">
      ANTENNA OLFACTORY SENSILLA ({zoom}x)
    </text>
  </svg>
);

/** Ch 2: Cobra Hollow Fang & Venom Channel */
export const SpecimenSnakeHollowFang: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />
    {/* Jawbone Tissue */}
    <path d="M 20 40 Q 110 30 200 40 L 200 70 Q 110 65 20 70 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <text x="110" y="55" fill="#475569" fontSize="7.5" fontWeight="900" textAnchor="middle">MAXILLARY JAWBONE</text>

    {/* Hollow Curved Fang (Enamel & Dentin) */}
    <path
      d="M 85 70 C 85 110, 110 160, 130 185 C 120 160, 110 110, 115 70 Z"
      fill="#f8fafc"
      stroke="#cbd5e1"
      strokeWidth="2.5"
    />

    {/* Inner Hypodermic Venom Delivery Canal */}
    <path
      d="M 98 70 C 98 105, 114 150, 126 178"
      fill="none"
      stroke="#10b981"
      strokeWidth={zoom === 100 ? 3 : zoom === 250 ? 5 : 7}
      strokeLinecap="round"
    />

    {/* Venom Droplet Exiting Fang Tip */}
    <circle cx="128" cy="183" r="3.5" fill="#34d399" stroke="#ffffff" strokeWidth="1" />

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#10b981" strokeWidth="1" />
    <text x="110" y="198" fill="#34d399" fontSize="8" fontWeight="900" textAnchor="middle">
      HOLLOW VENOM CANAL ({zoom}x)
    </text>
  </svg>
);

/** Ch 3: Tongue Papillae & Microscopic Taste Bud Pores */
export const SpecimenTonguePapillaeTasteBud: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />
    {/* Epithelial Tongue Tissue Base */}
    <rect x="20" y="130" width="180" height="60" rx="6" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />

    {/* Fungiform Papilla (Mushroom-shaped dome) */}
    <path
      d="M 60 130 C 50 80, 80 55, 110 55 C 140 55, 170 80, 160 130 Z"
      fill="#fda4af"
      stroke="#f43f5e"
      strokeWidth="3"
    />

    {/* Taste Bud Pores embedded in sides */}
    {[
      { cx: 72, cy: 95, r: 8 },
      { cx: 80, cy: 115, r: 8 },
      { cx: 148, cy: 95, r: 8 },
      { cx: 140, cy: 115, r: 8 },
    ].map((b, i) => (
      <g key={i}>
        <ellipse cx={b.cx} cy={b.cy} rx={b.r} ry={b.r + 3} fill="#fb7185" stroke="#be123c" strokeWidth="1.5" />
        {/* Microscopic Taste Receptor Cells inside bud */}
        <line x1={b.cx} y1={b.cy - 7} x2={b.cx} y2={b.cy + 7} stroke="#ffffff" strokeWidth="1.5" />
      </g>
    ))}

    {/* Sugar / Flavor Molecules touching Gustatory Pore */}
    <circle cx="68" cy="85" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
    <circle cx="152" cy="85" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#f43f5e" strokeWidth="1" />
    <text x="110" y="198" fill="#fda4af" fontSize="8" fontWeight="900" textAnchor="middle">
      TASTE BUD PAPILLAE ({zoom}x)
    </text>
  </svg>
);

/** Ch 4: Burdock Seed Hooks Interlocked with Fabric Loops */
export const SpecimenBurdockVelcroHooks: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />
    {/* Top Burr Seed Spine */}
    <rect x="20" y="30" width="180" height="15" rx="4" fill="#15803d" />
    <text x="110" y="41" fill="#dcfce7" fontSize="7" fontWeight="900" textAnchor="middle">BURDOCK SEED HOOK SIDE</text>

    {/* Sharp Elastic Hooks */}
    {[50, 90, 130, 170].map((x, i) => (
      <path
        key={i}
        d={`M ${x} 45 L ${x} 95 Q ${x} 115 ${x + 16} 100 Q ${x + 22} 85 ${x + 12} 80`}
        fill="none"
        stroke="#4ade80"
        strokeWidth={zoom === 100 ? 3 : zoom === 250 ? 5 : 7}
        strokeLinecap="round"
      />
    ))}

    {/* Bottom Woven Wool Fabric Loops */}
    {[62, 102, 142].map((x, i) => (
      <path
        key={i}
        d={`M ${x - 10} 165 C ${x - 10} 85, ${x + 20} 85, ${x + 20} 165`}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={zoom === 100 ? 3 : zoom === 250 ? 4.5 : 6}
        strokeLinecap="round"
      />
    ))}

    <rect x="20" y="165" width="180" height="15" rx="4" fill="#0369a1" />
    <text x="110" y="176" fill="#e0f2fe" fontSize="7" fontWeight="900" textAnchor="middle">FABRIC NYLON LOOPS</text>

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#4ade80" strokeWidth="1" />
    <text x="110" y="198" fill="#4ade80" fontSize="8" fontWeight="900" textAnchor="middle">
      INTERLOCKING VELCRO HOOKS ({zoom}x)
    </text>
  </svg>
);

/* ============================================================================
   THEME 3 & 5: SHELTER, MOUNTAINS & EARTH SPECIMENS
   ============================================================================ */

/** Shelter Ch 1: Pashmina Micro-fiber (12µm) vs Human Hair (50µm) */
export const SpecimenPashminaVsHumanHair: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />

    {/* Left: Thick Human Hair (50µm) with coarse keratin cuticles */}
    <g transform="translate(45, 20)">
      <rect x="0" y="10" width="34" height="145" rx="6" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
      {[25, 45, 65, 85, 105, 125, 145].map((y, i) => (
        <line key={i} x1="2" y1={y} x2="32" y2={y + 4} stroke="#cbd5e1" strokeWidth="1.5" />
      ))}
      <text x="17" y="165" fill="#cbd5e1" fontSize="7" fontWeight="900" textAnchor="middle">HUMAN HAIR (50µm)</text>
    </g>

    {/* Right: Ultra-Fine Pashmina Goat Fiber (12µm) - 6x Thinner! */}
    <g transform="translate(135, 20)">
      <rect x="10" y="10" width="6" height="145" rx="3" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
      {/* Insulating Trapped Air Pockets */}
      <circle cx="13" cy="40" r="1.5" fill="#ffffff" />
      <circle cx="13" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="13" cy="120" r="1.5" fill="#ffffff" />
      <text x="13" y="165" fill="#fbbf24" fontSize="7" fontWeight="900" textAnchor="middle">PASHMINA (12µm)</text>
    </g>

    {/* Ratio Callout */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
    <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
      6x FINER • TRAPS AIR ENVELOPE ({zoom}x)
    </text>
  </svg>
);

/** Shelter Ch 2: Atmospheric Oxygen Density at Everest Altitude (8,848m) */
export const SpecimenAirMoleculeBarometer: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />

    {/* Molecular Chamber Grid */}
    <rect x="20" y="30" width="180" height="140" rx="12" fill="#020617" stroke="#38bdf8" strokeWidth="2" />

    {/* Left Side: Sea Level Dense Oxygen (100% O2) */}
    <line x1="110" y1="30" x2="110" y2="170" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
    <text x="65" y="45" fill="#38bdf8" fontSize="7" fontWeight="900" textAnchor="middle">SEA LEVEL (DENSE)</text>
    {[
      { cx: 35, cy: 65 }, { cx: 55, cy: 60 }, { cx: 75, cy: 70 }, { cx: 90, cy: 60 },
      { cx: 40, cy: 90 }, { cx: 65, cy: 95 }, { cx: 85, cy: 90 },
      { cx: 45, cy: 120 }, { cx: 70, cy: 125 }, { cx: 90, cy: 115 },
      { cx: 55, cy: 150 }, { cx: 80, cy: 145 },
    ].map((m, i) => (
      <circle key={i} cx={m.cx} cy={m.cy} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
    ))}

    {/* Right Side: 8,848m Summit Thin Oxygen (Only 33% O2!) */}
    <text x="155" y="45" fill="#f87171" fontSize="7" fontWeight="900" textAnchor="middle">8,848m (THIN AIR)</text>
    {[
      { cx: 135, cy: 75 },
      { cx: 175, cy: 105 },
      { cx: 145, cy: 140 },
      { cx: 180, cy: 150 },
    ].map((m, i) => (
      <circle key={i} cx={m.cx} cy={m.cy} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
    ))}

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1" />
    <text x="110" y="198" fill="#38bdf8" fontSize="8" fontWeight="900" textAnchor="middle">
      OXYGEN MOLECULAR DENSITY ({zoom}x)
    </text>
  </svg>
);

/** Shelter Ch 3: Zero-G Water Sphere & Surface Tension Cohesion */
export const SpecimenZeroGravityWaterSphere: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <defs>
      <radialGradient id="waterDropGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#7dd3fc" />
        <stop offset="70%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    <circle cx="110" cy="110" r="105" fill="#0f172a" />

    {/* Perfect Spherical Water Blob in Microgravity */}
    <circle cx="110" cy="100" r={zoom === 100 ? 45 : zoom === 250 ? 58 : 72} fill="url(#waterDropGrad)" stroke="#e0f2fe" strokeWidth="2.5" />

    {/* Hydrogen Bond Cohesion Arrows around perimeter */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x = 110 + Math.cos(rad) * 65;
      const y = 100 + Math.sin(rad) * 65;
      return (
        <circle key={i} cx={x} cy={y} r="2" fill="#38bdf8" />
      );
    })}

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#7dd3fc" strokeWidth="1" />
    <text x="110" y="198" fill="#7dd3fc" fontSize="8" fontWeight="900" textAnchor="middle">
      SURFACE TENSION SPHERE ({zoom}x)
    </text>
  </svg>
);

/** Shelter Ch 4: Golconda Stepwell Mechanical Gear Teeth */
export const SpecimenGolcondaGearMechanics: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />

    {/* Interlocking Wooden Gear Teeth */}
    <circle cx="80" cy="95" r="45" fill="#78350f" stroke="#d97706" strokeWidth="3" />
    <circle cx="80" cy="95" r="15" fill="#0f172a" />
    {/* Gear 1 Teeth */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x = 80 + Math.cos(rad) * 48;
      const y = 95 + Math.sin(rad) * 48;
      return <rect key={i} x={x - 4} y={y - 4} width="8" height="8" rx="1.5" fill="#b45309" stroke="#f59e0b" strokeWidth="1" />;
    })}

    {/* Interlocking Gear 2 */}
    <circle cx="150" cy="110" r="32" fill="#92400e" stroke="#f59e0b" strokeWidth="2.5" />
    <circle cx="150" cy="110" r="10" fill="#0f172a" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x = 150 + Math.cos(rad) * 35;
      const y = 110 + Math.sin(rad) * 35;
      return <rect key={i} x={x - 3} y={y - 3} width="6" height="6" rx="1" fill="#ca8a04" />;
    })}

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
    <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
      INTERLOCKING GEAR PULLEY ({zoom}x)
    </text>
  </svg>
);

/** Shelter Ch 5: Underground Petroleum Porous Sandstone Trapping */
export const SpecimenPetroleumPorousSandstone: React.FC<{ zoom: number }> = ({ zoom }) => (
  <svg width="220" height="220" viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="105" fill="#0f172a" />

    {/* Impermeable Cap Rock (Top Seal) */}
    <rect x="20" y="30" width="180" height="25" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
    <text x="110" y="46" fill="#cbd5e1" fontSize="7" fontWeight="900" textAnchor="middle">IMPERMEABLE CAP ROCK</text>

    {/* Porous Sandstone Grains (Gold Sand Grains with Black Crude Oil Pores) */}
    <g transform="translate(20, 60)">
      <rect x="0" y="0" width="180" height="110" fill="#09090b" stroke="#334155" strokeWidth="1.5" />

      {/* Sand Grains with Oil Filled Micro-Cavities */}
      {[
        { cx: 25, cy: 20, r: 12 }, { cx: 60, cy: 18, r: 14 }, { cx: 100, cy: 22, r: 13 }, { cx: 140, cy: 18, r: 15 },
        { cx: 35, cy: 50, r: 14 }, { cx: 75, cy: 52, r: 15 }, { cx: 120, cy: 48, r: 14 }, { cx: 160, cy: 52, r: 13 },
        { cx: 25, cy: 85, r: 13 }, { cx: 65, cy: 82, r: 14 }, { cx: 105, cy: 88, r: 15 }, { cx: 145, cy: 84, r: 14 },
      ].map((g, i) => (
        <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
      ))}

      {/* Crude Oil Seepage Channels (Black Gold) */}
      <circle cx="45" cy="35" r="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="85" cy="35" r="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="135" cy="35" r="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="55" cy="68" r="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="95" cy="68" r="4" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
    </g>

    {/* HUD Label */}
    <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
    <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
      CRUDE OIL IN POROUS ROCK ({zoom}x)
    </text>
  </svg>
);
