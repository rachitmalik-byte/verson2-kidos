import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Gamepad2,
  X,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  Coins,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Check,
} from 'lucide-react';

interface ScienceArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScienceArcadeModal: React.FC<ScienceArcadeModalProps> = ({ isOpen, onClose }) => {
  const credits = useProgressStore((state) => state.credits);
  const spendCredits = useProgressStore((state) => state.spendCredits);
  const addCredits = useProgressStore((state) => state.addCredits);

  const [selectedGame, setSelectedGame] = useState<'hub' | 'snake' | 'memory' | 'bubble'>('hub');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CLASSIC SNAKE GAME STATE & ENGINE
  // ═══════════════════════════════════════════════════════════════════════════
  const GRID_SIZE = 14;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 7, y: 7 },
    { x: 6, y: 7 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 10, y: 7 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const directionRef = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  directionRef.current = direction;

  const startSnakeGame = () => {
    if (credits < 10) {
      sounds.boing();
      voiceAssistant.speak("You need 10 PolyCredits to enter the arcade! Complete missions to earn more!");
      return;
    }
    spendCredits(10);
    sounds.success();
    setSelectedGame('snake');
    setSnake([
      { x: 7, y: 7 },
      { x: 6, y: 7 },
    ]);
    setFood({ x: 10, y: 7 });
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (selectedGame !== 'snake' || gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const dir = directionRef.current;

        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        // Wall collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          sounds.boing();
          setGameOver(true);
          const bonus = Math.max(5, Math.floor(score * 2));
          addCredits(bonus);
          voiceAssistant.speak(`Game Over! You scored ${score} in Snake and won ${bonus} PolyCredits!`);
          return prev;
        }

        // Self collision check
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          sounds.boing();
          setGameOver(true);
          const bonus = Math.max(5, Math.floor(score * 2));
          addCredits(bonus);
          voiceAssistant.speak(`Game Over! You scored ${score} in Snake and won ${bonus} PolyCredits!`);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food eaten check
        if (head.x === food.x && head.y === food.y) {
          sounds.pop();
          setScore((s) => s + 10);
          // Spawn new food
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 160);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && directionRef.current !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && directionRef.current !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && directionRef.current !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && directionRef.current !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGame, gameOver, food, score]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CARD FLIP MEMORY MATCH GAME
  // ═══════════════════════════════════════════════════════════════════════════
  interface CardItem {
    id: number;
    icon: string;
    pairId: number;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const MEMORY_ICONS = ['🦁', '🚀', '💎', '🍕', '🎸', '🦄'];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const startMemoryGame = () => {
    if (credits < 10) {
      sounds.boing();
      voiceAssistant.speak("You need 10 PolyCredits to enter the arcade!");
      return;
    }
    spendCredits(10);
    sounds.success();
    setSelectedGame('memory');
    setScore(0);
    setGameOver(false);

    const initialCards: CardItem[] = [];
    MEMORY_ICONS.forEach((icon, idx) => {
      initialCards.push({ id: idx * 2, icon, pairId: idx, isFlipped: false, isMatched: false });
      initialCards.push({ id: idx * 2 + 1, icon, pairId: idx, isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    setCards(initialCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sounds.pop();
    const updatedCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = updatedCards.find((c) => c.id === newFlipped[0])!;
      const card2 = updatedCards.find((c) => c.id === newFlipped[1])!;

      if (card1.pairId === card2.pairId) {
        sounds.sparkle();
        setScore((s) => s + 20);
        setTimeout(() => {
          setCards((prev) => {
            const next = prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
            );
            if (next.every((c) => c.isMatched)) {
              sounds.fanfare();
              setGameOver(true);
              addCredits(25);
              voiceAssistant.speak("Incredible memory! You matched all pairs and earned 25 PolyCredits!");
            }
            return next;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        sounds.boing();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. BUBBLE POP BLITZ
  // ═══════════════════════════════════════════════════════════════════════════
  interface Bubble {
    id: number;
    x: number;
    color: string;
    icon: string;
  }

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubbleTime, setBubbleTime] = useState(20);

  const startBubbleGame = () => {
    if (credits < 10) {
      sounds.boing();
      voiceAssistant.speak("You need 10 PolyCredits to enter the arcade!");
      return;
    }
    spendCredits(10);
    sounds.success();
    setSelectedGame('bubble');
    setScore(0);
    setBubbleTime(20);
    setGameOver(false);
    setBubbles([]);
  };

  useEffect(() => {
    if (selectedGame !== 'bubble' || gameOver) return;

    const spawnInterval = setInterval(() => {
      const bubbleIcons = ['🫧', '⭐', '🎈', '🍭', '💎', '🍓'];
      const colors = ['bg-sky-400', 'bg-pink-400', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-400'];
      setBubbles((prev) => [
        ...prev.slice(-10),
        {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: bubbleIcons[Math.floor(Math.random() * bubbleIcons.length)],
        },
      ]);
    }, 600);

    const timer = setInterval(() => {
      setBubbleTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          clearInterval(spawnInterval);
          setGameOver(true);
          sounds.fanfare();
          const bonus = Math.max(5, Math.floor(score * 1.5));
          addCredits(bonus);
          voiceAssistant.speak(`Bubble frenzy over! You popped ${score / 5} bubbles and won ${bonus} PolyCredits!`);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [selectedGame, gameOver, score]);

  const popBubble = (id: number) => {
    sounds.pop();
    setScore((s) => s + 5);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
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
                    PolyQuest Fun Arcade 🕹️✨
                  </h3>
                  <p className="text-xs text-indigo-100 font-bold">
                    Spend 10 credits to play Snake, Memory Matching & Bubble Pop!
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
              {/* ARCADE HUB MENU */}
              {selectedGame === 'hub' && (
                <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-5 my-auto">
                  {/* Game 1: Classic Snake */}
                  <div className="p-5 bg-slate-800 rounded-3xl border-3 border-emerald-400 flex flex-col items-center text-center shadow-lg hover:scale-102 transition-transform">
                    <span className="text-5xl mb-2 block animate-bounce">🐍🍎</span>
                    <h4 className="font-black text-lg text-emerald-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Classic Snake 🐍
                    </h4>
                    <p className="text-xs text-slate-300 font-bold my-2 leading-relaxed">
                      Control the hungry snake, eat shiny apples, and grow longer without hitting the walls!
                    </p>
                    <button
                      onClick={startSnakeGame}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 mt-auto active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play (10 🪙)</span>
                    </button>
                  </div>

                  {/* Game 2: Card Flip Memory */}
                  <div className="p-5 bg-slate-800 rounded-3xl border-3 border-sky-400 flex flex-col items-center text-center shadow-lg hover:scale-102 transition-transform">
                    <span className="text-5xl mb-2 block animate-pulse">🃏✨</span>
                    <h4 className="font-black text-lg text-sky-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Memory Match 🃏
                    </h4>
                    <p className="text-xs text-slate-300 font-bold my-2 leading-relaxed">
                      Flip and find matching twin pairs of emojis before running out of moves!
                    </p>
                    <button
                      onClick={startMemoryGame}
                      className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs md:text-sm rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 mt-auto active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play (10 🪙)</span>
                    </button>
                  </div>

                  {/* Game 3: Bubble Pop */}
                  <div className="p-5 bg-slate-800 rounded-3xl border-3 border-pink-400 flex flex-col items-center text-center shadow-lg hover:scale-102 transition-transform">
                    <span className="text-5xl mb-2 block animate-bounce">🫧🎈</span>
                    <h4 className="font-black text-lg text-pink-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Bubble Pop Blitz 🫧
                    </h4>
                    <p className="text-xs text-slate-300 font-bold my-2 leading-relaxed">
                      Fast tapping fun! Pop rising colorful bubbles before they float away!
                    </p>
                    <button
                      onClick={startBubbleGame}
                      className="w-full py-3 bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-xs md:text-sm rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 mt-auto active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play (10 🪙)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GAME 1: CLASSIC SNAKE SCREEN */}
              {selectedGame === 'snake' && (
                <div className="w-full max-w-md flex flex-col items-center">
                  <div className="flex justify-between w-full mb-3 px-2 font-black text-xs md:text-sm text-slate-300">
                    <span className="text-emerald-400">🐍 Classic Snake</span>
                    <span className="text-amber-300">⭐ Score: {score}</span>
                  </div>

                  {!gameOver ? (
                    <div className="flex flex-col items-center w-full">
                      {/* Snake 14x14 Grid */}
                      <div className="w-72 h-72 sm:w-80 sm:h-80 bg-slate-950 rounded-2xl border-4 border-emerald-500 grid grid-cols-14 grid-rows-14 p-1 relative shadow-inner">
                        {/* Food */}
                        <div
                          className="absolute w-[6.5%] h-[6.5%] bg-rose-500 rounded-full flex items-center justify-center text-[10px] shadow-[0_0_8px_#EF4444] animate-pulse"
                          style={{
                            left: `${(food.x / GRID_SIZE) * 100}%`,
                            top: `${(food.y / GRID_SIZE) * 100}%`,
                          }}
                        >
                          🍎
                        </div>

                        {/* Snake Segments */}
                        {snake.map((seg, i) => (
                          <div
                            key={i}
                            className={`absolute w-[6.5%] h-[6.5%] rounded-md ${
                              i === 0 ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-emerald-600'
                            }`}
                            style={{
                              left: `${(seg.x / GRID_SIZE) * 100}%`,
                              top: `${(seg.y / GRID_SIZE) * 100}%`,
                            }}
                          />
                        ))}
                      </div>

                      {/* On-Screen Touch D-Pad */}
                      <div className="grid grid-cols-3 gap-2 mt-4 w-44">
                        <div />
                        <button
                          onClick={() => directionRef.current !== 'DOWN' && setDirection('UP')}
                          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl border border-slate-600 flex items-center justify-center"
                        >
                          <ArrowUp className="w-5 h-5 text-white" />
                        </button>
                        <div />
                        <button
                          onClick={() => directionRef.current !== 'RIGHT' && setDirection('LEFT')}
                          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl border border-slate-600 flex items-center justify-center"
                        >
                          <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => directionRef.current !== 'UP' && setDirection('DOWN')}
                          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl border border-slate-600 flex items-center justify-center"
                        >
                          <ArrowDown className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => directionRef.current !== 'LEFT' && setDirection('RIGHT')}
                          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl border border-slate-600 flex items-center justify-center"
                        >
                          <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-800 rounded-3xl border-3 border-amber-400 text-center w-full">
                      <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-2xl font-black text-amber-300 mb-1">Snake Adventure! 🐍</h4>
                      <p className="text-sm font-bold text-slate-300 mb-4">
                        You scored {score} points and earned bonus PolyCredits!
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

              {/* GAME 2: MEMORY MATCH SCREEN */}
              {selectedGame === 'memory' && (
                <div className="w-full max-w-md flex flex-col items-center">
                  <div className="flex justify-between w-full mb-3 px-2 font-black text-xs md:text-sm text-slate-300">
                    <span className="text-sky-400">🃏 Memory Match</span>
                    <span className="text-amber-300">⭐ Score: {score}</span>
                  </div>

                  {!gameOver ? (
                    <div className="grid grid-cols-4 gap-3 w-full bg-slate-800 p-4 rounded-3xl border-3 border-sky-400">
                      {cards.map((c) => (
                        <motion.button
                          key={c.id}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCardClick(c.id)}
                          className={`h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black cursor-pointer transition-all ${
                            c.isFlipped || c.isMatched
                              ? 'bg-sky-100 border-sky-400 text-slate-900 shadow-md rotate-0'
                              : 'bg-slate-700 border-slate-500 hover:bg-slate-600 text-slate-400 shadow-inner'
                          }`}
                        >
                          {c.isFlipped || c.isMatched ? c.icon : <HelpCircle className="w-6 h-6 text-slate-400" />}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-800 rounded-3xl border-3 border-amber-400 text-center w-full">
                      <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-2xl font-black text-amber-300 mb-1">Memory Champion! 🏆</h4>
                      <p className="text-sm font-bold text-slate-300 mb-4">
                        All pairs matched! You scored {score} points!
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

              {/* GAME 3: BUBBLE POP BLITZ SCREEN */}
              {selectedGame === 'bubble' && (
                <div className="w-full max-w-md flex flex-col items-center">
                  <div className="flex justify-between w-full mb-3 px-2 font-black text-xs md:text-sm text-slate-300">
                    <span className="text-pink-400">⏳ Time: {bubbleTime}s</span>
                    <span className="text-amber-300">⭐ Popped Score: {score}</span>
                  </div>

                  {!gameOver ? (
                    <div className="w-full h-80 bg-slate-950 rounded-3xl border-3 border-pink-400 relative overflow-hidden p-2 select-none shadow-inner">
                      {bubbles.map((b) => (
                        <motion.button
                          key={b.id}
                          initial={{ y: 300, opacity: 0.8 }}
                          animate={{ y: -40, opacity: 1 }}
                          transition={{ duration: 4.5, ease: 'linear' }}
                          onClick={() => popBubble(b.id)}
                          style={{ left: `${b.x}%` }}
                          className={`absolute w-14 h-14 rounded-full ${b.color} border-2 border-white text-2xl flex items-center justify-center cursor-pointer shadow-lg active:scale-125 transition-transform`}
                        >
                          {b.icon}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-800 rounded-3xl border-3 border-amber-400 text-center w-full">
                      <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-2xl font-black text-amber-300 mb-1">Bubble Master! 🫧</h4>
                      <p className="text-sm font-bold text-slate-300 mb-4">
                        You scored {score} points in Bubble Pop Blitz!
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
