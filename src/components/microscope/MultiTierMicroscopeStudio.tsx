import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ZoomIn, Sparkles, Volume2, Eye, Compass, Maximize2 } from 'lucide-react';

export interface MicroscopeTierData {
  zoomLevel: string; // e.g. '1x' | '40x' | '200x' | '400x' | '1,500x' | '20,000x'
  zoomMultiplier: number;
  label: string;
  tagline: string;
  instrumentType?: 'Naked Eye' | 'Stereomicroscope' | 'Compound Light' | 'Scanning Electron (SEM)' | 'Cryo-Lattice';
  scaleBar?: string; // e.g. '10 mm', '500 µm', '50 µm', '1 µm', '2 nm'
  imageSrc?: string;
  renderVisual?: React.ReactNode;
  observation: string;
  keyDiscovery: string;
}

export interface SpecimenMicroscopeConfig {
  specimenId: string;
  specimenName: string;
  themeColor: string;
  borderColor: string;
  tiers: Record<string, MicroscopeTierData>;
}

interface Props {
  config: SpecimenMicroscopeConfig;
  onExploreComplete?: () => void;
}

export const MultiTierMicroscopeStudio: React.FC<Props> = ({
  config,
  onExploreComplete,
}) => {
  const tierKeys = Object.keys(config.tiers);
  const [activeTierKey, setActiveTierKey] = useState<string>(tierKeys[1] || tierKeys[0]);
  const [exploredTiers, setExploredTiers] = useState<string[]>([tierKeys[1] || tierKeys[0]]);

  const currentTier = config.tiers[activeTierKey] || config.tiers[tierKeys[0]];

  const handleSelectTier = (key: string) => {
    sounds.pop();
    setActiveTierKey(key);
    if (!exploredTiers.includes(key)) {
      const next = [...exploredTiers, key];
      setExploredTiers(next);
      if (next.length === tierKeys.length) {
        sounds.fanfare();
        if (onExploreComplete) onExploreComplete();
      }
    }
    const t = config.tiers[key];
    if (t) {
      voiceAssistant.speak(`${config.specimenName} under ${t.instrumentType || 'microscope'} at ${t.zoomLevel}: ${t.observation}`);
    }
  };

  const handleReadAloud = () => {
    sounds.pop();
    voiceAssistant.speak(`${currentTier.label}. Instrument: ${currentTier.instrumentType || 'Microscope'}. ${currentTier.observation} Key Discovery: ${currentTier.keyDiscovery}`);
  };

  return (
    <div className={`w-full bg-slate-950 p-6 sm:p-8 rounded-[40px] border-4 ${config.borderColor} shadow-2xl flex flex-col items-center text-white text-center select-none`}>
      {/* Top Header Controls */}
      <div className="flex items-center justify-between w-full mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-sky-400 bg-sky-950 px-4 py-2 rounded-full border border-sky-500/50 flex items-center gap-2 shadow-sm">
            <ZoomIn className="w-4 h-4 text-sky-400" />
            <span>{config.specimenName} • {currentTier.zoomLevel}</span>
          </span>
          {currentTier.instrumentType && (
            <span className="hidden sm:inline-block text-[11px] font-black uppercase text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-full border border-indigo-500/40">
              🔬 {currentTier.instrumentType}
            </span>
          )}
        </div>

        {/* Practical Realistic Magnification Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-700">
          {tierKeys.map((key) => {
            const isSelected = activeTierKey === key;
            const tierData = config.tiers[key];
            return (
              <button
                key={key}
                onClick={() => handleSelectTier(key)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? `${config.themeColor} text-white shadow-lg scale-105 ring-2 ring-sky-300`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{tierData.label.split('(')[0].trim()}</span>
                <span className="text-[10px] opacity-75 font-mono">({tierData.zoomLevel})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EXPANDED HIGH-DEFINITION MICROSCOPE OCULAR LENS (Prominent Size) ── */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full border-[10px] border-slate-800 bg-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center my-4 overflow-hidden ring-4 ring-sky-400/80 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTierKey}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center relative"
          >
            {currentTier.imageSrc ? (
              <img
                src={currentTier.imageSrc}
                alt={currentTier.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              currentTier.renderVisual
            )}

            {/* Precision Optical Reticle & Measurement Scale Bar */}
            <div className="absolute inset-0 pointer-events-none border border-sky-400/25 rounded-full flex items-center justify-center">
              <div className="w-full h-[1px] bg-sky-400/25 absolute" />
              <div className="h-full w-[1px] bg-sky-400/25 absolute" />
              <div className="w-36 h-36 rounded-full border border-sky-400/30 absolute" />
              <div className="w-64 h-64 rounded-full border border-sky-400/20 absolute" />
            </div>

            {/* Scientific Scale Bar Indicator */}
            {currentTier.scaleBar && (
              <div className="absolute top-4 right-6 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-400/40 text-[11px] font-mono font-black text-sky-300 flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-sky-300 inline-block" />
                <span>Scale: {currentTier.scaleBar}</span>
              </div>
            )}

            {/* Bottom HUD Tag */}
            <div className="absolute bottom-4 px-4 py-1.5 bg-slate-950/90 backdrop-blur-md rounded-full border border-sky-400/50 text-xs font-mono font-black text-sky-200 shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentTier.tagline}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Lens Glare Reflection Accent */}
        <div className="absolute top-3 left-6 w-24 h-12 bg-white/10 rounded-full blur-xs -rotate-45 pointer-events-none" />
      </div>

      {/* Observation Breakdown Card */}
      <div className="w-full max-w-2xl bg-slate-900/95 p-5 sm:p-6 rounded-3xl border-2 border-slate-800 flex flex-col gap-2.5 mt-3 text-left shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>{currentTier.label}</span>
            </span>
            <span className="text-[11px] font-black text-slate-400 font-mono">
              [{currentTier.zoomLevel} Magnification]
            </span>
          </div>

          <button
            onClick={handleReadAloud}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white cursor-pointer transition-all active:scale-95"
            title="Listen to Pip read observation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-bold leading-relaxed">
          {currentTier.observation}
        </p>

        <div className="p-3 bg-emerald-950/80 rounded-2xl border border-emerald-500/50 text-xs font-black text-emerald-300 flex items-start gap-2 mt-1 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{currentTier.keyDiscovery}</span>
        </div>
      </div>
    </div>
  );
};
