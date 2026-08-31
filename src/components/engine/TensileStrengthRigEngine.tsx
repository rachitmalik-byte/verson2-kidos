import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TensileStrengthRigData } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Plus, Minus, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  data: TensileStrengthRigData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const TensileStrengthRigEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(data.specimens[0]?.id || '');
  const [currentWeightGrams, setCurrentWeightGrams] = useState<number>(0);
  const [testedSpecimens, setTestedSpecimens] = useState<Record<string, boolean>>({});

  const currentSpecimen = data.specimens.find((s) => s.id === selectedSpecimenId) || data.specimens[0];
  const isSnapped = currentWeightGrams >= currentSpecimen.breakingWeightGrams;

  const handleAddWeight = () => {
    if (isSnapped) return;
    sounds.bubble();
    const nextWeight = currentWeightGrams + data.weightIncrementGrams;
    setCurrentWeightGrams(nextWeight);

    if (nextWeight >= currentSpecimen.breakingWeightGrams) {
      sounds.boing();
      setTestedSpecimens((prev) => {
        const next = { ...prev, [selectedSpecimenId]: true };
        if (data.specimens.every((s) => next[s.id])) {
          sounds.fanfare();
          onComplete();
        }
        return next;
      });
    }
  };

  const handleRemoveWeight = () => {
    if (currentWeightGrams <= 0) return;
    sounds.pop();
    setCurrentWeightGrams((prev) => Math.max(0, prev - data.weightIncrementGrams));
  };

  const handleSwitchSpecimen = (id: string) => {
    sounds.pop();
    setSelectedSpecimenId(id);
    setCurrentWeightGrams(0);
  };

  const getThreadColor = () => {
    const m = currentSpecimen.material.toLowerCase();
    if (m.includes('steel')) return 'bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.9)]';
    if (m.includes('nylon')) return 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]';
    if (m.includes('wool')) return 'bg-amber-300';
    if (m.includes('silk')) return 'bg-purple-300';
    return 'bg-amber-100';
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Specimen Switcher (Cotton, Wool, Silk, Nylon, Braided Steel) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {data.specimens.map((s) => {
          const isSelected = s.id === selectedSpecimenId;
          const isDone = testedSpecimens[s.id];
          return (
            <button
              key={s.id}
              onClick={() => handleSwitchSpecimen(s.id)}
              className={`px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                  : 'bg-white/90 text-slate-700 hover:bg-white border-2 border-slate-200'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
            </button>
          );
        })}
      </div>

      {/* Physics Tensile Testing Rig Stage */}
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-5 sm:p-7 border-3 border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6">
        {/* Vertical Rig Simulator */}
        <div className="relative w-64 h-84 rounded-3xl border-4 border-slate-300 bg-slate-900 flex flex-col items-center justify-between p-4 shrink-0 overflow-hidden shadow-2xl">
          {/* Top Anchor Beam */}
          <div className="w-full h-7 bg-slate-700 rounded-lg border-b-2 border-slate-500 flex items-center justify-center">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-300">
              Laboratory Tensile Clamp
            </span>
          </div>

          {/* Suspended Fiber Thread with Dynamic Strain Stretch */}
          <div className="relative w-full flex-1 flex flex-col items-center justify-center">
            {!isSnapped ? (
              <motion.div
                animate={{
                  scaleY: 1 + (currentWeightGrams / currentSpecimen.breakingWeightGrams) * 0.25,
                }}
                className={`w-2 rounded-full transition-all duration-300 ${getThreadColor()}`}
                style={{ height: '120px' }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-rose-400">
                <div className="w-2 h-10 bg-rose-500 rounded-full" />
                <span className="text-xs font-black uppercase tracking-widest bg-rose-950 text-rose-300 px-3 py-1 rounded-full border border-rose-500 shadow-md">
                  ⚡ SNAPPED!
                </span>
                <div className="w-2 h-10 bg-rose-500 rounded-full" />
              </div>
            )}
          </div>

          {/* Bottom Suspended Weight Pan */}
          <motion.div
            animate={{
              y: isSnapped ? 45 : (currentWeightGrams / currentSpecimen.breakingWeightGrams) * 20,
            }}
            className="w-52 bg-slate-800 rounded-2xl p-2.5 border-2 border-slate-600 flex flex-col items-center shadow-lg"
          >
            <div className="flex items-center gap-1.5 text-amber-300 font-black text-sm">
              <span>⚖️ Applied Load:</span>
              <span className="text-white">{currentWeightGrams}g</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Breaking Threshold: {currentSpecimen.breakingWeightGrams}g
            </span>
          </motion.div>
        </div>

        {/* Rig Controls & Observations */}
        <div className="flex-1 flex flex-col justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {currentSpecimen.material}
              </span>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {currentSpecimen.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
              {currentSpecimen.description}
            </p>

            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950">
              <span className="text-xs font-black uppercase tracking-wider block mb-1">
                Real-World Engineering Application:
              </span>
              <p className="text-xs font-bold leading-relaxed">
                {currentSpecimen.realWorldUse}
              </p>
            </div>
          </div>

          {/* Load Adjuster Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveWeight}
                disabled={currentWeightGrams <= 0 || isSnapped}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-40 border border-slate-300"
              >
                <Minus className="w-4 h-4" />
                <span>- {data.weightIncrementGrams}g</span>
              </button>

              <button
                onClick={handleAddWeight}
                disabled={isSnapped}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-40 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ {data.weightIncrementGrams}g Load</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentWeightGrams(0)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Testing Weights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
