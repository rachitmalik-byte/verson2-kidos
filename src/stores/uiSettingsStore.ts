import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiSettingsState {
  showWardrobeButton: boolean;
  showArcadeButton: boolean;
  showAiLabButton: boolean;
  pipMode: 'inline' | 'floating' | 'hidden';
  showPipText: boolean;
  playPipSpeech: boolean;
  isLivePipOpen: boolean;
  
  toggleWardrobeButton: () => void;
  toggleArcadeButton: () => void;
  toggleAiLabButton: () => void;
  setPipMode: (mode: 'inline' | 'floating' | 'hidden') => void;
  togglePipText: () => void;
  togglePipSpeech: () => void;
  setIsLivePipOpen: (open: boolean) => void;
  toggleLivePip: () => void;
}

export const useUiSettingsStore = create<UiSettingsState>()(
  persist(
    (set) => ({
      showWardrobeButton: true,
      showArcadeButton: true,
      showAiLabButton: true,
      pipMode: 'floating', // Defaulting to floating on the left side
      showPipText: true,
      playPipSpeech: true,
      isLivePipOpen: false,

      toggleWardrobeButton: () => set((state) => ({ showWardrobeButton: !state.showWardrobeButton })),
      toggleArcadeButton: () => set((state) => ({ showArcadeButton: !state.showArcadeButton })),
      toggleAiLabButton: () => set((state) => ({ showAiLabButton: !state.showAiLabButton })),
      setPipMode: (mode) => set({ pipMode: mode }),
      togglePipText: () => set((state) => ({ showPipText: !state.showPipText })),
      togglePipSpeech: () => set((state) => ({ playPipSpeech: !state.playPipSpeech })),
      setIsLivePipOpen: (open) => set({ isLivePipOpen: open }),
      toggleLivePip: () => set((state) => ({ isLivePipOpen: !state.isLivePipOpen })),
    }),
    { 
      name: 'polyquest-ui-settings',
      partialize: (state) => ({
        showWardrobeButton: state.showWardrobeButton,
        showArcadeButton: state.showArcadeButton,
        showAiLabButton: state.showAiLabButton,
        pipMode: state.pipMode,
        showPipText: state.showPipText,
        playPipSpeech: state.playPipSpeech,
      }),
    }
  )
);
