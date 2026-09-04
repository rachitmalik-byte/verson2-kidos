import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Gauge, Activity, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import volcanoLabChamberImg from '@/assets/images/landing/volcano_lab_chamber.jpg';

interface HeroVolcanoChamberProps {
  onOpenPreview?: () => void;
}

export const HeroVolcanoChamber: React.FC<HeroVolcanoChamberProps> = ({ onOpenPreview }) => {
  const navigate = useNavigate();

  // Interactive Simulation State
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(72);
  const [chamberPressure, setChamberPressure] = useState(42.5);
  const [viscosity, setViscosity] = useState<'low' | 'high'>('high');
  const [isErupting, setIsErupting] = useState(false);

  // Pip Audio Assistant State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulation heartbeat
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev >= 99 ? 15 : prev + 1;
        return next;
      });
      setChamberPressure((prev) => {
        const delta = (Math.random() - 0.48) * 1.2;
        return Number(Math.max(30, Math.min(85, prev + delta)).toFixed(1));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleSimulation = () => {
    sounds.pop();
    setIsPlaying(!isPlaying);
  };

  const triggerEruption = () => {
    sounds.sparkle();
    setIsErupting(true);
    setChamberPressure(78.4);
    setProgress(95);
    setTimeout(() => {
      setIsErupting(false);
    }, 1800);
  };

  const handlePipAudio = () => {
    if (isSpeaking) {
      voiceAssistant.stop();
      setIsSpeaking(false);
      return;
    }

    sounds.pop();
    setIsSpeaking(true);
    voiceAssistant.speak(
      "Volcanoes erupt when molten rock called magma rises through the Earth's crust! Deep underground, trapped dissolved gases expand under immense pressure. When the pressure exceeds the surrounding rock strength, magma explodes through the summit vent!",
      () => setIsSpeaking(false)
    );
  };

  return (
    <section className="w-full relative py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ── LEFT COLUMN: HERO VALUE PROPOSITION ── */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-mono font-bold tracking-wider uppercase mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>WELCOME TO POLYQUEST ACADEMY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
              REAL SCIENCE.<br />
              REAL EXPERIMENTS.<br />
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                REAL LEARNING.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mb-8">
              Explore interactive 3D experiments, understand how things work, and learn science by doing.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => {
                  sounds.success();
                  navigate('/subjects');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
              >
                <span>Start Science Adventure</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  if (onOpenPreview) {
                    onOpenPreview();
                  } else {
                    const el = document.getElementById('experiment-showcase');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 active:scale-98 text-slate-800 border-2 border-slate-200/90 font-bold text-base shadow-sm hover:border-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Free Live Preview</span>
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 w-full flex items-center gap-6 text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live 3D Physics
              </span>
              <span>•</span>
              <span>Curriculum Aligned</span>
              <span>•</span>
              <span>Ages 9–14</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: HERO 3D EXPERIMENT CHAMBER ── */}
          <div className="lg:col-span-6 relative w-full flex justify-center">
            
            {/* Visual Frame Container */}
            <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/50 border-2 border-slate-200/90 shadow-2xl p-2 sm:p-3 group">
              
              {/* Soft Ambient Light Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-emerald-500/10 rounded-3xl blur-2xl pointer-events-none" />

              {/* 3D Exhibit Artwork */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <img
                  src={volcanoLabChamberImg}
                  alt="PolyQuest 3D Interactive Volcano Laboratory Chamber with Pip"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isErupting ? 'scale-105 filter brightness-110' : 'group-hover:scale-102'
                  }`}
                />

                {/* Subtle volcanic glow flash overlay on eruption */}
                {isErupting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-gradient-to-t from-orange-600/50 via-amber-500/20 to-transparent pointer-events-none"
                  />
                )}

                {/* ── RESTAINED INTERACTIVE UI OVERLAY (Top-Left) ── */}
                <div className="absolute top-3.5 left-3.5 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3.5 shadow-xl max-w-[220px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                      VOLCANO EXPERIMENT
                    </span>
                    <button
                      onClick={toggleSimulation}
                      title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                    </button>
                  </div>

                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>{isPlaying ? 'Simulation running' : 'Simulation paused'}</span>
                    <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
                  </div>

                  {/* Telemetry Progress Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Micro Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Pressure</span>
                      <span className="font-mono font-bold text-amber-300">{chamberPressure} MPa</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Viscosity</span>
                      <button
                        onClick={() => {
                          sounds.pop();
                          setViscosity(viscosity === 'high' ? 'low' : 'high');
                        }}
                        className="font-mono font-bold text-cyan-300 hover:underline cursor-pointer"
                      >
                        {viscosity.toUpperCase()} ↺
                      </button>
                    </div>
                  </div>
                </div>

                {/* Eruption Pulse Button (Bottom-Left) */}
                <div className="absolute bottom-3.5 left-3.5">
                  <button
                    onClick={triggerEruption}
                    disabled={isErupting}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500/90 hover:bg-orange-500 text-white font-mono font-bold text-xs backdrop-blur-md border border-orange-300/40 shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-200" />
                    <span>{isErupting ? 'VENT PRESSURE RELEASE...' : 'Trigger Eruption Pulse ▶'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── AI SCIENCE ASSISTANT: PIP'S SCIENCE CORNER ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 right-2 sm:right-6 bg-white/95 backdrop-blur-md border-2 border-slate-200 shadow-xl rounded-2xl p-3 sm:p-4 max-w-xs text-left z-20 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-purple-700">
                    PIP'S SCIENCE CORNER
                  </span>
                  <button
                    onClick={handlePipAudio}
                    title={isSpeaking ? 'Stop Audio' : 'Listen to Explanation'}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-purple-100 text-purple-700'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  "Want to know why volcanoes erupt?"
                </p>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">
                  {isSpeaking ? 'Speaking explanation...' : 'Tap speaker to hear Pip explain'}
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
