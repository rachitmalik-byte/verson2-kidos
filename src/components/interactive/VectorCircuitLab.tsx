import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   1. 🔋 12V HEAVY-DUTY LABORATORY POWER BATTERY
   ============================================================================ */
export const VectorBattery12V: React.FC<{ isFlowing: boolean }> = ({ isFlowing }) => {
  return (
    <div className="flex flex-col items-center select-none">
      <svg width="105" height="125" viewBox="0 0 105 125" className="drop-shadow-md">
        <defs>
          <linearGradient id="batteryChassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="metalPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Positive Red Terminal (+) */}
        <rect x="20" y="8" width="18" height="14" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <rect x="26" y="2" width="6" height="8" rx="2" fill="url(#metalPinGrad)" />
        <text x="29" y="19" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">+</text>

        {/* Negative Black Terminal (-) */}
        <rect x="68" y="8" width="18" height="14" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <rect x="74" y="2" width="6" height="8" rx="2" fill="url(#metalPinGrad)" />
        <text x="77" y="18" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">-</text>

        {/* Main Battery Casing */}
        <rect x="8" y="22" width="90" height="96" rx="16" fill="url(#batteryChassisGrad)" stroke="#78350f" strokeWidth="2.5" />
        <rect x="14" y="28" width="78" height="84" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

        {/* 12V Label Badge */}
        <rect x="22" y="36" width="62" height="26" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="53" y="54" fill="#fbbf24" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          12V DC
        </text>

        {/* Analog Voltage Dial */}
        <circle cx="53" cy="86" r="16" fill="#020617" stroke="#475569" strokeWidth="1.5" />
        <path d="M 43 90 A 12 12 0 0 1 63 90" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
        
        {/* Voltage Needle Indicator */}
        <motion.line
          x1="53"
          y1="86"
          x2={isFlowing ? "62" : "47"}
          y2={isFlowing ? "76" : "80"}
          stroke={isFlowing ? "#22c55e" : "#ef4444"}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: isFlowing ? [0, 5, -3, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.7 }}
        />
        <circle cx="53" cy="86" r="3.5" fill="#f59e0b" />
      </svg>
      <span className="text-xs font-black text-slate-800 mt-1 uppercase tracking-wide">
        Power Battery 🔋
      </span>
    </div>
  );
};

/* ============================================================================
   2. 💡 GLOWING EDISON LABORATORY LIGHTBULB
   ============================================================================ */
