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
  const [currentStation, setCurrentStation] = useState<'cohesion' | 'daily_life' | 'gravity_toggle'>('daily_life');

  // ── Station 1: Draggable Bottle & Towel States ──
  const [waterBlobs, setWaterBlobs] = useState<WaterBlob[]>([
    { id: 1, x: 0, y: -10, size: 48 },
  ]);
  const [isBottleNearCenter, setIsBottleNearCenter] = useState(false);
  const [isTowelWiping, setIsTowelWiping] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // ── Station 2: Daily Life Topic ──
  const [activeLifeTab, setActiveLifeTab] = useState<'eating' | 'sleeping' | 'hair'>('hair');

  // ── Station 3: Gravity Mode ──
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');

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
          STATION 2: DAILY LIFE IN ORBIT (DETAILED REFERENCE VISUALS)
      ════════════════════════════════════════════════════════════════ */}
      {currentStation === 'daily_life' && (
        <div className="w-full flex flex-col items-center">
          {/* Subtabs: Eating, Sleeping, Hair */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'hair', label: '💇‍♀️ 1. Floating Hair in Orbit', icon: Scissors },
              { id: 'eating', label: '🥪 2. Eating & Velcro Trays', icon: Utensils },
              { id: 'sleeping', label: '🛌 3. Tied Sleeping Bag', icon: Moon },
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

          {/* 2.5D Detailed Reference Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-88 sm:h-96">
            {/* ── LEFT CARD: 🌍 ON EARTH (1G GRAVITY) ── */}
            <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-5 flex flex-col items-center justify-between shadow-md">
              <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                🌍 On Earth (1g Gravity)
              </span>

              <div className="text-center my-auto flex flex-col items-center">
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    {/* Rich Detailed Earth Hair Illustration */}
                    <div className="w-32 h-36 relative mb-2 flex items-center justify-center">
                      <svg width="120" height="130" viewBox="0 0 120 130">
                        {/* Shoulders */}
                        <path d="M 20 125 Q 60 105 100 125 L 100 130 L 20 130 Z" fill="#0284c7" />
                        {/* Neck */}
                        <rect x="52" y="85" width="16" height="25" fill="#fcd34d" />
                        {/* Face */}
                        <circle cx="60" cy="65" r="24" fill="#fcd34d" />
                        <circle cx="52" cy="65" r="2.5" fill="#0f172a" />
                        <circle cx="68" cy="65" r="2.5" fill="#0f172a" />
                        <path d="M 54 75 Q 60 80 66 75" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                        {/* Hair resting down under gravity */}
                        <path d="M 36 60 Q 34 85 32 115 Q 36 120 44 115 Q 42 85 40 60 Z" fill="#78350f" />
                        <path d="M 84 60 Q 86 85 88 115 Q 84 120 76 115 Q 78 85 80 60 Z" fill="#78350f" />
                        <path d="M 36 60 Q 60 30 84 60 Q 60 42 36 60 Z" fill="#78350f" />
                        {/* Gravity Arrow */}
                        <line x1="105" y1="45" x2="105" y2="85" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                        <polygon points="100,80 105,92 110,80" fill="#0284c7" />
                        <text x="105" y="105" fill="#0284c7" fontSize="8" fontWeight="900" textAnchor="middle">1g Down</text>
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">Hair Pulled Down by Gravity</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-xs font-bold">
                      Earth’s 1g gravitational pull (9.8 m/s²) pulls hair strands downward naturally onto your shoulders.
                    </p>
                  </div>
                )}

                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    {/* Rich Detailed Earth Dining Table */}
                    <div className="w-36 h-32 relative mb-2 flex items-center justify-center">
                      <svg width="140" height="120" viewBox="0 0 140 120">
                        {/* Table surface */}
                        <rect x="10" y="80" width="120" height="14" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
                        <rect x="25" y="94" width="10" height="26" fill="#78350f" />
                        <rect x="105" y="94" width="10" height="26" fill="#78350f" />
                        {/* Porcelain plate */}
                        <ellipse cx="70" cy="74" rx="42" ry="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                        {/* Sandwich sitting flat */}
                        <rect x="48" y="55" width="44" height="8" rx="2" fill="#d97706" />
                        <rect x="46" y="50" width="48" height="5" rx="1" fill="#22c55e" />
                        <circle cx="62" cy="48" r="7" fill="#ef4444" />
                        <circle cx="78" cy="48" r="7" fill="#ef4444" />
                        <rect x="48" y="42" width="44" height="8" rx="2" fill="#d97706" />
                        {/* Water glass sitting on table */}
                        <rect x="102" y="44" width="16" height="30" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                        <rect x="104" y="54" width="12" height="18" rx="2" fill="#0284c7" />
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">Food Stays Flat on Plate</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-xs font-bold">
                      Gravity firmly anchors solid food to plates and liquid inside open drinking cups.
                    </p>
                  </div>
                )}

                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    {/* Rich Detailed Earth Bed */}
                    <div className="w-36 h-32 relative mb-2 flex items-center justify-center">
                      <svg width="140" height="120" viewBox="0 0 140 120">
                        {/* Wooden bed frame */}
                        <rect x="15" y="70" width="110" height="20" rx="4" fill="#78350f" />
                        <rect x="15" y="40" width="12" height="50" rx="2" fill="#451a03" />
                        <rect x="113" y="55" width="12" height="35" rx="2" fill="#451a03" />
                        {/* Mattress & Pillows */}
                        <rect x="27" y="62" width="86" height="12" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                        <ellipse cx="40" cy="58" rx="10" ry="6" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
                        {/* Person sleeping under blanket */}
                        <rect x="45" y="58" width="68" height="16" rx="4" fill="#38bdf8" />
                        <circle cx="40" cy="54" r="6" fill="#fcd34d" />
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">Sleep Flat on Mattresses</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 max-w-xs font-bold">
                      Your body weight presses down into a mattress with pillows supporting your head.
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-black text-sky-700 bg-white px-3 py-1 rounded-full border border-sky-200">
                Earth Gravity pulls downward (9.8 m/s²)
              </span>
            </div>

            {/* ── RIGHT CARD: 🚀 IN ORBIT ISS (0G FREEFALL) ── */}
            <div className="bg-indigo-950 text-white border-3 border-indigo-500 rounded-3xl p-5 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
              <span className="text-xs font-black uppercase text-indigo-300 bg-indigo-900 px-3 py-1 rounded-full border border-indigo-400 z-10">
                🚀 In Orbit ISS (0g Freefall)
              </span>

              <div className="text-center my-auto z-10 flex flex-col items-center">
                {activeLifeTab === 'hair' && (
                  <div className="flex flex-col items-center">
                    {/* Authentic Sunita Williams Zero-G Hair Illustration */}
                    <div className="w-36 h-36 relative mb-2 flex items-center justify-center">
                      <svg width="140" height="130" viewBox="0 0 140 130">
                        {/* ISS Module Background Grid */}
                        <rect x="10" y="10" width="120" height="110" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                        {/* Blue NASA Suit */}
                        <path d="M 40 115 Q 70 95 100 115 L 100 120 L 40 120 Z" fill="#1d4ed8" stroke="#38bdf8" strokeWidth="1.5" />
                        {/* NASA Badge */}
                        <rect x="74" y="105" width="12" height="6" fill="#f97316" rx="1" />
                        {/* Neck & Face */}
                        <rect x="64" y="80" width="12" height="18" fill="#fcd34d" />
                        <circle cx="70" cy="65" r="22" fill="#fcd34d" />
                        <circle cx="63" cy="65" r="2.5" fill="#0f172a" />
                        <circle cx="77" cy="65" r="2.5" fill="#0f172a" />
                        <path d="M 64 74 Q 70 79 76 74" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* SUNITA'S FLOATING HAIR STANDING STRAIGHT UP IN ZERO-G */}
                        <g>
                          <path d="M 50 50 Q 30 25 35 15 Q 45 25 54 46" fill="#78350f" />
                          <path d="M 56 46 Q 45 15 52 10 Q 60 20 62 44" fill="#78350f" />
                          <path d="M 66 44 Q 70 10 74 10 Q 78 20 74 44" fill="#78350f" />
                          <path d="M 76 45 Q 85 15 90 12 Q 92 25 82 48" fill="#78350f" />
                          <path d="M 82 48 Q 105 25 108 18 Q 102 35 88 54" fill="#78350f" />
                          <path d="M 50 54 Q 25 40 20 35 Q 32 50 50 58" fill="#78350f" />
                          <path d="M 90 58 Q 112 50 118 45 Q 108 60 90 64" fill="#78350f" />
                        </g>

                        {/* Floating Zero-G Sparkles */}
                        <text x="25" y="70" fill="#fde047" fontSize="14" className="animate-ping">✨</text>
                        <text x="110" y="70" fill="#fde047" fontSize="14" className="animate-ping">✨</text>
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-amber-300">Hair Stands Straight Up!</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 max-w-xs font-bold">
                      Without downward gravity, Sunita Williams' hair floats upward in all directions like a dandelion in freefall!
                    </p>
                  </div>
                )}

                {activeLifeTab === 'eating' && (
                  <div className="flex flex-col items-center">
                    {/* Authentic Floating Food & Velcro Tray */}
                    <div className="w-36 h-32 relative mb-2 flex items-center justify-center">
                      <svg width="140" height="120" viewBox="0 0 140 120">
                        {/* ISS Metal Bulkhead */}
                        <rect x="10" y="10" width="120" height="100" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                        {/* Velcro Food Tray anchored with strap */}
                        <rect x="25" y="75" width="90" height="24" rx="4" fill="#334155" stroke="#facc15" strokeWidth="1.5" />
                        <text x="70" y="90" fill="#facc15" fontSize="8" fontWeight="900" textAnchor="middle">VELCRO FOOD TRAY</text>
                        {/* Floating Slices drifting in air */}
                        <g>
                          <rect x="30" y="25" width="28" height="6" rx="2" fill="#d97706" transform="rotate(-15 30 25)" />
                          <circle cx="85" cy="30" r="7" fill="#ef4444" />
                          <rect x="95" y="45" width="26" height="5" rx="1" fill="#22c55e" transform="rotate(20 95 45)" />
                          <rect x="50" y="45" width="28" height="6" rx="2" fill="#d97706" transform="rotate(10 50 45)" />
                          {/* Floating Water Bubble */}
                          <circle cx="65" cy="22" r="6" fill="#38bdf8" opacity="0.85" />
                        </g>
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-amber-300">Food Floats in the Air!</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 max-w-xs font-bold">
                      Astronauts use velcro straps to anchor food trays and catch floating juice with straw pouches!
                    </p>
                  </div>
                )}

                {activeLifeTab === 'sleeping' && (
                  <div className="flex flex-col items-center">
                    {/* Authentic Wall-Tied Sleeping Bag in ISS */}
                    <div className="w-36 h-32 relative mb-2 flex items-center justify-center">
                      <svg width="140" height="120" viewBox="0 0 140 120">
                        {/* ISS Module Wall & Vent */}
                        <rect x="10" y="10" width="120" height="100" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                        {/* Ventilation Fan */}
                        <circle cx="110" cy="30" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                        <line x1="102" y1="30" x2="118" y2="30" stroke="#94a3b8" />
                        <line x1="110" y1="22" x2="110" y2="38" stroke="#94a3b8" />
                        {/* Vertical Sleeping Bag */}
                        <rect x="45" y="25" width="45" height="75" rx="12" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" />
                        {/* Astronaut Face inside hood */}
                        <circle cx="67" cy="40" r="10" fill="#fcd34d" />
                        <path d="M 63 42 Q 67 44 71 42" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                        {/* Wall Anchor Tension Straps */}
                        <line x1="20" y1="45" x2="45" y2="45" stroke="#f59e0b" strokeWidth="3" />
                        <line x1="20" y1="75" x2="45" y2="75" stroke="#f59e0b" strokeWidth="3" />
                        <circle cx="20" cy="45" r="3" fill="#ea580c" />
                        <circle cx="20" cy="75" r="3" fill="#ea580c" />
                        <text x="67" y="85" fill="#fef08a" fontSize="7" fontWeight="900" textAnchor="middle">STRAPPED TO WALL</text>
                      </svg>
                    </div>
                    <h4 className="font-black text-sm text-amber-300">Tied Inside Sleeping Bags</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 max-w-xs font-bold">
                      Astronauts zip into sleeping bags strapped securely to the wall so they don't drift into fans while sleeping!
                    </p>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-black text-amber-300 bg-slate-900 px-3 py-1 rounded-full border border-indigo-400 z-10">
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
