import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProfile } from '@/types';

interface ParentState {
  isSetUp: boolean;
  pin: string;
  child: ChildProfile | null;
  role: 'child' | 'parent' | null;
  
  setRole: (role: 'child' | 'parent') => void;
  setPin: (pin: string) => void;
  setChild: (child: ChildProfile) => void;
  verifyPin: (pin: string) => boolean;
  completeSetup: () => void;
  reset: () => void;
}

export const useParentStore = create<ParentState>()(
  persist(
    (set, get) => ({
      isSetUp: false,
      pin: '',
      child: null,
      role: null,

      setRole: (role) => set({ role }),
      
      setPin: (pin) => set({ pin }),
      
      setChild: (child) => set({ child }),
      
      verifyPin: (pin) => get().pin === pin,
      
      completeSetup: () => set({ isSetUp: true }),
      
      reset: () => set({ isSetUp: false, pin: '', child: null, role: null }),
    }),
    { name: 'polyquest-parent' }
  )
);
