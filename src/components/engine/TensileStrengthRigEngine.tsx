import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TensileStrengthRigData } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Scale, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

import cottonRopeIntactImg from '@/assets/images/experiments/cotton_rope_intact.jpg';
import cottonRopeSnappedImg from '@/assets/images/experiments/cotton_rope_snapped.jpg';
import woolRopeIntactImg from '@/assets/images/experiments/wool_rope_intact.jpg';
import woolRopeSnappedImg from '@/assets/images/experiments/wool_rope_snapped.jpg';
import silkCordIntactImg from '@/assets/images/experiments/silk_cord_intact.jpg';
import silkCordSnappedImg from '@/assets/images/experiments/silk_cord_snapped.jpg';
import nylonRopeIntactImg from '@/assets/images/experiments/nylon_rope_intact.jpg';
import nylonRopeSnappedImg from '@/assets/images/experiments/nylon_rope_snapped.jpg';
import steelCableIntactImg from '@/assets/images/experiments/steel_cable_intact.jpg';
import steelCableHoldingImg from '@/assets/images/experiments/steel_cable_holding.jpg';

interface Props {
  data: TensileStrengthRigData;
  onComplete: () => void;
  isCompleted?: boolean;
}

interface SpecimenConfig {
  id: string;
  name: string;
  category: string;
  icon: string;
  breakingLimitKg: number;
  explanation: string;
  failureReason: string;
  intactImage: string;
  snappedImage: string;
}

const SPECIMENS: SpecimenConfig[] = [
  {
    id: 'cotton',
    name: 'Natural Cotton Rope',
    category: 'Natural Plant',
    icon: '🧵',
    breakingLimitKg: 2,
    explanation: 'Made from short fluffy plant fibers twisted together.',
    failureReason: 'The short plant fibers pulled apart and unraveled under heavy weight!',
    intactImage: cottonRopeIntactImg,
    snappedImage: cottonRopeSnappedImg,
  },
  {
    id: 'wool',
    name: 'Natural Wool Cord',
    category: 'Natural Animal',
    icon: '🧶',
    breakingLimitKg: 3,
    explanation: 'Made from soft curly sheep fleece hairs.',
    failureReason: 'Curly animal hairs stretched out and snapped apart in the clamps!',
    intactImage: woolRopeIntactImg,
    snappedImage: woolRopeSnappedImg,
  },
  {
    id: 'silk',
    name: 'Natural Silk Cord',
    category: 'Natural Animal',
    icon: '🐛',
    breakingLimitKg: 5,
    explanation: 'Spun by silkworm caterpillars into smooth shiny threads.',
    failureReason: 'Fine caterpillar protein strands snapped under heavy tensile load!',
    intactImage: silkCordIntactImg,
    snappedImage: silkCordSnappedImg,
  },
  {
    id: 'nylon',
    name: 'Synthetic Nylon Rope',
    category: 'Synthetic Polymer',
    icon: '🪢',
    breakingLimitKg: 25,
    explanation: 'Made in factories from long, unbreakable plastic chains.',
    failureReason: 'Held immense weight before finally snapping at extreme force!',
    intactImage: nylonRopeIntactImg,
    snappedImage: nylonRopeSnappedImg,
  },
  {
    id: 'steel',
    name: 'Braided Steel Wire Cable',
    category: 'Metallic Alloy',
    icon: '⚙️',
    breakingLimitKg: 50,
    explanation: 'Made of strong braided metal wires locked tightly together.',
    failureReason: 'Never snaps! Steel wire cables can easily lift cars and elevators!',
    intactImage: steelCableIntactImg,
    snappedImage: steelCableHoldingImg,
  },
];

