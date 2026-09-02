import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Droplets,
  Sparkles,
  RotateCcw,
  Globe,
  Utensils,
  Moon,
  Scissors,
  CheckCircle2,
  Hand,
} from 'lucide-react';

interface WaterBlob {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const SunitaInSpaceMultiStationLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [currentStation, setCurrentStation] = useState<'cohesion' | 'daily_life' | 'gravity_toggle'>('cohesion');

  // ── Station 1: Draggable Bottle & Towel States ──
  const [waterBlobs, setWaterBlobs] = useState<WaterBlob[]>([
    { id: 1, x: 0, y: -10, size: 48 },
  ]);
  const [isBottleNearCenter, setIsBottleNearCenter] = useState(false);
  const [isTowelWiping, setIsTowelWiping] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // ── Station 2: Daily Life Topic ──
  const [activeLifeTab, setActiveLifeTab] = useState<'eating' | 'sleeping' | 'hair'>('eating');

  // ── Station 3: Gravity Mode ──
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');

  // Dispense water when bottle is dragged/released in center
  const handleBottleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 30) {
      sounds.sparkle();
      const newBlob: WaterBlob = {
        id: Date.now(),
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 60,
        size: 34 + Math.random() * 18,
      };
      setWaterBlobs((prev) => [...prev, newBlob]);
      voiceAssistant.speak(
        'Water squeezed into orbit! Watch cohesive surface tension pull liquid molecules into a floating round sphere!'
      );
      if (onCompleted) onCompleted();
    }
  };

  // Absorb water when towel is dragged over center
  const handleTowelDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 30 || Math.abs(info.offset.y) > 20) {
      if (waterBlobs.length > 0) {
        sounds.pop();
        sounds.success();
        setIsTowelWiping(true);
        setWaterBlobs([]);
        voiceAssistant.speak(
          'Microfiber towel wiped and absorbed the floating water droplet! In space, astronauts always use absorbent towels to catch stray water!'
        );
        setTimeout(() => setIsTowelWiping(false), 800);
      }
    }
  };

  const handleManualAddWater = () => {
    sounds.sparkle();
    const newBlob: WaterBlob = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 60,
      size: 34 + Math.random() * 18,
    };
    setWaterBlobs((prev) => [...prev, newBlob]);
    voiceAssistant.speak('Added floating water droplet in zero-g!');
  };

  const handleManualAbsorb = () => {
    if (waterBlobs.length > 0) {
      sounds.pop();
      sounds.success();
      setIsTowelWiping(true);
      setWaterBlobs([]);
      voiceAssistant.speak('Towel cleaned up the floating water sphere!');
      setTimeout(() => setIsTowelWiping(false), 800);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#fffdfa] p-5 sm:p-7 rounded-[36px] border-4 border-indigo-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
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
          STATION 1: DRAG WATER BOTTLE & DRAG TOWEL CLEANUP
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'cohesion' && (
        <div className="w-full flex flex-col items-center">
          {/* Instructions Banner */}
          <div className="flex items-center gap-2 text-xs font-black text-indigo-900 mb-2.5 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200">
            <Hand className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span>
              <strong>Touch & Drag:</strong> Drag the <strong>Drink Bottle</strong> to the center to squirt water. Drag the <strong>Microfiber Towel</strong> over the water to clean it up!
            </span>
          </div>

          {/* Interactive 2.5D Space Stage */}
          <div
            ref={stageRef}
            className="relative w-full h-88 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-600 shadow-2xl bg-gradient-to-b from-[#020617] via-[#0b1329] to-[#0284c7] flex items-center justify-between p-6 select-none"
          >
            {/* Background Twinkling Stars */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-white/70 animate-pulse text-[10px]"
                  style={{
                    top: `${(i * 17) % 85}%`,
                    left: `${(i * 23) % 95}%`,
                    animationDelay: `${(i % 5) * 0.3}s`,
                  }}
                >
                  ✨
                </span>
              ))}
            </div>

            {/* Earth Orbital Cupola View in Background */}
            <div className="absolute right-8 top-6 pointer-events-none opacity-80 filter drop-shadow-[0_0_20px_#38bdf8]">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                <path d="M 20 40 Q 35 25 60 30 Q 80 40 70 65 Q 50 80 30 70 Z" fill="#16a34a" />
                <path d="M 60 60 Q 75 55 85 70 Q 80 85 65 80 Z" fill="#15803d" />
                <path d="M 15 45 Q 45 55 85 35" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Astronaut Sunita Williams Avatar */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute top-4 left-6 pointer-events-none flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-indigo-400 shadow-md z-10"
            >
              <span className="text-xl">👩‍🚀</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-200">Sunita Williams</span>
                <span className="text-[8px] font-bold text-sky-400">Zero-G Orbit Freefall</span>
              </div>
            </motion.div>

            {/* ── DRAGGABLE NASA DRINK BOTTLE (LEFT) ── */}
            <motion.div
              drag
              dragConstraints={stageRef}
              dragElastic={0.2}
              dragSnapToOrigin={true}
              onDragEnd={handleBottleDragEnd}
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.15, rotate: -15, zIndex: 50 }}
              className="cursor-grab active:cursor-grabbing z-30 flex flex-col items-center"
            >
              {/* Illustrated NASA Drink Bottle Shape */}
              <div className="w-24 sm:w-28 h-40 sm:h-44 bg-gradient-to-b from-sky-300 via-blue-500 to-blue-700 rounded-3xl border-4 border-white shadow-[0_8px_25px_rgba(56,189,248,0.6)] flex flex-col items-center justify-between p-3 relative">
                {/* Drinking Straw with valve */}
                <div className="w-3 h-8 bg-amber-300 border-2 border-slate-900 rounded-t-md absolute -top-7 right-6 shadow-md" />
                <div className="w-5 h-2 bg-red-500 rounded-full absolute -top-2 right-5" />

                <span className="text-[9px] font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-sky-300">
                  DRAG ME ➔
                </span>

                <span className="text-4xl my-auto">🧃</span>

                <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2.5 py-1 rounded-xl shadow-md border-2 border-amber-600">
                  💧 Squirt Water
                </span>
              </div>
              <span className="text-[10px] font-black text-sky-200 mt-2 bg-slate-950/80 px-2 py-0.5 rounded-md">
                Drink Pouch
              </span>
            </motion.div>

            {/* ── CENTER AREA: FLOATING LIQUID WATER SPHERES ── */}
            <div className="flex-1 h-full flex flex-col items-center justify-center relative z-20 mx-2">
              {/* Drop Target Zone Guide */}
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center relative pointer-events-none">
                {waterBlobs.length === 0 && (
                  <div className="text-center p-3">
                    <span className="text-2xl block mb-1">💧</span>
                    <span className="text-[11px] font-black text-sky-200 bg-slate-950/80 px-3 py-1 rounded-xl border border-sky-400 block">
                      Drag Bottle here to squirt water!
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Optical Liquid Water Spheres */}
              {waterBlobs.map((blob) => (
                <motion.div
                  key={blob.id}
                  animate={{
                    x: [blob.x, blob.x + 8, blob.x - 8, blob.x],
                    y: [blob.y, blob.y - 10, blob.y + 6, blob.y],
                    scale: [1, 1.08, 0.94, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2.8 + (blob.id % 3) * 0.4, ease: 'easeInOut' }}
                  className="absolute rounded-full shadow-[0_0_30px_#38bdf8] flex items-center justify-center pointer-events-none"
                  style={{
                    width: blob.size,
                    height: blob.size,
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 45%, #0284c7 85%, #0369a1 100%)',
                    border: '3px solid rgba(255,255,255,0.95)',
                  }}
                >
                  <span className="text-[8px] font-black text-white/90 drop-shadow select-none">
                    H₂O
                  </span>
                </motion.div>
              ))}

              {/* Surface Tension HUD Badge */}
              {waterBlobs.length > 0 && (
                <div className="absolute bottom-6 bg-slate-950/90 text-sky-300 text-[10px] font-black px-3 py-1 rounded-full border border-sky-400 shadow-lg pointer-events-none">
                  ✨ Cohesion: {waterBlobs.length} {waterBlobs.length === 1 ? 'Sphere' : 'Spheres'} Floating
                </div>
              )}
            </div>

            {/* ── DRAGGABLE MICROFIBER TOWEL (RIGHT) ── */}
            <motion.div
              drag
              dragConstraints={stageRef}
              dragElastic={0.2}
              dragSnapToOrigin={true}
              onDragEnd={handleTowelDragEnd}
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.15, rotate: 15, zIndex: 50 }}
              className="cursor-grab active:cursor-grabbing z-30 flex flex-col items-center"
            >
              {/* Illustrated Folded Microfiber Towel Shape */}
              <div className="w-24 sm:w-28 h-40 sm:h-44 bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-700 rounded-3xl border-4 border-white shadow-[0_8px_25px_rgba(52,211,153,0.6)] flex flex-col items-center justify-between p-3 relative">
                <span className="text-[9px] font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  ⮘ DRAG ME
                </span>

                <span className="text-4xl my-auto">🧻</span>

                <span className="text-[10px] font-black text-slate-950 bg-emerald-300 px-2.5 py-1 rounded-xl shadow-md border-2 border-emerald-600 font-black">
                  ✨ Absorb Water
                </span>
              </div>
              <span className="text-[10px] font-black text-emerald-200 mt-2 bg-slate-950/80 px-2 py-0.5 rounded-md">
                Microfiber Towel
              </span>
            </motion.div>

            {/* Wipe Animation Flash */}
            {isTowelWiping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-teal-500/20 pointer-events-none flex items-center justify-center z-40"
              >
                <div className="bg-slate-950/90 text-emerald-300 text-xs font-black px-4 py-2 rounded-2xl border-2 border-emerald-400 shadow-2xl">
                  ✨ Water Droplets Absorbed by Microfiber Towel!
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Tap Buttons (Fallback for Mobile/Click) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
            <button
              onClick={handleManualAddWater}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Droplets className="w-5 h-5 text-sky-100" />
              <span>🧃 Squirt Water Sphere (+1)</span>
            </button>

            {waterBlobs.length > 0 && (
              <button
                onClick={handleManualAbsorb}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-emerald-100" />
                <span>🧻 Clean with Towel</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: DAILY LIFE IN ORBIT (ANIMATED FLYING FOOD & SLEEP)
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'daily_life' && (
        <div className="w-full flex flex-col items-center">
          {/* Subtabs: Eating, Sleeping, Hair */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'eating', label: '🥪 1. Floating Food & Velcro Tray', icon: Utensils },
              { id: 'sleeping', label: '🛌 2. Tied Sleeping Bag', icon: Moon },
              { id: 'hair', label: '💇‍♀️ 3. Zero-G Floating Hair', icon: Scissors },
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

          {/* 2.5D Animated Storybook Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-88 sm:h-96">
            {/* Left Card: 🌍 On Earth (1g Gravity) */}
            <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-6 flex flex-col items-center justify-between shadow-md">
              <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                🌍 On Earth (1g Gravity)
              </span>

              <div className="text-center my-auto">
                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white border-3 border-sky-200 shadow-inner flex items-center justify-center text-5xl mb-3">
                      🍽️🥪
                    </div>
                    <h4 className="font-black text-base text-slate-900">Food Stays on the Plate</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs font-bold">
                      Earth’s gravity pulls your sandwich down onto the plate and keeps water resting in your cup.
                    </p>
                  </div>
                )}
                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white border-3 border-sky-200 shadow-inner flex items-center justify-center text-5xl mb-3">
                      🛏️😴
                    </div>
                    <h4 className="font-black text-base text-slate-900">Sleep Flat on Beds</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs font-bold">
                      Your body rests naturally on a soft mattress with pillows holding your head down.
                    </p>
                  </div>
                )}
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white border-3 border-sky-200 shadow-inner flex items-center justify-center text-5xl mb-3">
                      👩‍🦰
                    </div>
                    <h4 className="font-black text-base text-slate-900">Hair Falls Down</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs font-bold">
                      Gravity pulls strands of hair downwards onto your neck and shoulders.
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[11px] font-black text-sky-700 bg-white px-3 py-1 rounded-full border border-sky-200">
                Earth Gravity pulls downward (9.8 m/s²)
              </span>
            </div>

            {/* Right Card: 🚀 In Orbit ISS (0g Freefall) with Animated Physics */}
            <div className="bg-indigo-950 text-white border-3 border-indigo-500 rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
              <span className="text-xs font-black uppercase text-indigo-300 bg-indigo-900 px-3 py-1 rounded-full border border-indigo-400 z-10">
                🚀 In Orbit ISS (0g Freefall)
              </span>

              <div className="text-center my-auto z-10">
                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    {/* Animated Floating Sandwich Slices drifting in Zero-G */}
                    <div className="relative w-36 h-28 flex items-center justify-center mb-2">
                      <motion.span
                        animate={{ y: [-15, 15, -15], rotate: [-12, 12, -12] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="text-4xl absolute left-2 top-0"
                      >
                        🥪
                      </motion.span>
                      <motion.span
                        animate={{ y: [12, -12, 12], rotate: [10, -10, 10] }}
                        transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                        className="text-3xl absolute right-2 bottom-1"
                      >
                        🧃
                      </motion.span>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                        className="text-2xl absolute top-3 right-5 text-amber-300"
                      >
                        ✨
                      </motion.span>
                    </div>

                    <h4 className="font-black text-base text-amber-300">Food Floats in the Air!</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs font-bold">
                      Astronauts use velcro trays and squeeze pouches to catch floating food with their mouths!
                    </p>
                  </div>
                )}
                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                      className="text-6xl mb-3"
                    >
                      ⛺😴🔒
                    </motion.div>
                    <h4 className="font-black text-base text-amber-300">Tied Inside Sleeping Bags</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs font-bold">
                      Astronauts zip into sleeping bags strapped securely to the wall so they don't drift into fans while sleeping!
                    </p>
                  </div>
                )}
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], y: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                      className="text-6xl mb-3"
                    >
                      👩‍🚀✨
                    </motion.div>
                    <h4 className="font-black text-base text-amber-300">Hair Stands Straight Up!</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs font-bold">
                      Without downward gravity, Sunita Williams' hair floats straight up in all directions like a dandelion!
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[11px] font-black text-amber-300 bg-slate-900 px-3 py-1 rounded-full border border-indigo-400 z-10">
                Zero Gravity Freefall in Orbit (0g)
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
          <div className="relative w-full h-88 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-600 shadow-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col sm:flex-row items-center justify-around p-6 text-white">
            {/* Left Mode: 🌍 1G Earth Gravity */}
            <div
              onClick={() => {
                sounds.pop();
                setGravityMode('earth');
              }}
              className={`flex-1 w-full sm:w-auto h-full p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col items-center justify-between ${
                gravityMode === 'earth'
                  ? 'bg-blue-900/60 border-sky-400 ring-2 ring-sky-300 shadow-xl scale-102'
                  : 'bg-slate-900/50 border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="text-center">
                <span className="text-xs font-black uppercase text-sky-400">1. On Earth (1g Gravity)</span>
                <p className="text-[11px] text-slate-300 mt-1 font-bold">Gravity pulls water down into cups</p>
              </div>

              {/* Visual Drinking Glass with Poured Water */}
              <div className="flex flex-col items-center my-auto">
                <div className="w-20 h-28 border-4 border-sky-300 rounded-b-2xl bg-slate-800 relative overflow-hidden flex flex-col justify-end p-1 shadow-lg">
                  <motion.div
                    animate={{ height: ['40%', '75%', '70%'] }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-blue-600 to-sky-400 rounded-b-xl shadow-inner"
                  />
                </div>
                <div className="w-32 h-3 bg-amber-800 rounded-full mt-2" />
                <span className="text-[10px] font-black text-amber-300 mt-1">Water stays inside cup</span>
              </div>

              <span className="text-xs font-black text-sky-300 bg-slate-950 px-3.5 py-1 rounded-full border border-sky-500">
                Earth Gravity Active
              </span>
            </div>

            {/* Right Mode: 🚀 0G Orbital Freefall */}
            <div
              onClick={() => {
                sounds.pop();
                setGravityMode('orbit');
              }}
              className={`flex-1 w-full sm:w-auto h-full p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col items-center justify-between mt-3 sm:mt-0 ${
                gravityMode === 'orbit'
                  ? 'bg-purple-900/60 border-purple-400 ring-2 ring-purple-300 shadow-xl scale-102'
                  : 'bg-slate-900/50 border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="text-center">
                <span className="text-xs font-black uppercase text-purple-300">2. In Orbit ISS (0g Freefall)</span>
                <p className="text-[11px] text-slate-300 mt-1 font-bold">No downward weight — Water hovers!</p>
              </div>

              {/* Floating Optical Liquid Sphere */}
              <div className="flex flex-col items-center my-auto">
                <motion.div
                  animate={{ y: [-8, 8, -8], scale: [1, 1.08, 0.94, 1] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                  className="w-22 h-22 rounded-full shadow-[0_0_30px_#38bdf8] flex items-center justify-center border-3 border-white"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 45%, #0284c7 85%, #0369a1 100%)',
                  }}
                >
                  <span className="text-sm font-black text-white drop-shadow">H₂O</span>
                </motion.div>
                <span className="text-[10px] font-black text-purple-200 mt-3">Floating liquid sphere</span>
              </div>

              <span className="text-xs font-black text-purple-300 bg-slate-950 px-3.5 py-1 rounded-full border border-purple-500">
                0g Microgravity Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5th Grade Key Teaching Secret */}
      <div className="w-full bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 text-center sm:text-left text-xs font-bold text-indigo-950 mt-4">
        🌍 <strong>5th Grade Science Secret (Microgravity & Surface Tension):</strong> Because the International Space Station orbits Earth in constant freefall, gravity cannot pull water down into cups. Water molecules stick tightly to each other (<strong>cohesion</strong>), creating <strong>floating round liquid spheres</strong>!
      </div>
    </div>
  );
};
