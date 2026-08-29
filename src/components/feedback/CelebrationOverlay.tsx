import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, ArrowRight } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export interface CelebrationOverlayProps {
  isVisible: boolean;
  type: 'discovery' | 'mission-complete' | 'correct-answer';
  onComplete?: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
  type,
  onComplete,
}) => {
  useEffect(() => {
    if (isVisible) {
      sounds.fanfare();
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const handleDismiss = () => {
    sounds.sparkle();
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm cursor-pointer select-none"
        >
          {/* Animated Celebration Card / Badge */}
          <motion.div
            initial={{ scale: 0.6, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="bg-white p-6 sm:p-8 rounded-3xl md:rounded-[36px] border-4 border-amber-400 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-sm w-full relative cursor-pointer active:scale-98 transition-transform"
          >
            {/* Pulsing Trophy / Star Emoji */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-200 to-yellow-100 border-3 border-amber-400 text-amber-600 flex items-center justify-center text-4xl sm:text-5xl mb-4 shadow-inner"
            >
              {type === 'mission-complete' ? '🏆' : '✨'}
            </motion.div>

            <h3
              className="text-2xl sm:text-3xl font-black text-slate-900 mb-1"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {type === 'mission-complete' ? 'Mission Mastered!' : 'Concept Discovered!'}
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4 leading-relaxed">
              {type === 'mission-complete'
                ? 'Superb scientific deduction! Star PolyCredits earned & next mission unlocked.'
                : 'Added to your interactive Materials Discovery Book!'}
            </p>

            <div className="flex gap-2 mb-5">
              <span className="text-2xl">🎉</span>
              <span className="text-2xl">⭐</span>
              <span className="text-2xl">🧪</span>
              <span className="text-2xl">✨</span>
            </div>

            {/* Click to Continue Button */}
            <button
              onClick={handleDismiss}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Continue Adventure</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <span className="text-[10px] font-bold text-slate-400 mt-2 block">
              Tap anywhere on screen to continue
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
