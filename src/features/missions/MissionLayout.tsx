import { MaterialsAnimatedLabBackground } from '@/components/effects/MaterialsAnimatedLabBackground';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Sparkles, Map } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { MissionAudioControls } from '@/components/navigation/AudioNavBarControls';
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

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${themeGradient} flex flex-col justify-between pt-3 sm:pt-5 pb-24 sm:pb-28 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden`}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* ── Persistent Top Level Mission Header & Progress Indicator ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-slate-200 px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Navigation Buttons & Mission Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleHomeClick}
                  className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Return to Main Home"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={handleReturnToHub}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-amber-400 border-2 border-amber-600 rounded-xl font-black text-slate-950 text-xs sm:text-sm hover:bg-amber-300 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  <span>Map</span>
                </button>
              </div>

              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded shrink-0">
                    CBSE Class 5 Science
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-900 px-2 py-0.5 rounded shrink-0">
                    Mission {derivedNumber} of {missions.length}
                  </span>
                </div>
                <h1
                  className="text-xs sm:text-base font-black text-slate-900 truncate mt-0.5"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {derivedTitle}
                </h1>
              </div>
            </div>

            {/* Right: Audio & Dedicated Single AI Lab Trigger */}
            <div className="flex items-center gap-1.5 shrink-0">
              <MissionAudioControls />
            </div>
          </div>

          {/* Linear Step Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 sm:h-2.5 p-0.5 border border-slate-200 flex items-center">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepProgressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 h-full rounded-full"
            />
          </div>
        </header>

        {/* ── Main Dynamic Activity Stage Area ── */}
        <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[420px]">
          {children}
        </main>
      </div>

      {/* ── Persistent Bottom Step Navigation Action Bar ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 py-2.5 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Step Button */}
          <button
            onClick={() => {
              sounds.pop();
              onPrev();
            }}
            disabled={currentStep <= 1}
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Center Step Counter Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Next Step / Complete Button */}
          <button
            onClick={() => {
              sounds.pop();
              onNext();
            }}
            disabled={!isStepComplete}
            className={`px-5 py-2.5 sm:px-7 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
              isStepComplete
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 shadow-lg ring-4 ring-amber-300/60 animate-pulse'
                : 'bg-slate-200 text-slate-400 border border-slate-300 opacity-60 cursor-not-allowed'
            }`}
          >
            <span>{currentStep >= totalSteps ? 'Complete Mission ⭐' : 'Next Step ➔'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </footer>
    </div>
  );
};
