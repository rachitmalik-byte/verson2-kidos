import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Wind, Droplets, Thermometer, Sparkles, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface Props {
  onComplete: () => void;
  isCompleted?: boolean;
}

export const SummerComfortVectorLab: React.FC<Props> = ({ onComplete, isCompleted }) => {
  const [breezeActive, setBreezeActive] = useState(false);
  const [sweatSprayed, setSweatSprayed] = useState(false);
  const [sunLevel, setSunLevel] = useState<'mild' | 'scorching'>('scorching');

  const cottonTemp = breezeActive && sweatSprayed ? 26.5 : sweatSprayed ? 29.0 : 30.0;
  const polyTemp = breezeActive && sweatSprayed ? 32.0 : sweatSprayed ? 33.5 : 34.0;

  const handleSpraySweat = () => {
    sounds.splash();
    setSweatSprayed(true);
    voiceAssistant.speak('Perspiration sprayed! Now turn on the cooling breeze to see which fabric evaporates faster.');
  };

  const handleToggleBreeze = () => {
    sounds.pop();
    const next = !breezeActive;
    setBreezeActive(next);
    if (next) {
      sounds.success();
      onComplete();
      voiceAssistant.speak('Look at that! Cotton allows the breeze to evaporate sweat, dropping skin temperature to 26.5 degrees Celsius!');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-amber-600" /> 2D Summer Science Simulation
        </span>
        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          Grade 5 Evaporative Cooling Lab
        </span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
        The 38°C Summer T-Shirt Test! 🏃‍♂️☀️
      </h3>
      <p className="text-xs sm:text-sm font-bold text-slate-600 text-center mb-6 max-w-xl leading-relaxed">
        Why does 100% Cotton feel cool and breezy in the summer sun, while Synthetic Polyester feels like wearing a hot plastic bag?
      </p>

      {/* Side-by-Side 2D Cartoon Science Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
        {/* 🌿 LEFT: 100% Breathable Natural Cotton */}
        <div className="bg-emerald-50/80 rounded-3xl border-3 border-emerald-300 p-5 flex flex-col items-center text-center relative overflow-hidden shadow-md">
          {/* Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-lg">🌿</span>
            <span className="font-black text-emerald-950 text-base">1. Natural Cotton Shirt</span>
            <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Breathable</span>
          </div>

          {/* 2D Cartoon Stage */}
          <div className="w-full h-56 bg-gradient-to-b from-sky-100 to-emerald-100 rounded-2xl border-2 border-emerald-200 relative overflow-hidden flex flex-col items-center justify-center p-3">
            {/* Friendly Smiling Cartoon Runner */}
            <div className="relative flex flex-col items-center">
              {/* Head */}
              <div className="w-14 h-14 bg-amber-200 rounded-full border-2 border-amber-400 relative flex items-center justify-center shadow-xs">
                {/* Eyes */}
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                </div>
                {/* Smile */}
                <div className="absolute bottom-2.5 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
                {/* Cap */}
                <div className="absolute -top-1 bg-emerald-500 w-12 h-3 rounded-full border border-emerald-600" />
              </div>

              {/* Cotton T-Shirt (Green / Breathable Grid) */}
              <div className="w-24 h-20 bg-emerald-400 border-2 border-emerald-600 rounded-2xl mt-1 relative flex flex-col items-center justify-center shadow-sm">
                <span className="text-[10px] font-black text-emerald-950">100% COTTON</span>
                
                {/* Microscopic Pores Visual Effect */}
                <div className="flex gap-1.5 mt-1 opacity-70">
                  <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full" />
                </div>

                {/* Evaporating Steam Particles */}
                {sweatSprayed && (
                  <motion.div
                    animate={{ y: [-2, -18], opacity: [1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute -top-3 flex gap-2 text-sky-600 font-black text-xs"
                  >
                    <span>💨</span>
                    <span>💨</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Breeze Arrows Flowing Through */}
            {breezeActive && (
              <motion.div
                animate={{ x: [-30, 80], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-start pointer-events-none"
              >
                <div className="flex flex-col gap-3 ml-4">
                  <div className="w-12 h-1.5 bg-sky-400 rounded-full shadow-xs flex items-center justify-end">
                    <span className="text-[10px] text-sky-700 mr-1">➤</span>
                  </div>
                  <div className="w-16 h-1.5 bg-sky-400 rounded-full shadow-xs flex items-center justify-end">
                    <span className="text-[10px] text-sky-700 mr-1">➤</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Live Thermometer */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1 shadow-xs">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-black text-xs text-emerald-950">{cottonTemp.toFixed(1)}°C ❄️</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 text-left w-full">
            <span className="text-xs font-black text-emerald-900 block mb-0.5">
              ✓ Open Micro-Pores Cool the Body:
            </span>
            <p className="text-[11px] font-bold text-emerald-800 leading-snug">
              Cotton plant fibers have tiny pores. Liquid sweat is wicked away to the outside where the wind evaporates it, pulling heat right off your skin!
            </p>
          </div>
        </div>

        {/* 👕 RIGHT: Non-Porous Synthetic Polyester */}
        <div className="bg-rose-50/80 rounded-3xl border-3 border-rose-300 p-5 flex flex-col items-center text-center relative overflow-hidden shadow-md">
          {/* Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-lg">👕</span>
            <span className="font-black text-rose-950 text-base">2. Synthetic Polyester</span>
            <span className="text-[10px] font-black bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">Non-Porous</span>
          </div>

          {/* 2D Cartoon Stage */}
          <div className="w-full h-56 bg-gradient-to-b from-orange-100 to-rose-100 rounded-2xl border-2 border-rose-200 relative overflow-hidden flex flex-col items-center justify-center p-3">
            {/* Sweating Flushed Cartoon Runner */}
            <div className="relative flex flex-col items-center">
              {/* Head */}
              <div className="w-14 h-14 bg-orange-200 rounded-full border-2 border-rose-400 relative flex items-center justify-center shadow-xs">
                {/* Cheeks (Red Flushed) */}
                <div className="absolute top-7 left-1.5 w-2.5 h-2 bg-rose-400/60 rounded-full" />
                <div className="absolute top-7 right-1.5 w-2.5 h-2 bg-rose-400/60 rounded-full" />
                {/* Eyes (Strained) */}
                <div className="flex gap-3">
                  <div className="w-2.5 h-1 bg-slate-800 rounded-full rotate-6" />
                  <div className="w-2.5 h-1 bg-slate-800 rounded-full -rotate-6" />
                </div>
                {/* Unhappy mouth */}
                <div className="absolute bottom-2.5 w-3 h-1.5 border-t-2 border-slate-800 rounded-full" />
                {/* Sweat Bead on Forehead */}
                {sweatSprayed && (
                  <motion.div
                    animate={{ y: [0, 4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute -top-1 right-2 text-xs"
                  >
                    💧
                  </motion.div>
                )}
              </div>

              {/* Polyester T-Shirt (Shiny Orange / Blocked Plastic Layer) */}
              <div className="w-24 h-20 bg-rose-400 border-2 border-rose-600 rounded-2xl mt-1 relative flex flex-col items-center justify-center shadow-sm">
                <span className="text-[10px] font-black text-rose-950">POLYESTER</span>
                
                {/* Trapped Sweat Drops (Trapped under plastic) */}
                {sweatSprayed && (
                  <div className="flex gap-1 mt-1 text-[11px] animate-pulse">
                    <span>💧</span>
                    <span>💧</span>
                    <span>💧</span>
                  </div>
                )}

                {/* Trapped Heat Waves */}
                <div className="absolute -inset-1 border-2 border-dashed border-rose-500 rounded-2xl animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Blocked Breeze Bouncing Off */}
            {breezeActive && (
              <motion.div
                animate={{ x: [-20, 15], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center"
              >
                <div className="w-8 h-1.5 bg-rose-400 rounded-full mr-1" />
                <span className="text-xs font-black text-rose-600">🚫 BLOCKED!</span>
              </motion.div>
            )}

            {/* Live Thermometer */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-rose-300 flex items-center gap-1 shadow-xs">
              <Thermometer className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-black text-xs text-rose-950">{polyTemp.toFixed(1)}°C 🔥</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 text-left w-full">
            <span className="text-xs font-black text-rose-900 block mb-0.5">
              ⚠️ Plastic Chains Trap Sweat & Heat:
            </span>
            <p className="text-[11px] font-bold text-rose-800 leading-snug">
              Synthetic polyester has zero pores. Moisture cannot escape through the solid plastic threads, turning your shirt into a sticky sauna!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Control Buttons */}
      <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
        <button
          onClick={handleSpraySweat}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
            sweatSprayed
              ? 'bg-sky-500 text-white ring-2 ring-sky-300'
              : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-4 h-4 text-sky-200" />
          <span>1. Spray Perspiration 💦</span>
        </button>

        <button
          onClick={handleToggleBreeze}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
            breezeActive
              ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
              : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Wind className="w-4 h-4 text-emerald-200" />
          <span>2. Turn On Summer Breeze 💨</span>
        </button>
      </div>

      {/* Discovery Callout Banner */}
      {breezeActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-xs sm:text-sm font-black text-emerald-950 w-full"
        >
          🎉 Science Aha! Cotton allows evaporative cooling ({cottonTemp.toFixed(1)}°C), while synthetic polyester traps sweat like plastic cling wrap ({polyTemp.toFixed(1)}°C)!
        </motion.div>
      )}
    </div>
  );
};
