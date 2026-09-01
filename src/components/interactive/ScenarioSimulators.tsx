import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Sparkles, AlertTriangle, CheckCircle2, Flame, Droplet, Zap, RotateCcw, Wrench } from 'lucide-react';

/* ============================================================================
   1. HIGH-PRESSURE PIPE BURST & EPOXY SEAL SIMULATOR (MISSION 12)
   ============================================================================ */
export const HighPressurePipeLeakSim: React.FC<{
  onSealed?: () => void;
}> = ({ onSealed }) => {
  const [adhesiveType, setAdhesiveType] = useState<'none' | 'pine' | 'epoxy'>('none');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = (type: 'pine' | 'epoxy') => {
    setIsApplying(true);
    if (type === 'pine') {
      sounds.boing();
      voiceAssistant.speak('Oh no! Natural pine resin is water soluble and blows right off under 80 PSI water pressure!');
      setTimeout(() => {
        setAdhesiveType('pine');
        setIsApplying(false);
      }, 600);
    } else {
      sounds.success();
      voiceAssistant.speak('Success! 2-part synthetic epoxy polymerizes underwater and forms an impermeable seal that withstands 80 PSI!');
      setTimeout(() => {
        setAdhesiveType('epoxy');
        setIsApplying(false);
        if (onSealed) onSealed();
      }, 700);
    }
  };

  const isSealed = adhesiveType === 'epoxy';

  return (
    <div className="w-full bg-slate-950 p-6 rounded-3xl border-4 border-cyan-400 shadow-2xl flex flex-col items-center relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex justify-between items-center w-full mb-4 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          <Gauge className={`w-4 h-4 ${isSealed ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`} />
          <span className="text-xs font-black uppercase text-white">
            Pipe Pressure: {isSealed ? '0 PSI (Stabilized)' : '80 PSI (BURSTING!)'}
          </span>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${isSealed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white animate-bounce'}`}>
          {isSealed ? '✓ LEAK REPAIRED' : '⚠️ HIGH PRESSURE LEAK'}
        </span>
      </div>

      {/* Interactive Pipe Graphic Stage */}
      <div className="relative w-full h-48 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden mb-6">
        {/* Metal Pipe */}
        <div className="w-full h-14 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 relative flex items-center shadow-inner">
          <div className="absolute left-1/2 -translate-x-1/2 w-8 h-16 bg-slate-600 rounded-sm border-2 border-slate-300 flex items-center justify-center">
            {/* Crack in pipe */}
            <div className="w-1 h-10 bg-slate-900 rounded-full relative">
              {/* Epoxy Seal Layer */}
              {isSealed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full shadow-[0_0_15px_#34d399] z-20 flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-emerald-950 animate-spin" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Water Spray Particles */}
        {!isSealed && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-1/2 z-10 pointer-events-none flex flex-col items-center">
            <motion.div
              animate={{ scaleY: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
              className="w-8 h-28 bg-gradient-to-t from-cyan-400 via-sky-300 to-transparent blur-[1px] origin-bottom rounded-t-full shadow-[0_0_20px_#38bdf8]"
            />
            <div className="absolute -top-4 w-32 h-12 flex justify-around">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [-10, -40, -10], x: [0, (i - 2) * 15, 0], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.3 + i * 0.05 }}
                  className="text-cyan-300 text-lg"
                >
                  💧
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Pine Resin Blown Off Graphic */}
        {adhesiveType === 'pine' && !isSealed && (
          <motion.div
            initial={{ scale: 1, x: 0, opacity: 1 }}
            animate={{ scale: 0.5, x: 100, y: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute left-1/2 top-1/2 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-30"
          >
            💨 Blown Away by Water!
          </motion.div>
        )}
      </div>

      {/* Interactive Tool Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <button
          onClick={() => handleApply('pine')}
          disabled={isApplying}
          className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/50 hover:border-amber-400 text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
        >
          <span className="text-2xl">🌲</span>
          <div className="text-left">
            <span className="block text-amber-300">Apply Natural Pine Resin</span>
            <span className="text-[10px] text-slate-400 font-bold">Water-soluble plant sap</span>
          </div>
        </button>

        <button
          onClick={() => handleApply('epoxy')}
          disabled={isApplying}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <span className="text-2xl">🧪</span>
          <div className="text-left">
            <span className="block text-white">Apply 2-Part Synthetic Epoxy</span>
            <span className="text-[10px] text-teal-100 font-bold">Cross-linked waterproof polymer</span>
          </div>
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   2. VECTOR CAR WHEEL SVG COMPONENT (Clean, Transparent, High-Res Rim & Tread)
   ============================================================================ */
interface VectorCarWheelProps {
  type: 'natural' | 'synthetic';
  isOverheated: boolean;
}

const VectorCarWheel: React.FC<VectorCarWheelProps> = ({ type, isOverheated }) => {
  const isSynthetic = type === 'synthetic';

  // Natural raw rubber is milky amber/tan; Synthetic vulcanized rubber is carbon-black
  const tireFill = isSynthetic
    ? 'url(#syntheticTireGrad)'
    : isOverheated
    ? 'url(#meltedLatexGrad)'
    : 'url(#naturalLatexGrad)';

  const tireStroke = isSynthetic
    ? '#334155'
    : isOverheated
    ? '#92400e'
    : '#b45309';

  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-44 h-44 drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)] transition-all ${
        isOverheated ? 'scale-y-90 origin-bottom' : ''
      }`}
    >
      <defs>
        {/* Synthetic Vulcanized Carbon Black Tire Gradient */}
        <radialGradient id="syntheticTireGrad" cx="50%" cy="50%" r="50%">
          <stop offset="68%" stopColor="#0f172a" />
          <stop offset="85%" stopColor="#1e293b" />
          <stop offset="96%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>

        {/* Natural Raw Latex Rubber Gradient */}
        <radialGradient id="naturalLatexGrad" cx="50%" cy="50%" r="50%">
          <stop offset="68%" stopColor="#78350f" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="96%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>

        {/* Overheated Melted Latex Gradient */}
        <radialGradient id="meltedLatexGrad" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#451a03" />
          <stop offset="80%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>

        {/* Silver Chrome Alloy Rim Gradient */}
        <linearGradient id="silverRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Dark Rim Recess Gradient */}
        <radialGradient id="innerRimGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="80%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      {/* ── 1. Outer Tire Rubber Body ── */}
      <circle cx="100" cy="100" r="95" fill={tireFill} stroke={tireStroke} strokeWidth="3" />

      {/* ── 2. Tire Outer Tread Notches (36 Teeth) ── */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 360) / 36;
        return (
          <line
            key={i}
            x1="100"
            y1="5"
            x2="100"
            y2="14"
            stroke={isSynthetic ? '#475569' : '#fde68a'}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* ── 3. Tire Sidewall Groove Ring ── */}
      <circle cx="100" cy="100" r="82" fill="none" stroke={isSynthetic ? '#334155' : '#92400e'} strokeWidth="2" />
      <circle cx="100" cy="100" r="69" fill="none" stroke={isSynthetic ? '#0f172a' : '#78350f'} strokeWidth="3" />

      {/* ── 4. Inner Wheel Well (Background behind spokes) ── */}
      <circle cx="100" cy="100" r="67" fill="url(#innerRimGrad)" stroke="#64748b" strokeWidth="2" />

      {/* Brake Rotor Disc with Cooling Holes */}
      <circle cx="100" cy="100" r="48" fill="#475569" opacity="0.6" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <circle
            key={i}
            cx="100"
            cy="65"
            r="1.8"
            fill="#0f172a"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* ── 5. Silver Alloy Wheel Rim Lip ── */}
      <circle cx="100" cy="100" r="67" fill="none" stroke="url(#silverRimGrad)" strokeWidth="6" />

      {/* ── 6. 10 Alloy Spokes ── */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * 360) / 10;
        return (
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            {/* Main Spoke Beam */}
            <polygon
              points="94,100 106,100 108,36 92,36"
              fill="url(#silverRimGrad)"
              stroke="#475569"
              strokeWidth="0.8"
            />
            {/* Center Spoke Shadow Groove */}
            <polygon points="98,90 102,90 101,42 99,42" fill="#334155" opacity="0.7" />
          </g>
        );
      })}

      {/* ── 7. Central Wheel Hub & Lug Nuts ── */}
      <circle cx="100" cy="100" r="24" fill="url(#silverRimGrad)" stroke="#334155" strokeWidth="2" />
      <circle cx="100" cy="100" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
      <text
        x="100"
        y="104"
        textAnchor="middle"
        fontSize="8"
        fontWeight="900"
        fontFamily="sans-serif"
        fill="#f59e0b"
      >
        {isSynthetic ? 'F1' : 'RAW'}
      </text>

      {/* 5 Lug Nuts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 360) / 5;
        return (
          <circle
            key={i}
            cx="100"
            cy="82"
            r="3"
            fill="#e2e8f0"
            stroke="#0f172a"
            strokeWidth="1"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
    </svg>
  );
};

/* ============================================================================
   3. FORMULA 1 TIRE FRICTION & VULCANIZATION SIMULATOR (MISSION 11)
   ============================================================================ */
export const RaceCarTireFrictionSim: React.FC<{
  onTested?: () => void;
}> = ({ onTested }) => {
  const [rubberType, setRubberType] = useState<'natural' | 'synthetic'>('synthetic');
  const [speedRpm, setSpeedRpm] = useState(6000);
  const [isSpinning, setIsSpinning] = useState(false);

  const frictionTemp = Math.round(25 + (speedRpm / 12000) * 135);
  const isOverheated = frictionTemp > 100 && rubberType === 'natural';

  const handleTestRun = () => {
    setIsSpinning(true);
    if (rubberType === 'natural' && speedRpm > 5000) {
      sounds.boing();
      voiceAssistant.speak(
        'Extreme friction! Natural raw rubber has NO sulfur crosslinks. Under 120°C heat, polymer chains slide apart, melt, and turn into sticky paste on the road!'
      );
    } else {
      sounds.success();
      voiceAssistant.speak(
        'Incredible grip! Vulcanized rubber uses sulfur crosslinks to lock rubber chains into a tough 3D mesh that resists 160°C heat without melting!'
      );
      if (onTested) onTested();
    }
  };

  return (
    <div className="w-full bg-slate-950 p-5 sm:p-7 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center relative overflow-hidden">
      {/* Top HUD Row */}
      <div className="flex justify-between items-center w-full mb-4 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-700">
          <Flame className={`w-4 h-4 ${isOverheated ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
          <span className="text-xs font-black uppercase text-white">
            Friction Heat: {frictionTemp}°C
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full uppercase ${
            isOverheated
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-amber-400 text-slate-950'
          }`}
        >
          {isOverheated ? '⚠️ TREAD MELTING & SMEARING' : '⚡ 3D CROSSLINKED GRIP STABLE'}
        </span>
      </div>

      {/* Realistic Rolling Tire Stage (Wheel directly touching the Road with 0px gap) */}
      <div className="relative w-full h-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl border-3 border-slate-700 flex flex-col items-center justify-end overflow-hidden mb-6 shadow-inner">
        {/* Speed Blur Streamers */}
        {isSpinning && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 0.18 + i * 0.04, ease: 'linear' }}
                style={{ top: `${i * 10 + 5}%` }}
                className="absolute h-0.5 w-44 bg-amber-400"
              />
            ))}
          </div>
        )}

        {/* The Rotating Vector Car Wheel Assembly (Resting Directly on Road Surface) */}
        <div className="relative z-10 flex items-end justify-center mb-[-6px]">
          <motion.div
            animate={
              isSpinning
                ? { rotate: 360 }
                : { rotate: 0 }
            }
            transition={
              isSpinning
                ? {
                    repeat: Infinity,
                    duration: Math.max(0.05, 0.65 - speedRpm / 18000),
                    ease: 'linear',
                  }
                : {}
            }
          >
            <VectorCarWheel type={rubberType} isOverheated={isOverheated} />
          </motion.div>

          {/* Friction Smoke & Fire Particles at Contact Patch */}
          {isSpinning && (
            <div className="absolute right-0 bottom-2 pointer-events-none flex gap-1 z-20">
              <motion.span
                animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.8], x: [0, 40, 80], y: [0, -25, -55] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="text-2xl"
              >
                {isOverheated ? '🔥' : '💨'}
              </motion.span>
            </div>
          )}
        </div>

        {/* Animated Asphalt Road Surface Track */}
        <div className="relative w-full h-12 bg-slate-950 border-t-4 border-slate-700 flex items-center overflow-hidden z-20">
          <motion.div
            animate={isSpinning ? { x: ['0%', '-50%'] } : {}}
            transition={{ repeat: Infinity, duration: 0.22, ease: 'linear' }}
            className="flex whitespace-nowrap gap-6 w-[200%]"
          >
            {Array.from({ length: 24 }).map((_, idx) => (
              <span key={idx} className="w-10 h-2 bg-amber-400/90 rounded-full inline-block shadow-[0_0_8px_#f59e0b]" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Speed & Material Selection Controls */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span>Tire Speed: {speedRpm} RPM</span>
          <span className="text-amber-400">{(speedRpm / 60).toFixed(0)} km/h</span>
        </div>
        <input
          type="range"
          min="1000"
          max="12000"
          step="500"
          value={speedRpm}
          onChange={(e) => setSpeedRpm(parseInt(e.target.value, 10))}
          className="w-full accent-amber-400 cursor-pointer h-3 bg-slate-800 rounded-lg"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              sounds.pop();
              setRubberType('natural');
            }}
            className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all flex flex-col items-center gap-1 ${
              rubberType === 'natural'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-102'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            <span className="text-xl">🌳</span>
            <span>Raw Natural Rubber Wheel</span>
            <span className="text-[10px] opacity-80 font-bold">Uncrosslinked (Melts at 120°C)</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setRubberType('synthetic');
            }}
            className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all flex flex-col items-center gap-1 ${
              rubberType === 'synthetic'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-102'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            <span className="text-xl">🛞</span>
            <span>Vulcanized Tire Wheel</span>
            <span className="text-[10px] opacity-80 font-bold">Sulfur Bridges (Resists 160°C)</span>
          </button>
        </div>

        <button
          onClick={handleTestRun}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-sm shadow-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>🏁 SPIN RACE TRACK TEST AT {speedRpm} RPM!</span>
        </button>
      </div>

      {/* Discovery Science Card */}
      <div className="w-full bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-slate-300">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
          🧪
        </div>
        <div>
          <span className="text-amber-400 font-black block mb-0.5">
            💡 Science Discovery: Charles Goodyear (1839)
          </span>
          <span>
            Natural tree latex gets sticky when hot and brittle when cold. By heating latex with{' '}
            <strong className="text-white">Sulfur</strong>, Goodyear invented{' '}
            <strong className="text-amber-300">Vulcanization</strong> — cross-linking rubber polymer chains into a resilient 3D mesh that never melts!
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. ELASTIC RUBBER STRETCH & SNAP-BACK LAB (5th Grade Hands-on Discovery)
   ============================================================================ */
export const MolecularVulcanizationSim: React.FC<{
  onComplete?: () => void;
  onCompleted?: () => void;
}> = ({ onComplete, onCompleted }) => {
  const [rubberType, setRubberType] = useState<'raw' | 'vulcanized'>('raw');
  const [stretchDistance, setStretchDistance] = useState<number>(0);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [hasTestedBoth, setHasTestedBoth] = useState<boolean>(false);

  const handleNotifyComplete = () => {
    if (onComplete) onComplete();
    if (onCompleted) onCompleted();
  };

  const handleTypeChange = (type: 'raw' | 'vulcanized') => {
    sounds.pop();
    setRubberType(type);
    setStretchDistance(0);
    setIsLaunched(false);
    if (type === 'vulcanized') {
      setHasTestedBoth(true);
      handleNotifyComplete();
    }
  };

  const handleRelease = () => {
    if (stretchDistance === 0) return;
    setIsLaunched(true);
    if (rubberType === 'vulcanized') {
      sounds.success();
      voiceAssistant.speak(
        'SNAP! The cross-linked sulfur bridges act like a trampoline, pulling the rubber instantly back into shape!'
      );
      handleNotifyComplete();
    } else {
      sounds.bubble();
      voiceAssistant.speak(
        'Oh no! Raw tree rubber has no cross-links, so the molecules slide apart and stay permanently stretched and floppy!'
      );
    }
  };

  const handleReset = () => {
    sounds.pop();
    setStretchDistance(0);
    setIsLaunched(false);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-5 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🛞 5th Grade Stretch & Elasticity Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Why Do Tyres & Rubber Bands Snap Back?
          </h3>
        </div>

        {/* Rubber Type Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => handleTypeChange('raw')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              rubberType === 'raw'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌳 1. Raw Tree Sap
          </button>
          <button
            onClick={() => handleTypeChange('vulcanized')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              rubberType === 'vulcanized'
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛞 2. Tough Tyre Rubber
          </button>
        </div>
      </div>

      {/* Interactive Slingshot & Stretch Rig Container */}
      <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border-3 border-slate-800 relative overflow-hidden flex flex-col justify-between p-5 shadow-inner mb-5">
        {/* Top Info Bar */}
        <div className="flex justify-between items-center z-10">
          <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
            <span>Material:</span>
            <span className={rubberType === 'raw' ? 'text-amber-400' : 'text-emerald-400'}>
              {rubberType === 'raw' ? 'Sticky Natural Latex (Unlinked)' : 'Vulcanized Buna Rubber (Cross-Linked)'}
            </span>
          </span>

          <span className="text-xs font-black bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-700">
            Tension: {stretchDistance}%
          </span>
        </div>

        {/* Slingshot / Rubber Band Visual Simulation */}
        <div className="relative w-full flex-1 flex items-center justify-center my-2">
          {/* Left Anchor Post */}
          <div className="absolute left-6 w-5 h-28 bg-slate-700 rounded-full border-2 border-slate-500 shadow-lg z-10 flex flex-col justify-between items-center py-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <div className="w-3 h-3 rounded-full bg-slate-400" />
          </div>

          {/* Right Anchor / Pull Cart */}
          <motion.div
            style={{
              x: !isLaunched ? stretchDistance * 1.8 : 0,
            }}
            transition={
              isLaunched
                ? rubberType === 'vulcanized'
                  ? { type: 'spring', stiffness: 500, damping: 15 }
                  : { duration: 0.8, ease: 'easeOut' }
                : { duration: 0.1 }
            }
            className="absolute left-28 z-20 flex items-center"
          >
            {/* The Bouncy Ball / Cart being pulled */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-xl">
              {rubberType === 'raw' && isLaunched ? '🫠' : '🏀'}
            </div>
          </motion.div>

          {/* Animated Rubber Band Ribbon */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Top strand */}
            <line
              x1="36"
              y1="45"
              x2={130 + (!isLaunched ? stretchDistance * 1.8 : rubberType === 'raw' ? stretchDistance * 1.8 : 0)}
              y2="60"
              stroke={rubberType === 'raw' ? '#f59e0b' : '#10b981'}
              strokeWidth={rubberType === 'raw' ? (isLaunched ? 8 : 10) : 10 - stretchDistance * 0.04}
              strokeLinecap="round"
            />
            {/* Bottom strand */}
            <line
              x1="36"
              y1="95"
              x2={130 + (!isLaunched ? stretchDistance * 1.8 : rubberType === 'raw' ? stretchDistance * 1.8 : 0)}
              y2="80"
              stroke={rubberType === 'raw' ? '#f59e0b' : '#10b981'}
              strokeWidth={rubberType === 'raw' ? (isLaunched ? 8 : 10) : 10 - stretchDistance * 0.04}
              strokeLinecap="round"
            />

            {/* Cross-Link Ladders (Only for Vulcanized) */}
            {rubberType === 'vulcanized' && (
              <>
                {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
                  const endX = 130 + (!isLaunched ? stretchDistance * 1.8 : 0);
                  const curX = 36 + (endX - 36) * ratio;
                  return (
                    <line
                      key={idx}
                      x1={curX}
                      y1={48}
                      x2={curX}
                      y2={92}
                      stroke="#facc15"
                      strokeWidth="3"
                      strokeDasharray="2,2"
                    />
                  );
                })}
              </>
            )}
          </svg>

          {/* Molecule State Badge */}
          <div className="absolute bottom-1 bg-slate-900/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-700 text-[11px] font-bold text-slate-300">
            {rubberType === 'raw'
              ? isLaunched
                ? '❌ Strands slid apart & stayed deformed!'
                : '⛓️ Loose polymer chains (No sulfur safety net)'
              : isLaunched
              ? '⚡ BOING! Cross-links snapped it back instantly!'
              : '🕸️ 3D Cross-Linked Mesh (Connected by sulfur bridges)'}
          </div>
        </div>

        {/* Stretch Slider Control */}
        <div className="w-full flex items-center gap-3 z-10 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-300 shrink-0">Pull Handle:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={stretchDistance}
            disabled={isLaunched}
            onChange={(e) => {
              sounds.pop();
              setStretchDistance(parseInt(e.target.value, 10));
            }}
            className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Action Buttons & Scientific Takeaway */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isLaunched ? (
            <button
              onClick={handleRelease}
              disabled={stretchDistance === 0}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-md cursor-pointer disabled:opacity-40 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>🚀 Release & Snap Back!</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span>🔄 Reset & Try Again</span>
            </button>
          )}
        </div>

        {/* 5th Grade Key Explanation */}
        <div className="text-xs sm:text-sm font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 max-w-sm text-center sm:text-right">
          {rubberType === 'raw' ? (
            <span>
              <strong>Raw Rubber:</strong> Molecules are like loose slippery cooked spaghetti — they slide apart and stay stretched!
            </span>
          ) : (
            <span>
              <strong>Vulcanized Rubber:</strong> Adding sulfur links the chains like a <strong>trampoline net</strong>, so it always snaps back!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. EPOXY SYRINGE MIXER SIMULATOR
   ============================================================================ */
export const EpoxySyringeMixerSim: React.FC<{
  onMixed?: () => void;
}> = ({ onMixed }) => {
  const [partA, setPartA] = useState(0);
  const [partB, setPartB] = useState(0);

  const isFullyMixed = partA >= 50 && partB >= 50;

  const handlePush = () => {
    sounds.pop();
    setPartA((prev) => Math.min(50, prev + 15));
    setPartB((prev) => Math.min(50, prev + 15));

    if (partA + 15 >= 50 && partB + 15 >= 50) {
      sounds.success();
      voiceAssistant.speak('Resin and Hardener mixed! Chemical polymerization begins, turning the liquid into an unbreakable solid rock!');
      if (onMixed) onMixed();
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 rounded-3xl border-4 border-emerald-400 shadow-2xl flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
          Dual-Chamber Epoxy Syringe
        </span>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${isFullyMixed ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
          {isFullyMixed ? '✓ Polymerized Solid' : 'Unmixed Liquids'}
        </span>
      </div>

      <div className="flex gap-4 w-full justify-center mb-6">
        {/* Syringe Chamber A */}
        <div className="w-20 h-40 bg-slate-900 rounded-t-2xl border-2 border-slate-700 relative flex flex-col justify-end p-1">
          <motion.div
            style={{ height: `${100 - partA * 2}%` }}
            className="w-full bg-gradient-to-t from-cyan-500 to-sky-400 rounded-lg shadow-[0_0_10px_#06b6d4]"
          />
          <span className="absolute top-2 left-0 right-0 text-[10px] font-black text-center text-cyan-300">
            Resin (A)
          </span>
        </div>

        {/* Syringe Chamber B */}
        <div className="w-20 h-40 bg-slate-900 rounded-t-2xl border-2 border-slate-700 relative flex flex-col justify-end p-1">
          <motion.div
            style={{ height: `${100 - partB * 2}%` }}
            className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-lg shadow-[0_0_10px_#f59e0b]"
          />
          <span className="absolute top-2 left-0 right-0 text-[10px] font-black text-center text-amber-300">
            Hardener (B)
          </span>
        </div>
      </div>

      <button
        onClick={handlePush}
        disabled={isFullyMixed}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs md:text-sm shadow-lg cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <Wrench className="w-4 h-4" />
        <span>{isFullyMixed ? 'Polymerization Complete!' : 'Press Dual Plunger (Mix 1:1)'}</span>
      </button>
    </div>
  );
};
