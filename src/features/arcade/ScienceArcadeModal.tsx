import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gamepad2, X, Sparkles, Trophy, Zap, Shield, Play, RotateCcw, Flame, CheckCircle2, Coins } from 'lucide-react';

interface ScienceArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScienceArcadeModal: React.FC<ScienceArcadeModalProps> = ({ isOpen, onClose }) => {
  const credits = useProgressStore((state) => state.credits);
  const spendCredits = useProgressStore((state) => state.spendCredits);
  const addCredits = useProgressStore((state) => state.addCredits);

  const [selectedGame, setSelectedGame] = useState<'hub' | 'chain' | 'sorter'>('hub');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Sorter game active item
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const SORTER_ITEMS = [
    { name: 'Cotton Plant', icon: '🌿', type: 'nature' },
    { name: 'Nylon Parachute', icon: '🪂', type: 'synthetic' },
    { name: 'Wood Timber', icon: '🪵', type: 'nature' },
    { name: 'Polyester Shirt', icon: '👕', type: 'synthetic' },
    { name: 'Natural Silk', icon: '🪱', type: 'nature' },
    { name: 'Plastic Bottle', icon: '🫙', type: 'synthetic' },
    { name: 'Tree Latex Sap', icon: '🌳', type: 'nature' },
    { name: 'Acrylic Sweater', icon: '🧶', type: 'synthetic' },
  ];

  // Polymer Chain game links
  const [chainLinks, setChainLinks] = useState<number>(0);

