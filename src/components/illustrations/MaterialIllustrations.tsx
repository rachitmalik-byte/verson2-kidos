import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

// ─── Rich Custom Vector Illustrations for Materials & Science Objects ───

export const RaincoatCottonIllustration: React.FC<IconProps> = ({ className = 'w-16 h-16', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    <defs>
      <linearGradient id="cottonCoatGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5E6CA" />
        <stop offset="100%" stopColor="#D8C29D" />
      </linearGradient>
    </defs>
    {/* Body */}
    <path d="M 32 20 L 50 28 L 68 20 L 88 42 L 76 52 L 68 44 L 68 85 L 32 85 L 32 44 L 24 52 L 12 42 Z" fill="url(#cottonCoatGrad)" stroke="#8C6D46" strokeWidth="3" strokeLinejoin="round" />
    {/* Collar & Buttons */}
    <path d="M 32 20 Q 50 32 68 20" stroke="#8C6D46" strokeWidth="3" fill="none" />
    <path d="M 50 28 L 50 85" stroke="#8C6D46" strokeWidth="2.5" strokeDasharray="3 3" />
    <circle cx="50" cy="42" r="2.5" fill="#5C4028" />
    <circle cx="50" cy="56" r="2.5" fill="#5C4028" />
    <circle cx="50" cy="70" r="2.5" fill="#5C4028" />
    {/* Pockets */}
    <rect x="36" y="60" width="10" height="10" rx="2" fill="#E8D5B5" stroke="#8C6D46" strokeWidth="2" />
    <rect x="54" y="60" width="10" height="10" rx="2" fill="#E8D5B5" stroke="#8C6D46" strokeWidth="2" />
  </svg>
);

export const RaincoatSyntheticIllustration: React.FC<IconProps> = ({ className = 'w-16 h-16', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    <defs>
      <linearGradient id="synthCoatGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Body */}
    <path d="M 32 20 L 50 28 L 68 20 L 88 42 L 76 52 L 68 44 L 68 85 L 32 85 L 32 44 L 24 52 L 12 42 Z" fill="url(#synthCoatGrad)" stroke="#0369A1" strokeWidth="3" strokeLinejoin="round" />
    {/* Glossy Sheen Highlight */}
    <path d="M 36 28 L 44 26 L 40 80 L 36 80 Z" fill="url(#shineGrad)" opacity="0.6" />
    {/* High-tech Waterproof Zipper */}
    <path d="M 50 28 L 50 85" stroke="#F8FAFC" strokeWidth="3" />
    <rect x="47" y="38" width="6" height="8" rx="2" fill="#F59E0B" stroke="#0369A1" strokeWidth="1.5" />
    {/* Hood outline */}
    <path d="M 32 20 Q 50 8 68 20" stroke="#0369A1" strokeWidth="3" fill="#0284C7" />
    {/* Rain drops beading */}
    <circle cx="72" cy="38" r="2.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
    <circle cx="62" cy="70" r="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
  </svg>
);

export const CottonIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Stem & Leaves */}
    <path d="M 50 85 C 50 65 45 55 50 48" stroke="#3F6212" strokeWidth="4" strokeLinecap="round" />
    <path d="M 50 65 C 38 60 30 70 26 78" stroke="#3F6212" strokeWidth="3.5" strokeLinecap="round" fill="#84CC16" />
    <path d="M 50 58 C 62 54 70 62 74 70" stroke="#3F6212" strokeWidth="3.5" strokeLinecap="round" fill="#84CC16" />
    {/* Sepals (Calyx) */}
    <path d="M 35 48 Q 50 60 65 48 Q 50 44 35 48 Z" fill="#4D7C0F" stroke="#365314" strokeWidth="2" />
    {/* Fluffy Cotton Puffs */}
    <circle cx="40" cy="36" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
    <circle cx="60" cy="36" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
    <circle cx="50" cy="24" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
    <circle cx="50" cy="38" r="14" fill="#F8FAFC" />
  </svg>
);

export const WoolIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Yarn Ball */}
    <circle cx="50" cy="50" r="32" fill="#FDE68A" stroke="#D97706" strokeWidth="3.5" />
    {/* Yarn Thread Lines */}
    <path d="M 28 36 Q 50 58 72 36" stroke="#D97706" strokeWidth="3" fill="none" />
    <path d="M 25 50 Q 50 72 75 50" stroke="#D97706" strokeWidth="3" fill="none" />
    <path d="M 34 68 Q 50 30 66 68" stroke="#D97706" strokeWidth="3" fill="none" />
    <path d="M 20 54 C 20 80 40 85 60 84 C 75 83 85 88 88 92" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Knitting Needles */}
    <line x1="18" y1="20" x2="82" y2="80" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="18" cy="20" r="4.5" fill="#E11D48" />
  </svg>
);

