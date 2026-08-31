import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MissionLayout } from '../MissionLayout';
import { missions } from '@/data/missions';
import { lessonConfigs } from '@/data/lessonConfig';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { bgmEngine } from '@/lib/bgmEngine';
import { ActivityRenderer } from '@/components/engine/ActivityRenderer';
import { Sparkles, ArrowRight } from 'lucide-react';

export const DynamicMissionEngine: React.FC = () => {
  const { missionNum } = useParams<{ missionNum: string }>();
  const missionNumber = parseInt(missionNum || '1', 10);
  const navigate = useNavigate();

  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const mission = missions.find((m) => m.number === missionNumber) || missions[0];
  const lessonConfig = lessonConfigs[missionNumber];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    voiceAssistant.stop();
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    sounds.pop();

    if (lessonConfig?.bgmTrack) {
      bgmEngine.setTrack(lessonConfig.bgmTrack as any);
    } else {
      bgmEngine.setTrack('playful-lab');
    }
  }, [missionNumber]);

  // If we have declarative lesson steps in lessonConfig
  const steps = lessonConfig?.steps || [];
  const currentStepData = steps[currentStepIndex];
  const totalSteps = steps.length || 1;
  const isCurrentStepComplete = completedSteps.includes(currentStepIndex);

  const handleStepComplete = () => {
    setCompletedSteps((prev) => (prev.includes(currentStepIndex) ? prev : [...prev, currentStepIndex]));
  };

  const handleNextStep = () => {
    voiceAssistant.stop();
    if (currentStepIndex < totalSteps - 1) {
      sounds.bubble();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Mission Complete
      sounds.fanfare();
      setShowCelebration(true);
      completeMission(mission.id);
      addDiscovery({
        id: `discovery-${mission.id}`,
        name: mission.title,
        category: 'synthetic',
        icon: mission.icon,
        description: mission.subtitle,
        discoveredIn: `Mission ${mission.number}`,
        funFact: `Engineered properties determine why ${mission.title} is selected in modern science!`,
      });
      setTimeout(() => {
        navigate('/chapter-hub');
      }, 2500);
    }
  };

  const handlePrevStep = () => {
    voiceAssistant.stop();
    if (currentStepIndex > 0) {
      sounds.pop();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    voiceAssistant.stop();
    sounds.pop();
    setCompletedSteps((prev) => prev.filter((s) => s !== currentStepIndex));
  };

  if (!currentStepData) {
    return (
      <MissionLayout
        missionId={mission.id}
        missionNumber={mission.number}
        missionTitle={mission.title}
        currentStep={1}
        totalSteps={1}
        isStepComplete={true}
        onNext={() => navigate('/chapter-hub')}
        onPrev={() => navigate('/chapter-hub')}
        onRedo={() => {}}
      >
        <div className="text-center p-8 bg-white/95 rounded-3xl border-2 border-slate-200 shadow-lg">
          <span className="text-4xl block mb-2">{mission.icon}</span>
          <h2 className="text-xl font-black text-slate-900">{mission.title}</h2>
          <p className="text-xs font-bold text-slate-600 mt-1">{mission.subtitle}</p>
          <button
            onClick={() => navigate('/chapter-hub')}
            className="mt-4 px-6 py-3 bg-amber-400 font-black text-xs rounded-2xl cursor-pointer shadow-md"
          >
            Return to Mission Road 🗺️
          </button>
        </div>
      </MissionLayout>
    );
  }

  return (
    <MissionLayout
      missionId={mission.id}
      missionNumber={mission.number}
      missionTitle={mission.title}
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isCurrentStepComplete}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
      onRedo={handleRedo}
    >
      <div className="w-full flex flex-col items-center gap-5">
        {/* Pip Interactive Prompt Banner */}
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border-2 border-amber-300 shadow-md flex items-center gap-3">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12">
            <Pip mood={currentStepData.pipMood || 'explaining'} size="sm" />
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-800 leading-snug">
            {currentStepData.pipPrompt}
          </p>
        </div>

        {/* Dynamic Activity Dispatcher Component Registry */}
        <div className="w-full">
          <ActivityRenderer
            stepData={currentStepData}
            onComplete={handleStepComplete}
            isCompleted={isCurrentStepComplete}
          />
        </div>
      </div>

      {/* Full Screen Celebration Overlay on Completion */}
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
      />
    </MissionLayout>
  );
};
