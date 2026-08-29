import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Droplets,
  Sparkles,
  Rocket,
  RotateCcw,
  CheckCircle2,
  Globe,
  HelpCircle,
} from 'lucide-react';

export const SunitaInSpaceMultiStationLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [currentStation, setCurrentStation] = useState<'cohesion' | 'daily_life' | 'gravity_toggle'>('cohesion');

  // Station A: Water Blob State
  const [blobSize, setBlobSize] = useState(0); // 0 (empty) to 50px
  const [isTowelAbsorbed, setIsTowelAbsorbed] = useState(false);

  // Station C: Gravity Toggle State
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');

  const handleSqueezePouch = () => {
    sounds.sparkle();
    const newSize = Math.min(55, blobSize + 15);
    setBlobSize(newSize);
    setIsTowelAbsorbed(false);

    voiceAssistant.speak(
      'Water squeezed! Watch how surface tension pulls water into a floating round liquid sphere in zero gravity!'
    );
  };

  const handleAbsorbWater = () => {
    if (blobSize > 0) {
      sounds.pop();
      setIsTowelAbsorbed(true);
      setBlobSize(0);
      sounds.success();
      voiceAssistant.speak('Towel captured the floating droplet! Astronauts use paper towels to dry their hands in space!');
      if (onCompleted) onCompleted();
    }
  };

  const handleGravityToggle = (mode: 'orbit' | 'earth') => {
    sounds.pop();
    setGravityMode(mode);
    if (mode === 'orbit') {
      sounds.sparkle();
      voiceAssistant.speak('Orbital weightlessness! The space station is falling around Earth, creating continuous zero-g freefall!');
    } else {
      voiceAssistant.speak('Earth gravity 1g! Earth’s mass pulls all objects downwards at 9.8 meters per second squared.');
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-2xl flex flex-col items-center text-white relative overflow-hidden">
      {/* 3-Station Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-slate-900 p-1.5 rounded-2xl border border-slate-700">
        {[
          { id: 'cohesion', label: '1. Surface Tension & Water Spheres 💧', desc: 'Liquid Physics' },
          { id: 'daily_life', label: '2. Daily Life in Orbit vs Earth 👩‍🚀', desc: 'Habitats' },
          { id: 'gravity_toggle', label: '3. 1g Earth vs 0g Orbit Freefall 🌍', desc: 'Gravity Engine' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => {
              sounds.pop();
              setCurrentStation(s.id as any);
            }}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
              currentStation === s.id
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STATION 1: LIQUID SURFACE TENSION & COHESION
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'cohesion' && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-black uppercase text-indigo-400 mb-1">
            Station A: Surface Tension & Floating Water Droplets
          </span>
          <p className="text-xs text-slate-300 font-bold mb-4 text-center max-w-md">
            Squeeze the drink pouch to dispense water in orbit, then use the microfiber towel to catch the floating sphere!
          </p>

          <div className="relative w-full max-w-md h-72 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-3 border-indigo-500 shadow-2xl flex items-center justify-between p-6 overflow-hidden">
            {/* Squeeze Drink Pouch (Left) */}
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSqueezePouch}
                className="w-20 h-28 bg-gradient-to-b from-sky-400 to-blue-600 rounded-xl border-3 border-white shadow-xl flex flex-col items-center justify-between py-2 cursor-pointer"
              >
                <span className="text-xs font-black text-slate-950">DRINK POUCH</span>
                <span className="text-2xl">🧃</span>
                <span className="text-[9px] font-black text-white bg-slate-900/80 px-2 py-0.5 rounded-full">
                  Squeeze!
                </span>
              </motion.button>
            </div>

            {/* Floating Wobbly Water Sphere (Center) */}
            <div className="flex-1 flex items-center justify-center relative">
              {blobSize > 0 && !isTowelAbsorbed ? (
                <motion.div
                  animate={{
                    scale: [1, 1.08, 0.95, 1],
                    y: [-6, 6, -6],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="rounded-full bg-gradient-to-br from-cyan-200 via-sky-400 to-blue-600 border-2 border-white/90 shadow-[0_0_30px_#38bdf8] flex items-center justify-center relative"
                  style={{ width: blobSize * 2, height: blobSize * 2 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full absolute top-2 left-2 opacity-80" />
                  <span className="text-[9px] font-black text-slate-950">Surface Tension</span>
                </motion.div>
              ) : isTowelAbsorbed ? (
                <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500">
                  ✓ Water Droplet Absorbed by Towel!
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500">
                  Tap Drink Pouch to Inject Water Blob
                </span>
              )}
            </div>

            {/* Microfiber Towel Catch Tool (Right) */}
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAbsorbWater}
                disabled={blobSize === 0}
                className="w-20 h-28 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 rounded-xl border-3 border-white shadow-xl flex flex-col items-center justify-between py-2 cursor-pointer text-slate-950 font-black text-xs"
              >
                <span>TOWEL</span>
                <span className="text-2xl">🧻</span>
                <span className="text-[9px] bg-slate-950 text-white px-2 py-0.5 rounded-full">
                  Absorb!
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: DAILY LIFE IN ORBIT VS EARTH
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'daily_life' && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-black uppercase text-indigo-400 mb-1">
            Station B: Sunita Williams Daily Living Matrix (Earth vs ISS Orbit)
          </span>
          <p className="text-xs text-slate-300 font-bold mb-4 text-center max-w-md">
            Compare how normal daily activities change completely in zero-gravity space orbit!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-indigo-500 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">💇‍♀️</span>
              <h4 className="text-sm font-black text-white">Hair Standing Up</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                On Earth, gravity pulls hair down. In orbit, hair floats straight up in all directions!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-indigo-500 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">🛌 🪢</span>
              <h4 className="text-sm font-black text-white">Wall-Tethered Sleep</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                No beds! Astronauts strap sleeping bags to the wall so they don't float and bump into computers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-indigo-500 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">🍝 🫧</span>
              <h4 className="text-sm font-black text-white">Eating Floating Food</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Food cannot be placed on open plates; astronauts catch floating food pastes with tortillas and velcro trays!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 3: 1G EARTH VS 0G ORBIT FREEFALL
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'gravity_toggle' && (
        <div className="w-full flex flex-col items-center">
          <span className="text-xs font-black uppercase text-indigo-400 mb-1">
            Station C: 1g Earth Gravity vs 0g Orbital Freefall Engine
          </span>
          <p className="text-xs text-slate-300 font-bold mb-4 text-center max-w-md">
            Toggle the gravity physics engine to watch objects fall to the floor vs float in continuous orbital freefall!
          </p>

          <div className="relative w-full max-w-md h-64 rounded-3xl bg-slate-900 border-3 border-indigo-500 flex items-center justify-around p-6 overflow-hidden">
            {/* 3 Objects (Apple, Pen, Water Droplet) with Dynamic Physics */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={gravityMode === 'earth' ? { y: 70 } : { y: [-15, 15, -15], rotate: [-10, 10, -10] }}
                transition={gravityMode === 'earth' ? { type: 'spring', damping: 10 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="text-4xl"
              >
                🍎
              </motion.div>
              <span className="text-[9px] font-bold text-slate-400 mt-2">Apple</span>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                animate={gravityMode === 'earth' ? { y: 70 } : { y: [15, -15, 15], rotate: [15, -15, 15] }}
                transition={gravityMode === 'earth' ? { type: 'spring', damping: 10 } : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="text-4xl"
              >
                ✏️
              </motion.div>
              <span className="text-[9px] font-bold text-slate-400 mt-2">Pencil</span>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                animate={gravityMode === 'earth' ? { y: 70 } : { y: [-10, 10, -10], scale: [1, 1.1, 1] }}
                transition={gravityMode === 'earth' ? { type: 'spring', damping: 10 } : { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="text-4xl"
              >
                💧
              </motion.div>
              <span className="text-[9px] font-bold text-slate-400 mt-2">Water Drop</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleGravityToggle('earth')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs border-2 cursor-pointer transition-all ${
                gravityMode === 'earth'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              🌍 1. Earth Gravity (1.0g - Downward Drop)
            </button>

            <button
              onClick={() => handleGravityToggle('orbit')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs border-2 cursor-pointer transition-all ${
                gravityMode === 'orbit'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md ring-2 ring-indigo-300 scale-102'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              🚀 2. ISS Orbit Freefall (0.0g - Weightless)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
