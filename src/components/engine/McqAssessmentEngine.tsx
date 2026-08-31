import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { McqAssessmentData, McqOption } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  data: McqAssessmentData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const McqAssessmentEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const selectedOption = data.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (opt: McqOption) => {
    if (isAnswered) return;
    sounds.pop();
    setSelectedOptionId(opt.id);
    setIsAnswered(true);

    if (opt.isCorrect) {
      sounds.fanfare();
      voiceAssistant.speak(`Correct! ${data.explanation}`);
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
    <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-xl flex flex-col gap-5 mx-auto">
      {/* Question Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Scientific Inquiry Challenge
          </span>
          {data.conceptBadge && (
            <span className="text-xs font-bold text-slate-500">#{data.conceptBadge}</span>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {data.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {data.options.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          return (
            <motion.button
              key={opt.id}
              whileHover={!isAnswered ? { scale: 1.015, x: 2 } : {}}
              whileTap={!isAnswered ? { scale: 0.985 } : {}}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered && !isSelected}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200'
                    : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200'
                  : isAnswered
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-xs'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {opt.text}
              </span>

              {isSelected && (
                opt.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Overlay */}
      {isAnswered && selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 ${
            selectedOption.isCorrect
              ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
              : 'bg-rose-100/80 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm mb-1">
            {selectedOption.isCorrect ? <Sparkles className="w-4 h-4 text-emerald-600" /> : <HelpCircle className="w-4 h-4 text-rose-600" />}
            <span>{selectedOption.isCorrect ? 'Outstanding Science Reasoning!' : 'Think Again:'}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold leading-relaxed">
            {selectedOption.isCorrect ? data.explanation : selectedOption.feedback}
          </p>

          {!selectedOption.isCorrect && (
            <button
              onClick={handleTryAgain}
              className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs active:scale-95"
            >
              Try Another Option 🔄
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
