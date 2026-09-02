import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import blueprintImg from '@/assets/images/theme-shelter/kutch_bhunga_blueprint.png';
import bhungaRealPhoto from '@/assets/images/specimens/kutch_bhunga_house.jpg';
import {
  Compass,
  Layers,
  Activity,
  Wind,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Sparkles,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export const KutchBhungaArchitecturalLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'exploded' | 'aerodynamics' | 'shake_table'>('blueprint');
  const [explodedLevel, setExplodedLevel] = useState<number>(30); // 0% to 100%
  const [richterScale, setRichterScale] = useState<number>(5.5);
  const [isQuakeActive, setIsQuakeActive] = useState<boolean>(false);
  const [blueprintZoom, setBlueprintZoom] = useState<number>(100);

  const handleTriggerQuake = () => {
    sounds.tensionSnap();
    setIsQuakeActive(true);

    if (richterScale >= 7.0) {
      voiceAssistant.speak(
        'Severe Richter 7.7 Earthquake! The circular Bhunga cylinder distributes seismic waves through 360-degree hoop tension, while square buildings suffer corner shear failure and collapse!'
      );
    } else {
      voiceAssistant.speak(
        'Moderate seismic ground vibrations. The flexible bamboo rafters and mud-twig mesh absorb the tremors safely.'
      );
    }

    setTimeout(() => {
      setIsQuakeActive(false);
      sounds.fanfare();
      if (onCompleted) onCompleted();
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-500 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* ── Top Header HUD ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-amber-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1 shadow-xs">
            🏛️ Traditional Gujarat Architecture • When the Earth Shook
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Kutch Bhunga: Earthquake-Resilient Engineering
          </h3>
        </div>

        {/* 4 Station Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'blueprint', label: '📐 1. Blueprints & Plan' },
            { id: 'exploded', label: '🏗️ 2. Exploded 3D View' },
            { id: 'aerodynamics', label: '🌪️ 3. Circular vs Square' },
            { id: 'shake_table', label: '📳 4. Richter Shake Table' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STATION 1: BLUEPRINT, ELEVATION & SECTION (AUTHENTIC DRAWINGS)
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'blueprint' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-[#faf7f2] flex flex-col items-center justify-between p-4 text-slate-900">
            {/* Scrollable / Zoomable Blueprint Container */}
            <div className="relative w-full flex-1 overflow-auto rounded-2xl border-2 border-amber-300/80 bg-white flex items-center justify-center p-2 shadow-inner">
              <img
                src={blueprintImg}
                alt="Bhunga House Architectural Blueprints"
                className="max-h-full object-contain transition-transform duration-300"
                style={{ transform: `scale(${blueprintZoom / 100})` }}
              />
            </div>

            {/* Bottom Blueprint Control Bar & Callouts */}
            <div className="w-full bg-amber-100/90 backdrop-blur-md p-3 rounded-2xl border border-amber-300 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-base">📐</span>
                <span className="text-amber-950">
                  <strong>Architectural Elements:</strong> 3–6m Circular Diameter • Gando Bamboo Rafters • Chikkani Matti (Clay) & Cow Dung Plaster
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-amber-900 font-black">Zoom: {blueprintZoom}%</span>
                <input
                  type="range"
                  min="80"
                  max="180"
                  value={blueprintZoom}
                  onChange={(e) => setBlueprintZoom(Number(e.target.value))}
                  className="accent-amber-600 cursor-pointer w-24"
                />
              </div>
            </div>
          </div>

          {/* 4 Architectural Blueprint Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full mt-4">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-black text-amber-800 uppercase block">1. Floor Plan</span>
              <h5 className="font-black text-xs text-slate-900 mt-0.5">Circular Earthen Cylinder</h5>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                No 90° corners! Shockwaves distribute evenly without stress concentration.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-black text-amber-800 uppercase block">2. Conical Roof</span>
              <h5 className="font-black text-xs text-slate-900 mt-0.5">Gando Bamboo Umbrella</h5>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Radial rafters disperse gravity load downwards into continuous ring beam.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-black text-amber-800 uppercase block">3. Mud Mesh Material</span>
              <h5 className="font-black text-xs text-slate-900 mt-0.5">Chikkani Matti + Dung</h5>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Fiber-reinforced clay wall flexes during quakes and provides natural thermal insulation.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-black text-amber-800 uppercase block">4. Lippan Art</span>
              <h5 className="font-black text-xs text-slate-900 mt-0.5">Mirrors & Wall Motifs</h5>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Traditional mirror mosaic reflects desert heat and decorates recessed wall niches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: EXPLODED 3D STRUCTURAL ASSEMBLY
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'exploded' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-between p-6">
            {/* Visual Exploded 2.5D Schematic Diagram */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
              {/* LAYER 1: CONICAL THATCH ROOF (LIFTS UP WITH EXPLODED SLIDER) */}
              <motion.div
                animate={{ y: -(explodedLevel * 1.3) }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative z-30 flex flex-col items-center"
              >
                <div className="w-0 h-0 border-l-[90px] sm:border-l-[120px] border-l-transparent border-r-[90px] sm:border-r-[120px] border-r-transparent border-b-[70px] sm:border-b-[90px] border-b-amber-700 relative shadow-lg">
                  {/* Central King Post Spike */}
                  <div className="w-2.5 h-6 bg-amber-900 absolute -top-4 left-1/2 -translate-x-1/2 rounded-t-sm" />
                </div>
                <span className="text-[10px] font-black bg-amber-950 text-amber-200 px-2.5 py-0.5 rounded-full mt-1 shadow-md">
                  Layer 1: Conical Thatch Roof & Bamboo Rafters
                </span>
              </motion.div>

              {/* LAYER 2: CIRCULAR TIMBER RING BEAM */}
              <motion.div
                animate={{ y: -(explodedLevel * 0.5) }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative z-20 flex flex-col items-center my-1"
              >
                <div className="w-48 sm:w-64 h-5 rounded-full border-4 border-amber-900 bg-amber-600 shadow-md flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">360° Circular Ring Beam (Hoop Tension)</span>
                </div>
                <span className="text-[10px] font-black bg-slate-900 text-slate-200 px-2.5 py-0.5 rounded-full mt-0.5 shadow-sm">
                  Layer 2: Structural Junction Ring
                </span>
              </motion.div>

              {/* LAYER 3: CYLINDRICAL MUD WALL & LINTEL DOOR */}
              <motion.div
                animate={{ y: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-44 sm:w-60 h-28 sm:h-32 rounded-3xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-4 border-amber-600 shadow-xl flex items-center justify-center relative overflow-hidden">
                  {/* Timber Lintel Door Frame */}
                  <div className="w-12 h-20 bg-amber-950 rounded-t-md absolute bottom-0 border-2 border-amber-900 flex items-center justify-center">
                    <div className="w-1 h-3 bg-amber-400 absolute right-1" />
                  </div>
                  {/* Traditional Lippan Mirror Motifs */}
                  <div className="absolute top-3 left-4 text-xs">✨ 🪞</div>
                  <div className="absolute top-3 right-4 text-xs">🪞 ✨</div>
                </div>
                <span className="text-[10px] font-black bg-amber-900 text-amber-100 px-2.5 py-0.5 rounded-full mt-1 shadow-sm">
                  Layer 3: Earthen Mud Wall & Raised Foundation Plinth
                </span>
              </motion.div>
            </div>

            {/* Slider to Explode / Collapse Assembly */}
            <div className="w-full bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-4 z-30 shadow-md">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 shrink-0">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Explode Architectural Layers:</span>
              </span>
              <input
                type="range"
                min="0"
                max="80"
                value={explodedLevel}
                onChange={(e) => setExplodedLevel(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-xs font-black text-amber-950 w-16 text-right">
                {explodedLevel}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 3: SEISMIC & WIND AERODYNAMICS (CIRCULAR VS SQUARE)
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'aerodynamics' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card A: Square House (Vulnerable to Shear Cracks) */}
          <div className="bg-rose-50 border-4 border-rose-300 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-800 bg-rose-200 px-3 py-0.5 rounded-full">
                  ❌ Square / Flat-Walled House
                </span>
                <span className="text-rose-600 font-black text-xs">High Seismic Risk</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-2">Flat Walls & 90° Corner Failure</h4>

              {/* Vector Diagram: Square building with stress points */}
              <div className="w-full h-44 bg-slate-900 rounded-2xl my-3 p-4 flex items-center justify-center relative overflow-hidden">
                {/* Wind / Shockwave Arrows Crashing Flat */}
                <div className="absolute left-2 inset-y-0 flex flex-col justify-around text-xs text-rose-400 font-black">
                  <span>➡️ 🌊 Shock</span>
                  <span>➡️ 🌊 Shock</span>
                  <span>➡️ 🌊 Shock</span>
                </div>

                {/* Square Building with Cracked Corners */}
                <div className="w-24 h-24 bg-rose-600 border-3 border-rose-300 relative flex items-center justify-center shadow-lg">
                  {/* Corner X-Cracks */}
                  <span className="absolute -top-1 -left-1 text-yellow-300 font-black text-lg">⚡</span>
                  <span className="absolute -top-1 -right-1 text-yellow-300 font-black text-lg">⚡</span>
                  <span className="absolute -bottom-1 -left-1 text-yellow-300 font-black text-lg">⚡</span>
                  <span className="absolute -bottom-1 -right-1 text-yellow-300 font-black text-lg">⚡</span>
                  <span className="text-[10px] font-black text-white text-center">90° Corner Stress Trap</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                When earthquake ground waves strike, rigid flat walls act like dams. Seismic inertia concentrates at the <strong>90° sharp corners</strong>, creating giant diagonal X-shear cracks that cause wall collapse!
              </p>
            </div>

            <span className="text-[10px] font-black text-rose-900 bg-rose-100 p-2 rounded-xl mt-3 text-center border border-rose-200">
              ⚠️ In the 2001 Bhuj earthquake, thousands of square masonry homes collapsed.
            </span>
          </div>

          {/* Card B: Circular Bhunga House (Earthquake Resistant) */}
          <div className="bg-emerald-50 border-4 border-emerald-400 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-200 px-3 py-0.5 rounded-full">
                  ✅ Circular Kutch Bhunga
                </span>
                <span className="text-emerald-700 font-black text-xs">Seismic Safe</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-2">Continuous 360° Hoop Tension</h4>

              {/* Vector Diagram: Circular building with flowing waves */}
              <div className="w-full h-44 bg-slate-900 rounded-2xl my-3 p-4 flex items-center justify-center relative overflow-hidden">
                {/* Wind / Shockwaves flowing around circle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '20s' }} />
                </div>

                {/* Circular Bhunga */}
                <div className="w-24 h-24 rounded-full bg-emerald-600 border-3 border-emerald-300 relative flex items-center justify-center shadow-[0_0_25px_#10b981]">
                  <span className="text-[10px] font-black text-white text-center px-2">
                    Uniform 360° Wave Flow
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                A circle has <strong>zero sharp corners</strong>. Seismic shear forces are shared continuously around the cylindrical perimeter as <strong>hoop tension</strong>, allowing the house to absorb massive ground acceleration!
              </p>
            </div>

            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 p-2 rounded-xl mt-3 text-center border border-emerald-300">
              🌟 In 2001, traditional circular Bhungas in Kutch remained standing completely intact!
            </span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 4: RICHTER 7.7 GUJARAT SHAKE-TABLE SIMULATOR
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'shake_table' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-950 flex flex-col items-center justify-between p-5 text-white">
            {/* Live Richter Gauge Badge */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-xs font-black uppercase text-amber-300 bg-slate-900 px-3 py-1 rounded-full border border-amber-500">
                  Richter Magnitude: {richterScale.toFixed(1)}
                </span>
              </div>

              <span className={`text-xs font-black px-3.5 py-1 rounded-full ${
                richterScale >= 7.0 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950'
              }`}>
                {richterScale >= 7.0 ? '🚨 SEVERE QUAKE (2001 BHUJ EVENT)' : 'MODERATE SEISMIC TREMORS'}
              </span>
            </div>

            {/* Shake Table Visual Stage */}
            <div className="relative w-full flex-1 flex items-center justify-around overflow-hidden my-2">
              {/* Ground Bed with Seismic Waves */}
              <motion.div
                animate={isQuakeActive ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-around"
              >
                {/* Left: Square Rigid Masonry House (Collapses at M >= 7.0) */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={
                      isQuakeActive && richterScale >= 7.0
                        ? { rotate: [0, -15, 20, -10], y: [0, 40], opacity: [1, 0.4] }
                        : isQuakeActive
                        ? { x: [-8, 8, -8] }
                        : {}
                    }
                    className="w-28 h-28 bg-rose-700 border-3 border-rose-400 rounded-lg flex flex-col items-center justify-center p-2 shadow-xl relative"
                  >
                    {isQuakeActive && richterScale >= 7.0 ? (
                      <span className="text-2xl">💥</span>
                    ) : (
                      <span className="text-2xl">🏠</span>
                    )}
                    <span className="text-[9px] font-black text-white text-center mt-1">
                      {isQuakeActive && richterScale >= 7.0 ? 'Corner Failure!' : 'Square Masonry'}
                    </span>
                  </motion.div>
                  <span className="text-[10px] font-black text-rose-400 mt-2">
                    {isQuakeActive && richterScale >= 7.0 ? '❌ COLLAPSED' : 'Rigid 90° Corners'}
                  </span>
                </div>

                {/* Right: Circular Kutch Bhunga House (Survives Intact) */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={
                      isQuakeActive
                        ? { scale: [1, 1.03, 0.98, 1], rotate: [-2, 2, -2] }
                        : {}
                    }
                    className="w-28 h-28 rounded-full bg-emerald-600 border-4 border-emerald-300 flex flex-col items-center justify-center p-2 shadow-[0_0_30px_#10b981] relative"
                  >
                    <span className="text-2xl">🛖</span>
                    <span className="text-[9px] font-black text-white text-center mt-1">
                      Circular Bhunga
                    </span>
                  </motion.div>
                  <span className="text-[10px] font-black text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SURVIVES 7.7 QUAKE!</span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Shake Table Controls */}
            <div className="w-full bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <span className="text-xs font-black text-slate-300 shrink-0">Adjust Magnitude:</span>
                <input
                  type="range"
                  min="4.0"
                  max="8.5"
                  step="0.1"
                  value={richterScale}
                  onChange={(e) => setRichterScale(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <button
                onClick={handleTriggerQuake}
                disabled={isQuakeActive}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Activity className="w-4 h-4" />
                <span>{isQuakeActive ? 'Simulating Tremors...' : '⚡ Trigger Earthquake Shake Table!'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5th Grade Key Architecture Secret */}
      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center sm:text-left text-xs font-bold text-amber-950 mt-4">
        🏛️ <strong>5th Grade Architecture Secret (When the Earth Shook):</strong> Kutch Bhunga houses survive Richter 7.7 earthquakes because their <strong>cylindrical shape has no 90° corners</strong> for stresses to concentrate. The circular bamboo ring beam and flexible clay-twig mesh absorb ground energy, while the conical roof sheds desert sun and monsoon rain!
      </div>
    </div>
  );
};
