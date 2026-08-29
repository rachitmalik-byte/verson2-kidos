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
} from 'lucide-react';

import {
  VectorPashminaGoatAndRebo,
  VectorMountaineeringSummit,
  VectorSpaceStationHabitat,
  VectorGolcondaFortBastion,
  VectorPetroleumFractionalTower,
} from '@/components/illustrations/ThemeShelterIllustrations';

/* ============================================================================
   1. 🏔️ CHANGTHANG 5,000M PASHMINA THERMAL SCIENCE (CHAPTER 1)
   ============================================================================ */
export const ChangthangPashminaSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [tempCelsius, setTempCelsius] = useState(-40);
  const [viewMode, setViewMode] = useState<'landscape' | 'microscope'>('landscape');

  const handleTempChange = (val: number) => {
    setTempCelsius(val);
    if (val <= -20) {
      voiceAssistant.speak(
        'Freezing cold! The colder it gets at 5,000 meters, the finer and softer the Pashmina goat grows its fleece to lock in body heat!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-sky-400 shadow-xl flex flex-col items-center">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-black uppercase text-slate-800">
            Changthang Plateau (5,000m Altitude)
          </span>
        </div>
        <span className="text-xs font-black px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
          ❄️ AMBIENT TEMP: {tempCelsius}°C
        </span>
      </div>

      {/* Main Illustration Diagram */}
      <div className="my-2">
        <VectorPashminaGoatAndRebo isZoomed={viewMode === 'microscope'} />
      </div>

      {/* Temperature Slider Control */}
      <div className="w-full max-w-md my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Winter Deep Freeze (-40°C)</span>
          <span className="text-sky-600 font-bold">{tempCelsius}°C</span>
          <span>Summer Day (10°C)</span>
        </div>
        <input
          type="range"
          min="-40"
          max="10"
          step="5"
          value={tempCelsius}
          onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
      </div>

      {/* Live Science Thermal Fact Banner */}
      <div className="w-full bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 text-center text-xs font-bold text-sky-950 mt-2">
        🧤 <strong>Pashmina Thermal Law:</strong> 1 Pashmina shawl is as warm as 6 thick sweaters! Skilled Kashmiri artisans hand-weave each shawl on handlooms for over 250 hours!
      </div>
    </div>
  );
};

/* ============================================================================
   2. 🧗 MOUNTAINEERING & EVEREST OXYGEN BAROMETER (CHAPTER 2)
   ============================================================================ */
export const EverestMountaineeringSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [altitude, setAltitude] = useState(8848);

  const oxygenPercent = Math.max(33, Math.round(100 - (altitude / 8848) * 67));
  const isDeathZone = altitude > 8000;

  const handleAltitudeChange = (val: number) => {
    setAltitude(val);
    if (val >= 8800) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Summit of Mount Everest reached at 8,848 meters! Air pressure is only 33% of sea level. Bachendri Pal hoisted the Indian flag here in 1984!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center">
      {/* HUD Barometer Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Gauge className={`w-4 h-4 ${isDeathZone ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
          <span className="text-xs font-black uppercase text-slate-800">
            Himalayan Altitude & Atmospheric Pressure
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full ${
            isDeathZone
              ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-bounce'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
        >
          {isDeathZone ? '⚠️ DEATH ZONE (OXYGEN TANKS REQUIRED)' : '🏔️ ACCLIMATIZATION ZONE'}
        </span>
      </div>

      {/* Visual Diagram */}
      <div className="my-2">
        <VectorMountaineeringSummit altitudeMeters={altitude} />
      </div>

      {/* Altitude Slider */}
      <div className="w-full max-w-md my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Sea Level (0m)</span>
          <span className="text-amber-600 font-bold">{altitude}m (O₂: {oxygenPercent}%)</span>
          <span>Everest Peak (8,848m)</span>
        </div>
        <input
          type="range"
          min="500"
          max="8848"
          step="500"
          value={altitude}
          onChange={(e) => handleAltitudeChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center text-xs font-bold text-amber-950">
        🧗 <strong>Mountaineer Acclimatization:</strong> To fight thin air and cold, climbers take Vitamin C, iron tablets, and hot jaggery tea daily to boost red blood cells!
      </div>
    </div>
  );
};

/* ============================================================================
   3. 🚀 SUNITA WILLIAMS ZERO-GRAVITY SPACE STATION (CHAPTER 3)
   ============================================================================ */
export const ZeroGravitySpaceStationSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [isWaterReleased, setIsWaterReleased] = useState(false);

  const handleReleaseWater = () => {
    sounds.sparkle();
    setIsWaterReleased(true);
    voiceAssistant.speak(
      'Look at the water! In zero gravity aboard the space station, surface tension pulls water into perfect floating round spheres!'
    );
    if (onCompleted) onCompleted();
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Sunita Williams Space Living Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Explore how water, sleeping bags, and astronauts behave in microgravity orbit!
      </p>

      {/* Visual Diagram */}
      <div className="my-2">
        <VectorSpaceStationHabitat />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleReleaseWater}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <Droplets className="w-4 h-4 text-cyan-300" />
          <span>Release Water Blob in Zero-G</span>
        </button>
      </div>

      <div className="w-full bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 text-center text-xs font-bold text-indigo-950 mt-4">
        🌍 <strong>View From Space:</strong> Sunita Williams remarked: "From space, you cannot see country borders or lines on Earth; all you see is one beautiful glowing blue planet!"
      </div>
    </div>
  );
};

