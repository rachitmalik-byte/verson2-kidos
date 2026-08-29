import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Sparkles, AlertTriangle, CheckCircle2, Flame, Droplet, Zap, RotateCcw, Wrench } from 'lucide-react';

import realTireTreadImg from '@/assets/images/experiments/vulcanized_car_tire_tread.jpg';
import rubberTreeLatexImg from '@/assets/images/experiments/rubber_tree_tapping_latex.jpg';

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
   2. FORMULA 1 TIRE FRICTION & VULCANIZATION SIMULATOR (MISSION 11)
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
        'Extreme friction! Natural rubber polymer chains have NO crosslinks. They slide apart, melt, and turn into sticky gooey paste at 120°C!'
      );
    } else {
      sounds.success();
      voiceAssistant.speak(
        'Incredible road grip! Vulcanized rubber uses sulfur crosslinks to lock rubber chains into a tough 3D mesh that resists 160°C heat!'
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

      {/* Realistic Rolling Tire & Moving Road Stage */}
      <div className="relative w-full h-56 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl border-3 border-slate-700 flex flex-col items-center justify-center overflow-hidden mb-6 shadow-inner">
        {/* Sky / Speed Blur Lines */}
        {isSpinning && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 0.25 + i * 0.05, ease: 'linear' }}
                style={{ top: `${i * 12}%` }}
                className="absolute h-0.5 w-32 bg-amber-400"
              />
            ))}
          </div>
        )}

        {/* The Rotating Real Tire Wheel Assembly */}
        <div className="relative flex items-center justify-center">
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
                    duration: Math.max(0.06, 0.8 - speedRpm / 15000),
                    ease: 'linear',
                  }
                : {}
            }
            className={`relative w-36 h-36 rounded-full border-8 overflow-hidden shadow-2xl flex items-center justify-center ${
              isOverheated
                ? 'border-amber-900 scale-95 ring-4 ring-rose-500'
                : 'border-slate-800 ring-4 ring-amber-400/50'
            }`}
          >
            {/* Real Photographic Tread Texture */}
            <img
              src={rubberType === 'synthetic' ? realTireTreadImg : rubberTreeLatexImg}
              alt="Tire Tread Texture"
              className={`w-full h-full object-cover ${
                isOverheated ? 'filter brightness-50 contrast-150 blur-[1px]' : ''
              }`}
            />

            {/* Aluminum Wheel Hub */}
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-900 border-4 border-amber-400 shadow-xl flex items-center justify-center">
              <span className="text-[10px] font-black text-amber-300 font-mono">F1</span>
            </div>
          </motion.div>

          {/* Friction Heat & Smoke FX */}
          {isSpinning && (
            <div className="absolute right-0 bottom-2 pointer-events-none flex gap-1">
              <motion.span
                animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.5], x: [0, 30, 60], y: [0, -20, -40] }}
                transition={{ repeat: Infinity, duration: 0.35 }}
                className="text-2xl"
              >
                {isOverheated ? '🔥' : '💨'}
              </motion.span>
            </div>
          )}
        </div>

        {/* Animated Textured Asphalt Road Surface */}
        <div className="absolute bottom-0 w-full h-10 bg-slate-950 border-t-4 border-slate-700 flex items-center overflow-hidden">
          <motion.div
            animate={isSpinning ? { x: ['0%', '-50%'] } : {}}
            transition={{ repeat: Infinity, duration: 0.3, ease: 'linear' }}
            className="flex whitespace-nowrap gap-6 w-[200%]"
          >
            {Array.from({ length: 20 }).map((_, idx) => (
              <span key={idx} className="w-8 h-1.5 bg-amber-400/80 rounded-full inline-block" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Speed & Rubber Material Controls */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span>Speed: {speedRpm} RPM</span>
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
            <span>Raw Tree Latex Rubber</span>
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
            <span>Vulcanized Tire Rubber</span>
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

      {/* Visual Collage & Discovery Card */}
      <div className="w-full bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-slate-300">
        <img
          src={rubberTreeLatexImg}
          alt="Natural Rubber Tree Latex"
          className="w-16 h-16 rounded-xl object-cover border border-amber-400/40 shrink-0"
        />
        <div>
          <span className="text-amber-400 font-black block mb-0.5">
            💡 Science Discovery: Charles Goodyear (1839)
          </span>
          <span>
            Natural tree latex gets sticky when hot and brittle when cold. By heating latex with{' '}
            <strong className="text-white">Sulfur</strong>, Goodyear created{' '}
            <strong className="text-amber-300">Vulcanization</strong> — locking rubber polymers into an elastic 3D grid that never melts!
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. MOLECULAR VULCANIZATION SIMULATOR
   ============================================================================ */
export const MolecularVulcanizationSim: React.FC<{
  onComplete?: () => void;
}> = ({ onComplete }) => {
  const [hasSulfur, setHasSulfur] = useState(false);

  const handleAddSulfur = () => {
    sounds.sparkle();
    setHasSulfur(true);
    voiceAssistant.speak('Sulfur bridges formed! The straight polymer strands are now cross-linked into a super strong 3D matrix!');
    if (onComplete) onComplete();
  };

  return (
    <div className="w-full bg-slate-950 p-6 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
          Microscopic Polymer Cross-Linking
        </span>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${hasSulfur ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
          {hasSulfur ? '✓ 3D Cross-Linked Mesh' : 'Linear Unlinked Strands'}
        </span>
      </div>

      {/* Grid of polymers */}
      <div className="relative w-full h-40 bg-slate-900 rounded-2xl border-2 border-slate-800 flex flex-col justify-around p-4 overflow-hidden mb-4">
        {[1, 2, 3].map((strand) => (
          <div key={strand} className="relative w-full h-3 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 rounded-full flex items-center justify-around shadow-[0_0_10px_#06b6d4]">
            {/* Cross-linking bridges */}
            {hasSulfur && strand < 3 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: strand * 0.1 }}
                className="absolute top-3 w-3 h-10 bg-gradient-to-b from-amber-400 to-yellow-300 rounded-full shadow-[0_0_10px_#f59e0b] origin-top z-10"
                style={{ left: `${strand * 30}%` }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddSulfur}
        disabled={hasSulfur}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs md:text-sm shadow-lg cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{hasSulfur ? 'Sulfur Bridges Active!' : 'Add Sulfur & Heat (Vulcanize!)'}</span>
      </button>
    </div>
  );
};

/* ============================================================================
   4. EPOXY SYRINGE MIXER SIMULATOR
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
