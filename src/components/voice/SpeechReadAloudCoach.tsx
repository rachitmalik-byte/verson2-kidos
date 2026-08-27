import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, Check, CheckCircle2, RotateCcw } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface SpeechReadAloudCoachProps {
  sentence: string;
  onComplete: () => void;
  isCompleted?: boolean;
  title?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export const SpeechReadAloudCoach: React.FC<SpeechReadAloudCoachProps> = ({
  sentence,
  onComplete,
  isCompleted = false,
  title = 'Read Aloud Superpower',
  badge = 'Voice Practice',
  icon,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenWords, setSpokenWords] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(isCompleted);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Normalize words into tokens
  const words = React.useMemo(() => {
    return sentence.split(/\s+/).map((w) => ({
      raw: w,
      clean: w.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, ''),
    }));
  }, [sentence]);

  useEffect(() => {
    if (isCompleted) {
      setCompleted(true);
      setSpokenWords(new Set(words.map((_, i) => i)));
    }
  }, [isCompleted, words]);

  // Speech Recognition Initializer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }

      const spokenTokens = fullTranscript.toLowerCase().split(/\s+/);

      setSpokenWords((prev) => {
        const next = new Set(prev);
        words.forEach((w, idx) => {
          if (!w.clean) return;
          // Match if token exists in spoken transcript
          if (
            spokenTokens.some(
              (st) => st.includes(w.clean) || w.clean.includes(st) || st.slice(0, 4) === w.clean.slice(0, 4)
            )
          ) {
            next.add(idx);
          }
        });

        // Check if at least 70% of words were spoken
        const targetWordCount = words.filter((w) => w.clean.length > 2).length;
        const matchedSignificant = words.filter((w, i) => next.has(i) && w.clean.length > 2).length;

        if (matchedSignificant >= Math.ceil(targetWordCount * 0.7) && !completed) {
          setCompleted(true);
          sounds.fanfare();
          onComplete();
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {}
          }
          setIsListening(false);
        }

        return next;
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [words, onComplete, completed]);

  const toggleListening = () => {
    sounds.pop();
    if (!micSupported) {
      // Fallback: Pip speaks and auto-completes
      voiceAssistant.speak(sentence, () => {
        setCompleted(true);
        setSpokenWords(new Set(words.map((_, i) => i)));
        onComplete();
      });
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handlePipRead = () => {
    sounds.pop();
    voiceAssistant.speak(sentence, () => {
      setCompleted(true);
      setSpokenWords(new Set(words.map((_, i) => i)));
      onComplete();
    });
  };

  return (
    <div
      className={`p-5 md:p-6 rounded-3xl border-3 transition-all flex flex-col justify-between ${
        completed
          ? 'bg-emerald-50 border-emerald-400 shadow-md ring-4 ring-emerald-200'
          : isListening
          ? 'bg-amber-50 border-amber-400 shadow-xl ring-4 ring-amber-300 animate-pulse'
          : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {badge}
            </span>
            <h4
              className="text-base font-black text-slate-900"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {title}
            </h4>
          </div>
        </div>

        {completed ? (
          <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mastered! ✓</span>
          </span>
        ) : isListening ? (
          <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-black animate-pulse flex items-center gap-1 shadow-md">
            <Mic className="w-3.5 h-3.5" />
            <span>Listening... Speak!</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full text-[11px] font-bold">
            Read aloud
          </span>
        )}
      </div>

      {/* Synchronized Word Highlighting sentence */}
      <div className="my-3 text-sm md:text-base font-extrabold text-slate-800 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
        {words.map((w, idx) => {
          const isSpoken = spokenWords.has(idx);

          return (
            <span
              key={idx}
              className={`inline-block mr-1.5 px-1 py-0.5 rounded-md transition-all duration-200 ${
                isSpoken
                  ? 'bg-emerald-300 text-slate-950 font-black scale-105 shadow-xs ring-2 ring-emerald-400'
                  : 'text-slate-700'
              }`}
            >
              {w.raw}
            </span>
          );
        })}
      </div>

      {/* Action Buttons: Mic Tap & Listen Fallback */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={toggleListening}
          className={`flex-1 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs ${
            completed
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
              : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md'
          }`}
        >
          {completed ? (
            <>
              <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
              <span>Read Successfully!</span>
            </>
          ) : isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-spin" />
              <span>Stop Mic</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-slate-950" />
              <span>Tap to Speak Aloud 🎙️</span>
            </>
          )}
        </button>

        <button
          onClick={handlePipRead}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-violet-700 rounded-2xl border border-slate-200 cursor-pointer"
          title="Have Pip read this pointer aloud"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
