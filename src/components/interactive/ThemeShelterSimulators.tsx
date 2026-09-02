import { ThreeEverestClimbLab } from "@/components/three-lab/ThreeEverestClimbLab";
import { ThreePashminaThermalLab } from "@/components/three-lab/ThreePashminaThermalLab";
import React, { useState } from 'react';
import golcondaWheelImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';
import golcondaBastionImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import golcondaDarwazaImg from '@/assets/images/theme-shelter/golconda_fateh_darwaza.jpg';
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
   4. 🏰 GOLCONDA FORT WATER WHEEL & DEFENSE LAB (AUTHENTIC IMAGES & HUD)
   ============================================================================ */
export const GolcondaFortWaterAndDefenseSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'bastion' | 'acoustic'>('wheel');
  const [waterLiftedFeet, setWaterLiftedFeet] = useState<number>(25);
  const [isPumping, setIsPumping] = useState<boolean>(false);
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [isClapping, setIsClapping] = useState<boolean>(false);

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

    setTimeout(() => setIsPumping(false), 600);
  };

  const handleClap = () => {
    sounds.pop();
    setIsClapping(true);
    sounds.sparkle();
    voiceAssistant.speak(
      'Clapped at Fateh Darwaza! The acoustic dome concentrates sound waves, carrying the warning echo 1 kilometer up to the king’s palace at Bala Hissar!'
    );
    setTimeout(() => setIsClapping(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-500 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1 shadow-xs">
            🏰 Ancient Hydraulic & Defensive Engineering
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Golconda Fort: Persian Water Lift & Bastion Architecture
          </h3>
        </div>

        {/* 3 Nav Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'wheel', label: '💧 1. Persian Water Wheel (Rahat)' },
            { id: 'bastion', label: '🛡️ 2. 360° Bastion Wall Defense' },
            { id: 'acoustic', label: '👏 3. 1km Acoustic Echo Dome' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STATION 1: PERSIAN WATER WHEEL (RAHAT) & 100FT PALACE RESERVOIR
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'wheel' && (
        <div className="w-full flex flex-col items-center">
          {/* Main Visual Stage with Authentic Historic Photo + Mechanical Overlay */}
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-950 flex flex-col sm:flex-row items-center justify-between p-6">
            {/* Authentic Background Photo with Blur & Dimmer */}
            <img
              src={golcondaWheelImg}
              alt="Golconda Fort Persian Wheel"
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

            {/* Left: Deep Stepwell & Rotating Persian Gear Wheel */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-black text-amber-300 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400 mb-2 shadow-md">
                Subterranean Stepwell (Baoli)
              </span>

              {/* Animated Rotating Persian Wheel */}
              <motion.div
                animate={isPumping ? { rotate: 360 } : {}}
                transition={{ duration: 0.6, ease: 'linear' }}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-6 border-amber-600 bg-amber-950/70 relative flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                {/* Gear Spokes */}
                <div className="w-full h-1.5 bg-amber-500 absolute" />
                <div className="h-full w-1.5 bg-amber-500 absolute" />
                <div className="w-full h-1.5 bg-amber-500 absolute rotate-45" />
                <div className="w-full h-1.5 bg-amber-500 absolute -rotate-45" />

                {/* Central Axle */}
                <div className="w-8 h-8 rounded-full bg-amber-400 border-3 border-amber-900 shadow-md flex items-center justify-center z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                </div>

                {/* 4 Clay Water Buckets Mounted on Rim */}
                {[0, 90, 180, 270].map((deg) => (
                  <div
                    key={deg}
                    className="w-6 h-7 bg-orange-600 border-2 border-amber-300 rounded-b-md absolute flex items-center justify-center shadow-md"
                    style={{
                      transform: `rotate(${deg}deg) translate(0, -68px)`,
                    }}
                  >
                    <span className="text-[8px]">💧</span>
                  </div>
                ))}
              </motion.div>

              <span className="text-xs font-black text-amber-200 mt-2">
                Persian Gear Wheel (Rahat)
              </span>
            </div>

            {/* Middle: Terracotta Gravity Pipe Conduit */}
            <div className="relative z-10 flex flex-col items-center my-4 sm:my-0">
              <div className="flex items-center gap-1 bg-slate-900/90 px-3 py-1 rounded-full border border-sky-400 text-[10px] font-black text-sky-200 shadow-md mb-2">
                <span>Terracotta Gravity Siphon</span>
              </div>
              <div className="w-32 sm:w-44 h-3 bg-gradient-to-r from-orange-600 via-amber-500 to-sky-400 rounded-full shadow-inner relative overflow-hidden">
                {isPumping && (
                  <motion.div
                    animate={{ x: [-50, 150] }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                    className="w-12 h-full bg-white opacity-80"
                  />
                )}
              </div>
            </div>

            {/* Right: 100-Foot Hilltop Palace Rooftop Reservoir & Fountain */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-black text-amber-300 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400 mb-2 shadow-md">
                Hilltop Palace (Bala Hissar)
              </span>

              {/* Water Tank */}
              <div className="w-28 sm:w-32 h-44 sm:h-48 bg-slate-900/90 border-4 border-amber-400 rounded-3xl p-2.5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                {/* Royal Terrace Fountain on Top */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🏛️</span>
                  {isFull && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], y: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-xs font-black text-sky-300 bg-blue-950 px-2 py-0.5 rounded-full border border-sky-400 mt-1"
                    >
                      ⛲ FOUNTAIN FLOWING!
                    </motion.div>
                  )}
                </div>

                {/* Rising Water Level */}
                <div className="w-full h-24 bg-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-end p-1">
                  <motion.div
                    animate={{ height: `${waterLiftedFeet}%` }}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-gradient-to-t from-blue-600 via-sky-400 to-cyan-200 rounded-b-xl shadow-lg"
                  />
                  <span className="absolute top-1 left-0 right-0 text-center text-[10px] font-black text-white drop-shadow">
                    {waterLiftedFeet} ft / 100 ft
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="absolute bottom-2 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-400 text-xs font-bold text-white shadow-lg text-center z-20">
              {isFull
                ? '🎉 100 FT REACHED! Water reached the hilltop palace rooftop — Royal fountains are flowing!'
                : '💧 Tap "Turn Persian Water Wheel" to lift water from the deep stepwell up 100 feet to the palace!'}
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full mt-4">
            <button
              onClick={handleTurnWheel}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Droplets className="w-5 h-5 fill-slate-950" />
              <span>💧 Turn Persian Water Wheel (+25 ft)</span>
            </button>

            {waterLiftedFeet > 0 && (
              <button
                onClick={() => {
                  sounds.pop();
                  setWaterLiftedFeet(0);
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Empty Reservoir</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: 360° BASTIONS (BURJ) & DEFENSIVE ARCHITECTURE
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'bastion' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-950 flex flex-col sm:flex-row items-center justify-between p-6">
            {/* Authentic Background Photo of Bastions */}
            <img
              src={golcondaBastionImg}
              alt="Golconda Fort Bastions"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Interactive 360° Radar Overlay */}
            <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-around gap-4 text-white">
              {/* Bastion Info Card */}
              <div className="bg-slate-950/90 backdrop-blur-md p-5 rounded-3xl border-2 border-amber-400 max-w-sm shadow-xl">
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500">
                  87 Semicircular Bastions (Burj)
                </span>
                <h4 className="text-lg font-black text-white mt-2">Why are Fort Bastions Round?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-bold">
                  Unlike flat walls with blind spots, semicircular round bastions provide <strong>360-degree surveillance</strong> and narrow arrow slits to spot and repel enemy cannons from all directions!
                </p>
              </div>

              {/* 360° Radar Scanner */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-400 bg-slate-950/80 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center overflow-hidden">
                {/* Radar Grid Lines */}
                <div className="w-full h-0.5 bg-amber-500/40 absolute" />
                <div className="h-full w-0.5 bg-amber-500/40 absolute" />
                <div className="w-32 h-32 rounded-full border border-amber-400/40 absolute" />
                <div className="w-16 h-16 rounded-full border border-amber-400/40 absolute" />

                {/* Sweeping Radar Beam */}
                {showRadar && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="w-full h-full absolute origin-center bg-gradient-to-tr from-transparent via-amber-400/30 to-transparent"
                  />
                )}

                <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 z-10 shadow-md" />
                <span className="absolute bottom-2 text-[9px] font-black text-amber-200">360° Radar Field</span>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="absolute bottom-2 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-400 text-xs font-bold text-white shadow-lg text-center z-20">
              🛡️ 87 Bastions guarded Golconda Fort — thick granite walls withstand heavy siege artillery!
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 3: 1KM ACOUSTIC ECHO DOME (FATEH DARWAZA)
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'acoustic' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-950 flex flex-col items-center justify-between p-6">
            {/* Authentic Background Photo of Fateh Darwaza */}
            <img
              src={golcondaDarwazaImg}
              alt="Golconda Fort Fateh Darwaza"
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

            {/* Acoustic Clap Interactive Area */}
            <div className="relative z-10 w-full flex flex-col items-center text-center my-auto text-white">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-500 mb-2">
                Fateh Darwaza (Victory Gate) Acoustic Science
              </span>
              <h4 className="text-xl font-black text-white">Acoustic Sound Channeling</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md font-bold">
                A single hand-clap under the entry dome creates sound waves that travel <strong>1,000 meters</strong> all the way up to the hilltop royal palace at Bala Hissar!
              </p>

              {/* Clap Action Button */}
              <button
                onClick={handleClap}
                className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="text-xl">👏</span>
                <span>Clap at Fateh Darwaza Entrance!</span>
              </button>

              {/* Animated Sound Wave Rings when Clapped */}
              {isClapping && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.5, delay: ring * 0.3, ease: 'easeOut' }}
                      className="w-48 h-48 rounded-full border-3 border-amber-400 absolute"
                    />
                  ))}
                  <div className="bg-slate-950/90 text-amber-300 text-xs font-black px-4 py-2 rounded-2xl border border-amber-400 shadow-2xl z-20">
                    🔊 Sound Echo Traveling 1,000m to King’s Hilltop Palace!
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Banner */}
            <div className="absolute bottom-2 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-400 text-xs font-bold text-white shadow-lg text-center z-20">
              👏 Ancient Security: Guards clapped at the gate to signal alarms instantly without messengers!
            </div>
          </div>
        </div>
      )}

      {/* 5th Grade Key Engineering Takeaway */}
      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center sm:text-left text-xs font-bold text-amber-950 mt-4">
        🏰 <strong>Ancient Engineering Genius:</strong> Over 400 years ago at Golconda Fort, architects combined <strong>interlocking wooden gears & clay bucket chains (Rahat)</strong> to lift water 100+ feet, built <strong>round 360° bastions</strong> with zero blind spots, and engineered <strong>1km acoustic domes</strong> to signal alarms!
      </div>
    </div>
  );
};

