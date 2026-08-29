import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';
import {
  Gamepad2,
  X,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  Coins,
  ArrowLeft,
  Heart,
  Zap,
  Leaf,
  FlaskConical,
  Star,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  Grid,
  Type,
  Lightbulb,
} from 'lucide-react';

interface ScienceArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME 1: SCIENCE CONNECTIONS DATA (LinkedIn / NYT Style)
// ═══════════════════════════════════════════════════════════════════════════
interface ConnectionCategory {
  category: string;
  color: string;
  borderColor: string;
  textColor: string;
  items: string[];
  explanation: string;
}

const CONNECTIONS_PUZZLES: ConnectionCategory[][] = [
  // Puzzle Set 1
  [
    {
      category: '🌿 Natural Plant Fibers',
      color: 'bg-emerald-500',
      borderColor: 'border-emerald-400',
      textColor: 'text-white',
      items: ['Cotton', 'Jute', 'Linen', 'Hemp'],
      explanation: 'All 4 come directly from living plants and are made of natural cellulose fibers!',
    },
    {
      category: '🧪 Synthetic Polymers',
      color: 'bg-sky-500',
      borderColor: 'border-sky-400',
      textColor: 'text-white',
      items: ['Polyester', 'Nylon', 'Acrylic', 'Spandex'],
      explanation: 'Man-made polymers synthesized by chemical scientists in laboratories!',
    },
    {
      category: '⚡ Electrical Conductors',
      color: 'bg-amber-500',
      borderColor: 'border-amber-400',
      textColor: 'text-slate-950',
      items: ['Copper', 'Aluminum', 'Iron', 'Gold'],
      explanation: 'Metals with free electrons that allow electricity to flow easily!',
    },
    {
      category: '🛡️ Heat & Electrical Insulators',
      color: 'bg-purple-600',
      borderColor: 'border-purple-400',
      textColor: 'text-white',
      items: ['Bakelite', 'Rubber', 'Glass', 'Wood'],
      explanation: 'Materials that resist heat and electricity to protect human fingers!',
    },
  ],
  // Puzzle Set 2
  [
    {
      category: '🐛 Animal-Derived Materials',
      color: 'bg-rose-500',
      borderColor: 'border-rose-400',
      textColor: 'text-white',
      items: ['Silk', 'Wool', 'Leather', 'Feather'],
      explanation: 'Natural protein-based materials harvested ethically from animals and insects!',
    },
    {
      category: '🫙 Molded Thermoplastics',
      color: 'bg-cyan-500',
      borderColor: 'border-cyan-400',
      textColor: 'text-slate-950',
      items: ['PET Bottle', 'PVC Pipe', 'Polythene Bag', 'Styrofoam'],
      explanation: 'Plastics that soften when heated and can be melted into new shapes!',
    },
    {
      category: '🍂 Biodegradable Nature Items',
      color: 'bg-lime-500',
      borderColor: 'border-lime-400',
      textColor: 'text-slate-950',
      items: ['Apple Core', 'Banana Peel', 'Cotton Swatch', 'Fallen Leaf'],
      explanation: 'Naturally decomposed and digested by soil microbes within 2 to 4 weeks!',
    },
    {
      category: '⏳ 500-Year Non-Biodegradables',
      color: 'bg-orange-500',
      borderColor: 'border-orange-400',
      textColor: 'text-slate-950',
      items: ['Plastic Straw', 'Nylon Net', 'Battery', 'Styrofoam Cup'],
      explanation: 'Persist in soil and oceans for hundreds of years because bacteria cannot digest them!',
    },
  ],
];

// ═══════════════════════════════════════════════════════════════════════════
// GAME 2: DAILY SCIENCE WORDLE DATA
// ═══════════════════════════════════════════════════════════════════════════
const WORDLE_WORDS = [
  { word: 'FIBER', clue: 'The tiny thread-like strand that makes up clothes and fabrics!' },
  { word: 'NYLON', clue: 'Strong synthetic fiber used for parachutes and climbing ropes!' },
  { word: 'PLANT', clue: 'Living organism that gives us cotton, wood, and natural rubber!' },
  { word: 'WATER', clue: 'Liquid tested in the raincoat and sweat absorption experiments!' },
  { word: 'RESIN', clue: 'Sticky organic or synthetic polymer used in glues and thermosets!' },
  { word: 'BRASS', clue: 'Shiny golden metal alloy made of copper and zinc!' },
  { word: 'GLASS', clue: 'Transparent insulator made by melting sand at high heat!' },
  { word: 'SOLAR', clue: 'Clean energy harvested from sunlight!' },
];

