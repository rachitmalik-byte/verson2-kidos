import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useSpacedRecallStore, RECALL_QUESTION_BANK, SpacedRecallQuestion } from '@/stores/spacedRecallStore';
import { useProgressStore } from '@/stores/progressStore';
import { Sparkles, CheckCircle2, XCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SpacedRecallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { answeredQuestionIds, recordAnswer } = useSpacedRecallStore();
  const addCredits = useProgressStore((s) => s.addCredits);

  // Pick a random question not answered yet or first from bank
  const question: SpacedRecallQuestion = 
    RECALL_QUESTION_BANK.find((q) => !answeredQuestionIds.includes(q.id)) || RECALL_QUESTION_BANK[0];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    const isCorrect = question.options[idx].isCorrect;
    setSelectedIdx(idx);
    setIsAnswered(true);
    recordAnswer(question.id, isCorrect);

    if (isCorrect) {
      sounds.fanfare();
      addCredits(20);
      voiceAssistant.speak(`Brilliant memory! ${question.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak(`Let's review: ${question.explanation}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-xl">
              {question.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Spaced Recall • {question.topicTitle}
              </span>
              <h3 className="text-lg font-heading font-bold text-slate-900 mt-0.5">
                Memory Retrieval Challenge
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3.5 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                    : isAnswered
                    ? 'bg-slate-50 border-slate-200 opacity-60 text-slate-600'
                    : 'bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && (
                  <span>
                    {opt.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation on Answer */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-left flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Science Explanation:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {isAnswered && (
          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="edtech-btn-primary w-full py-2.5 text-xs font-bold"
          >
            Continue Learning →
          </button>
        )}
      </motion.div>
    </div>
  );
};
