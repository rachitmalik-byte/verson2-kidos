import { ThreeAquariumSim } from '@/components/three-lab/ThreeAquariumSim';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, Sparkles, Waves, Castle, Microscope, Shield, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

/* ============================================================================
   1. 🏰 GHADISAR LAKE 9-TANK INTERCONNECTED STEPWELL SIMULATOR (WATER CHAPTER 2)
   ============================================================================ */
export const GhadisarStepwellWaterSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [filledTanks, setFilledTanks] = useState<number>(1);
  const [rainActive, setRainActive] = useState<boolean>(false);

  const handleStartRain = () => {
    sounds.bubble();
    setRainActive(true);
    voiceAssistant.speak(
      'Monsoon rains begin in Jaisalmer! In King Ghadsi’s 650-year-old engineering design, water fills Lake 1, overflows through stone canals into Lake 2, and cascades across all 9 interconnected lakes!'
    );

    const interval = setInterval(() => {
      setFilledTanks((prev) => {
        if (prev >= 9) {
          clearInterval(interval);
          sounds.fanfare();
          if (onCompleted) onCompleted();
          return 9;
        }
        sounds.pop();
        return prev + 1;
      });
    }, 700);
  };

  const handleReset = () => {
    sounds.pop();
    setFilledTanks(1);
    setRainActive(false);
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Castle className="w-6 h-6 text-amber-600" />
        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Jaisalmer Ghadisar Lake: 9 Interconnected Tanks & Stepwell
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 text-center max-w-lg">
        Built 650 years ago in Rajasthan: rain fills the highest lake, and natural gravity channels overflow water to 9 lower lakes without wasting a single drop!
      </p>

      {/* 9 Interconnected Tanks Visual Grid */}
      <div className="w-full bg-gradient-to-b from-amber-50 to-orange-100 p-5 rounded-3xl border-2 border-amber-200 shadow-inner my-2">
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {[...Array(9)].map((_, idx) => {
            const isFilled = idx < filledTanks;
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isFilled ? [1, 1.05, 1] : 1,
                  borderColor: isFilled ? '#0284C7' : '#D97706',
                }}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                  isFilled
                    ? 'bg-gradient-to-b from-sky-400 to-blue-500 text-white shadow-md'
                    : 'bg-amber-100/80 text-amber-900 border-dashed border-amber-300'
                }`}
              >
                <span className="text-[10px] font-black uppercase">Tank {idx + 1}</span>
                <span className="text-2xl my-1">{isFilled ? '💧' : '🏜️'}</span>
                <span className="text-[9px] font-bold">
                  {isFilled ? '100% Full' : 'Empty'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Gravity Flow Direction Arrows */}
        <div className="flex items-between justify-between px-2 mt-3 text-amber-700 text-xs font-black">
          <span>⬆️ Lake 1 (Catchment Basin)</span>
          <span className="hidden sm:inline">Gravity Flow Canals ➔ ➔ ➔</span>
          <span>Lake 9 (Underground Bawri) ⬇️</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {!rainActive ? (
          <button
            onClick={handleStartRain}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-sm shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
          >
            <span>🌧️ Start Monsoon Rain on Lake 1</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Lakes</span>
          </button>
        )}
      </div>

      {filledTanks >= 9 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3.5 bg-emerald-50 border border-emerald-400 rounded-2xl text-xs font-black text-emerald-950 text-center"
        >
          🎉 Ancient Engineering Discovery: All 9 lakes are full! In dry desert summers, stepwells (Bawris) provide clean drinking water year-round!
        </motion.div>
      )}
    </div>
  );
};

/* ============================================================================
   2. 🧪 DEAD SEA DENSITY & BUOYANCY SIMULATOR (WATER CHAPTER 3) — 3D THREE.JS LAB
   ============================================================================ */
export const DensityBuoyancyDeadSeaSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return <ThreeAquariumSim onCompleted={onCompleted} />;
};

/* ============================================================================
   3. 🔬 MOSQUITO LARVAE & STAGNANT WATER ECOLOGY LAB (WATER CHAPTER 4)
   ============================================================================ */
export const MosquitoLarvaeEcologySim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [treatedWithOil, setTreatedWithOil] = useState<boolean>(false);
  const [larvaeCount, setLarvaeCount] = useState<number>(6);

  const handleApplyOil = () => {
    sounds.bubble();
    setTreatedWithOil(true);
    voiceAssistant.speak(
      'Oil Barrier Applied! A thin film of oil floats on water, cutting off the oxygen breathing siphon of mosquito larvae so they cannot develop into biting mosquitoes!'
    );

    setTimeout(() => {
      sounds.fanfare();
      setLarvaeCount(0);
      if (onCompleted) onCompleted();
    }, 1200);
  };

  const handleReset = () => {
    sounds.pop();
    setTreatedWithOil(false);
    setLarvaeCount(6);
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        <Microscope className="w-6 h-6 text-emerald-600" />
        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Microscope Water Ecology & Mosquito Prevention Lab
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 text-center max-w-md">
        Explore how mosquito larvae breathe through surface water tubes, and test how an eco-oil film stops malaria breeding!
      </p>

      <div className="relative w-64 h-64 rounded-full border-8 border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center overflow-hidden my-3 ring-4 ring-emerald-400/80">
        {treatedWithOil && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 inset-x-0 h-10 bg-amber-400/70 backdrop-blur-xs border-b-2 border-amber-300 z-20 flex items-center justify-center text-[10px] font-black text-amber-950"
          >
            🛡️ Oil Film Layer (Blocks O₂ Siphon)
          </motion.div>
        )}

        {larvaeCount > 0 ? (
          <div className="relative w-full h-full">
            {[...Array(larvaeCount)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 5, 0],
                  x: [0, (i % 2 === 0 ? 15 : -15), 0],
                  rotate: [0, (i % 2 === 0 ? 12 : -12), 0],
                }}
                transition={{ duration: 2 + (i % 2), repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  left: `${(i * 16) % 80 + 10}%`,
                  top: `${(i * 14) % 60 + 20}%`,
                }}
                className="absolute text-2xl"
              >
                🐛
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1" />
            <span className="text-xs font-black text-emerald-300">Clean Water Certified!</span>
            <span className="text-[10px] text-slate-400 mt-1">Zero mosquito larvae surviving</span>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none border border-emerald-400/30 rounded-full flex items-center justify-center">
          <div className="w-full h-[1px] bg-emerald-400/30 absolute" />
          <div className="h-full w-[1px] bg-emerald-400/30 absolute" />
          <div className="w-20 h-20 rounded-full border border-emerald-400/40 absolute" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {!treatedWithOil ? (
          <button
            onClick={handleApplyOil}
            className="px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
          >
            <span>🛢️ Apply Eco-Oil Film to Water Surface</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Stagnant Water</span>
          </button>
        )}
      </div>
    </div>
  );
};
