import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { bgmEngine, BGM_TRACKS } from '@/lib/bgmEngine';

interface AudioState {
  isSfxMuted: boolean;
  isTtsMuted: boolean;
  isBgmMuted: boolean;
  bgmVolume: number; // 0.0 to 1.0
  currentBgmTrack: string;
  ttsSpeed: number; // 0.75 to 1.3
  ttsPitch: number; // 0.8 to 1.3
  selectedVoiceName: string;

  toggleSfx: () => boolean;
  toggleTts: () => boolean;
  toggleBgm: () => boolean;
  setSfxMuted: (muted: boolean) => void;
  setTtsMuted: (muted: boolean) => void;
  setBgmMuted: (muted: boolean) => void;
  setBgmVolume: (vol: number) => void;
  setBgmTrack: (trackId: string) => void;
  setTtsSpeed: (speed: number) => void;
  setTtsPitch: (pitch: number) => void;
  setSelectedVoiceName: (voiceName: string) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isSfxMuted: false,
      isTtsMuted: false,
      isBgmMuted: false,
      bgmVolume: 0.70,
      currentBgmTrack: 'playful-lab',
      ttsSpeed: 0.94,
      ttsPitch: 1.08,
      selectedVoiceName: '',

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

      toggleBgm: () => {
        const next = !get().isBgmMuted;
        set({ isBgmMuted: next });
        bgmEngine.setMuted(next);
        if (!next && !bgmEngine.getIsPlaying()) {
          bgmEngine.start(get().currentBgmTrack);
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

      setBgmMuted: (isBgmMuted) => {
        set({ isBgmMuted });
        bgmEngine.setMuted(isBgmMuted);
      },

      setBgmVolume: (bgmVolume) => {
        set({ bgmVolume });
        bgmEngine.setVolume(bgmVolume);
      },

      setBgmTrack: (currentBgmTrack) => {
        set({ currentBgmTrack });
        bgmEngine.setTrack(currentBgmTrack);
      },

      setTtsSpeed: (ttsSpeed) => {
        set({ ttsSpeed });
      },

      setTtsPitch: (ttsPitch) => {
        set({ ttsPitch });
      },

      setSelectedVoiceName: (selectedVoiceName) => {
        set({ selectedVoiceName });
      },
    }),
    { name: 'polyquest-audio-settings-v2' }
  )
);
