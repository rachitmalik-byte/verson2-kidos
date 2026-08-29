import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Cog,
  Droplets,
  RotateCw,
  Sparkles,
  Layers,
  ZoomIn,
} from 'lucide-react';
import persianWheelImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';

/* ============================================================================
   MECHANICAL CROSS-SECTION STUDIO (AUTHENTIC HISTORICAL IMAGE & ANNOTATIONS)
   Used for: Golconda Fort Stepwells, Persian Water Wheels (Rahat / Saqiya)
   ============================================================================ */
export const MechanicalCrossSectionStudio: React.FC = () => {
  const [activeView, setActiveView] = useState<'pinion' | 'crown_interlock' | 'bucket_chain'>('crown_interlock');
  const [gearRatio, setGearRatio] = useState<number>(2); // 1 = 1:1, 2 = 1:2, 3 = 1:3

  // Water output formula: gearRatio * 45 L/min
  const waterOutputLpm = gearRatio * 45;

  // Visual focus and zoom box according to mechanism
  const getFocusStyle = () => {
    switch (activeView) {
      case 'pinion':
        return { scale: 1.45, x: '25%', y: '25%' }; // Zoom onto top-left bull drive gear
      case 'crown_interlock':
        return { scale: 1.6, x: '10%', y: '-10%' }; // Zoom onto 90-degree central gear mesh
      case 'bucket_chain':
        return { scale: 1.35, x: '-20%', y: '-5%' }; // Zoom onto vertical wheel & pot loop
      default:
        return { scale: 1, x: '0%', y: '0%' };
    }
  };

  const handleViewChange = (view: 'pinion' | 'crown_interlock' | 'bucket_chain') => {
    sounds.pop();
    setActiveView(view);
    if (view === 'pinion') {
      voiceAssistant.speak('Bull-drive pinion gear: Oxen walk in a circle turning the horizontal master wooden wheel!');
    } else if (view === 'crown_interlock') {
      sounds.sparkle();
      voiceAssistant.speak('Crown gear interlock: 90-degree wooden bevel pegs redirect horizontal rotation into vertical shaft motion!');
    } else {
      voiceAssistant.speak('Rehant bucket chain: Continuous loop of clay pots scoops water from the subterranean well and dumps it into the rooftop aqueduct!');
    }
  };

  const handleRatioChange = (val: number) => {
    sounds.pop();
    setGearRatio(val);
    if (val === 3) {
      sounds.sparkle();
      voiceAssistant.speak('High gear ratio 1 to 3 selected! Water delivery increases to 135 Liters per minute with higher mechanical torque advantage!');
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-amber-500 shadow-2xl flex flex-col items-center text-white">
      {/* Engineering Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cog className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: `${4 / gearRatio}s` }} />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            Golconda Stepwell Persian Wheel (Rahat / Saqiya)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 border border-amber-400 text-amber-300 font-mono">
            ⚙️ Gear Ratio 1:{gearRatio}
          </span>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-900 border border-blue-400 text-cyan-200 font-mono flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>{waterOutputLpm} L/min</span>
          </span>
        </div>
      </div>

      {/* Sub-Mechanism Setting Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mb-4">
        {[
          { id: 'pinion', label: '1. Bull-Drive Pinion Gear', desc: 'Horizontal master wheel' },
          { id: 'crown_interlock', label: '2. 90° Crown Bevel Interlock', desc: 'Orthogonal power transfer' },
          { id: 'bucket_chain', label: '3. Rehant Bucket Chain Loop', desc: 'Subterranean well lift' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => handleViewChange(v.id as any)}
            className={`p-3 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
              activeView === v.id
                ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-lg scale-102 ring-2 ring-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xs block">{v.label}</span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 block font-bold mt-0.5">{v.desc}</span>
          </button>
        ))}
      </div>

      {/* Realistic Historical Image Stage with Interactive Dynamic Annotations */}
      <div className="relative w-full max-w-2xl h-96 rounded-3xl bg-slate-900 border-3 border-amber-500/70 shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Dynamic Zooming Base Image */}
        <motion.img
          src={persianWheelImg}
          alt="Authentic Golconda Persian Water Wheel Mechanism"
          animate={getFocusStyle()}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          className="w-full h-full object-cover select-none"
        />

        {/* Dynamic Interactive Callout Annotations on Image */}
        <AnimatePresence mode="wait">
          {activeView === 'pinion' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 left-6 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-400 shadow-2xl max-w-xs pointer-events-none"
            >
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bull-Drive Pinion Shaft</span>
              </div>
              <p className="text-[11px] text-slate-200 font-bold leading-snug">
                Oxen walk in a circle at the ground level, turning the horizontal master wooden wheel and converting animal walk into mechanical rotational torque!
              </p>
            </motion.div>
          )}

          {activeView === 'crown_interlock' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-6 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-cyan-400 shadow-2xl max-w-xs pointer-events-none"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-black text-xs uppercase mb-1">
                <Cog className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>90° Bevel Gear Contact Mesh</span>
              </div>
              <p className="text-[11px] text-slate-200 font-bold leading-snug">
                Interlocking wooden peg teeth redirect horizontal torque into vertical rotation by 90 degrees without modern iron gears!
              </p>
            </motion.div>
          )}

          {activeView === 'bucket_chain' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-blue-400 shadow-2xl max-w-xs pointer-events-none"
            >
              <div className="flex items-center gap-1.5 text-blue-300 font-black text-xs uppercase mb-1">
                <Droplets className="w-4 h-4 text-cyan-300" />
                <span>Rehant Continuous Clay Pot Chain</span>
              </div>
              <p className="text-[11px] text-slate-200 font-bold leading-snug">
                Clay pots dip into the subterranean stepwell, fill with fresh water, rise to the top, and pour into the palace aqueduct at {waterOutputLpm} Liters per minute!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Footnote */}
        <div className="absolute bottom-3 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-400/60 text-[10px] font-black text-amber-200">
          📐 Lift Height: 30m Subterranean Stepwell ➔ Rooftop Palace
        </div>
      </div>

      {/* Gear Ratio Mechanical Advantage Slider */}
      <div className="w-full max-w-lg my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span className="text-amber-400">1:1 Low Speed (45 L/min)</span>
          <span className="text-amber-300 font-bold bg-amber-950 px-3 py-1 rounded-full border border-amber-500">
            Selected Ratio: 1:{gearRatio} ({waterOutputLpm} L/min)
          </span>
          <span className="text-cyan-400">1:3 High Output (135 L/min)</span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={gearRatio}
          onChange={(e) => handleRatioChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="w-full bg-slate-900 p-4 rounded-2xl border border-amber-500/40 text-center text-xs font-bold text-amber-200">
        ⚙️ <strong>Ancient Mechanical Engineering:</strong> The Persian Wheel (Rahat / Saqiya) allowed Golconda architects to lift subterranean stepwell water over 100 feet into high palace rooftop fountains using animal traction and wooden bevel gears!
      </div>
    </div>
  );
};
