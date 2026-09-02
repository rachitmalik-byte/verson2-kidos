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
  Zap,
  Flame,
  Utensils,
  Moon,
  Scissors,
} from 'lucide-react';

export const SunitaInSpaceMultiStationLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [currentStation, setCurrentStation] = useState<'cohesion' | 'daily_life' | 'gravity_toggle'>('cohesion');

  // Station 1: Water Drops
  const [waterBlobs, setWaterBlobs] = useState<{ id: number; size: number; x: number; y: number }[]>([
    { id: 1, size: 36, x: 0, y: 0 },
  ]);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [isAbsorbing, setIsAbsorbing] = useState(false);

  // Station 2: Daily Life Orbit Activity
  const [activeLifeTab, setActiveLifeTab] = useState<'eating' | 'sleeping' | 'hair'>('eating');

  // Station 3: Gravity Mode
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');

  const handleSqueezePouch = () => {
    sounds.sparkle();
    setIsSqueezing(true);
    const newBlob = {
      id: Date.now(),
      size: 26 + Math.random() * 14,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
    };
    setWaterBlobs((prev) => [...prev, newBlob]);

    voiceAssistant.speak(
      'Water squeezed from drink pouch! In orbital zero gravity, cohesive surface tension pulls liquid into floating spheres!'
    );
    setTimeout(() => setIsSqueezing(false), 500);
    if (onCompleted) onCompleted();
  };

  const handleAbsorbWater = () => {
    if (waterBlobs.length > 0) {
      sounds.pop();
      setIsAbsorbing(true);
      sounds.success();
      setWaterBlobs([]);
      voiceAssistant.speak(
        'Microfiber towel captured the floating water! In space, astronauts use absorbent towels so water does not float into equipment!'
      );
      setTimeout(() => setIsAbsorbing(false), 500);
    }
  };

  const handleGravityToggle = (mode: 'orbit' | 'earth') => {
    sounds.pop();
    setGravityMode(mode);
    if (mode === 'orbit') {
      sounds.sparkle();
      voiceAssistant.speak(
        '0g Orbital Freefall! The space station is falling continuously around Earth, so water floats as a ball!'
      );
    } else {
      sounds.success();
      voiceAssistant.speak(
        '1g Earth Gravity! Earth’s gravity pulls water straight down into the cup.'
      );
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-indigo-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header with 3 Station Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-indigo-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 inline-block mb-1 shadow-xs">
            🚀 2.5D Space Station Microgravity Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Sunita Williams: Life in Orbit & Water Physics
          </h3>
        </div>

        {/* 3 Nav Station Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'cohesion', label: '1. Drink Pouch & Towel 💧' },
            { id: 'daily_life', label: '2. Daily Life in Orbit 👩‍🚀' },
            { id: 'gravity_toggle', label: '3. 1g Earth vs 0g Orbit 🌍' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => {
                sounds.pop();
                setCurrentStation(s.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                currentStation === s.id
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STATION 1: DRINK POUCH, FLOATING WATER BUBBLE & TOWEL
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'cohesion' && (
        <div className="w-full flex flex-col items-center">
          <div className="text-xs font-black text-indigo-900 mb-2 text-center">
            💧 Squeeze the <strong>Drink Pouch</strong> to dispense floating water spheres, then tap the <strong>Microfiber Towel</strong> to catch them!
          </div>

          {/* 2.5D Space Station Module Stage with In-Stage Pouch & Towel */}
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-600 shadow-2xl bg-gradient-to-b from-[#020617] via-[#09142e] to-[#0369a1] flex items-center justify-between p-4 sm:p-8 relative">
            {/* Background Earth Horizon in Window */}
            <div className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden opacity-50">
              <div className="w-[160%] h-44 bg-gradient-to-t from-sky-400 via-blue-600 to-transparent rounded-[100%] blur-xs" />
            </div>

            {/* ── LEFT PROP: ILLUSTRATED NASA DRINK POUCH ── */}
            <motion.div
              animate={isSqueezing ? { scale: [1, 0.88, 1.05, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="z-20 flex flex-col items-center"
            >
              <button
                onClick={handleSqueezePouch}
                className="w-24 sm:w-28 h-40 sm:h-44 bg-gradient-to-b from-sky-300 via-blue-500 to-blue-700 rounded-2xl border-4 border-white shadow-[0_0_20px_rgba(56,189,248,0.5)] flex flex-col items-center justify-between p-2.5 cursor-pointer active:scale-95 transition-all hover:brightness-110 relative"
              >
                {/* Drinking Straw with Squeeze Valve */}
                <div className="w-3 h-8 bg-amber-300 border-2 border-slate-900 rounded-t-md absolute -top-7 right-6 shadow-md" />
                <div className="w-5 h-2 bg-red-500 rounded-full absolute -top-2 right-5" />

                <span className="text-[10px] font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-sky-300">
                  DRINK POUCH
                </span>

                <span className="text-3xl my-auto">🧃</span>

                <span className="text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shadow-md border-2 border-amber-600 animate-pulse">
                  💧 Squeeze!
                </span>
              </button>
              <span className="text-[10px] font-black text-sky-200 mt-2">NASA Drink Foil</span>
            </motion.div>

            {/* ── CENTER: WEIGHTLESS CABIN WITH FLOATING WATER SPHERES ── */}
            <div className="flex-1 h-full flex flex-col items-center justify-center relative z-20 mx-2">
              {/* Floating Astronaut Avatar */}
              <motion.div
                animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute top-2 left-2 pointer-events-none flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-indigo-400"
              >
                <span className="text-base">👩‍🚀</span>
                <span className="text-[9px] font-black text-indigo-200">Sunita Williams</span>
              </motion.div>

              {/* Water Blobs */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {waterBlobs.map((blob) => (
                  <motion.div
                    key={blob.id}
                    animate={{
                      x: [blob.x, blob.x + 6, blob.x - 6, blob.x],
                      y: [blob.y, blob.y - 8, blob.y + 4, blob.y],
                      scale: [1, 1.08, 0.94, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 2.8 + (blob.id % 3) * 0.4, ease: 'easeInOut' }}
                    className="absolute rounded-full shadow-[0_0_25px_#38bdf8] flex items-center justify-center"
                    style={{
                      width: blob.size,
                      height: blob.size,
                      background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 45%, #0284c7 85%, #0369a1 100%)',
                      border: '2px solid rgba(255,255,255,0.9)',
                    }}
                  >
                    <span className="text-[7px] font-black text-white/90 drop-shadow select-none">
                      H₂O
                    </span>
                  </motion.div>
                ))}

                {waterBlobs.length === 0 && (
                  <div className="text-[11px] font-black text-indigo-300 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-indigo-500 text-center">
                    All water absorbed! Squeeze pouch on left to squirt water!
                  </div>
                )}
              </div>

              {/* Surface Tension Tag */}
              {waterBlobs.length > 0 && (
                <div className="bg-slate-950/90 text-sky-300 text-[10px] font-black px-3 py-1 rounded-full border border-sky-400 shadow-md">
                  ✨ Cohesive Surface Tension Sphere ({waterBlobs.length} {waterBlobs.length === 1 ? 'ball' : 'balls'})
                </div>
              )}
            </div>

            {/* ── RIGHT PROP: ILLUSTRATED MICROFIBER ABSORBENT TOWEL ── */}
            <motion.div
              animate={isAbsorbing ? { scale: [1, 1.15, 0.9, 1], x: [-10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="z-20 flex flex-col items-center"
            >
              <button
                onClick={handleAbsorbWater}
                className="w-24 sm:w-28 h-40 sm:h-44 bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 rounded-2xl border-4 border-white shadow-[0_0_20px_rgba(52,211,153,0.5)] flex flex-col items-center justify-between p-2.5 cursor-pointer active:scale-95 transition-all hover:brightness-110"
              >
                <span className="text-[10px] font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  TOWEL
                </span>

                <span className="text-3xl my-auto">🧻</span>

                <span className="text-xs font-black text-slate-950 bg-emerald-300 hover:bg-emerald-200 px-3 py-1.5 rounded-xl shadow-md border-2 border-emerald-600 font-black">
                  ✨ Absorb!
                </span>
              </button>
              <span className="text-[10px] font-black text-emerald-200 mt-2">Microfiber Catch</span>
            </motion.div>

            {/* Bottom Banner Status */}
            <div className="absolute bottom-2 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-indigo-400 text-xs font-bold text-white shadow-lg text-center z-30">
              {waterBlobs.length > 0
                ? '💧 Zero-G Physics: Surface tension pulls water molecules inward into a floating round ball!'
                : '✨ Towel captured the water! Squeeze the drink pouch on the left to inject new droplets!'}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: DAILY LIFE IN ORBIT VS EARTH (EATING, SLEEPING, HAIR)
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'daily_life' && (
        <div className="w-full flex flex-col items-center">
          {/* Subtabs: Eating, Sleeping, Hair */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'eating', label: '🥪 1. Eating & Drinking', icon: Utensils },
              { id: 'sleeping', label: '🛌 2. Sleeping in Orbit', icon: Moon },
              { id: 'hair', label: '💇‍♀️ 3. Floating Hair', icon: Scissors },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.pop();
                  setActiveLifeTab(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition-all ${
                  activeLifeTab === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Comparison Cards Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-80">
            {/* Left Card: 🌍 On Earth */}
            <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-5 flex flex-col items-center justify-between shadow-md">
              <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                🌍 On Earth (1g Gravity)
              </span>

              <div className="text-center my-auto">
                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">🍽️🥪</span>
                    <h4 className="font-black text-sm text-slate-900">Food Stays on Plates</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Gravity holds food down on plates and water in glasses without flying away!
                    </p>
                  </div>
                )}
                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">🛏️😴</span>
                    <h4 className="font-black text-sm text-slate-900">Sleep on Flat Beds</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Your body rests on a mattress with pillows holding your head down.
                    </p>
                  </div>
                )}
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">👩‍🦰</span>
                    <h4 className="font-black text-sm text-slate-900">Hair Falls Down</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Gravity pulls strands of hair downwards onto your shoulders.
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[11px] font-black text-sky-700 bg-white px-3 py-1 rounded-full border border-sky-200">
                Earth Gravity pulls everything down
              </span>
            </div>

            {/* Right Card: 🚀 In Orbit (ISS) */}
            <div className="bg-indigo-950 text-white border-3 border-indigo-500 rounded-3xl p-5 flex flex-col items-center justify-between shadow-xl">
              <span className="text-xs font-black uppercase text-indigo-300 bg-indigo-900 px-3 py-1 rounded-full border border-indigo-400">
                🚀 In Orbit ISS (0g Freefall)
              </span>

              <div className="text-center my-auto">
                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    <motion.span
                      animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="text-5xl mb-2 block"
                    >
                      🧃🥪✨
                    </motion.span>
                    <h4 className="font-black text-sm text-amber-300">Food Floats in the Air!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Astronauts use velcro trays and straw pouches to catch floating food with their mouths!
                    </p>
                  </div>
                )}
                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    <motion.span
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="text-5xl mb-2 block"
                    >
                      ⛺😴🔒
                    </motion.span>
                    <h4 className="font-black text-sm text-amber-300">Tied Inside Sleeping Bags</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Astronauts zip into sleeping bags strapped to the wall so they don't float into fans while asleep!
                    </p>
                  </div>
                )}
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-5xl mb-2 block"
                    >
                      👩‍🚀✨
                    </motion.span>
                    <h4 className="font-black text-sm text-amber-300">Hair Stands Straight Up!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Without gravity pulling hair down, Sunita Williams' hair floats straight up in all directions!
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[11px] font-black text-amber-300 bg-slate-900 px-3 py-1 rounded-full border border-indigo-400">
                Zero Gravity Freefall in Orbit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 3: 1G EARTH VS 0G ORBIT DIRECT GRAVITY SWITCH
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'gravity_toggle' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-600 shadow-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col sm:flex-row items-center justify-around p-6 text-white">
            {/* Left Mode: 🌍 1G Earth Gravity */}
            <div
              onClick={() => handleGravityToggle('earth')}
              className={`flex-1 w-full sm:w-auto h-full p-4 rounded-3xl border-3 cursor-pointer transition-all flex flex-col items-center justify-between ${
                gravityMode === 'earth'
                  ? 'bg-blue-900/50 border-sky-400 ring-2 ring-sky-300 shadow-xl scale-102'
                  : 'bg-slate-900/50 border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="text-center">
                <span className="text-xs font-black uppercase text-sky-400">1. On Earth (1g Gravity)</span>
                <p className="text-[11px] text-slate-300 mt-1 font-bold">Gravity pulls water down into cups</p>
              </div>

              <div className="flex flex-col items-center my-auto">
                <div className="w-16 h-22 border-3 border-sky-300 rounded-b-2xl bg-slate-800 relative overflow-hidden flex flex-col justify-end p-1">
                  <div className="w-full h-14 bg-gradient-to-t from-blue-600 to-sky-400 rounded-b-xl" />
                </div>
                <div className="w-24 h-2 bg-amber-800 rounded-full mt-2" />
                <span className="text-[10px] font-black text-amber-300 mt-1">Water stays in cup</span>
              </div>

              <span className="text-xs font-black text-sky-300 bg-slate-950 px-3 py-1 rounded-full border border-sky-500">
                Earth Gravity Active
              </span>
            </div>

            {/* Right Mode: 🚀 0G Orbital Freefall */}
            <div
              onClick={() => handleGravityToggle('orbit')}
              className={`flex-1 w-full sm:w-auto h-full p-4 rounded-3xl border-3 cursor-pointer transition-all flex flex-col items-center justify-between mt-3 sm:mt-0 ${
                gravityMode === 'orbit'
                  ? 'bg-purple-900/50 border-purple-400 ring-2 ring-purple-300 shadow-xl scale-102'
                  : 'bg-slate-900/50 border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="text-center">
                <span className="text-xs font-black uppercase text-purple-300">2. In Orbit ISS (0g Freefall)</span>
                <p className="text-[11px] text-slate-300 mt-1 font-bold">No downward weight — Water hovers!</p>
              </div>

              <div className="flex flex-col items-center my-auto">
                <motion.div
                  animate={{ y: [-6, 6, -6], scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full shadow-[0_0_20px_#38bdf8] flex items-center justify-center border-2 border-white"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 45%, #0284c7 85%, #0369a1 100%)',
                  }}
                >
                  <span className="text-xs font-black text-white">H₂O</span>
                </motion.div>
                <span className="text-[10px] font-black text-purple-200 mt-3">Floating liquid ball</span>
              </div>

              <span className="text-xs font-black text-purple-300 bg-slate-950 px-3 py-1 rounded-full border border-purple-500">
                0g Microgravity Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5th Grade Key Teaching Secret */}
      <div className="w-full bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 text-center sm:text-left text-xs font-bold text-indigo-950 mt-4">
        🌍 <strong>5th Grade Science Secret (Microgravity Surface Tension):</strong> In space, the Space Station is falling continuously around Earth in zero-g freefall. Without downward weight, water molecules stick tightly to each other (<strong>cohesion</strong>) and pull the water into <strong>floating round liquid balls</strong>!
      </div>
    </div>
  );
};
