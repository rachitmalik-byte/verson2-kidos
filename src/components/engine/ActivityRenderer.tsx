import React from 'react';
import type { LessonStepData } from '@/types/lessonEngine';
import { WaterAbsorptionLabEngine } from './WaterAbsorptionLabEngine';
import { MicroscopicZoomViewerEngine } from './MicroscopicZoomViewerEngine';
import { SortingTrayEngine } from './SortingTrayEngine';
import { TensileStrengthRigEngine } from './TensileStrengthRigEngine';
import { McqAssessmentEngine } from './McqAssessmentEngine';
import { SpeechReadAloudCoach } from '@/components/voice/SpeechReadAloudCoach';

interface Props {
  stepData: LessonStepData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const ActivityRenderer: React.FC<Props> = ({ stepData, onComplete, isCompleted }) => {
  switch (stepData.type) {
    case 'water_absorption_lab':
      return (
        <WaterAbsorptionLabEngine
          data={stepData}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'microscopic_zoom_viewer':
      return (
        <MicroscopicZoomViewerEngine
          data={stepData}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'sorting_tray':
      return (
        <SortingTrayEngine
          data={stepData}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'tensile_strength_rig':
      return (
        <TensileStrengthRigEngine
          data={stepData}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'mcq_assessment':
      return (
        <McqAssessmentEngine
          data={stepData}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'read_aloud_coach':
      return (
        <SpeechReadAloudCoach
          targetSentence={stepData.targetSentence}
          onComplete={onComplete}
          contextTopic={stepData.title}
        />
      );

    case 'concept_summary':
      return (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-amber-400 shadow-xl flex flex-col items-center text-center gap-4 mx-auto">
          <span className="text-4xl">🎓</span>
          <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {stepData.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            {stepData.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
            {stepData.takeawayCards.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-left">
                <span className="text-2xl block mb-1">{c.icon}</span>
                <h4 className="font-black text-sm text-slate-900">{c.title}</h4>
                <p className="text-xs font-bold text-slate-600 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onComplete}
            className="w-full py-3.5 mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-lg active:scale-95"
          >
            Finish Mission & Claim Rewards ⭐
          </button>
        </div>
      );

    default:
      return null;
  }
};
