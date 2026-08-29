import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   THEME 1: SUPER SENSES MICROSCOPIC SPECIMENS (DYNAMIC REAL OPTICAL ZOOM)
   ============================================================================ */

/** Ch 1: Ant Olfactory Antenna Sensilla & Chemical Receptors */
export const SpecimenAntAntennaSensilla: React.FC<{ zoom: number }> = ({ zoom }) => {
  const scaleFactor = zoom === 100 ? 1 : zoom === 250 ? 1.6 : 2.5;
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '30 30 160 160' : '55 55 110 110';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <defs>
        <radialGradient id="sensillaCoreGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Main Antenna Shaft */}
      <path
        d="M 30 190 Q 85 130 165 45"
        fill="none"
        stroke="url(#sensillaCoreGrad)"
        strokeWidth={zoom === 100 ? 18 : zoom === 250 ? 28 : 42}
        strokeLinecap="round"
      />

      {/* Sensilla Bristles (At higher zoom, show internal olfactory receptor neurons!) */}
      {[
        { x1: 55, y1: 160, x2: 20, y2: 140 },
        { x1: 72, y1: 142, x2: 40, y2: 118 },
        { x1: 90, y1: 125, x2: 60, y2: 95 },
        { x1: 108, y1: 108, x2: 80, y2: 75 },
        { x1: 125, y1: 90, x2: 100, y2: 55 },
        { x1: 142, y1: 72, x2: 122, y2: 35 },
        // Bottom side
        { x1: 75, y1: 172, x2: 110, y2: 190 },
        { x1: 92, y1: 155, x2: 130, y2: 170 },
        { x1: 110, y1: 138, x2: 150, y2: 150 },
        { x1: 128, y1: 120, x2: 168, y2: 130 },
        { x1: 145, y1: 102, x2: 185, y2: 110 },
      ].map((h, i) => (
        <g key={i}>
          <line x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2} stroke="#fde047" strokeWidth={zoom === 500 ? 4 : 2.5} strokeLinecap="round" />
          <circle cx={h.x2} cy={h.y2} r={zoom === 500 ? 4.5 : 2.5} fill="#10b981" />
          {/* 500x Reveal: Nanoscale Chemical Receptor Pores on sensilla tips */}
          {zoom >= 250 && (
            <circle cx={h.x2} cy={h.y2} r={zoom === 500 ? 7 : 4} fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
          )}
        </g>
      ))}

      {/* Floating Scent Molecules (Pheromones) */}
      {[
        { cx: 45, cy: 80 }, { cx: 75, cy: 45 }, { cx: 135, cy: 30 }, { cx: 170, cy: 65 }, { cx: 140, cy: 160 },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.cx} cy={m.cy} r={zoom === 500 ? 6 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1" />
          {zoom === 500 && (
            <text x={m.cx} y={m.cy + 2.5} fill="#ffffff" fontSize="4.5" fontWeight="900" textAnchor="middle">
              C₉H₁₈O
            </text>
          )}
        </g>
      ))}

      {/* HUD Zoom Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#10b981" strokeWidth="1" />
      <text x="110" y="198" fill="#34d399" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: ANTENNA BRISTLE OVERVIEW' : zoom === 250 ? '250x: OLFACTORY SENSILLA PORES' : '500x: CHEMICAL PHEROMONE RECEPTORS'}
      </text>
    </svg>
  );
};

/** Ch 2: Cobra Hollow Fang & Venom Channel */
export const SpecimenSnakeHollowFang: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '35 45 150 150' : '65 75 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />
      {/* Jawbone Tissue */}
      <path d="M 20 40 Q 110 30 200 40 L 200 70 Q 110 65 20 70 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <text x="110" y="55" fill="#475569" fontSize="7.5" fontWeight="900" textAnchor="middle">MAXILLARY BONE</text>

      {/* Hollow Curved Fang (Enamel & Dentin) */}
      <path
        d="M 85 70 C 85 110, 110 160, 130 185 C 120 160, 110 110, 115 70 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth={zoom === 500 ? 4 : 2.5}
      />

      {/* Inner Hypodermic Venom Canal */}
      <path
        d="M 98 70 C 98 105, 114 150, 126 178"
        fill="none"
        stroke="#10b981"
        strokeWidth={zoom === 100 ? 3.5 : zoom === 250 ? 6 : 9}
        strokeLinecap="round"
      />

      {/* 500x Reveal: Venom Micro-Duct Lining & Droplet Flow */}
      {zoom >= 250 && (
        <circle cx="127" cy="180" r={zoom === 500 ? 5 : 3} fill="#34d399" stroke="#ffffff" strokeWidth="1" />
      )}

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#10b981" strokeWidth="1" />
      <text x="110" y="198" fill="#34d399" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: HOLLOW COBRA FANG' : zoom === 250 ? '250x: HYPODERMIC VENOM DUCT' : '500x: NEUROTOXIC EXIT PORE'}
      </text>
    </svg>
  );
};

