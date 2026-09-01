import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useSpacedRecallStore, RECALL_QUESTION_BANK, SpacedRecallQuestion } from '@/stores/spacedRecallStore';
import { useProgressStore } from '@/stores/progressStore';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-[36px] border-4 border-amber-400 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-2 bg-amber-100 rounded-2xl border border-amber-300">
              {question.icon}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Spaced Recall • {question.topicTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Memory Spark Check-In ⭐
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200 text-emerald-950 font-black'
                      : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200 text-rose-950 font-black'
                    : isAnswered
                    ? 'bg-slate-50 border-slate-200 opacity-60 text-slate-700'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && (
                  opt.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 fill-rose-100 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Card */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 flex flex-col gap-2"
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Scientific Explanation:</span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              {question.explanation}
            </p>
            <button
              onClick={() => {
                sounds.sparkle();
                onClose();
              }}
              className="mt-2 w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md active:scale-95"
            >
              Claim +20 Science Sparks & Continue ➔
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
