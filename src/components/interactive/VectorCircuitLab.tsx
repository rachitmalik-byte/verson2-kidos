import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   1. 🔋 12V HEAVY-DUTY LABORATORY POWER BATTERY
   ============================================================================ */
export const VectorBattery12V: React.FC<{ isFlowing: boolean }> = ({ isFlowing }) => {
  return (
    <div className="flex flex-col items-center select-none">
      <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-lg">
        <defs>
          <linearGradient id="batteryBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="metalTerminalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Terminals */}
        {/* Positive Red Terminal (+) */}
        <rect x="18" y="10" width="16" height="12" rx="3" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        <rect x="23" y="4" width="6" height="7" rx="2" fill="url(#metalTerminalGrad)" />
        <text x="26" y="20" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">+</text>

        {/* Negative Black Terminal (-) */}
        <rect x="66" y="10" width="16" height="12" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="71" y="4" width="6" height="7" rx="2" fill="url(#metalTerminalGrad)" />
        <text x="74" y="19" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">-</text>

        {/* Battery Main Body */}
        <rect x="8" y="22" width="84" height="92" rx="14" fill="url(#batteryBodyGrad)" stroke="#f59e0b" strokeWidth="2.5" />
        <rect x="14" y="28" width="72" height="80" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

        {/* Voltage Label */}
        <rect x="22" y="36" width="56" height="24" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="50" y="52" fill="#fbbf24" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          12V DC
        </text>

        {/* Power Dial Indicator */}
        <circle cx="50" cy="84" r="16" fill="#020617" stroke="#475569" strokeWidth="1.5" />
        <path d="M 40 88 A 12 12 0 0 1 60 88" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
        
        {/* Needle */}
        <motion.line
          x1="50"
          y1="84"
          x2={isFlowing ? "59" : "44"}
          y2={isFlowing ? "74" : "78"}
          stroke={isFlowing ? "#22c55e" : "#ef4444"}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ rotate: isFlowing ? [0, 4, -3, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
        <circle cx="50" cy="84" r="3" fill="#f59e0b" />
      </svg>
      <span className="text-[11px] font-black text-amber-400 mt-1 uppercase tracking-wider">
        Power Battery
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
      {/* Radiant Glow Bloom Halo */}
      {isLit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.7, 1, 0.8], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute -top-6 -left-6 w-36 h-36 bg-amber-400/40 rounded-full blur-xl pointer-events-none"
        />
      )}

      <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-lg relative z-10">
        <defs>
          <radialGradient id="bulbGlassLit" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="bulbGlassOff" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        {/* Bulb Screw Base */}
        <rect x="38" y="86" width="24" height="6" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <rect x="39" y="93" width="22" height="5" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
        <rect x="40" y="99" width="20" height="5" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        <path d="M 43 105 L 57 105 L 54 112 L 46 112 Z" fill="#1e293b" />

        {/* Glass Dome Envelope */}
        <path
          d="M 50 14 C 30 14, 20 28, 20 44 C 20 58, 32 68, 38 86 L 62 86 C 68 68, 80 58, 80 44 C 80 28, 70 14, 50 14 Z"
          fill={isLit ? "url(#bulbGlassLit)" : "url(#bulbGlassOff)"}
          stroke={isLit ? "#fef08a" : "#475569"}
          strokeWidth="2.5"
        />

        {/* Filament Supports & Coils */}
        <line x1="43" y1="84" x2="43" y2="48" stroke={isLit ? "#ffffff" : "#64748b"} strokeWidth="1.5" />
        <line x1="57" y1="84" x2="57" y2="48" stroke={isLit ? "#ffffff" : "#64748b"} strokeWidth="1.5" />
        
        {/* Tungsten Coiled Loop */}
        <path
          d="M 43 48 Q 50 36 57 48"
          fill="none"
          stroke={isLit ? "#ffffff" : "#475569"}
          strokeWidth={isLit ? "3.5" : "2"}
          strokeLinecap="round"
        />

        {/* Spark Rays when Lit */}
        {isLit && (
          <>
            <line x1="50" y1="4" x2="50" y2="10" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="20" x2="18" y2="24" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="88" y1="20" x2="82" y2="24" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="44" x2="13" y2="44" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="94" y1="44" x2="87" y2="44" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span className={`text-[11px] font-black mt-1 uppercase tracking-wider ${isLit ? 'text-amber-300' : 'text-slate-500'}`}>
        {isLit ? '⚡ LIGHTS UP! (ON)' : 'Dark (Current Blocked)'}
      </span>
    </div>
  );
};

