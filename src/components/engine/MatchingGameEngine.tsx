import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MatchingPairsData } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  data: MatchingPairsData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const MatchingGameEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Shuffle right items once for playful challenge
  const [shuffledRightItems] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

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
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Matching Pairs Challenge
        </span>
        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Matched: {matchedIds.length} of {pairs.length}
        </span>
      </div>

      <h3 className="text-2xl font-black text-slate-900 text-center mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {data.title}
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
            const isSelected = selectedLeftId === pair.id;
            const isMatched = matchedIds.includes(pair.id);

            return (
              <motion.button
                key={`left-${pair.id}`}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                onClick={() => handleLeftClick(pair.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default'
                    : isSelected
                    ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-300 shadow-md cursor-pointer scale-102'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {pair.leftIcon && <span className="text-2xl">{pair.leftIcon}</span>}
                  {pair.leftImage && (
                    <img src={pair.leftImage} alt={pair.leftText} className="w-10 h-10 object-cover rounded-xl border border-slate-300" />
                  )}
                  <span className={`font-black text-sm ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                    {pair.leftText}
                  </span>
                </div>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Properties / Uses */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            2. Match Scientific Property
          </span>
          {shuffledRightItems.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isShaking = shakeId === pair.id;

            return (
              <motion.button
                key={`right-${pair.id}`}
                animate={isShaking ? { x: [-10, 10, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                onClick={() => handleRightClick(pair.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-amber-400 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {pair.rightIcon && <span className="text-2xl">{pair.rightIcon}</span>}
                  {pair.rightImage && (
                    <img src={pair.rightImage} alt={pair.rightText} className="w-10 h-10 object-cover rounded-xl border border-slate-300" />
                  )}
                  <span className="font-black text-sm text-slate-800">
                    {pair.rightText}
                  </span>
                </div>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Socratic Feedback Box */}
      {activeFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm font-bold text-amber-950 text-center w-full mb-4"
        >
          💡 <strong>Science Connection:</strong> {activeFeedback}
        </motion.div>
      )}

      {/* Completion & Actions */}
      <div className="flex items-center justify-between w-full pt-4 border-t-2 border-slate-100 flex-wrap gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Matches</span>
        </button>

        {isAllMatched && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onComplete}
            className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer flex items-center gap-2 animate-pulse"
          >
            <span>Continue to Next Challenge ➔</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
