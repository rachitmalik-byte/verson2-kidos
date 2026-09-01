import { ThreeVelcroLab } from '@/components/three-lab/ThreeVelcroLab';
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
   4. 👅 TONGUE TASTE MAP & DR. BEAUMONT DIGESTION LAB (CHAPTER 3)
   ============================================================================ */
export const TongueTasteAndBeaumontSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeTaste, setActiveTaste] = useState<'sweet' | 'salty' | 'sour' | 'bitter'>('sweet');
  const [chewCount, setChewCount] = useState(0);

  const handleChew = () => {
    sounds.pop();
    const newCount = chewCount + 1;
    setChewCount(newCount);

    if (newCount >= 5) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Amazing! Chewing starch 30 times mixes saliva enzymes that break down starch into sweet maltose sugar!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-orange-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Anatomical Tongue 4-Zone Taste Map</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Tap each flavor zone to see where taste buds are most sensitive on the human tongue!
      </p>

      {/* Visual Tongue Graphic */}
      <div className="my-2">
        <VectorTongueTasteMapGraphic activeZone={activeTaste} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full my-4">
        {[
          { id: 'sweet', label: '1. Sweet (Tip)', food: '🍯 Honey / Sugar', color: 'bg-rose-100 text-rose-900 border-rose-400' },
          { id: 'salty', label: '2. Salty (Front Sides)', food: '🥨 Salted Chips', color: 'bg-sky-100 text-sky-900 border-sky-400' },
          { id: 'sour', label: '3. Sour (Back Sides)', food: '🍋 Lemon / Tamarind', color: 'bg-amber-100 text-amber-900 border-amber-400' },
          { id: 'bitter', label: '4. Bitter (Deep Back)', food: '☕ Neem / Bitter Gourd', color: 'bg-emerald-100 text-emerald-900 border-emerald-400' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sounds.pop();
              setActiveTaste(t.id as any);
            }}
            className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
              activeTaste === t.id ? `${t.color} font-black shadow-md scale-102 ring-2 ring-orange-300` : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-xs font-black block">{t.label}</span>
            <span className="text-[10px] font-bold block mt-1">{t.food}</span>
          </button>
        ))}
      </div>

      {/* Saliva Enzyme Digestion Sandbox */}
      <div className="w-full bg-orange-50 p-6 rounded-3xl border-2 border-orange-300 flex flex-col items-center text-center mt-2">
        <span className="px-3 py-1 bg-orange-200 text-orange-950 rounded-full text-xs font-black uppercase mb-2">
          🍞 Saliva Starch-to-Sugar Digestion Reaction
        </span>
        <h4 className="text-base font-black text-slate-800 mb-1">
          Chew Plain Bread 30 Times!
        </h4>
        <p className="text-xs text-slate-600 font-bold mb-4">
          Tap the chew button to mix salivary amylase enzyme with plain bread starch.
        </p>

        <button
          onClick={handleChew}
          className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
        >
          <span>👄 Chew Bread ({chewCount}/5)</span>
        </button>

        {chewCount >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-emerald-100 border border-emerald-400 rounded-2xl text-xs font-black text-emerald-950 mt-4"
          >
            🎉 Taste Discovery: Saliva enzymes converted plain starch into sweet sugar in your mouth!
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   5. 🌱 SEED DISPERSAL & GEORGE DE MESTRAL VELCRO LAB (CHAPTER 4)
   ============================================================================ */
export const SeedDispersalVelcroSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeSeed, setActiveSeed] = useState<'dandelion' | 'coconut' | 'burdock'>('dandelion');

  // Dandelion state
  const [windPower, setWindPower] = useState<'calm' | 'breeze' | 'gale'>('breeze');
  const [distanceKm, setDistanceKm] = useState(1.2);

  // Coconut state
  const [coconutFloating, setCoconutFloating] = useState(false);
  const [oceanProgress, setOceanProgress] = useState(0);

  // Burdock state
  const [burdockStuckCount, setBurdockStuckCount] = useState(0);
  const [isMicroscopeMode, setIsMicroscopeMode] = useState(false);
  const [isLatched, setIsLatched] = useState(false);
  const [pullGrip, setPullGrip] = useState(15);

  const handleSelectSeed = (type: 'dandelion' | 'coconut' | 'burdock') => {
    sounds.pop();
    setActiveSeed(type);

    if (type === 'dandelion') {
      voiceAssistant.speak('Dandelion seeds have feathery parachute umbrellas that catch air currents, floating over 5 kilometers!');
    } else if (type === 'coconut') {
      voiceAssistant.speak('Coconuts have thick, waterproof fibrous husks packed with air pockets that float across entire oceans!');
    } else {
      sounds.sparkle();
      voiceAssistant.speak('In 1948, Swiss engineer George de Mestral inspected Burdock seeds stuck to his dog, saw microscopic hooks, and invented Velcro!');
      if (onCompleted) onCompleted();
    }
  };

  const handleBlowWind = (power: 'calm' | 'breeze' | 'gale') => {
    sounds.pop();
    setWindPower(power);
    if (power === 'calm') setDistanceKm(0.2);
    if (power === 'breeze') setDistanceKm(2.5);
    if (power === 'gale') {
      sounds.fanfare();
      setDistanceKm(6.8);
      voiceAssistant.speak('Strong thermal updrafts lift dandelion seeds up to 6.8 kilometers away to populate new open meadows!');
      if (onCompleted) onCompleted();
    }
  };

  const handleLaunchCoconut = () => {
    sounds.bubble();
    setCoconutFloating(true);
    setOceanProgress(0);

    const interval = setInterval(() => {
      setOceanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.fanfare();
          voiceAssistant.speak('Ocean current voyage complete! The coconut washes up on a new tropical coral atoll and sprouts into a palm tree!');
          if (onCompleted) onCompleted();
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleBrushDog = () => {
    sounds.pop();
    const next = Math.min(6, burdockStuckCount + 2);
    setBurdockStuckCount(next);
    if (next >= 6) {
      sounds.sparkle();
      voiceAssistant.speak('Burdock burrs latched tightly to the socks and dog fur! Now let us examine the microscopic hooks that inspired Velcro!');
    }
  };

  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-lime-400 shadow-xl flex flex-col items-center select-none font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
        Seed Dispersal & Velcro Invention Lab 🔬
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-5 text-center max-w-lg">
        Plants cannot walk! Tap each seed to test how wind, ocean water, and animal fur transport seeds across the planet.
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
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Air drag carries seeds for miles</span>
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
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Fibrous air-filled floating husk</span>
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
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Micro-hooks stick to fur & socks</span>
        </button>
      </div>

      {/* ── MODE 1: DANDELION WIND PARACHUTE SIMULATOR ── */}
      {activeSeed === 'dandelion' && (
        <div className="w-full bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 rounded-3xl p-6 border-3 border-sky-300 shadow-inner flex flex-col items-center relative overflow-hidden">
          <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/90 text-sky-950 font-black text-xs rounded-full shadow-xs">
              🌬️ Wind Drag Aerodynamics
            </span>
            <span className="px-3 py-1 bg-sky-950 text-white font-mono font-black text-xs rounded-full shadow-xs">
              Flight Distance: {distanceKm.toFixed(1)} km
            </span>
          </div>

          {/* Animated Sky Canvas with Flying Parachutes */}
          <div className="w-full h-48 sm:h-56 relative rounded-2xl overflow-hidden border-2 border-white/60 bg-sky-300/40 shadow-inner flex items-center justify-between px-6">
            {/* Dandelion Stem (Left) */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-4xl">🌼</span>
              <div className="w-2 h-20 bg-emerald-600 rounded-full" />
            </div>

            {/* Flying Feathery Seed Parachutes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 80 + i * 35, 180 + i * 45],
                  y: [0, -15 - (i % 3) * 12, (i % 2) * 20],
                  rotate: [0, 15, -10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: windPower === 'calm' ? 6 : windPower === 'breeze' ? 3.5 : 1.8,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl filter drop-shadow-md">🪂</span>
                <span className="w-1 h-3 bg-amber-900 rounded-full -mt-1" />
              </motion.div>
            ))}

            {/* Distant Meadow Target (Right) */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-4xl">🏔️</span>
              <span className="text-[10px] font-black text-slate-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                New Meadow
              </span>
            </div>
          </div>

          {/* Wind Speed Buttons */}
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
            <span className="text-xs font-black text-slate-800 mr-2">Set Wind Strength:</span>
            {[
              { id: 'calm', label: '🍃 Gentle Air (0.2 km)' },
              { id: 'breeze', label: '🌬️ Thermal Breeze (2.5 km)' },
              { id: 'gale', label: '💨 Strong Updraft (6.8 km)' },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => handleBlowWind(w.id as any)}
                className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                  windPower === w.id
                    ? 'bg-sky-600 text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: COCONUT OCEAN BUOYANCY SIMULATOR ── */}
      {activeSeed === 'coconut' && (
        <div className="w-full bg-gradient-to-b from-teal-400 via-sky-300 to-blue-600 rounded-3xl p-6 border-3 border-teal-300 shadow-inner flex flex-col items-center relative overflow-hidden">
          <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/90 text-teal-950 font-black text-xs rounded-full shadow-xs">
              🌊 Saltwater Ocean Buoyancy
            </span>
            <span className="px-3 py-1 bg-blue-950 text-white font-mono font-black text-xs rounded-full shadow-xs">
              Voyage Progress: {oceanProgress}%
            </span>
          </div>

          {/* Ocean Waves Stage */}
          <div className="w-full h-48 sm:h-56 relative rounded-2xl overflow-hidden border-2 border-white/60 bg-blue-500/40 shadow-inner flex items-center justify-between px-6">
            {/* Island Shore 1 */}
            <div className="flex flex-col items-center shrink-0 z-10">
              <span className="text-4xl">🏝️</span>
              <span className="text-[10px] font-black text-white bg-teal-950 px-2 py-0.5 rounded-full mt-1">
                Home Island
              </span>
            </div>

            {/* Floating Coconut on Animated Water Waves */}
            <motion.div
              animate={{
                x: `${oceanProgress * 2.2}px`,
                y: [0, -8, 4, 0],
                rotate: [0, 8, -6, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              }}
              className="flex flex-col items-center z-20"
            >
              <span className="text-4xl filter drop-shadow-lg">🥥</span>
              <span className="text-[9px] font-black bg-white text-teal-950 px-2 py-0.5 rounded-full mt-0.5 shadow-xs whitespace-nowrap">
                Air-Filled Husk (Floats!)
              </span>
            </motion.div>

            {/* Destination Atoll */}
            <div className="flex flex-col items-center shrink-0 z-10">
              <span className="text-4xl">🌴</span>
              <span className="text-[10px] font-black text-white bg-teal-950 px-2 py-0.5 rounded-full mt-1">
                New Island
              </span>
            </div>
          </div>

          {/* Launch Coconut Button */}
          <div className="mt-4">
            <button
              onClick={handleLaunchCoconut}
              disabled={coconutFloating && oceanProgress < 100}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              <span>🥥 Launch Coconut Across Ocean Current</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODE 3: BURDOCK SEED ANIMAL HOOKS & VELCRO INVENTION ── */}
      {activeSeed === 'burdock' && (
        <div className="w-full flex flex-col items-center gap-5">
          {/* Sub-toggle: Real World Walk vs 100x Microscope Lab */}
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                sounds.pop();
                setIsMicroscopeMode(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                !isMicroscopeMode
                  ? 'bg-lime-500 text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              🐕 Step 1: Walk in Tall Grass
            </button>
            <button
              onClick={() => {
                sounds.pop();
                setIsMicroscopeMode(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                isMicroscopeMode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              🔬 Step 2: 100x Microscope Velcro Lab
            </button>
          </div>

          {/* Step 1: Real-Life Grass & Socks Simulation */}
          {!isMicroscopeMode ? (
            <div className="w-full bg-gradient-to-b from-amber-100 via-lime-50 to-emerald-100 rounded-3xl p-6 border-3 border-lime-300 shadow-inner flex flex-col items-center">
              <span className="px-3 py-1 bg-lime-200 text-lime-950 font-black text-xs rounded-full mb-3 shadow-xs">
                🌿 Tap "Walk Through Grass" to Brush Against Burdock Burrs
              </span>

              {/* Garden Scene */}
              <div className="w-full h-48 rounded-2xl bg-white/80 border-2 border-lime-200 shadow-inner p-4 flex items-center justify-around relative overflow-hidden">
                {/* Burdock Bush (Left) */}
                <div className="flex flex-col items-center">
                  <div className="text-3xl flex gap-1">🌿🦔🌿</div>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full mt-1">
                    Burdock Bush
                  </span>
                </div>

                {/* Walking Dog / Wool Socks with Stuck Burrs */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="text-5xl">🐕 🧦</span>
                    {burdockStuckCount > 0 && (
                      <div className="absolute -top-2 -right-2 flex gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-md animate-bounce">
                        <span>{burdockStuckCount} Burrs Stuck! 🦔</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-slate-700 mt-2">
                    {burdockStuckCount === 0 ? 'Clean Fur & Socks' : 'Hundreds of tiny hooks clinging tightly!'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleBrushDog}
                  className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>🐕 Walk Dog Through Tall Grass</span>
                </button>

                {burdockStuckCount >= 4 && (
                  <button
                    onClick={() => {
                      sounds.fanfare();
                      setIsMicroscopeMode(true);
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Inspect Under Microscope ➔</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: High-Resolution Visual Velcro Hook & Loop Inspector */
            <div className="w-full bg-slate-950 p-6 rounded-3xl border-3 border-indigo-400 text-white flex flex-col items-center gap-4 shadow-2xl">
              <div className="flex items-center justify-between w-full flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    100x Digital Microscope: The Invention of Velcro
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    Natural Seed Micro-Hooks (Brown) vs Synthetic Nylon Loops (Blue)
                  </h4>
                </div>

                <button
                  onClick={() => {
                    sounds.pop();
                    setIsLatched(!isLatched);
                    if (!isLatched) sounds.sparkle();
                  }}
                  className={`px-5 py-2 rounded-2xl font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all ${
                    isLatched ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  {isLatched ? '🔒 Interlocked! (Release)' : 'Press Together to Latch 🔒'}
                </button>
              </div>

              {/* Visual High-Res Diagram Stage */}
              <div className="w-full h-64 sm:h-72 rounded-2xl bg-slate-900 border-2 border-slate-800 shadow-inner flex items-center justify-around p-4 relative overflow-hidden">
                {/* Left Side: Natural Burdock Hook */}
                <motion.div
                  animate={{ x: isLatched ? 40 : 0 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-amber-950/80 border-2 border-amber-500/60 rounded-2xl text-center">
                    <span className="text-4xl block">🪝</span>
                    <span className="text-xs font-black text-amber-300 mt-1 block">
                      Curved Seed Hook
                    </span>
                    <span className="text-[10px] text-amber-200/80 block font-bold">
                      Natural Elastic Plant Spine
                    </span>
                  </div>
                </motion.div>

                {/* Center Interlocking Indicator */}
                <div className="flex flex-col items-center">
                  <span className={`text-2xl ${isLatched ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`}>
                    {isLatched ? '⚡ GRIP LOCKED ⚡' : '➔ Approaching ➔'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 mt-1">
                    {isLatched ? 'Hooks flex and grip woven loops' : 'Bring surfaces together to latch'}
                  </span>
                </div>

                {/* Right Side: Synthetic Nylon Loop */}
                <motion.div
                  animate={{ x: isLatched ? -40 : 0 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-sky-950/80 border-2 border-sky-500/60 rounded-2xl text-center">
                    <span className="text-4xl block">🧵</span>
                    <span className="text-xs font-black text-sky-300 mt-1 block">
                      Woven Nylon Loop
                    </span>
                    <span className="text-[10px] text-sky-200/80 block font-bold">
                      Flexible Synthetic Filament
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Tensile Grip Force Meter */}
              {isLatched && (
                <div className="w-full flex items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-xs font-black text-white block">Tensile Holding Strength</span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Pulling force resisted by thousands of micro-hooks: {pullGrip} N
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={pullGrip}
                    onChange={(e) => setPullGrip(Number(e.target.value))}
                    className="accent-amber-400 cursor-pointer w-36"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