export const SilkIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Mulberry Leaf */}
    <path d="M 20 70 C 20 30 60 20 82 22 C 78 50 65 80 30 82 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
    <path d="M 20 70 Q 50 50 82 22" stroke="#16A34A" strokeWidth="2.5" fill="none" />
    {/* Silk Cocoon */}
    <ellipse cx="56" cy="54" rx="20" ry="14" transform="rotate(-25 56 54)" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
    <path d="M 44 48 Q 56 60 68 50" stroke="#CA8A04" strokeWidth="2" strokeDasharray="2 2" fill="none" />
    {/* Silky Thread Spool */}
    <path d="M 64 45 C 80 35 90 40 92 58" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const WoodIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Log Body */}
    <path d="M 32 30 L 78 30 C 85 30 88 40 88 50 C 88 60 85 70 78 70 L 32 70 Z" fill="#92400E" stroke="#582404" strokeWidth="3.5" />
    {/* Tree Rings (Cross section) */}
    <ellipse cx="32" cy="50" rx="14" ry="20" fill="#FDE68A" stroke="#582404" strokeWidth="3.5" />
    <ellipse cx="32" cy="50" rx="9" ry="13" stroke="#B45309" strokeWidth="2.5" fill="none" />
    <ellipse cx="32" cy="50" rx="4" ry="6" stroke="#B45309" strokeWidth="2" fill="#92400E" />
    {/* Wood grain highlights */}
    <path d="M 45 42 L 75 42" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 42 58 L 78 58" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cute Green Sprout on Log */}
    <path d="M 60 30 Q 60 16 52 14 Q 60 22 64 30" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
  </svg>
);

export const NylonIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Spool Flanges */}
    <rect x="24" y="20" width="52" height="12" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    <rect x="24" y="68" width="52" height="12" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    {/* Core Cylinder with Wound High-tech Cord */}
    <rect x="30" y="32" width="40" height="36" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
    {/* Thread Coils */}
    <line x1="30" y1="38" x2="70" y2="38" stroke="#DBEAFE" strokeWidth="2.5" />
    <line x1="30" y1="44" x2="70" y2="44" stroke="#DBEAFE" strokeWidth="2.5" />
    <line x1="30" y1="50" x2="70" y2="50" stroke="#DBEAFE" strokeWidth="2.5" />
    <line x1="30" y1="56" x2="70" y2="56" stroke="#DBEAFE" strokeWidth="2.5" />
    <line x1="30" y1="62" x2="70" y2="62" stroke="#DBEAFE" strokeWidth="2.5" />
    {/* Hanging Strong Cord with Sparkle */}
    <path d="M 70 50 C 85 50 88 75 78 90" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 82 40 L 86 34 L 90 40 L 96 44 L 90 48 L 86 54 L 82 48 L 76 44 Z" fill="#F59E0B" />
  </svg>
);

export const PolyesterIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Sportswear T-Shirt */}
    <path d="M 32 24 L 44 30 L 56 30 L 68 24 L 88 42 L 74 52 L 68 46 L 68 84 L 32 84 L 32 46 L 26 52 L 12 42 Z" fill="#06B6D4" stroke="#0891B2" strokeWidth="3" strokeLinejoin="round" />
    {/* Collar */}
    <path d="M 44 30 Q 50 36 56 30" stroke="#0891B2" strokeWidth="3" fill="#E0F2FE" />
    {/* Athletic Stripe */}
    <path d="M 32 50 L 68 50 L 68 56 L 32 56 Z" fill="#F59E0B" />
    <path d="M 32 60 L 68 60 L 68 63 L 32 63 Z" fill="#FFFFFF" />
    {/* Moisture Wicking Vapour Icon */}
    <path d="M 45 74 Q 47 70 45 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M 50 76 Q 52 70 50 64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M 55 74 Q 57 70 55 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PlasticIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Bottle Cap */}
    <rect x="42" y="14" width="16" height="10" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
    {/* Bottle Neck */}
    <rect x="45" y="24" width="10" height="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    {/* Bottle Body */}
    <path d="M 45 32 C 34 36 32 46 32 54 L 32 82 C 32 86 36 88 40 88 L 60 88 C 64 88 68 86 68 82 L 68 54 C 68 46 66 36 55 32 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
    {/* Chemical Wave inside */}
    <path d="M 34 65 Q 50 60 66 65 L 66 84 C 66 86 63 86 60 86 L 40 86 C 37 86 34 86 34 84 Z" fill="#38BDF8" opacity="0.6" />
    {/* Highlight Sheen */}
    <path d="M 38 42 L 42 40 L 42 78 L 38 78 Z" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