/** Ch 3: Tongue Papillae & Microscopic Taste Bud Pores */
export const SpecimenTonguePapillaeTasteBud: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '35 45 150 150' : '65 65 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />
      {/* Tongue Base */}
      <rect x="20" y="130" width="180" height="60" rx="6" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />

      {/* Fungiform Papilla (Dome) */}
      <path
        d="M 60 130 C 50 80, 80 55, 110 55 C 140 55, 170 80, 160 130 Z"
        fill="#fda4af"
        stroke="#f43f5e"
        strokeWidth={zoom === 500 ? 4 : 3}
      />

      {/* Taste Bud Pores */}
      {[
        { cx: 72, cy: 95, r: 8 }, { cx: 80, cy: 115, r: 8 }, { cx: 148, cy: 95, r: 8 }, { cx: 140, cy: 115, r: 8 },
      ].map((b, i) => (
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r} ry={b.r + 3} fill="#fb7185" stroke="#be123c" strokeWidth="1.5" />
          {/* Microvilli receptor hairs inside bud */}
          <line x1={b.cx} y1={b.cy - 6} x2={b.cx} y2={b.cy + 6} stroke="#ffffff" strokeWidth={zoom === 500 ? 2 : 1} />
        </g>
      ))}

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1" />
      <text x="110" y="198" fill="#fda4af" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: FUNGIFORM PAPILLA' : zoom === 250 ? '250x: TASTE BUD PORE CLUSTER' : '500x: GUSTATORY MICROVILLI RECEPTORS'}
      </text>
    </svg>
  );
};

/** Ch 4: Burdock Seed Hooks Interlocked with Fabric Loops */
export const SpecimenBurdockVelcroHooks: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '30 35 160 160' : '60 60 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />
      {/* Top Burdock Spine */}
      <rect x="20" y="30" width="180" height="15" rx="4" fill="#15803d" />
      <text x="110" y="41" fill="#dcfce7" fontSize="7" fontWeight="900" textAnchor="middle">BURDOCK SEED HOOKS</text>

      {/* Sharp Hooks */}
      {[50, 90, 130, 170].map((x, i) => (
        <path
          key={i}
          d={`M ${x} 45 L ${x} 95 Q ${x} 115 ${x + 16} 100 Q ${x + 22} 85 ${x + 12} 80`}
          fill="none"
          stroke="#4ade80"
          strokeWidth={zoom === 100 ? 3.5 : zoom === 250 ? 6 : 9}
          strokeLinecap="round"
        />
      ))}

      {/* Fabric Loops */}
      {[62, 102, 142].map((x, i) => (
        <path
          key={i}
          d={`M ${x - 10} 165 C ${x - 10} 85, ${x + 20} 85, ${x + 20} 165`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={zoom === 100 ? 3 : zoom === 250 ? 5 : 7.5}
          strokeLinecap="round"
        />
      ))}

      <rect x="20" y="165" width="180" height="15" rx="4" fill="#0369a1" />
      <text x="110" y="176" fill="#e0f2fe" fontSize="7" fontWeight="900" textAnchor="middle">NYLON FABRIC LOOPS</text>

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#4ade80" strokeWidth="1" />
      <text x="110" y="198" fill="#4ade80" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: INTERLOCKING VELCRO' : zoom === 250 ? '250x: ELASTIC HOOK TOOTH' : '500x: NYLON LOOP ENGAGEMENT'}
      </text>
    </svg>
  );
};

/* ============================================================================
   THEME 3 & 5: SHELTER, MOUNTAINS & EARTH SPECIMENS (DYNAMIC REAL OPTICAL ZOOM)
   ============================================================================ */