export const VectorEdisonBulb: React.FC<{ isLit: boolean }> = ({ isLit }) => {
  return (
    <div className="flex flex-col items-center select-none relative">
      {/* Radiant Golden Glow Bloom */}
      {isLit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          className="absolute -top-8 -left-8 w-44 h-44 bg-amber-400/50 rounded-full blur-2xl pointer-events-none"
        />
      )}

      <svg width="105" height="125" viewBox="0 0 105 125" className="drop-shadow-md relative z-10">
        <defs>
          <radialGradient id="bulbLitGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="bulbOffGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>

        {/* Screw Base Collar */}
        <rect x="40" y="90" width="26" height="6" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <rect x="42" y="97" width="22" height="6" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <rect x="44" y="104" width="18" height="6" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <path d="M 46 110 L 60 110 L 57 118 L 49 118 Z" fill="#334155" />

        {/* Glass Bulb Dome */}
        <path
          d="M 53 14 C 31 14, 20 28, 20 46 C 20 62, 34 72, 40 90 L 66 90 C 72 72, 86 62, 86 46 C 86 28, 75 14, 53 14 Z"
          fill={isLit ? "url(#bulbLitGrad)" : "url(#bulbOffGrad)"}
          stroke={isLit ? "#fef08a" : "#64748b"}
          strokeWidth="3"
        />

        {/* Filament Lead Wires */}
        <line x1="45" y1="88" x2="45" y2="50" stroke={isLit ? "#ffffff" : "#475569"} strokeWidth="2" />
        <line x1="61" y1="88" x2="61" y2="50" stroke={isLit ? "#ffffff" : "#475569"} strokeWidth="2" />
        
        {/* Glowing Tungsten Coil */}
        <path
          d="M 45 50 Q 53 36 61 50"
          fill="none"
          stroke={isLit ? "#ffffff" : "#475569"}
          strokeWidth={isLit ? "4" : "2.5"}
          strokeLinecap="round"
        />

        {/* Bright Spark Radiance */}
        {isLit && (
          <>
            <line x1="53" y1="4" x2="53" y2="10" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="20" x2="18" y2="25" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="94" y1="20" x2="88" y2="25" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="6" y1="46" x2="14" y2="46" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="46" x2="92" y2="46" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>

      <span className={`text-xs font-black mt-1 uppercase tracking-wide ${isLit ? 'text-amber-600' : 'text-slate-500'}`}>
        {isLit ? '⚡ LIGHTS UP! (ON)' : 'Dark (Current Blocked)'}
      </span>
    </div>
  );
};

/* ============================================================================
   3. 🧪 4 CLEAN, UNMISTAKABLE SPECIMEN VECTOR RENDERERS
   ============================================================================ */

/* 1. ⚡ Raw Solid Copper Metal Wire / Rod */
export const VectorCopperRodSpecimen: React.FC = () => (
  <svg width="150" height="75" viewBox="0 0 150 75" className="drop-shadow-sm">
    <defs>
      <linearGradient id="copperRodBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fba76a" />
        <stop offset="35%" stopColor="#ea580c" />
        <stop offset="70%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
      <linearGradient id="copperHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="50%" stopColor="#ffedd5" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    {/* Solid Copper Cylinder */}
    <rect x="18" y="24" width="114" height="26" rx="13" fill="url(#copperRodBody)" stroke="#7c2d12" strokeWidth="2.5" />
    <path d="M 24 30 Q 75 34 126 30" fill="none" stroke="url(#copperHighlight)" strokeWidth="4" strokeLinecap="round" />
    <path d="M 24 40 Q 75 44 126 40" fill="none" stroke="url(#copperHighlight)" strokeWidth="2.5" strokeLinecap="round" />
    {/* End Caps */}
    <ellipse cx="18" cy="37" rx="6" ry="13" fill="#ea580c" stroke="#7c2d12" strokeWidth="2" />
    <ellipse cx="132" cy="37" rx="6" ry="13" fill="#fba76a" stroke="#7c2d12" strokeWidth="2" />
  </svg>
);

/* 2. ⚡ Polished Steel Metal Key */
export const VectorSteelKeySpecimen: React.FC = () => (
  <svg width="150" height="75" viewBox="0 0 150 75" className="drop-shadow-sm">
    <defs>
      <linearGradient id="shinySilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e2e8f0" />
        <stop offset="60%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    {/* Key Bow Head */}
    <circle cx="38" cy="37" r="22" fill="url(#shinySilverGrad)" stroke="#334155" strokeWidth="2.5" />
    <circle cx="38" cy="37" r="9" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
    {/* Key Blade / Shaft */}
    <rect x="56" y="32" width="76" height="11" rx="2" fill="url(#shinySilverGrad)" stroke="#334155" strokeWidth="2" />
    {/* Key Notches (Teeth) */}
    <path d="M 88 43 L 94 51 L 100 43 L 106 52 L 112 43 L 118 53 L 128 43 Z" fill="url(#shinySilverGrad)" stroke="#334155" strokeWidth="1.5" />
  </svg>
);

/* 3. 🛡️ 100% Synthetic Plastic Toy Building Brick (Lego style) */
export const VectorPlasticBrickSpecimen: React.FC = () => (
  <svg width="150" height="75" viewBox="0 0 150 75" className="drop-shadow-sm">
    <defs>
      <linearGradient id="plasticBrickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="40%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <linearGradient id="plasticStudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* 4 Cylindrical Plastic Studs on Top */}
    <rect x="30" y="16" width="18" height="10" rx="3" fill="url(#plasticStudGrad)" stroke="#0369a1" strokeWidth="1.5" />
    <rect x="54" y="16" width="18" height="10" rx="3" fill="url(#plasticStudGrad)" stroke="#0369a1" strokeWidth="1.5" />
    <rect x="78" y="16" width="18" height="10" rx="3" fill="url(#plasticStudGrad)" stroke="#0369a1" strokeWidth="1.5" />
    <rect x="102" y="16" width="18" height="10" rx="3" fill="url(#plasticStudGrad)" stroke="#0369a1" strokeWidth="1.5" />

    {/* Main Rectangular Plastic Body */}
    <rect x="22" y="24" width="106" height="34" rx="6" fill="url(#plasticBrickGrad)" stroke="#075985" strokeWidth="2.5" />
    {/* Glossy Plastic Highlight Reflection */}
    <path d="M 26 28 L 124 28" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
    <text x="75" y="47" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
      PLASTIC TOY
    </text>
  </svg>
);

/* 4. 🛡️ 100% Flexible Natural Rubber Band Loop */
export const VectorRubberBandSpecimen: React.FC = () => (
  <svg width="150" height="75" viewBox="0 0 150 75" className="drop-shadow-sm">
    <defs>
      <linearGradient id="rubberBandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="80%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    {/* Outer Elastic Loop */}
    <path
      d="M 28 37 C 28 20, 122 20, 122 37 C 122 54, 28 54, 28 37 Z"
      fill="none"
      stroke="url(#rubberBandGrad)"
      strokeWidth="14"
      strokeLinecap="round"
    />
    {/* Inner Rubber Crease / Depth */}
    <path
      d="M 36 37 C 36 26, 114 26, 114 37 C 114 48, 36 48, 36 37 Z"
      fill="none"
      stroke="#713f12"
      strokeWidth="2"
      opacity="0.4"
    />
    {/* Rubber Band Label Tag */}
    <rect x="52" y="30" width="46" height="14" rx="4" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
    <text x="75" y="41" fill="#854d0e" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
      RUBBER BAND
    </text>
  </svg>
);

/* ============================================================================
   4. 🔌 PREMIUM BRIGHT LABORATORY CIRCUIT WORKBENCH
   ============================================================================ */
export const VectorCircuitWorkbench: React.FC<{
  specimenId: string;
  conducts: boolean;
  specimenName: string;
  isFlowing: boolean;
}> = ({ specimenId, conducts, specimenName, isFlowing }) => {
  const isCircuitClosed = conducts;

  const renderSpecimenGraphic = () => {
    switch (specimenId) {
      case 'copper':
        return <VectorCopperRodSpecimen />;
      case 'steel':
        return <VectorSteelKeySpecimen />;
      case 'plastic':
        return <VectorPlasticBrickSpecimen />;
      case 'rubber':
        return <VectorRubberBandSpecimen />;
      default:
        return <VectorCopperRodSpecimen />;
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-white to-amber-50/50 p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center relative overflow-hidden">
      {/* Workbench Header Status Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-slate-200 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
            12V DC Science Circuit Workbench
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full shadow-xs ${
            isCircuitClosed
              ? 'bg-amber-400 text-slate-950 border border-amber-500'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {isCircuitClosed ? '⚡ CLOSED CIRCUIT (CURRENT FLOWS)' : '🛡️ OPEN CIRCUIT (CURRENT BLOCKED)'}
        </span>
      </div>

      {/* Main Bench Layout: Battery ➔ Wire 1 ➔ Crocodile Clips & Specimen ➔ Wire 2 ➔ Lightbulb */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative my-2">
        {/* 1. 12V Battery Power Source */}
        <VectorBattery12V isFlowing={isCircuitClosed} />

        {/* 2. Left Connecting Wire (Red Cable) with Animated Flowing Electron Dots */}
        <div className="flex-1 w-full md:w-auto flex flex-col items-center justify-center">
          <div className="w-full h-4 bg-red-600 rounded-full border-2 border-red-800 relative overflow-hidden shadow-md">
            {isCircuitClosed && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
                className="w-16 h-full bg-gradient-to-r from-transparent via-yellow-200 to-white rounded-full shadow-[0_0_15px_#fef08a]"
              />
            )}
          </div>
          <span className="text-[10px] font-black text-red-700 mt-1 uppercase">
            {isCircuitClosed ? '⚡ Live Current (+)' : 'Red Positive Lead'}
          </span>
        </div>

        {/* 3. Center Test Gap Clamped by Crocodile Clips */}
        <div className="flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-white border-3 border-amber-400 shadow-xl relative min-w-[240px]">
          {/* Clamp Header Tag */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full">
              [ Alligator Clamps Test Gap ]
            </span>
          </div>

          {/* Left & Right Chrome Alligator Clamps Graphic */}
          <div className="flex items-center justify-center gap-1.5 relative my-2">
            {/* Left Crocodile Jaw */}
            <div className="w-5 h-9 bg-gradient-to-r from-slate-400 to-slate-200 rounded-l-lg border-2 border-slate-600 shadow-md shrink-0 flex items-center justify-center text-xs font-black text-slate-800">
              ◄
            </div>

            {/* The Specimen Graphic on Clean White Pedestal */}
            <div className="p-2 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-center min-w-[155px] min-h-[80px] shadow-inner">
              {renderSpecimenGraphic()}
            </div>

            {/* Right Crocodile Jaw */}
            <div className="w-5 h-9 bg-gradient-to-l from-slate-400 to-slate-200 rounded-r-lg border-2 border-slate-600 shadow-md shrink-0 flex items-center justify-center text-xs font-black text-slate-800">
              ►
            </div>
          </div>

          {/* Specimen Name & Status */}
          <span className="font-black text-sm text-slate-900 mt-1">{specimenName}</span>
          <span
            className={`text-[10px] font-black px-3.5 py-1 rounded-full mt-1.5 shadow-xs ${
              conducts
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-emerald-500 text-white ring-2 ring-emerald-300'
            }`}
          >
            {conducts ? '⚡ CONDUCTOR (Electricity Flows)' : '🛡️ INSULATOR (Blocks Electricity)'}
          </span>
        </div>

        {/* 4. Right Connecting Wire (Black Cable) with Animated Flowing Electron Dots */}
        <div className="flex-1 w-full md:w-auto flex flex-col items-center justify-center">
          <div className="w-full h-4 bg-slate-800 rounded-full border-2 border-slate-950 relative overflow-hidden shadow-md">
            {isCircuitClosed && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
                className="w-16 h-full bg-gradient-to-r from-transparent via-cyan-300 to-white rounded-full shadow-[0_0_15px_#38bdf8]"
              />
            )}
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">
            {isCircuitClosed ? '⚡ Returning Current (-)' : 'Black Return Lead'}
          </span>
        </div>

        {/* 5. Glowing Edison Lightbulb */}
        <VectorEdisonBulb isLit={isCircuitClosed} />
      </div>
    </div>
  );
};