/* ============================================================================
   4. 🏰 GOLCONDA FORT BASTIONS & WATER WHEEL (CHAPTER 4)
   ============================================================================ */
export const GolcondaFortWaterAndDefenseSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [isWheelTurning, setIsWheelTurning] = useState(false);

  const handleTurnWheel = () => {
    sounds.pop();
    setIsWheelTurning(true);
    sounds.sparkle();
    voiceAssistant.speak(
      'The Persian water wheel (Rahat) gear system turns, lifting buckets of cool water 100 feet upwards from the stepwell to the high rooftop fountains!'
    );
    if (onCompleted) onCompleted();
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-500 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Golconda Fort Hydraulic & Bastion Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Operate the ancient gear-driven bucket chain and examine defensive stone bastions!
      </p>

      {/* Visual Diagram */}
      <div className="my-2">
        <VectorGolcondaFortBastion />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleTurnWheel}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <span>💧 Turn Persian Water Wheel (Rahat)</span>
        </button>
      </div>

      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center text-xs font-bold text-amber-950 mt-4">
        🏰 <strong>Acoustic Whispering Secret:</strong> The unique parabolic arch acoustics at Fateh Darwaza carried whispers 1 km uphill to alert guards of approaching armies!
      </div>
    </div>
  );
};

/* ============================================================================
   5. 🛢️ PETROLEUM REFINERY & SOLAR ENERGY (CHAPTER 5)
   ============================================================================ */
export const PetroleumRefineryAndSolarSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [energyMode, setEnergyMode] = useState<'petroleum' | 'solar'>('petroleum');

  const handleSwitchEnergy = (mode: 'petroleum' | 'solar') => {
    sounds.pop();
    setEnergyMode(mode);
    if (mode === 'solar') {
      sounds.fanfare();
      voiceAssistant.speak(
        'Clean Solar Transition! Solar panels convert limitless sunlight directly into electricity without air pollution or depleting Earth’s underground oil!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-700 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Petroleum Distillation & Energy Future</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        See how crude oil is boiled into 5 essential fuels and explore the clean solar transition!
      </p>

      {/* Visual Diagram */}
      <div className="my-2">
        <VectorPetroleumFractionalTower />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
        <button
          onClick={() => handleSwitchEnergy('petroleum')}
          className={`p-3.5 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            energyMode === 'petroleum' ? 'bg-slate-900 text-white border-slate-700 shadow-md' : 'bg-slate-100 text-slate-600'
          }`}
        >
          🛢️ Petroleum Refiner
        </button>

        <button
          onClick={() => handleSwitchEnergy('solar')}
          className={`p-3.5 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            energyMode === 'solar' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl ring-2 ring-amber-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          ☀️ Clean Solar Power
        </button>
      </div>

      <div className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-center text-xs font-bold text-slate-800 mt-4">
        🛢️ <strong>Conservation Rule:</strong> It takes millions of years to form crude oil. Switch off car engines at red lights to save fuel!
      </div>
    </div>
  );
};
