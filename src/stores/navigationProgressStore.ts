import { create } from 'zustand';

export interface ExperimentStepInfo {
  phaseName: string;
  stepIndex: number;
  totalSteps: number;
  stepsDone: number;
  stepsLeft: number;
}

export interface ExerciseInfo {
  exerciseName: string;
  currentIndex: number;
  totalCount: number;
  completedCount: number;
}

interface NavigationProgressState {
  // Live override states from active components
  activeExperiment: ExperimentStepInfo | null;
  activeExercise: ExerciseInfo | null;

  setExperimentProgress: (info: ExperimentStepInfo | null) => void;
  setExerciseProgress: (info: ExerciseInfo | null) => void;
  resetContextProgress: () => void;
}

export const useNavigationProgressStore = create<NavigationProgressState>((set) => ({
  activeExperiment: null,
  activeExercise: null,

  setExperimentProgress: (info) => set({ activeExperiment: info }),
  setExerciseProgress: (info) => set({ activeExercise: info }),
  resetContextProgress: () => set({ activeExperiment: null, activeExercise: null }),
}));
