import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';
import { Sparkles, Flame, CheckCircle2, HelpCircle, ArrowRight, Trophy } from 'lucide-react';

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
    question: 'Why do raindrops slide right off a duck\'s feathers and a polyester raincoat?',
    options: [
      { text: 'They are coated in waterproof polymers that repel water!', isCorrect: true, explanation: 'Exactly! Both duck oil and polyester are hydrophobic (water-fearing) and refuse to absorb water!' },
      { text: 'Water gets too scared to touch them', isCorrect: false, explanation: 'Haha, water doesn\'t have feelings! It\'s chemistry!' },
      { text: 'They are made of heavy metal steel', isCorrect: false, explanation: 'Nope! If a duck were made of metal, it would sink like a stone!' },
    ],
    funFact: '🦆 Duck feathers have natural wax that works just like synthetic polyester raincoats!',
    badgeEmoji: '🦆🌧️',
  },
  {
    id: 'riddle-2',
    question: 'Why doesn\'t a chef\'s plastic spatula melt in a 100°C soup pot?',
    options: [
      { text: 'It is made of thermosetting plastic with 3D crosslinks!', isCorrect: true, explanation: 'Spot on! Thermoset plastics like Bakelite and Silicone have locked 3D molecular bonds that resist boiling heat!' },
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
      { text: 'Plastic is an insulator that blocks 240V from shocking our hands!', isCorrect: true, explanation: 'Correct! Plastic polymer bonds hold electrons tightly so current stays inside the wire!' },
      { text: 'To make the wire look like rainbow spaghetti', isCorrect: false, explanation: 'It looks colorful, but safety is the real superpower!' },
      { text: 'Because copper metal dissolves in air', isCorrect: false, explanation: 'Copper doesn\'t dissolve in air, but it conducts dangerous shocks without insulation!' },
    ],
    funFact: '⚡ PVC plastic insulation can block over 10,000 Volts of electricity!',
    badgeEmoji: '⚡🛡️',
  },
];

export const DailyCuriosityQuest: React.FC = () => {
  const [currentRiddle, setCurrentRiddle] = useState<DailyRiddle>(DAILY_RIDDLES[0]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    // Select riddle based on day
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
    <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-1 rounded-3xl shadow-xl">
      <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-[22px] flex flex-col md:flex-row items-center gap-6 justify-between">
        {/* Left Badge & Pip */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <Pip mood={isAnswered ? 'celebrating' : 'curious'} size="lg" />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-yellow-200 fill-yellow-200" />
              <span>{streakCount}d Streak</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                ✨ Daily Mystery Riddle
              </span>
              <span className="text-lg">{currentRiddle.badgeEmoji}</span>
            </div>
            <h4 className="font-black text-slate-800 text-base sm:text-lg mt-1 max-w-md leading-snug">
              {currentRiddle.question}
            </h4>
          </div>
        </div>

        {/* Right Riddle Options */}
        <div className="flex-1 w-full flex flex-col gap-2">
          {currentRiddle.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered && !isSelected}
                className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isSelected && opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                    : isSelected && !opt.isCorrect
                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </motion.button>
            );
          })}

          {/* Correct Explanation Banner */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 mt-1 flex items-center justify-between"
            >
              <span>{currentRiddle.funFact}</span>
              <span className="text-emerald-700 font-black shrink-0">+50 XP 🌟</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
