import { ThreeEverestClimbLab } from "@/components/three-lab/ThreeEverestClimbLab";
import { ThreePashminaThermalLab } from "@/components/three-lab/ThreePashminaThermalLab";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
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
   2. 🧗 FULLY DYNAMIC EVEREST MOUNTAINEERING SIMULATOR (CHAPTER 2)
   ============================================================================ */
export const EverestMountaineeringSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [altitude, setAltitude] = useState(5364);

  // Elevation progression (0m to 8848m)
  const progressRatio = altitude / 8848;
  const oxygenPercent = Math.max(33, Math.round(100 - progressRatio * 67));
  const pressureHpa = Math.max(330, Math.round(1013 - progressRatio * 683));
  const isDeathZone = altitude > 7900;
  const isBaseCamp = altitude >= 5000 && altitude < 7900;

  // Climber coordinates on the mountain ridge slope (X: 50 -> 240, Y: 180 -> 45)
  const climberX = 45 + progressRatio * 185;
  const climberY = 175 - progressRatio * 130;

  const handleAltitudeChange = (val: number) => {
    setAltitude(val);
    if (val >= 8800) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Sagarmatha Everest Summit reached at 8,848 meters! Bachendri Pal hoisted the Indian flag here on May 23, 1984, wearing high-altitude oxygen gear and steel crampons!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center">
      {/* HUD Header with Barometer & Altimeter */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Gauge className={`w-5 h-5 ${isDeathZone ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
          <span className="text-xs font-black uppercase text-slate-800">
            Himalayan Altimeter & Barometer Lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white">
            📍 {pressureHpa} hPa
          </span>
          <span
            className={`text-xs font-black px-3.5 py-1 rounded-full shadow-sm ${
              isDeathZone
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            {isDeathZone ? '⚠️ DEATH ZONE (O₂: 33% - OXYGEN MASK ON)' : `🏔️ O₂ LEVEL: ${oxygenPercent}%`}
          </span>
        </div>
      </div>

      {/* ── DYNAMIC MOUNTAIN ELEVATION STAGE ── */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden border-3 border-slate-800 shadow-2xl flex items-center justify-center bg-gradient-to-b from-sky-900 via-sky-700 to-slate-900">
        <svg className="w-full h-full" viewBox="0 0 320 220">
          <defs>
            <linearGradient id="glacierSlopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Sky Gradient Backdrop */}
          <rect x="0" y="0" width="320" height="220" fill="url(#glacierSlopeGrad)" opacity="0.1" />

          {/* Mount Everest Ridge Slope (from bottom-left 0m to top-right 8,848m) */}
          <polygon points="0,220 250,40 320,220" fill="url(#glacierSlopeGrad)" stroke="#38bdf8" strokeWidth="2" />
          <line x1="20" y1="200" x2="250" y2="40" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4,4" />

          {/* Elevation Markers along the Slope */}
          <text x="35" y="210" fill="#38bdf8" fontSize="7" fontWeight="900">0m (Valley)</text>
          <text x="110" y="165" fill="#fde047" fontSize="7" fontWeight="900">5,364m (Base Camp)</text>
          <text x="175" y="115" fill="#f87171" fontSize="7" fontWeight="900">7,900m (Camp 4)</text>
          <text x="250" y="30" fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle">8,848m SUMMIT 🚩</text>

          {/* Summit Indian Flag */}
          <g transform="translate(250, 15)">
            <line x1="0" y1="0" x2="0" y2="25" stroke="#ffffff" strokeWidth="2" />
            <rect x="0" y="0" width="18" height="4" fill="#f97316" />
            <rect x="0" y="4" width="18" height="4" fill="#ffffff" />
            <circle cx="9" cy="6" r="1.5" fill="#1e3a8a" />
            <rect x="0" y="8" width="18" height="4" fill="#16a34a" />
          </g>

          {/* Dynamic Climber Character Moving Up Real-Time on the Slope */}
          <g transform={`translate(${climberX}, ${climberY})`}>
            {/* Heavy Red Down Suit */}
            <rect x="-7" y="-5" width="14" height="20" rx="4" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            {/* Hood & Head */}
            <circle cx="0" cy="-11" r="7" fill="#dc2626" />

            {/* Dynamic Gear Updates based on Altitude! */}
            {isDeathZone ? (
              <>
                {/* Yellow High-Altitude Oxygen Cylinder on Back */}
                <rect x="-13" y="-5" width="6" height="16" rx="2" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
                {/* Oxygen Face Mask & Breathing Tube */}
                <rect x="-2" y="-12" width="6" height="5" rx="1" fill="#0284c7" />
                <line x1="-10" y1="0" x2="-2" y2="-9" stroke="#ffffff" strokeWidth="1" />
                {/* Cold Frost Breathing Vapors */}
                <circle cx="6" cy="-10" r="2" fill="#ffffff" opacity="0.8" />
              </>
            ) : (
              // Normal goggles at lower elevations
              <rect x="-1" y="-12" width="6" height="3" rx="1" fill="#1e293b" />
            )}

            {/* Steel Spiked Crampons under boots */}
            <rect x="-6" y="15" width="5" height="7" rx="1" fill="#1e293b" />
            <rect x="1" y="15" width="5" height="7" rx="1" fill="#1e293b" />
            <line x1="-8" y1="22" x2="8" y2="22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

            {/* Ice Axe in Hand */}
            <line x1="7" y1="3" x2="16" y2="14" stroke="#475569" strokeWidth="2" />
            <path d="M 14 10 L 19 14 L 15 16 Z" fill="#94a3b8" />
          </g>
        </svg>

        {/* Blizzard Particle Overlay in Death Zone */}
        {isDeathZone && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [-50, 350], y: [0, 100] }}
                transition={{ repeat: Infinity, duration: 0.8 + (i % 4) * 0.2, ease: 'linear' }}
                className="absolute text-white text-xs select-none opacity-80"
                style={{ top: `${(i * 12) % 200}px` }}
              >
                💨 ❄️
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Altitude Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-xl my-3">
        {[
          { label: '1. Valley (0m)', alt: 500, o2: '100%' },
          { label: '2. Base Camp (5,364m)', alt: 5364, o2: '50%' },
          { label: '3. Camp 4 (7,900m)', alt: 7900, o2: '38%' },
          { label: '4. Summit (8,848m) 🚩', alt: 8848, o2: '33%' },
        ].map((p) => (
          <button
            key={p.alt}
            onClick={() => handleAltitudeChange(p.alt)}
            className={`p-2.5 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all ${
              altitude === p.alt
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 scale-102'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span className="block">{p.label}</span>
            <span className="text-[10px] text-slate-500 block">O₂: {p.o2}</span>
          </button>
        ))}
      </div>

      {/* Altitude Slider Control */}
      <div className="w-full max-w-lg my-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Sea Level (0m)</span>
          <span className="text-amber-700 font-black text-sm bg-amber-100 px-3 py-0.5 rounded-full">
            {altitude} Meters (O₂: {oxygenPercent}%)
          </span>
          <span>Everest Peak (8,848m)</span>
        </div>
        <input
          type="range"
          min="500"
          max="8848"
          step="250"
          value={altitude}
          onChange={(e) => handleAltitudeChange(parseInt(e.target.value, 10))}
          className="w-full h-4 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center text-xs font-bold text-amber-950 mt-2">
        🧗 <strong>Mountaineering Science:</strong> At 8,848m, atmospheric pressure is 3x lower than sea level. Climbers wear steel crampons to grip solid blue glacier ice and breathe supplemental oxygen from high-pressure tanks!
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
   4. 🏰 DYNAMIC GOLCONDA FORT WATER WHEEL & BASTIONS (CHAPTER 4)
   ============================================================================ */
export const GolcondaFortWaterAndDefenseSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [isPumping, setIsPumping] = useState(false);
  const [waterLiftedFeet, setWaterLiftedFeet] = useState(0);

  const handleTurnWheel = () => {
    sounds.pop();
    setIsPumping(true);
    sounds.sparkle();

    const newLift = Math.min(100, waterLiftedFeet + 25);
    setWaterLiftedFeet(newLift);

    if (newLift >= 100) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Water lifted 100 feet! The Persian gear wheel (Rahat) filled the high palace rooftop fountains using mechanical bucket chains!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-500 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Golconda Fort Water Lift & Bastion Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Turn the gear-driven Persian wheel (Rahat) to lift water 100 feet from deep stepwells!
      </p>

      {/* Hydraulic Stage */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden border-3 border-amber-600 shadow-inner flex items-center justify-between p-6 bg-gradient-to-b from-amber-100 via-amber-50 to-sky-100">
        {/* Fort Wall with Protruding Bastion (Left) */}
        <div className="flex flex-col items-center z-10">
          <div className="w-24 h-48 bg-gradient-to-b from-amber-700 to-amber-900 border-3 border-slate-900 rounded-t-3xl flex flex-col items-center justify-around py-3 shadow-xl">
            <div className="w-4 h-8 bg-slate-950 rounded-sm" />
            <div className="w-4 h-8 bg-slate-950 rounded-sm" />
            <span className="text-[8px] font-black text-amber-200 uppercase">360° Bastion</span>
          </div>
        </div>

        {/* Rotating Persian Wheel (Rahat) */}
        <div className="flex flex-col items-center z-10 my-auto">
          <motion.div
            animate={isPumping ? { rotate: 360 } : {}}
            transition={isPumping ? { repeat: Infinity, duration: 3, ease: 'linear' } : {}}
            className="w-36 h-36 rounded-full border-6 border-amber-800 bg-amber-950/20 shadow-2xl relative flex items-center justify-center"
          >
            {/* Gear Spokes */}
            <div className="w-full h-1 bg-amber-800 absolute" />
            <div className="h-full w-1 bg-amber-800 absolute" />
            {/* Buckets */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="w-6 h-8 bg-sky-400 border-2 border-slate-900 rounded-sm absolute"
                style={{
                  transform: `rotate(${deg}deg) translate(0, -68px)`,
                }}
              />
            ))}
          </motion.div>
          <span className="text-xs font-black text-amber-950 mt-3">
            Persian Gear Wheel (Rahat)
          </span>
        </div>

        {/* High Rooftop Palace Reservoir (Right) */}
        <div className="flex flex-col items-center z-10">
          <div className="w-24 h-48 bg-slate-100 border-3 border-amber-600 rounded-2xl flex flex-col items-center justify-end p-2 shadow-xl relative overflow-hidden">
            {/* Dynamic Water Level Rising */}
            <motion.div
              animate={{ height: `${waterLiftedFeet}%` }}
              transition={{ duration: 0.5 }}
              className="w-full bg-gradient-to-t from-blue-600 to-sky-400 rounded-b-xl"
            />
            <span className="absolute top-2 text-[9px] font-black text-slate-800">
              Rooftop Tank ({waterLiftedFeet} ft)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleTurnWheel}
          className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <span>💧 Turn Water Wheel (+25 ft)</span>
        </button>
      </div>

      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center text-xs font-bold text-amber-950 mt-4">
        🏰 <strong>Ancient Engineering:</strong> Golconda architects combined interlocking gears, bucket chains, and gravity pipes to supply fresh stepwell water to rooftop fountains over 400 years ago!
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
