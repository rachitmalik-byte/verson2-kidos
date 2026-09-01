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
  
  setRole: (role: 'child' | 'parent') => void;
  setPin: (pin: string) => void;
  setChild: (child: ChildProfile) => void;
  verifyPin: (pin: string) => boolean;
  completeSetup: () => void;
  saveExplanation: (explanation: ChildExplanation) => void;
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

      setRole: (role) => set({ role }),
      
      setPin: (pin) => set({ pin }),
      
      setChild: (child) => set({ child }),
      
      verifyPin: (pin) => get().pin === pin,
      
      completeSetup: () => set({ isSetUp: true }),

      saveExplanation: (explanation) => {
        const { childExplanations } = get();
        set({ childExplanations: [explanation, ...childExplanations] });
      },
      
      reset: () => set({ isSetUp: false, pin: '', child: null, role: null, childExplanations: [] }),
    }),
    { name: 'polyquest-parent' }
  )
);
