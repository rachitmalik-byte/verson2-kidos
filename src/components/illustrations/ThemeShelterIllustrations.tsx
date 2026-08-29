import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   1. 🐐 PASHMINA GOAT & 5,000M CHANGTHANG REBO TENT (CHAPTER 1)
   ============================================================================ */
export const VectorPashminaGoatAndRebo: React.FC<{ isZoomed?: boolean }> = ({ isZoomed }) => (
  <svg width="280" height="180" viewBox="0 0 280 180" className="drop-shadow-lg">
    <defs>
      <linearGradient id="skyLadakhGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="60%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#f1f5f9" />
      </linearGradient>
      <linearGradient id="snowMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id="reboTentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>

    {/* Sky & Snow Peaks */}
    <rect x="5" y="5" width="270" height="170" rx="18" fill="url(#skyLadakhGrad)" />
    <polygon points="10,130 65,35 120,130" fill="url(#snowMountainGrad)" />
    <polygon points="80,130 145,25 210,130" fill="url(#snowMountainGrad)" />
    <polygon points="170,130 225,45 280,130" fill="url(#snowMountainGrad)" />

    {/* Yak-Hair Rebo Conical Tent */}
    <polygon points="40,150 90,75 140,150" fill="url(#reboTentGrad)" stroke="#1e293b" strokeWidth="2.5" />
    <line x1="90" y1="65" x2="90" y2="75" stroke="#78350f" strokeWidth="3" />
    <polygon points="80,150 90,115 100,150" fill="#020617" />
    <text x="90" y="165" fill="#1e293b" fontSize="8" fontWeight="900" textAnchor="middle">REBO TENT (YAK HAIR)</text>

    {/* Pashmina High-Altitude Goat */}
    <g transform="translate(160, 80)">
      {/* Goat Body */}
      <ellipse cx="45" cy="45" rx="30" ry="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      {/* Fluffy Cashmere Fleece */}
      <circle cx="28" cy="40" r="10" fill="#f8fafc" />
      <circle cx="45" cy="38" r="12" fill="#f8fafc" />
      <circle cx="62" cy="40" r="10" fill="#f8fafc" />
      {/* Legs */}
      <line x1="26" y1="62" x2="26" y2="82" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="38" y1="62" x2="38" y2="82" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="52" y1="62" x2="52" y2="82" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="64" y1="62" x2="64" y2="82" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="78" cy="32" rx="12" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="82" cy="29" r="2" fill="#0f172a" />
      {/* Twisted Horns */}
      <path d="M 72 24 Q 65 8 55 12" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <path d="M 78 22 Q 74 6 64 8" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* 500x Microscope Inset: Human Hair vs Pashmina Fiber */}
    <g transform="translate(185, 12)">
      <circle cx="35" cy="35" r="32" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
      {/* Thick Human Hair */}
      <line x1="18" y1="12" x2="18" y2="58" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
      <text x="18" y="65" fill="#cbd5e1" fontSize="5.5" fontWeight="900" textAnchor="middle">HUMAN (50µm)</text>
      {/* Ultra-Fine Pashmina Fiber (6x thinner!) */}
      <line x1="48" y1="12" x2="48" y2="58" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
      <text x="48" y="65" fill="#fbbf24" fontSize="5.5" fontWeight="900" textAnchor="middle">PASHMINA (12µm)</text>
      <text x="35" y="8" fill="#f59e0b" fontSize="6.5" fontWeight="900" textAnchor="middle">6x FINER FIBER!</text>
    </g>
  </svg>
);

/* ============================================================================
   2. 🧗 MOUNTAINEERING & BACHENDRI PAL MT. EVEREST SUMMIT (CHAPTER 2)
   ============================================================================ */