/* ============================================================================
   5. 🛢️ 2.5D PETROLEUM FRACTIONAL DISTILLATION & EVERYDAY FUELS LAB
   ============================================================================ */
export const PetroleumRefineryAndSolarSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [boilerTemp, setBoilerTemp] = useState<number>(270);
  const [activeFuelId, setActiveFuelId] = useState<string | null>(null);

  const fuels = [
    {
      id: 'lpg',
      name: '1. LPG Cooking Gas',
      temp: 20,
      icon: '🍳',
      vehicle: 'Kitchen Stove',
      vehicleEmoji: '🔥🍳',
      color: 'bg-rose-500',
      activeColor: 'border-rose-400 bg-rose-50 text-rose-950',
      tag: 'Boils at 20°C (Top / Coolest)',
      desc: 'Liquid Petroleum Gas powers home kitchen cooking stoves and heaters!',
    },
    {
      id: 'petrol',
      name: '2. Petrol (Gasoline)',
      temp: 70,
      icon: '🚗',
      vehicle: 'Family Car',
      vehicleEmoji: '🚗💨',
      color: 'bg-amber-500',
      activeColor: 'border-amber-400 bg-amber-50 text-amber-950',
      tag: 'Boils at 70°C',
      desc: 'Clean, light fuel that powers lightweight cars, motorcycles, and scooters!',
    },
    {
      id: 'kerosene',
      name: '3. Aviation Kerosene',
      temp: 170,
      icon: '✈️',
      vehicle: 'Jet Airplane',
      vehicleEmoji: '✈️☁️',
      color: 'bg-sky-500',
      activeColor: 'border-sky-400 bg-sky-50 text-sky-950',
      tag: 'Boils at 170°C',
      desc: 'High-energy jet fuel that doesn\'t freeze even in -50°C high-altitude clouds!',
    },
    {
      id: 'diesel',
      name: '4. Heavy Diesel',
      temp: 270,
      icon: '🚌',
      vehicle: 'City Bus & Truck',
      vehicleEmoji: '🚌📦',
      color: 'bg-emerald-500',
      activeColor: 'border-emerald-400 bg-emerald-50 text-emerald-950',
      tag: 'Boils at 270°C',
      desc: 'Powerful high-torque fuel for heavy school buses, freight trucks, and trains!',
    },
    {
      id: 'bitumen',
      name: '5. Bitumen (Tar)',
      temp: 350,
      icon: '🛣️',
      vehicle: 'Road Roller',
      vehicleEmoji: '🛣️🚜',
      color: 'bg-slate-700',
      activeColor: 'border-slate-400 bg-slate-100 text-slate-950',
      tag: 'Boils at 350°C (Bottom / Hottest)',
      desc: 'Thick, sticky black residue used to pave smooth, waterproof highway roads!',
    },
  ];

  const handleTempChange = (val: number) => {
    setBoilerTemp(val);
    if (val >= 350) {
      sounds.fanfare();
      voiceAssistant.speak(
        'All 5 fuels separated! Thick crude oil is now powering stoves, cars, jet planes, city buses, and highway paving!'
      );
      if (onCompleted) onCompleted();
    } else {
      sounds.pop();
    }
  };

  const handleSelectFuel = (fuel: typeof fuels[0]) => {
    sounds.pop();
    setActiveFuelId(fuel.id);
    setBoilerTemp(fuel.temp);
    voiceAssistant.speak(`${fuel.name}. ${fuel.desc}`);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-500 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🛢️ 2.5D Petroleum Refinery Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            How Does Black Crude Oil Power Everyday Life?
          </h3>
        </div>

        {/* Live Furnace Heat Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-full text-white text-xs font-black shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Refinery Furnace: {boilerTemp}°C</span>
          </div>
          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            {fuels.filter((f) => boilerTemp >= f.temp).length} of 5 Fuels Flowing!
          </span>
        </div>
      </div>

      {/* ── 2.5D REFINERY TOWER & EVERYDAY VEHICLES VISUAL STAGE ── */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-3 border-slate-700 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 text-white gap-4">
        {/* Left: Crude Oil Boiler Furnace */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-24 h-20 bg-gradient-to-b from-slate-800 to-slate-950 border-3 border-amber-500/80 rounded-2xl flex flex-col items-center justify-center p-2 shadow-xl relative">
            <span className="text-2xl">🛢️</span>
            <span className="text-[10px] font-black text-amber-400">Crude Oil</span>
            <div className="absolute -bottom-3 bg-red-600 px-2 py-0.5 rounded-full text-[9px] font-black border border-amber-300">
              🔥 {boilerTemp}°C
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 mt-4">Furnace Chamber</span>
        </div>

        {/* Middle: Clear Distillation Fraction Column with Bubbles */}
        <div className="w-28 sm:w-32 h-64 sm:h-72 bg-slate-900/90 border-3 border-slate-600 rounded-3xl relative flex flex-col justify-between p-2 shadow-inner overflow-hidden shrink-0">
          {/* Internal Tower Trays & Rising Vapor Stream */}
          <div className="absolute inset-0 flex flex-col justify-around py-4 pointer-events-none opacity-40">
            {[1, 2, 3, 4, 5].map((t) => (
              <div key={t} className="w-full h-1 bg-amber-400 border-b border-white/40" />
            ))}
          </div>

          {/* Animated Vapor Bubbles */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-around py-2">
            {[1, 2, 3, 4].map((b) => (
              <motion.div
                key={b}
                animate={{ y: [15, -15], opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.4 + b * 0.3, ease: 'easeInOut' }}
                className="w-3 h-3 rounded-full bg-amber-300/60 shadow-[0_0_8px_#fde047]"
              />
            ))}
          </div>

          <div className="text-[9px] font-black text-center text-sky-300 z-10">
            ❄️ 20°C (Cool Top)
          </div>
          <div className="text-[9px] font-black text-center text-slate-300 z-10">
            ⚗️ Vapor Column
          </div>
          <div className="text-[9px] font-black text-center text-rose-400 z-10">
            🔥 350°C (Hot Base)
          </div>
        </div>

        {/* Right: 5 Visual Everyday Fuel Output Stations (Connected Pipes) */}
        <div className="flex-1 w-full flex flex-col justify-between gap-1.5 z-10">
          {fuels.map((fuel) => {
            const isCondensed = boilerTemp >= fuel.temp;
            return (
              <div
                key={fuel.id}
                onClick={() => handleSelectFuel(fuel)}
                className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isCondensed
                    ? `${fuel.color} text-white shadow-lg scale-101 border-white/60`
                    : 'bg-slate-900/80 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{fuel.icon}</span>
                  <div>
                    <span className="font-black text-xs block">{fuel.name}</span>
                    <span className="text-[10px] opacity-90 font-bold">
                      {fuel.vehicleEmoji} {fuel.vehicle}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-black block">
                    {fuel.temp}°C
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    isCondensed ? 'bg-white/30 text-white' : 'bg-slate-800 text-slate-600'
                  }`}>
                    {isCondensed ? '✓ FLOWING' : '⏳ NEEDS HEAT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Furnace Temperature Slider & Quick Fuel Preset Buttons */}
      <div className="w-full flex flex-col gap-3 mt-4">
        {/* Quick Fuel Select Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
          {fuels.map((fuel) => (
            <button
              key={fuel.id}
              onClick={() => handleSelectFuel(fuel)}
              className={`p-2.5 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 shadow-xs ${
                boilerTemp >= fuel.temp
                  ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md scale-102 font-black ring-2 ring-amber-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
              }`}
            >
              <span className="text-lg">{fuel.icon}</span>
              <span className="font-black text-[11px]">{fuel.vehicle}</span>
              <span className="text-[9px] text-slate-500 font-bold">{fuel.temp}°C</span>
            </button>
          ))}
        </div>

        {/* Temperature Slider */}
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Furnace Temperature:</span>
          </span>
          <input
            type="range"
            min="20"
            max="380"
            step="10"
            value={boilerTemp}
            onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-20 text-right bg-white px-2 py-1 rounded-md border border-slate-300">
            {boilerTemp}°C
          </span>
        </div>

        {/* 5th Grade Key Teaching Secret */}
        <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            💡 <strong>5th Grade Science Secret (Fractional Distillation):</strong>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Crude petroleum is a natural recipe of many hydrocarbons mixed together. Because <strong>lighter fuels boil at lower temperatures</strong>, heating crude oil separates it into cooking gas (20°C), car petrol (70°C), jet fuel (170°C), bus diesel (270°C), and road tar (350°C)!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};