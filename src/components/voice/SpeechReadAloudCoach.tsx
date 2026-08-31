import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  HelpCircle,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

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

const HOMOPHONES: Record<string, string[]> = {
  icy: ['ic', 'ice', 'icey', 'isi', 'isee', 'i-c', 'i.c.', 'ic sea', 'ice-sea', 'isea'],
  crampons: ['crampon', 'krampons', 'grampons', 'cramping', 'cramps', 'crampons', 'cramp-ons', 'crampones'],
  mountaineers: ['mountaineer', 'mountaneers', 'mountain-ears', 'mountain', 'mountaineer\'s'],
  glaciers: ['glacier', 'glasier', 'glaziers', 'glazier', 'glasier', 'glayshers'],
  oxygen: ['oxigen', 'oxegen', 'oxygin', 'oxgyen', 'oxigen-tanks'],
  altitudes: ['altitude', 'altitues', 'altitutdes', 'altitoodes'],
  thin: ['tin', 'thing', 'think', 'fin'],
  steel: ['steal', 'stele', 'still', 'steels'],
  air: ['are', 'err', 'heir', 'ere'],
  because: ['becaus', 'bcoz', 'cuz', 'becoz', 'cause'],
  tanks: ['tank', 'thanx', 'thanks'],
  carry: ['cary', 'kerry', 'curry', 'carried'],
  use: ['used', 'uses', 'youse', 'yuze'],
  on: ['an', 'one', 'un', 'in', 'own'],
  and: ['an', 'nd', 'end', 'und'],
  is: ['iz', 'es', 'his'],
  at: ['et', 'it', 'ad'],
  high: ['hi', 'bye', 'hai'],
  pashmina: ['pashmeena', 'poshmina', 'pash', 'mina'],
  barometer: ['baro', 'meter', 'barometre', 'bar-ometer'],
  seismic: ['sizmic', 'sysmic', 'cesmic', 'sizesmic'],
  persian: ['perzian', 'pershian', 'perzhian'],
  polyester: ['poly', 'ester', 'polyester', 'poly-ester'],
  polymer: ['poly', 'mer', 'polymers', 'poly-mer'],
  monomer: ['mono', 'mer', 'monomers', 'mono-mer'],
  crosslinking: ['cross', 'linking', 'crosslink', 'cross-linking'],
  sulfur: ['sulphur', 'sulfer', 'sulpher'],
  vulcanized: ['vulcanised', 'volcanized', 'volcanised', 'vulcan-ized'],
  bakelite: ['bake', 'lite', 'bakelite', 'bake-lite'],
  thermoplastic: ['thermo', 'plastic', 'thermo-plastic'],
  thermosetting: ['thermo', 'setting', 'thermo-setting'],
};

function cleanWord(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/gi, '');
}

function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) return levenshteinDistance(s2, s1);
  if (s2.length === 0) return s1.length;
  let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const insertions = previousRow[j + 1] + 1;
      const deletions = currentRow[j] + 1;
      const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
}

