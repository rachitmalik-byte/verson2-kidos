import { ThreeBreadMoldLab } from '@/components/three-lab/ThreeBreadMoldLab';
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
   2. 🍞 BREAD MOLD SPOILAGE 5-DAY ENVIRONMENTAL MATRIX (THREE.JS 3D)
   ============================================================================ */
export const BreadMoldEnvironmentalTimelapseLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-[36px] border-4 border-lime-500 shadow-xl flex flex-col items-center select-none font-sans">
      <div className="text-center mb-4 max-w-xl">
        <span className="px-3.5 py-1 bg-lime-100 text-lime-950 font-black text-xs rounded-full border border-lime-300 inline-block mb-1.5">
          🍞 CBSE Class 5 EVS • Food Preservation Science
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
          3D Bread Spoilage & Fungal Mold Laboratory
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
          Investigate how moisture and temperature fuel microscopic fungal spores (<em>Rhizopus stolonifer</em>) into fuzzy black mold across 5 days in full 3D!
        </p>
      </div>

      <div className="w-full">
        <ThreeBreadMoldLab onCompleted={onCompleted} />
      </div>
    </div>
  );
};

