import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Check,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService } from '@/lib/geminiService';

interface SpeechReadAloudCoachProps {
  sentence: string;
  onComplete: () => void;
  isCompleted?: boolean;
  title?: string;
  badge?: string;
  icon?: React.ReactNode;
  stepNumber?: number;
  totalSteps?: number;
}

export const SpeechReadAloudCoach: React.FC<SpeechReadAloudCoachProps> = ({
  sentence,
  onComplete,
  isCompleted = false,
  title = 'Read Aloud Superpower',
  badge = 'Voice Practice',
  icon,
  stepNumber = 1,
  totalSteps = 4,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [completed, setCompleted] = useState(isCompleted);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [misspokenIndices, setMisspokenIndices] = useState<Set<number>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Split sentence into structured word tokens
  const wordTokens = React.useMemo(() => {
    return sentence.split(/\s+/).map((w, idx) => ({
      index: idx,
      raw: w,
      clean: w.toLowerCase().replace(/[^a-z0-9]/gi, ''),
    }));
  }, [sentence]);

  // Sync external completed state
  useEffect(() => {
    if (isCompleted && !completed) {
      setCompleted(true);
      setCurrentWordIndex(wordTokens.length);
    }
  }, [isCompleted, completed, wordTokens.length]);

  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/gi, '');

  const handleListenToPip = () => {
    sounds.sparkle();
    voiceAssistant.speak(sentence);
  };

  const handleReset = () => {
    sounds.pop();
    setLiveTranscript('');
    setCurrentWordIndex(0);
    setMisspokenIndices(new Set());
    setFeedbackMessage(null);
    setCompleted(false);
  };

  const startListening = () => {
    sounds.pop();
    if (typeof window === 'undefined') return;

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        setFeedbackMessage(null);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }

        const spokenStream = fullTranscript.trim();
        setLiveTranscript(spokenStream);

        const spokenWords = spokenStream
          .toLowerCase()
          .split(/\s+/)
          .map(cleanWord)
          .filter((w) => w.length > 0);

        // Real-Time Word-by-Word Sequential Matcher
        let targetPointer = 0;
        const newMisspoken = new Set<number>();

        for (let sIdx = 0; sIdx < spokenWords.length && targetPointer < wordTokens.length; sIdx++) {
          const spoken = spokenWords[sIdx];
          const target = wordTokens[targetPointer].clean;

          // Exact match or strict phonetic prefix/suffix match
          const isExact = spoken === target;
          const isFuzzy =
            target.length >= 4 &&
            (spoken.startsWith(target.slice(0, target.length - 1)) ||
              target.startsWith(spoken.slice(0, spoken.length - 1)));

          if (isExact || isFuzzy) {
            targetPointer++;
          } else {
            // If the user said a clearly different word (like "hit" for "heat")
            if (spoken.length >= 2 && target.length >= 2 && sIdx >= targetPointer) {
              newMisspoken.add(targetPointer);
            }
          }
        }

        setCurrentWordIndex(targetPointer);
        setMisspokenIndices(newMisspoken);

        // Strict Completion: Must reach the VERY LAST word in the sentence
        if (targetPointer >= wordTokens.length && !completed) {
          setCompleted(true);
          setIsListening(false);
          sounds.fanfare();
          try {
            recognition.stop();
          } catch {}

          const praise = `Brilliant reading! You pronounced all ${wordTokens.length} words in order perfectly!`;
          setFeedbackMessage(praise);
          voiceAssistant.speak(praise);
          onComplete();
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);

        // If stopped before reaching the end of the sentence
        setCurrentWordIndex((idx) => {
          if (idx < wordTokens.length && !completed) {
            const missingCount = wordTokens.length - idx;
            const msg = `You read ${idx} of ${wordTokens.length} words! Keep going to the very last word "${wordTokens[wordTokens.length - 1].raw}"!`;
            setFeedbackMessage(msg);
            sounds.boing();
            voiceAssistant.speak(msg);
          }
          return idx;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    sounds.pop();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  return (
    <div
      className={`w-full p-5 sm:p-6 rounded-3xl border-3 transition-all ${
        completed
          ? 'bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-200'
          : isListening
          ? 'bg-amber-50/90 border-amber-400 shadow-xl ring-4 ring-amber-200'
          : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">
            {icon || '🎙️'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                Sentence {stepNumber} of {totalSteps}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 mt-0.5">{title}</h4>
          </div>
        </div>

        {/* Status Badge & Audio Listen Button */}
        <div className="flex items-center gap-2">
          {completed ? (
            <span className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-500 text-white rounded-full font-black text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sentence Mastered 100% ✓</span>
            </span>
          ) : (
            <button
              onClick={handleListenToPip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-800 font-black text-xs cursor-pointer transition-colors"
              title="Listen to Pip read this sentence"
            >
              <Volume2 className="w-3.5 h-3.5 text-violet-600" />
              <span>Hear Pip Read</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Real-Time Word-by-Word Karaoke Sentence Display ── */}
      <div className="p-5 rounded-2xl bg-slate-950 text-white text-base sm:text-lg font-black leading-loose mb-4 shadow-inner flex flex-wrap items-center gap-2">
        {wordTokens.map((token) => {
          const isSpoken = token.index < currentWordIndex;
          const isCurrent = token.index === currentWordIndex && isListening;
          const isMisspoken = misspokenIndices.has(token.index) && !isSpoken;

          if (isSpoken) {
            return (
              <span
                key={token.index}
                className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white shadow-sm flex items-center gap-1 animate-scaleIn"
              >
                <span>{token.raw}</span>
                <Check className="w-3.5 h-3.5 stroke-[3] inline text-emerald-100" />
              </span>
            );
          }

          if (isCurrent) {
            return (
              <span
                key={token.index}
                className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 shadow-md ring-4 ring-amber-300 animate-pulse font-black scale-105"
              >
                👉 {token.raw}
              </span>
            );
          }

          if (isMisspoken) {
            return (
              <span
                key={token.index}
                className="px-2.5 py-1 rounded-xl bg-rose-500/30 text-rose-300 border border-rose-400 underline decoration-wavy"
                title="Mispronounced or skipped word"
              >
                {token.raw}
              </span>
            );
          }

          return (
            <span key={token.index} className="px-1 py-0.5 text-slate-400 font-bold opacity-80">
              {token.raw}
            </span>
          );
        })}
      </div>

      {/* Real-Time Live Microphone Transcript */}
      {isListening && (
        <div className="p-3 bg-amber-100/90 border-2 border-amber-300 rounded-2xl mb-4 text-xs font-bold text-amber-950 flex items-center justify-between gap-3 shadow-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />
            <span>
              <strong>Speaking Live:</strong> "{liveTranscript || 'Reading aloud now...'}"
            </span>
          </div>
          <span className="text-[10px] font-black uppercase text-amber-800">
            Word {currentWordIndex} of {wordTokens.length}
          </span>
        </div>
      )}

      {/* Pip Feedback / Incomplete Guidance Box */}
      {feedbackMessage && !isListening && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl border mb-4 text-xs font-bold flex items-start gap-2.5 shadow-sm ${
            completed
              ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
              : 'bg-amber-100/90 border-amber-300 text-amber-950'
          }`}
        >
          <span className="text-xl shrink-0">{completed ? '🎉' : '🤖'}</span>
          <div>
            <span className="text-[10px] font-black uppercase block mb-0.5">
              {completed ? 'Reading Mastered!' : 'Pip Speech Guide:'}
            </span>
            <span>{feedbackMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex items-center gap-2.5">
        {!isListening ? (
          <button
            onClick={startListening}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
              completed
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950'
            }`}
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>
              {completed
                ? '🔄 Practice Speaking Again'
                : currentWordIndex > 0
                ? '🎙️ Continue Reading Aloud'
                : '🎙️ Tap & Read Aloud into Mic'}
            </span>
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 animate-pulse"
          >
            <MicOff className="w-4 h-4" />
            <span>Done Reading (Stop Mic) 🛑</span>
          </button>
        )}

        {(currentWordIndex > 0 || completed) && !isListening && (
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Reset this sentence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
