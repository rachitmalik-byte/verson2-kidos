import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeOfDay = 'day' | 'night' | 'sunset' | 'rain';

interface EnvironmentState {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (mode: TimeOfDay) => void;
  toggleDayNight: () => void;
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set, get) => ({
      timeOfDay: 'day',
      setTimeOfDay: (mode: TimeOfDay) => set({ timeOfDay: mode }),
      toggleDayNight: () => {
        const current = get().timeOfDay;
        const next = current === 'day' ? 'night' : 'day';
        set({ timeOfDay: next });
      },
    }),
    {
      name: 'polyquest-environment-store',
    }
  )
);
