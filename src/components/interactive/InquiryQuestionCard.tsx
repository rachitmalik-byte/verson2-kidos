import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, HelpCircle, Sparkles, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

export interface InquiryOption {
  id: string;
  label: string;
  icon?: string;
  image?: string;
  isCorrect: boolean;
  explanation: string;
  hint: string;
}

interface InquiryQuestionCardProps {
  title: string;
  question: string;
  scenarioEmoji?: string;
  scenarioImage?: string;
  sceneIllustration?: React.ReactNode;
  options: InquiryOption[];
  onSuccess: () => void;
  isCompleted?: boolean;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const InquiryQuestionCard: React.FC<InquiryQuestionCardProps> = ({
  title,
  question,
  scenarioEmoji = '🔬',
  scenarioImage,
  sceneIllustration,
  options,
  onSuccess,
  isCompleted = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(isCompleted);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showXpReward, setShowXpReward] = useState(false);

  // Dynamically shuffle options whenever the question or options change
  const randomizedOptions = useMemo(() => {
    return shuffleArray(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, title]);

  // Stop previous voice assistant speech when question changes or component unmounts
  useEffect(() => {
    voiceAssistant.stop();
    setSelectedId(null);
    setFeedbackMessage(null);
    setHasSucceeded(isCompleted);

    return () => {
      voiceAssistant.stop();
    };
  }, [question, title, isCompleted]);

  const handleOptionClick = (opt: InquiryOption) => {
    voiceAssistant.stop();
    setSelectedId(opt.id);

    if (opt.isCorrect) {
      setHasSucceeded(true);
      setFeedbackMessage(opt.explanation);
      sounds.fanfare();
      setShowXpReward(true);
      setTimeout(() => setShowXpReward(false), 2800);

      voiceAssistant.speak(opt.explanation);
      onSuccess();
    } else {
      sounds.boing();
      setFeedbackMessage(opt.hint);
      voiceAssistant.speak(opt.hint);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl md:rounded-[36px] border-2 border-slate-200/90 shadow-xl flex flex-col items-center text-center relative transition-all">
      {/* Floating XP Reward Burst (Placed safely inside card padding, no clipping) */}
      <AnimatePresence>
        {showXpReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 border border-amber-200/90 px-3.5 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-lg flex items-center gap-1.5 z-30 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-amber-900 fill-amber-500" />
            <span>+50 XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-extrabold text-xs tracking-wider uppercase mb-4 shadow-2xs">
        {scenarioEmoji && <span className="text-base leading-none">{scenarioEmoji}</span>}
        <span>{title}</span>
      </div>

      {/* Scenario Graphic / Real Context Image if present */}
      {scenarioImage && (
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 border-2 border-slate-200/80 shadow-md bg-slate-900 group">
          <img
            src={scenarioImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 sm:p-4">
            <span className="text-white/95 text-xs font-bold tracking-wide backdrop-blur-md bg-black/40 px-3 py-1 rounded-lg border border-white/20">
              Scenario Observation Context
            </span>
          </div>
        </div>
      )}

      {/* Embedded Scene Illustration if passed */}
      {sceneIllustration && <div className="w-full mb-4">{sceneIllustration}</div>}

      {/* Question Prompt */}
      <h3
        className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 mb-6 leading-snug tracking-tight max-w-xl"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {question}
      </h3>

      {/* Interactive Options List with Rich Thumbnails & Clear States */}
      <div className="grid grid-cols-1 gap-3.5 w-full mb-4">
        {randomizedOptions.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          const letterBadge = String.fromCharCode(65 + idx); // A, B, C...

          return (
            <motion.button
              key={opt.id}
              whileHover={!hasSucceeded ? { scale: 1.01, y: -1 } : {}}
              whileTap={!hasSucceeded ? { scale: 0.99 } : {}}
              onClick={() => handleOptionClick(opt)}
              disabled={hasSucceeded && !isSelected}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3.5 cursor-pointer transition-all duration-200 group ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-emerald-50/90 border-emerald-500 ring-4 ring-emerald-200/70 text-emerald-950 font-black shadow-md'
                    : 'bg-rose-50/90 border-rose-400 ring-4 ring-rose-200/70 text-rose-950 font-black shadow-md'
                  : hasSucceeded
                  ? 'bg-slate-50 border-slate-200/60 opacity-55 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Visual Thumbnail or Icon */}
                {opt.image ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 border-slate-200 shadow-inner bg-slate-100 group-hover:border-amber-300 transition-colors">
                    <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
                  </div>
                ) : opt.icon ? (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 group-hover:bg-amber-100/50 transition-colors">
                    <span>{opt.icon}</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-black text-xs text-slate-600 shrink-0">
                    {letterBadge}
                  </div>
                )}

                {/* Option Content */}
                <div className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900 text-xs sm:text-sm leading-snug break-words">
                    {opt.label}
                  </span>
                </div>
              </div>

              {/* Status Indicator on Right */}
              <div className="shrink-0 ml-2">
                {isSelected ? (
                  opt.isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                      <HelpCircle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-amber-400 transition-colors" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Socratic Feedback & Explanation */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className={`w-full p-4 sm:p-5 rounded-2xl border-2 flex flex-col gap-3 text-left mt-1 ${
              hasSucceeded
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
                : 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  hasSucceeded ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {hasSucceeded ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <Lightbulb className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`font-black text-xs uppercase tracking-wider block mb-1 ${
                    hasSucceeded ? 'text-emerald-800' : 'text-rose-800'
                  }`}
                >
                  {hasSucceeded ? 'Outstanding Science Reasoning!' : 'Pip Socratic Hint:'}
                </span>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {feedbackMessage}
                </p>
              </div>
            </div>

            {/* Action Button: Continue if Succeeded, Try Again if Incorrect */}
            {hasSucceeded ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.success();
                  onSuccess();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all mt-1"
              >
                <span>Continue to Next Step</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            ) : (
              <button
                onClick={() => {
                  sounds.pop();
                  setSelectedId(null);
                  setFeedbackMessage(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Hypothesis</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
