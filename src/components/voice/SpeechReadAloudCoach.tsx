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
  const [spokenIndices, setSpokenIndices] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(isCompleted);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Normalize words into clean individual tokens
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
      setSpokenIndices(new Set(wordTokens.map((_, i) => i)));
    }
  }, [isCompleted, completed, wordTokens]);

  // Clean phonetic matching helper
  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/gi, '');

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
      // Stop any existing session
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
        setLiveTranscript('Listening... Speak now!');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript + ' ';
        }

        const spokenWords = transcript
          .toLowerCase()
          .split(/\s+/)
          .map(cleanWord)
          .filter((w) => w.length > 0);

        setLiveTranscript(transcript.trim());

        // Sequential & Strict Keyword Matching
        setSpokenIndices((prev) => {
          const next = new Set(prev);

          wordTokens.forEach((token, tIdx) => {
            if (!token.clean) return;

            // Strict match: spoken word is identical or exact prefix (for endings like -ed, -s, -ing)
            const isMatch = spokenWords.some((sw) => {
              if (sw === token.clean) return true;
              if (token.clean.length >= 4 && sw.startsWith(token.clean.slice(0, 4))) return true;
              if (sw.length >= 4 && token.clean.startsWith(sw.slice(0, 4))) return true;
              return false;
            });

            if (isMatch) {
              next.add(tIdx);
            }
          });

          // Check completion: At least 85% of words must be spoken
          const totalKeyWords = wordTokens.filter((w) => w.clean.length > 1).length;
          const matchedKeyWords = wordTokens.filter((w, i) => next.has(i) && w.clean.length > 1).length;

          if (matchedKeyWords >= Math.ceil(totalKeyWords * 0.85) && !completed) {
            setCompleted(true);
            setIsListening(false);
            sounds.fanfare();
            try {
              recognition.stop();
            } catch {}
            onComplete();
          }

          return next;
        });
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
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

  const handleReset = () => {
    sounds.pop();
    setCompleted(false);
    setSpokenIndices(new Set());
    setLiveTranscript('');
    stopListening();
  };

  const handlePipListen = () => {
    sounds.pop();
    voiceAssistant.speak(sentence);
  };

  return (
    <div
      className={`p-5 md:p-6 rounded-3xl border-3 transition-all flex flex-col justify-between ${
        completed
          ? 'bg-emerald-50 border-emerald-400 shadow-md ring-4 ring-emerald-200'
          : isListening
          ? 'bg-amber-50 border-amber-400 shadow-xl ring-4 ring-amber-300'
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
            <Mic className="w-3.5 h-3.5 animate-spin" />
            <span>Listening... Speak!</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold">
            Tap mic to read
          </span>
        )}
      </div>

      {/* Target Sentence with Individual Word Glow upon speech */}
      <div className="my-3 text-sm md:text-base font-extrabold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
        {wordTokens.map((w) => {
          const isSpoken = spokenIndices.has(w.index);

          return (
            <span
              key={w.index}
              className={`inline-block mr-1.5 px-1.5 py-0.5 rounded-lg transition-all duration-150 ${
                isSpoken
                  ? 'bg-emerald-400 text-slate-950 font-black scale-105 shadow-xs ring-2 ring-emerald-500'
                  : 'text-slate-700'
              }`}
            >
              {w.raw}
            </span>
          );
        })}
      </div>

      {/* Live Speech Recognition Feedback Subtitle */}
      {isListening && liveTranscript && (
        <div className="mb-3 px-3 py-1.5 bg-amber-100/80 rounded-xl text-xs font-mono text-amber-900 border border-amber-300 truncate">
          🎙️ Heard: <span className="font-bold">"{liveTranscript}"</span>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {!completed ? (
          <>
            {!isListening ? (
              <button
                onClick={startListening}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs md:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Tap Mic & Read Aloud 🎙️</span>
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs md:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>Stop Listening</span>
              </button>
            )}

            <button
              onClick={handlePipListen}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-violet-700 rounded-2xl border border-slate-200 cursor-pointer"
              title="Have Pip pronounce this sentence"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Sentence Spoken Accurately!</span>
            </span>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              title="Retry reading practice"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
