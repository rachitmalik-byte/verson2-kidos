import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InteractiveDiagramData, DiagramHotspot } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Waves,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Flame,
  Snowflake,
  Wind,
  Compass,
} from 'lucide-react';

interface Props {
  data: InteractiveDiagramData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const InteractiveDiagramEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(data.hotspots[0]?.id || null);
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([data.hotspots[0]?.id].filter(Boolean));
  
  // Interactive Simulation Controls
  const [sunHeatLevel, setSunHeatLevel] = useState<'normal' | 'super_hot'>('normal');
  const [cloudDensity, setCloudDensity] = useState<'fluffy' | 'dense_storm'>('fluffy');
  const [isRaining, setIsRaining] = useState(false);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  const selectedHotspot = data.hotspots.find((h) => h.id === selectedHotspotId) || data.hotspots[0];
  const isAllVisited = visitedHotspots.length === data.hotspots.length;

  const handleSelectHotspot = (hotspot: DiagramHotspot) => {
    sounds.pop();
    setSelectedHotspotId(hotspot.id);
    if (!visitedHotspots.includes(hotspot.id)) {
      const nextVisited = [...visitedHotspots, hotspot.id];
      setVisitedHotspots(nextVisited);
      if (nextVisited.length === data.hotspots.length) {
        sounds.fanfare();
        onComplete();
      }
    }

    // Dynamic reaction based on stage
    if (hotspot.stageNumber === 1) { // Evaporation
      setSunHeatLevel('super_hot');
      setIsRaining(false);
    } else if (hotspot.stageNumber === 2) { // Condensation
      setCloudDensity('dense_storm');
      setIsRaining(false);
    } else if (hotspot.stageNumber === 3) { // Precipitation
      setCloudDensity('dense_storm');
      setIsRaining(true);
      sounds.splash();
    } else if (hotspot.stageNumber === 4) { // Collection
      setIsRaining(false);
      setSunHeatLevel('normal');
    }

    voiceAssistant.speak(`${hotspot.title}! ${hotspot.explanation}`);
  };

  const handleToggleRain = () => {
    sounds.splash();
    setIsRaining((prev) => !prev);
    if (!isRaining) {
      setCloudDensity('dense_storm');
      voiceAssistant.speak('Precipitation started! Water droplets are falling from heavy clouds!');
    }
  };

  const handleToggleSunHeat = () => {
    sounds.pop();
    setSunHeatLevel((prev) => (prev === 'normal' ? 'super_hot' : 'normal'));
    if (sunHeatLevel === 'normal') {
      voiceAssistant.speak('Sun is blazing hot! Solar energy is rapidly evaporating water into rising steam vapor!');
    }
  };

