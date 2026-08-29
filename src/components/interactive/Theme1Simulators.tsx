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
import antsTrailSugarImg from '@/assets/images/theme1/ants_trail_sugar.jpg';

import {
  VectorIndianCobra,
  VectorCommonKrait,
  VectorRussellsViper,
  VectorSawScaledViper,
  VectorTongueTasteMapGraphic,
  VectorVelcroMicroscopeGraphic,
} from '@/components/illustrations/Theme1Illustrations';

/* ============================================================================
   1. 🐜 ANT TRAIL PHEROMONE & BARRIER SIMULATOR (CHAPTER 1)
   ============================================================================ */
export const AntTrailPheromoneSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [hasBarrier, setHasBarrier] = useState(false);
  const [barrierType, setBarrierType] = useState<'pencil' | 'water' | null>(null);
  const [antsRouted, setAntsRouted] = useState(false);

  const handlePlaceBarrier = (type: 'pencil' | 'water') => {
    sounds.pop();
    setBarrierType(type);
    setHasBarrier(true);
    setAntsRouted(false);

    voiceAssistant.speak(
      'Barrier placed! Notice how the ants pause, wave their sensitive antennae, and scout around to pick up the invisible pheromone scent trail again!'
    );

    setTimeout(() => {
      sounds.success();
      setAntsRouted(true);
      if (onCompleted) onCompleted();
    }, 1800);
  };

  const handleClearBarrier = () => {
    sounds.pop();
    setHasBarrier(false);
    setBarrierType(null);
    setAntsRouted(false);
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 via-white to-emerald-50 p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-xl flex flex-col items-center relative overflow-hidden">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-slate-200 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
            🐜 Real Ant Colony Scent Trail (Macro Studio Lab)
          </span>
        </div>
        <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
          {hasBarrier ? (antsRouted ? '✓ PHEROMONE TRAIL RE-ESTABLISHED' : '⚠️ SENSING CHEMICAL BYPASS...') : '⚡ INVISIBLE PHEROMONE LINE ACTIVE'}
        </span>
      </div>

      {/* Real Macro Photography Ant Trail Stage */}
      <div className="relative w-full h-72 rounded-3xl border-3 border-amber-300 shadow-xl flex items-center justify-center overflow-hidden my-2 bg-slate-950">
        <img
          src={antsTrailSugarImg}
          alt="Ants marching in straight line to sugar crystals"
          className="w-full h-full object-cover select-none"
        />

        {/* Glowing Chemical Scent Line Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className={`w-4/5 h-4 rounded-full transition-all duration-700 ${
              hasBarrier && !antsRouted
                ? 'bg-red-500/40 border-2 border-red-500 border-dashed animate-pulse'
                : 'bg-emerald-400/40 border-2 border-emerald-400 shadow-[0_0_20px_#34d399]'
            }`}
          />
        </div>

        {/* The Barrier Dropped in Middle */}
        {hasBarrier && (
          <motion.div
            initial={{ scale: 0, y: -60 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          >
            {barrierType === 'pencil' ? (
              <div className="w-10 h-44 bg-gradient-to-r from-yellow-400 to-amber-500 border-3 border-slate-900 rounded-lg shadow-2xl flex items-center justify-center text-xs font-black text-slate-950 rotate-12">
                ✏️ PENCIL BARRIER
              </div>
            ) : (
              <div className="w-32 h-20 bg-sky-400/90 rounded-full border-3 border-white shadow-2xl flex items-center justify-center text-xs font-black text-white">
                💧 WATER PUDDLE
              </div>
            )}
          </motion.div>
        )}

        {/* Scent Radar Status Indicator */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 text-[11px] font-bold text-slate-300">
          📍 Chemical: Formic Acid Pheromone Trail
        </div>
      </div>

      {/* Interactive Controls */}
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
  const [activeSeed, setActiveSeed] = useState<'dandelion' | 'coconut' | 'burdock'>('burdock');

  const handleLaunchSeed = (type: 'dandelion' | 'coconut' | 'burdock') => {
    sounds.pop();
    setActiveSeed(type);

    if (type === 'burdock') {
      sounds.sparkle();
      voiceAssistant.speak(
        'In 1948, Swiss engineer George de Mestral examined prickly Burdock burrs stuck to his dog’s fur under a microscope, saw tiny hooked teeth, and invented Velcro!'
      );
      if (onCompleted) onCompleted();
    } else if (type === 'dandelion') {
      voiceAssistant.speak('Dandelion seeds have feathery parachute umbrellas that glide miles on wind breezes!');
    } else {
      voiceAssistant.speak('Coconuts have thick, fibrous waterproof husks that float across entire oceans!');
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-lime-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-2">Seed Dispersal & Velcro Invention Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Select a seed to test its natural dispersal mechanism and explore how hooked seeds inspired Velcro!
      </p>

      {/* Dispersal Method Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
        <button
          onClick={() => handleLaunchSeed('dandelion')}
          className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
            activeSeed === 'dandelion' ? 'bg-sky-100 border-sky-500 font-black shadow-md' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-3xl block">🌬️ 🌼</span>
          <span className="text-xs font-black block mt-1">1. Wind Parachute (Dandelion)</span>
          <span className="text-[10px] text-slate-500 block">Feathery bristles glide on air</span>
        </button>

        <button
          onClick={() => handleLaunchSeed('coconut')}
          className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
            activeSeed === 'coconut' ? 'bg-emerald-100 border-emerald-500 font-black shadow-md' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-3xl block">🌊 🥥</span>
          <span className="text-xs font-black block mt-1">2. Water Buoyancy (Coconut)</span>
          <span className="text-[10px] text-slate-500 block">Fibrous air-filled floating husk</span>
        </button>

        <button
          onClick={() => handleLaunchSeed('burdock')}
          className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
            activeSeed === 'burdock' ? 'bg-lime-100 border-lime-500 font-black shadow-md ring-2 ring-lime-300' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-3xl block">🐕 🌿</span>
          <span className="text-xs font-black block mt-1">3. Animal Hooks (Burdock Burr)</span>
          <span className="text-[10px] text-slate-500 block">Microscopic hooks stick to fur & socks</span>
        </button>
      </div>

      {/* 250x Microscope View: The Invention of Velcro */}
      {activeSeed === 'burdock' && (
        <div className="w-full bg-slate-950 p-6 rounded-3xl border-3 border-lime-400 text-white flex flex-col items-center gap-4 shadow-xl">
          <span className="text-xs font-black uppercase text-lime-400 bg-lime-950 px-3 py-1 rounded-full border border-lime-500/50">
            Microscope Lab: The Invention of Velcro (1948 by George de Mestral)
          </span>
          <VectorVelcroMicroscopeGraphic />
          <p className="text-xs text-slate-300 font-bold leading-relaxed text-center max-w-lg mt-1">
            Burdock seeds have hundreds of microscopic tiny hooks that grab onto fabric loops. George de Mestral manufactured nylon hook-and-loop tape, creating Velcro!
          </p>
        </div>
      )}
    </div>
  );
};
