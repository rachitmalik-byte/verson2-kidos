import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface AudioState {
  isSfxMuted: boolean;
  isTtsMuted: boolean;
  
  toggleSfx: () => boolean;
  toggleTts: () => boolean;
  setSfxMuted: (muted: boolean) => void;
  setTtsMuted: (muted: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isSfxMuted: false,
      isTtsMuted: false,

      toggleSfx: () => {
        const next = !get().isSfxMuted;
        set({ isSfxMuted: next });
        return next;
      },

      toggleTts: () => {
        const next = !get().isTtsMuted;
        set({ isTtsMuted: next });
        if (next) {
          voiceAssistant.stop();
        }
        return next;
      },

      setSfxMuted: (isSfxMuted) => set({ isSfxMuted }),
      setTtsMuted: (isTtsMuted) => {
        set({ isTtsMuted });
        if (isTtsMuted) {
          voiceAssistant.stop();
        }
      },
    }),
    { name: 'polyquest-audio-settings' }
  )
);
