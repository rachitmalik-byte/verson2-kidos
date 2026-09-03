import { create } from 'zustand';

export type FXType = 'rain' | 'spark' | 'steam' | 'timelapse' | 'confetti';

interface FXState {
  activeFX: FXType | null;
  duration: number;
  triggerFX: (type: FXType, durationMs?: number) => void;
  clearFX: () => void;
}

let fxTimer: number | null = null;

export const useFXStore = create<FXState>((set, get) => ({
  activeFX: null,
  duration: 1800,
  triggerFX: (type: FXType, durationMs = 1800) => {
    // Toggle: if same effect is already active, immediately stop it
    if (get().activeFX === type) {
      if (fxTimer) { clearTimeout(fxTimer); fxTimer = null; }
      set({ activeFX: null });
      return;
    }
    // Clear any existing timer
    if (fxTimer) { clearTimeout(fxTimer); fxTimer = null; }
    set({ activeFX: type, duration: durationMs });
    fxTimer = window.setTimeout(() => {
      set((state) => (state.activeFX === type ? { activeFX: null } : state));
      fxTimer = null;
    }, durationMs);
  },
  clearFX: () => {
    if (fxTimer) { clearTimeout(fxTimer); fxTimer = null; }
    set({ activeFX: null });
  },
}));
