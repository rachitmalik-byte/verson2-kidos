import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WaterAbsorptionLabData } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, CheckCircle2, RotateCcw, Info } from 'lucide-react';

interface Props {
  data: WaterAbsorptionLabData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const WaterAbsorptionLabEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(data.specimens[0]?.id || '');
  const [sprayedSpecimens, setSprayedSpecimens] = useState<Record<string, boolean>>({});
  const [isSpraying, setIsSpraying] = useState(false);

  const currentSpecimen = data.specimens.find((s) => s.id === selectedSpecimenId) || data.specimens[0];
  const isCurrentSprayed = Boolean(sprayedSpecimens[selectedSpecimenId]);

  const handleSpray = () => {
    if (isSpraying) return;
    setIsSpraying(true);
    sounds.bubble();
    voiceAssistant.stop();

    setTimeout(() => {
      setSprayedSpecimens((prev) => {
        const next = { ...prev, [selectedSpecimenId]: true };
        const nowAllDone = data.specimens.every((s) => next[s.id]);
        if (nowAllDone) {
          sounds.fanfare();
          onComplete();
        } else {
          sounds.sparkle();
        }
        return next;
      });
      setIsSpraying(false);
    }, 600);
  };

  const handleReset = () => {
    sounds.pop();
    setSprayedSpecimens({});
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Specimen Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {data.specimens.map((s) => {
          const isDone = sprayedSpecimens[s.id];
          const isSelected = s.id === selectedSpecimenId;
          return (
            <button
              key={s.id}
              onClick={() => {
                sounds.pop();
                setSelectedSpecimenId(s.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                  : 'bg-white/90 text-slate-700 hover:bg-white border-2 border-slate-200'
              }`}
            >
              <span>{s.category === 'Natural' ? '🌿' : '🧪'}</span>
              <span>{s.name}</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Physics Testing Stage */}
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-5 sm:p-7 border-3 border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        {/* Specimen Fabric Swatch Viewer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-inner border-4 border-slate-200 bg-slate-900 shrink-0">
          <img
            src={isCurrentSprayed ? currentSpecimen.wetImage : currentSpecimen.dryImage}
            alt={currentSpecimen.name}
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Dynamic 3D Specular Water Bead Simulation Overlay for Hydrophobic */}
          {isCurrentSprayed && currentSpecimen.isHydrophobic && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-full h-full">
                {[
                  { top: '35%', left: '42%', size: 36 },
                  { top: '55%', left: '60%', size: 28 },
                  { top: '48%', left: '28%', size: 24 },
                  { top: '65%', left: '45%', size: 20 },
                ].map((pos, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: `${pos.size}px`,
                      height: `${pos.size}px`,
                      background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.7) 45%, rgba(2,132,199,0.9) 85%)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.3)',
                    }}
                    className="absolute rounded-full shadow-2xl -translate-x-1/2 -translate-y-1/2 border border-white/60"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1.5 left-1.5 filter drop-shadow-xs" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Radial Dampening Moisture Gradient for Hydrophilic (Absorbed) */}
          {isCurrentSprayed && !currentSpecimen.isHydrophobic && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div
                className="w-48 h-48 rounded-full filter blur-md"
                style={{
                  background: 'radial-gradient(circle, rgba(15,23,42,0.65) 0%, rgba(30,41,59,0.35) 60%, transparent 100%)',
                }}
              />
            </motion.div>
          )}

          {/* Water Spray Animation Overlay */}
          <AnimatePresence>
            {isSpraying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center bg-sky-400/20 backdrop-blur-2xs"
              >
                <div className="flex flex-col items-center gap-1 text-sky-200 font-black text-sm drop-shadow-md">
                  <Droplets className="w-10 h-10 animate-bounce text-sky-300" />
                  <span>Spraying Water Mist...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-white border border-white/20">
              {isCurrentSprayed ? (currentSpecimen.isHydrophobic ? 'Hydrophobic 💧' : 'Water Absorbed 🌧️') : 'Dry Specimen'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
              {currentSpecimen.category}
            </span>
          </div>
        </div>

        {/* Observation & Controls Panel */}
        <div className="flex-1 flex flex-col justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {currentSpecimen.materialType.toUpperCase()}
              </span>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {currentSpecimen.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
              {currentSpecimen.description}
            </p>

            <div className={`mt-3 p-3.5 rounded-2xl border-2 transition-all ${
              isCurrentSprayed
                ? currentSpecimen.isHydrophobic
                  ? 'bg-sky-50 border-sky-300 text-sky-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-black mb-1">
                <Info className="w-4 h-4" />
                <span>Microscopic Behavior:</span>
              </div>
              <p className="text-xs font-bold leading-relaxed">
                {isCurrentSprayed
                  ? currentSpecimen.microscopicNote
                  : 'Tap "Spray Water Mist" to test how water interacts with these fibers!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={handleSpray}
              disabled={isSpraying}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              <Droplets className="w-4 h-4 fill-current" />
              <span>{isCurrentSprayed ? 'Spray Again 💦' : 'Spray Water Mist 🚿'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all border border-slate-300"
              title="Reset Tests"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
