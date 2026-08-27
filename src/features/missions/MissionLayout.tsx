import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, RotateCcw, Star, Home } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';

interface MissionLayoutProps {
  missionId: string;
  missionNumber: number;
  missionTitle: string;
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

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${themeGradient} flex flex-col justify-between pt-4 sm:pt-6 pb-24 sm:pb-28 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden`}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* ── Top Game Bar with Click-to-Home Logo & Live Audio Toggles ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-3 border-slate-200/90 p-3.5 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Home / Map Nav + Mission Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <button
                onClick={handleHomeClick}
                className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
                title="Return to Main Home Screen"
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={handleReturnToHub}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 border-2 border-amber-600 rounded-2xl font-black text-slate-950 text-xs sm:text-sm shadow-[0_3px_0_#D97706] active:translate-y-1 hover:bg-amber-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span>Map</span>
              </button>
            </div>

            <div className="text-right sm:text-left truncate">
              <div className="flex items-center gap-1 sm:gap-1.5 justify-end sm:justify-start">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  Mission {missionNumber}
                </span>
                <span className="text-[11px] font-bold text-slate-500">Step {currentStep} of {totalSteps}</span>
              </div>
              <h1 className="text-sm sm:text-lg font-black text-slate-900 truncate" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {missionTitle}
              </h1>
            </div>
          </div>

          {/* Right: Audio Toggles + Stepping Stones + Stars */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center w-full sm:w-auto">
            {/* SFX and TTS Voice Controls */}
            <AudioNavBarControls showProfile={false} />

            {/* Step Stepping Stones */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-2xl border border-slate-200">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    stepNum === currentStep
                      ? 'w-5 sm:w-6 bg-amber-500 ring-2 ring-amber-300'
                      : stepNum < currentStep
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Stars Counter */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 font-black text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{starsCount}</span>
            </div>
          </div>
        </header>

        {/* ── Main Experiment Workbench Content ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
          {children}
        </main>
      </div>

      {/* ── Bottom Tactile Navigation Bar (Fixed for Mobile & Desktop) ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-slate-200 py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <button
            onClick={() => {
              voiceAssistant.stop();
              onPrev();
            }}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl btn-3d-slate text-xs sm:text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={() => {
              voiceAssistant.stop();
              onRedo();
            }}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-black border border-slate-300 cursor-pointer transition-colors active:scale-95"
            title="Reset this step"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reset Step</span>
          </button>

          <button
            onClick={() => {
              if (isStepComplete) {
                voiceAssistant.stop();
                onNext();
              } else {
                sounds.boing();
                voiceAssistant.speak('Tap your answer or try the experiment on screen first to continue!');
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-base transition-all cursor-pointer ${
              isStepComplete
                ? 'btn-3d-amber animate-pulse'
                : 'bg-amber-100/70 text-amber-900 border-2 border-amber-300 hover:bg-amber-100 shadow-xs'
            }`}
            title={isStepComplete ? 'Advance to next step' : 'Complete the activity above first!'}
          >
            <span>{currentStep === totalSteps ? 'Complete! 🎉' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3]" />
          </button>
        </div>
      </footer>
    </div>
  );
};
