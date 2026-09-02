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
  ArrowRight,
} from 'lucide-react';

export const SunitaInSpaceMultiStationLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [currentStation, setCurrentStation] = useState<'cohesion' | 'gravity_toggle'>('cohesion');

  // Station A: Floating Water Spheres
  const [waterBlobs, setWaterBlobs] = useState<{ id: number; size: number; x: number; y: number }[]>([
    { id: 1, size: 36, x: 0, y: 0 },
  ]);

  // Station B: Gravity Mode
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');

  const handleSqueezePouch = () => {
    sounds.sparkle();
    const newBlob = {
      id: Date.now(),
      size: 28 + Math.random() * 16,
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 60,
    };
    setWaterBlobs((prev) => [...prev, newBlob]);

    voiceAssistant.speak(
      'Water squeezed! In zero gravity freefall, cohesive surface tension pulls liquid water into floating spheres!'
    );
    if (onCompleted) onCompleted();
  };

  const handleMergeBlobs = () => {
    sounds.pop();
    if (waterBlobs.length > 1) {
      sounds.success();
      setWaterBlobs([{ id: Date.now(), size: 56, x: 0, y: 0 }]);
      voiceAssistant.speak('Floating water droplets collided and merged into one giant liquid sphere!');
    }
  };

  const handleAbsorbWater = () => {
    sounds.pop();
    if (waterBlobs.length > 0) {
      sounds.bubble();
      setWaterBlobs([]);
      voiceAssistant.speak('Towel captured the floating water droplets! Astronauts use towels to capture floating bubbles in space!');
    }
  };

  const handleGravityToggle = (mode: 'orbit' | 'earth') => {
    sounds.pop();
    setGravityMode(mode);
    if (mode === 'orbit') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Orbital Freefall (0g)! The International Space Station is in continuous freefall around Earth, so water floats as spheres!'
      );
    } else {
      sounds.success();
      voiceAssistant.speak(
        'Earth Gravity (1g)! Earth’s gravity pulls water straight down into the cup.'
      );
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-indigo-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-indigo-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 inline-block mb-1 shadow-xs">
            🚀 2.5D Space Station Microgravity Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Sunita Williams: Why Does Water Float in Space?
          </h3>
        </div>

        {/* 2 Navigation Mode Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.pop();
              setCurrentStation('cohesion');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black border cursor-pointer transition-all shadow-sm ${
              currentStation === 'cohesion'
                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            💧 1. Floating Water Spheres
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setCurrentStation('gravity_toggle');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black border cursor-pointer transition-all shadow-sm ${
              currentStation === 'gravity_toggle'
                ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            🌍 2. 0g Orbit vs 1g Earth
          </button>
        </div>
      </div>

      {/* ── STATION 1: FLOATING SURFACE TENSION WATER SPHERES ── */}
      {currentStation === 'cohesion' && (
        <div className="w-full flex flex-col items-center">
          {/* 2.5D ISS Cupola Viewing Dome Stage */}
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-600 shadow-2xl bg-gradient-to-b from-[#020617] via-[#09142e] to-[#0284c7] flex items-center justify-center relative">
            {/* Earth Horizon Orbit View in Background */}
            <div className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden opacity-60">
              <div className="w-[180%] h-56 bg-gradient-to-t from-sky-400 via-blue-600 to-transparent rounded-[100%] blur-sm" />
            </div>

            {/* ISS Metal Truss Frame & Space Station Interior Details */}
            <div className="absolute inset-0 pointer-events-none border-8 border-slate-800/80 rounded-3xl" />

            {/* Astronaut Sunita Williams Floating in Module (Left) */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute left-6 bottom-8 pointer-events-none flex flex-col items-center z-10"
            >
              <span className="text-4xl">👩‍🚀</span>
              <span className="text-[10px] font-black text-indigo-200 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-indigo-400 mt-1 shadow-md">
                Sunita Williams (ISS)
              </span>
            </motion.div>

            {/* Floating Water Spheres with Cohesive Surface Tension Wobble (Center) */}
            <div className="relative w-64 h-64 flex items-center justify-center z-20">
              {waterBlobs.map((blob) => (
                <motion.div
                  key={blob.id}
                  animate={{
                    x: [blob.x, blob.x + 8, blob.x - 8, blob.x],
                    y: [blob.y, blob.y - 10, blob.y + 6, blob.y],
                    scale: [1, 1.06, 0.96, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 3 + (blob.id % 3) * 0.5, ease: 'easeInOut' }}
                  className="absolute rounded-full shadow-[0_0_20px_#38bdf8] flex items-center justify-center"
                  style={{
                    width: blob.size,
                    height: blob.size,
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #7dd3fc 45%, #0284c7 85%, #0369a1 100%)',
                    border: '2px solid rgba(255,255,255,0.85)',
                  }}
                >
                  <span className="text-[8px] font-black text-white/90 drop-shadow select-none">
                    H₂O
                  </span>
                </motion.div>
              ))}

              {waterBlobs.length === 0 && (
                <div className="text-xs font-black text-indigo-300 bg-slate-900/80 px-4 py-2 rounded-2xl border border-indigo-500">
                  💧 Squeeze the Drink Pouch below to create floating water spheres!
                </div>
              )}
            </div>

            {/* Bottom Status Banner */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-400 text-xs font-bold text-white shadow-lg text-center z-20">
              {waterBlobs.length > 1
                ? `💧 ${waterBlobs.length} water spheres floating! Tap "Merge Water Spheres" to combine them!`
                : waterBlobs.length === 1
                ? '💧 Zero-G Physics: Surface tension pulls water molecules inward into a perfect round bubble!'
                : 'Towel dried the water! Squeeze the drink pouch to inject new water!'}
            </div>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
            <button
              onClick={handleSqueezePouch}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Droplets className="w-5 h-5 text-sky-100" />
              <span>🧃 Squeeze Straw Drink Pouch (+Water)</span>
            </button>

            {waterBlobs.length > 1 && (
              <button
                onClick={handleMergeBlobs}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>✨ Merge Into Giant Water Sphere</span>
              </button>
            )}

            {waterBlobs.length > 0 && (
              <button
                onClick={handleAbsorbWater}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Catch with Microfiber Towel</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STATION 2: 1G EARTH VS 0G ORBIT COMPARISON ── */}
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

              {/* Visual Cup on Table with Liquid Poured Down */}
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

              {/* Visual Floating Water Sphere & Astronaut */}
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
