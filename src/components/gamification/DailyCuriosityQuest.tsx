import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Flame, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

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
    question: "Why do raindrops slide right off a polyester raincoat?",
    options: [
      { text: 'Plastic fibers are waterproof and repel water droplets!', isCorrect: true, explanation: 'Correct! Polyester is a synthetic plastic fiber that refuses to absorb water!' },
      { text: 'Water is afraid of the bright raincoat colors', isCorrect: false, explanation: "Haha, water doesn't have eyes! It's material science!" },
      { text: 'Raincoats are made of heavy metal steel', isCorrect: false, explanation: 'Nope! Raincoats are lightweight plastic fibers!' },
    ],
    funFact: '🦆 Duck feathers have natural wax that works just like synthetic raincoats!',
    badgeEmoji: '🦆🌧️',
  },
  {
    id: 'riddle-2',
    question: "Why doesn't a hard plastic kettle handle melt in boiling heat?",
    options: [
      { text: 'Made of heat-proof Bakelite plastic with locked bonds!', isCorrect: true, explanation: 'Spot on! Bakelite is a thermoset plastic that never melts once heated!' },
      { text: 'The kettle handle stays frozen like ice', isCorrect: false, explanation: 'The kettle gets boiling hot, but the handle stays safe!' },
      { text: 'It melts every day and we glue it back', isCorrect: false, explanation: 'That would take too much glue!' },
    ],
    funFact: '🍳 Bakelite was invented in 1907 and is the world’s first synthetic plastic!',
    badgeEmoji: '🍳🔥',
  },
  {
    id: 'riddle-3',
    question: 'Why are electric wires wrapped in plastic instead of bare copper?',
    options: [
      { text: 'Plastic is an electrical insulator that blocks dangerous shocks!', isCorrect: true, explanation: 'Correct! Plastic holds electric charges inside so you can safely touch the wire!' },
      { text: 'To make the wires look like colorful noodles', isCorrect: false, explanation: 'It looks colorful, but safety is the real superpower!' },
      { text: 'Copper metal evaporates into thin air', isCorrect: false, explanation: "Copper doesn't evaporate, but it conducts dangerous shocks without plastic!" },
    ],
    funFact: '⚡ PVC plastic insulation protects you from thousands of Volts of electricity!',
    badgeEmoji: '⚡🛡️',
  },
];

export const DailyCuriosityQuest: React.FC = () => {
  const [currentRiddle, setCurrentRiddle] = useState<DailyRiddle>(DAILY_RIDDLES[2]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(13);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    const dayIndex = new Date().getDate() % DAILY_RIDDLES.length;
    setCurrentRiddle(DAILY_RIDDLES[dayIndex]);
    const savedStreak = localStorage.getItem('kidos_daily_streak');
    if (savedStreak) setStreakCount(parseInt(savedStreak, 10));
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
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-300 shadow-sm font-sans select-none overflow-hidden">
      {/* ── Compact Header Bar (Always Visible, ~42px) ── */}
      <div
        onClick={() => {
          sounds.pop();
          setIsExpanded(!isExpanded);
        }}
        className="px-3.5 py-2 flex items-center justify-between gap-2 cursor-pointer hover:bg-amber-50/60 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>Daily Riddle</span>
          </span>
          <span className="text-xs font-black text-slate-800 truncate">
            {currentRiddle.badgeEmoji} {currentRiddle.question}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2 py-0.5 bg-amber-100 text-amber-950 font-black text-[10px] rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>{streakCount}d</span>
          </div>

          <button className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Expandable Question Body ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3.5 pb-3 pt-1 border-t border-amber-100 bg-amber-50/40"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
              {currentRiddle.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border ${
                    selectedIdx === idx
                      ? opt.isCorrect
                        ? 'bg-emerald-500 border-emerald-600 text-white font-black shadow-xs'
                        : 'bg-rose-400 border-rose-500 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-black mr-1 text-[10px] opacity-75">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            {isAnswered && (
              <div className="mt-2 p-2 bg-emerald-100 text-emerald-950 rounded-xl text-xs font-bold text-center border border-emerald-300">
                🎉 {currentRiddle.funFact}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
