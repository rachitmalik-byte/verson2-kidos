import { ThreeVelcroLab } from '@/components/three-lab/ThreeVelcroLab';
import { ThreeDigestionLab } from '@/components/three-lab/ThreeDigestionLab';
import { ThreeDandelionSim } from '@/components/three-lab/ThreeDandelionSim';
import { ThreeCoconutSim } from '@/components/three-lab/ThreeCoconutSim';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  Eye,
  Volume2,
  Wind,
  Droplets,
  ZoomIn,
  Shield,
  Layers,
  Flame,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

// Real Studio Macro Educational Photography
import eagleViewLandscapeImg from '@/assets/images/theme1/eagle_view_landscape.jpg';
import eagleViewMouseImg from '@/assets/images/theme1/eagle_view_mouse.jpg';

import {
  VectorIndianCobra,
  VectorCommonKrait,
  VectorRussellsViper,
  VectorSawScaledViper,
  VectorTongueTasteMapGraphic,
  VectorVelcroMicroscopeGraphic,
} from '@/components/illustrations/Theme1Illustrations';

/* ============================================================================
   1. 🐜 ANIMATED ANT TRAIL & PHEROMONE BARRIER SIMULATOR (CHAPTER 1)
   ============================================================================ */
export const AntTrailPheromoneSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [hasBarrier, setHasBarrier] = useState(false);
  const [barrierType, setBarrierType] = useState<'pencil' | 'water'>('pencil');
  const [viewState, setViewState] = useState<'before' | 'after'>('before');
  const [isAntsRouting, setIsAntsRouting] = useState(false);

  const handlePlaceBarrier = (type: 'pencil' | 'water') => {
    sounds.pop();
    setBarrierType(type);
    setHasBarrier(true);
    setViewState('after');
    setIsAntsRouting(true);

    voiceAssistant.speak(
      'Barrier placed! Watch the ants stop at the barrier, wave their sensitive antennae to smell the air, and walk around to pick up the invisible chemical scent line on the other side!'
    );

    setTimeout(() => {
      sounds.success();
      setIsAntsRouting(false);
      if (onCompleted) onCompleted();
    }, 1500);
  };

  const handleClearBarrier = () => {
    sounds.pop();
    setHasBarrier(false);
    setViewState('before');
    setIsAntsRouting(false);
    voiceAssistant.speak('Barrier removed! The ants resume their neat, straight pheromone superhighway!');
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 via-white to-emerald-50 p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center relative overflow-hidden">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-slate-200 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
            🐜 Live Ant Colony Chemical Radar Simulation
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full shadow-xs ${
            hasBarrier
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {hasBarrier ? '⚠️ SCENT TRAIL OBSTRUCTED (ANTENNAE ROUTING)' : '⚡ INVISIBLE CHEMICAL LINE (DIRECT)'}
        </span>
      </div>

      {/* ── BEFORE & AFTER TOGGLE BAR ── */}
      <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={handleClearBarrier}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            viewState === 'before'
              ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Before: Straight Chemical Trail ⚡
        </button>

        <button
          onClick={() => handlePlaceBarrier(barrierType)}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            viewState === 'after'
              ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. After: Barrier Placed & Detour ✏️
        </button>
      </div>

      {/* ── THE INTERACTIVE ANT COLONY SANDBOX ── */}
      <div className="relative w-full h-72 rounded-3xl border-3 border-amber-300 shadow-inner flex items-center justify-between px-6 sm:px-10 overflow-hidden my-2 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100">
        {/* Fine Sand Texture Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

        {/* Ant Nest (Left) */}
        <div className="flex flex-col items-center z-10">
          <div className="w-18 h-18 rounded-full bg-gradient-to-b from-amber-950 to-amber-800 border-4 border-amber-600 shadow-xl flex items-center justify-center text-3xl">
            🕳️
          </div>
          <span className="text-xs font-black text-amber-950 mt-1 uppercase">Ant Colony Nest</span>
        </div>

        {/* Glowing Chemical Scent Line (Dynamic SVG Path) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="scentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Straight Path or Detour Arc Path */}
          {hasBarrier ? (
            <path
              d="M 90 144 L 200 144 Q 270 40 340 144 L 480 144"
              fill="none"
              stroke="url(#scentGlow)"
              strokeWidth="6"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
          ) : (
            <line
              x1="90"
              y1="144"
              x2="480"
              y2="144"
              stroke="url(#scentGlow)"
              strokeWidth="6"
              strokeDasharray="8,4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Dynamic Animated Marching Ants */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-around px-24">
          {[0, 1, 2, 3, 4].map((idx) => (
            <motion.div
              key={idx}
              animate={
                hasBarrier
                  ? {
                      y: [0, -55, -55, 0],
                      x: [0, 10, -10, 0],
                      rotate: [0, -25, 25, 0],
                    }
                  : {
                      x: [0, 12, 0],
                      y: [0, -2, 2, 0],
                      rotate: 0,
                    }
              }
              transition={{
                repeat: Infinity,
                duration: hasBarrier ? 1.4 + idx * 0.15 : 0.8 + idx * 0.1,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl select-none filter drop-shadow-md">🐜</div>
              {hasBarrier && isAntsRouting && (
                <span className="text-[9px] font-black text-amber-800 bg-white/90 px-1 rounded-full shadow-xs">
                  ?
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* The Physical Barrier Dropped in the Middle */}
        <AnimatePresence>
          {hasBarrier && (
            <motion.div
              initial={{ scale: 0, y: -80, rotate: -20 }}
              animate={{ scale: 1, y: 0, rotate: 12 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            >
              {barrierType === 'pencil' ? (
                <div className="w-10 h-44 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 border-3 border-slate-900 rounded-lg shadow-2xl flex flex-col items-center justify-between py-2 text-slate-950">
                  <span className="text-[10px] font-black uppercase tracking-wider rotate-90 my-auto">
                    ✏️ PENCIL
                  </span>
                  <div className="w-4 h-6 bg-pink-400 rounded-b-sm border-t border-slate-700" />
                </div>
              ) : (
                <div className="w-36 h-24 bg-sky-400/85 backdrop-blur-sm rounded-full border-3 border-white shadow-2xl flex items-center justify-center text-xs font-black text-white">
                  💧 WATER PUDDLE
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Food Sugar Cube Pile (Right) */}
        <div className="flex flex-col items-center z-10">
          <div className="w-18 h-18 rounded-2xl bg-white border-4 border-amber-300 shadow-xl flex items-center justify-center text-3xl">
            🍬
          </div>
          <span className="text-xs font-black text-amber-950 mt-1 uppercase">Sugar Crystals</span>
        </div>
      </div>

      {/* Interactive Barrier Placement Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
        <button
          onClick={() => handlePlaceBarrier('pencil')}
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm border-2 border-amber-600 shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <span>✏️ Place Wooden Pencil Across Trail</span>
        </button>

        <button
          onClick={() => handlePlaceBarrier('water')}
          className="px-6 py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-white font-black text-xs sm:text-sm border-2 border-sky-600 shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <span>💧 Drop Water Puddle Barrier</span>
        </button>

        {hasBarrier && (
          <button
            onClick={handleClearBarrier}
            className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-300 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Barrier</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   2. 🦅 EAGLE 4X TELESCOPIC ZOOM SIMULATOR (CHAPTER 1)
   ============================================================================ */
export const EagleZoomVisionSim: React.FC<{ onZoomTested?: () => void }> = ({ onZoomTested }) => {
  const [zoomMode, setZoomMode] = useState<'human' | 'eagle'>('human');

  const handleToggleZoom = (mode: 'human' | 'eagle') => {
    sounds.pop();
    setZoomMode(mode);
    if (mode === 'eagle') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Eagle 4x Retina Zoom activated! An eagle has 4 times more sensory cells (fovea cones) in its eyes than humans, allowing it to spot a tiny field mouse from 2 kilometers high!'
      );
      if (onZoomTested) onZoomTested();
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center text-white relative overflow-hidden">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black uppercase text-amber-300">
            Altitude: 2,000 Meters (2 km) Sky View
          </span>
        </div>
        <span className="text-xs font-black px-3.5 py-1 rounded-full bg-amber-400 text-slate-950">
          {zoomMode === 'eagle' ? '🦅 EAGLE 4x RETINA TELESCOPIC SIGHT' : '👁️ NORMAL HUMAN 1x VISION'}
        </span>
      </div>

      {/* The Dynamic Real-Photo Viewport */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden border-3 border-slate-700 flex items-center justify-center bg-slate-900 shadow-2xl">
        <AnimatePresence mode="wait">
          {zoomMode === 'human' ? (
            <motion.div
              key="human-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <img
                src={eagleViewLandscapeImg}
                alt="2km High Altitude Landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-xs font-bold text-amber-200">
                👁️ Human Eye View: Vast landscape, but tiny animals on the ground are completely invisible!
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="eagle-view"
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <img
                src={eagleViewMouseImg}
                alt="Zoomed-in Telephoto Field Mouse in Grass"
                className="w-full h-full object-cover"
              />
              {/* Tactical Crosshair Scope HUD */}
              <div className="absolute inset-0 pointer-events-none border-4 border-amber-400/50 rounded-3xl flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-amber-400/80 animate-pulse" />
                <div className="w-full h-[1px] bg-amber-400/40 absolute" />
                <div className="h-full w-[1px] bg-amber-400/40 absolute" />
              </div>
              <div className="absolute bottom-4 left-4 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400 text-xs font-black text-amber-200 shadow-xl">
                🎯 4x Eagle Vision Locked: Tiny field mouse spotted in tall grass 2 km away!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Switcher Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-5">
        <button
          onClick={() => handleToggleZoom('human')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            zoomMode === 'human'
              ? 'bg-slate-800 border-slate-500 text-white shadow-md ring-2 ring-slate-400'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          👁️ 1. Human Eye View (1x Wide Landscape)
        </button>

        <button
          onClick={() => handleToggleZoom('eagle')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            zoomMode === 'eagle'
              ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-xl ring-4 ring-amber-400/40 scale-102'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          🦅 2. Eagle Super Eye (4x Telescopic Zoom)
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   3. 🐍 SNAKE GROUND VIBRATION & 4 POISONOUS FANGS MATRIX (CHAPTER 2)
   ============================================================================ */
export const SnakeGroundVibrationSim: React.FC<{ onTested?: () => void }> = ({ onTested }) => {
  const [activeStimulus, setActiveStimulus] = useState<'footsteps' | 'flute_music' | null>(null);
  const [selectedSnakeId, setSelectedSnakeId] = useState<string>('cobra');

  const SNAKES = [
    { id: 'cobra', name: 'Spectacled Cobra (Nag)', venomous: true, feature: 'Hood with spectacle mark, neurotoxic venom', component: <VectorIndianCobra /> },
    { id: 'krait', name: 'Common Krait', venomous: true, feature: 'Steel-black with thin white crossbands, nocturnal', component: <VectorCommonKrait /> },
    { id: 'russell', name: 'Russell’s Viper (Duboia)', venomous: true, feature: 'Loud hissing sound, chain-like diamond spots', component: <VectorRussellsViper /> },
    { id: 'saw-scaled', name: 'Saw-scaled Viper (Afai)', venomous: true, feature: 'Serrated keel scales, makes sawing sound', component: <VectorSawScaledViper /> },
  ];

  const handleStimulus = (type: 'footsteps' | 'flute_music') => {
    sounds.pop();
    setActiveStimulus(type);

    if (type === 'footsteps') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Footstep compression waves shake the soil! The snake feels vibrations through its lower jaw resting on the ground and alerts immediately!'
      );
      if (onTested) onTested();
    } else {
      sounds.boing();
      voiceAssistant.speak(
        'Snakes have NO external ears! Airborne flute sound cannot be heard by the snake. It only sways by tracking the moving flute pipe visually!'
      );
    }
  };

  const activeSnake = SNAKES.find((s) => s.id === selectedSnakeId) || SNAKES[0];

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-2xl flex flex-col items-center text-white relative overflow-hidden">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black uppercase text-emerald-300">
            Acoustic Ground Vibration Oscilloscope
          </span>
        </div>
        <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-400 text-slate-950">
          {activeStimulus === 'footsteps' ? '⚡ GROUND VIBRATIONS DETECTED (JAWBONE)' : activeStimulus === 'flute_music' ? '❌ AIRBORNE MUSIC INAUDIBLE (NO EARS)' : 'STANDBY (SELECT STIMULUS)'}
        </span>
      </div>

      {/* Snake Stage */}
      <div className="relative w-full h-64 rounded-3xl overflow-hidden border-3 border-slate-700 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-950/60 shadow-inner">
        <div className="flex items-center justify-center my-auto">
          {activeSnake.component}
        </div>

        {/* Animated Ground Waves */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full h-7 bg-slate-900 rounded-full border border-slate-700 relative overflow-hidden flex items-center">
            {activeStimulus === 'footsteps' && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                className="w-32 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#34d399]"
              />
            )}
            {activeStimulus === 'flute_music' && (
              <span className="text-[10px] font-bold text-slate-500 mx-auto">
                No Ground Waves (Snakes have no external ear canals)
              </span>
            )}
          </div>
          <span className="text-[10px] font-black text-slate-400 mt-1 uppercase">
            Soil Substrate Vibration Waveform
          </span>
        </div>
      </div>

      {/* Stimulus Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md my-4">
        <button
          onClick={() => handleStimulus('footsteps')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            activeStimulus === 'footsteps'
              ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-xl ring-2 ring-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          🦶 1. Heavy Footsteps on Soil (Ground Waves)
        </button>

        <button
          onClick={() => handleStimulus('flute_music')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            activeStimulus === 'flute_music'
              ? 'bg-rose-400 border-rose-300 text-slate-950 shadow-xl ring-2 ring-rose-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          🎵 2. Been Flute in Air (Soundwaves)
        </button>
      </div>

      {/* 4 Venomous Snakes of India Identification */}
      <div className="w-full mt-4 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-2 text-center">
          ⚡ The Only 4 Poisonous Snakes in India (CBSE Class 5 EVS)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          {SNAKES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSnakeId(s.id)}
              className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                selectedSnakeId === s.id
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-xs font-black block">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. 👅 TONGUE TASTE MAP & DR. BEAUMONT DIGESTION LAB (CHAPTER 3 - THREE.JS 3D)
   ============================================================================ */
export const TongueTasteAndBeaumontSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-orange-400 shadow-xl flex flex-col items-center select-none font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
        From Tasting to Digestion: 3D Physiology Lab 👅
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-5 text-center max-w-lg">
        Explore the 4 primary taste receptor zones on the human tongue and simulate Dr. William Beaumont's 1822 discovery of 37°C gastric stomach acid digestion in full 3D!
      </p>

      {/* 3D Three.js Interactive Digestion Simulator */}
      <div className="w-full">
        <ThreeDigestionLab onCompleted={onCompleted} />
      </div>
    </div>
  );
};

/* ============================================================================
   5. 🌱 SEED DISPERSAL & GEORGE DE MESTRAL VELCRO LAB (CHAPTER 4 - THREE.JS 3D)
   ============================================================================ */
export const SeedDispersalVelcroSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeSeed, setActiveSeed] = useState<'dandelion' | 'coconut' | 'burdock'>('dandelion');

  const handleSelectSeed = (type: 'dandelion' | 'coconut' | 'burdock') => {
    sounds.pop();
    setActiveSeed(type);

    if (type === 'dandelion') {
      voiceAssistant.speak('Dandelion seeds have feathery 3D parachute umbrellas that catch rising thermal air drafts, floating over 5 kilometers!');
    } else if (type === 'coconut') {
      voiceAssistant.speak('Coconuts have thick waterproof fibrous husks packed with buoyant air pockets that drift across entire oceans!');
    } else {
      sounds.sparkle();
      voiceAssistant.speak('In 1948, Swiss engineer George de Mestral inspected Burdock seeds stuck to his dog, saw microscopic hooks, and invented Velcro!');
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-lime-400 shadow-xl flex flex-col items-center select-none font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
        Seed Dispersal & Velcro Invention Lab 🔬
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-5 text-center max-w-lg">
        Plants cannot walk! Tap each seed to test how wind aerodynamics, ocean currents, and animal fur transport seeds across the planet in 3D.
      </p>

      {/* 3 Seed Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
        <button
          onClick={() => handleSelectSeed('dandelion')}
          className={`p-4 rounded-2xl border-3 text-center cursor-pointer transition-all ${
            activeSeed === 'dandelion'
              ? 'bg-sky-100 border-sky-500 text-slate-900 shadow-md ring-4 ring-sky-200 scale-102 font-black'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-3xl block">🌬️ 🌼</span>
          <span className="text-xs font-black block mt-1.5">1. Wind Parachute (Dandelion)</span>
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">3D Air Drag Flight Simulator</span>
        </button>

        <button
          onClick={() => handleSelectSeed('coconut')}
          className={`p-4 rounded-2xl border-3 text-center cursor-pointer transition-all ${
            activeSeed === 'coconut'
              ? 'bg-teal-100 border-teal-500 text-slate-900 shadow-md ring-4 ring-teal-200 scale-102 font-black'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-3xl block">🌊 🥥</span>
          <span className="text-xs font-black block mt-1.5">2. Water Buoyancy (Coconut)</span>
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">3D Ocean Current Simulator</span>
        </button>

        <button
          onClick={() => handleSelectSeed('burdock')}
          className={`p-4 rounded-2xl border-3 text-center cursor-pointer transition-all ${
            activeSeed === 'burdock'
              ? 'bg-lime-100 border-lime-500 text-slate-900 shadow-md ring-4 ring-lime-200 scale-102 font-black'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-3xl block">🐕 🌿</span>
          <span className="text-xs font-black block mt-1.5">3. Animal Hooks (Burdock & Velcro)</span>
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">3D Micro-Hook Latch Lab</span>
        </button>
      </div>

      {/* 3D Three.js Lab Stages */}
      <div className="w-full">
        {activeSeed === 'dandelion' && <ThreeDandelionSim onCompleted={onCompleted} />}
        {activeSeed === 'coconut' && <ThreeCoconutSim onCompleted={onCompleted} />}
        {activeSeed === 'burdock' && <ThreeVelcroLab onCompleted={onCompleted} />}
      </div>
    </div>
  );
};

