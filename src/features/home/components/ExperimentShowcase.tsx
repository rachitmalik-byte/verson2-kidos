import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ArrowRight, X, Gauge, Zap, Activity } from 'lucide-react';
import { sounds } from '@/lib/sounds';

import volcanoLoadingImg from '@/assets/images/landing/volcano_lab_loading.jpg';
import volcanoDoneImg from '@/assets/images/landing/volcano_lab_done.jpg';
import planetImg from '@/assets/images/landing/planet_celestial_3d.jpg';
import electromagnetImg from '@/assets/images/landing/electromagnet_coil_3d.jpg';

export const ExperimentShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeModalSim, setActiveModalSim] = useState<'volcano' | 'solar' | 'electromagnet' | null>(null);

  // Mini-simulation modal states
  const [coilTurns, setCoilTurns] = useState(50);
  const [currentAmps, setCurrentAmps] = useState(3.5);
  const [isCoilPowered, setIsCoilPowered] = useState(false);

  const [simPressure, setSimPressure] = useState(65);
  const [isEruptingSim, setIsEruptingSim] = useState(false);

  const experiments = [
    {
      id: 'volcano',
      title: 'Subsurface Magma Viscosity & Eruption Chamber',
      discipline: 'EARTH SCIENCE',
      visual: volcanoLoadingImg,
      summary: 'Regulate gas saturation and magma silica levels inside a pressurized glass chamber to compare explosive vs effusive lava flows.',
      metricLabel: 'Chamber Pressure',
      metricValue: '48.2 MPa',
      route: '/chapter/3/mission/4',
    },
    {
      id: 'solar',
      title: 'Planetary Gravitational Orbits & Resonance',
      discipline: 'SPACE SCIENCE',
      visual: planetImg,
      summary: 'Map gravitational wells, compute escape velocities, and observe how planetary atmospheres trap surface heat.',
      metricLabel: 'Orbital Velocity',
      metricValue: '29.8 km/s',
      route: '/theme/water/hub',
    },
    {
      id: 'electromagnet',
      title: 'Electromagnetic Field Induction Rig',
      discipline: 'PHYSICS',
      visual: electromagnetImg,
      summary: 'Wrap insulated copper coils around a ferromagnetic core and pass live current to generate measurable magnetic flux lines.',
      metricLabel: 'Magnetic Flux',
      metricValue: '1.45 Tesla',
      route: '/theme/shelter/hub',
    },
  ];

  return (
    <section id="experiment-showcase" className="w-full py-16 md:py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>INTERACTIVE SIMULATION SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            SCIENCE YOU CAN ACTUALLY EXPLORE
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mt-3">
            Not passive videos or flat diagrams. Every student manipulates real physical parameters in real-time 3D sandboxes.
          </p>
        </div>

        {/* 3 Experiment Previews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl border-2 border-slate-200/90 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              {/* 3D Visual Header */}
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img
                  src={exp.visual}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-white/20 shadow-sm">
                    {exp.discipline}
                  </span>
                </div>

                {/* Telemetry Metric Pill */}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-sm">
                  <span className="text-slate-400">{exp.metricLabel}:</span>
                  <span className="font-bold text-amber-300">{exp.metricValue}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    {exp.summary}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveModalSim(exp.id as any);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-800" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.success();
                      navigate(exp.route);
                    }}
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Full Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── LIVE INTERACTIVE PREVIEW MODAL ── */}
      <AnimatePresence>
        {activeModalSim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-xl w-full p-4 sm:p-8 text-left relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => {
                  sounds.pop();
                  setActiveModalSim(null);
                }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors z-10 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Volcano Modal */}
              {activeModalSim === 'volcano' && (
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 mb-2 inline-block">
                    LIVE SANDBOX • VOLCANO LAB
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 mb-2">
                    Magma Chamber Pressure Test
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 font-medium">
                    Adjust pressure slider to observe internal chamber stress. Trigger an eruption pulse when critical threshold is exceeded.
                  </p>

                  {/* Live Animated 3D Preview Frame */}
                  <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 shadow-inner">
                    <motion.img
                      src={volcanoLoadingImg}
                      alt="Volcano Lab - Loading"
                      animate={{ opacity: isEruptingSim ? 0 : 1 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <motion.img
                      src={volcanoDoneImg}
                      alt="Volcano Lab - Done"
                      animate={{ opacity: isEruptingSim ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {isEruptingSim && (
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent pointer-events-none" />
                    )}
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl text-white mb-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="text-slate-400">Internal Pressure:</span>
                      <span className="font-bold text-amber-400">{simPressure} MPa</span>
                    </div>

                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={simPressure}
                      onChange={(e) => setSimPressure(Number(e.target.value))}
                      className="w-full h-3 accent-amber-500 cursor-pointer touch-manipulation"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>20 MPa (Stable)</span>
                      <span>60 MPa (Critical)</span>
                      <span>100 MPa (Explosive)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    <button
                      onClick={() => {
                        sounds.sparkle();
                        setIsEruptingSim(true);
                        setTimeout(() => setIsEruptingSim(false), 1500);
                      }}
                      className="flex-1 min-h-[44px] py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 touch-manipulation"
                    >
                      <Activity className="w-4 h-4" />
                      <span>{isEruptingSim ? 'ERUPTION IN PROGRESS! 🌋' : 'Trigger Chamber Eruption'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.success();
                        navigate('/chapter/3/mission/4');
                      }}
                      className="min-h-[44px] py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer touch-manipulation"
                    >
                      Open Full Lab →
                    </button>
                  </div>
                </div>
              )}

              {/* Electromagnet Modal */}
              {activeModalSim === 'electromagnet' && (
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-2 inline-block">
                    LIVE SANDBOX • PHYSICS ELECTROMAGNET
                  </span>
                  <h3 className="text-2xl font-display font-black text-slate-900 mb-2">
                    Coil Induction & Magnetic Flux
                  </h3>
                  <p className="text-xs text-slate-600 mb-6 font-medium">
                    Toggle DC power and regulate coil turns. Watch how magnetic flux strength scales proportionally.
                  </p>

                  <div className="p-4 bg-slate-900 rounded-2xl text-white mb-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Power Circuit:</span>
                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsCoilPowered(!isCoilPowered);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          isCoilPowered ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isCoilPowered ? 'ON (Current Active)' : 'OFF (Open Circuit)'}
                      </button>
                    </div>

                    <div className="text-xs font-mono">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Copper Wire Turns:</span>
                        <span className="font-bold text-cyan-400">{coilTurns} Loops</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={coilTurns}
                        onChange={(e) => setCoilTurns(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Computed Flux Density:</span>
                      <span className="font-bold text-amber-300">
                        {isCoilPowered ? ((coilTurns * currentAmps * 0.004).toFixed(2)) : '0.00'} Tesla
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.success();
                      navigate('/theme/shelter/hub');
                    }}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
                  >
                    <span>Launch Full Electromagnet Workbench</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Solar System Modal */}
              {activeModalSim === 'solar' && (
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 mb-2 inline-block">
                    LIVE SANDBOX • CELESTIAL MECHANICS
                  </span>
                  <h3 className="text-2xl font-display font-black text-slate-900 mb-2">
                    Kepler Orbital Velocities
                  </h3>
                  <p className="text-xs text-slate-600 mb-6 font-medium">
                    Inner planets orbit much faster due to the Sun's deep gravitational well. Test celestial parameters in real-time.
                  </p>

                  <div className="p-4 bg-slate-900 rounded-2xl text-white mb-6 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mercury Orbit:</span>
                      <span className="text-cyan-400 font-bold">47.4 km/s (88 Earth Days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Earth Orbit:</span>
                      <span className="text-emerald-400 font-bold">29.8 km/s (365 Earth Days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Neptune Orbit:</span>
                      <span className="text-amber-400 font-bold">5.4 km/s (165 Earth Years)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.success();
                      navigate('/theme/water/hub');
                    }}
                    className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
                  >
                    <span>Explore Space Realm Portals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
