import { create } from 'zustand';
import type { PipMood } from '@/types';

interface PipState {
  mood: PipMood;
  isSpeaking: boolean;
  currentMessage: string;
  hintLevel: number; // 0 = no hints, up to 4
  isVisible: boolean;
  
  setMood: (mood: PipMood) => void;
  speak: (message: string, mood?: PipMood) => void;
  stopSpeaking: () => void;
  incrementHint: () => void;
  resetHints: () => void;
  setVisible: (visible: boolean) => void;
}

export const usePipStore = create<PipState>()((set) => ({
  mood: 'idle',
  isSpeaking: false,
  currentMessage: '',
  hintLevel: 0,
  isVisible: true,

  setMood: (mood) => set({ mood }),
  
  speak: (message, mood) => set({ 
    currentMessage: message, 
    isSpeaking: true, 
    mood: mood || 'explaining' 
  }),
  
  stopSpeaking: () => set({ isSpeaking: false, currentMessage: '' }),
  
  incrementHint: () => set((state) => ({ 
    hintLevel: Math.min(state.hintLevel + 1, 4),
    mood: 'hinting' as PipMood,
  })),
  
  resetHints: () => set({ hintLevel: 0 }),
  
  setVisible: (visible) => set({ isVisible: visible }),
}));
