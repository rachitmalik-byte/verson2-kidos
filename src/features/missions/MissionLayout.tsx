import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, RotateCcw, Star, Home } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { MissionAudioControls } from '@/components/navigation/AudioNavBarControls';
import { SocraticPipAITutorModal } from '@/components/ai/SocraticPipAITutorModal';

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
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const currentMission = missions.find((m) => m.id === missionId || m.number === missionNumber);
  const derivedNumber = missionNumber ?? currentMission?.number ?? 1;
  const derivedTitle = missionTitle || currentMission?.title || 'Science Mission';

  const starsCount = completedMissions.length * 3 + discoveries.length * 2;

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

  const [showPipModal, setShowPipModal] = React.useState(false);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${themeGradient} flex flex-col justify-between pt-3 sm:pt-5 pb-24 sm:pb-28 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden`}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* ── Top Game Bar: Clean Single Row on Both Desktop & Mobile ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-slate-200/90 px-3 py-2 sm:px-5 sm:py-3 shadow-md flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Home + Map + Mission Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleHomeClick}
                className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
                title="Return to Main Home"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={handleReturnToHub}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-amber-400 border-2 border-amber-600 rounded-xl sm:rounded-2xl font-black text-slate-950 text-xs sm:text-sm shadow-[0_2px_0_#D97706] active:translate-y-0.5 hover:bg-amber-300 transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span>Map</span>
              </button>
            </div>

            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded shrink-0">
                  Mission {derivedNumber}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 shrink-0">
                  Step {currentStep}/{totalSteps}
                </span>
              </div>
              <h1
                className="text-xs sm:text-base font-black text-slate-900 truncate"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {derivedTitle}
              </h1>
            </div>
          </div>

          {/* Right: Progress Stepping Stones + Stars + Clean Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Stars Count Capsule */}
            <div className="flex items-center gap-1 bg-amber-50 border-2 border-amber-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm text-amber-900 shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{starsCount}</span>
            </div>

            {/* Compact Mission Audio Controls & AI Hub */}
            <MissionAudioControls />
          </div>
        </header>

        {/* ── Main Experiment Workbench Content ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
          {children}
        </main>
      </div>

      {/* Floating Ask Pip AI Mentor Bubble (Always accessible between activity steps) */}
      <button
        onClick={() => {
          sounds.sparkle();
          setShowPipModal(true);
        }}
        className="fixed bottom-20 right-4 sm:right-6 z-40 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-all hover:shadow-indigo-300/50"
        title="Ask Pip AI for a science clue"
      >
        <span className="text-lg">🤖</span>
        <span className="font-black text-xs sm:text-sm tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Ask Pip Clue ✨
        </span>
      </button>

      {/* ── Bottom Tactile Navigation Bar (Fixed for Mobile & Desktop) ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onPrev}
            disabled={currentStep <= 1}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
              currentStep <= 1
                ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs active:scale-95'
            }`}
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={onRedo}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl font-black text-xs sm:text-sm text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Reset Current Experiment Step"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onNext}
            disabled={!isStepComplete}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
              isStepComplete
                ? 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-slate-950 shadow-[0_3px_0_#D97706] active:translate-y-0.5 animate-pulse'
                : 'opacity-50 bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === totalSteps ? 'Complete Mission 🏆' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </footer>

      {/* Socratic Pip AI Modal */}
      <SocraticPipAITutorModal isOpen={showPipModal} onClose={() => setShowPipModal(false)} />
    </div>
  );
};
