import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import type { CourseChapter } from '@/data/masterCurriculum';
import {
  Sparkles,
  Volume2,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Eye,
  Lightbulb,
} from 'lucide-react';

// Import local photography assets dynamically
const imageModules = import.meta.glob('@/assets/images/**/*.{jpg,png,gif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolveImage(imageName: string): string | undefined {
  if (!imageName) return undefined;
  for (const path in imageModules) {
    if (path.endsWith(`/${imageName}`) || path.endsWith(`\\${imageName}`)) {
      return imageModules[path];
    }
  }
  return undefined;
}

interface Props {
  chapterData?: CourseChapter;
  onStartLab: () => void;
  accentBorderColor?: string;
}

export const InteractiveChapterIntroCard: React.FC<Props> = ({
  chapterData,
  onStartLab,
  accentBorderColor = 'border-sky-400',
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  const intro = chapterData?.chapterIntro || ({} as any);
  const conceptSteps = intro?.conceptSteps || [];
  const activeStep = conceptSteps[activeStepIndex] || conceptSteps[0];
  const stepImageSrc = activeStep?.imageAsset ? resolveImage(activeStep.imageAsset) : undefined;

  // Fallback prediction challenge if none defined
  const predictionChallenge = intro?.thinkFastChallenge || intro?.pipThinkFastChallenge || {
    question: `Before we enter the lab: What do you think happens in this experiment?`,
    options: [
      { text: `The material behaves in a surprising way!`, isCorrect: true },
      { text: `Nothing changes at all.`, isCorrect: false },
    ],
    explanation: `Let's jump into the interactive lab and see for yourself!`,
  };

  const handleSelectPrediction = (index: number) => {
    sounds.pop();
    setUserPrediction(index);
    setPredictionSubmitted(true);
    const opt = predictionChallenge.options[index];
    if (opt.isCorrect) {
      sounds.sparkle();
    } else {
      sounds.bubble();
    }
    voiceAssistant.speak(
      `You predicted: ${opt.text}. Let's enter the lab and see if your hypothesis is correct!`
    );
  };

  const handleReadStep = () => {
    sounds.pop();
    const msg = `${activeStep?.conceptTitle}: ${activeStep?.pipDialogue}`;
    voiceAssistant.speak(msg);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans">
      {/* ── 1. Top Hook Banner (Relatable Everyday Question) ── */}
      <div className={`w-full bg-white/98 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 ${accentBorderColor} shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}>
        <div className="shrink-0 flex flex-col items-center">
          <Pip mood="curious" size="lg" />
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1">
            Pip • Science Guide
          </span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-950 font-black text-xs">
              {chapterData?.syllabusRef || 'CBSE Class 5 EVS'} • Chapter {chapterData?.chapterNumber || 1}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {intro?.title || chapterData?.chapterTitle || 'Chapter Science Quest'} {chapterData?.icon || '🔬'}
          </h1>

          <p className="text-sm sm:text-base font-bold text-slate-700 mt-2 leading-relaxed">
            {intro?.hookScene || 'Explore the secrets of the living and material world!'}
          </p>

          <div className="mt-3 p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-start gap-2">
            <span className="text-lg">🔎</span>
            <div>
              <span className="text-amber-800 uppercase tracking-wider text-[10px] block font-black">Guiding Curiosity Question</span>
              <span className="font-bold">{intro?.bigGuidingQuestion || 'Why does nature use such different materials and adaptations?'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Visual Concept Card with Real Photography ── */}
      {activeStep && (
        <div className="w-full bg-white rounded-[36px] p-6 sm:p-8 border-4 border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6">
          {/* Real Photo / Specimen View */}
          <div className="relative w-full md:w-80 h-56 sm:h-64 rounded-3xl overflow-hidden bg-slate-900 shadow-inner border-4 border-slate-100 shrink-0 flex items-center justify-center">
            {stepImageSrc ? (
              <img
                src={stepImageSrc}
                alt={activeStep.conceptTitle}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="text-center p-4">
                <span className="text-6xl block mb-2">{chapterData?.icon || '🔬'}</span>
                <span className="text-xs font-black text-white">{activeStep.conceptTitle}</span>
              </div>
            )}

            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-amber-400 border border-slate-700">
              Card {activeStepIndex + 1} of {conceptSteps.length}
            </div>
          </div>

          {/* Pip's Dialogue & Science Observation */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {activeStep.conceptTitle}
                </h3>
                <button
                  onClick={handleReadStep}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shadow-xs"
                  title="Listen to Pip"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed mb-4">
                {activeStep.pipDialogue}
              </p>
            </div>

            {/* Key Takeaway Badge */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs font-black text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeStep.keyTakeaway}</span>
            </div>

            {/* Step Navigation Dots if multiple steps */}
            {conceptSteps.length > 1 && (
              <div className="flex items-center gap-2 mt-4">
                {conceptSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.pop();
                      setActiveStepIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeStepIndex === idx ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Prediction Step: Think Fast Before Entering the Lab! ── */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-7 rounded-[36px] shadow-2xl text-white flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-2xl">
            🔮
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Step 2: Make Your Prediction
            </span>
            <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {predictionChallenge.question}
            </h3>
          </div>
        </div>

        {/* Clickable Prediction Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {predictionChallenge.options.map((opt: any, idx: number) => {
            const isSelected = userPrediction === idx;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPrediction(idx)}
                className={`p-4 rounded-2xl border-3 text-left font-black text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-950 text-amber-400 border-white shadow-xl scale-102 ring-4 ring-white/30'
                    : 'bg-white/95 text-slate-900 border-white/60 hover:bg-white'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {predictionSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-black/30 backdrop-blur-md rounded-2xl text-xs font-bold text-white text-center border border-white/20"
          >
            🎯 {predictionChallenge.explanation}
          </motion.div>
        )}
      </div>

      {/* ── 4. Main CTA: Enter Interactive Lab ── */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            sounds.fanfare();
            onStartLab();
          }}
          className="px-8 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base sm:text-lg shadow-2xl active:scale-95 transition-all flex items-center gap-3 cursor-pointer border-2 border-emerald-300"
        >
          <span>🔬 Enter Interactive Lab</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
