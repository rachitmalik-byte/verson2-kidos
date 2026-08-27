import { create } from 'zustand';
import type { PipState, PipMood, MascotEvent } from '@/types';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface PipStoreState {
  state: PipState;
  previousState: PipState;
  isSpeaking: boolean;
  isListening: boolean;
  isHighFiveReady: boolean;
  targetSelector: string | null;
  currentMessage: string;
  hintLevel: number;
  isVisible: boolean;
  rapidClickCount: number;
  lastClickTime: number;

  // Actions
  setState: (state: PipState, autoResetDelayMs?: number) => void;
  setMood: (mood: PipMood) => void; // backwards-compatible
  triggerEvent: (event: MascotEvent, payload?: any) => void;
  speak: (message: string, state?: PipState) => void;
  stopSpeaking: () => void;
  startListening: () => void;
  stopListening: () => void;
  promptHighFive: () => void;
  completeHighFive: () => void;
  handleMascotClick: () => string;
  setTargetSelector: (selector: string | null) => void;
  incrementHint: () => void;
  resetHints: () => void;
  setVisible: (visible: boolean) => void;
}

const SHORT_GREETINGS = [
  "Hey there, partner! 🔬",
  "Ready to explore! ✨",
  "I'm right beside you! ✋",
  "Let's test some science! 🧪",
  "You're doing awesome! ⭐",
  "What should we inspect next? 🔍",
];

export const usePipStore = create<PipStoreState>()((set, get) => {
  let resetTimer: number | null = null;

  const scheduleResetToIdle = (delayMs: number = 2200) => {
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      set({ state: 'idle', isHighFiveReady: false });
    }, delayMs);
  };

  return {
    state: 'idle',
    previousState: 'idle',
    isSpeaking: false,
    isListening: false,
    isHighFiveReady: false,
    targetSelector: null,
    currentMessage: '',
    hintLevel: 0,
    isVisible: true,
    rapidClickCount: 0,
    lastClickTime: 0,

    setState: (newState, autoResetDelayMs) => {
      const prev = get().state;
      set({ state: newState, previousState: prev });
      if (autoResetDelayMs) {
        scheduleResetToIdle(autoResetDelayMs);
      }
    },

    setMood: (mood) => {
      // Map legacy moods to PipState
      let mapped: PipState = 'idle';
      if (mood === 'explaining' || mood === 'hinting') mapped = 'teaching';
      else if (mood === 'concerned') mapped = 'try_again';
      else if (mood === 'encouraging') mapped = 'correct';
      else mapped = mood as PipState;

      get().setState(mapped);
    },

    triggerEvent: (event, payload) => {
      const { setState, promptHighFive, completeHighFive } = get();

      switch (event) {
        case 'LESSON_STARTED':
          setState('curious', 2400);
          break;
        case 'QUESTION_SHOWN':
          setState('teaching', 3000);
          break;
        case 'ANSWER_SELECTED':
          setState('thinking', 1400);
          break;
        case 'ANSWER_CORRECT':
          sounds.success();
          setState('correct', 2200);
          break;
        case 'ANSWER_INCORRECT':
          sounds.boing();
          setState('try_again', 2600);
          break;
        case 'LISTENING_STARTED':
          set({ isListening: true, state: 'listening' });
          break;
        case 'CHILD_STARTED_SPEAKING':
          set({ state: 'listening' });
          break;
        case 'CHILD_FINISHED_SPEAKING':
          set({ isListening: false, state: 'thinking' });
          scheduleResetToIdle(1500);
          break;
        case 'MISSION_COMPLETED':
        case 'CHAPTER_COMPLETED':
          sounds.fanfare();
          setState('celebrating', 4000);
          break;
        case 'HIGH_FIVE_PROMPT':
          promptHighFive();
          break;
        case 'HIGH_FIVE_COMPLETED':
          completeHighFive();
          break;
        case 'MASCOT_CLICKED':
          get().handleMascotClick();
          break;
        default:
          break;
      }
    },

    speak: (message, stateOverride = 'speaking') => {
      set({
        currentMessage: message,
        isSpeaking: true,
        state: stateOverride,
      });
      voiceAssistant.speak(message);
    },

    stopSpeaking: () => {
      set({ isSpeaking: false, currentMessage: '', state: 'idle' });
      voiceAssistant.stop();
    },

    startListening: () => {
      set({ isListening: true, state: 'listening' });
    },

    stopListening: () => {
      set({ isListening: false, state: 'idle' });
    },

    promptHighFive: () => {
      sounds.sparkle();
      set({ state: 'high_five', isHighFiveReady: true });
      voiceAssistant.speak("High five, scientist! Tap my hand! ✋");
    },

    completeHighFive: () => {
      sounds.fanfare();
      set({ state: 'celebrating', isHighFiveReady: false });
      scheduleResetToIdle(2500);
    },

    handleMascotClick: () => {
      const now = Date.now();
      const { lastClickTime, rapidClickCount, setState } = get();

      if (now - lastClickTime < 600) {
        const count = rapidClickCount + 1;
        set({ rapidClickCount: count, lastClickTime: now });

        if (count >= 4) {
          sounds.sparkle();
          setState('celebrating', 1800);
          const dizzyPhrase = "Hehe, tickles! Okay okay! 😄";
          voiceAssistant.speak(dizzyPhrase);
          set({ rapidClickCount: 0 });
          return dizzyPhrase;
        }
      } else {
        set({ rapidClickCount: 1, lastClickTime: now });
      }

      sounds.pop();
      setState('curious', 1800);
      const phrase = SHORT_GREETINGS[Math.floor(Math.random() * SHORT_GREETINGS.length)];
      if (Math.random() > 0.4) {
        voiceAssistant.speak(phrase);
      }
      return phrase;
    },

    setTargetSelector: (selector) => set({ targetSelector: selector }),
    incrementHint: () => set((state) => ({ hintLevel: Math.min(state.hintLevel + 1, 4), state: 'teaching' })),
    resetHints: () => set({ hintLevel: 0 }),
    setVisible: (visible) => set({ isVisible: visible }),
  };
});
