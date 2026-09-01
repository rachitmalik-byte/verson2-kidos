import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ZoomIn, Sparkles, Volume2, Eye } from 'lucide-react';

export interface MicroscopeTierData {
  zoomLevel: '1x' | '100x' | '500x';
  zoomMultiplier: number;
  label: string;
  tagline: string;
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
  tiers: {
    '1x': MicroscopeTierData;
    '100x': MicroscopeTierData;
    '500x': MicroscopeTierData;
  };
}

interface Props {
  config: SpecimenMicroscopeConfig;
  onExploreComplete?: () => void;
}

export const MultiTierMicroscopeStudio: React.FC<Props> = ({
  config,
  onExploreComplete,
}) => {
  const [activeTier, setActiveTier] = useState<'1x' | '100x' | '500x'>('100x');
  const [exploredTiers, setExploredTiers] = useState<string[]>(['100x']);

  const currentTier = config.tiers[activeTier];

  const handleSelectTier = (tier: '1x' | '100x' | '500x') => {
    sounds.pop();
    setActiveTier(tier);
    if (!exploredTiers.includes(tier)) {
      const next = [...exploredTiers, tier];
      setExploredTiers(next);
      if (next.length === 3) {
        sounds.fanfare();
        if (onExploreComplete) onExploreComplete();
      }
    }
    voiceAssistant.speak(`${config.specimenName} at ${tier} magnification: ${currentTier.observation}`);
  };

  const handleReadAloud = () => {
    sounds.pop();
    voiceAssistant.speak(`${currentTier.label}. ${currentTier.observation} Discovery: ${currentTier.keyDiscovery}`);
  };

  return (
    <div className={`w-full bg-slate-950 p-5 sm:p-7 rounded-[36px] border-4 ${config.borderColor} shadow-2xl flex flex-col items-center text-white text-center select-none`}>
      {/* Top Header Controls */}
      <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2">
        <span className="text-xs font-black uppercase tracking-widest text-sky-400 bg-sky-950 px-3.5 py-1.5 rounded-full border border-sky-500/50 flex items-center gap-1.5 shadow-xs">
          <ZoomIn className="w-4 h-4 text-sky-400" />
          <span>{config.specimenName} ({activeTier})</span>
        </span>

        {/* 3-Level Progressive Zoom Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-700">
          {(['1x', '100x', '500x'] as const).map((tier) => {
            const isSelected = activeTier === tier;
            return (
              <button
                key={tier}
                onClick={() => handleSelectTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? `${config.themeColor} text-white shadow-lg scale-105`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tier === '1x' ? '👁️ 1x Macro' : tier === '100x' ? '🔬 100x Micro' : '✨ 500x Ultra'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Circular Microscope Ocular Lens Viewport ── */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center my-3 overflow-hidden ring-4 ring-sky-400/70">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTier}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center relative"
          >
            {currentTier.imageSrc ? (
              <img
                src={currentTier.imageSrc}
                alt={currentTier.label}
                className="w-full h-full object-cover"
              />
            ) : (
              currentTier.renderVisual
            )}

            {/* Microscope Optical Reticle Crosshairs */}
            <div className="absolute inset-0 pointer-events-none border border-sky-400/25 rounded-full flex items-center justify-center">
              <div className="w-full h-[1px] bg-sky-400/20 absolute" />
              <div className="h-full w-[1px] bg-sky-400/20 absolute" />
              <div className="w-24 h-24 rounded-full border border-sky-400/30 absolute" />
            </div>

            {/* Bottom HUD Tag */}
            <div className="absolute bottom-2.5 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-full border border-sky-400/40 text-[10px] font-mono font-black text-sky-300">
              {currentTier.tagline}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Lens Glare Reflection Accent */}
        <div className="absolute top-2 left-4 w-16 h-8 bg-white/10 rounded-full blur-xs -rotate-45 pointer-events-none" />
      </div>

      {/* Observation Breakdown Card */}
      <div className="w-full max-w-xl bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2 mt-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-sky-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{currentTier.label}</span>
          </span>
          <button
            onClick={handleReadAloud}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Listen to Pip read observation"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-bold leading-relaxed">
          {currentTier.observation}
        </p>

        <div className="p-2.5 bg-emerald-950/70 rounded-xl border border-emerald-500/50 text-[11px] font-black text-emerald-300 flex items-start gap-1.5 mt-1 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{currentTier.keyDiscovery}</span>
        </div>
      </div>
    </div>
  );
};
