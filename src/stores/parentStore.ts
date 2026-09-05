import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProfile } from '@/types';

export interface ChildExplanation {
  missionTitle: string;
  quote: string;
  timestamp: number;
}

interface ParentState {
  isSetUp: boolean;
  pin: string;
  child: ChildProfile | null;
  role: 'child' | 'parent' | null;
  childExplanations: ChildExplanation[];
  lessonAccess: Record<string, boolean>;
  
  setRole: (role: 'child' | 'parent') => void;
  setPin: (pin: string) => void;
  setChild: (child: ChildProfile) => void;
  verifyPin: (pin: string) => boolean;
  completeSetup: () => void;
  saveExplanation: (explanation: ChildExplanation) => void;
  toggleLessonAccess: (lessonId: string) => void;
  setLessonAccess: (lessonId: string, allowed: boolean) => void;
  isLessonAllowed: (lessonId: string) => boolean;
  allowAllLessons: () => void;
  setFocusedPace: (maxMissionNum: number, allMissions: { id: string; number: number }[]) => void;
  reset: () => void;
}

export const useParentStore = create<ParentState>()(
  persist(
    (set, get) => ({
      isSetUp: false,
      pin: '',
      child: null,
      role: null,
      childExplanations: [
        {
          missionTitle: 'The Raincoat Mystery',
          quote: 'Cotton gets super heavy and soaked in rain because of plant holes, but polyester makes raindrops bounce off!',
          timestamp: Date.now() - 86400000,
        },
      ],
      lessonAccess: {},

      setRole: (role) => set({ role }),
      
      setPin: (pin) => set({ pin }),
      
      setChild: (child) => set({ child }),
      
      verifyPin: (pin) => get().pin === pin,
      
      completeSetup: () => set({ isSetUp: true }),

      saveExplanation: (explanation) => {
        const { childExplanations } = get();
        set({ childExplanations: [explanation, ...childExplanations] });
      },

      toggleLessonAccess: (lessonId: string) => {
        const current = get().lessonAccess || {};
        const isCurrentlyAllowed = current[lessonId] !== false; // default true
        set({ lessonAccess: { ...current, [lessonId]: !isCurrentlyAllowed } });
      },

      setLessonAccess: (lessonId: string, allowed: boolean) => {
        const current = get().lessonAccess || {};
        set({ lessonAccess: { ...current, [lessonId]: allowed } });
      },

      isLessonAllowed: (lessonId: string) => {
        const current = get().lessonAccess || {};
        return current[lessonId] !== false;
      },

      allowAllLessons: () => set({ lessonAccess: {} }),

      setFocusedPace: (maxMissionNum: number, allMissions: { id: string; number: number }[]) => {
        const newMap: Record<string, boolean> = {};
        allMissions.forEach((m) => {
          newMap[m.id] = m.number <= maxMissionNum;
        });
        set({ lessonAccess: newMap });
      },
      
      reset: () => set({ isSetUp: false, pin: '', child: null, role: null, childExplanations: [], lessonAccess: {} }),
    }),
    { name: 'polyquest-parent' }
  )
);