export const VectorMountaineeringSummit: React.FC<{ altitudeMeters?: number }> = ({ altitudeMeters = 8848 }) => (
  <svg width="280" height="180" viewBox="0 0 280 180" className="drop-shadow-lg">
    <defs>
      <linearGradient id="everestSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0c4a6e" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="iceCliffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
    {/* Alpine Sky */}
    <rect x="5" y="5" width="270" height="170" rx="18" fill="url(#everestSky)" />

    {/* Everest Summit Ridge (8,848m) */}
    <polygon points="10,175 140,40 270,175" fill="url(#iceCliffGrad)" stroke="#38bdf8" strokeWidth="2" />
    <line x1="140" y1="40" x2="180" y2="175" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,3" />

    {/* Indian National Flag on Summit planted by Bachendri Pal (1984) */}
    <g transform="translate(140, 20)">
      <line x1="0" y1="0" x2="0" y2="35" stroke="#f8fafc" strokeWidth="2.5" />
      <rect x="0" y="0" width="30" height="6" fill="#f97316" />
      <rect x="0" y="6" width="30" height="6" fill="#ffffff" />
      <circle cx="15" cy="9" r="2.5" fill="#1e3a8a" />
      <rect x="0" y="12" width="30" height="6" fill="#16a34a" />
    </g>

    {/* Mountaineer in Red Parka with Oxygen Tank & Crampons */}
    <g transform="translate(95, 65)">
      {/* Down Parka */}
      <rect x="15" y="20" width="22" height="30" rx="6" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
      {/* Yellow Oxygen Tank on Back */}
      <rect x="5" y="22" width="10" height="24" rx="4" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
      {/* Hood & Mask */}
      <circle cx="26" cy="12" r="10" fill="#dc2626" />
      <rect x="22" y="10" width="12" height="8" rx="2" fill="#0284c7" />
      {/* Ice Axe in Hand */}
      <line x1="37" y1="30" x2="52" y2="45" stroke="#475569" strokeWidth="3" />
      <path d="M 48 40 L 56 46 L 50 49 Z" fill="#94a3b8" />
      {/* Climbing Boots with Steel Spiked Crampons */}
      <rect x="16" y="50" width="8" height="16" rx="2" fill="#1e293b" />
      <rect x="27" y="50" width="8" height="16" rx="2" fill="#1e293b" />
      <line x1="14" y1="66" x2="26" y2="66" stroke="#94a3b8" strokeWidth="2.5" />
      <line x1="25" y1="66" x2="37" y2="66" stroke="#94a3b8" strokeWidth="2.5" />
    </g>

    {/* Altitude HUD Badge */}
    <rect x="15" y="15" width="105" height="30" rx="8" fill="#0f172a" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1.5" />
    <text x="67" y="27" fill="#38bdf8" fontSize="8" fontWeight="900" textAnchor="middle">SAGARMATHA PEAK</text>
    <text x="67" y="39" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">{altitudeMeters} METERS</text>
  </svg>
);

/* ============================================================================
   3. 🚀 SUNITA WILLIAMS ZERO-GRAVITY ISS SPACE HABITAT (CHAPTER 3)
   ============================================================================ */
