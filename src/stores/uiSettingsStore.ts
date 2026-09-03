import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiSettingsState {
  showWardrobeButton: boolean;
  showArcadeButton: boolean;
  showAiLabButton: boolean;
  toggleWardrobeButton: () => void;
  toggleArcadeButton: () => void;
  toggleAiLabButton: () => void;
}

export const useUiSettingsStore = create<UiSettingsState>()(
  persist(
    (set) => ({
      showWardrobeButton: true,
      showArcadeButton: true,
      showAiLabButton: true,
      toggleWardrobeButton: () => set((state) => ({ showWardrobeButton: !state.showWardrobeButton })),
      toggleArcadeButton: () => set((state) => ({ showArcadeButton: !state.showArcadeButton })),
      toggleAiLabButton: () => set((state) => ({ showAiLabButton: !state.showAiLabButton })),
    }),
    { name: 'polyquest-ui-settings' }
  )
);
