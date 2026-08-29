import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Activity,
  ShieldAlert,
  Sparkles,
  Layers,
  RotateCcw,
} from 'lucide-react';

/* ============================================================================
   SEISMIC STRUCTURE STUDIO (SHAKE TABLE & EARTHQUAKE RESILIENT ARCHITECTURE)
   Used for: CBSE EVS "When the Earth Shook" (Kutch & Himalayan Architecture)
   ============================================================================ */
export const SeismicStructureStudio: React.FC = () => {
  const [richterMagnitude, setRichterMagnitude] = useState<number>(5.5);
  const [structureType, setStructureType] = useState<'rigid_mortar' | 'timber_laced_koti_banal'>('timber_laced_koti_banal');

  // Ground acceleration amplitude in px
  const shakeAmplitude = Math.max(0, (richterMagnitude - 3.0) * 4);
  const isSevereQuake = richterMagnitude >= 6.5;
  const isDestroyed = structureType === 'rigid_mortar' && richterMagnitude >= 6.0;

  const handleMagnitudeChange = (val: number) => {
    setRichterMagnitude(val);
    if (val >= 6.5) {
      sounds.boing();
      if (structureType === 'rigid_mortar') {
        voiceAssistant.speak(
          'Severe Magnitude 6.5+ S-waves! Rigid unreinforced brick mortar experiences brittle diagonal shear fracture and collapses!'
        );
      } else {
        sounds.sparkle();
        voiceAssistant.speak(
          'Severe earthquake! The traditional Koti Banal interlocking wooden frames and dry-stone masonry flex and absorb seismic energy without collapse!'
        );
      }
    }
  };

  const handleStructureToggle = (type: 'rigid_mortar' | 'timber_laced_koti_banal') => {
    sounds.pop();
    setStructureType(type);
    if (type === 'timber_laced_koti_banal') {
      voiceAssistant.speak(
        'Traditional Koti Banal / Dhajji Dewari architecture: Wood beams interlocked at corners act as seismic shock absorbers.'
      );
    } else {
      voiceAssistant.speak(
        'Modern rigid unreinforced masonry: Stiff walls cannot bend, leading to sudden shear cracks under ground shaking.'
      );
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-rose-500 shadow-2xl flex flex-col items-center text-white">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-rose-300">
            Seismic Shake-Table Laboratory (Richter Scale {richterMagnitude.toFixed(1)})
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full ${
            isDestroyed
              ? 'bg-rose-600 text-white font-black animate-pulse'
              : 'bg-emerald-500 text-slate-950 font-black'
          }`}
        >
          {isDestroyed ? '💥 STRUCTURAL COLLAPSE (SHEAR FRACTURE)' : '🛡️ SEISMIC RESILIENT (FLEXIBLE JOINTS)'}
        </span>
      </div>

      {/* Structural Framing Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
        <button
          onClick={() => handleStructureToggle('rigid_mortar')}
          className={`p-3.5 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
            structureType === 'rigid_mortar'
              ? 'bg-rose-500 border-rose-300 text-white shadow-lg ring-2 ring-rose-400'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs block">1. Modern Rigid Brick & Mortar</span>
          <span className="text-[10px] text-slate-300 block font-bold mt-0.5">Brittle walls; high shear fracture hazard</span>
        </button>

        <button
          onClick={() => handleStructureToggle('timber_laced_koti_banal')}
          className={`p-3.5 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
            structureType === 'timber_laced_koti_banal'
              ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-lg scale-102 ring-2 ring-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs block">2. Traditional Koti Banal / Dhajji Frame</span>
          <span className="text-[10px] text-slate-900 font-bold block mt-0.5">Interlocking timber beams flex with seismic waves</span>
        </button>
      </div>

      {/* Shake-Table Stage with Dynamic Ground Motion */}
      <div className="relative w-full max-w-xl h-80 rounded-3xl bg-[#090e17] border-3 border-rose-500/50 shadow-2xl flex flex-col items-center justify-end p-6 overflow-hidden">
        {/* Dynamic Oscillating Building Model */}
        <motion.div
          animate={{
            x: [-shakeAmplitude, shakeAmplitude, -shakeAmplitude],
            rotate: isDestroyed ? 25 : [-shakeAmplitude * 0.4, shakeAmplitude * 0.4, -shakeAmplitude * 0.4],
            y: isDestroyed ? 40 : 0,
          }}
          transition={{
            repeat: Infinity,
            duration: 0.15,
            ease: 'easeInOut',
          }}
          className="relative flex flex-col items-center z-10"
        >
          {structureType === 'rigid_mortar' ? (
            /* Rigid Brick Building with Diagonal Shear Cracks */
            <div className="w-40 h-48 bg-amber-800 border-4 border-slate-900 rounded-t-xl relative flex flex-col justify-around p-2 shadow-2xl">
              {/* Windows */}
              <div className="flex justify-around">
                <div className="w-8 h-8 bg-sky-300 border border-slate-950" />
                <div className="w-8 h-8 bg-sky-300 border border-slate-950" />
              </div>
              <div className="flex justify-around">
                <div className="w-8 h-8 bg-sky-300 border border-slate-950" />
                <div className="w-8 h-8 bg-sky-300 border border-slate-950" />
              </div>

              {/* Diagonal Shear Cracks on High Magnitude */}
              {richterMagnitude >= 5.0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 192">
                  <path d="M 10 180 L 70 100 L 60 70 L 150 10" stroke="#ef4444" strokeWidth="3" fill="none" />
                  <path d="M 150 180 L 90 100 L 100 70 L 10 10" stroke="#ef4444" strokeWidth="3" fill="none" />
                </svg>
              )}
            </div>
          ) : (
            /* Traditional Koti Banal Interlocking Timber Frame */
            <div className="w-40 h-48 bg-amber-950/80 border-4 border-amber-500 rounded-t-xl relative flex flex-col justify-between p-2 shadow-2xl">
              {/* Horizontal Timber Tie Beams */}
              {[1, 2, 3, 4].map((b) => (
                <div key={b} className="w-full h-3 bg-amber-600 border border-amber-300 rounded-xs flex items-center justify-between px-1">
                  <div className="w-2 h-2 bg-amber-900 rounded-full" />
                  <div className="w-2 h-2 bg-amber-900 rounded-full" />
                </div>
              ))}
              {/* Stone Fill Cushions in between */}
              <span className="text-[8px] font-black text-amber-200 text-center uppercase">
                Interlocking Timber Keys
              </span>
            </div>
          )}
        </motion.div>

        {/* Shake-Table Base Platform */}
        <motion.div
          animate={{ x: [-shakeAmplitude, shakeAmplitude, -shakeAmplitude] }}
          transition={{ repeat: Infinity, duration: 0.15, ease: 'easeInOut' }}
          className="w-64 h-8 bg-slate-700 border-t-4 border-rose-500 rounded-lg flex items-center justify-center shadow-2xl z-20"
        >
          <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider">
            Hydraulic Shake Table Base
          </span>
        </motion.div>
      </div>

      {/* Richter Magnitude Slider */}
      <div className="w-full max-w-lg my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span className="text-emerald-400">3.0 (Minor Tremor)</span>
          <span className="text-rose-400 font-bold bg-rose-950 px-3 py-1 rounded-full border border-rose-500">
            Richter Intensity: {richterMagnitude.toFixed(1)} Magnitude
          </span>
          <span className="text-rose-500">7.5 (Catastrophic)</span>
        </div>
        <input
          type="range"
          min="3.0"
          max="7.5"
          step="0.5"
          value={richterMagnitude}
          onChange={(e) => handleMagnitudeChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
      </div>

      <div className="w-full bg-slate-900 p-4 rounded-2xl border border-rose-500/40 text-center text-xs font-bold text-rose-200">
        🏔️ <strong>Indigenous Engineering:</strong> Himalayan Koti Banal multi-storey structures built over 1,000 years ago survived massive earthquakes because interlocking wooden timber frames flex and dissipate seismic wave energy instead of cracking!
      </div>
    </div>
  );
};
