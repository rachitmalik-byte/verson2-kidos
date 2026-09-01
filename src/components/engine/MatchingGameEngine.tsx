import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MatchingPairsData, MatchingPairItem } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  data: MatchingPairsData;
  onComplete: () => void;
  isCompleted?: boolean;
}

const DEFAULT_PAIRS: MatchingPairItem[] = [
  { id: 'p-1', leftItem: 'Raincoat', leftIcon: '🧥', rightProperty: 'Waterproof & Lightweight', explanation: 'Polyester repels rainwater easily!' },
  { id: 'p-2', leftItem: 'Climbing Rope', leftIcon: '🪢', rightProperty: 'Stronger Than Steel', explanation: 'Nylon holds massive weights without snapping!' },
  { id: 'p-3', leftItem: 'Pan Handle', leftIcon: '🫖', rightProperty: 'Heat-Resistant Thermoset', explanation: 'Bakelite plastic never burns hands on hot stoves!' },
];

export const MatchingGameEngine: React.FC<Props> = ({ data, onComplete }) => {
  const pairs: MatchingPairItem[] = data?.pairs && data.pairs.length > 0 ? data.pairs : DEFAULT_PAIRS;

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [shuffledRightItems, setShuffledRightItems] = useState<MatchingPairItem[]>(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

  useEffect(() => {
    setSelectedLeftId(null);
    setMatchedIds([]);
    setActiveFeedback(null);
    setShuffledRightItems([...pairs].sort(() => Math.random() - 0.5));
  }, [data]);

  const isAllMatched = matchedIds.length === pairs.length;

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    sounds.pop();
    setSelectedLeftId(id);
    setActiveFeedback(null);
  };

  const handleRightClick = (rightPairId: string) => {
    if (!selectedLeftId) {
      sounds.boing();
      voiceAssistant.speak('Tap an item on the left first, then pick its matching property on the right!');
      return;
    }

    if (selectedLeftId === rightPairId) {
      // Correct Match
      sounds.success();
      const updated = [...matchedIds, rightPairId];
      setMatchedIds(updated);
      setSelectedLeftId(null);

      const matchedPair = pairs.find((p) => p.id === rightPairId);
      if (matchedPair) {
        setActiveFeedback(matchedPair.explanation);
        voiceAssistant.speak(`Great match! ${matchedPair.explanation}`);
      }

      if (updated.length === pairs.length) {
        sounds.fanfare();
        onComplete();
      }
    } else {
      // Incorrect Match
      sounds.boing();
      setShakeId(rightPairId);
      setTimeout(() => setShakeId(null), 600);
      voiceAssistant.speak('Not quite! Think about the special superpower that item needs.');
    }
  };

  const handleReset = () => {
    sounds.pop();
    setSelectedLeftId(null);
    setMatchedIds([]);
    setActiveFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center mx-auto select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Matching Pairs Challenge
        </span>
        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Matched: {matchedIds.length} of {pairs.length}
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {data.title || 'Match Objects to Superpowers'}
      </h3>
      <p className="text-xs sm:text-sm font-bold text-slate-600 text-center mb-6 max-w-xl">
        {data.instruction || 'Tap an object on the left, then tap its matching scientific property on the right!'}
      </p>

      {/* Matching Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
        {/* Left Column: Objects */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            1. Select Object
          </span>
          {pairs.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedLeftId === pair.id;

            return (
              <motion.button
                key={pair.id}
                whileHover={!isMatched ? { scale: 1.02, x: 4 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                onClick={() => handleLeftClick(pair.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-3 flex items-center justify-between text-left transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 opacity-80'
                    : isSelected
                    ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-200 shadow-md font-black'
                    : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{pair.leftIcon}</span>
                  <span className="font-extrabold text-sm sm:text-base">{pair.leftItem}</span>
                </div>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Properties */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            2. Match Scientific Superpower
          </span>
          {shuffledRightItems.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isShaking = shakeId === pair.id;

            return (
              <motion.button
                key={pair.id}
                animate={isShaking ? { x: [-8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileHover={!isMatched ? { scale: 1.02, x: -4 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                onClick={() => handleRightClick(pair.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-3 flex items-center justify-between text-left transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 opacity-80'
                    : isShaking
                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                    : selectedLeftId
                    ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-950 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs sm:text-sm">{pair.rightProperty}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Real-time Educational Feedback Banner */}
      {activeFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{activeFeedback}</span>
        </motion.div>
      )}

      {/* Completion Banner */}
      {isAllMatched && (
        <div className="text-center py-4 flex flex-col items-center gap-2">
          <span className="text-4xl animate-bounce">🎉</span>
          <h4 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            All Pairs Matched Correctly!
          </h4>
        </div>
      )}
    </div>
  );
};
