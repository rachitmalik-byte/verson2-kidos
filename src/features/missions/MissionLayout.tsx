import React, { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, Home, Map, Sparkles } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { MissionAudioControls } from '@/components/navigation/AudioNavBarControls';
import { AskPipAssistant } from '@/components/pip/AskPipAssistant';
import { ExplainItBackModal } from '@/components/reflection/ExplainItBackModal';
import { NaturalStoppingPointModal } from '@/components/wellness/NaturalStoppingPointModal';
import { motion, AnimatePresence } from 'framer-motion';

interface MissionLayoutProps {
  missionId: string;
  missionNumber?: number;
  missionTitle?: string;
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onRedo: () => void;
  children: ReactNode;
  themeGradient?: string;
}

export const MissionLayout: React.FC<MissionLayoutProps> = ({
  missionId,
  missionNumber,
  missionTitle,
  currentStep,
  totalSteps,
  isStepComplete,
  onNext,
  onPrev,
  onRedo,
  children,
  themeGradient = 'from-sky-100 via-indigo-50 to-amber-50',
}) => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const currentMission = missions.find((m) => m.id === missionId || m.number === missionNumber);
  const derivedNumber = missionNumber ?? currentMission?.number ?? 1;
  const derivedTitle = missionTitle || currentMission?.title || 'Science Mission';

  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showStoppingPointModal, setShowStoppingPointModal] = useState(false);

  const stepProgressPercent = Math.round((currentStep / Math.max(totalSteps, 1)) * 100);

  const handleReturnToHub = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/chapter-hub');
  };

  const handleHomeClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  const handleNextClick = () => {
    if (currentStep >= totalSteps) {
      sounds.fanfare();
      // Trigger "Explain It Back" reflection moment
      setShowExplainModal(true);
    } else {
      sounds.pop();
      onNext();
    }
  };

  const handleExplainClose = () => {
    setShowExplainModal(false);
    onNext();
    // If completed >= 2 missions, offer a natural stopping pause
    if (completedMissions.length >= 2) {
      setShowStoppingPointModal(true);
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${themeGradient} flex flex-col justify-between pt-2 sm:pt-3 pb-12 sm:pb-14 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden select-none`}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* ── Compact Top Level Mission Header & Progress Indicator ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-sm flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Navigation Buttons & Mission Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleHomeClick}
                  className="p-1 sm:p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Return to Main Home"
                >
                  <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                <button
                  onClick={handleReturnToHub}
                  className="flex items-center gap-0.5 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-amber-400 border border-amber-600 rounded-lg font-black text-slate-950 text-[10px] sm:text-xs hover:bg-amber-300 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  <span>Map</span>
                </button>
              </div>

              <div className="min-w-0 truncate">
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Mission {derivedNumber} / {missions.length}
                </span>
                <h1
                  className="text-[10px] sm:text-xs font-black text-slate-900 truncate leading-tight"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {derivedTitle}
                </h1>
              </div>
            </div>

            {/* Right: Audio Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <MissionAudioControls />
            </div>
          </div>

          {/* Step Progress Bar with Step Counter */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 p-0.5 border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 h-full rounded-full"
              />
            </div>
            <span className="text-[9px] font-black text-slate-500 shrink-0">
              {currentStep}/{totalSteps}
            </span>
          </div>
        </header>

        {/* ── Main Dynamic Activity Stage Area ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[420px]">
          {children}
        </main>
      </div>

      {/* ── Always-Visible "Stuck / Ask Pip" Confused Self-Advocacy Button ── */}
      <AskPipAssistant
        currentGoal={`In this step of "${derivedTitle}", we are investigating how physical properties decide everyday uses.`}
        stepHint="Look closely at the materials on screen. Tap each material or test button to see what happens!"
        conceptBreakdown="Natural materials come from plants and animals. Synthetic materials are made by science inventors in labs with special superpowers!"
      />

      {/* ── "Explain It Back In Your Own Words" Modal ── */}
      <ExplainItBackModal
        isOpen={showExplainModal}
        missionTitle={derivedTitle}
        onClose={handleExplainClose}
      />

      {/* ── Natural Stopping Point Modal ── */}
      <NaturalStoppingPointModal
        isOpen={showStoppingPointModal}
        onContinue={() => setShowStoppingPointModal(false)}
      />

      {/* ── Mission Complete Final Celebration Banner Overlay ── */}
      <AnimatePresence>
        {currentStep >= totalSteps && isStepComplete && (
          <motion.div
            key="mission-complete-splash"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 18, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4 pointer-events-none select-none font-sans"
          >
            <div className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center pointer-events-auto">
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl mb-2"
              >
                🏆
              </motion.div>
              <h2
                className="text-2xl font-black text-slate-900 mb-1"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Mission Complete!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mb-3">
                You mastered <strong>{derivedTitle}</strong>!
              </p>
              <div className="flex items-center justify-center gap-1.5 text-2xl mb-4">
                {['⭐', '⭐', '⭐'].map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 300 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
              <button
                onClick={handleNextClick}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-amber-500 flex items-center justify-center gap-2"
              >
                <span>Save Progress &amp; Finish ⭐</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ultra-thin Bottom Nav ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 sm:px-6 py-1">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-8">
          <button
            onClick={() => { sounds.pop(); onPrev(); }}
            disabled={currentStep <= 1}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] flex items-center gap-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all border border-slate-200"
          >
            <ArrowLeft className="w-3 h-3 stroke-[2.5]" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="text-[10px] font-black text-slate-500">
            {!isStepComplete && <span className="text-amber-600 mr-1">👆</span>}
            {currentStep}/{totalSteps}
          </span>

          <button
            onClick={handleNextClick}
            disabled={!isStepComplete}
            className={`px-2.5 py-1 rounded-lg font-black text-[10px] flex items-center gap-0.5 cursor-pointer transition-all active:scale-95 ${
              isStepComplete
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>{currentStep >= totalSteps ? 'Done ⭐' : 'Next'}</span>
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </button>
        </div>
      </footer>

    </div>
  );
};
