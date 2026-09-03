import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { X, Volume2, ChevronRight, Tv } from 'lucide-react';
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
      {/* Persistent Floating "Stuck / Ask Sparky" Button */}
      <motion.button
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleOpen}
        className="fixed bottom-14 left-3 sm:bottom-16 sm:left-6 z-30 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A] rounded-full font-extrabold text-xs sm:text-sm shadow-soft-card flex items-center gap-2 cursor-pointer transition-all"
      >
        <span className="text-base">💡</span>
        <span className="hidden sm:inline">Stuck? Ask Sparky</span>
        <span className="sm:hidden">Help?</span>
      </motion.button>

      {/* Gentle Help Modal (Squircle & Muted Pastels) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262930]/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              className="w-full max-w-lg bg-[#FAF8F5] rounded-[32px] border border-slate-200/90 p-5 sm:p-6 shadow-soft-float flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SparkyMascot mood="thinking" size={48} animate={false} />
                  <div>
                    <h3 className="text-base font-extrabold text-[#262930] leading-none">
                      Sparky's Helping Hand
                    </h3>
                    <span className="text-[11px] font-medium text-[#5A6072] mt-0.5 block">
                      No stress! Science is all about exploring.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReadAloud}
                    className="p-2 rounded-full bg-white hover:bg-slate-100 text-[#5A6072] border border-slate-200/80 cursor-pointer shadow-xs transition-colors"
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
                    className="p-2 rounded-full bg-white hover:bg-slate-100 text-[#5A6072] border border-slate-200/80 cursor-pointer shadow-xs transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dialogue Bubble (Soft Pastel Tint) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft-card flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase text-[#854D0E] tracking-wider">
                  {hintTier === 1 && '🎯 What to do here:'}
                  {hintTier === 2 && '🔍 Step-by-Step Clue:'}
                  {hintTier === 3 && '💡 Core Science Idea:'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#262930] leading-relaxed">
                  {hintTier === 1 && currentGoal}
                  {hintTier === 2 && stepHint}
                  {hintTier === 3 && conceptBreakdown}
                </p>
              </div>

              {/* Contextual Video Quick Button */}
              <button
                onClick={() => {
                  sounds.sparkle();
                  setIsOpen(false);
                  openVideoByContext(location.pathname);
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-[#5B21B6] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Tv className="w-4 h-4 text-[#7C3AED]" />
                <span>Watch Video Explanation 🍿</span>
              </button>

              {/* Progressive Hint Escalator */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {hintTier < 3 ? (
                  <button
                    onClick={handleNextHintTier}
                    className="flex-1 py-3 px-4 rounded-full pill-btn-primary text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-soft-pill transition-all"
                  >
                    <span>Need a bigger clue? (Level {hintTier + 1}/3)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.pop();
                      setIsOpen(false);
                    }}
                    className="flex-1 py-3 px-4 rounded-full bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <span>Got it! Let's Try It 🔬</span>
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

