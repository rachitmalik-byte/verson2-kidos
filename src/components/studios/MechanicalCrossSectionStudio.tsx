import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Cog,
  Droplets,
  RotateCw,
  Sparkles,
  Layers,
  Sliders,
} from 'lucide-react';

/* ============================================================================
   MECHANICAL CROSS-SECTION STUDIO (MACROSCOPIC 1:1 ENGINEERING SCHEMATIC)
   Used for: Golconda Fort Stepwells, Persian Water Wheels (Rahat / Saqiya)
   ============================================================================ */
export const MechanicalCrossSectionStudio: React.FC = () => {
  const [activeView, setActiveView] = useState<'pinion' | 'crown_interlock' | 'bucket_chain'>('crown_interlock');
  const [gearRatio, setGearRatio] = useState<number>(2); // 1 = 1:1, 2 = 1:2, 3 = 1:3
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Water output formula: gearRatio * 45 L/min
  const waterOutputLpm = gearRatio * 45;
  const rotationSpeedSec = 4 / gearRatio;

  const handleViewChange = (view: 'pinion' | 'crown_interlock' | 'bucket_chain') => {
    sounds.pop();
    setActiveView(view);
    if (view === 'pinion') {
      voiceAssistant.speak('Bull-drive pinion gear: Oxen walk in a circle turning the horizontal master wooden wheel!');
    } else if (view === 'crown_interlock') {
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
          <Cog className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: `${rotationSpeedSec}s` }} />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            Mechanical Engineering Cross-Section Schematic
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

      {/* Blueprint Sub-Mechanism Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mb-4">
        {[
          { id: 'pinion', label: '1. Bull-Drive Pinion Gear', desc: 'Horizontal Animal Drive' },
          { id: 'crown_interlock', label: '2. 90° Crown Gear Interlock', desc: 'Bevel Peg Power Transfer' },
          { id: 'bucket_chain', label: '3. Rehant Bucket Chain', desc: 'Subterranean Lift Loop' },
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

      {/* Blueprint Engineering Canvas (Blueprint Grid Background) */}
      <div className="relative w-full max-w-xl h-80 rounded-3xl bg-[#0b1b36] border-3 border-cyan-500/50 shadow-2xl flex items-center justify-center p-4 overflow-hidden">
        {/* Blueprint Grid Lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <svg className="w-full h-full" viewBox="0 0 340 220">
          <defs>
            <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>

          <rect width="340" height="220" fill="url(#blueprintGrid)" />

          {/* ════ VIEW 1: BULL-DRIVE PINION GEAR ════ */}
          {activeView === 'pinion' && (
            <g transform="translate(170, 110)">
              <circle r="75" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" />
              {/* Wooden Pinion Master Wheel */}
              <motion.g
                animate={isRunning ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: rotationSpeedSec * 2, ease: 'linear' }}
              >
                <circle r="55" fill="#78350f" stroke="#d97706" strokeWidth="4" />
                <circle r="15" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                {/* 12 Interlocking Wooden Pegs */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const px = Math.cos(angle) * 55;
                  const py = Math.sin(angle) * 55;
                  return <circle key={i} cx={px} cy={py} r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />;
                })}
                {/* Horizontal Animal Traction Beam */}
                <rect x="-85" y="-4" width="170" height="8" rx="3" fill="#b45309" stroke="#fef3c7" strokeWidth="1" />
              </motion.g>
              {/* Technical Annotations */}
              <text x="0" y="85" fill="#38bdf8" fontSize="8" fontWeight="900" textAnchor="middle">
                HORIZONTAL ANIMAL TRACTION SHAFT (PINION)
              </text>
              <text x="0" y="98" fill="#94a3b8" fontSize="7" textAnchor="middle">
                Converts Circular Bull Walk to Torque
              </text>
            </g>
          )}

          {/* ════ VIEW 2: 90° CROWN GEAR INTERLOCK ════ */}
          {activeView === 'crown_interlock' && (
            <g transform="translate(170, 110)">
              {/* Horizontal Crown Wheel */}
              <motion.g
                animate={isRunning ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: rotationSpeedSec * 2, ease: 'linear' }}
              >
                <ellipse cx="0" cy="40" rx="70" ry="25" fill="#78350f" stroke="#d97706" strokeWidth="3" />
                {/* Pegs */}
                {[-50, -25, 0, 25, 50].map((x, i) => (
                  <rect key={i} x={x - 2} y="15" width="4" height="25" fill="#f59e0b" stroke="#451a03" />
                ))}
              </motion.g>

              {/* 90-Degree Vertical Driven Gear (Interlocking at 90°) */}
              <motion.g
                animate={isRunning ? { rotate: -360 } : {}}
                transition={{ repeat: Infinity, duration: rotationSpeedSec, ease: 'linear' }}
              >
                <circle cx="0" cy="-25" r="45" fill="#92400e" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="0" cy="-25" r="8" fill="#451a03" />
                {/* Vertical Teeth */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const tx = Math.cos(angle) * 45;
                  const ty = -25 + Math.sin(angle) * 45;
                  return <rect key={i} x={tx - 3} y={ty - 3} width="6" height="6" fill="#fde68a" stroke="#78350f" />;
                })}
              </motion.g>

              {/* Interlocking Mesh Highlight Sparkles */}
              <circle cx="0" cy="15" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="50" y="18" fill="#38bdf8" fontSize="7" fontWeight="900">
                90° BEVEL CONTACT MESH
              </text>
              <text x="0" y="90" fill="#fef08a" fontSize="8" fontWeight="900" textAnchor="middle">
                DIRECTION REDIRECTION: HORIZONTAL ➔ VERTICAL SHAFT
              </text>
            </g>
          )}

          {/* ════ VIEW 3: REHANT BUCKET CHAIN LOOP ════ */}
          {activeView === 'bucket_chain' && (
            <g transform="translate(170, 110)">
              {/* Vertical Water Wheel */}
              <circle cx="0" cy="-30" r="45" fill="#78350f" stroke="#d97706" strokeWidth="3" />

              {/* Continuous Rope Chain Loop dipping into well */}
              <line x1="-35" y1="-30" x2="-35" y2="75" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3,3" />
              <line x1="35" y1="-30" x2="35" y2="75" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3,3" />
              <path d="M -35 75 Q 0 90 35 75" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3,3" />

              {/* Clay Pots (Buckets) on the chain */}
              {[
                { x: -44, y: -20, full: false },
                { x: -44, y: 15, full: false },
                { x: -44, y: 55, full: false },
                { x: 26, y: 55, full: true },
                { x: 26, y: 15, full: true },
                { x: 26, y: -20, full: true },
              ].map((b, i) => (
                <g key={i} transform={`translate(${b.x}, ${b.y})`}>
                  <rect width="18" height="22" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                  {b.full && <rect x="2" y="2" width="14" height="12" rx="2" fill="#38bdf8" />}
                </g>
              ))}

              {/* Overhead Stone Aqueduct Catching Discharged Water */}
              <rect x="40" y="-35" width="85" height="12" rx="3" fill="#64748b" stroke="#cbd5e1" />
              <rect x="42" y="-33" width="81" height="8" rx="2" fill="#0284c7" />
              <text x="82" y="-27" fill="#ffffff" fontSize="6" fontWeight="900" textAnchor="middle">
                PALACE TROUGH
              </text>

              {/* Subterranean Water Well Reservoir at Bottom */}
              <rect x="-80" y="70" width="160" height="25" rx="4" fill="#0369a1" fillOpacity="0.6" stroke="#38bdf8" />
              <text x="0" y="85" fill="#e0f2fe" fontSize="7" fontWeight="900" textAnchor="middle">
                SUBTERRANEAN STEPWELL (BAOLI)
              </text>
            </g>
          )}
        </svg>

        {/* Blueprint Water Flow HUD */}
        <div className="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/60 text-[10px] font-black text-cyan-200">
          📐 Mechanical Efficiency: {85 + gearRatio * 3}% • Lift Height: 30 Meters
        </div>
      </div>

      {/* Mechanical Advantage Gear Ratio Slider */}
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
        ⚙️ <strong>Ancient Mechanical Physics:</strong> The Persian Wheel (Rahat / Saqiya) utilizes orthogonal bevel gear teeth to redirect animal torque by 90 degrees, lifting continuous water columns over 100 feet without modern electrical pumps!
      </div>
    </div>
  );
};
