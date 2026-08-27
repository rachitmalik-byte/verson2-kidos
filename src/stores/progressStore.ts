import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedMissions: string[];
  currentMission: string;
  currentStep: number;
  missionStepProgress: Record<string, number>;
  
  // Gamification & Currency
  credits: number;
  equippedOutfit: string;
  equippedHeadwear: string;
  unlockedOutfits: string[];
  unlockedHeadwear: string[];
  hasSeenTutorial: boolean;
  
  // "Try It With Me" Spotlight Engine State
  isTryWithMeActive: boolean;
  tryWithMeStep: number;
  
  completeMission: (missionId: string) => void;
  setCurrentMission: (missionId: string) => void;
  setCurrentStep: (step: number) => void;
  advanceStep: (missionId: string) => void;
  resetProgress: () => void;
  
  // Credits & Store actions
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  unlockItem: (type: 'outfit' | 'headwear', id: string, cost: number) => boolean;
  equipOutfit: (id: string) => void;
  equipHeadwear: (id: string) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  
  // "Try It With Me" actions
  startTryWithMe: () => void;
  setTryWithMeStep: (step: number) => void;
  endTryWithMe: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedMissions: [],
      currentMission: 'mission-01',
      currentStep: 0,
      missionStepProgress: {},
      
      credits: 60,
      equippedOutfit: 'lab-coat',
      equippedHeadwear: 'goggles',
      unlockedOutfits: ['lab-coat'],
      unlockedHeadwear: ['goggles'],
      hasSeenTutorial: false,
      isTryWithMeActive: false,
      tryWithMeStep: 0,

      completeMission: (missionId: string) => {
        const { completedMissions, credits } = get();
        if (!completedMissions.includes(missionId)) {
          set({
            completedMissions: [...completedMissions, missionId],
            credits: credits + 30,
          });
        }
      },

      setCurrentMission: (missionId: string) => {
        set({ currentMission: missionId, currentStep: 0 });
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      advanceStep: (missionId: string) => {
        const { currentStep, missionStepProgress } = get();
        const newStep = currentStep + 1;
        set({
          currentStep: newStep,
          missionStepProgress: {
            ...missionStepProgress,
            [missionId]: Math.max(missionStepProgress[missionId] || 0, newStep),
          },
        });
      },

      addCredits: (amount: number) => {
        set((state) => ({ credits: state.credits + amount }));
      },

      spendCredits: (amount: number) => {
        const { credits } = get();
        if (credits >= amount) {
          set({ credits: credits - amount });
          return true;
        }
        return false;
      },

      unlockItem: (type: 'outfit' | 'headwear', id: string, cost: number) => {
        const { credits, unlockedOutfits, unlockedHeadwear } = get();
        if (credits >= cost) {
          if (type === 'outfit' && !unlockedOutfits.includes(id)) {
            set({
              credits: credits - cost,
              unlockedOutfits: [...unlockedOutfits, id],
              equippedOutfit: id,
            });
            return true;
          } else if (type === 'headwear' && !unlockedHeadwear.includes(id)) {
            set({
              credits: credits - cost,
              unlockedHeadwear: [...unlockedHeadwear, id],
              equippedHeadwear: id,
            });
            return true;
          }
        }
        return false;
      },

      equipOutfit: (id: string) => {
        set({ equippedOutfit: id });
      },

      equipHeadwear: (id: string) => {
        set({ equippedHeadwear: id });
      },

      setHasSeenTutorial: (seen: boolean) => {
        set({ hasSeenTutorial: seen });
      },

      startTryWithMe: () => {
        set({ isTryWithMeActive: true, tryWithMeStep: 0 });
      },

      setTryWithMeStep: (step: number) => {
        set({ tryWithMeStep: step });
      },

      endTryWithMe: () => {
        set({ isTryWithMeActive: false, tryWithMeStep: 0, hasSeenTutorial: true });
      },

      resetProgress: () => {
        set({
          completedMissions: [],
          currentMission: 'mission-01',
          currentStep: 0,
          missionStepProgress: {},
          credits: 60,
          equippedOutfit: 'lab-coat',
          equippedHeadwear: 'goggles',
          unlockedOutfits: ['lab-coat'],
          unlockedHeadwear: ['goggles'],
          hasSeenTutorial: false,
          isTryWithMeActive: false,
          tryWithMeStep: 0,
        });
      },
    }),
    { name: 'polyquest-progress' }
  )
);
