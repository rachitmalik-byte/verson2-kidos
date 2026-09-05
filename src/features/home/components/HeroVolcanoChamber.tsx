import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Activity, Sparkles, Flame, RotateCcw } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import volcanoLoadingImg from '@/assets/images/landing/volcano_lab_loading.jpg';
import volcanoDoneImg from '@/assets/images/landing/volcano_lab_done.jpg';

interface HeroVolcanoChamberProps {
  onOpenPreview?: () => void;
}

export const HeroVolcanoChamber: React.FC<HeroVolcanoChamberProps> = ({ onOpenPreview }) => {
  const navigate = useNavigate();

  // Interactive Simulation State
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(64);
  const [chamberPressure, setChamberPressure] = useState(48.2);
  const [viscosity, setViscosity] = useState<'low' | 'high'>('high');
  const [isErupting, setIsErupting] = useState(false);

  // Pip Audio Assistant State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulation heartbeat: advances progress and triggers eruption when reaching 100%
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (isErupting) {
          return prev;
        }

        if (prev >= 98) {
          sounds.sparkle();
          setIsErupting(true);
          setChamberPressure(86.4);
          
          setTimeout(() => {
            setIsErupting(false);
            setChamberPressure(38.5);
            setProgress(18);
          }, 4500);

          return 100;
        }

        const next = prev + 2;
        const calculatedPressure = Number((34 + (next / 100) * 38 + (Math.random() - 0.5) * 2).toFixed(1));
        setChamberPressure(calculatedPressure);
        return next;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [isPlaying, isErupting]);

  const toggleSimulation = () => {
    sounds.pop();
    setIsPlaying(!isPlaying);
  };

  const triggerEruption = () => {
    if (isErupting) {
      sounds.pop();
      setIsErupting(false);
      setProgress(25);
      setChamberPressure(41.0);
      return;
    }

    sounds.sparkle();
    setIsErupting(true);
    setChamberPressure(88.7);
    setProgress(100);

    setTimeout(() => {
      setIsErupting(false);
      setChamberPressure(39.2);
      setProgress(20);
    }, 5000);
  };

  const handlePipAudio = () => {
    if (isSpeaking) {
      voiceAssistant.stop();
      setIsSpeaking(false);
      return;
    }

    sounds.pop();
    setIsSpeaking(true);

    const speechText = isErupting
      ? "KABOOM! Pressure exceeded rock strength! Magma violently blasts through the summit vent creating a glowing pyroclastic fountain, safely contained in our laboratory vacuum chamber!"
      : "Volcanoes erupt when molten rock called magma rises through the Earth's crust! Trapped dissolved gases expand under immense pressure until it breaches the summit vent. Tap Trigger Eruption Pulse to test it!";

    voiceAssistant.speak(speechText, () => setIsSpeaking(false));
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
            
            {/* Visual Frame Container with camera rumble on eruption */}
            <motion.div
              animate={isErupting ? { x: [-1.5, 1.5, -1, 1, 0], y: [-1, 1, -1.5, 0.5, 0] } : { x: 0, y: 0 }}
              transition={{ repeat: isErupting ? 3 : 0, duration: 0.35 }}
              className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/50 border-2 border-slate-200/90 shadow-2xl p-2 sm:p-3 group"
            >
              
              {/* Soft Ambient Light Halo */}
              <div
                className={`absolute -inset-1 rounded-3xl blur-2xl pointer-events-none transition-all duration-700 ${
                  isErupting
                    ? 'bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-red-500/20'
                    : 'bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-emerald-500/10'
                }`}
              />

              {/* 3D Exhibit Artwork Container */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                
                {/* ── LAYER 1: EXPERIMENT LOADING / HEATING STATE ── */}
                <motion.img
                  src={volcanoLoadingImg}
                  alt="PolyQuest 3D Interactive Volcano Laboratory Chamber - Experiment Loading"
                  initial={false}
                  animate={{
                    opacity: isErupting ? 0 : 1,
                    scale: isErupting ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* ── LAYER 2: EXPERIMENT DONE / ERUPTION COMPLETE STATE ── */}
                <motion.img
                  src={volcanoDoneImg}
                  alt="PolyQuest 3D Interactive Volcano Laboratory Chamber - Experiment Done & Erupted"
                  initial={false}
                  animate={{
                    opacity: isErupting ? 1 : 0,
                    scale: isErupting ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* ── DYNAMIC VOLCANIC GLOW FLASH ON ERUPTION ── */}
                {isErupting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.45, 0.15] }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent pointer-events-none mix-blend-screen"
                  />
                )}

                {/* ── UNIFIED RESPONSIVE HUD TOP BAR (Never collides on Android or small screens) ── */}
                <div className="absolute top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-3.5 z-20 flex flex-col gap-1.5 pointer-events-none">
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    {/* Status Pill & Simulation Toggle */}
                    <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-white/20 text-white rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1.5 sm:gap-2 shadow-lg">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isErupting ? 'bg-orange-400 animate-ping' : isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                      <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-amber-300 truncate">
                        {isErupting ? 'ERUPTION ACTIVE' : 'VOLCANO SIM'}
                      </span>
                      <button
                        onClick={toggleSimulation}
                        title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
                        className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors shrink-0"
                      >
                        {isPlaying ? <Pause className="w-2.5 h-2.5 fill-white" /> : <Play className="w-2.5 h-2.5 fill-white ml-0.5" />}
                      </button>
                    </div>

                    {/* State Switcher Pills (Frame 1 vs Frame 2) */}
                    <div className="pointer-events-auto flex items-center gap-0.5 bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-full p-0.5 sm:p-1 shadow-lg shrink-0">
                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsErupting(false);
                        }}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          !isErupting
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        1. Loading
                      </button>
                      <button
                        onClick={() => {
                          sounds.sparkle();
                          setIsErupting(true);
                          setChamberPressure(88.4);
                          setProgress(100);
                        }}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          isErupting
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        2. Done
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Micro Dashboard (Compact & clean) */}
                  <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md border border-white/15 text-white rounded-xl p-2 shadow-md w-fit max-w-[210px] sm:max-w-[240px]">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold text-slate-300">
                      <span className="truncate">{isErupting ? 'Peak Vent Release' : 'Ascent Pressure'}</span>
                      <span className={`font-mono font-black ${isErupting ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {isErupting ? '88.4 MPa' : `${chamberPressure} MPa`}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isErupting
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 w-full'
                            : 'bg-gradient-to-r from-emerald-400 to-amber-400'
                        }`}
                        style={{ width: isErupting ? '100%' : `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Eruption Pulse Button (Bottom: Responsive Thumb Button) */}
                <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-auto z-20">
                  <button
                    onClick={triggerEruption}
                    className={`w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl font-mono font-bold text-xs backdrop-blur-md border shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all touch-manipulation ${
                      isErupting
                        ? 'bg-amber-600/95 hover:bg-amber-600 text-white border-amber-300/60 shadow-orange-500/30'
                        : 'bg-orange-500/90 hover:bg-orange-500 text-white border-orange-300/40 shadow-lg'
                    }`}
                  >
                    {isErupting ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                        <span>↺ COOL DOWN CHAMBER</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
                        <span>TRIGGER ERUPTION PULSE ▶</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── AI SCIENCE ASSISTANT: PIP'S SCIENCE CORNER (Clean below chamber on mobile, floating on desktop) ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-4 md:right-6 w-full sm:max-w-xs bg-white/95 backdrop-blur-md border-2 shadow-xl rounded-2xl p-3 sm:p-4 text-left z-20 flex items-start gap-3 transition-colors ${
                isErupting ? 'border-orange-300 shadow-orange-500/10' : 'border-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isErupting
                    ? 'bg-orange-100 border border-orange-300 text-orange-600'
                    : 'bg-purple-50 border border-purple-200 text-purple-600'
                }`}
              >
                {isErupting ? (
                  <Flame className="w-5 h-5 text-orange-600 animate-bounce" />
                ) : (
                  <Sparkles className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-[10px] font-mono font-black uppercase tracking-wider truncate ${
                      isErupting ? 'text-orange-600' : 'text-purple-700'
                    }`}
                  >
                    {isErupting ? "PIP • ERUPTION SUCCESS!" : "PIP'S SCIENCE CORNER"}
                  </span>
                  <button
                    onClick={handlePipAudio}
                    title={isSpeaking ? 'Stop Audio' : 'Listen to Explanation'}
                    className={`min-w-[32px] min-h-[32px] w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer touch-manipulation ${
                      isSpeaking
                        ? isErupting
                          ? 'bg-orange-600 text-white animate-pulse'
                          : 'bg-purple-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-purple-100 text-slate-700'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  {isErupting
                    ? '"KABOOM! Trapped gas breached the summit vent!"'
                    : '"Want to know why volcanoes erupt?"'}
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
