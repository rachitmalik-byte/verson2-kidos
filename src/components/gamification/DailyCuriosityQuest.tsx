import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';
import { Sparkles, Flame, CheckCircle2, HelpCircle, ArrowRight, Trophy, Star } from 'lucide-react';

interface DailyRiddle {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
  funFact: string;
  badgeEmoji: string;
}

const DAILY_RIDDLES: DailyRiddle[] = [
  {
    id: 'riddle-1',
    question: "Why do raindrops slide right off a duck's feathers and a polyester raincoat?",
    options: [
      { text: 'Coated in waterproof hydrophobic polymers that repel water!', isCorrect: true, explanation: 'Exactly! Both duck oil and polyester are hydrophobic and refuse to absorb water!' },
      { text: 'Water gets too scared to touch them', isCorrect: false, explanation: "Haha, water doesn't have feelings! It's chemistry!" },
      { text: 'They are made of heavy metal steel', isCorrect: false, explanation: 'Nope! If a duck were metal, it would sink like a stone!' },
    ],
    funFact: '🦆 Duck feathers have natural wax that works just like synthetic polyester raincoats!',
    badgeEmoji: '🦆🌧️',
  },
  {
    id: 'riddle-2',
    question: "Why doesn't a chef's plastic spatula melt in a 100°C soup pot?",
    options: [
      { text: 'Made of thermosetting plastic with locked 3D crosslinks!', isCorrect: true, explanation: 'Spot on! Thermoset plastics like Bakelite have locked 3D molecular bonds that resist boiling heat!' },
      { text: 'The soup is secretly made of ice cream', isCorrect: false, explanation: 'Yum, but hot soup is 100°C!' },
      { text: 'It melts every 5 minutes and we buy new ones', isCorrect: false, explanation: 'That would get very expensive!' },
    ],
    funFact: '🍳 Thermosetting polymers were invented in 1907 and never melt once cured!',
    badgeEmoji: '🍳🔥',
  },
  {
    id: 'riddle-3',
    question: 'Why are electrical wires wrapped in bright plastic instead of bare copper?',
    options: [
      { text: 'Plastic is an electrical insulator that blocks shocks!', isCorrect: true, explanation: 'Correct! Plastic polymer bonds hold electrons tightly so current stays inside the wire!' },
      { text: 'To make the wire look like rainbow spaghetti', isCorrect: false, explanation: 'It looks colorful, but safety is the real superpower!' },
      { text: 'Because copper metal dissolves in air', isCorrect: false, explanation: "Copper doesn't dissolve in air, but it conducts dangerous shocks without insulation!" },
    ],
    funFact: '⚡ PVC plastic insulation can block over 10,000 Volts of electricity!',
    badgeEmoji: '⚡🛡️',
  },
];

export const DailyCuriosityQuest: React.FC = () => {
  const [currentRiddle, setCurrentRiddle] = useState<DailyRiddle>(DAILY_RIDDLES[1]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(8);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    const dayIndex = new Date().getDate() % DAILY_RIDDLES.length;
    setCurrentRiddle(DAILY_RIDDLES[dayIndex]);

    const savedStreak = localStorage.getItem('kidos_daily_streak');
    if (savedStreak) {
      setStreakCount(parseInt(savedStreak, 10));
    }
  }, []);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    const opt = currentRiddle.options[idx];

    if (opt.isCorrect) {
      sounds.fanfare();
      voiceAssistant.speak(opt.explanation);
      setIsAnswered(true);
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      localStorage.setItem('kidos_daily_streak', newStreak.toString());
    } else {
      sounds.boing();
      voiceAssistant.speak(opt.explanation);
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border-2 border-amber-300 shadow-md p-3.5 sm:p-4 font-sans select-none relative overflow-hidden">
      {/* Top Header Row (Compact) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-100 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-[10px] uppercase rounded-full shadow-2xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>Daily Mystery Riddle</span>
          </span>
          <span className="text-base">{currentRiddle.badgeEmoji}</span>
        </div>

        {/* Streak Pill */}
        <div className="px-2.5 py-0.5 bg-amber-50 border border-amber-300 text-amber-950 font-black text-[11px] rounded-full flex items-center gap-1 shadow-2xs">
          <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
          <span>{streakCount}d Streak</span>
        </div>
      </div>

      {/* Riddle Question & Compact Option Pills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Question Text (5 Cols) */}
        <div className="lg:col-span-5 flex items-start gap-2.5">
          <div className="shrink-0 hidden sm:block">
            <Pip mood={isAnswered ? 'celebrating' : 'idle'} size="sm" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-snug">
              {currentRiddle.question}
            </h4>
            <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
              Solve to win +50 Science XP & keep your streak!
            </span>
          </div>
        </div>

        {/* 3 Compact Answer Pills (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-1.5">
          {currentRiddle.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const letter = String.fromCharCode(65 + idx);

            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered && !isSelected}
                className={`w-full px-3 py-2 rounded-xl border text-left font-bold text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isSelected && opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-1 ring-emerald-300'
                    : isSelected && !opt.isCorrect
                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isSelected && opt.isCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {letter}
                  </span>
                  <span className="truncate leading-tight">{opt.text}</span>
                </div>

                {isSelected && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </motion.button>
            );
          })}

          {/* Success Banner */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-900 flex items-center justify-between mt-0.5"
            >
              <span className="truncate">{currentRiddle.funFact}</span>
              <span className="text-emerald-700 font-black shrink-0 ml-2">+50 XP 🌟</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
