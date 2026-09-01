import { ThreeMoleculeLab } from '@/components/three-lab/ThreeMoleculeLab';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MicroscopicZoomData, MicroscopicZoomTier } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ZoomIn, Sparkles, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface Props {
  data: MicroscopicZoomData;
  onComplete: () => void;
  isCompleted?: boolean;
}

const DEFAULT_TIERS: MicroscopicZoomTier[] = [
  {
    magnification: '1x',
    label: 'Macro Specimen',
    image: '',
    scaleBarText: '10 mm',
    structuralFeatures: ['Natural Specimen Surface Structure', 'Naked-eye observable characteristics'],
    scientificExplanation: 'Specimens present distinct macroscopic physical properties before optical magnification.',
  },
  {
    magnification: '100x',
    label: '400x High-Power Optical',
    image: '',
    scaleBarText: '50 µm',
    structuralFeatures: ['Microscopic Filament Weave', 'Porous air channels and interlocking polymers'],
    scientificExplanation: 'High-power light microscopy reveals fine cellular alignment and polymer chains.',
  },
];

export const MicroscopicZoomViewerEngine: React.FC<Props> = ({ data, onComplete }) => {
  const tiers: MicroscopicZoomTier[] = data?.tiers && data.tiers.length > 0 ? data.tiers : DEFAULT_TIERS;
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [viewedTiers, setViewedTiers] = useState<number[]>([0]);

  useEffect(() => {
    setSelectedTierIndex(0);
    setViewedTiers([0]);
  }, [data]);

  const currentTier = tiers[selectedTierIndex] || tiers[0];

  const handleSelectTier = (index: number) => {
    sounds.pop();
    setSelectedTierIndex(index);
    setViewedTiers((prev) => {
      const next = prev.includes(index) ? prev : [...prev, index];
      if (next.length === tiers.length) {
        sounds.fanfare();
        onComplete();
      }
      return next;
    });
    voiceAssistant.stop();
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 select-none font-sans">
      {/* 3-Tier Magnification Stepper Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl border-2 border-slate-200 shadow-md">
        {tiers.map((tier, idx) => {
          const isSelected = idx === selectedTierIndex;
          const isDone = viewedTiers.includes(idx);
          return (
            <button
              key={`${tier.magnification}-${idx}`}
              onClick={() => handleSelectTier(idx)}
              className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{tier.magnification}</span>
              <span className="hidden sm:inline font-extrabold text-xs">({tier.label})</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />}
            </button>
          );
        })}
      </div>

      {/* Progressive Optical Microscope Stage */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-5 sm:p-7 border-3 border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        {/* Microscope Circular Reticle Lens */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-950 shrink-0 flex items-center justify-center">
          {currentTier.image ? (
            <motion.img
              key={currentTier.magnification}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={currentTier.image}
              alt={currentTier.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-4xl block mb-2">🔬</span>
              <span className="text-xs font-mono text-sky-400 font-bold block">{currentTier.label}</span>
              <span className="text-[10px] text-slate-500 font-mono">Reticle Calibrated</span>
            </div>
          )}

          {/* Optical Reticle Crosshair & Scale Bar */}
          <div className="absolute inset-0 pointer-events-none border border-amber-400/40 rounded-full flex items-center justify-center">
            <div className="w-full h-0.5 bg-amber-400/30" />
            <div className="h-full w-0.5 bg-amber-400/30 absolute" />
            <div className="w-24 h-24 rounded-full border border-dashed border-amber-400/60" />
          </div>

          {/* Magnification Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/85 text-amber-300 font-black text-xs px-3 py-1 rounded-full border border-amber-400/40 shadow-md">
            Optical Zoom: {currentTier.magnification}
          </div>

          {/* Scale Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/85 text-slate-200 font-bold text-[10px] px-3 py-0.5 rounded-full border border-slate-700">
            Scale: {currentTier.scaleBarText || '10 µm'}
          </div>
        </div>

        {/* Structural Breakdown & Scientific Notes */}
        <div className="flex-1 flex flex-col justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                {data?.specimenCategory || 'Specimen'}
              </span>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {data?.specimenName || 'Specimen'} • {currentTier.label}
              </h3>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
              {currentTier.scientificExplanation}
            </p>

            {/* Key Structural Features */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Observed Microscopic Features:
              </span>
              {(currentTier.structuralFeatures || []).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Zoom Button */}
          {selectedTierIndex < tiers.length - 1 && (
            <button
              onClick={() => handleSelectTier(selectedTierIndex + 1)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>Zoom In to {tiers[selectedTierIndex + 1]?.magnification} 🔬</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
