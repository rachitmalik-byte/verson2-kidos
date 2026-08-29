// ─── Emotive Human-like Voice Assistant Engine ───
// Synchronized word boundaries, natural neural voice selection, and dynamic BGM audio ducking
import { useAudioStore } from '@/stores/audioStore';
import { bgmEngine } from '@/lib/bgmEngine';

export type SpeakingListener = (isSpeaking: boolean) => void;
export type WordBoundaryListener = (charIndex: number, spokenText: string, wordIndex?: number) => void;

class VoiceAssistantEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked = false;
  private listeners: Set<SpeakingListener> = new Set();
  private boundaryListeners: Set<WordBoundaryListener> = new Set();
  private fallbackTimer: number | null = null;
  private currentSpokenText = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };

      // Global interaction unlock listener
      const unlock = () => {
        if (!this.isUnlocked) {
          this.isUnlocked = true;
          try {
            window.speechSynthesis.resume();
            const state = useAudioStore.getState();
            if (!state.isBgmMuted && !bgmEngine.getIsPlaying()) {
              bgmEngine.start(state.currentBgmTrack);
            }
          } catch {}
          window.removeEventListener('click', unlock);
          window.removeEventListener('touchstart', unlock);
          window.removeEventListener('keydown', unlock);
        }
      };

      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        }
      });
    }
  }

  private isMuted(): boolean {
    try {
      return useAudioStore.getState().isTtsMuted;
    } catch {
      return false;
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  getAllVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.initVoices();
    }
    return this.voices.filter((v) => v.lang.startsWith('en'));
  }

  /**
   * Selects the highest quality natural human neural voice available on the device
   */
  getBestHumanVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const state = useAudioStore.getState();
    if (state.selectedVoiceName) {
      const custom = this.voices.find((v) => v.name === state.selectedVoiceName);
      if (custom) return custom;
    }

    // High Priority Natural Neural Voices (Edge, Chrome, Safari, Android)
    const priorityVoices = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Ana Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      'en-US-Neural2-F',
      'en-US-Journey-F',
      'en-US-Wavenet-C',
      'Samantha (Enhanced)',
      'Samantha',
      'Karen (Enhanced)',
      'Karen',
      'Victoria',
      'Jenny',
      'Aria',
      'Natural',
      'Neural',
    ];

    for (const name of priorityVoices) {
      const match = this.voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          v.name.toLowerCase().includes(name.toLowerCase()) &&
          !v.name.toLowerCase().includes('desktop')
      );
      if (match) return match;
    }

    // Filter out robotic legacy desktop synth voices if possible
    const nonRobotic = this.voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        !v.name.toLowerCase().includes('david desktop') &&
        !v.name.toLowerCase().includes('mark desktop') &&
        !v.name.toLowerCase().includes('hazel desktop') &&
        !v.name.toLowerCase().includes('zira desktop')
    );
    if (nonRobotic) return nonRobotic;

    return this.voices.find((v) => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  addListener(cb: SpeakingListener) {
    this.listeners.add(cb);
  }

  removeListener(cb: SpeakingListener) {
    this.listeners.delete(cb);
  }

  addBoundaryListener(cb: WordBoundaryListener) {
    this.boundaryListeners.add(cb);
  }

  removeBoundaryListener(cb: WordBoundaryListener) {
    this.boundaryListeners.delete(cb);
  }

  private notifySpeaking(speaking: boolean) {
    this.listeners.forEach((cb) => cb(speaking));
    if (speaking) {
      bgmEngine.duck();
    } else {
      bgmEngine.unduck();
    }
  }

  private notifyBoundary(charIndex: number, text: string, wordIndex?: number) {
    this.boundaryListeners.forEach((cb) => cb(charIndex, text, wordIndex));
  }

  private clearFallbackTimer() {
    if (this.fallbackTimer !== null) {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  /**
   * Speaks with natural human prosody, clean punctuation pauses, and word synchronization
   */
  speak(text: string, onEnd?: () => void) {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isMuted()) {
      if (onEnd) onEnd();
      return;
    }

    // Clean markdown, symbols, acronyms, and emojis for natural human speech
    const cleanedText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/[`_~]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\bPVC\b/g, 'P V C')
      .replace(/\bPET\b/g, 'P E T')
      .replace(/\bCO2\b/g, 'C O 2')
      .replace(/\.\.\./g, ', ')
      .replace(/—/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    // Small delay to ensure previous speech cancellation clears the audio hardware buffer
    setTimeout(() => {
      this.currentSpokenText = cleanedText;
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const voice = this.getBestHumanVoice();

      if (voice) {
        utterance.voice = voice;
      }

      const state = useAudioStore.getState();
      const baseRate = state.ttsSpeed || 0.96;
      const basePitch = state.ttsPitch || 1.0;

      utterance.rate = baseRate;
      utterance.pitch = basePitch;
      utterance.volume = 1.0;

      let receivedNativeBoundary = false;

      utterance.onboundary = (event) => {
        receivedNativeBoundary = true;
        this.notifyBoundary(event.charIndex, cleanedText);
      };

      utterance.onstart = () => {
        this.notifySpeaking(true);
        this.notifyBoundary(0, cleanedText, 0);

        const words = cleanedText.split(/\s+/);
        let wordIdx = 0;
        let charPos = 0;
        const msPerWord = Math.max(180, Math.round(300 / baseRate));

        this.clearFallbackTimer();
        this.fallbackTimer = window.setInterval(() => {
          if (!receivedNativeBoundary && wordIdx < words.length) {
            this.notifyBoundary(charPos, cleanedText, wordIdx);
            charPos += words[wordIdx].length + 1;
            wordIdx++;
          }
        }, msPerWord);
      };

      const cleanup = () => {
        this.clearFallbackTimer();
        this.notifySpeaking(false);
        this.notifyBoundary(-1, '', -1);
        if (onEnd) onEnd();
      };

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch {
        cleanup();
      }
    }, 40);
  }

  stop() {
    this.clearFallbackTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.notifySpeaking(false);
      this.notifyBoundary(-1, '', -1);
    }
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