export const RubberIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Outer Tyre Rim */}
    <circle cx="50" cy="50" r="36" fill="#334155" stroke="#0F172A" strokeWidth="4" />
    {/* Tread Grooves */}
    <circle cx="50" cy="50" r="30" stroke="#475569" strokeWidth="3" strokeDasharray="6 6" fill="none" />
    {/* Inner Hub Rim */}
    <circle cx="50" cy="50" r="20" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
    <circle cx="50" cy="50" r="8" fill="#64748B" stroke="#0F172A" strokeWidth="2.5" />
    {/* Hub Bolts */}
    <circle cx="50" cy="38" r="2" fill="#0F172A" />
    <circle cx="50" cy="62" r="2" fill="#0F172A" />
    <circle cx="38" cy="50" r="2" fill="#0F172A" />
    <circle cx="62" cy="50" r="2" fill="#0F172A" />
  </svg>
);

export const WireIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Plastic Insulation Jacket (Yellow/Green) */}
    <path d="M 15 50 C 35 30 65 30 85 50" stroke="#EAB308" strokeWidth="18" strokeLinecap="round" fill="none" />
    {/* Exposed Copper Conductors at Ends */}
    <line x1="82" y1="48" x2="94" y2="40" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
    <line x1="84" y1="52" x2="96" y2="52" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
    <line x1="82" y1="56" x2="94" y2="64" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
    {/* Electricity Spark */}
    <path d="M 50 18 L 44 28 L 52 28 L 46 38" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const KettleIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Metal Kettle Body */}
    <ellipse cx="50" cy="62" rx="30" ry="24" fill="#E2E8F0" stroke="#475569" strokeWidth="3.5" />
    <path d="M 28 62 Q 50 82 72 62 Z" fill="#CBD5E1" />
    {/* Spout */}
    <path d="M 74 52 L 90 42 L 88 56 L 76 62 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
    {/* Insulated Plastic Bakelite Handle */}
    <path d="M 30 50 C 20 20 70 20 66 50" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M 36 34 C 44 26 56 26 62 34" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Steam Plume */}
    <path d="M 90 36 Q 96 28 92 20" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="3 3" />
  </svg>
);

export const ParachuteIllustration: React.FC<IconProps> = ({ className = 'w-16 h-16', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Parachute Canopy */}
    <path d="M 16 46 C 16 18 84 18 84 46 C 72 40 60 44 50 40 C 40 44 28 40 16 46 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M 34 24 C 42 34 46 44 50 40 C 54 44 58 34 66 24" stroke="#FFE4E6" strokeWidth="2" fill="none" />
    {/* Canopy Stripes */}
    <path d="M 38 42 Q 50 18 62 42" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    {/* Suspension Lines */}
    <line x1="18" y1="46" x2="50" y2="78" stroke="#475569" strokeWidth="2" />
    <line x1="38" y1="44" x2="50" y2="78" stroke="#475569" strokeWidth="2" />
    <line x1="62" y1="44" x2="50" y2="78" stroke="#475569" strokeWidth="2" />
    <line x1="82" y1="46" x2="50" y2="78" stroke="#475569" strokeWidth="2" />
    {/* Rescue Supply Crate */}
    <rect x="42" y="78" width="16" height="16" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
    <line x1="42" y1="86" x2="58" y2="86" stroke="#FEF3C7" strokeWidth="2" />
    <line x1="50" y1="78" x2="50" y2="94" stroke="#FEF3C7" strokeWidth="2" />
  </svg>
);

export const MagnifyingGlassIllustration: React.FC<IconProps> = ({ className = 'w-14 h-14', size }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: size, height: size }}>
    {/* Lens Frame */}
    <circle cx="44" cy="44" r="26" fill="#E0F2FE" stroke="#0284C7" strokeWidth="6" />
    {/* Lens Reflection */}
    <path d="M 28 32 A 18 18 0 0 1 54 26" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    {/* Handle */}
    <line x1="64" y1="64" x2="88" y2="88" stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
    <line x1="62" y1="62" x2="68" y2="68" stroke="#CA8A04" strokeWidth="7" strokeLinecap="round" />
  </svg>
);
