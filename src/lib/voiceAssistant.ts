// ─── Emotive Human-like Voice Assistant Engine ───
// High quality Neural & Natural human voice selection
// Conversational pacing, breathing pauses, global audio unlocking, and mute control
import { useAudioStore } from '@/stores/audioStore';

type SpeakingListener = (isSpeaking: boolean) => void;

class VoiceAssistantEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked = false;
  private listeners: Set<SpeakingListener> = new Set();

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
          } catch {}
          window.removeEventListener('click', unlock);
          window.removeEventListener('touchstart', unlock);
          window.removeEventListener('keydown', unlock);
        }
      };

      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
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

  getBestHumanVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const priorityNames = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Ana Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Jenny',
      'Aria',
      'Natural',
      'Neural',
      'Google US English',
      'Google UK English Female',
      'Samantha (Enhanced)',
      'Samantha',
      'Victoria',
      'Zira',
    ];

    for (const name of priorityNames) {
      const match = this.voices.find(
        (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    return this.voices.find((v) => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  getAllVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.initVoices();
    }
    return this.voices;
  }

  addListener(cb: SpeakingListener) {
    this.listeners.add(cb);
  }

  removeListener(cb: SpeakingListener) {
    this.listeners.delete(cb);
  }

  private notify(speaking: boolean) {
    this.listeners.forEach((cb) => cb(speaking));
  }

  // Speaks with natural human prosody, breath pauses, and cadence
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isMuted()) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const cleanedText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\.\.\./g, ', ')
      .trim();

    if (!cleanedText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voice = this.getBestHumanVoice();

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.92; // Natural conversational cadence
    utterance.pitch = 1.06; // Warm and friendly for children
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false);
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.notify(false);
    }
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
