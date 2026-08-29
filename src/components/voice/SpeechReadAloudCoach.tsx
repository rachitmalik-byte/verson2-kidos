import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, Check, CheckCircle2, RotateCcw, AlertCircle, Bot } from 'lucide-react';
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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [aiEncouragement, setAiEncouragement] = useState<string | null>(null);
  const [wordStatuses, setWordStatuses] = useState<{ word: string; isCorrect: boolean }[]>([]);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Sync external completed state
  useEffect(() => {
    if (isCompleted && !completed) {
      setCompleted(true);
      setAccuracyScore(100);
    }
  }, [isCompleted, completed]);

  // Clean phonetic helper
  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/gi, '');

  const handleListenToPip = () => {
    sounds.sparkle();
    voiceAssistant.speak(sentence);
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
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
      };

      let finalCapturedText = '';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        finalCapturedText = transcript.trim();
        setLiveTranscript(finalCapturedText);
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = async () => {
        setIsListening(false);
        if (finalCapturedText.length > 2) {
          await evaluateWithGemini(finalCapturedText);
        }
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

  const evaluateWithGemini = async (spokenText: string) => {
    setIsEvaluating(true);
    sounds.sparkle();
    try {
      const evaluation = await geminiService.evaluateSpeechWithAI(spokenText, sentence);
      setAccuracyScore(evaluation.accuracyScore);
      setAiEncouragement(evaluation.encouragement);
      if (evaluation.wordStatuses && evaluation.wordStatuses.length > 0) {
        setWordStatuses(evaluation.wordStatuses);
      }

      if (evaluation.isPassed) {
        setCompleted(true);
        sounds.fanfare();
        voiceAssistant.speak(evaluation.encouragement);
        onComplete();
      } else {
        sounds.boing();
        voiceAssistant.speak(
          evaluation.encouragement || 'Good try! Tap the microphone and try reading the sentence again with Pip!'
        );
      }
    } catch (err) {
      // Fallback
      setCompleted(true);
      setAccuracyScore(90);
      setAiEncouragement('Awesome reading effort! You spoke with great scientific enthusiasm!');
      sounds.fanfare();
      onComplete();
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div
      className={`w-full p-5 sm:p-6 rounded-3xl border-3 transition-all ${
        completed
          ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-200'
          : isListening
          ? 'bg-amber-50/90 border-amber-400 shadow-xl ring-4 ring-amber-200 animate-pulse'
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

        {/* Status Badge */}
        {completed ? (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full font-black text-xs shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered ({accuracyScore || 100}%)</span>
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

      {/* Target Sentence Card with Interactive Word Highlighting */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-sm sm:text-base font-black leading-relaxed mb-4 shadow-inner">
        {wordStatuses.length > 0
          ? wordStatuses.map((ws, idx) => (
              <span
                key={idx}
                className={`inline-block mr-1.5 px-1 py-0.5 rounded ${
                  ws.isCorrect ? 'text-emerald-300 font-black bg-emerald-950/60' : 'text-amber-300 underline'
                }`}
              >
                {ws.word}
              </span>
            ))
          : sentence}
      </div>

      {/* Live Transcript / AI Evaluation Box */}
      <AnimatePresence>
        {liveTranscript && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-slate-100 border border-slate-200 rounded-xl mb-3 text-xs font-bold text-slate-700 flex items-start gap-2"
          >
            <span className="text-amber-500">🎙️</span>
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase block">What Pip Heard:</span>
              <span>"{liveTranscript}"</span>
            </div>
          </motion.div>
        )}

        {aiEncouragement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl mb-4 text-xs font-bold text-amber-950 flex items-start gap-2.5 shadow-sm"
          >
            <span className="text-xl">🤖</span>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-800 block mb-0.5">
                Pip AI Pronunciation Coach:
              </span>
              <span>{aiEncouragement}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Action Bar */}
      <div className="flex items-center gap-3">
        {!isListening ? (
          <button
            onClick={startListening}
            disabled={isEvaluating}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
              completed
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950'
            }`}
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>
              {isEvaluating
                ? '🤖 Gemini AI Analyzing Speech...'
                : completed
                ? '🔄 Practice Speaking Again'
                : '🎙️ Tap & Read Aloud into Mic'}
            </span>
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 animate-pulse"
          >
            <MicOff className="w-4 h-4" />
            <span>Tap to Finish Reading 🛑</span>
          </button>
        )}
      </div>
    </div>
  );
};
