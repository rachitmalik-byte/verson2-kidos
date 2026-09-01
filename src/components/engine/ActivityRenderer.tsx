import React from 'react';
import type { LessonStepData } from '@/types/lessonEngine';
import { InteractiveDiagramEngine } from './InteractiveDiagramEngine';
import { WaterAbsorptionLabEngine } from './WaterAbsorptionLabEngine';
import { MicroscopicZoomViewerEngine } from './MicroscopicZoomViewerEngine';
import { SortingTrayEngine } from './SortingTrayEngine';
import { TensileStrengthRigEngine } from './TensileStrengthRigEngine';
import { MatchingGameEngine } from './MatchingGameEngine';
import { McqAssessmentEngine } from './McqAssessmentEngine';
import { SummerComfortVectorLab } from '@/components/interactive/SummerComfortVectorLab';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';

interface Props {
  stepData: LessonStepData;
  onComplete?: () => void;
  onStepComplete?: () => void;
  isCompleted?: boolean;
}

export const ActivityRenderer: React.FC<Props> = ({ stepData, onComplete, onStepComplete, isCompleted }) => {
  const handleDone = () => {
    if (onComplete) onComplete();
    if (onStepComplete) onStepComplete();
  };

  if (!stepData) {
    return (
      <div className="p-6 bg-slate-900 rounded-3xl border-2 border-slate-800 text-center text-slate-400 font-bold text-xs">
        No step data provided.
      </div>
    );
  }

  switch (stepData.type) {
    case 'interactive_diagram':
      return (
        <InteractiveDiagramEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'water_absorption_lab':
      return (
        <WaterAbsorptionLabEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'microscopic_zoom_viewer':
      return (
        <MicroscopicZoomViewerEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'sorting_tray':
      return (
        <SortingTrayEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'tensile_strength_rig':
      return (
        <TensileStrengthRigEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'matching_pairs':
      return (
        <MatchingGameEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'mcq_assessment':
      return (
        <McqAssessmentEngine
          data={stepData as any}
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'summer_comfort_sim':
    case 'scenario_sim':
      return (
        <SummerComfortVectorLab
          onComplete={handleDone}
          isCompleted={isCompleted}
        />
      );

    case 'read_aloud_coach':
      return (
        <SpeechReadAloudCoach
          targetSentence={(stepData as any).targetSentence || stepData.pipPrompt || 'Science is the study of our natural world!'}
          onComplete={handleDone}
          contextTopic={stepData.title}
        />
      );

    case 'concept_summary':
      return (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-amber-400 shadow-xl flex flex-col items-center text-center gap-4 mx-auto select-none">
          <span className="text-4xl">🎓</span>
          <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {stepData.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            {stepData.subtitle || 'Core Science Law Synthesis'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2">
            {((stepData as any).principles || [
              { icon: '🧱', title: 'Made From', description: 'Raw natural or synthetic polymers' },
              { icon: '⚡', title: 'Can Do', description: 'Specific mechanical & thermal superpowers' },
              { icon: '🎯', title: 'Used For', description: 'Everyday applications suited to traits' },
            ]).map((c: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-left">
                <span className="text-2xl block mb-1">{c.icon}</span>
                <h4 className="font-black text-sm text-slate-900">{c.title}</h4>
                <p className="text-xs font-bold text-slate-600 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleDone}
            className="w-full py-3.5 mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            Finish Activity & Claim Rewards ⭐
          </button>
        </div>
      );

    default:
      return (
        <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 text-center">
          <p className="text-sm font-bold text-slate-600">Activity ready to explore!</p>
          <button
            onClick={handleDone}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Mark Step Completed
          </button>
        </div>
      );
  }
};
