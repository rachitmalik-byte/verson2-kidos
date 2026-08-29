import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, HelpCircle, Sparkles, Lightbulb } from 'lucide-react';

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
            <Sparkles className="w-4 h-4 fill-amber-300 text-slate-950" />
            <span>+20 Science XP! ⭐</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional Scene Illustration or Photo Banner */}
      {sceneIllustration ? (
        <div className="w-full mb-4 rounded-2xl overflow-hidden shadow-md">
          {sceneIllustration}
        </div>
      ) : scenarioImage ? (
        <div className="w-44 h-44 rounded-2xl overflow-hidden mb-4 border-2 border-slate-100 shadow-md">
          <img src={scenarioImage} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <span className="text-5xl mb-2 block">{scenarioEmoji}</span>
      )}

      <h3
        className="text-xl md:text-2xl font-black text-slate-900 mb-2"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-sm md:text-base text-slate-600 font-bold mb-6 max-w-lg">
        {question}
      </p>

      {/* Randomized Inquiry Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
        {randomizedOptions.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isSolvedCorrect = hasSucceeded && opt.isCorrect;

          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOptionClick(opt)}
              className={`p-5 md:p-6 rounded-3xl border-3 text-center flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                isSolvedCorrect
                  ? 'bg-emerald-50 border-emerald-400 shadow-lg ring-4 ring-emerald-200 text-emerald-950'
                  : isSelected && !opt.isCorrect
                  ? 'bg-rose-50 border-rose-300 shadow-md ring-2 ring-rose-200 text-slate-800 animate-shake'
                  : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-sky-300 text-slate-800 shadow-xs'
              }`}
            >
              {opt.image ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 border border-slate-200 shadow-xs">
                  <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
                </div>
              ) : (
                opt.icon && <span className="text-4xl mb-2 block">{opt.icon}</span>
              )}
              <span
                className="font-black text-base md:text-lg block tracking-tight"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {opt.label}
              </span>

              {/* Dynamic Post-Click Feedback Badges */}
              {isSolvedCorrect ? (
                <span className="mt-2.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Correct Choice! ✓</span>
                </span>
              ) : isSelected && !opt.isCorrect ? (
                <span className="mt-2.5 px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 rounded-full text-xs font-black flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Try Again!</span>
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      {/* Socratic Feedback & Explanation Box */}
      <AnimatePresence mode="wait">
        {feedbackMessage && (
          <motion.div
            key={feedbackMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl w-full text-xs md:text-sm font-black flex items-start gap-2.5 text-left ${
              hasSucceeded
                ? 'bg-emerald-100/90 border border-emerald-300 text-emerald-950 shadow-xs'
                : 'bg-amber-100/90 border border-amber-300 text-amber-950 shadow-xs'
            }`}
          >
            {hasSucceeded ? (
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="block font-black uppercase text-[10px] tracking-wider mb-0.5 text-slate-500">
                {hasSucceeded ? '✨ Science Law' : '💡 Socratic Hint'}
              </span>
              <p className="leading-snug">{feedbackMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
