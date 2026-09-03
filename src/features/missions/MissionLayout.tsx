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
