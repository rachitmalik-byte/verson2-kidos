import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { McqAssessmentData, McqOption } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  data: McqAssessmentData;
  onComplete: () => void;
  isCompleted?: boolean;
}

const DEFAULT_OPTIONS: McqOption[] = [
  { id: 'opt-1', text: 'Structure determines physical properties and uses', isCorrect: true, feedback: 'Correct! Molecular arrangement decides material superpowers.' },
  { id: 'opt-2', text: 'Materials behave randomly without scientific laws', isCorrect: false, feedback: 'Not quite! All materials follow predictable physics.' },
];

export const McqAssessmentEngine: React.FC<Props> = ({ data, onComplete }) => {
  const options: McqOption[] = (data?.options && data.options.length > 0 ? data.options : DEFAULT_OPTIONS).map((opt, i) => ({
    id: opt.id || `opt-${i}`,
    text: opt.text || 'Option',
    isCorrect: Boolean(opt.isCorrect),
    feedback: opt.feedback || (opt.isCorrect ? 'Correct scientific conclusion!' : 'Consider physical properties and try again!'),
  }));

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
  }, [data]);

  const selectedOption = options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (opt: McqOption) => {
    if (isAnswered && selectedOption?.isCorrect) return;
    sounds.pop();
    setSelectedOptionId(opt.id);
    setIsAnswered(true);

    if (opt.isCorrect) {
      sounds.fanfare();
      voiceAssistant.speak(`Correct! ${data?.explanation || opt.feedback}`);
      onComplete();
    } else {
      sounds.boing();
      voiceAssistant.speak(`Let's think again: ${opt.feedback}`);
    }
  };

  const handleTryAgain = () => {
    sounds.pop();
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  return (
    <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-xl flex flex-col gap-5 mx-auto select-none font-sans">
      {/* Question Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Scientific Inquiry Challenge
          </span>
          {data?.conceptBadge && (
            <span className="text-xs font-bold text-slate-500">#{data.conceptBadge}</span>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {data?.question || 'What is the key scientific concept?'}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          return (
            <motion.button
              key={opt.id}
              whileHover={!isAnswered || !selectedOption?.isCorrect ? { scale: 1.015, x: 2 } : {}}
              whileTap={!isAnswered || !selectedOption?.isCorrect ? { scale: 0.985 } : {}}
              onClick={() => handleSelectOption(opt)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200'
                    : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                  : isAnswered && selectedOption?.isCorrect
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-xs'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {opt.text}
              </span>
              {isSelected && (
                opt.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 fill-rose-100 shrink-0" />
                )
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Instant Feedback Drawer */}
      <AnimatePresence>
        {isAnswered && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`p-4 rounded-2xl border-2 flex flex-col gap-2 ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedOption.isCorrect ? '🌟' : '🤔'}</span>
              <h4 className="font-black text-sm">
                {selectedOption.isCorrect ? 'Brilliant Discovery!' : 'Not Quite!'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              {selectedOption.isCorrect ? data?.explanation || selectedOption.feedback : selectedOption.feedback}
            </p>
            {!selectedOption.isCorrect && (
              <button
                onClick={handleTryAgain}
                className="mt-1 self-start px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Choice</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
