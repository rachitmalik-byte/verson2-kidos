import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReadingLevel = 'junior' | 'senior'; // junior: Grades 4-5 (Ages 8-10), senior: Grades 6-8 (Ages 11-14)

interface ReadingLevelState {
  readingLevel: ReadingLevel;
  autoNarrate: boolean;
  setReadingLevel: (level: ReadingLevel) => void;
  toggleAutoNarrate: () => void;
}

export const useReadingLevelStore = create<ReadingLevelState>()(
  persist(
    (set) => ({
      readingLevel: 'junior',
      autoNarrate: true,
      setReadingLevel: (level) => set({ readingLevel: level, autoNarrate: level === 'junior' }),
      toggleAutoNarrate: () => set((state) => ({ autoNarrate: !state.autoNarrate })),
    }),
    { name: 'polyquest-reading-level' }
  )
);