/* ============================================================================
   3. ⚡ 4 DEDICATED CRYSTAL-CLEAR SPECIMEN VECTOR RENDERERS
   ============================================================================ */

export const VectorCopperWireSpecimen: React.FC = () => (
  <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-md">
    <defs>
      <linearGradient id="copperStrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fba76a" />
        <stop offset="30%" stopColor="#ea580c" />
        <stop offset="70%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
      <linearGradient id="copperShine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="50%" stopColor="#fed7aa" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    {/* Copper Wire Twisted Strands */}
    <rect x="15" y="24" width="110" height="22" rx="11" fill="url(#copperStrandGrad)" stroke="#7c2d12" strokeWidth="2" />
    <path d="M 20 28 Q 70 32 120 28" fill="none" stroke="url(#copperShine)" strokeWidth="4" strokeLinecap="round" />
    <path d="M 20 38 Q 70 42 120 38" fill="none" stroke="url(#copperShine)" strokeWidth="3" strokeLinecap="round" />
    {/* Exposed Wire Fringe Tips */}
    <line x1="12" y1="28" x2="20" y2="30" stroke="#ea580c" strokeWidth="2.5" />
    <line x1="10" y1="35" x2="18" y2="35" stroke="#ea580c" strokeWidth="2.5" />
    <line x1="12" y1="42" x2="20" y2="40" stroke="#ea580c" strokeWidth="2.5" />
    <line x1="120" y1="30" x2="128" y2="28" stroke="#ea580c" strokeWidth="2.5" />
    <line x1="122" y1="35" x2="130" y2="35" stroke="#ea580c" strokeWidth="2.5" />
    <line x1="120" y1="40" x2="128" y2="42" stroke="#ea580c" strokeWidth="2.5" />
  </svg>
);

export const VectorPVCCableSpecimen: React.FC = () => (
  <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-md">
    <defs>
      <linearGradient id="blackJacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Outer PVC Black Insulating Sheath */}
    <rect x="25" y="16" width="60" height="38" rx="8" fill="url(#blackJacketGrad)" stroke="#64748b" strokeWidth="2" />
    <text x="55" y="38" fill="#94a3b8" fontSize="9" fontWeight="900" textAnchor="middle">PVC JACKET</text>

    {/* Inner Insulated Wires Protruding (Blue, Brown, Striped) */}
    <rect x="85" y="19" width="30" height="10" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
    <rect x="85" y="31" width="30" height="10" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1" />
    <rect x="85" y="43" width="30" height="10" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="1" />

    {/* Copper wire tips */}
    <rect x="115" y="21" width="12" height="6" rx="2" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
    <rect x="115" y="33" width="12" height="6" rx="2" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
    <rect x="115" y="45" width="12" height="6" rx="2" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
  </svg>
);

export const VectorSteelKeySpecimen: React.FC = () => (
  <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-md">
    <defs>
      <linearGradient id="silverKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="30%" stopColor="#cbd5e1" />
        <stop offset="60%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
    {/* Key Bow Head */}
    <circle cx="35" cy="35" r="22" fill="url(#silverKeyGrad)" stroke="#475569" strokeWidth="2.5" />
    <circle cx="35" cy="35" r="9" fill="#0f172a" stroke="#334155" strokeWidth="2" />
    {/* Key Shaft / Blade */}
    <rect x="52" y="30" width="70" height="10" rx="2" fill="url(#silverKeyGrad)" stroke="#475569" strokeWidth="2" />
    {/* Key Bitting Notches */}
    <path d="M 85 40 L 90 47 L 96 40 L 102 48 L 108 40 L 114 49 L 122 40 Z" fill="url(#silverKeyGrad)" stroke="#475569" strokeWidth="1.5" />
  </svg>
);

