import { ThreeVelcroLab } from '@/components/three-lab/ThreeVelcroLab';
import { ThreeDigestionLab } from '@/components/three-lab/ThreeDigestionLab';
import { ThreeAntPheromoneLab } from '@/components/three-lab/ThreeAntPheromoneLab';
import { ThreeSnakeAcousticLab } from '@/components/three-lab/ThreeSnakeAcousticLab';
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
   4. 👅 ANATOMICAL TONGUE TASTE MAP & DR. BEAUMONT DIGESTION LAB (CHAPTER 3)
   ============================================================================ */
export const TongueTasteAndBeaumontSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeTab, setActiveTab] = useState<'tongue' | 'beaumont_3d'>('tongue');
  const [activeTaste, setActiveTaste] = useState<'sweet' | 'salty' | 'sour' | 'bitter'>('sweet');
  const [chewCount, setChewCount] = useState(0);

  // Dr. Beaumont 3D State
  const [digestionProgress, setDigestionProgress] = useState(0);
  const [isDigestActive, setIsDigestActive] = useState(false);

  const TASTE_ZONES = {
    sweet: {
      name: '1. Sweet Zone (Tip)',
      food: '🍯 Honey, Sugar & Mango',
      color: 'bg-rose-100 text-rose-900 border-rose-400',
      badge: 'bg-rose-500 text-white',
      desc: 'The tip of the tongue is packed with fungiform papillae that detect energy-rich simple carbohydrates and glucose!',
    },
    salty: {
      name: '2. Salty Zone (Front Sides)',
      food: '🥨 Salt Crystals & Chips',
      color: 'bg-sky-100 text-sky-900 border-sky-400',
      badge: 'bg-sky-500 text-white',
      desc: 'Front lateral borders detect sodium ions (NaCl) and essential electrolytes required for nerve signal conduction!',
    },
    sour: {
      name: '3. Sour Zone (Back Sides)',
      food: '🍋 Fresh Lemon & Tamarind',
      color: 'bg-amber-100 text-amber-900 border-amber-400',
      badge: 'bg-amber-500 text-slate-950',
      desc: 'Rear lateral edges detect acidity (hydrogen ions) to evaluate food freshness, natural fruit acids, and vitamin C!',
    },
    bitter: {
      name: '4. Bitter Zone (Deep Back)',
      food: '☕ Neem Leaves & Dark Cocoa',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
      badge: 'bg-emerald-500 text-white',
      desc: 'Deep at the back, circumvallate papillae detect bitter plant alkaloids, serving as a vital natural poison alarm!',
    },
  };

  const handleSelectTaste = (taste: 'sweet' | 'salty' | 'sour' | 'bitter') => {
    sounds.pop();
    setActiveTaste(taste);
    const spec = TASTE_ZONES[taste];
    voiceAssistant.speak(`${spec.name}: ${spec.food}. ${spec.desc}`);
  };

  const handleChew = () => {
    sounds.pop();
    const next = chewCount + 1;
    setChewCount(next);

    if (next >= 5) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Digestive Breakthrough! Chewing bread 30 times thoroughly mixes saliva amylase enzymes, converting complex starches into sweet glucose sugars!'
      );
      if (onCompleted) onCompleted();
    }
  };

  const handleStartDigestion = () => {
    sounds.bubble();
    setIsDigestActive(true);
    setDigestionProgress(0);

    const interval = setInterval(() => {
      setDigestionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.fanfare();
          voiceAssistant.speak(
            'Dr. Beaumont Discovery (1822): Gastric juices at 37°C chemically liquefy solid food into chyme within 2 hours!'
          );
          if (onCompleted) onCompleted();
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-orange-400 shadow-xl flex flex-col items-center select-none font-sans">
      {/* Header & Mode Switchers */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-center sm:text-left" style={{ fontFamily: 'Nunito, sans-serif' }}>
            From Tasting to Digestion: Physiology Lab 👅
          </h3>
          <p className="text-xs text-slate-600 font-bold mt-0.5 text-center sm:text-left">
            Explore taste bud papillae zones and Dr. William Beaumont's 1822 discovery of gastric digestion!
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('tongue');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'tongue'
                ? 'bg-orange-500 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            👅 Tongue Taste Map
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('beaumont_3d');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'beaumont_3d'
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            🧪 3D Dr. Beaumont Stomach
          </button>
        </div>
      </div>

      {/* ── MODE 1: CRYSTAL-CLEAR ANATOMICAL TASTE MAP & MICROSCOPE DIAGRAM ── */}
      {activeTab === 'tongue' && (
        <div className="w-full flex flex-col gap-5">
          {/* Side-by-Side: Vector Taste Map + Microscopic Papillae Specimen View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
            {/* Left: Clean Crisp Vector Tongue Map */}
            <div className="bg-gradient-to-b from-rose-50 via-pink-50 to-orange-50 p-6 rounded-3xl border-3 border-orange-300 shadow-inner flex flex-col items-center relative">
              <span className="px-3 py-1 bg-white/90 text-orange-950 font-black text-xs rounded-full shadow-xs mb-3">
                👅 4-Zone Taste Receptor Mapping
              </span>

              {/* Anatomical Vector Tongue Diagram */}
              <div className="relative w-60 h-72 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full filter drop-shadow-md">
                  {/* Tongue Base Outline */}
                  <path
                    d="M 60 30 Q 100 15 140 30 C 175 60 175 160 150 200 C 130 230 100 235 100 235 C 100 235 70 230 50 200 C 25 160 25 60 60 30 Z"
                    fill="#f472b6"
                    stroke="#db2777"
                    strokeWidth="4"
                  />

                  {/* Median Sulcus (Center Line) */}
                  <path d="M 100 40 L 100 180" stroke="#be185d" strokeWidth="3" strokeDasharray="4,3" />

                  {/* 4. Bitter Zone (Deep Back) */}
                  <path
                    d="M 65 40 Q 100 25 135 40 C 145 65 145 80 130 90 Q 100 80 70 90 C 55 80 55 65 65 40 Z"
                    fill={activeTaste === 'bitter' ? '#10b981' : '#fbcfe8'}
                    stroke="#059669"
                    strokeWidth={activeTaste === 'bitter' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('bitter')}
                  />

                  {/* 3. Sour Zones (Rear Sides) */}
                  <path
                    d="M 38 95 C 42 130 50 155 65 165 C 55 145 50 120 48 95 Z"
                    fill={activeTaste === 'sour' ? '#eab308' : '#fbcfe8'}
                    stroke="#ca8a04"
                    strokeWidth={activeTaste === 'sour' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('sour')}
                  />
                  <path
                    d="M 162 95 C 158 130 150 155 135 165 C 145 145 150 120 152 95 Z"
                    fill={activeTaste === 'sour' ? '#eab308' : '#fbcfe8'}
                    stroke="#ca8a04"
                    strokeWidth={activeTaste === 'sour' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('sour')}
                  />

                  {/* 2. Salty Zones (Front Sides) */}
                  <path
                    d="M 52 165 C 65 185 80 205 90 215 C 80 195 70 175 65 165 Z"
                    fill={activeTaste === 'salty' ? '#0284c7' : '#fbcfe8'}
                    stroke="#0369a1"
                    strokeWidth={activeTaste === 'salty' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('salty')}
                  />
                  <path
                    d="M 148 165 C 135 185 120 205 110 215 C 120 195 130 175 135 165 Z"
                    fill={activeTaste === 'salty' ? '#0284c7' : '#fbcfe8'}
                    stroke="#0369a1"
                    strokeWidth={activeTaste === 'salty' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('salty')}
                  />

                  {/* 1. Sweet Zone (Tip) */}
                  <path
                    d="M 85 210 Q 100 235 115 210 Q 100 200 85 210 Z"
                    fill={activeTaste === 'sweet' ? '#f43f5e' : '#fbcfe8'}
                    stroke="#e11d48"
                    strokeWidth={activeTaste === 'sweet' ? '3' : '1'}
                    className="transition-all cursor-pointer"
                    onClick={() => handleSelectTaste('sweet')}
                  />
                </svg>

                {/* Pulsing Active Zone Callout */}
                <div className="absolute bottom-2 bg-slate-900/90 text-white px-3 py-1 rounded-full text-[11px] font-black border border-slate-700 shadow-md">
                  Active: {TASTE_ZONES[activeTaste].name}
                </div>
              </div>
            </div>

            {/* Right: Microscopic Taste Buds & Scientific Explanation */}
            <div className="flex flex-col justify-between h-full gap-4">
              <div className="bg-slate-950 p-5 rounded-3xl border-3 border-slate-800 text-white shadow-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    🔬 Microscopic Taste Papillae (10,000 Buds)
                  </span>
                </div>

                <h4 className="text-base font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {TASTE_ZONES[activeTaste].name}
                </h4>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300 leading-relaxed">
                  {TASTE_ZONES[activeTaste].desc}
                </div>

                <div className="p-2.5 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs font-black text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Key Foods: {TASTE_ZONES[activeTaste].food}</span>
                </div>
              </div>

              {/* 4 Interactive Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TASTE_ZONES) as (keyof typeof TASTE_ZONES)[]).map((key) => {
                  const isSelected = activeTaste === key;
                  const zone = TASTE_ZONES[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTaste(key)}
                      className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        isSelected
                          ? `${zone.color} shadow-md scale-102 ring-2 ring-orange-300 font-black`
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-black block">{zone.name}</span>
                      <span className="text-[10px] font-bold block mt-0.5 opacity-80">{zone.food}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Saliva Enzyme Digestion Sandbox (Bread Chewing Test) */}
          <div className="w-full bg-orange-50 p-6 rounded-3xl border-3 border-orange-300 flex flex-col items-center text-center shadow-inner">
            <span className="px-3 py-1 bg-orange-200 text-orange-950 rounded-full text-xs font-black uppercase mb-2">
              🍞 Saliva Amylase Enzyme Chemistry
            </span>
            <h4 className="text-base font-black text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Chew Plain Bread 30 Times!
            </h4>
            <p className="text-xs text-slate-600 font-bold mb-4 max-w-md">
              Tap the chew button to mix salivary amylase enzymes with plain bread starch and turn it into sweet sugar!
            </p>

            <button
              onClick={handleChew}
              className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              <span>👄 Chew Bread ({chewCount}/5)</span>
            </button>

            {chewCount >= 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-xs font-black text-emerald-950 mt-4 shadow-sm"
              >
                🎉 Taste Discovery: Saliva enzymes converted plain starch into sweet maltose sugar right in your mouth!
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── MODE 2: 3D DR. WILLIAM BEAUMONT GASTRIC DIGESTION CHAMBER (1822) ── */}
      {activeTab === 'beaumont_3d' && (
        <div className="w-full">
          <ThreeDigestionLab onCompleted={onCompleted} />
        </div>
      )}
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