export const VectorSpaceStationHabitat: React.FC = () => (
  <svg width="280" height="180" viewBox="0 0 280 180" className="drop-shadow-lg">
    <defs>
      <linearGradient id="issInterior" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <radialGradient id="waterBlobGrad" cx="40%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#7dd3fc" />
        <stop offset="80%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    {/* Space Station Module Hull */}
    <rect x="5" y="5" width="270" height="170" rx="18" fill="url(#issInterior)" stroke="#475569" strokeWidth="2.5" />

    {/* Circular Cupola Window with Earth View */}
    <g transform="translate(180, 25)">
      <circle cx="40" cy="40" r="35" fill="#020617" stroke="#94a3b8" strokeWidth="3" />
      {/* Planet Earth Curve in Orbit */}
      <circle cx="40" cy="40" r="33" fill="#0284c7" />
      <path d="M 15 35 Q 40 20 65 30 Q 55 60 25 65 Z" fill="#16a34a" />
      <path d="M 30 15 Q 50 10 60 25 Q 45 40 25 35 Z" fill="#ffffff" fillOpacity="0.7" />
    </g>

    {/* Floating Spherical Water Blob (Surface Tension in Zero-G) */}
    <g transform="translate(125, 80)">
      <motion.circle
        cx="15"
        cy="15"
        r="14"
        fill="url(#waterBlobGrad)"
        stroke="#e0f2fe"
        strokeWidth="1.5"
        animate={{ y: [-4, 4, -4], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />
      <text x="15" y="38" fill="#38bdf8" fontSize="7.5" fontWeight="900" textAnchor="middle">FLOATING WATER SPHERE</text>
    </g>

    {/* Astronaut Floating with Tethered Sleeping Bag on Wall */}
    <g transform="translate(25, 40)">
      {/* Tethered Wall Sleeping Bag */}
      <rect x="0" y="20" width="25" height="75" rx="8" fill="#2563eb" stroke="#93c5fd" strokeWidth="1.5" />
      <line x1="5" y1="35" x2="20" y2="35" stroke="#ffffff" strokeWidth="2" />
      <line x1="5" y1="60" x2="20" y2="60" stroke="#ffffff" strokeWidth="2" />
      <text x="12" y="105" fill="#93c5fd" fontSize="6" fontWeight="900" textAnchor="middle">WALL STRAPS</text>

      {/* Floating Astronaut (Sunita Williams) */}
      <g transform="translate(45, 10)">
        {/* Blue Flight Suit */}
        <rect x="15" y="25" width="26" height="35" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        {/* Head with Floating Hair */}
        <circle cx="28" cy="15" r="10" fill="#fcd34d" />
        {/* Standing-up Zero-G Hair */}
        <path d="M 22 8 Q 20 0 28 2 Q 36 0 34 8" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <circle cx="25" cy="14" r="1.5" fill="#0f172a" />
        <circle cx="31" cy="14" r="1.5" fill="#0f172a" />
      </g>
    </g>
  </svg>
);

/* ============================================================================
   4. 🏰 GOLCONDA FORT BASTIONS & STEPWELL HYDRAULIC WHEEL (CHAPTER 4)
   ============================================================================ */
export const VectorGolcondaFortBastion: React.FC = () => (
  <svg width="280" height="180" viewBox="0 0 280 180" className="drop-shadow-lg">
    <defs>
      <linearGradient id="sandstoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Sky */}
    <rect x="5" y="5" width="270" height="170" rx="18" fill="#fef3c7" />

    {/* Fort Walls & Protruding Round Bastion (Burj) */}
    <rect x="15" y="70" width="130" height="95" fill="url(#sandstoneGrad)" stroke="#451a03" strokeWidth="2" />
    {/* Round Bastion (Burj) with Arch Openings for Cannons */}
    <path d="M 60 45 C 60 25, 120 25, 120 45 L 120 165 L 60 165 Z" fill="url(#sandstoneGrad)" stroke="#451a03" strokeWidth="2.5" />
    {/* Gun Viewing Slits */}
    <rect x="75" y="40" width="6" height="12" rx="2" fill="#0f172a" />
    <rect x="90" y="36" width="6" height="14" rx="2" fill="#0f172a" />
    <rect x="105" y="40" width="6" height="12" rx="2" fill="#0f172a" />
    <text x="90" y="24" fill="#78350f" fontSize="7.5" fontWeight="900" textAnchor="middle">ROUND BASTION (BURJ)</text>

    {/* Iron Spiked Elephant Gate (Fateh Darwaza) */}
    <rect x="25" y="110" width="30" height="55" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    {/* Sharp Iron Defense Spikes */}
    {[118, 128, 138, 148].map((y, i) => (
      <polygon key={i} points={`20,${y} 25,${y - 2} 25,${y + 2}`} fill="#94a3b8" />
    ))}

    {/* Persian Water Wheel (Rahat) Lifting Buckets from Deep Stepwell */}
    <g transform="translate(160, 40)">
      <rect x="0" y="40" width="105" height="85" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
      <text x="52" y="55" fill="#0369a1" fontSize="7" fontWeight="900" textAnchor="middle">BAOLI STEPWELL (WATER LIFT)</text>
      {/* Rotating Wheel with Buckets */}
      <circle cx="52" cy="88" r="24" fill="none" stroke="#78350f" strokeWidth="3.5" />
      <line x1="28" y1="88" x2="76" y2="88" stroke="#78350f" strokeWidth="2" />
      <line x1="52" y1="64" x2="52" y2="112" stroke="#78350f" strokeWidth="2" />
      {/* Water Buckets */}
      <rect x="50" y="60" width="6" height="8" rx="1" fill="#38bdf8" />
      <rect x="50" y="108" width="6" height="8" rx="1" fill="#38bdf8" />
      <rect x="74" y="84" width="8" height="6" rx="1" fill="#38bdf8" />
      <rect x="22" y="84" width="8" height="6" rx="1" fill="#38bdf8" />
    </g>
  </svg>
);

/* ============================================================================
   5. 🛢️ PETROLEUM FRACTIONAL DISTILLATION TOWER (CHAPTER 5)
   ============================================================================ */
export const VectorPetroleumFractionalTower: React.FC = () => (
  <svg width="280" height="180" viewBox="0 0 280 180" className="drop-shadow-lg">
    <defs>
      <linearGradient id="crudeFurnaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <linearGradient id="towerSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    {/* Refinery Background */}
    <rect x="5" y="5" width="270" height="170" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="2" />

    {/* Fractional Distillation Column Column */}
    <rect x="35" y="20" width="55" height="140" rx="10" fill="url(#towerSteelGrad)" stroke="#cbd5e1" strokeWidth="2" />

    {/* Separation Levels & Output Pipes */}
    {/* 1. Top Level (20°C) -> LPG Gas */}
    <line x1="90" y1="35" x2="140" y2="35" stroke="#f87171" strokeWidth="3" />
    <rect x="140" y="26" width="115" height="18" rx="5" fill="#ef4444" />
    <text x="197" y="38" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">1. LPG Cooking Gas (20°C)</text>

    {/* 2. Level 2 (70°C) -> Petrol for Cars */}
    <line x1="90" y1="65" x2="140" y2="65" stroke="#fbbf24" strokeWidth="3" />
    <rect x="140" y="56" width="115" height="18" rx="5" fill="#d97706" />
    <text x="197" y="68" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">2. Petrol for Cars (70°C)</text>

    {/* 3. Level 3 (170°C) -> Kerosene & Jet Fuel */}
    <line x1="90" y1="95" x2="140" y2="95" stroke="#38bdf8" strokeWidth="3" />
    <rect x="140" y="86" width="115" height="18" rx="5" fill="#0284c7" />
    <text x="197" y="98" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">3. Kerosene / Jet Fuel (170°C)</text>

    {/* 4. Level 4 (270°C) -> Diesel for Trucks */}
    <line x1="90" y1="125" x2="140" y2="125" stroke="#34d399" strokeWidth="3" />
    <rect x="140" y="116" width="115" height="18" rx="5" fill="#059669" />
    <text x="197" y="128" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">4. Diesel for Buses (270°C)</text>

    {/* 5. Bottom Residue -> Bitumen (Tar for Roads) */}
    <rect x="140" y="142" width="115" height="16" rx="4" fill="#000000" stroke="#475569" strokeWidth="1" />
    <text x="197" y="153" fill="#cbd5e1" fontSize="7.5" fontWeight="900" textAnchor="middle">5. Bitumen (Tar for Roads)</text>

    {/* Bottom Furnace (Crude Oil Heated at 400°C) */}
    <circle cx="62" cy="145" r="14" fill="url(#crudeFurnaceGrad)" stroke="#f59e0b" strokeWidth="2" />
    <text x="62" y="148" fill="#ffffff" fontSize="7.5" fontWeight="900" textAnchor="middle">400°C</text>
  </svg>
);
