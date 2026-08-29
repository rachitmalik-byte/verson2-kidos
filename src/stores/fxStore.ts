import { create } from 'zustand';

export type FXType = 'rain' | 'spark' | 'steam' | 'timelapse' | 'confetti';

interface FXState {
  activeFX: FXType | null;
  duration: number;
  triggerFX: (type: FXType, durationMs?: number) => void;
  clearFX: () => void;
}

export const useFXStore = create<FXState>((set) => ({
  activeFX: null,
  duration: 3500,
  triggerFX: (type: FXType, durationMs = 3500) => {
    set({ activeFX: type, duration: durationMs });
    setTimeout(() => {
      set((state) => (state.activeFX === type ? { activeFX: null } : state));
    }, durationMs);
  },
  clearFX: () => set({ activeFX: null }),
}));
