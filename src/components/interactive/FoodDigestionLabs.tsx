import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  Droplets,
  Thermometer,
  RotateCcw,
  ZoomIn,
  CheckCircle2,
} from 'lucide-react';
import { VectorTongueTasteMapGraphic } from '@/components/illustrations/Theme1Illustrations';

/* ============================================================================
   1. 👅 TONGUE TASTE INTERACTIVE TRAY LAB (CBSE CLASS 5 EVS CH 3)
   ============================================================================ */
export const TongueTasteInteractiveTrayLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeFlavor, setActiveFlavor] = useState<'sweet' | 'salty' | 'sour' | 'bitter'>('sweet');
  const [testedCount, setTestedCount] = useState(1);

  const FOODS = [
    { id: 'sweet', name: 'Sweet Jaggery / Honey', icon: '🍯', zone: 'Front Tip', color: 'border-pink-400 bg-pink-100 text-pink-900', explanation: 'Sweet taste receptors are densely concentrated at the front tip of your tongue!' },
    { id: 'salty', name: 'Rock Salt / Pretzel', icon: '🥨', zone: 'Front Sides', color: 'border-sky-400 bg-sky-100 text-sky-900', explanation: 'Salt taste channels detect sodium ions on both front sides of your tongue!' },
    { id: 'sour', name: 'Sour Lemon / Tamarind', icon: '🍋', zone: 'Back Sides', color: 'border-amber-400 bg-amber-100 text-amber-900', explanation: 'Sour acid sensors activate taste buds along the back lateral edges of the tongue!' },
    { id: 'bitter', name: 'Bitter Neem / Karela', icon: '🌿', zone: 'Deep Back', color: 'border-emerald-400 bg-emerald-100 text-emerald-900', explanation: 'Bitter taste receptors are at the very back of the tongue to protect us from swallowing toxins!' },
  ];

  const handleTestFood = (flavor: 'sweet' | 'salty' | 'sour' | 'bitter') => {
    sounds.pop();
    setActiveFlavor(flavor);
    sounds.sparkle();

    const newCount = testedCount + 1;
    setTestedCount(newCount);

    const fObj = FOODS.find((f) => f.id === flavor);
    if (fObj) {
      voiceAssistant.speak(`${fObj.name} placed on tongue! ${fObj.explanation}`);
    }

    if (newCount >= 4 && onCompleted) {
      onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-orange-400 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-1">Anatomical Tongue Taste Receptor Lab</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Select a food specimen from the tray to stimulate the corresponding taste bud papillae zone!
      </p>

      {/* 4 Draggable/Clickable Food Morsels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl mb-4">
        {FOODS.map((f) => (
          <button
            key={f.id}
            onClick={() => handleTestFood(f.id as any)}
            className={`p-3 rounded-2xl border-2 font-black text-xs text-center cursor-pointer transition-all ${
              activeFlavor === f.id
                ? `${f.color} shadow-lg scale-102 ring-2 ring-orange-300 font-black`
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-50'
            }`}
          >
            <span className="text-2xl block">{f.icon}</span>
            <span className="block mt-1">{f.name}</span>
            <span className="text-[10px] font-bold block mt-0.5 text-slate-500">{f.zone}</span>
          </button>
        ))}
      </div>

      {/* Anatomical Visual Vector Tongue */}
      <div className="my-2">
        <VectorTongueTasteMapGraphic activeZone={activeFlavor} />
      </div>

      <div className="w-full bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 text-center text-xs font-bold text-orange-950 mt-4">
        👅 <strong>Gustatory Taste Sensation:</strong> Each fungiform papilla on your tongue contains 50 to 100 microscopic taste receptor cells that send electric nerve signals to the brain!
      </div>
    </div>
  );
};

/* ============================================================================
   2. 🍞 BREAD MOLD SPOILAGE 5-DAY ENVIRONMENTAL MATRIX (CBSE CH 4)
   ============================================================================ */
export const BreadMoldEnvironmentalTimelapseLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [day, setDay] = useState(1);
  const [activeDish, setActiveDish] = useState<'moist_warm' | 'dry_warm' | 'dry_cold' | 'moist_cold'>('moist_warm');

  const DISHES = [
    { id: 'moist_warm', title: '1. Moist + Warm (Sealed Box)', moisture: true, warm: true, moldGrowth: day * 22, description: 'High moisture and room temperature fuel rapid fungal germination!' },
    { id: 'dry_warm', title: '2. Dry + Warm (Open Room)', moisture: false, warm: true, moldGrowth: 0, description: 'Lacks moisture; bread dries and turns stale without mold.' },
    { id: 'moist_cold', title: '3. Moist + Cold (Fridge)', moisture: true, warm: false, moldGrowth: day * 4, description: 'Cold temperatures slow down fungal reproduction.' },
    { id: 'dry_cold', title: '4. Dry + Cold (Fridge)', moisture: false, warm: false, moldGrowth: 0, description: 'Zero mold; preservation conditions keep bread safe.' },
  ];

  const currentDishObj = DISHES.find((d) => d.id === activeDish) || DISHES[0];

  const handleDayChange = (val: number) => {
    setDay(val);
    if (val >= 5 && activeDish === 'moist_warm') {
      sounds.fanfare();
      voiceAssistant.speak(
        'Day 5 observation: In moist, warm conditions, black bread mold (Rhizopus) flourishes with fuzzy mycelium and millions of black spore heads!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-lime-500 shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-black text-slate-900 mb-1">Bread Spoilage & Fungal Mold Laboratory</h3>
      <p className="text-xs text-slate-600 font-bold mb-4 text-center max-w-md">
        Investigate how moisture and temperature influence fungal spore (*Rhizopus*) growth over 5 days!
      </p>

      {/* 4 Environmental Condition Dishes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-4">
        {DISHES.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              sounds.pop();
              setActiveDish(d.id as any);
            }}
            className={`p-3 rounded-2xl border-2 font-black text-xs text-center cursor-pointer transition-all ${
              activeDish === d.id
                ? 'bg-lime-400 border-lime-600 text-slate-950 shadow-md scale-102 ring-2 ring-lime-300'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-lime-50'
            }`}
          >
            <span className="block">{d.title}</span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Mold: {Math.min(100, d.moldGrowth)}%
            </span>
          </button>
        ))}
      </div>

      {/* Petri Dish Stage with Dynamic Spore Growth */}
      <div className="relative w-64 h-64 rounded-full bg-slate-900 border-6 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden my-2">
        {/* Bread Slice */}
        <div className="w-36 h-36 bg-amber-100 border-4 border-amber-300 rounded-2xl relative flex items-center justify-center overflow-hidden shadow-md">
          {/* Dynamic Fungal Mycelium & Mold Spots */}
          {currentDishObj.moldGrowth > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: currentDishObj.moldGrowth / 100 }}
                className="w-28 h-28 rounded-full bg-slate-950/80 blur-[2px] relative flex items-center justify-center"
              >
                {/* Green/White fungal spore fuzz */}
                <div className="w-20 h-20 rounded-full bg-emerald-800/70" />
                <div className="w-12 h-12 rounded-full bg-slate-950" />
              </motion.div>
            </div>
          )}
          <span className="text-xs font-black text-amber-900 select-none z-10">BREAD</span>
        </div>

        {/* Day Badge */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-lime-400 text-[10px] font-black text-lime-300">
          Day {day} • {currentDishObj.moldGrowth > 0 ? 'Fungal Mold Active' : 'No Spore Growth'}
        </div>
      </div>

      {/* 5-Day Timelapse Slider */}
      <div className="w-full max-w-md my-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-700">
          <span>Day 1 (Fresh)</span>
          <span className="text-lime-700 font-black text-sm bg-lime-100 px-3 py-1 rounded-full">
            Timelapse: Day {day} of 5
          </span>
          <span>Day 5 (Spoiled)</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={day}
          onChange={(e) => handleDayChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-lime-200 rounded-lg appearance-none cursor-pointer accent-lime-500"
        />
      </div>

      <div className="w-full bg-lime-50 p-4 rounded-2xl border-2 border-lime-200 text-center text-xs font-bold text-lime-950">
        🍞 <strong>NCERT Food Spoilage Law:</strong> Microscopic fungal spores (*Rhizopus*) exist everywhere in air. When provided with both <strong>Moisture (Water)</strong> and <strong>Warmth (Heat)</strong>, they germinate rapidly. Keeping food dry or cold in refrigerators prevents spoilage!
      </div>
    </div>
  );
};