// ═══════════════════════════════════════════════════════════════════════════
// GAME 3: MOLECULE MEMORY MATCH DATA
// ═══════════════════════════════════════════════════════════════════════════
interface MemoryCardItem {
  id: number;
  pairId: string;
  title: string;
  icon: string;
  detail: string;
}

const MEMORY_PAIRS: { pairId: string; a: { title: string; icon: string; detail: string }; b: { title: string; icon: string; detail: string } }[] = [
  {
    pairId: 'cotton',
    a: { title: 'Raw Cotton', icon: '🌱', detail: 'Natural Plant Boll' },
    b: { title: 'Summer T-Shirt', icon: '👕', detail: 'Sweat Absorbing Fabric' },
  },
  {
    pairId: 'polyester',
    a: { title: 'Polyester Fiber', icon: '🧪', detail: 'Synthetic Polymer' },
    b: { title: 'Raincoat', icon: '🧥', detail: 'Waterproof Shield' },
  },
  {
    pairId: 'copper',
    a: { title: 'Copper Metal', icon: '🧱', detail: 'Electric Conductor' },
    b: { title: 'Power Cable', icon: '⚡', detail: 'Transfers Electricity' },
  },
  {
    pairId: 'nylon',
    a: { title: 'Nylon Yarn', icon: '🪢', detail: 'High Tensile Strength' },
    b: { title: 'Parachute', icon: '🪂', detail: 'Skydiving Canopy' },
  },
  {
    pairId: 'bakelite',
    a: { title: 'Bakelite Resin', icon: '🫙', detail: 'Thermoset Plastic' },
    b: { title: 'Pan Handle', icon: '🍳', detail: 'Heat Blocking Handle' },
  },
  {
    pairId: 'silk',
    a: { title: 'Silkworm Cocoon', icon: '🐛', detail: 'Natural Insect Fiber' },
    b: { title: 'Shiny Silk Scarf', icon: '🧣', detail: 'Smooth Luxurious Cloth' },
  },
];