  // Game timer loop
  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      sounds.fanfare();
      // Reward bonus credits for playing!
      const bonus = Math.max(5, Math.floor(score * 2));
      addCredits(bonus);
      voiceAssistant.speak(`Game Over! You scored ${score} points and earned ${bonus} bonus PolyCredits!`);
    }
    return () => window.clearInterval(timer);
  }, [isPlaying, timeLeft, score]);

  const startGame = (game: 'chain' | 'sorter') => {
    if (credits < 10) {
      sounds.boing();
      voiceAssistant.speak("You need 10 PolyCredits to enter the arcade! Complete missions to earn more!");
      return;
    }
    spendCredits(10);
    sounds.success();
    setSelectedGame(game);
    setScore(0);
    setTimeLeft(20);
    setChainLinks(0);
    setCurrentItemIndex(0);
    setIsPlaying(true);
    setGameOver(false);
  };

  const handleSorterChoice = (choice: 'nature' | 'synthetic') => {
    const item = SORTER_ITEMS[currentItemIndex % SORTER_ITEMS.length];
    if (item.type === choice) {
      sounds.pop();
      setScore((s) => s + 10);
    } else {
      sounds.boing();
    }
    setCurrentItemIndex((i) => i + 1);
  };

  const handleChainTap = () => {
    sounds.sparkle();
    setChainLinks((c) => c + 1);
    setScore((s) => s + 15);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 bg-slate-900 rounded-3xl md:rounded-[36px] border-4 md:border-6 border-indigo-400 text-white shadow-2xl flex flex-col max-w-4xl w-full max-h-[90vh] overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    PolyQuest Science Arcade 🕹️✨
                  </h3>
                  <p className="text-xs text-indigo-100 font-bold">
                    Spend 10 credits to test your reflexes & earn bonus rewards!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-slate-950/50 backdrop-blur-md rounded-2xl border border-white/30 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="font-black text-sm md:text-base text-amber-200">{credits} Credits</span>
                </div>
                <button onClick={onClose} className="p-2 rounded-2xl hover:bg-white/20 text-white cursor-pointer">
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Arcade Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-center">
              {selectedGame === 'hub' && (
                <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto">
                  {/* Game 1: Polymer Chain Rush */}
                  <div className="p-6 bg-slate-800 rounded-3xl border-3 border-sky-400 flex flex-col items-center text-center shadow-lg hover:scale-102 transition-transform">
                    <span className="text-5xl mb-3 block animate-bounce">🔬⛓️</span>
                    <h4 className="font-black text-xl text-sky-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Polymer Chain Rush!
                    </h4>
                    <p className="text-xs text-slate-300 font-bold my-3 leading-relaxed">
                      Tap rapidly to bond free monomers together into a giant unbreakable synthetic polymer chain before time expires!
                    </p>
                    <button
                      onClick={() => startGame('chain')}
                      className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-2 mt-auto"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play (10 Credits)</span>
                    </button>
                  </div>

                  {/* Game 2: Sorter Blitz */}
                  <div className="p-6 bg-slate-800 rounded-3xl border-3 border-emerald-400 flex flex-col items-center text-center shadow-lg hover:scale-102 transition-transform">
                    <span className="text-5xl mb-3 block animate-pulse">🌿🏭</span>
                    <h4 className="font-black text-xl text-emerald-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Material Sorter Blitz!
                    </h4>
                    <p className="text-xs text-slate-300 font-bold my-3 leading-relaxed">
                      Fast conveyor sorting! Tap Nature vs Synthetic bins as fast as possible to build massive combo multipliers!
                    </p>
                    <button
                      onClick={() => startGame('sorter')}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-2 mt-auto"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play (10 Credits)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Game 1 Live Screen: Polymer Chain Rush */}
              {selectedGame === 'chain' && (
                <div className="w-full max-w-lg flex flex-col items-center text-center">
                  <div className="flex justify-between w-full mb-4 px-4 font-black text-sm text-slate-300">
                    <span>⏳ Time: {timeLeft}s</span>
                    <span className="text-amber-300">⭐ Score: {score}</span>
                  </div>

                  {!gameOver ? (
                    <div className="w-full bg-slate-800 p-8 rounded-3xl border-3 border-sky-400 flex flex-col items-center">
                      <span className="text-xs font-black text-sky-400 uppercase tracking-widest mb-2">
                        Synthetic Polymer Chain Links: {chainLinks}
                      </span>

                      {/* Chain Visualizer */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-16 my-4 p-3 bg-slate-900 rounded-2xl border border-slate-700 w-full max-h-32 overflow-y-auto">
                        {[...Array(chainLinks)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xl"
                          >
                            🔗
                          </motion.span>
                        ))}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={handleChainTap}
                        className="w-40 h-40 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-black text-base shadow-[0_8px_0_#0369A1] active:translate-y-2 active:shadow-none flex flex-col items-center justify-center cursor-pointer border-4 border-sky-300 select-none"
                      >
                        <span className="text-4xl mb-1">⬡</span>
                        <span>BOND MONOMER!</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-800 rounded-3xl border-3 border-amber-400 text-center w-full">
                      <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-2xl font-black text-amber-300 mb-1">Great Synthesis! 🏆</h4>
                      <p className="text-sm font-bold text-slate-300 mb-4">
                        You linked {chainLinks} polymer units and scored {score} points!
                      </p>
                      <button
                        onClick={() => setSelectedGame('hub')}
                        className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                      >
                        Back to Arcade Hub
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Game 2 Live Screen: Sorter Blitz */}
              {selectedGame === 'sorter' && (
                <div className="w-full max-w-lg flex flex-col items-center text-center">
                  <div className="flex justify-between w-full mb-4 px-4 font-black text-sm text-slate-300">
                    <span>⏳ Time: {timeLeft}s</span>
                    <span className="text-amber-300">⭐ Score: {score}</span>
                  </div>

                  {!gameOver ? (
                    <div className="w-full bg-slate-800 p-8 rounded-3xl border-3 border-emerald-400 flex flex-col items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Classify Incoming Material:
                      </span>

                      {/* Active Falling Item */}
                      <motion.div
                        key={currentItemIndex}
                        initial={{ scale: 0.5, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="p-6 bg-slate-900 rounded-3xl border-2 border-slate-700 my-4 text-center w-48 shadow-inner"
                      >
                        <span className="text-5xl block mb-2">
                          {SORTER_ITEMS[currentItemIndex % SORTER_ITEMS.length].icon}
                        </span>
                        <span className="font-black text-base text-white">
                          {SORTER_ITEMS[currentItemIndex % SORTER_ITEMS.length].name}
                        </span>
                      </motion.div>

                      {/* Sorter Bins */}
                      <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        <button
                          onClick={() => handleSorterChoice('nature')}
                          className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm flex flex-col items-center gap-1 cursor-pointer shadow-md active:scale-95 transition-all border-2 border-emerald-400"
                        >
                          <span className="text-2xl">🌿</span>
                          <span>FROM NATURE</span>
                        </button>

                        <button
                          onClick={() => handleSorterChoice('synthetic')}
                          className="py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-black text-sm flex flex-col items-center gap-1 cursor-pointer shadow-md active:scale-95 transition-all border-2 border-sky-400"
                        >
                          <span className="text-2xl">🏭</span>
                          <span>SYNTHETIC</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-800 rounded-3xl border-3 border-amber-400 text-center w-full">
                      <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-2xl font-black text-amber-300 mb-1">Sorting Master! 🏆</h4>
                      <p className="text-sm font-bold text-slate-300 mb-4">
                        You scored {score} points in Material Sorter Blitz!
                      </p>
                      <button
                        onClick={() => setSelectedGame('hub')}
                        className="px-8 py-3 bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer"
                      >
                        Back to Arcade Hub
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