/** Shelter Ch 1: Pashmina Micro-fiber (12µm) vs Human Hair (50µm) */
export const SpecimenPashminaVsHumanHair: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '30 30 160 160' : '65 45 90 90';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Left: Thick Human Hair (50µm) with coarse keratin cuticles */}
      <g transform="translate(40, 20)">
        <rect x="0" y="10" width="38" height="145" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
        {[25, 45, 65, 85, 105, 125, 145].map((y, i) => (
          <line key={i} x1="2" y1={y} x2="36" y2={y + 4} stroke="#94a3b8" strokeWidth={zoom === 500 ? 3 : 1.5} />
        ))}
        <text x="19" y="165" fill="#cbd5e1" fontSize="6.5" fontWeight="900" textAnchor="middle">HUMAN HAIR (50µm)</text>
      </g>

      {/* Right: Ultra-Fine Pashmina Goat Fiber (12µm) - 6x Thinner! */}
      <g transform="translate(140, 20)">
        <rect x="5" y="10" width={zoom === 500 ? 12 : 6} height="145" rx="3" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
        {/* Trapped Insulating Air Pockets inside micro-core */}
        {[30, 60, 90, 120, 140].map((y, i) => (
          <circle key={i} cx={zoom === 500 ? 11 : 8} cy={y} r={zoom === 500 ? 3 : 1.5} fill="#ffffff" />
        ))}
        <text x="8" y="165" fill="#fbbf24" fontSize="6.5" fontWeight="900" textAnchor="middle">PASHMINA (12µm)</text>
      </g>

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1" />
      <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: FIBER WIDTH COMPARISON' : zoom === 250 ? '250x: KERATIN CUTICLES' : '500x: INSULATING MICRO-AIR POCKETS'}
      </text>
    </svg>
  );
};

/** Shelter Ch 2: Atmospheric Oxygen Density at Everest Altitude (8,848m) */
export const SpecimenAirMoleculeBarometer: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '25 25 170 170' : '50 50 120 120';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Molecular Chamber Box */}
      <rect x="20" y="30" width="180" height="140" rx="12" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
      <line x1="110" y1="30" x2="110" y2="170" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

      {/* Left: Sea Level Dense Gas Molecules (100% O2) */}
      <text x="65" y="46" fill="#38bdf8" fontSize="7" fontWeight="900" textAnchor="middle">SEA LEVEL (DENSE)</text>
      {[
        { cx: 35, cy: 65 }, { cx: 55, cy: 60 }, { cx: 75, cy: 70 }, { cx: 90, cy: 60 },
        { cx: 40, cy: 90 }, { cx: 65, cy: 95 }, { cx: 85, cy: 90 },
        { cx: 45, cy: 120 }, { cx: 70, cy: 125 }, { cx: 90, cy: 115 },
        { cx: 55, cy: 150 }, { cx: 80, cy: 145 },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.cx} cy={m.cy} r={zoom === 500 ? 7 : 4} fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          {zoom >= 250 && (
            <text x={m.cx} y={m.cy + 2} fill="#ffffff" fontSize="4" fontWeight="900" textAnchor="middle">O₂</text>
          )}
        </g>
      ))}

      {/* Right: 8,848m Summit Thin Gas Molecules (33% O2!) */}
      <text x="155" y="46" fill="#f87171" fontSize="7" fontWeight="900" textAnchor="middle">8,848m (THIN AIR)</text>
      {[
        { cx: 135, cy: 75 }, { cx: 175, cy: 105 }, { cx: 145, cy: 140 }, { cx: 180, cy: 150 },
      ].map((m, i) => (
        <g key={i}>
          <circle cx={m.cx} cy={m.cy} r={zoom === 500 ? 7 : 4} fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          {zoom >= 250 && (
            <text x={m.cx} y={m.cy + 2} fill="#ffffff" fontSize="4" fontWeight="900" textAnchor="middle">O₂</text>
          )}
        </g>
      ))}

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1" />
      <text x="110" y="198" fill="#38bdf8" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: MOLECULAR CHAMBER' : zoom === 250 ? '250x: O₂ DENSITY GRADIENT' : '500x: GAS COLLISION FREQUENCY'}
      </text>
    </svg>
  );
};