export const TensileStrengthRigEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>('cotton');
  const [appliedWeightKg, setAppliedWeightKg] = useState<number>(0);
  const [testedSpecimens, setTestedSpecimens] = useState<Record<string, boolean>>({});

  const currentSpecimen = SPECIMENS.find((s) => s.id === selectedSpecimenId) || SPECIMENS[0];
  const isSnapped = appliedWeightKg >= currentSpecimen.breakingLimitKg;

  const handleSelectSpecimen = (id: string) => {
    sounds.pop();
    setSelectedSpecimenId(id);
    setAppliedWeightKg(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAppliedWeightKg(val);

    if (val >= currentSpecimen.breakingLimitKg) {
      sounds.tensionSnap();
      setTestedSpecimens((prev) => {
        const next = { ...prev, [selectedSpecimenId]: true };
        if (Object.keys(next).length >= 2) {
          sounds.fanfare();
          onComplete();
        }
        return next;
      });
      voiceAssistant.speak(`Snap! The ${currentSpecimen.name} snapped at ${val} kilograms!`);
    } else if (val > 0) {
      sounds.pop();
    }
  };

  const handleApplyPreset = (kg: number) => {
    setAppliedWeightKg(kg);
    if (kg >= currentSpecimen.breakingLimitKg) {
      sounds.tensionSnap();
      setTestedSpecimens((prev) => {
        const next = { ...prev, [selectedSpecimenId]: true };
        if (Object.keys(next).length >= 2) {
          sounds.fanfare();
          onComplete();
        }
        return next;
      });
      voiceAssistant.speak(`Snap! The ${currentSpecimen.name} broke under ${kg} kilograms!`);
    } else {
      sounds.success();
      voiceAssistant.speak(`The ${currentSpecimen.name} holds ${kg} kilograms easily!`);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-4 border-slate-200 shadow-xl mx-auto">
      {/* Top Header & Dropdown Tabs */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Tensile Testing Workbench
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
            1v1 Rope Breaking Test
          </h3>
        </div>

        {/* Dropdown / Specimen Pill Selector */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {SPECIMENS.map((s) => {
            const isSelected = s.id === selectedSpecimenId;
            const isDone = testedSpecimens[s.id];
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSpecimen(s.id)}
                className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.name.split(' ')[1] || s.name}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1v1 Rig Workbench Display */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
        {/* Left: Dedicated Macro Photography Stage with Dynamic Snapping */}
        <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-300 shadow-xl flex items-center justify-center p-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentSpecimen.id}-${isSnapped ? 'snapped' : 'intact'}`}
              src={isSnapped ? currentSpecimen.snappedImage : currentSpecimen.intactImage}
              alt={currentSpecimen.name}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: isSnapped ? [1, 1.05, 0.98, 1] : 1 + (appliedWeightKg / currentSpecimen.breakingLimitKg) * 0.05,
              }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover rounded-2xl"
            />
          </AnimatePresence>

          {/* Status Overlay Badge */}
          <div className="absolute top-3 left-3">
            {isSnapped ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full border border-white shadow-lg flex items-center gap-1 animate-bounce"
              >
                ⚡ SNAPPED AT {appliedWeightKg} KG!
              </motion.span>
            ) : appliedWeightKg > 0 ? (
              <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                ✓ Holding {appliedWeightKg} kg
              </span>
            ) : (
              <span className="bg-slate-800/80 text-slate-300 font-bold text-xs px-3 py-1 rounded-full">
                Ready for Test
              </span>
            )}
          </div>
        </div>

        {/* Right: Interactive Controls & 5th Grade Science Explanations */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500">{currentSpecimen.category}</span>
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Snap Limit: {currentSpecimen.breakingLimitKg} kg
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-1">{currentSpecimen.name}</h4>
            <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
              {currentSpecimen.explanation}
            </p>
          </div>

          {/* Weight Slider (0 to 50 kg) */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center justify-between font-black text-xs sm:text-sm mb-2">
              <span className="text-slate-700 flex items-center gap-1">
                <Scale className="w-4 h-4 text-amber-500" /> Pulling Weight:
              </span>
              <span className={`text-base font-black ${isSnapped ? 'text-rose-600' : 'text-slate-900'}`}>
                {appliedWeightKg} kg 🏋️
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={appliedWeightKg}
              onChange={handleSliderChange}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-3"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap justify-between">
              {[2, 5, 15, 25, 50].map((kg) => (
                <button
                  key={kg}
                  onClick={() => handleApplyPreset(kg)}
                  className={`px-2.5 py-1.5 rounded-lg font-black text-xs cursor-pointer transition-all ${
                    appliedWeightKg === kg
                      ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {kg} kg
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Explanation */}
          {isSnapped ? (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs font-bold text-rose-900">
              <span className="font-black block mb-0.5">⚡ Why It Snapped:</span>
              {currentSpecimen.failureReason}
            </div>
          ) : appliedWeightKg > 0 ? (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs font-bold text-emerald-900">
              <span className="font-black block mb-0.5">💪 Holding Strong:</span>
              This rope can still carry more weight without breaking!
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress & Next Step Action */}
      <div className="w-full flex items-center justify-between pt-4 border-t-2 border-slate-100 flex-wrap gap-3">
        <span className="text-xs font-bold text-slate-500">
          Tested {Object.keys(testedSpecimens).length} of {SPECIMENS.length} ropes
        </span>

        {Object.keys(testedSpecimens).length >= 2 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer flex items-center gap-2 animate-pulse"
          >
            <span>Continue to Next Step</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
