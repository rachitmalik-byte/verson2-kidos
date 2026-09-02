import { create } from 'zustand';
import { sounds } from '@/lib/sounds';

interface EasterEggStore {
  clickCount: number;
  lastClickTime: number;
  isRickrollOpen: boolean;
  registerPipClick: () => void;
  closeRickroll: () => void;
}

export const useEasterEggStore = create<EasterEggStore>((set, get) => ({
  clickCount: 0,
  lastClickTime: 0,
  isRickrollOpen: false,

  registerPipClick: () => {
    const now = Date.now();
    const { clickCount, lastClickTime } = get();

    // Reset if more than 3 seconds elapsed between clicks
    const newCount = now - lastClickTime < 3000 ? clickCount + 1 : 1;

    if (newCount >= 7) {
      sounds.fanfare();
      set({ clickCount: 0, lastClickTime: now, isRickrollOpen: true });
    } else {
      set({ clickCount: newCount, lastClickTime: now });
    }
  },

  closeRickroll: () => set({ isRickrollOpen: false, clickCount: 0 }),
}));