export const ScienceArcadeModal: React.FC<ScienceArcadeModalProps> = ({ isOpen, onClose }) => {
  const credits = useProgressStore((state) => state.credits);
  const addCredits = useProgressStore((state) => state.addCredits);

  const [selectedGame, setSelectedGame] = useState<'hub' | 'connections' | 'wordle' | 'memory' | 'circuit'>('hub');

  // ─────────────────────────────────────────────────────────────────────────
  // GAME 1: SCIENCE CONNECTIONS STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [activeTiles, setActiveTiles] = useState<string[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [solvedCategories, setSolvedCategories] = useState<ConnectionCategory[]>([]);
  const [connLives, setConnLives] = useState(4);
  const [connFeedback, setConnFeedback] = useState<string | null>(null);

  const currentPuzzle = CONNECTIONS_PUZZLES[puzzleIndex % CONNECTIONS_PUZZLES.length];

  const initConnections = (idx = 0) => {
    setPuzzleIndex(idx);
    const puzzle = CONNECTIONS_PUZZLES[idx % CONNECTIONS_PUZZLES.length];
    const allItems = puzzle.flatMap((c) => c.items);
    // Shuffle tiles
    setActiveTiles(allItems.sort(() => Math.random() - 0.5));
    setSelectedTiles([]);
    setSolvedCategories([]);
    setConnLives(4);
    setConnFeedback(null);
    voiceAssistant.speak('Science Connections! Group 4 related science tiles into their matching category!');
  };

  const handleTileClick = (item: string) => {
    sounds.pop();
    if (selectedTiles.includes(item)) {
      setSelectedTiles(selectedTiles.filter((t) => t !== item));
    } else {
      if (selectedTiles.length < 4) {
        setSelectedTiles([...selectedTiles, item]);
      }
    }
  };

  const handleShuffleTiles = () => {
    sounds.pop();
    setActiveTiles([...activeTiles].sort(() => Math.random() - 0.5));
  };

  const handleDeselectAll = () => {
    sounds.pop();
    setSelectedTiles([]);
  };

  const handleSubmitConnectionGroup = () => {
    if (selectedTiles.length !== 4) return;

    // Check if selectedTiles match any unsolved category
    const matchedCategory = currentPuzzle.find((cat) => {
      if (solvedCategories.some((sc) => sc.category === cat.category)) return false;
      return cat.items.every((item) => selectedTiles.includes(item));
    });

    if (matchedCategory) {
      sounds.fanfare();
      setSolvedCategories([...solvedCategories, matchedCategory]);
      // Remove solved tiles from active tiles
      setActiveTiles(activeTiles.filter((item) => !matchedCategory.items.includes(item)));
      setSelectedTiles([]);
      setConnFeedback(`Brilliant! Found "${matchedCategory.category}"!`);
      voiceAssistant.speak(`Category solved! ${matchedCategory.category}! ${matchedCategory.explanation}`);

      if (solvedCategories.length + 1 === 4) {
        sounds.sparkle();
        addCredits(50);
        voiceAssistant.speak('Master Deduction! You solved all 4 Science Connections! +50 PolyCredits awarded!');
      }
    } else {
      sounds.boing();
      const newLives = connLives - 1;
      setConnLives(newLives);

      // Check if "One away"
      let oneAway = false;
      for (const cat of currentPuzzle) {
        const count = selectedTiles.filter((t) => cat.items.includes(t)).length;
        if (count === 3) {
          oneAway = true;
          break;
        }
      }

      if (oneAway) {
        setConnFeedback('Super close! One tile away from a match!');
      } else {
        setConnFeedback('Not quite a scientific group. Try looking at physical origins or uses!');
      }

      if (newLives <= 0) {
        sounds.boing();
        setConnFeedback('Game Over! Tap Reset to try the puzzle again!');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // GAME 2: DAILY SCIENCE WORDLE STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [wordleTargetIndex, setWordleTargetIndex] = useState(0);
  const [wordleGuesses, setWordleGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [wordleGameOver, setWordleGameOver] = useState(false);
  const [wordleWon, setWordleWon] = useState(false);

  const currentWordleObj = WORDLE_WORDS[wordleTargetIndex % WORDLE_WORDS.length];
  const targetWord = currentWordleObj.word;

  const initWordle = (idx = 0) => {
    setWordleTargetIndex(idx);
    setWordleGuesses([]);
    setCurrentGuess('');
    setWordleGameOver(false);
    setWordleWon(false);
    voiceAssistant.speak(`Daily Science Wordle! Guess the 5-letter science word in 6 tries. Clue: ${WORDLE_WORDS[idx % WORDLE_WORDS.length].clue}`);
  };

  const handleKeyInput = (char: string) => {
    if (wordleGameOver) return;
    if (char === 'ENTER') {
      if (currentGuess.length !== 5) return;
      sounds.pop();
      const newGuesses = [...wordleGuesses, currentGuess];
      setWordleGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        sounds.fanfare();
        setWordleWon(true);
        setWordleGameOver(true);
        addCredits(40);
        voiceAssistant.speak(`Incredible! You decoded the science term ${targetWord}! +40 PolyCredits awarded!`);
      } else if (newGuesses.length >= 6) {
        sounds.boing();
        setWordleGameOver(true);
        voiceAssistant.speak(`Good effort! The science word was ${targetWord}!`);
      }
    } else if (char === 'BACKSPACE') {
      sounds.pop();
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(char)) {
      sounds.pop();
      setCurrentGuess(currentGuess + char);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // GAME 3: MOLECULE MEMORY MATCH STATE
  // ─────────────────────────────────────────────────────────────────────────
  const [memoryCards, setMemoryCards] = useState<MemoryCardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    const deck: MemoryCardItem[] = [];
    MEMORY_PAIRS.forEach((pair, idx) => {
      deck.push({ id: idx * 2, pairId: pair.pairId, title: pair.a.title, icon: pair.a.icon, detail: pair.a.detail });
      deck.push({ id: idx * 2 + 1, pairId: pair.pairId, title: pair.b.title, icon: pair.b.icon, detail: pair.b.detail });
    });
    setMemoryCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMemoryMoves(0);
    voiceAssistant.speak('Molecule Match Lab! Flip cards to pair natural and synthetic materials with their real-world uses!');
  };

  const handleCardFlip = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    const card = memoryCards[index];
    if (matchedPairIds.includes(card.pairId)) return;

    sounds.pop();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const cardA = memoryCards[newFlipped[0]];
      const cardB = memoryCards[newFlipped[1]];

      if (cardA.pairId === cardB.pairId) {
        sounds.sparkle();
        setMatchedPairIds((prev) => [...prev, cardA.pairId]);
        setFlippedIndices([]);
        voiceAssistant.speak(`Pair matched! ${cardA.title} & ${cardB.title}!`);

        if (matchedPairIds.length + 1 === MEMORY_PAIRS.length) {
          sounds.fanfare();
          addCredits(30);
          voiceAssistant.speak('Outstanding! You matched all material science pairs! +30 PolyCredits awarded!');
        }
      } else {
        setTimeout(() => {
          sounds.boing();
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2.5 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Arcade Cabinet Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-slate-950 text-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-amber-400 shadow-2xl flex flex-col max-w-4xl w-full max-h-[92vh] overflow-hidden font-sans"
          >
            {/* Arcade Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 flex items-center justify-between shadow-lg shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950/30 rounded-2xl border border-white/30 backdrop-blur-xs">
                  <Gamepad2 className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      POLYQUEST SCIENCE ARCADE 🕹️
                    </h2>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-md tracking-widest hidden sm:inline">
                      FREE PLAY
                    </span>
                  </div>
                  <p className="text-xs text-amber-100 font-bold">
                    Class 5 EVS Daily Brain Puzzles & Relaxing Science Mini-Games
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-2xl border border-amber-300/40">
                  <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-mono font-black text-amber-300 text-xs sm:text-sm">
                    {credits} Credits
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Arcade Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 flex flex-col gap-6">
              {/* ══════════════════════════════════════════════════════════════
                  ARCADE HUB: GAME SELECTION SCREEN
              ══════════════════════════════════════════════════════════════ */}
              {selectedGame === 'hub' && (
                <div className="space-y-6">
                  {/* Daily Challenge Banner */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 border-2 border-violet-400 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                        🧩
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                          DAILY BRAIN PUZZLE
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          LinkedIn-Style Daily Science Connections!
                        </h3>
                        <p className="text-xs text-violet-200 font-bold">
                          Group 16 tiles into 4 hidden scientific categories!
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sounds.sparkle();
                        initConnections(0);
                        setSelectedGame('connections');
                      }}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap"
                    >
                      PLAY DAILY PUZZLE ➔
                    </button>
                  </div>

                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    CHOOSE A RELAXING SCIENCE GAME
                  </h3>

                  {/* 3 Game Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Game 1: Connections */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sounds.sparkle();
                        initConnections(0);
                        setSelectedGame('connections');
                      }}
                      className="bg-slate-900 border-3 border-emerald-400/60 hover:border-emerald-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer"
                    >
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
                          🧩
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-emerald-300">
                          1. Science Connections
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Find 4 secret science groups among 16 tiles! Relaxing, satisfying & daily new puzzles!
                        </p>
                      </div>
                      <button className="mt-4 w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5">
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY CONNECTIONS</span>
                      </button>
                    </motion.div>

                    {/* Game 2: Science Wordle */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sounds.sparkle();
                        initWordle(0);
                        setSelectedGame('wordle');
                      }}
                      className="bg-slate-900 border-3 border-amber-400/60 hover:border-amber-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer"
                    >
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                          🔤
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-amber-300">
                          2. Daily Science Wordle
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Guess the 5-letter daily science word with clues from Pip! +40 Credits on win!
                        </p>
                      </div>
                      <button className="mt-4 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5">
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY WORDLE</span>
                      </button>
                    </motion.div>

                    {/* Game 3: Memory Match */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sounds.sparkle();
                        initMemoryGame();
                        setSelectedGame('memory');
                      }}
                      className="bg-slate-900 border-3 border-sky-400/60 hover:border-sky-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer"
                    >
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl">
                          🔬
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-sky-300">
                          3. Molecule Match 3D
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Calm tactile memory cards! Match raw materials to their real-world uses with no timer stress!
                        </p>
                      </div>
                      <button className="mt-4 w-full py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5">
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY MEMORY MATCH</span>
                      </button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  GAME 1: SCIENCE CONNECTIONS VIEW (LinkedIn Style)
              ══════════════════════════════════════════════════════════════ */}
              {selectedGame === 'connections' && (
                <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-400 mr-1">Mistakes:</span>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-4 h-4 ${
                            i < connLives ? 'text-rose-500 fill-rose-500' : 'text-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => initConnections((puzzleIndex + 1) % CONNECTIONS_PUZZLES.length)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-amber-400 flex items-center gap-1 cursor-pointer"
                      title="Next Puzzle"
                    >
                      <span>Puzzle #{puzzleIndex + 1}</span>
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-300 text-center">
                    Create 4 groups of 4 items that share a scientific property! Tap 4 tiles to submit!
                  </p>

                  {/* Solved Category Cards */}
                  <div className="flex flex-col gap-2">
                    {solvedCategories.map((cat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3.5 rounded-2xl ${cat.color} ${cat.textColor} text-center shadow-md border-2 ${cat.borderColor}`}
                      >
                        <h5 className="font-black text-sm uppercase tracking-wide">
                          {cat.category}
                        </h5>
                        <p className="text-xs font-bold opacity-90 mt-0.5">
                          {cat.items.join(', ')}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Active Grid Tiles */}
                  {activeTiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {activeTiles.map((tile) => {
                        const isSelected = selectedTiles.includes(tile);
                        return (
                          <motion.button
                            key={tile}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTileClick(tile)}
                            className={`p-3 sm:p-4 rounded-2xl font-black text-xs sm:text-sm text-center border-2 transition-all cursor-pointer shadow-md flex items-center justify-center min-h-[64px] ${
                              isSelected
                                ? 'bg-amber-400 border-amber-300 text-slate-950 scale-102 shadow-amber-400/30'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                            }`}
                          >
                            <span>{tile}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Feedback Banner */}
                  {connFeedback && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-center text-amber-300">
                      {connFeedback}
                    </div>
                  )}

                  {/* Action Controls */}
                  {activeTiles.length > 0 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleShuffleTiles}
                        className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-slate-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Shuffle className="w-3.5 h-3.5" /> Shuffle
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        disabled={selectedTiles.length === 0}
                        className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-black text-slate-300 cursor-pointer"
                      >
                        Deselect All
                      </button>
                      <button
                        onClick={handleSubmitConnectionGroup}
                        disabled={selectedTiles.length !== 4 || connLives <= 0}
                        className="px-6 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
                      >
                        Submit Group (4)
                      </button>
                    </div>
                  )}

                  {/* Victory Banner */}
                  {solvedCategories.length === 4 && (
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center flex flex-col items-center gap-2 shadow-xl animate-fade-in">
                      <Trophy className="w-8 h-8 text-amber-300" />
                      <h4 className="text-lg font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Connections Solved! 🏆
                      </h4>
                      <p className="text-xs font-bold text-emerald-100">
                        You grouped all 4 science categories perfectly! +50 PolyCredits added!
                      </p>
                      <button
                        onClick={() => initConnections((puzzleIndex + 1) % CONNECTIONS_PUZZLES.length)}
                        className="mt-2 px-5 py-2 rounded-2xl bg-white text-emerald-950 font-black text-xs cursor-pointer shadow-md"
                      >
                        Play Next Puzzle ➔
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  GAME 2: DAILY SCIENCE WORDLE VIEW
              ══════════════════════════════════════════════════════════════ */}
              {selectedGame === 'wordle' && (
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto w-full">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between w-full bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <span className="text-xs font-black text-amber-400">
                      Word #{wordleTargetIndex + 1}
                    </span>

                    <button
                      onClick={() => initWordle((wordleTargetIndex + 1) % WORDLE_WORDS.length)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                      title="Next Word"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pip Clue Banner */}
                  <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-xs font-bold text-amber-300 flex items-center gap-2 w-full">
                    <span className="text-base">💡</span>
                    <span><strong>Pip's Clue:</strong> {currentWordleObj.clue}</span>
                  </div>

                  {/* 6x5 Letter Grid */}
                  <div className="grid grid-rows-6 gap-2 w-full max-w-[280px]">
                    {Array.from({ length: 6 }).map((_, rowIdx) => {
                      const guess = wordleGuesses[rowIdx] || (rowIdx === wordleGuesses.length ? currentGuess : '');
                      return (
                        <div key={rowIdx} className="grid grid-cols-5 gap-2">
                          {Array.from({ length: 5 }).map((_, colIdx) => {
                            const char = guess[colIdx] || '';
                            const isSubmitted = rowIdx < wordleGuesses.length;

                            let bgClass = 'bg-slate-900 border-slate-700 text-white';
                            if (isSubmitted) {
                              if (targetWord[colIdx] === char) {
                                bgClass = 'bg-emerald-500 border-emerald-400 text-white';
                              } else if (targetWord.includes(char)) {
                                bgClass = 'bg-amber-500 border-amber-400 text-slate-950';
                              } else {
                                bgClass = 'bg-slate-800 border-slate-700 text-slate-400';
                              }
                            }

                            return (
                              <div
                                key={colIdx}
                                className={`w-12 h-12 rounded-xl border-2 font-mono font-black text-xl flex items-center justify-center shadow-md transition-all ${bgClass}`}
                              >
                                {char}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Result Banner */}
                  {wordleWon && (
                    <div className="p-4 rounded-2xl bg-emerald-500 text-white text-center font-black text-xs w-full shadow-lg">
                      🎉 Brilliant Deduction! You decoded {targetWord}! +40 PolyCredits awarded!
                    </div>
                  )}

                  {wordleGameOver && !wordleWon && (
                    <div className="p-4 rounded-2xl bg-rose-500 text-white text-center font-black text-xs w-full shadow-lg">
                      The word was {targetWord}! Tap reset to try the next word!
                    </div>
                  )}

                  {/* Virtual Keyboard */}
                  <div className="flex flex-col gap-1.5 w-full max-w-sm pt-2">
                    {[
                      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="flex justify-center gap-1">
                        {row.map((k) => (
                          <button
                            key={k}
                            onClick={() => handleKeyInput(k)}
                            className={`py-3 rounded-xl font-mono font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
                              k === 'ENTER' || k === 'BACKSPACE'
                                ? 'px-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400'
                                : 'px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
                            }`}
                          >
                            {k === 'BACKSPACE' ? '⌫' : k}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  GAME 3: MOLECULE MEMORY MATCH VIEW
              ══════════════════════════════════════════════════════════════ */}
              {selectedGame === 'memory' && (
                <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-black text-sky-400">
                        Moves: {memoryMoves}
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-400">
                        Pairs: {matchedPairIds.length} / {MEMORY_PAIRS.length}
                      </span>
                    </div>

                    <button
                      onClick={initMemoryGame}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {memoryCards.map((card, idx) => {
                      const isFlipped = flippedIndices.includes(idx);
                      const isMatched = matchedPairIds.includes(card.pairId);

                      return (
                        <motion.div
                          key={card.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCardFlip(idx)}
                          className={`aspect-[4/5] rounded-2xl border-2 flex flex-col items-center justify-center p-3 text-center cursor-pointer shadow-lg transition-all ${
                            isMatched
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 opacity-80'
                              : isFlipped
                              ? 'bg-slate-800 border-sky-400 text-white'
                              : 'bg-gradient-to-br from-slate-900 to-indigo-950 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {isFlipped || isMatched ? (
                            <div className="flex flex-col items-center gap-1.5 animate-fade-in">
                              <span className="text-3xl">{card.icon}</span>
                              <h5 className="text-xs font-black text-white leading-tight">
                                {card.title}
                              </h5>
                              <span className="text-[10px] font-bold text-sky-300">
                                {card.detail}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-2xl opacity-60">🔬</span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                FLIP
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Victory Card */}
                  {matchedPairIds.length === MEMORY_PAIRS.length && (
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-center flex flex-col items-center gap-2 shadow-xl animate-fade-in">
                      <Trophy className="w-8 h-8 text-amber-300" />
                      <h4 className="text-lg font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Memory Lab Mastered! 🏆
                      </h4>
                      <p className="text-xs font-bold text-sky-100">
                        You matched all material pairs in {memoryMoves} moves! +30 PolyCredits awarded!
                      </p>
                      <button
                        onClick={initMemoryGame}
                        className="mt-2 px-5 py-2 rounded-2xl bg-white text-indigo-950 font-black text-xs cursor-pointer shadow-md"
                      >
                        Play Again ➔
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
