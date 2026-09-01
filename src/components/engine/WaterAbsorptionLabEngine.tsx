import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WaterAbsorptionLabData, WaterSpecimen } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, CheckCircle2, RotateCcw, Info } from 'lucide-react';

interface Props {
  data: WaterAbsorptionLabData;
  onComplete: () => void;
  isCompleted?: boolean;
}

const DEFAULT_SPECIMENS: WaterSpecimen[] = [
  {
    id: 'cotton',
    name: 'Cotton Swatch',
    materialType: 'cotton',
    category: 'Natural',
    dryImage: '',
    wetImage: '',
    isHydrophobic: false,
    absorptionRateSec: 2,
    description: 'Natural porous cellulose fibers absorb water rapidly',
    microscopicNote: 'Porous twisted ribbon fibers soak up moisture',
  },
  {
    id: 'polyester',
    name: 'Polyester Swatch',
    materialType: 'polyester',
    category: 'Synthetic',
    dryImage: '',
    wetImage: '',
    isHydrophobic: true,
    absorptionRateSec: 999,
    description: 'Synthetic non-porous polymer causes water to bead up',
    microscopicNote: 'Smooth extruded synthetic filaments form a waterproof seal',
  },
];

export const WaterAbsorptionLabEngine: React.FC<Props> = ({ data, onComplete }) => {
  const specimens: WaterSpecimen[] = data?.specimens && data.specimens.length > 0 ? data.specimens : DEFAULT_SPECIMENS;
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(specimens[0]?.id || 'cotton');
  const [sprayedSpecimens, setSprayedSpecimens] = useState<Record<string, boolean>>({});
  const [isSpraying, setIsSpraying] = useState(false);

  useEffect(() => {
    setSelectedSpecimenId(specimens[0]?.id || 'cotton');
    setSprayedSpecimens({});
    setIsSpraying(false);
  }, [data]);

  const currentSpecimen = specimens.find((s) => s.id === selectedSpecimenId) || specimens[0] || DEFAULT_SPECIMENS[0];
  const isCurrentSprayed = Boolean(sprayedSpecimens[currentSpecimen.id]);

  const handleSpray = () => {
    if (isSpraying) return;
    setIsSpraying(true);
    sounds.bubble();
    voiceAssistant.stop();

    setTimeout(() => {
      setSprayedSpecimens((prev) => {
        const next = { ...prev, [currentSpecimen.id]: true };
        const nowAllDone = specimens.every((s) => next[s.id]);
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
    <div className="w-full flex flex-col items-center gap-5 select-none font-sans">
      {/* Specimen Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {specimens.map((s) => {
          const isDone = sprayedSpecimens[s.id];
          const isSelected = s.id === currentSpecimen.id;
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
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-inner border-4 border-slate-200 bg-slate-900 shrink-0 flex items-center justify-center">
          {currentSpecimen.dryImage ? (
            <img
              src={isCurrentSprayed ? currentSpecimen.wetImage || currentSpecimen.dryImage : currentSpecimen.dryImage}
              alt={currentSpecimen.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-5xl block mb-2">{currentSpecimen.category === 'Natural' ? '🌿' : '🧪'}</span>
              <span className="text-xs font-black text-white">{currentSpecimen.name}</span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isCurrentSprayed ? (currentSpecimen.isHydrophobic ? '💧 Water Beaded' : '🌊 Moisture Soaked') : 'Ready for Spray'}
              </span>
            </div>
          )}

          {/* Dynamic Water Drops Overlay */}
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
                    transition={{ delay: idx * 0.1, type: 'spring' }}
                    className="absolute rounded-full bg-gradient-to-tr from-sky-400/80 via-white/90 to-sky-200/90 shadow-[0_0_12px_rgba(56,189,248,0.9)] border border-white"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: pos.size,
                      height: pos.size,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom HUD Indicator */}
          <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md rounded-2xl py-1.5 px-3 text-center text-xs font-mono font-black text-white flex items-center justify-between">
            <span className="text-amber-300">{currentSpecimen.name}</span>
            <span className={isCurrentSprayed ? (currentSpecimen.isHydrophobic ? 'text-cyan-400' : 'text-amber-400') : 'text-slate-400'}>
              {isCurrentSprayed ? (currentSpecimen.isHydrophobic ? 'Hydrophobic 💧' : 'Absorbent 🌊') : 'Dry Specimen'}
            </span>
          </div>
        </div>

        {/* Observation & Controls */}
        <div className="flex-1 flex flex-col justify-between gap-4 w-full text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                currentSpecimen.category === 'Natural' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
              }`}>
                {currentSpecimen.category} Material
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {currentSpecimen.name}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1.5 leading-relaxed">
              {currentSpecimen.description}
            </p>

            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 mt-3 text-xs font-bold text-slate-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>{currentSpecimen.microscopicNote}</span>
            </div>
          </div>

          {/* Spray Trigger Button */}
          <button
            onClick={handleSpray}
            disabled={isSpraying}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            <span>{isSpraying ? 'Spraying Droplets...' : 'Spray Water Droplets 💦'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
