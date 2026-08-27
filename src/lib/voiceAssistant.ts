// ─── Emotive Human-like Voice Assistant Engine ───
// Expressive sentence inflection (curiosity on '?', enthusiasm on '!'), breath pauses, and top-tier neural voices
import { useAudioStore } from '@/stores/audioStore';

export type SpeakingListener = (isSpeaking: boolean) => void;
export type WordBoundaryListener = (charIndex: number, spokenText: string) => void;

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

  // Selects the most friendly, natural, and expressive human voice available
  getBestHumanVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const priorityVoices = [
      'Microsoft Ana Online (Natural)',
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

    // Fallback: English voice without legacy robotic desktop moniker
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
  }

  private notifyBoundary(charIndex: number, text: string) {
    this.boundaryListeners.forEach((cb) => cb(charIndex, text));
  }

  private clearFallbackTimer() {
    if (this.fallbackTimer !== null) {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  // Speaks with natural friendly human prosody, emotional pauses, and pitch inflection
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || this.isMuted()) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Clean emojis & format conversational breathing pauses
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

    // Dynamic Pitch & Rate contour based on emotional punctuation
    const isQuestion = cleanedText.includes('?');
    const isExcited = cleanedText.includes('!');

    if (isQuestion) {
      utterance.rate = 0.93; // Deliberate questioning cadence
      utterance.pitch = 1.14; // Rising inflection for curiosity
    } else if (isExcited) {
      utterance.rate = 0.96; // Energetic storytelling
      utterance.pitch = 1.12; // Cheerful enthusiasm
    } else {
      utterance.rate = 0.94; // Warm, friendly conversational pace
      utterance.pitch = 1.08; // Friendly, engaging tone
    }

    utterance.volume = 1.0;

    let receivedNativeBoundary = false;

    utterance.onboundary = (event) => {
      receivedNativeBoundary = true;
      this.notifyBoundary(event.charIndex, cleanedText);
    };

    utterance.onstart = () => {
      this.notifySpeaking(true);
      this.notifyBoundary(0, cleanedText);

      // Smooth fallback timer for mobile webkit browsers
      const words = cleanedText.split(/\s+/);
      let wordIdx = 0;
      let charPos = 0;
      const msPerWord = 320;

      this.clearFallbackTimer();
      this.fallbackTimer = window.setInterval(() => {
        if (!receivedNativeBoundary && wordIdx < words.length) {
          this.notifyBoundary(charPos, cleanedText);
          charPos += words[wordIdx].length + 1;
          wordIdx++;
        }
      }, msPerWord);
    };

    const cleanup = () => {
      this.clearFallbackTimer();
      this.notifySpeaking(false);
      this.notifyBoundary(-1, '');
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
      this.notifyBoundary(-1, '');
    }
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
