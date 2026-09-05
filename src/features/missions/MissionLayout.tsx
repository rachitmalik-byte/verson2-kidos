import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, Home, Map } from 'lucide-react';
import { missions } from '@/data/missions';
import { MissionAudioControls } from '@/components/navigation/AudioNavBarControls';
import { AskPipAssistant } from '@/components/pip/AskPipAssistant';
import { motion } from 'framer-motion';

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
  children,
}) => {
  const navigate = useNavigate();
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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pt-2 sm:pt-3 pb-28 sm:pb-24 pb-safe px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* Subtle Radial Ambient Workbench Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[400px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 relative z-10">
        {/* ── High-Precision Science Workbench Compact Header ── */}
        <header className="w-full max-w-4xl mx-auto bg-white/92 backdrop-blur-xl border border-slate-200/90 px-2.5 sm:px-4 py-2 rounded-2xl shadow-xs flex flex-col gap-1.5 transition-all">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Navigation & Mission Info */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <button
                onClick={handleHomeClick}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 border border-slate-200/80 cursor-pointer transition-all shrink-0 touch-manipulation"
                title="Return to Universe Dashboard"
              >
                <Home className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReturnToHub}
                className="px-2 sm:px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 border border-slate-200/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 touch-manipulation"
                title="Expedition Trail Map"
              >
                <Map className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Trail</span>
              </button>

              <div className="min-w-0 truncate ml-0.5 sm:ml-1 flex items-center gap-1.5 sm:gap-2">
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] sm:text-[11px] font-mono font-bold border border-teal-200/70 shrink-0">
                  M0{derivedNumber}
                </span>
                <h1 className="text-xs sm:text-sm font-heading font-extrabold text-slate-900 truncate leading-tight">
                  {derivedTitle}
                </h1>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <MissionAudioControls />
            </div>
          </div>

          {/* Smooth Step Progress Bar with Phase Counter */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 h-full rounded-full shadow-xs"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
              Phase {currentStep}/{totalSteps}
            </span>
          </div>
        </header>

        {/* ── Main Structured Science Workbench Stage ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[440px]">
          {children}
        </main>
      </div>

      {/* ── Socratic Pip AI Science Coach ── */}
      <AskPipAssistant
        currentGoal={`In Phase ${currentStep} of "${derivedTitle}", test physical parameters and observe specimen changes.`}
        stepHint="Inspect the interactive testing rig on screen. Tap buttons to crumple, stretch, or magnify!"
        conceptBreakdown="What a material is MADE OF determines what it CAN DO. Form follows function in nature and engineering!"
      />

      {/* ── Ergonomic Fixed Bottom Floating Action Dock ── */}
      <footer className="fixed bottom-2.5 sm:bottom-3 bottom-safe inset-x-0 mx-auto max-w-2xl z-40 px-2 sm:px-3 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 px-3 sm:px-4 py-2 rounded-2xl shadow-lg shadow-slate-300/40 flex items-center justify-between gap-2 sm:gap-3 transition-all">
          <button
            onClick={() => {
              sounds.pop();
              onPrev();
            }}
            disabled={currentStep <= 1}
            className="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 border border-slate-200/80 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all touch-manipulation min-h-[40px] shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous Phase</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 bg-slate-100/90 px-2 sm:px-3 py-1 rounded-full border border-slate-200/70 shrink-0">
            Phase {currentStep}/{totalSteps}
          </span>

          <button
            onClick={handleNextClick}
            disabled={!isStepComplete}
            className={`px-3.5 sm:px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer touch-manipulation min-h-[40px] shrink-0 ${
              isStepComplete
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-700/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentStep >= totalSteps ? 'Complete Mission' : 'Next Phase'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
