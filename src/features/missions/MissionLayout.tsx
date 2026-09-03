import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, Home, Map } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { MissionAudioControls } from '@/components/navigation/AudioNavBarControls';
import { AskPipAssistant } from '@/components/pip/AskPipAssistant';
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
    sounds.pop();
    onNext();
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FAF8F5] text-[#262930] flex flex-col justify-between pt-2 sm:pt-3 pb-24 sm:pb-28 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden select-none"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 sm:gap-5">
        {/* ── Compact Top Level Mission Header & Progress Indicator ── */}
        <header className="w-full squircle-card px-3 py-2 sm:px-4 sm:py-2.5 shadow-soft-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Navigation Buttons & Mission Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleHomeClick}
                  className="pill-btn-secondary p-2 text-[#5A6072]"
                  title="Return to Main Home"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleReturnToHub}
                  className="pill-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                >
                  <Map className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Map</span>
                </button>
              </div>

              <div className="min-w-0 truncate ml-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#7E8494] block sm:inline sm:mr-1.5">
                  M{derivedNumber}
                </span>
                <h1 className="text-xs sm:text-sm font-extrabold text-[#262930] truncate leading-tight inline">
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
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex-1 bg-[#F1EFEA] rounded-full h-2 p-0.5 border border-slate-200/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-[#FDE047] via-[#FDBA74] to-[#86EFAC] h-full rounded-full"
              />
            </div>
            <span className="text-[10px] font-extrabold text-[#5A6072] shrink-0">
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

      {/* ── Ergonomic Bottom Nav ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-slate-200/80 px-3 sm:px-6 py-2 shadow-soft-float">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-9 sm:h-10">
          <button
            onClick={() => { sounds.pop(); onPrev(); }}
            disabled={currentStep <= 1}
            className="pill-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="text-xs font-bold text-[#5A6072]">
            {!isStepComplete && <span className="text-[#EA580C] mr-1">👆</span>}
            Step {currentStep} of {totalSteps}
          </span>

          <button
            onClick={handleNextClick}
            disabled={!isStepComplete}
            className={`px-5 py-2 rounded-full font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isStepComplete
                ? 'pill-btn-primary shadow-soft-pill'
                : 'bg-[#F1EFEA] text-[#8A90A0] border border-slate-200/80 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentStep >= totalSteps ? 'Done ⭐' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
};
