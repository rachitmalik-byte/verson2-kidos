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
   2. FORMULA 1 TIRE FRICTION & HEAT SIMULATOR (MISSION 11)
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
    if (rubberType === 'natural' && speedRpm > 6000) {
      sounds.boing();
      voiceAssistant.speak('Extreme friction! Natural rubber uncrosslinked polymers melt and deform into sticky paste at 120 degrees Celsius!');
    } else {
      sounds.success();
      voiceAssistant.speak('Incredible grip! Vulcanized synthetic rubber sulfur crosslinks hold firm under blistering 160 degrees Celsius heat!');
      if (onTested) onTested();
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center relative overflow-hidden">
      <div className="flex justify-between items-center w-full mb-4 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          <Flame className={`w-4 h-4 ${isOverheated ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
          <span className="text-xs font-black uppercase text-white">
            Friction Heat: {frictionTemp}°C
          </span>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${isOverheated ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-400 text-slate-950'}`}>
          {isOverheated ? '⚠️ TREAD MELTING & DEFORMED' : '⚡ 3D CROSSLINKED GRIP STABLE'}
        </span>
      </div>

      <div className="relative w-full h-48 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden mb-6 shadow-inner">
        <div className="absolute bottom-4 w-full h-6 bg-slate-950 border-t-2 border-dashed border-amber-400/60" />

        <motion.div
          animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
          transition={isSpinning ? { repeat: Infinity, duration: Math.max(0.08, 1.2 - speedRpm / 10000), ease: 'linear' } : {}}
          className={`relative w-28 h-28 rounded-full border-8 shadow-2xl flex items-center justify-center ${
            rubberType === 'natural' && frictionTemp > 100
              ? 'bg-amber-700 border-amber-900 rounded-[40%] scale-95'
              : 'bg-slate-900 border-slate-800 ring-4 ring-amber-400/40'
          }`}
        >
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 flex items-center justify-center bg-slate-950">
            <span className="text-xs font-black text-amber-400">F1</span>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-600 pointer-events-none" />
        </motion.div>

        {isSpinning && (
          <div className="absolute right-1/3 bottom-8 flex gap-2 pointer-events-none">
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2], x: [0, -30, -60] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="text-xl"
            >
              {isOverheated ? '🔥' : '💨'}
            </motion.span>
          </div>
        )}
      </div>

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
            onClick={() => setRubberType('natural')}
            className={`p-3 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all ${
              rubberType === 'natural' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            🌳 Natural Raw Latex Rubber
          </button>
          <button
            onClick={() => setRubberType('synthetic')}
            className={`p-3 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all ${
              rubberType === 'synthetic' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            🛞 Vulcanized Synthetic Tire Rubber
          </button>
        </div>

        <button
          onClick={handleTestRun}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          🏁 Spin Race Track Test at {speedRpm} RPM!
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   3. MOLECULAR VULCANIZATION VISUALIZER (MISSION 11)
   ============================================================================ */
export const MolecularVulcanizationSim: React.FC<{
  onCompleted?: () => void;
}> = ({ onCompleted }) => {
  const [hasSulfurBridges, setHasSulfurBridges] = useState(false);

  return (
    <div className="w-full bg-slate-900 p-6 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center text-white mb-6">
      <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full mb-3">
        🔬 Molecular Cross-Linking Visualizer
      </span>
      <p className="text-xs text-slate-300 font-bold mb-4 text-center max-w-md">
        {hasSulfurBridges
          ? 'Sulfur bridges lock polymer chains together into a 3D elastic web that springs back and never melts!'
          : 'Natural rubber chains are loose and slide past each other when heated, losing their shape.'}
      </p>

      <div className="w-full max-w-sm h-36 bg-slate-950 rounded-2xl border-2 border-slate-800 relative flex items-center justify-around p-4 mb-4">
        <div className="flex flex-col items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={`c1-${i}`}
              animate={hasSulfurBridges ? { y: 0 } : { y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 1 + i * 0.2 }}
              className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-cyan-300 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-md"
            >
              C
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col justify-around h-full py-2">
          {[1, 2, 3].map((i) => (
            <div key={`bridge-${i}`} className="flex items-center justify-center w-12">
              {hasSulfurBridges ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-3 bg-amber-400 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950 shadow-[0_0_8px_#f59e0b]"
                >
                  -S-S-
                </motion.div>
              ) : (
                <div className="w-full h-[1px] border-t border-dashed border-slate-700" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={`c2-${i}`}
              animate={hasSulfurBridges ? { y: 0 } : { y: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 1.2 + i * 0.2 }}
              className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-cyan-300 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-md"
            >
              C
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          sounds.sparkle();
          const next = !hasSulfurBridges;
          setHasSulfurBridges(next);
          if (next && onCompleted) onCompleted();
        }}
        className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-slate-950" />
        <span>{hasSulfurBridges ? '✓ Sulfur Cross-Links Locked!' : 'Add Sulfur Vulcanization Cross-Links ⚡'}</span>
      </button>
    </div>
  );
};

/* ============================================================================
   4. TWO-PART EPOXY SYRINGE DISPENSER (MISSION 12)
   ============================================================================ */
export const EpoxySyringeMixerSim: React.FC<{
  onMixed?: () => void;
}> = ({ onMixed }) => {
  const [dispensed, setDispensed] = useState(false);
  const [mixed, setMixed] = useState(false);

  return (
    <div className="w-full bg-slate-900 p-6 rounded-3xl border-4 border-teal-400 shadow-xl flex flex-col items-center text-white mb-6">
      <span className="text-xs font-black uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full mb-3">
        🧪 2-Part Syringe Polymerization Dispenser
      </span>
      <p className="text-xs text-slate-300 font-bold mb-4 text-center max-w-md">
        {mixed
          ? 'Polymerization complete! Resin + Hardener reacted into a rigid, waterproof cross-linked polymer.'
          : dispensed
          ? 'Dispensed! Now stir Part A (Liquid Resin) and Part B (Hardener) to trigger chemical cross-linking!'
          : 'Dispense the two separate chemical tubes into the mixing tray.'}
      </p>

      <div className="w-full max-w-sm h-36 bg-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-around p-4 mb-4">
        {/* Tube A (Resin) */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-20 bg-cyan-900/60 border-2 border-cyan-400 rounded-t-lg relative flex items-end justify-center overflow-hidden">
            <motion.div
              animate={dispensed ? { height: '20%' } : { height: '80%' }}
              className="w-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
            />
          </div>
          <span className="text-[10px] font-black text-cyan-300 mt-1">Part A: Resin</span>
        </div>

        {/* Mixing Nozzle / Result */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center relative">
            {mixed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399] flex items-center justify-center text-slate-950 font-black text-xs"
              >
                CURED
              </motion.div>
            ) : dispensed ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl"
              >
                🌀
              </motion.div>
            ) : (
              <span className="text-slate-600 text-xs font-bold">Empty</span>
            )}
          </div>
          <span className="text-[10px] font-black text-slate-400 mt-1">Reaction Tray</span>
        </div>

        {/* Tube B (Hardener) */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-20 bg-amber-900/60 border-2 border-amber-400 rounded-t-lg relative flex items-end justify-center overflow-hidden">
            <motion.div
              animate={dispensed ? { height: '20%' } : { height: '80%' }}
              className="w-full bg-amber-400 shadow-[0_0_10px_#f59e0b]"
            />
          </div>
          <span className="text-[10px] font-black text-amber-300 mt-1">Part B: Hardener</span>
        </div>
      </div>

      <div className="flex gap-3">
        {!dispensed ? (
          <button
            onClick={() => {
              sounds.pop();
              setDispensed(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black text-xs cursor-pointer shadow-md"
          >
            1. Push Dual Plunger 💉
          </button>
        ) : !mixed ? (
          <button
            onClick={() => {
              sounds.sparkle();
              setMixed(true);
              if (onMixed) onMixed();
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer shadow-md"
          >
            2. Stir & Polymerize 🌀
          </button>
        ) : (
          <div className="p-2 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-black">
            ✨ Insoluble Waterproof Polymer Formed!
          </div>
        )}
      </div>
    </div>
  );
};
