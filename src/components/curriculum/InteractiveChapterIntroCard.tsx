import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import type { CourseChapter } from '@/data/masterCurriculum';
import {
  Sparkles,
  FastForward,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  ZoomIn,
  X,
} from 'lucide-react';

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
  accentBorderColor = 'border-blue-500/40',
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const intro = chapterData?.chapterIntro || ({} as any);
  const conceptSteps = intro?.conceptSteps || [];
  const activeStep = conceptSteps[activeStepIndex] || conceptSteps[0];
  const stepImageSrc = activeStep?.imageAsset ? resolveImage(activeStep.imageAsset) : undefined;

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
      `You predicted: ${opt.text}. Let's enter the lab and test your hypothesis!`
    );
  };

  const handleReadStep = () => {
    sounds.pop();
    const msg = `${activeStep?.conceptTitle}: ${activeStep?.pipDialogue}`;
    voiceAssistant.speak(msg);
  };

  const handleNextCard = () => {
    sounds.pop();
    if (activeStepIndex < conceptSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      const el = document.getElementById('chapter-prediction-challenge');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevCard = () => {
    sounds.pop();
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none font-sans text-white">
      {/* ── 1. Top Hook Banner ── */}
      <div className={`portal-hero w-full bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border ${accentBorderColor} shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}>
        <div className="shrink-0 flex flex-col items-center">
          <Pip mood="curious" size={72} interactive={false} />
          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full mt-2 border border-cyan-500/30">
            Pip • Research Mentor
          </span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-400/30">
              Chapter {chapterData?.chapterNumber || 1} • Science Investigation
            </span>

            {/* Direct Quick Skip Button */}
            <button
              onClick={() => {
                sounds.fanfare();
                voiceAssistant.stop();
                onStartLab();
              }}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-cyan-400/30 transition-all"
              title="Skip introduction and jump straight into the interactive lab"
            >
              <span>Skip to Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
            {intro?.title || chapterData?.chapterTitle || 'Chapter Science Quest'} {chapterData?.icon || '🔬'}
          </h1>

          <p className="text-xs sm:text-sm font-normal text-slate-300 mt-2 leading-relaxed">
            {intro?.hookScene || 'Explore the secrets of the living and material world!'}
          </p>

          <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-200 flex items-start gap-2 backdrop-blur-sm">
            <span className="text-base">🔎</span>
            <div>
              <span className="text-amber-400 uppercase tracking-wider text-[10px] block font-mono font-bold">Guiding Curiosity Question</span>
              <span className="font-semibold text-slate-100">{intro?.bigGuidingQuestion || 'Why does nature use such different materials and adaptations?'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Visual Concept Card with Topic Switchers ── */}
      {activeStep && (
        <div className="w-full bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col gap-5">
          {/* Topic Switcher Pills */}
          {conceptSteps.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Investigation Steps:</span>
              </span>
              {conceptSteps.map((step: any, idx: number) => {
                const isCurrent = activeStepIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.pop();
                      setActiveStepIndex(idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-cyan-400/40'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[180px] sm:max-w-xs">{step.conceptTitle}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Card Content */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Real Photo / Specimen View */}
            <div
              onClick={() => {
                sounds.pop();
                setIsImageZoomed(true);
              }}
              className="relative w-full md:w-80 h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shrink-0 flex items-center justify-center cursor-zoom-in group shadow-lg"
              title="Click to zoom specimen"
            >
              {stepImageSrc ? (
                <img
                  src={stepImageSrc}
                  alt={activeStep.conceptTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-4">
                  <span className="text-6xl block mb-2">{chapterData?.icon || '🔬'}</span>
                  <span className="text-xs font-bold text-white">{activeStep.conceptTitle}</span>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-300 border border-white/15">
                Card {activeStepIndex + 1} of {conceptSteps.length}
              </div>

              {/* Zoom Inspect Badge */}
              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1.5 border border-white/15 group-hover:bg-blue-600 transition-all">
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zoom Micrograph</span>
              </div>
            </div>

            {/* Pip's Dialogue & Science Observation */}
            <div className="flex-1 flex flex-col justify-between h-full text-left">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-white">
                    {activeStep.conceptTitle}
                  </h3>
                  <button
                    onClick={handleReadStep}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-300 border border-white/10 cursor-pointer"
                    title="Listen to Pip"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed mb-4">
                  "{activeStep.pipDialogue}"
                </p>
              </div>

              {/* Key Takeaway Badge */}
              <div className="p-3 bg-cyan-950/50 rounded-xl border border-cyan-500/30 text-xs font-semibold text-cyan-200 flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{activeStep.keyTakeaway}</span>
              </div>

              {/* Prominent Next Card / Previous Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                {activeStepIndex > 0 ? (
                  <button
                    onClick={handlePrevCard}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => {
                    sounds.fanfare();
                    voiceAssistant.stop();
                    onStartLab();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all"
                >
                  <FastForward className="w-3.5 h-3.5 text-amber-400" />
                  <span>Skip to Lab</span>
                </button>

                {activeStepIndex < conceptSteps.length - 1 ? (
                  <button
                    onClick={handleNextCard}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/30 transition-all"
                  >
                    <span>Next Card ({activeStepIndex + 2}/{conceptSteps.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextCard}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>Hypothesis Challenge ⬇️</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. High-Resolution Zoomed Lightbox Modal ── */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl border border-white/20 shadow-2xl p-4 sm:p-6 flex flex-col items-center gap-4 cursor-default overflow-hidden"
            >
              <button
                onClick={() => {
                  sounds.pop();
                  setIsImageZoomed(false);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[65vh] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                {stepImageSrc && (
                  <img
                    src={stepImageSrc}
                    alt={activeStep?.conceptTitle}
                    className="w-full h-full max-h-[65vh] object-contain"
                  />
                )}
              </div>

              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-amber-400">
                    🔬 {activeStep?.conceptTitle}
                  </h4>
                  <p className="text-xs text-slate-300 font-normal max-w-xl mt-0.5">
                    {activeStep?.keyTakeaway}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.pop();
                    setIsImageZoomed(false);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shrink-0"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Prediction Step ── */}
      <div id="chapter-prediction-challenge" className="w-full bg-slate-900/90 border border-amber-500/40 p-6 rounded-2xl shadow-2xl text-white flex flex-col gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-2xl">
            🔮
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Hypothesis Test Before Entering Lab
            </span>
            <h3 className="text-base sm:text-lg font-display font-bold text-white">
              {predictionChallenge.question}
            </h3>
          </div>
        </div>

        {/* Clickable Prediction Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {predictionChallenge.options.map((opt: any, idx: number) => {
            const isSelected = userPrediction === idx;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectPrediction(idx)}
                className={`p-4 rounded-xl border text-left font-semibold text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-cyan-400 shadow-xl ring-2 ring-cyan-400/40'
                    : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {predictionSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-medium text-emerald-200 text-center"
          >
            🎯 {predictionChallenge.explanation}
          </motion.div>
        )}
      </div>

      {/* ── 5. Main CTA: Enter Interactive Lab ── */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            sounds.fanfare();
            onStartLab();
          }}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
        >
          <span>Enter Interactive Lab</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
