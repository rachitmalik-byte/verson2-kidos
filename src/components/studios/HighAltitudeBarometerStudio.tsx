import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Gauge,
  Wind,
  Sparkles,
  Layers,
  Thermometer,
} from 'lucide-react';

/* ============================================================================
   HIGH-ALTITUDE BAROMETER STUDIO (ATMOSPHERIC PRESSURE & O2 GRADIENT SCALE)
   Used for: Mount Everest & High Himalayan Expeditions
   ============================================================================ */
export const HighAltitudeBarometerStudio: React.FC = () => {
  const [altitude, setAltitude] = useState<number>(5364);

  // Pressure drops from 1013 hPa (Sea level) to 330 hPa (8,848m Summit)
  const progressRatio = altitude / 8848;
  const pressureHpa = Math.max(330, Math.round(1013 - progressRatio * 683));
  const oxygenPct = Math.max(33, Math.round(100 - progressRatio * 67));
  const mercuryHeightMm = Math.max(250, Math.round(760 - progressRatio * 510));
  const isDeathZone = altitude >= 7900;

  const handleAltitudeChange = (val: number) => {
    setAltitude(val);
    if (val >= 8800) {
      sounds.fanfare();
      voiceAssistant.speak(
        '8,848m Sagarmatha Summit! Atmospheric pressure is only 330 hPa. Torricelli mercury column drops from 760mm to 250mm because air molecules are 3 times more spread out!'
      );
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-sky-400 shadow-2xl flex flex-col items-center text-white">
      {/* Top HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-black uppercase tracking-widest text-sky-300">
            Atmospheric Barometer & O₂ Density Studio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 border border-sky-400 text-cyan-300 font-mono">
            📍 {pressureHpa} hPa ({mercuryHeightMm} mmHg)
          </span>
          <span
            className={`text-xs font-black px-3.5 py-1 rounded-full font-mono ${
              isDeathZone
                ? 'bg-rose-500 text-white font-black animate-pulse'
                : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            O₂ LEVEL: {oxygenPct}%
          </span>
        </div>
      </div>

      {/* Barometer Stage Canvas */}
      <div className="relative w-full max-w-xl h-80 rounded-3xl bg-[#081224] border-3 border-sky-500/50 shadow-2xl flex items-center justify-between p-6 overflow-hidden">
        {/* Left: Torricelli Mercury Barometer Tube */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-56 border-3 border-slate-400 rounded-t-full bg-slate-900/60 relative overflow-hidden flex flex-col justify-end p-1">
            {/* Liquid Mercury Column */}
            <motion.div
              animate={{ height: `${(mercuryHeightMm / 760) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full bg-gradient-to-t from-slate-400 to-slate-200 rounded-b-sm relative flex items-center justify-center"
            >
              <div className="w-full h-1 bg-white opacity-80 absolute top-0" />
            </motion.div>
            {/* Ticks */}
            {[760, 500, 250].map((t) => (
              <div key={t} className="absolute left-0 text-[7px] font-mono text-slate-400 flex items-center gap-0.5" style={{ bottom: `${(t / 760) * 100}%` }}>
                <div className="w-2 h-[1px] bg-slate-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-300 mt-2">Torricelli Mercury Column</span>
        </div>

        {/* Right: Molecular Air Density Scatter Matrix */}
        <div className="flex-1 flex flex-col items-center ml-8">
          <div className="w-full h-44 rounded-2xl bg-slate-900 border-2 border-slate-700 relative overflow-hidden flex items-center justify-center p-3">
            {/* Oxygen Gas Molecules (O2) */}
            <div className="w-full h-full relative">
              {[...Array(Math.max(8, Math.round((oxygenPct / 100) * 45)))].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [(i * 23) % 180, ((i * 23) % 180) + (i % 2 === 0 ? 10 : -10)],
                    y: [(i * 17) % 110, ((i * 17) % 110) + (i % 2 === 0 ? -10 : 10)],
                  }}
                  transition={{ repeat: Infinity, duration: 2 + (i % 3), ease: 'easeInOut' }}
                  className="absolute w-3 h-3 rounded-full bg-cyan-400 border border-white flex items-center justify-center text-[7px] font-black text-slate-950 shadow-[0_0_8px_#38bdf8]"
                >
                  O₂
                </motion.div>
              ))}
            </div>

            {/* Altitude Badge */}
            <div className="absolute top-2 right-2 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-md border border-cyan-400 text-[9px] font-black text-cyan-300">
              Altitude: {altitude}m
            </div>
          </div>
          <span className="text-[10px] font-black text-cyan-300 mt-2">
            Air Molecule Concentration ({oxygenPct}% Oxygen)
          </span>
        </div>
      </div>

      {/* Altitude Slider Control */}
      <div className="w-full max-w-lg my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span className="text-emerald-400">Sea Level (0m - 1013 hPa)</span>
          <span className="text-cyan-300 font-bold bg-sky-950 px-3 py-1 rounded-full border border-sky-500">
            Selected Elevation: {altitude} Meters
          </span>
          <span className="text-rose-400">Everest Peak (8,848m - 330 hPa)</span>
        </div>
        <input
          type="range"
          min="0"
          max="8848"
          step="250"
          value={altitude}
          onChange={(e) => handleAltitudeChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />
      </div>

      <div className="w-full bg-slate-900 p-4 rounded-2xl border border-sky-500/40 text-center text-xs font-bold text-sky-200">
        🏔️ <strong>Atmospheric Physics:</strong> Gravity pulls most air molecules close to Earth’s surface. At 8,848m Everest summit, air molecules are widely scattered, reducing available oxygen to one-third of sea level!
      </div>
    </div>
  );
};
