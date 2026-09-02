import { ThreeEverestClimbLab } from "@/components/three-lab/ThreeEverestClimbLab";
import { ThreePashminaThermalLab } from "@/components/three-lab/ThreePashminaThermalLab";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Mountain,
  AlertTriangle,
  Compass,
  Thermometer,
  Wind,
  Gauge,
  Rocket,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  Droplets,
  RotateCcw,
  Sun,
  Flame,
  Flag,
} from 'lucide-react';

/* ============================================================================
   1. 3D CHANGTHANG 5,000M PASHMINA THERMAL LAB (Three.js Physics Engine)
   ============================================================================ */
export const ChangthangPashminaSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return <ThreePashminaThermalLab onCompleted={onCompleted} />;
};

/* ============================================================================
   2. 🏔️ 2.5D SEA-TO-SUMMIT EVEREST EXPEDITION & ALTITUDE BAROMETER SIMULATOR
   ============================================================================ */
export const EverestMountaineeringSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [altitude, setAltitude] = useState<number>(5364);

  // Elevation progression (0m to 8848m)
  const ratio = Math.min(1, Math.max(0, altitude / 8848));
  const oxygenPercent = Math.max(33, Math.round(100 - ratio * 67));
  const pressureHpa = Math.max(330, Math.round(1013 - ratio * 683));
  const isDeathZone = altitude >= 7900;
  const isSummit = altitude >= 8800;
  const isBaseCamp = altitude >= 5000 && altitude < 7900;

  // 2.5D Path Coordinates on the Mountain Slope (X: 12% at Sea Level -> 82% at Summit, Y: 82% at Sea Level -> 22% at Summit)
  const climberX = 12 + ratio * 70; // 12% to 82%
  const climberY = 82 - ratio * 60; // 82% to 22%

  const handleAltitudeChange = (val: number) => {
    setAltitude(val);
    if (val >= 8800) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Sagarmatha Everest Summit reached at 8,848 meters! Bachendri Pal hoisted the Indian flag here on May 23, 1984, wearing high-altitude oxygen gear and steel crampons!'
      );
      if (onCompleted) onCompleted();
    } else if (val >= 7900) {
      sounds.tensionSnap();
      voiceAssistant.speak(
        'Entering the Death Zone! At 7,900m altitude, atmospheric pressure is only 380 hPa. Oxygen cylinder is required to survive!'
      );
    } else {
      sounds.pop();
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD with Digital Barometer & Oxygen Meter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🧗 2.5D Sea-to-Summit Himalayan Altitude Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Bachendri Pal 8,848m Everest Expedition
          </h3>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-full text-white text-xs font-black shadow-sm">
            <Gauge className="w-4 h-4 text-sky-400" />
            <span>📍 {pressureHpa} hPa</span>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 ${
              isDeathZone
                ? 'bg-rose-500 text-white animate-bounce ring-2 ring-rose-300'
                : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            {isDeathZone ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DEATH ZONE (O₂: 33%)</span>
              </>
            ) : (
              <>
                <Wind className="w-3.5 h-3.5" />
                <span>O₂ LEVEL: {oxygenPercent}%</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* ── 2.5D PRACTICAL ELEVATION VIEWPORT (Sea Level -> Base Camp -> Death Zone -> Summit) ── */}
      <div
        className={`relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-3 shadow-2xl transition-all duration-700 ${
          isDeathZone
            ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 border-purple-500'
            : isBaseCamp
            ? 'bg-gradient-to-b from-sky-700 via-sky-500 to-emerald-900 border-sky-400'
            : 'bg-gradient-to-b from-sky-400 via-sky-300 to-blue-900 border-blue-400'
        }`}
      >
        {/* Dynamic Sky Atmosphere (Stars visible in thin stratosphere) */}
        {isDeathZone && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute text-white/80 animate-pulse text-[10px]"
                style={{
                  top: `${(i * 17) % 45}%`,
                  left: `${(i * 23) % 95}%`,
                  animationDelay: `${(i % 5) * 0.3}s`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
        )}

        {/* High-Altitude Blizzard Snow Storm in Death Zone */}
        {isDeathZone && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [-80, 500], y: [0, 80] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.15, ease: 'linear' }}
                className="absolute text-white text-xs select-none opacity-80"
                style={{ top: `${(i * 15) % 85}%` }}
              >
                💨 ❄️
              </motion.div>
            ))}
          </div>
        )}

        {/* 2.5D Vector Illustration Stage: Sea -> Foothills -> Khumbu Glacier -> Everest Summit */}
        <svg className="w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="none">
          <defs>
            {/* Sea Water Gradient */}
            <linearGradient id="seaWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>

            {/* Himalayan Mountain Rock Gradient */}
            <linearGradient id="rockSlopeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Glacier Ice & Snow Gradient */}
            <linearGradient id="glacierGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Air Molecule Density Cloud Filter */}
            <pattern id="denseAir" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.2" fill="#ffffff" opacity="0.4" />
            </pattern>
          </defs>

          {/* ── 1. SEA LEVEL OCEAN SECTION (Bottom Left: 0m to 1,500m) ── */}
          <path d="M 0,260 Q 30,250 60,260 T 120,260 L 120,320 L 0,320 Z" fill="url(#seaWaterGrad)" />
          {/* Animated Sea Waves */}
          <path d="M 0,268 Q 25,260 50,268 T 100,268" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.8" />
          <path d="M 10,280 Q 35,275 60,280 T 110,280" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />

          {/* Sea Shore Ship / Boat */}
          <g transform="translate(35, 245) scale(0.7)">
            <polygon points="0,15 40,15 32,25 8,25" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
            <polygon points="12,15 12,2 28,15" fill="#ef4444" />
          </g>

          {/* Green Coastal Vegetation */}
          <ellipse cx="90" cy="265" rx="18" ry="8" fill="#15803d" />
          <polygon points="80,265 90,240 100,265" fill="#16a34a" />

          {/* ── 2. HIMALAYAN MOUNTAIN MASSIF (Ascending Slope from X: 80 to X: 420) ── */}
          {/* Dark Mountain Base Rock */}
          <polygon points="80,320 420,70 480,180 500,320" fill="url(#rockSlopeGrad)" />

          {/* Nuptse / Lhotse Background Peak */}
          <polygon points="260,320 340,110 420,320" fill="#1e293b" opacity="0.85" />
          <polygon points="310,170 340,110 370,170" fill="#94a3b8" />

          {/* Khumbu Blue Glacier Ice Tongue */}
          <polygon points="160,270 280,160 360,110 420,70 390,140 240,240 120,300" fill="url(#glacierGrad)" opacity="0.9" />

          {/* Snow Cornice on Everest Summit */}
          <polygon points="380,110 420,70 450,110 420,100" fill="#ffffff" />

          {/* ── 3. CLIMBING RIDGE DOTTED TRAIL PATH ── */}
          <line x1="60" y1="265" x2="420" y2="70" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />

          {/* ── 4. KEY WAYPOINT LABELS & PROPS ── */}
          {/* 🌊 Station 1: 0m Sea Level */}
          <g transform="translate(60, 275)">
            <circle cx="0" cy="0" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="16" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" className="drop-shadow">
              🌊 0m Sea Level (1013 hPa)
            </text>
          </g>

          {/* ⛺ Station 2: 5,364m Khumbu Base Camp (Yellow Expedition Tents & Prayer Flags) */}
          <g transform="translate(230, 185)">
            {/* Tents */}
            <polygon points="-12,0 0,-14 12,0" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <polygon points="6,0 16,-10 26,0" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
            {/* Prayer flags string */}
            <line x1="-18" y1="-8" x2="30" y2="-8" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" />
            <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="16" fill="#fef08a" fontSize="9" fontWeight="900" textAnchor="middle" className="drop-shadow">
              ⛺ 5,364m Base Camp (500 hPa)
            </text>
          </g>

          {/* ⚠️ Station 3: 7,900m Camp 4 Death Zone (Ice Crevasse & Storm) */}
          <g transform="translate(340, 120)">
            <circle cx="0" cy="0" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="-10" fill="#fca5a5" fontSize="9" fontWeight="900" textAnchor="middle" className="drop-shadow">
              ⚠️ 7,900m Death Zone (380 hPa)
            </text>
          </g>

          {/* 🚩 Station 4: 8,848m Sagarmatha Summit (Indian Flag) */}
          <g transform="translate(420, 70)">
            {/* Flagpole */}
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#ffffff" strokeWidth="2.5" />
            {/* Indian Flag Tricolor */}
            <rect x="0" y="-30" width="22" height="5" fill="#f97316" />
            <rect x="0" y="-25" width="22" height="5" fill="#ffffff" />
            <circle cx="11" cy="-22.5" r="1.8" fill="#1e3a8a" />
            <rect x="0" y="-20" width="22" height="5" fill="#16a34a" />
            <text x="0" y="-35" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" className="drop-shadow">
              🚩 8,848m SUMMIT (330 hPa)
            </text>
          </g>
        </svg>

        {/* ── 5. PROMINENT 2.5D ILLUSTRATED TREKKER AVATAR (Smooth Motion along Slope) ── */}
        <div
          className="absolute z-30 transition-all duration-300 pointer-events-none flex flex-col items-center"
          style={{
            left: `${climberX}%`,
            top: `${climberY}%`,
            transform: 'translate(-50%, -85%)',
          }}
        >
          {/* Trekker Altitude Badge Tooltip */}
          <div className="bg-slate-950/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400 mb-1 shadow-md whitespace-nowrap">
            {isSummit ? '🚩 SUMMIT!' : `${altitude}m`}
          </div>

          {/* 2.5D Illustrated Trekker Character Model */}
          <svg width="60" height="75" viewBox="0 0 60 75" className="drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]">
            {/* Technical Backpack (Navy) */}
            <rect x="6" y="24" width="14" height="26" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

            {/* High-Pressure Yellow Oxygen Cylinders on Backpack (Death Zone) */}
            {isDeathZone && (
              <>
                <rect x="4" y="22" width="6" height="22" rx="3" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
                <rect x="11" y="22" width="6" height="22" rx="3" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
              </>
            )}

            {/* Red Puffy Thermal Down Suit Body */}
            <rect x="18" y="22" width="24" height="28" rx="6" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />

            {/* Climbing Harness (Navy Belt) */}
            <rect x="18" y="38" width="24" height="5" fill="#0f172a" />

            {/* Head with Insulated Down Hood */}
            <circle cx="30" cy="14" r="11" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            <ellipse cx="32" cy="14" rx="7" ry="5" fill="#fed7aa" />

            {/* Snow Goggles or Oxygen Mask */}
            {isDeathZone ? (
              <>
                {/* Turquoise Glacier Goggles */}
                <rect x="27" y="10" width="10" height="4" rx="2" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
                {/* Oxygen Face Mask */}
                <rect x="28" y="15" width="8" height="6" rx="2" fill="#0f172a" />
                <line x1="14" y1="30" x2="28" y2="18" stroke="#ffffff" strokeWidth="1.5" />
                {/* Frost Breath Vapor Puff */}
                <circle cx="40" cy="16" r="2.5" fill="#ffffff" opacity="0.8" />
              </>
            ) : (
              // Normal Snow Goggles
              <rect x="27" y="11" width="10" height="5" rx="2" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
            )}

            {/* 2 Legs */}
            <rect x="20" y="48" width="8" height="16" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="31" y="48" width="8" height="16" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

            {/* Climbing Boots */}
            <rect x="18" y="62" width="11" height="8" rx="2" fill="#1e293b" />
            <rect x="31" y="62" width="11" height="8" rx="2" fill="#1e293b" />

            {/* Steel-Spiked Ice Crampons under Boots */}
            <line x1="17" y1="70" x2="43" y2="70" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="19" y1="70" x2="19" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="26" y1="70" x2="26" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="33" y1="70" x2="33" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="41" y1="70" x2="41" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Ice Axe in Hand */}
            <line x1="40" y1="28" x2="52" y2="55" stroke="#475569" strokeWidth="2" />
            <path d="M 48 26 L 56 30 L 52 32 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom Banner Status */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-xs font-bold text-white shadow-lg text-center z-20">
          {isSummit
            ? '🚩 8,848m SUMMIT REACHED! Bachendri Pal hoisted the Indian flag on May 23, 1984!'
            : isDeathZone
            ? '⚠️ High-altitude hypoxia! Dual oxygen cylinders & mask active to survive 380 hPa thin air!'
            : isBaseCamp
            ? '⛺ 5,364m Khumbu Base Camp! Acclimatizing body before ascending into freezing thin air!'
            : '🌊 Sea level start! Air molecules are packed tightly together (1013 hPa, 100% O₂).'}
        </div>
      </div>

      {/* 4 Interactive Waypoint Station Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full my-3">
        {[
          { label: '1. Sea Level (0m)', alt: 0, o2: '100%', pressure: '1013 hPa', icon: '🌊', bg: 'hover:bg-sky-50' },
          { label: '2. Base Camp (5,364m)', alt: 5364, o2: '50%', pressure: '500 hPa', icon: '⛺', bg: 'hover:bg-amber-50' },
          { label: '3. Camp 4 Death Zone', alt: 7900, o2: '38%', pressure: '380 hPa', icon: '⚠️', bg: 'hover:bg-rose-50' },
          { label: '4. Sagarmatha Summit 🚩', alt: 8848, o2: '33%', pressure: '330 hPa', icon: '🇮🇳', bg: 'hover:bg-amber-50' },
        ].map((station) => (
          <button
            key={station.alt}
            onClick={() => handleAltitudeChange(station.alt)}
            className={`p-3 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 shadow-sm ${
              Math.abs(altitude - station.alt) < 300
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300 font-black'
                : `bg-slate-50 border-slate-200 text-slate-700 ${station.bg}`
            }`}
          >
            <span className="text-base">{station.icon}</span>
            <span className="font-black text-center">{station.label}</span>
            <span className="text-[10px] text-slate-500 font-bold">
              {station.alt}m • {station.pressure}
            </span>
          </button>
        ))}
      </div>

      {/* Altitude Continuous Slider Control */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1.5">
            <Mountain className="w-4 h-4 text-amber-500" />
            <span>Climbing Elevation:</span>
          </span>
          <input
            type="range"
            min="0"
            max="8848"
            step="100"
            value={altitude}
            onChange={(e) => handleAltitudeChange(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-20 text-right bg-white px-2 py-1 rounded-md border border-slate-300">
            {altitude}m
          </span>
        </div>

        {/* 5th Grade Key Scientific Takeaway */}
        <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            💡 <strong>Why Do Mountaineers Need Oxygen Tanks & Steel Crampons?</strong>
            <p className="text-[11px] text-slate-600 mt-0.5">
              At sea level (0m), gravity packs air molecules densely together (<strong>1013 hPa</strong>). As you climb to Mount Everest (<strong>8,848m</strong>), air pressure drops by 3x (<strong>330 hPa</strong>). Climbers must wear <strong>steel crampon spikes</strong> to dig into blue glacier ice and breathe supplemental oxygen from high-pressure tanks to avoid hypoxia!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. 🚀 DYNAMIC ZERO-GRAVITY SPACE STATION SIMULATOR (CHAPTER 3)
   ============================================================================ */
export const ZeroGravitySpaceStationSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [waterDrops, setWaterDrops] = useState<{ id: number; x: number; y: number; r: number }[]>([
    { id: 1, x: 140, y: 100, r: 24 },
  ]);

  const handleAddDrop = () => {
    sounds.sparkle();
    const newDrop = {
      id: Date.now(),
      x: 80 + Math.random() * 120,
      y: 60 + Math.random() * 80,
      r: 16 + Math.random() * 12,
    };
    setWaterDrops((p) => [...p, newDrop]);

    voiceAssistant.speak(
      'Water injected! In zero gravity, surface tension pulls water into floating spheres. In space, water never falls down!'
    );
    if (onCompleted) onCompleted();
  };

  const handleMergeDrops = () => {
    sounds.pop();
    if (waterDrops.length > 1) {
      sounds.success();
      setWaterDrops([{ id: Date.now(), x: 140, y: 100, r: 38 }]);
      voiceAssistant.speak('Floating water droplets merge together into one giant floating liquid sphere!');
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Sunita Williams Zero-G Physics Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Inject water drops and watch surface tension pull them into floating round balls in orbit!
      </p>

      {/* ISS Microgravity Chamber Stage */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden border-3 border-indigo-500 shadow-2xl flex items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
        {/* Cupola Window looking at Earth */}
        <div className="absolute right-6 top-6 w-24 h-24 rounded-full border-4 border-slate-600 overflow-hidden shadow-inner flex items-center justify-center bg-blue-600">
          <div className="w-full h-full bg-[radial-gradient(#16a34a_20%,transparent_60%)] animate-spin" style={{ animationDuration: '40s' }} />
          <span className="absolute bottom-1 text-[8px] font-black text-white bg-slate-900/80 px-1 rounded-md">
            Earth Orbit
          </span>
        </div>

        {/* Sunita Williams Floating with Floating Hair */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="flex flex-col items-center z-10"
        >
          <svg width="90" height="120" viewBox="0 0 90 120">
            {/* Blue NASA Suit */}
            <rect x="25" y="45" width="40" height="50" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="45" cy="30" r="16" fill="#fcd34d" />
            {/* Zero-G Standing Hair */}
            <path d="M 32 18 Q 30 5 45 6 Q 60 5 58 18" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="40" cy="28" r="2" fill="#0f172a" />
            <circle cx="50" cy="28" r="2" fill="#0f172a" />
          </svg>
          <span className="text-[9px] font-black text-indigo-200 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-400">
            Sunita Williams (Zero-G)
          </span>
        </motion.div>

        {/* Floating Spherical Water Blobs (Animated) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {waterDrops.map((d, i) => (
            <motion.div
              key={d.id}
              animate={{
                x: [0, (i % 2 === 0 ? 15 : -15), 0],
                y: [0, (i % 2 === 0 ? -12 : 12), 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, ease: 'easeInOut' }}
              className="absolute rounded-full border-2 border-white/80 shadow-[0_0_25px_#38bdf8] flex items-center justify-center bg-gradient-to-br from-cyan-200 via-sky-400 to-blue-600"
              style={{
                width: d.r * 2,
                height: d.r * 2,
                left: `calc(50% + ${d.x - 140}px)`,
                top: `calc(50% + ${d.y - 100}px)`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white absolute top-2 left-2 opacity-80" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleAddDrop}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <Droplets className="w-4 h-4 text-cyan-300" />
          <span>💧 Inject Floating Water Bubble</span>
        </button>

        {waterDrops.length > 1 && (
          <button
            onClick={handleMergeDrops}
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Merge Into Giant Water Sphere</span>
          </button>
        )}
      </div>

      <div className="w-full bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 text-center text-xs font-bold text-indigo-950 mt-4">
        🌍 <strong>Microgravity Surface Tension Law:</strong> In space freefall, water has no weight to pull it down, so cohesive surface tension pulls liquid into perfect spheres!
      </div>
    </div>
  );
};

/* ============================================================================
   4. 🏰 2.5D GOLCONDA FORT PERSIAN WATER WHEEL & BASTION ARCHITECTURE LAB
   ============================================================================ */
export const GolcondaFortWaterAndDefenseSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [waterLiftedFeet, setWaterLiftedFeet] = useState<number>(25);
  const [isPumping, setIsPumping] = useState<boolean>(false);
  const [showBastionRays, setShowBastionRays] = useState<boolean>(false);

  const isFull = waterLiftedFeet >= 100;

  const handleTurnWheel = () => {
    sounds.pop();
    setIsPumping(true);
    sounds.sparkle();

    const newLift = Math.min(100, waterLiftedFeet + 25);
    setWaterLiftedFeet(newLift);

    if (newLift >= 100) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Water lifted 100 feet to the palace rooftop! The Persian gear wheel (Rahat) combined interlocking wooden gears, bucket chains, and clay pipes to power hilltop fountains 400 years ago!'
      );
      if (onCompleted) onCompleted();
    } else {
      voiceAssistant.speak(`Turned the Persian wheel! Lifted stepwell water to ${newLift} feet!`);
    }

    setTimeout(() => setIsPumping(false), 800);
  };

  const handleReset = () => {
    sounds.pop();
    setWaterLiftedFeet(0);
    setIsPumping(false);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-500 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🏰 2.5D Ancient Hydraulic Engineering Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Golconda Fort Water Lift & 360° Bastion Lab
          </h3>
        </div>

        {/* Live Hydraulic Gauges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-full text-white text-xs font-black shadow-sm">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Water Lifted: {waterLiftedFeet} ft / 100 ft</span>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              setShowBastionRays(!showBastionRays);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black border cursor-pointer transition-all shadow-sm ${
              showBastionRays
                ? 'bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-300 font-black'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            🛡️ {showBastionRays ? '360° Bastion Sight: ON' : '360° Bastion Sight'}
          </button>
        </div>
      </div>

      {/* ── 2.5D ARCHITECTURAL CROSS-SECTION OF GOLCONDA FORT ── */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-3 border-amber-600 shadow-2xl bg-gradient-to-b from-amber-100 via-sky-100 to-amber-50">
        <svg className="w-full h-full" viewBox="0 0 520 320" preserveAspectRatio="none">
          <defs>
            {/* Ancient Stone Wall Gradient */}
            <linearGradient id="fortStoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="40%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Stepwell Underground Water Gradient */}
            <linearGradient id="wellWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Bronze Gear Wheel Gradient */}
            <linearGradient id="bronzeGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Terracotta Clay Pipe Gradient */}
            <linearGradient id="clayPipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* ── 1. BACKGROUND GRANITE FORTRESS HILL & SKY ── */}
          <polygon points="0,320 0,140 180,180 340,110 520,60 520,320" fill="#fed7aa" opacity="0.4" />

          {/* ── 2. PROTRUDING 360° DEFENSIVE BASTION (BURJ) - (LEFT SECTION) ── */}
          <g transform="translate(45, 110)">
            {/* Semicircular Bastion Tower */}
            <path
              d="M -30,170 L -30,20 C -30,-15 30,-15 30,20 L 30,170 Z"
              fill="url(#fortStoneGrad)"
              stroke="#291204"
              strokeWidth="2.5"
            />
            {/* Crenellations (Teeth) on Top */}
            <rect x="-30" y="-12" width="12" height="14" fill="#78350f" stroke="#291204" strokeWidth="1.5" />
            <rect x="-6" y="-12" width="12" height="14" fill="#78350f" stroke="#291204" strokeWidth="1.5" />
            <rect x="18" y="-12" width="12" height="14" fill="#78350f" stroke="#291204" strokeWidth="1.5" />

            {/* Narrow Arrow Slit Windows */}
            <rect x="-5" y="25" width="10" height="26" rx="2" fill="#0c0a09" stroke="#92400e" strokeWidth="1" />
            <rect x="-5" y="75" width="10" height="26" rx="2" fill="#0c0a09" stroke="#92400e" strokeWidth="1" />

            {/* Soldier on Bastion */}
            <circle cx="0" cy="-20" r="6" fill="#fef08a" />
            <rect x="-4" y="-14" width="8" height="10" fill="#dc2626" />

            <text x="0" y="145" fill="#fef3c7" fontSize="8" fontWeight="900" textAnchor="middle">
              360° BASTION
            </text>

            {/* 360° Vision Field Rays (When Toggled) */}
            {showBastionRays && (
              <g opacity="0.6">
                <polygon points="0,25 -80,-50 -60,120" fill="#f59e0b" opacity="0.3" />
                <line x1="0" y1="25" x2="-80" y2="-50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="0" y1="25" x2="-60" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="-45" y="25" fill="#78350f" fontSize="7" fontWeight="900">
                  Full 360° Vision
                </text>
              </g>
            )}
          </g>

          {/* ── 3. DEEP UNDERGROUND BAOLI STEPWELL (BOTTOM LEFT) ── */}
          <g transform="translate(130, 210)">
            {/* Stepwell Granite Walls */}
            <rect x="-35" y="0" width="70" height="105" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
            {/* Steps descending */}
            <polygon points="-35,0 -20,20 -35,20" fill="#78716c" />
            <polygon points="-35,20 -10,40 -35,40" fill="#78716c" />
            <polygon points="35,0 20,20 35,20" fill="#78716c" />
            <polygon points="35,20 10,40 35,40" fill="#78716c" />

            {/* Stepwell Groundwater Pool */}
            <rect x="-30" y="45" width="60" height="55" fill="url(#wellWaterGrad)" />
            <text x="0" y="80" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">
              Deep Baoli Well
            </text>
          </g>

          {/* ── 4. PERSIAN WHEEL (RAHAT) WITH GEARS & BUCKET CHAIN (CENTER) ── */}
          <g transform="translate(260, 180)">
            {/* Wooden Framework */}
            <line x1="-50" y1="80" x2="0" y2="0" stroke="#78350f" strokeWidth="4" />
            <line x1="50" y1="80" x2="0" y2="0" stroke="#78350f" strokeWidth="4" />

            {/* Large Persian Wheel Ring */}
            <circle cx="0" cy="0" r="46" fill="#fef3c7" stroke="url(#bronzeGearGrad)" strokeWidth="6" opacity="0.9" />

            {/* Interlocking Gear Teeth around rim */}
            {Array.from({ length: 16 }).map((_, idx) => {
              const angle = (idx * 360) / 16;
              return (
                <rect
                  key={idx}
                  x="-3"
                  y="-52"
                  width="6"
                  height="8"
                  fill="#b45309"
                  stroke="#78350f"
                  strokeWidth="0.8"
                  transform={`rotate(${angle} 0 0)`}
                />
              );
            })}

            {/* 8 Radial Spokes */}
            {Array.from({ length: 8 }).map((_, idx) => (
              <line
                key={idx}
                x1="0"
                y1="0"
                x2={Math.cos((idx * Math.PI) / 4) * 44}
                y2={Math.sin((idx * Math.PI) / 4) * 44}
                stroke="#78350f"
                strokeWidth="2.5"
              />
            ))}

            {/* Central Axle Gear Hub */}
            <circle cx="0" cy="0" r="14" fill="url(#bronzeGearGrad)" stroke="#451a03" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#0f172a" />

            {/* 4 Clay Water Lifting Buckets Mounted on Rim */}
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 0 0) translate(0, -46)`}>
                <rect x="-7" y="-6" width="14" height="12" rx="2" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#38bdf8" />
              </g>
            ))}

            <text x="0" y="65" fill="#78350f" fontSize="9" fontWeight="900" textAnchor="middle">
              Persian Gear Wheel (Rahat)
            </text>
          </g>

          {/* ── 5. TERRACOTTA CLAY PIPELINE & WATER CONDUIT (From Wheel to Palace) ── */}
          <path
            d="M 260,135 Q 330,110 390,95 T 440,80"
            fill="none"
            stroke="url(#clayPipeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 260,135 Q 330,110 390,95 T 440,80"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="6,4"
            opacity={isPumping || waterLiftedFeet > 0 ? 0.9 : 0.2}
          />

          {/* ── 6. HIGH PALACE ROOFTOP RESERVOIR & FOUNTAIN (RIGHT SECTION) ── */}
          <g transform="translate(440, 90)">
            {/* Palace Stone Tower */}
            <rect x="-35" y="0" width="70" height="190" fill="url(#fortStoneGrad)" stroke="#291204" strokeWidth="2" />

            {/* Palace Arches */}
            <path d="M -20,60 Q 0,40 20,60 L 20,100 L -20,100 Z" fill="#291204" />
            <path d="M -20,130 Q 0,110 20,130 L 20,170 L -20,170 Z" fill="#291204" />

            {/* Rooftop Water Reservoir Tank */}
            <rect x="-28" y="-35" width="56" height="35" rx="4" fill="#f8fafc" stroke="#78350f" strokeWidth="2" />

            {/* Dynamic Rising Water Level inside Tank */}
            <rect
              x="-26"
              y={-33 + (1 - waterLiftedFeet / 100) * 31}
              width="52"
              height={(waterLiftedFeet / 100) * 31}
              rx="2"
              fill="url(#wellWaterGrad)"
            />

            {/* Royal Terrace Fountain on Top */}
            <ellipse cx="0" cy="-42" rx="18" ry="5" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            <rect x="-3" y="-50" width="6" height="8" fill="#d97706" />

            {/* Active Royal Fountain Water Jets when Full (100 ft) */}
            {isFull && (
              <g>
                <path d="M 0,-50 Q -12,-70 -16,-45" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0,-50 Q 0,-74 0,-44" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0,-50 Q 12,-70 16,-45" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <text x="0" y="-76" fill="#0369a1" fontSize="9" fontWeight="900" textAnchor="middle">
                  ⛲ FOUNTAIN ACTIVE!
                </text>
              </g>
            )}

            <text x="0" y="-12" fill="#0f172a" fontSize="8" fontWeight="900" textAnchor="middle">
              {waterLiftedFeet} ft
            </text>
            <text x="0" y="20" fill="#fef3c7" fontSize="8" fontWeight="900" textAnchor="middle">
              Rooftop Palace Tank
            </text>
          </g>
        </svg>

        {/* Live Water Flow Animation Puffs when turning */}
        {isPumping && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-2xl animate-bounce">
            💧 ⚙️ 💧
          </div>
        )}

        {/* Bottom Banner Status */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-600 text-xs font-bold text-white shadow-lg text-center">
          {isFull
            ? '🎉 100 FT REACHED! Stepwell water reached the rooftop tank — Royal palace fountains are flowing!'
            : '💧 Tap "Turn Persian Wheel" to lift water from the deep baoli stepwell to the hilltop palace!'}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <button
          onClick={handleTurnWheel}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Droplets className="w-5 h-5 fill-slate-950" />
          <span>💧 Turn Persian Water Wheel (+25 ft)</span>
        </button>

        {waterLiftedFeet > 0 && (
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Empty Tank</span>
          </button>
        )}
      </div>

      {/* 5th Grade Key Scientific Takeaway */}
      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center sm:text-left text-xs font-bold text-amber-950 mt-3">
        🏰 <strong>Ancient Hydraulic Engineering:</strong> Over 400 years ago at Golconda Fort, engineers connected <strong>interlocking wooden gears to endless clay bucket chains (Rahat)</strong>, lifting water 100+ feet through terracotta gravity pipes to royal hilltop fountains without electricity!
      </div>
    </div>
  );
};

/* ============================================================================
   5. 🛢️ DYNAMIC PETROLEUM FRACTIONAL DISTILLATION (CHAPTER 5)
   ============================================================================ */
export const PetroleumRefineryAndSolarSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [boilerTemp, setBoilerTemp] = useState(270);

  const handleTempChange = (val: number) => {
    setBoilerTemp(val);
    if (val >= 380) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Crude oil fully separated! LPG gas, petrol for cars, kerosene for planes, diesel for buses, and bitumen tar for paving roads!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-700 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Petroleum Fractional Distillation Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Adjust furnace temperature to boil and separate crude petroleum into 5 essential fuels!
      </p>

      {/* Dynamic Fractional Tower Stage */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden border-3 border-slate-700 shadow-2xl flex items-center justify-between p-6 bg-slate-950 text-white">
        {/* Distillation Column with Rising Vapor */}
        <div className="w-28 h-64 bg-slate-800 border-3 border-slate-500 rounded-2xl relative flex flex-col justify-between p-2 shadow-inner">
          {/* Boiling Bubbles at Bottom */}
          <div className="w-full h-14 bg-gradient-to-t from-red-600 to-amber-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
            🔥 {boilerTemp}°C
          </div>

          {/* Animated Rising Vapor Vanes */}
          <div className="flex flex-col gap-3 my-auto">
            {[1, 2, 3].map((v) => (
              <motion.div
                key={v}
                animate={{ y: [0, -15, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2 + v * 0.3 }}
                className="w-full h-1 bg-amber-400/60 rounded-full"
              />
            ))}
          </div>
          <span className="text-[8px] font-black text-center text-slate-400">Fractional Tower</span>
        </div>

        {/* Output Condensed Fractions based on Temp! */}
        <div className="flex-1 flex flex-col gap-2 ml-6">
          {[
            { name: '1. LPG Gas (Cooking)', temp: 20, color: 'bg-rose-500', active: boilerTemp >= 20 },
            { name: '2. Petrol (Car Fuel)', temp: 70, color: 'bg-amber-500', active: boilerTemp >= 70 },
            { name: '3. Kerosene (Jet Fuel)', temp: 170, color: 'bg-sky-500', active: boilerTemp >= 170 },
            { name: '4. Diesel (Bus / Truck)', temp: 270, color: 'bg-emerald-500', active: boilerTemp >= 270 },
            { name: '5. Bitumen (Tar for Roads)', temp: 350, color: 'bg-slate-700', active: boilerTemp >= 350 },
          ].map((f) => (
            <div
              key={f.name}
              className={`p-2 rounded-xl text-xs font-black flex items-center justify-between border transition-all ${
                f.active
                  ? `${f.color} text-white shadow-md scale-102 border-white/50`
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}
            >
              <span>{f.name}</span>
              <span className="text-[10px]">{f.temp}°C {f.active ? '✓ CONDENSING' : '⏳'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Furnace Temperature Slider */}
      <div className="w-full max-w-lg my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Cool (20°C)</span>
          <span className="text-amber-700 font-black text-sm bg-amber-100 px-3 py-1 rounded-full">
            Furnace Heat: {boilerTemp}°C
          </span>
          <span>Boiling Max (400°C)</span>
        </div>
        <input
          type="range"
          min="20"
          max="400"
          step="20"
          value={boilerTemp}
          onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
          className="w-full h-4 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-center text-xs font-bold text-slate-800">
        🛢️ <strong>Fractional Distillation Law:</strong> Different hydrocarbons boil and turn to gas at different temperatures. By heating crude oil, we collect cooking gas at the top and road tar at the bottom!
      </div>
    </div>
  );
};
