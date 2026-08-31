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
      setTimeout(() => setShowXpReward(false), 2000);

      voiceAssistant.speak(opt.explanation);
      onSuccess();
    } else {
      sounds.boing();
      setFeedbackMessage(opt.hint);
      voiceAssistant.speak(opt.hint);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl md:rounded-[36px] border-4 border-slate-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
      {/* Floating XP Reward Burst */}
      <AnimatePresence>
        {showXpReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1.2, y: -25 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-4 py-1.5 rounded-full font-black text-sm shadow-lg flex items-center gap-1.5 z-20"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>+50 XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{scenarioEmoji}</span>
        <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          {title}
        </span>
      </div>

      {/* Scenario Graphic / Image if present */}
      {scenarioImage && (
        <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 border-2 border-slate-100 bg-slate-900">
          <img src={scenarioImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Embedded Scene Illustration if passed */}
      {sceneIllustration && <div className="w-full mb-4">{sceneIllustration}</div>}

      {/* Question Prompt */}
      <h3
        className="text-lg md:text-xl font-black text-slate-900 mb-6 leading-snug"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {question}
      </h3>

      {/* Interactive Options Grid */}
      <div className="grid grid-cols-1 gap-3 w-full mb-4">
        {randomizedOptions.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={!hasSucceeded ? { scale: 1.01, x: 2 } : {}}
              whileTap={!hasSucceeded ? { scale: 0.99 } : {}}
              onClick={() => handleOptionClick(opt)}
              disabled={hasSucceeded && !isSelected}
              className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-all ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200 text-emerald-950 font-black'
                    : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200 text-rose-950 font-black'
                  : hasSucceeded
                  ? 'bg-slate-50 border-slate-200 opacity-50 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/40 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {opt.icon && <span className="text-xl shrink-0">{opt.icon}</span>}
                {opt.image && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img src={opt.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="leading-relaxed">{opt.label}</span>
              </div>

              {isSelected && (
                opt.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Socratic Feedback & Explanation */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-4 rounded-2xl border-2 flex flex-col gap-3 text-left ${
            hasSucceeded
              ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
              : 'bg-rose-100/80 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-2">
            {hasSucceeded ? (
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-black text-xs uppercase tracking-wider block mb-0.5">
                {hasSucceeded ? 'Outstanding Science Reasoning!' : 'Pip Socratic Hint:'}
              </span>
              <p className="text-xs sm:text-sm font-bold leading-relaxed">{feedbackMessage}</p>
            </div>
          </div>

          {/* Action Button: Continue if Succeeded, Try Again if Incorrect */}
          {hasSucceeded ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sounds.success();
                onSuccess();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg cursor-pointer animate-pulse mt-1"
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
              className="w-full py-2.5 px-4 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
