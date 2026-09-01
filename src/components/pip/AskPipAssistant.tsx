import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { HelpCircle, X, Volume2, Sparkles, Lightbulb, ChevronRight } from 'lucide-react';
import { Pip } from './Pip';

interface Props {
  currentGoal: string;
  stepHint: string;
  conceptBreakdown: string;
}

export const AskPipAssistant: React.FC<Props> = ({ currentGoal, stepHint, conceptBreakdown }) => {
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 rounded-full font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer hover:shadow-2xl transition-all"
      >
        <span className="text-base">💡</span>
        <span>Stuck? Ask Pip</span>
      </motion.button>

      {/* Gentle Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="w-full max-w-lg bg-white rounded-[32px] border-4 border-amber-400 p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-2xl bg-amber-100 border border-amber-300 text-lg">🦉</span>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-none" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Pip's Helping Hand
                    </h3>
                    <span className="text-[11px] font-bold text-amber-700">No stress! Science is all about exploring.</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReadAloud}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
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
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mascot & Dialogue Bubble */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                    {hintTier === 1 && '🎯 What to do here:'}
                    {hintTier === 2 && '🔍 Step-by-Step Clue:'}
                    {hintTier === 3 && '💡 Core Science Idea:'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                  {hintTier === 1 && currentGoal}
                  {hintTier === 2 && stepHint}
                  {hintTier === 3 && conceptBreakdown}
                </p>
              </div>

              {/* Progressive Hint Escalator */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {hintTier < 3 ? (
                  <button
                    onClick={handleNextHintTier}
                    className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
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
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
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