  const handleAutoTour = async () => {
    if (isAutoTouring) return;
    setIsAutoTouring(true);
    sounds.success();

    for (let i = 0; i < data.hotspots.length; i++) {
      const h = data.hotspots[i];
      handleSelectHotspot(h);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    setIsAutoTouring(false);
  };

  const handleReset = () => {
    sounds.pop();
    setSelectedHotspotId(data.hotspots[0]?.id || null);
    setVisitedHotspots([data.hotspots[0]?.id].filter(Boolean));
    setSunHeatLevel('normal');
    setCloudDensity('fluffy');
    setIsRaining(false);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-3xl border-4 border-sky-400 shadow-2xl flex flex-col items-center mx-auto">
      {/* ── Header Bar ── */}
      <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-100 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          Interactive 2D Science Simulator
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Stages Explored: {visitedHotspots.length} of {data.hotspots.length}
          </span>
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {data.diagramTitle || data.title} 🌊☀️☁️
      </h3>
      <p className="text-xs sm:text-sm font-bold text-slate-600 text-center mb-5 max-w-xl">
        {data.learningObjective || 'Tap any stage in the animated diagram below or use the weather controls to see how Earth recycles water!'}
      </p>

      {/* ══════════════════════════════════════════════════════════════════════
          2D ANIMATED VECTOR SCIENCE CANVAS (Water Cycle & Physics Simulation)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full h-[320px] sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border-3 border-sky-300 relative shadow-inner bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 select-none">
        {/* Background Clouds floating */}
        <motion.div
          animate={{ x: [-20, 30, -20] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-1/4 opacity-40 pointer-events-none"
        >
          <div className="w-24 h-10 bg-white rounded-full blur-xs" />
        </motion.div>

        {/* ── 1. ANIMATED CARTOON SUN (Top Left) ── */}
        <div className="absolute top-4 left-6 z-10 flex flex-col items-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: sunHeatLevel === 'super_hot' ? [1.1, 1.25, 1.1] : [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center relative cursor-pointer ${
              sunHeatLevel === 'super_hot'
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_40px_rgba(249,115,22,0.8)]'
                : 'bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
            }`}
            onClick={handleToggleSunHeat}
            title="Click to Heat Up Sun!"
          >
            {/* Spinning Sun Rays */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-300/60 animate-spin" />
            {/* Cute Sun Face */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full" />
                <div className="w-2 h-2 bg-slate-900 rounded-full" />
              </div>
              <div className="w-3.5 h-1.5 border-b-2 border-slate-900 rounded-full mt-1" />
            </div>
          </motion.div>

          <span className="text-[10px] font-black text-amber-950 bg-amber-200/90 px-2 py-0.5 rounded-full mt-1 shadow-xs">
            {sunHeatLevel === 'super_hot' ? '🔥 Super Solar Heat' : '☀️ Solar Energy'}
          </span>
        </div>

        {/* Solar Radiation Heat Waves towards ocean */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-24 left-24 pointer-events-none text-amber-500 font-black text-sm rotate-45"
        >
          <span>⚡ ⚡ ⚡</span>
        </motion.div>

        {/* ── 2. ANIMATED CLOUDS & CONDENSATION (Top Right) ── */}
        <div className="absolute top-6 right-8 sm:right-16 z-10 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={`px-3 py-1.5 sm:px-5 sm:py-3 rounded-full flex items-center gap-1.5 sm:gap-2 border-2 shadow-lg transition-all duration-500 cursor-pointer ${
              cloudDensity === 'dense_storm'
                ? 'bg-slate-700 border-slate-800 text-white shadow-[0_10px_25px_rgba(51,65,85,0.5)]'
                : 'bg-white/95 border-sky-200 text-slate-700 shadow-md'
            }`}
            onClick={handleToggleRain}
            title="Click to trigger Precipitation!"
          >
            {isRaining ? (
              <CloudRain className="w-5 h-5 sm:w-8 sm:h-8 text-sky-300 animate-bounce" />
            ) : (
              <Cloud className="w-5 h-5 sm:w-8 sm:h-8 text-sky-400 fill-sky-100" />
            )}
            <div className="text-left">
              <span className="font-black text-xs block leading-tight">
                {cloudDensity === 'dense_storm' ? 'Dense Storm Cloud' : 'Condensation Cloud'}
              </span>
              <span className="text-[9px] font-bold opacity-80">
                {isRaining ? 'Precipitation Active 🌧️' : 'Water Droplets Clumping ☁️'}
              </span>
            </div>
          </motion.div>

          {/* ── 3. PRECIPITATION RAIN PARTICLES ── */}
          {isRaining && (
            <div className="flex gap-3 mt-2 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 140], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'linear',
                  }}
                  className="w-1.5 h-5 bg-sky-500 rounded-full shadow-xs"
                />
              ))}
            </div>
          )}
        </div>

        {/* ── 4. RISING EVAPORATION STEAM VAPOR PARTICLES (Center Left) ── */}
        <div className="absolute bottom-20 left-16 sm:left-24 z-10 flex gap-4 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -110],
                x: [0, i % 2 === 0 ? 12 : -12],
                opacity: [0, 0.9, 0],
                scale: [0.8, 1.4],
              }}
              transition={{
                duration: sunHeatLevel === 'super_hot' ? 1.2 : 2.2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
              className="flex flex-col items-center text-sky-600 font-black text-xs"
            >
              <span>💨</span>
              <span className="text-[9px] bg-sky-100/80 px-1 rounded text-sky-900 font-extrabold">Vapor</span>
            </motion.div>
          ))}
        </div>

        {/* ── 5. MOUNTAIN & RUNOFF STREAM (Center Right) ── */}
        <div className="absolute bottom-12 right-0 w-1/2 h-44 pointer-events-none">
          {/* Mountain Shape */}
          <svg className="w-full h-full" viewBox="0 0 300 150" fill="none">
            <polygon points="120,0 280,150 40,150" fill="#10B981" />
            <polygon points="120,0 160,40 80,40" fill="#E2E8F0" />
            {/* Runoff River */}
            <path
              d="M 120 40 Q 140 90 60 150"
              stroke="#0284C7"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
          </svg>
        </div>

        {/* ── 6. ANIMATED OCEAN & COLLECTION WAVES (Bottom) ── */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-sky-700 via-sky-600 to-sky-500 z-10 flex flex-col justify-end p-3 overflow-hidden">
          {/* Wave Ripple Animation */}
          <motion.div
            animate={{ x: [-40, 0, -40] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1 inset-x-0 flex justify-around text-sky-200 text-lg opacity-60 pointer-events-none"
          >
            <span>≈ ≈ ≈ ≈</span>
            <span>≈ ≈ ≈ ≈</span>
            <span>≈ ≈ ≈ ≈</span>
          </motion.div>

          <div className="flex items-center justify-between text-white z-10 px-3">
            <div className="flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-sky-200" />
              <span className="font-black text-xs">Ocean & Reservoir Collection</span>
            </div>
            <span className="text-[10px] font-extrabold bg-sky-800/80 px-2.5 py-0.5 rounded-full">
              97% Earth's Water 🌊
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            INTERACTIVE HOTSPOT BUTTONS (Overlaid at Key Coordinates)
        ══════════════════════════════════════════════════════════════════ */}
        {data.hotspots.map((hotspot) => {
          const isSelected = selectedHotspotId === hotspot.id;
          const isVisited = visitedHotspots.includes(hotspot.id);

          return (
            <motion.button
              key={hotspot.id}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectHotspot(hotspot)}
              style={{
                left: `${hotspot.xPercent}%`,
                top: `${hotspot.yPercent}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-xl cursor-pointer border-2 transition-all ${
                isSelected
                  ? 'bg-amber-400 border-amber-600 text-slate-950 ring-4 ring-amber-300 scale-110'
                  : isVisited
                  ? 'bg-white/95 border-emerald-400 text-emerald-950 shadow-md'
                  : 'bg-white/90 border-slate-300 text-slate-800 hover:bg-white animate-pulse'
              }`}
            >
              <span className="text-base">{hotspot.icon}</span>
              <span className="truncate">{hotspot.stageNumber}. {hotspot.name}</span>
              {isVisited && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </motion.button>
          );
        })}
      </div>

      {/* ── Interactive Weather Simulation Controls Bar ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center my-4">
        <button
          onClick={handleToggleSunHeat}
          className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all ${
            sunHeatLevel === 'super_hot'
              ? 'bg-amber-500 text-white ring-2 ring-amber-300'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{sunHeatLevel === 'super_hot' ? 'Sun: 🔥 Super Blazing' : 'Sun: ☀️ Heat Up'}</span>
        </button>

        <button
          onClick={handleToggleRain}
          className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all ${
            isRaining
              ? 'bg-sky-600 text-white ring-2 ring-sky-300'
              : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>{isRaining ? 'Rain: 🌧️ Storming' : 'Rain: 🌧️ Trigger Downpour'}</span>
        </button>

        <button
          onClick={handleAutoTour}
          disabled={isAutoTouring}
          className="px-4 py-2 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-purple-900" />
          <span>{isAutoTouring ? 'Touring Cycle...' : 'Auto-Tour Cycle 🚀'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer shadow-xs active:scale-95"
          title="Reset Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Dynamic Stage Explanation & Socratic Feedback ── */}
      {selectedHotspot && (
        <motion.div
          key={selectedHotspot.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-sm mb-4"
        >
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-sky-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {selectedHotspot.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200 text-sky-900 px-2 py-0.5 rounded">
                Stage {selectedHotspot.stageNumber} of {data.hotspots.length}
              </span>
              <h4 className="font-black text-base text-slate-900 truncate">
                {selectedHotspot.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {selectedHotspot.explanation}
            </p>
            {selectedHotspot.funFact && (
              <span className="text-[11px] font-extrabold text-indigo-900 bg-indigo-100/80 px-2.5 py-0.5 rounded-full inline-block mt-2">
                💡 {selectedHotspot.funFact}
              </span>
            )}
          </div>

          <button
            onClick={() => voiceAssistant.speak(selectedHotspot.explanation)}
            className="p-2.5 rounded-xl bg-white border border-sky-300 text-sky-700 hover:bg-sky-50 cursor-pointer shadow-xs shrink-0"
            title="Listen to Explanation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ── Completion CTA ── */}
      {isAllVisited && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={onComplete}
          className="py-3.5 px-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm rounded-2xl shadow-xl cursor-pointer flex items-center gap-2 animate-pulse active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Complete Water Cycle Investigation ➔</span>
        </motion.button>
      )}
    </div>
  );
};