export const VectorRubberEraserSpecimen: React.FC = () => (
  <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-md">
    <defs>
      <linearGradient id="pinkRubberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="50%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
      <linearGradient id="blueRubberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    {/* 3D Eraser Block */}
    {/* Pink Half */}
    <path d="M 18 20 L 70 20 L 70 52 L 18 52 Z" fill="url(#pinkRubberGrad)" stroke="#9f1239" strokeWidth="2" />
    {/* Blue Half */}
    <path d="M 70 20 L 122 20 L 122 52 L 70 52 Z" fill="url(#blueRubberGrad)" stroke="#1e40af" strokeWidth="2" />
    {/* Stamp */}
    <rect x="36" y="28" width="68" height="16" rx="4" fill="#ffffff" fillOpacity="0.85" />
    <text x="70" y="40" fill="#0f172a" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
      100% RUBBER
    </text>
  </svg>
);

/* ============================================================================
   4. 🔌 COMPLETE INTERACTIVE 3D CIRCUIT WORKBENCH
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
        return <VectorCopperWireSpecimen />;
      case 'pvc-plastic':
        return <VectorPVCCableSpecimen />;
      case 'steel':
        return <VectorSteelKeySpecimen />;
      case 'rubber':
        return <VectorRubberEraserSpecimen />;
      default:
        return <VectorCopperWireSpecimen />;
    }
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center relative overflow-hidden text-white">
      {/* Background Circuit Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

      {/* Main Bench Layout: Battery ➔ Alligator Clamp 1 ➔ Specimen ➔ Alligator Clamp 2 ➔ Lightbulb */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10 my-2">
        {/* 1. 12V Battery Power Source */}
        <VectorBattery12V isFlowing={isCircuitClosed} />

        {/* 2. Left Connecting Wire with Flowing Electron Particles */}
        <div className="flex-1 w-full md:w-auto flex flex-col items-center justify-center">
          <div className="w-full h-3 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden shadow-inner">
            {isCircuitClosed && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
                className="w-16 h-full bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 rounded-full shadow-[0_0_15px_#38bdf8]"
              />
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-400 mt-1">
            {isCircuitClosed ? '⚡ Electrons Streaming' : 'No Current Flow'}
          </span>
        </div>

        {/* 3. Center Test Gap Clamped by Alligator Clips */}
        <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-950/90 border-2 border-amber-400/80 shadow-2xl relative min-w-[220px]">
          {/* Top Clamp Label */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              [ Alligator Clamps Test Gap ]
            </span>
          </div>

          {/* Left & Right Chrome Alligator Clamps Graphic */}
          <div className="flex items-center justify-center gap-1 relative my-1">
            {/* Left Alligator Jaw */}
            <div className="w-4 h-8 bg-gradient-to-r from-slate-400 to-slate-200 rounded-l-md border border-slate-600 shadow-md shrink-0 flex items-center justify-center text-[10px] font-black text-slate-800">
              ◄
            </div>

            {/* The Specimen Graphic */}
            <div className="p-2 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center min-w-[150px] min-h-[75px]">
              {renderSpecimenGraphic()}
            </div>

            {/* Right Alligator Jaw */}
            <div className="w-4 h-8 bg-gradient-to-l from-slate-400 to-slate-200 rounded-r-md border border-slate-600 shadow-md shrink-0 flex items-center justify-center text-[10px] font-black text-slate-800">
              ►
            </div>
          </div>

          {/* Specimen Name & Status */}
          <span className="font-black text-sm text-white mt-2">{specimenName}</span>
          <span
            className={`text-[10px] font-black px-3 py-1 rounded-full mt-1 shadow-sm ${
              conducts
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                : 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
            }`}
          >
            {conducts ? '⚡ CONDUCTOR (Circuit Closed)' : '🛡️ INSULATOR (Circuit Blocked)'}
          </span>
        </div>

        {/* 4. Right Connecting Wire with Flowing Electron Particles */}
        <div className="flex-1 w-full md:w-auto flex flex-col items-center justify-center">
          <div className="w-full h-3 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden shadow-inner">
            {isCircuitClosed && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
                className="w-16 h-full bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 rounded-full shadow-[0_0_15px_#38bdf8]"
              />
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-400 mt-1">
            {isCircuitClosed ? '⚡ Closed Circuit' : 'Open / Broken Circuit'}
          </span>
        </div>

        {/* 5. Glowing Edison Lightbulb */}
        <VectorEdisonBulb isLit={isCircuitClosed} />
      </div>
    </div>
  );
};
