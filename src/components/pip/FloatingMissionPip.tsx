import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { MessageSquare } from 'lucide-react';
import { Pip } from './Pip';
import { PipSpeechBubble } from './PipSpeechBubble';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';

interface FloatingMissionPipProps {
  mood: any;
  message: string;
  isVisible: boolean;
}

/**
 * FloatingMissionPip — renders Pip + speech bubble in one of 3 modes:
 *
 * "floating" → fixed left-side dock (NOT overlaying content — pushes the page 
 *               layout via a spacer so the main activity always has full room)
 * "inline"  → renders inline within the exercise flow
 * "hidden"  → hidden completely
 */
export const FloatingMissionPip: React.FC<FloatingMissionPipProps> = ({ mood, message, isVisible }) => {
  const { pipMode, showPipText } = useUiSettingsStore();

  if (pipMode === 'hidden' || !isVisible) return null;

  // ── INLINE MODE: render directly in the page flow ──
  if (pipMode === 'inline') {
    return (
      <div className="flex flex-row items-center gap-4 mb-6">
        <div>
          <Pip mood={mood} size="md" />
        </div>
        {showPipText && (
          <div>
            <PipSpeechBubble message={message} isVisible={true} />
          </div>
        )}
      </div>
    );
  }

  // ── FLOATING MODE: fixed left-side dock, NOT overlapping content ──
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="fixed left-3 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-center gap-2 pointer-events-auto"
        style={{ maxWidth: '72px' }}
      >
        {/* Pip Character */}
        <Pip mood={mood} size="sm" />

        {/* Compact speech hint (tooltip-style, expands on hover) */}
        {showPipText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            {/* Small collapsed indicator */}
            <div className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl border border-teal-200/80 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform text-teal-600">
              <MessageSquare className="w-4 h-4" />
            </div>

            {/* Expanded speech bubble — appears on hover, positioned to the RIGHT so it doesn't cover activity */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-64 sm:w-80 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-[1000]">
              <div className="bg-white p-4 rounded-2xl border-2 border-teal-300 shadow-xl relative">
                {/* Tail arrow pointing left */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-teal-300 transform rotate-45" />
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