function isPhoneticMatch(spoken: string, target: string): boolean {
  const s = cleanWord(spoken);
  const t = cleanWord(target);
  if (!s || !t) return false;
  if (s === t) return true;

  // 1. Homophone dictionary
  if (HOMOPHONES[t] && HOMOPHONES[t].includes(s)) return true;
  if (HOMOPHONES[s] && HOMOPHONES[s].includes(t)) return true;

  // 2. Levenshtein edit distance
  const dist = levenshteinDistance(s, t);

  if (t.length <= 3) {
    return dist <= 1 || (s.length >= 2 && (s.startsWith(t.slice(0, 2)) || t.startsWith(s.slice(0, 2))));
  } else if (t.length <= 6) {
    return dist <= 1 || (s.length >= 3 && (s.startsWith(t.slice(0, 3)) || t.startsWith(s.slice(0, 3))));
  } else {
    return dist <= 2 || (s.length >= 4 && (s.startsWith(t.slice(0, 4)) || t.startsWith(s.slice(0, 4))));
  }
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
      clean: cleanWord(w),
    }));
  }, [sentence]);

  // Sync external completed state
  useEffect(() => {
    if (isCompleted && !completed) {
      setCompleted(true);
      setCurrentWordIndex(wordTokens.length);
    }
  }, [isCompleted, completed, wordTokens.length]);

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

  /**
   * Tap-to-pass / practice single word
   */
  const handleWordClick = (index: number, wordRaw: string) => {
    sounds.sparkle();
    voiceAssistant.speak(wordRaw);
    if (index === currentWordIndex) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      if (nextIdx >= wordTokens.length && !completed) {
        setCompleted(true);
        sounds.fanfare();
        const praise = `Awesome reading! You mastered the entire sentence! ⭐`;
        setFeedbackMessage(praise);
        voiceAssistant.speak(praise);
        onComplete();
      }
    }
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
      recognition.maxAlternatives = 5;

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

        // Child-Friendly Multi-Token & Phonetic Sequential Matcher
        let targetPointer = currentWordIndex;
        const newMisspoken = new Set<number>();

        let sIdx = 0;
        while (sIdx < spokenWords.length && targetPointer < wordTokens.length) {
          const spoken = spokenWords[sIdx];
          const target = wordTokens[targetPointer].clean;

          // 1. Single word phonetic match (e.g. 'ic' -> 'icy', 'crampon' -> 'crampons')
          if (isPhoneticMatch(spoken, target)) {
            targetPointer++;
            sIdx++;
            continue;
          }

          // 2. Two-word compound match (e.g. 'i' + 'c' -> 'icy', 'cramp' + 'ons' -> 'crampons')
          if (sIdx + 1 < spokenWords.length) {
            const compoundSpoken = spoken + spokenWords[sIdx + 1];
            if (isPhoneticMatch(compoundSpoken, target)) {
              targetPointer++;
              sIdx += 2;
              continue;
            }
          }

          // 3. Skip noise / filler word lookahead
          if (sIdx + 1 < spokenWords.length && isPhoneticMatch(spokenWords[sIdx + 1], target)) {
            targetPointer++;
            sIdx += 2;
            continue;
          }

          sIdx++;
        }

        setCurrentWordIndex(targetPointer);
        setMisspokenIndices(newMisspoken);

        // Completion trigger
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
        setCurrentWordIndex((idx) => {
          if (idx < wordTokens.length && !completed) {
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

      {/* Real-Time Word-by-Word Karaoke Sentence Display */}
      <div className="p-5 rounded-2xl bg-slate-950 text-white text-base sm:text-lg font-black leading-loose mb-4 shadow-inner flex flex-wrap items-center gap-2">
        {wordTokens.map((token) => {
          const isSpoken = token.index < currentWordIndex;
          const isCurrent = token.index === currentWordIndex && isListening;
          const isMisspoken = misspokenIndices.has(token.index) && !isSpoken;

          if (isSpoken) {
            return (
              <span
                key={token.index}
                onClick={() => handleWordClick(token.index, token.raw)}
                className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white shadow-sm flex items-center gap-1 animate-scaleIn cursor-pointer hover:bg-emerald-600"
                title="Tapped to hear word"
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
                onClick={() => handleWordClick(token.index, token.raw)}
                className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 shadow-md ring-4 ring-amber-300 animate-pulse font-black scale-105 cursor-pointer"
                title="Current word to read! Tap to hear Pip pronounce it."
              >
                👉 {token.raw}
              </span>
            );
          }

          if (isMisspoken) {
            return (
              <span
                key={token.index}
                onClick={() => handleWordClick(token.index, token.raw)}
                className="px-2.5 py-1 rounded-xl bg-rose-500/30 text-rose-300 border border-rose-400 underline decoration-wavy cursor-pointer hover:bg-rose-500/50"
                title="Tap word to pronounce and pass!"
              >
                {token.raw}
              </span>
            );
          }

          return (
            <span
              key={token.index}
              onClick={() => handleWordClick(token.index, token.raw)}
              className="px-1.5 py-0.5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              title="Tap to hear word"
            >
              {token.raw}
            </span>
          );
        })}
      </div>

      {/* Pip Voice Coach Feedback Bubble */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl mb-4 border flex items-center gap-2.5 text-xs font-bold ${
            completed
              ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
              : 'bg-amber-100/90 border-amber-300 text-amber-950'
          }`}
        >
          <span className="text-xl">🤖</span>
          <div className="flex-1">
            <span className="font-black block uppercase text-[10px] tracking-wider text-amber-900">
              Pip Speech Guide:
            </span>
            <span>{feedbackMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          {!isListening ? (
            <button
              onClick={startListening}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                completed
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : currentWordIndex > 0
                  ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 hover:brightness-105'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:from-amber-500 hover:to-orange-600'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>
                {completed
                  ? 'Practice Reading Again 🎙️'
                  : currentWordIndex > 0
                  ? '🎙️ Continue Reading Aloud'
                  : '🎙️ Tap to Read Aloud'}
              </span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex-1 py-3.5 px-6 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl cursor-pointer shadow-lg animate-pulse flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <MicOff className="w-5 h-5" />
              <span>Listening... Tap when done ⏹️</span>
            </button>
          )}

          {currentWordIndex > 0 && (
            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shadow-xs active:scale-95 transition-all"
              title="Reset Sentence"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!micSupported && (
        <p className="mt-2 text-xs font-bold text-rose-600">
          ⚠️ Microphone access is not supported in this browser. Please try Chrome or Edge.
        </p>
      )}
    </div>
  );
};
