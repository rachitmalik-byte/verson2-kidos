import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedMissions: string[];
  currentMission: string;
  currentStep: number;
  missionStepProgress: Record<string, number>; // missionId -> last completed step index
  
  completeMission: (missionId: string) => void;
  setCurrentMission: (missionId: string) => void;
  setCurrentStep: (step: number) => void;
  advanceStep: (missionId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedMissions: [],
      currentMission: 'mission-01',
      currentStep: 0,
      missionStepProgress: {},

      completeMission: (missionId: string) => {
        const { completedMissions } = get();
        if (!completedMissions.includes(missionId)) {
          set({ completedMissions: [...completedMissions, missionId] });
        }
      },

      setCurrentMission: (missionId: string) => {
        set({ currentMission: missionId, currentStep: 0 });
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      advanceStep: (missionId: string) => {
        const { currentStep, missionStepProgress } = get();
        const newStep = currentStep + 1;
        set({
          currentStep: newStep,
          missionStepProgress: {
            ...missionStepProgress,
            [missionId]: Math.max(missionStepProgress[missionId] || 0, newStep),
          },
        });
      },

      resetProgress: () => {
        set({
          completedMissions: [],
          currentMission: 'mission-01',
          currentStep: 0,
          missionStepProgress: {},
        });
      },
    }),
    { name: 'polyquest-progress' }
  )
);
