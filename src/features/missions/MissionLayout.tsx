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
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 flex flex-col justify-between pt-3 sm:pt-4 pb-24 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Subtle Radial Ambient Workbench Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 relative z-10">
        {/* ── High-Precision Science Workbench Header ── */}
        <header className="w-full bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl flex flex-col gap-2.5 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            {/* Navigation & Mission Info */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={handleHomeClick}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 cursor-pointer transition-all"
                title="Return to Universe Dashboard"
              >
                <Home className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReturnToHub}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Expedition Trail Map"
              >
                <Map className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Trail</span>
              </button>

              <div className="min-w-0 truncate ml-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-400/30">
                  M0{derivedNumber}
                </span>
                <h1 className="text-xs sm:text-sm font-display font-bold text-white truncate leading-tight">
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
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full shadow-sm shadow-cyan-400/50"
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
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

      {/* ── Ergonomic Fixed Bottom Action Dock ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/15 px-4 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-10">
          <button
            onClick={() => {
              sounds.pop();
              onPrev();
            }}
            disabled={currentStep <= 1}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Phase</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-400">
            Phase {currentStep} of {totalSteps}
          </span>

          <button
            onClick={handleNextClick}
            disabled={!isStepComplete}
            className={`px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isStepComplete
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-slate-500 border border-white/10 cursor-not-allowed opacity-50'
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
