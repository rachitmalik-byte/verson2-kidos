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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between pt-3 sm:pt-4 pb-20 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* ── Precision Study Desk Top Mission Header & Progress ── */}
        <header className="w-full edtech-card px-4 py-3 flex flex-col gap-2.5 bg-white shadow-xs">
          <div className="flex items-center justify-between gap-3">
            {/* Navigation & Mission Info */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleHomeClick}
                className="edtech-btn-secondary p-2 text-slate-600"
                title="Return to Dashboard"
              >
                <Home className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReturnToHub}
                className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
                title="Expedition Trail Map"
              >
                <Map className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Map</span>
              </button>

              <div className="min-w-0 truncate ml-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-mono font-bold border border-blue-200/60">
                  M{derivedNumber}
                </span>
                <h1 className="text-xs sm:text-sm font-heading font-bold text-slate-900 truncate leading-tight">
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
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full"
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
              Phase {currentStep}/{totalSteps}
            </span>
          </div>
        </header>

        {/* ── Main Structured Study Desk Stage ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[420px]">
          {children}
        </main>
      </div>

      {/* ── Calm Floating Pip Assistant Sidecar ── */}
      <AskPipAssistant
        currentGoal={`In Phase ${currentStep} of "${derivedTitle}", investigate the physical and structural properties of the specimens.`}
        stepHint="Inspect the interactive controls on screen. Test each material or parameter to observe results!"
        conceptBreakdown="What a material is MADE OF determines what it CAN DO. Form follows function in nature and engineering!"
      />

      {/* ── Ergonomic Fixed Bottom Navigation Bar ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-9 sm:h-10">
          <button
            onClick={() => {
              sounds.pop();
              onPrev();
            }}
            disabled={currentStep <= 1}
            className="edtech-btn-secondary px-4 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Phase</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            Phase {currentStep} of {totalSteps}
          </span>

          <button
            onClick={handleNextClick}
            disabled={!isStepComplete}
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isStepComplete
                ? 'edtech-btn-primary shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{currentStep >= totalSteps ? 'Complete Mission ⭐' : 'Next Phase'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
