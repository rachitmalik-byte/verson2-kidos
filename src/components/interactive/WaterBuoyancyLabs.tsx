import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Droplets,
  Sparkles,
  Flame,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Layers,
  Thermometer,
} from 'lucide-react';

/* ============================================================================
   1. 🌊 SALT WATER DENSITY & DEAD SEA BUOYANCY LAB (CBSE CLASS 5 EVS CH 7)
   ============================================================================ */
export const SaltWaterDensityDeadSeaLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [saltSpoons, setSaltSpoons] = useState(0);
  const [hypothesis, setHypothesis] = useState<'sink' | 'float' | null>(null);
  const [isPouringSalt, setIsPouringSalt] = useState(false);

  // Density starts at 1.00 g/cm³ (fresh water), rises by 0.05 per spoon up to 1.25 g/cm³ (Dead Sea level)
  const waterDensity = Number((1.0 + saltSpoons * 0.05).toFixed(2));
  // Egg density is ~1.12 g/cm³. Sinks when water density < 1.12, floats when >= 1.15 (3+ spoons)
  const isEggFloating = saltSpoons >= 3;
  // Egg Y position in beaker (220px bottom when sunken, 70px top when floating)
  const eggY = isEggFloating ? 70 - (saltSpoons - 3) * 6 : 210;

  const handleAddSpoon = () => {
    if (saltSpoons >= 5) return;
    sounds.pop();
    setIsPouringSalt(true);

    setTimeout(() => {
      const nextSpoons = saltSpoons + 1;
      setSaltSpoons(nextSpoons);
      setIsPouringSalt(false);

      if (nextSpoons === 3) {
        sounds.fanfare();
        voiceAssistant.speak(
          'Look at the egg! At 3 spoons of salt, water density reaches 1.15 g/cm³, which is heavier than the egg, pushing the egg up to float on top! This is why people float effortlessly in the Dead Sea!'
        );
        if (onCompleted) onCompleted();
      } else if (nextSpoons < 3) {
        voiceAssistant.speak(`Salt spoon ${nextSpoons} dissolved. Water density is now ${waterDensity} g/cm³. Add more salt!`);
      }
    }, 600);
  };

  const handleReset = () => {
    sounds.pop();
    setSaltSpoons(0);
    setHypothesis(null);
  };

  return (
    <div className="w-full bg-gradient-to-b from-sky-50 via-white to-blue-50 p-6 sm:p-8 rounded-3xl border-4 border-sky-400 shadow-xl flex flex-col items-center">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-600" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
            Water Density & Dead Sea Buoyancy Apparatus
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white font-mono">
            ⚖️ Density: {waterDensity} g/cm³
          </span>
          <span
            className={`text-xs font-black px-3.5 py-1 rounded-full shadow-xs ${
              isEggFloating
                ? 'bg-emerald-400 text-slate-950 font-black animate-pulse'
                : 'bg-sky-100 text-sky-900 border border-sky-300'
            }`}
          >
            {isEggFloating ? '✓ BUOYANT FLOAT (DEAD SEA EFFECT)' : '⬇️ HEAVY SINK (FRESH WATER)'}
          </span>
        </div>
      </div>

      {/* ── STEP 1: HYPOTHESIS COMMITMENT ── */}
      {!hypothesis && (
        <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 flex flex-col items-center text-center mb-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Scientific Hypothesis: What is your prediction?</span>
          </div>
          <p className="text-xs text-slate-700 font-bold mb-3">
            A fresh egg sinks to the bottom of plain water. What will happen when we dissolve 4 spoons of salt into the water?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                sounds.pop();
                setHypothesis('sink');
                voiceAssistant.speak('Hypothesis recorded: You predict the egg will remain sunken. Let’s test the apparatus!');
              }}
              className="px-5 py-2 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-400 font-black text-xs text-slate-800 cursor-pointer shadow-xs"
            >
              1. Egg will stay at bottom (Sink)
            </button>
            <button
              onClick={() => {
                sounds.pop();
                setHypothesis('float');
                voiceAssistant.speak('Hypothesis recorded: You predict the egg will rise and float. Let’s add salt to test!');
              }}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-amber-600 font-black text-xs text-slate-950 cursor-pointer shadow-sm"
            >
              2. Egg will rise and float on top 🥚
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: INTERACTIVE LAB APPARATUS ── */}
      <div className="relative w-full max-w-md h-84 rounded-3xl overflow-hidden border-3 border-sky-300 shadow-inner flex items-center justify-center p-4 bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/40 my-2">
        {/* Laboratory Glass Beaker (300ml) */}
        <div className="relative w-48 h-64 border-4 border-t-0 border-slate-700 rounded-b-3xl bg-sky-200/30 backdrop-blur-xs flex items-end justify-center overflow-hidden shadow-2xl">
          {/* Water Fill with Volume Markings */}
          <div
            className={`w-full h-56 transition-colors duration-700 relative flex items-center justify-center ${
              saltSpoons === 0
                ? 'bg-sky-400/40'
                : saltSpoons < 3
                ? 'bg-sky-500/50'
                : 'bg-teal-500/60 shadow-[inset_0_0_20px_#2dd4bf]'
            }`}
          >
            {/* Beaker Volume Ticks (ml) */}
            {[50, 100, 150, 200, 250].map((ml, i) => (
              <div
                key={ml}
                className="absolute left-2 text-[8px] font-mono font-bold text-slate-600 flex items-center gap-1"
                style={{ bottom: `${i * 38 + 15}px` }}
              >
                <div className="w-3 h-[1.5px] bg-slate-700" />
                <span>{ml}ml</span>
              </div>
            ))}

            {/* Salt Grains Dissolving Animation */}
            {saltSpoons > 0 && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(saltSpoons * 10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-white rounded-full absolute"
                    style={{
                      left: `${(i * 17) % 90 + 5}%`,
                      top: `${(i * 23) % 80 + 10}%`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* The Egg (Physics Buoyancy Motion) */}
            <motion.div
              animate={{
                y: eggY - 140,
                rotate: isEggFloating ? [0, 3, -3, 0] : 0,
              }}
              transition={{ type: 'spring', stiffness: 60, damping: 12 }}
              className="w-14 h-18 rounded-[50%/60%_60%_40%_40%] bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-2 border-amber-400/80 shadow-md flex items-center justify-center relative cursor-grab z-10"
            >
              <span className="text-[10px] font-black text-amber-900 select-none">EGG</span>
            </motion.div>
          </div>
        </div>

        {/* Salt Pouring Spoon Dropper Tool */}
        <div className="absolute top-4 right-4 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleAddSpoon}
            disabled={saltSpoons >= 5 || isPouringSalt}
            className="p-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 border-2 border-amber-600 rounded-2xl shadow-lg font-black text-xs text-slate-950 flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span className="text-xl">🥄 🧂</span>
            <span>+ Add Salt Spoon ({saltSpoons}/5)</span>
          </motion.button>
          <span className="text-[9px] font-bold text-slate-500 mt-1">Tap spoon to dissolve</span>
        </div>
      </div>

      {/* Reset & Insight Controls */}
      <div className="w-full flex items-center justify-between mt-3 max-w-md">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Empty & Refill Plain Water</span>
        </button>
        <span className="text-xs font-black text-slate-700">
          Salt Spoons Added: {saltSpoons}
        </span>
      </div>

      {/* Scientific Principle Callout */}
      <div className="w-full bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 text-center text-xs font-bold text-sky-950 mt-3">
        🌊 <strong>CBSE Science Law:</strong> Plain water has a density of 1.00 g/cm³. When salt dissolves, it packs dense mineral ions into water, increasing density above 1.15 g/cm³. Because the water is now denser than the egg, the buoyant upthrust forces the egg to float!
      </div>
    </div>
  );
};

/* ============================================================================
   2. 🧪 SOLUBILITY & DISSOLUTION 5-TUBE RACK (CBSE CLASS 5 EVS CH 7)
   ============================================================================ */
export const SolubilityTestTubeTray: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  interface Substance {
    id: string;
    name: string;
    icon: string;
    type: 'soluble' | 'insoluble_sediment' | 'immiscible_layer';
    color: string;
    description: string;
  }

  const SUBSTANCES: Substance[] = [
    { id: 'salt', name: 'Table Salt', icon: '🧂', type: 'soluble', color: '#38bdf8', description: 'Dissolves completely into clear salt solution' },
    { id: 'sugar', name: 'Sugar Crystals', icon: '🍬', type: 'soluble', color: '#38bdf8', description: 'Dissolves completely into sweet clear solution' },
    { id: 'chalk', name: 'Chalk Powder', icon: '🖍️', type: 'insoluble_sediment', color: '#e2e8f0', description: 'Turns water cloudy, then settles as white sediment at bottom' },
    { id: 'oil', name: 'Mustard Oil', icon: '🛢️', type: 'immiscible_layer', color: '#eab308', description: 'Does not mix; floats as a separate golden layer on top' },
    { id: 'sand', name: 'Fine Soil / Sand', icon: '🏖️', type: 'insoluble_sediment', color: '#78350f', description: 'Insoluble; forms a thick brown sediment layer at the bottom' },
  ];

  const [testedMap, setTestedMap] = useState<Record<string, boolean>>({});
  const [activeSubstance, setActiveSubstance] = useState<Substance>(SUBSTANCES[0]);
  const [isStirring, setIsStirring] = useState(false);

  const handleTestSubstance = (sub: Substance) => {
    sounds.pop();
    setActiveSubstance(sub);
    setIsStirring(true);

    setTimeout(() => {
      sounds.success();
      setIsStirring(false);
      const newMap = { ...testedMap, [sub.id]: true };
      setTestedMap(newMap);

      voiceAssistant.speak(
        `${sub.name} tested! ${sub.description}`
      );

      if (Object.keys(newMap).length >= 4 && onCompleted) {
        onCompleted();
      }
    }, 1200);
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-teal-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-1">Solubility & Dissolution Laboratory Rack</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Select a substance and stir with the glass rod to discover if it dissolves, settles as sediment, or separates into layers!
      </p>

      {/* 5 Substance Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full mb-6">
        {SUBSTANCES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleTestSubstance(s)}
            className={`p-3 rounded-2xl border-2 font-black text-xs text-center cursor-pointer transition-all ${
              activeSubstance.id === s.id
                ? 'bg-teal-400 border-teal-600 text-slate-950 shadow-md scale-102 ring-2 ring-teal-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-teal-50'
            }`}
          >
            <span className="text-2xl block">{s.icon}</span>
            <span className="block mt-1">{s.name}</span>
            {testedMap[s.id] && <span className="text-[9px] text-teal-800 font-bold block">✓ Tested</span>}
          </button>
        ))}
      </div>

      {/* Test Tube Rack Stage */}
      <div className="relative w-full max-w-lg h-72 rounded-3xl bg-slate-950 border-3 border-teal-500 shadow-2xl flex items-center justify-center p-6 text-white overflow-hidden">
        {/* Test Tube */}
        <div className="relative w-20 h-52 border-4 border-slate-400 rounded-b-full bg-slate-800/40 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-2xl">
          {/* Liquid Behavior based on substance */}
          <div
            className={`w-full transition-all duration-700 relative ${
              activeSubstance.type === 'soluble'
                ? 'h-36 bg-sky-400/50'
                : activeSubstance.type === 'immiscible_layer'
                ? 'h-36 bg-gradient-to-t from-sky-400/50 to-amber-400/80'
                : 'h-36 bg-slate-400/40'
            }`}
          >
            {/* Sediment Layer at Bottom for Insoluble Solids */}
            {activeSubstance.type === 'insoluble_sediment' && !isStirring && (
              <div
                className="w-full h-8 absolute bottom-0 rounded-b-full shadow-inner"
                style={{ backgroundColor: activeSubstance.color }}
              />
            )}

            {/* Oil Layer Floating on Top for Immiscible Liquids */}
            {activeSubstance.type === 'immiscible_layer' && !isStirring && (
              <div className="w-full h-10 bg-amber-400 border-b-2 border-amber-500 absolute top-0 flex items-center justify-center text-[8px] font-black text-slate-950">
                Oil Layer
              </div>
            )}
          </div>

          {/* Stirring Glass Rod (Animated) */}
          {isStirring && (
            <motion.div
              animate={{ rotate: [-10, 10, -10], x: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="w-2.5 h-44 bg-cyan-200/80 border border-white rounded-full absolute -top-10 left-1/2 -translate-x-1/2 shadow-lg"
            />
          )}
        </div>

        {/* Observation Results Panel */}
        <div className="ml-8 flex flex-col justify-center max-w-xs">
          <span className="text-xs font-black uppercase text-teal-400 mb-1">
            🧪 Observation Result:
          </span>
          <h4 className="text-base font-black text-white mb-1">
            {activeSubstance.name} ({activeSubstance.icon})
          </h4>
          <p className="text-xs text-slate-300 font-bold leading-relaxed mb-3">
            {activeSubstance.description}
          </p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black w-fit uppercase ${
              activeSubstance.type === 'soluble'
                ? 'bg-emerald-500 text-slate-950'
                : activeSubstance.type === 'immiscible_layer'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-rose-500 text-white'
            }`}
          >
            Category: {activeSubstance.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="w-full bg-teal-50 p-4 rounded-2xl border-2 border-teal-200 text-center text-xs font-bold text-teal-950 mt-4">
        🔬 <strong>NCERT Classification Law:</strong> Substances that mix completely into water without separating are <strong>Soluble</strong>. Solids that settle at the bottom form <strong>Sediment</strong>. Liquids like oil that do not mix are <strong>Immiscible</strong> and float because oil is lighter than water!
      </div>
    </div>
  );
};

/* ============================================================================
   3. ♨️ EVAPORATION & CONDENSATION DISTILLATION CYCLE (CBSE CLASS 5 EVS CH 7)
   ============================================================================ */
export const EvaporationDistillationCycleLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [heatPower, setHeatPower] = useState(0); // 0 (off) to 100 (boiling)
  const isBoiling = heatPower >= 70;

  const handleHeatChange = (val: number) => {
    setHeatPower(val);
    if (val >= 80) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Boiling active! Pure water evaporates as hot steam, hits the cold condensation plate, and drips into the clean beaker, leaving white salt crystals in the boiling pan!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-1">Evaporation & Condensation Distillation Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Turn up the Bunsen burner flame to evaporate salt water and collect pure distilled condensation droplets!
      </p>

      {/* Distillation Apparatus Stage */}
      <div className="relative w-full max-w-lg h-72 rounded-3xl bg-slate-950 border-3 border-amber-400 shadow-2xl flex items-center justify-between p-6 text-white overflow-hidden">
        {/* Left: Boiling Salt Water Pan */}
        <div className="flex flex-col items-center">
          {/* Steam Vapors Rising */}
          <div className="h-16 flex items-center gap-1">
            {isBoiling && (
              <>
                <motion.div animate={{ y: [0, -25], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-xs">💨</motion.div>
                <motion.div animate={{ y: [0, -25], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1.3 }} className="text-xs">💨</motion.div>
                <motion.div animate={{ y: [0, -25], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="text-xs">💨</motion.div>
              </>
            )}
          </div>
          {/* Glass Boiling Flask */}
          <div className="w-24 h-24 rounded-full border-3 border-slate-400 bg-sky-900/40 relative overflow-hidden flex items-end justify-center">
            <div className="w-full h-12 bg-sky-400/60 flex items-center justify-center">
              {isBoiling && <span className="text-[9px] font-black text-amber-200 animate-pulse">Salt Residue 🧂</span>}
            </div>
          </div>
          {/* Bunsen Burner Flame */}
          <div className="h-10 flex items-center justify-center mt-1">
            {heatPower > 0 ? (
              <motion.div
                animate={{ scaleY: [1, 1.2, 1], scaleX: [1, 0.9, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="text-2xl"
              >
                🔥
              </motion.div>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold">Flame OFF</span>
            )}
          </div>
        </div>

        {/* Cold Slanted Condenser Plate */}
        <div className="w-32 h-2 bg-slate-300 border border-white rotate-12 relative flex items-center justify-around shadow-md">
          {isBoiling && (
            <motion.div
              animate={{ x: [0, 40], y: [0, 15] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeIn' }}
              className="w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9]"
            />
          )}
        </div>

        {/* Right: Clean Distilled Water Collection Beaker */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-28 border-3 border-slate-400 rounded-b-xl bg-slate-900 relative overflow-hidden flex flex-col justify-end p-1">
            <motion.div
              animate={{ height: isBoiling ? '60%' : '10%' }}
              transition={{ duration: 1 }}
              className="w-full bg-cyan-400/80 rounded-b-lg flex items-center justify-center"
            >
              <span className="text-[8px] font-black text-slate-950">Pure Water 💧</span>
            </motion.div>
          </div>
          <span className="text-[10px] font-black text-cyan-300 mt-2 uppercase">Distilled Water</span>
        </div>
      </div>

      {/* Burner Flame Slider */}
      <div className="w-full max-w-md my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Cold (0%)</span>
          <span className="text-amber-600 font-bold bg-amber-100 px-3 py-1 rounded-full">
            Burner Flame: {heatPower}%
          </span>
          <span>Boiling Max (100%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={heatPower}
          onChange={(e) => handleHeatChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="w-full bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-center text-xs font-bold text-amber-950">
        ♨️ <strong>Dandi March & Water Cycle Law:</strong> When heat evaporates saltwater, only pure water molecules turn to vapor gas and condense into clean water. Minerals and salt crystals never evaporate and stay behind!
      </div>
    </div>
  );
};
