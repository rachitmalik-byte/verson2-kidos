import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperimentFocusSpotlightProps {
  isActive: boolean;
  children: React.ReactNode;
  activeLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Reusable Experiment Focus Spotlight
 * PolyQuest Focus-Mode Standard:
 * - When an experiment is actively in progress, dims all non-essential chrome with `bg-slate-950/85 backdrop-blur-xl`.
 * - Brings the active experiment stage and live controls into the limelight (z-50).
 * - Restores full UI brightness smoothly once the experiment settles.
 */
export const ExperimentFocusSpotlight: React.FC<ExperimentFocusSpotlightProps> = ({
  isActive,
  children,
  activeLabel,
  onDismiss,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Spotlight Backdrop Dimmer (Diverts 100% focus to active experiment) ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onDismiss}
            className="fixed inset-0 z-[40] bg-slate-950/85 backdrop-blur-xl pointer-events-none"
          >
            {activeLabel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-amber-400/90 text-slate-950 font-black text-xs md:text-sm rounded-full shadow-2xl border-2 border-amber-300 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>{activeLabel}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active Limelight Experiment Container ── */}
      <div
        className={`relative transition-all duration-300 ${
          isActive
            ? 'z-[50] ring-4 ring-amber-400/90 shadow-[0_0_50px_rgba(251,191,36,0.35)] rounded-3xl'
            : 'z-[1]'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
