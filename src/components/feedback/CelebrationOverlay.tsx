import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, CheckCircle } from 'lucide-react';

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
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center p-4"
        >
          {/* Backdrop flash */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

          {/* Animated Card / Badge */}
          <motion.div
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="bg-white p-8 rounded-3xl border-4 border-pq-amber shadow-2xl z-10 flex flex-col items-center text-center max-w-sm w-full relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-amber-100 text-pq-amber flex items-center justify-center text-4xl mb-3 shadow-inner">
              {type === 'mission-complete' ? '🏆' : '✨'}
            </div>

            <h3
              className="text-2xl font-extrabold text-pq-charcoal mb-1"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {type === 'mission-complete' ? 'Mission Complete!' : 'Concept Discovered!'}
            </h3>

            <p className="text-xs font-semibold text-pq-slate mb-2">
              {type === 'mission-complete'
                ? 'Superb science work! Next mission unlocked.'
                : 'Added to your Materials Discovery Book!'}
            </p>

            <div className="flex gap-1.5 mt-2">
              <span className="text-xl">🎉</span>
              <span className="text-xl">⭐</span>
              <span className="text-xl">🧪</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