/** Shelter Ch 3: Zero-G Water Sphere & Surface Tension Cohesion */
export const SpecimenZeroGravityWaterSphere: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '30 30 160 160' : '60 60 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <defs>
        <radialGradient id="waterDropGradZoom" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#7dd3fc" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Spherical Water Blob */}
      <circle cx="110" cy="100" r={zoom === 100 ? 45 : zoom === 250 ? 58 : 72} fill="url(#waterDropGradZoom)" stroke="#e0f2fe" strokeWidth="2.5" />

      {/* 500x Reveal: Hydrogen bonds pulling inwards */}
      {zoom >= 250 && (
        <circle cx="110" cy="100" r={zoom === 500 ? 68 : 55} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
      )}

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#7dd3fc" strokeWidth="1" />
      <text x="110" y="198" fill="#7dd3fc" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: FLOATING WATER SPHERE' : zoom === 250 ? '250x: SURFACE TENSION MENISCUS' : '500x: HYDROGEN COHESION BONDS'}
      </text>
    </svg>
  );
};

/** Shelter Ch 4: Golconda Stepwell Mechanical Gear Teeth */
export const SpecimenGolcondaGearMechanics: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '35 45 150 150' : '65 65 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Interlocking Gear Teeth */}
      <circle cx="80" cy="95" r="45" fill="#78350f" stroke="#d97706" strokeWidth="3" />
      <circle cx="80" cy="95" r="15" fill="#090d16" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 80 + Math.cos(rad) * 48;
        const y = 95 + Math.sin(rad) * 48;
        return <rect key={i} x={x - 4} y={y - 4} width="8" height="8" rx="1.5" fill="#b45309" stroke="#f59e0b" strokeWidth="1" />;
      })}

      <circle cx="150" cy="110" r="32" fill="#92400e" stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx="150" cy="110" r="10" fill="#090d16" />

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1" />
      <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: TOOTH GEAR PULLEY' : zoom === 250 ? '250x: INTERLOCKING WOODEN TEETH' : '500x: MECHANICAL TORQUE FRICTION'}
      </text>
    </svg>
  );
};

/** Shelter Ch 5: Underground Petroleum Porous Sandstone Trapping */
export const SpecimenPetroleumPorousSandstone: React.FC<{ zoom: number }> = ({ zoom }) => {
  const viewBox = zoom === 100 ? '0 0 220 220' : zoom === 250 ? '30 35 160 160' : '60 60 100 100';

  return (
    <svg width="220" height="220" viewBox={viewBox} className="w-full h-full transition-all duration-500 ease-out">
      <circle cx="110" cy="110" r="105" fill="#090d16" />

      {/* Cap Rock */}
      <rect x="20" y="30" width="180" height="25" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
      <text x="110" y="46" fill="#cbd5e1" fontSize="7" fontWeight="900" textAnchor="middle">IMPERMEABLE CAP ROCK</text>

      {/* Sandstone Grains */}
      <g transform="translate(20, 60)">
        <rect x="0" y="0" width="180" height="110" fill="#09090b" stroke="#334155" strokeWidth="1.5" />

        {[
          { cx: 25, cy: 20, r: 12 }, { cx: 60, cy: 18, r: 14 }, { cx: 100, cy: 22, r: 13 }, { cx: 140, cy: 18, r: 15 },
          { cx: 35, cy: 50, r: 14 }, { cx: 75, cy: 52, r: 15 }, { cx: 120, cy: 48, r: 14 }, { cx: 160, cy: 52, r: 13 },
          { cx: 25, cy: 85, r: 13 }, { cx: 65, cy: 82, r: 14 }, { cx: 105, cy: 88, r: 15 }, { cx: 145, cy: 84, r: 14 },
        ].map((g, i) => (
          <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill="#d97706" stroke="#fbbf24" strokeWidth={zoom === 500 ? 2.5 : 1.5} />
        ))}

        {/* Crude Oil Seepage */}
        <circle cx="45" cy="35" r={zoom === 500 ? 7 : 4} fill="#000000" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="85" cy="35" r={zoom === 500 ? 7 : 4} fill="#000000" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="135" cy="35" r={zoom === 500 ? 7 : 4} fill="#000000" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="55" cy="68" r={zoom === 500 ? 7 : 4} fill="#000000" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="95" cy="68" r={zoom === 500 ? 7 : 4} fill="#000000" stroke="#f59e0b" strokeWidth="1" />
      </g>

      {/* HUD Label */}
      <rect x="25" y="185" width="170" height="20" rx="6" fill="#020617" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1" />
      <text x="110" y="198" fill="#fbbf24" fontSize="8" fontWeight="900" textAnchor="middle">
        {zoom === 100 ? '100x: RESERVOIR STRATA' : zoom === 250 ? '250x: POROUS SAND GRAINS' : '500x: HYDROCARBON PORE TRAP'}
      </text>
    </svg>
  );
};
