// ─── Emotive Human-like Voice Assistant Engine ───
// Synchronized word boundaries, custom voice & pace settings, and dynamic BGM audio ducking
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

      // Global interaction unlock listener (also starts default BGM on first interaction!)
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

  // Selects the user-selected voice or the highest quality natural human voice
  getBestHumanVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const state = useAudioStore.getState();
    if (state.selectedVoiceName) {
      const custom = this.voices.find((v) => v.name === state.selectedVoiceName);
      if (custom) return custom;
    }

    // Prioritize en-US-AnaNeural by default
    const anaMatch = this.voices.find(
      (v) =>
        v.name.includes('en-US-AnaNeural') ||
        v.name.toLowerCase().includes('ana online') ||
        v.name.toLowerCase().includes('ana neural') ||
        (v.name.toLowerCase().includes('ana') && v.lang.startsWith('en'))
    );
    if (anaMatch && !state.selectedVoiceName) {
      return anaMatch;
    }

    const priorityVoices = [
      'en-US-AnaNeural',
      'Microsoft Ana Online (Natural)',
      'Microsoft Ana Neural',
      'Ana',
      'Microsoft Jenny Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Google US English',
      'Google UK English Female',
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
    // Dynamic BGM Ducking: Lower music volume when Pip is talking
    bgmEngine.duck(speaking);
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

  // Speaks with custom speed/pitch preferences, emotional prosody, and exact word sync
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isMuted()) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Clean emojis & normalize whitespace
    const cleanedText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\.\.\./g, ', ')
      .replace(/—/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    this.currentSpokenText = cleanedText;
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voice = this.getBestHumanVoice();

    if (voice) {
      utterance.voice = voice;
    }

    const state = useAudioStore.getState();
    const baseRate = state.ttsSpeed || 0.94;
    const basePitch = state.ttsPitch || 1.08;

    const isQuestion = cleanedText.includes('?');
    const isExcited = cleanedText.includes('!');

    if (isQuestion) {
      utterance.rate = baseRate * 0.98;
      utterance.pitch = basePitch * 1.06;
    } else if (isExcited) {
      utterance.rate = baseRate * 1.02;
      utterance.pitch = basePitch * 1.04;
    } else {
      utterance.rate = baseRate;
      utterance.pitch = basePitch;
    }

    utterance.volume = 1.0;

    let receivedNativeBoundary = false;

    // Native browser word boundary event
    utterance.onboundary = (event) => {
      receivedNativeBoundary = true;
      this.notifyBoundary(event.charIndex, cleanedText);
    };

    utterance.onstart = () => {
      this.notifySpeaking(true);
      this.notifyBoundary(0, cleanedText, 0);

      // Smooth fallback timer
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
