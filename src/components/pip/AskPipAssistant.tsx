import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { X, Volume2, ChevronRight, Tv, HelpCircle } from 'lucide-react';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';
import { useLocation } from 'react-router-dom';
import { useAiVideoStore } from '@/stores/aiVideoStore';

interface Props {
  currentGoal: string;
  stepHint: string;
  conceptBreakdown: string;
}

export const AskPipAssistant: React.FC<Props> = ({ currentGoal, stepHint, conceptBreakdown }) => {
  const location = useLocation();
  const { openVideoByContext } = useAiVideoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hintTier, setHintTier] = useState<1 | 2 | 3>(1);

  const handleOpen = () => {
    sounds.pop();
    setHintTier(1);
    setIsOpen(true);
    voiceAssistant.speak(`I'm here to help! ${currentGoal}`);
  };

  const handleNextHintTier = () => {
    sounds.pop();
    const next = (hintTier === 3 ? 3 : hintTier + 1) as 1 | 2 | 3;
    setHintTier(next);
    const msg = next === 2 ? stepHint : conceptBreakdown;
    voiceAssistant.speak(msg);
  };

  const handleReadAloud = () => {
    sounds.pop();
    const msg = hintTier === 1 ? currentGoal : hintTier === 2 ? stepHint : conceptBreakdown;
    voiceAssistant.speak(msg);
  };

  return (
    <>
      {/* Persistent Floating "Stuck / Ask Pip" Button */}
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpen}
        className="fixed bottom-16 sm:bottom-4 left-3 sm:left-6 z-30 px-3 py-2 bg-white/95 backdrop-blur-md text-slate-700 border border-slate-200/90 rounded-xl font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer transition-all touch-manipulation"
      >
        <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
        <span className="hidden sm:inline">Stuck? Ask Pip</span>
        <span className="sm:hidden">Hint</span>
      </motion.button>

      {/* Modern Socratic Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5 sm:gap-4 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-teal-700">
                    <SparkyMascot mood="thinking" size={40} animate={false} />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-slate-900 leading-none">
                      Pip's Scientific Coach
                    </h3>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Every scientist learns by experimenting and asking questions!
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReadAloud}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setIsOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progressive Hint Progression Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setHintTier(1)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hintTier === 1
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Current Goal
                </button>
                <button
                  onClick={() => setHintTier(2)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hintTier === 2
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Step Hint
                </button>
                <button
                  onClick={() => setHintTier(3)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hintTier === 3
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Deep Concept
                </button>
              </div>

              {/* Active Socratic Message Block */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left">
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {hintTier === 1
                    ? currentGoal
                    : hintTier === 2
                    ? stepHint
                    : conceptBreakdown}
                </p>
              </div>

              {/* Contextual Video Quick Button */}
              <button
                onClick={() => {
                  sounds.sparkle();
                  setIsOpen(false);
                  openVideoByContext(location.pathname);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Tv className="w-4 h-4 text-amber-700" />
                <span>Watch Video Explanation</span>
              </button>

              {/* Progressive Hint Escalator */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {hintTier < 3 ? (
                  <button
                    onClick={handleNextHintTier}
                    className="flex-1 py-2.5 px-4 rounded-xl edtech-btn-primary text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Need a deeper clue? (Level {hintTier + 1}/3)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.pop();
                      setIsOpen(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Got it! Return to Experiment</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

