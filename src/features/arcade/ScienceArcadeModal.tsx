import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  Heart,
  Zap,
  Leaf,
  FlaskConical,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  Award,
  Volume2,
} from 'lucide-react';

interface ScienceArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Game 1 Falling Specimen Types ──
interface FallingItem {
  id: number;
  name: string;
  category: 'natural' | 'synthetic';
  icon: string;
  color: string;
  x: number; // percentage across lane (20% or 80%)
  y: number; // current y percentage 0 to 100%
  speed: number;
  isPowerup?: boolean;
  powerupType?: 'slow' | 'magnet' | 'double';
}

const SPECIMEN_POOL = [
  { name: 'Cotton Boll', category: 'natural' as const, icon: '🌿', color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { name: 'Sheep Wool', category: 'natural' as const, icon: '🐑', color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { name: 'Silk Cocoon', category: 'natural' as const, icon: '🐛', color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { name: 'Tree Wood', category: 'natural' as const, icon: '🪵', color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { name: 'Natural Latex', category: 'natural' as const, icon: '💧', color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { name: 'Nylon Rope', category: 'synthetic' as const, icon: '🧵', color: 'bg-sky-100 border-sky-400 text-sky-950' },
  { name: 'PET Bottle', category: 'synthetic' as const, icon: '🫙', color: 'bg-sky-100 border-sky-400 text-sky-950' },
  { name: 'PVC Wire Sleeve', category: 'synthetic' as const, icon: '⚡', color: 'bg-sky-100 border-sky-400 text-sky-950' },
  { name: 'Bakelite Handle', category: 'synthetic' as const, icon: '🍳', color: 'bg-sky-100 border-sky-400 text-sky-950' },
  { name: 'Epoxy Resin', category: 'synthetic' as const, icon: '🧪', color: 'bg-sky-100 border-sky-400 text-sky-950' },
];

export const ScienceArcadeModal: React.FC<ScienceArcadeModalProps> = ({ isOpen, onClose }) => {
  const credits = useProgressStore((state) => state.credits);
  const addCredits = useProgressStore((state) => state.addCredits);

  const [selectedGame, setSelectedGame] = useState<'hub' | 'sort-rush' | 'memory-lab' | 'circuit-run'>('hub');
  const [highScores, setHighScores] = useState<Record<string, number>>({
    'sort-rush': 180,
    'memory-lab': 350,
    'circuit-run': 240,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME 1: SORT-O-MATIC RUSH (High-Speed Conveyor Sorting Blitz)
  // ═══════════════════════════════════════════════════════════════════════════
  const [sortScore, setSortScore] = useState(0);
  const [sortLives, setSortLives] = useState(3);
  const [sortStreak, setSortStreak] = useState(0);
  const [sortGameOver, setSortGameOver] = useState(false);
  const [bucketPos, setBucketPos] = useState<'left' | 'right'>('left'); // left = Nature, right = Synthetic
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [floatingPops, setFloatingPops] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [activePowerup, setActivePowerup] = useState<'none' | 'slow' | 'magnet' | 'double'>('none');
  const powerupTimerRef = useRef<number | null>(null);

  const startSortRush = () => {
    sounds.success();
    setSelectedGame('sort-rush');
    setSortScore(0);
    setSortLives(3);
    setSortStreak(0);
    setSortGameOver(false);
    setBucketPos('left');
    setFallingItems([]);
    setFloatingPops([]);
    setActivePowerup('none');
    voiceAssistant.speak('Sort-o-Matic Rush! Catch natural items in the Nature Oasis Bin and synthetics in the Lab Bin!');
  };

  // Sort-o-matic Game Loop
  useEffect(() => {
    if (selectedGame !== 'sort-rush' || sortGameOver) return;

    // Spawn interval
    const spawnTimer = setInterval(() => {
      setFallingItems((prev) => {
        if (prev.length >= 4) return prev;
        const template = SPECIMEN_POOL[Math.floor(Math.random() * SPECIMEN_POOL.length)];
        const isPowerupSpawn = Math.random() < 0.15;
        const powerTypes: ('slow' | 'magnet' | 'double')[] = ['slow', 'magnet', 'double'];
        const pType = powerTypes[Math.floor(Math.random() * powerTypes.length)];

        const newItem: FallingItem = {
          id: Date.now() + Math.random(),
          name: isPowerupSpawn ? `Power-up: ${pType.toUpperCase()}` : template.name,
          category: template.category,
          icon: isPowerupSpawn ? (pType === 'slow' ? '⏱️' : pType === 'magnet' ? '🧲' : '⭐') : template.icon,
          color: isPowerupSpawn ? 'bg-amber-200 border-amber-500 text-amber-950 font-black' : template.color,
          x: Math.random() < 0.5 ? 28 : 72,
          y: 0,
          speed: activePowerup === 'slow' ? 0.7 : 1.2 + Math.min(sortScore / 100, 1.8),
          isPowerup: isPowerupSpawn,
          powerupType: isPowerupSpawn ? pType : undefined,
        };
        return [...prev, newItem];
      });
    }, 1200);

    // Fall tick interval (60fps)
    const moveTimer = setInterval(() => {
      setFallingItems((prev) => {
        const nextItems: FallingItem[] = [];

        for (const item of prev) {
          const newY = item.y + item.speed;

          // Catch collision check at bottom (y >= 80% to 92%)
          if (newY >= 80 && newY <= 92) {
            const isNatureBucket = bucketPos === 'left';
            const isSyntheticBucket = bucketPos === 'right';

            let isCorrect = false;
            if (activePowerup === 'magnet') {
              isCorrect = true;
            } else if (item.isPowerup) {
              isCorrect = (item.x < 50 && isNatureBucket) || (item.x >= 50 && isSyntheticBucket);
            } else {
              if (item.category === 'natural' && isNatureBucket) isCorrect = true;
              if (item.category === 'synthetic' && isSyntheticBucket) isCorrect = true;
            }

            if (isCorrect) {
              if (item.isPowerup && item.powerupType) {
                sounds.sparkle();
                setActivePowerup(item.powerupType);
                if (powerupTimerRef.current) clearTimeout(powerupTimerRef.current);
                powerupTimerRef.current = window.setTimeout(() => setActivePowerup('none'), 5000);
              } else {
                sounds.pop();
              }

              const pts = (activePowerup === 'double' ? 20 : 10) + sortStreak * 2;
              setSortScore((s) => {
                const ns = s + pts;
                if (ns > (highScores['sort-rush'] || 0)) {
                  setHighScores((h) => ({ ...h, 'sort-rush': ns }));
                }
                return ns;
              });
              setSortStreak((st) => st + 1);

              // Floating pop
              setFloatingPops((fp) => [
                ...fp,
                { id: Date.now(), text: `+${pts} ${item.name}!`, x: item.x, y: 75 },
              ]);
              continue; // Item collected
            }
          }

          // Missed item dropped off bottom
          if (newY > 96) {
            if (!item.isPowerup) {
              sounds.boing();
              setSortStreak(0);
              setSortLives((l) => {
                const nextL = l - 1;
                if (nextL <= 0) {
                  setSortGameOver(true);
                  const reward = Math.max(10, Math.floor(sortScore / 5));
                  addCredits(reward);
                  sounds.fanfare();
                  voiceAssistant.speak(`Great run! You scored ${sortScore} points and earned ${reward} PolyCredits!`);
                }
                return Math.max(0, nextL);
              });
            }
            continue; // Item dropped
          }

          nextItems.push({ ...item, y: newY });
        }
        return nextItems;
      });
    }, 35);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setBucketPos('left');
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setBucketPos('right');
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(moveTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGame, sortGameOver, bucketPos, sortStreak, sortScore, activePowerup]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME 2: MOLECULE MATCH & LINK (3D Memory Lab)
  // ═══════════════════════════════════════════════════════════════════════════
  interface MemoryCard {
    id: number;
    pairId: string;
    name: string;
    category: 'Natural' | 'Synthetic';
    icon: string;
    fact: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const MEMORY_DATA = [
    { pairId: 'cotton', name: 'Cotton Boll', category: 'Natural' as const, icon: '🌿', fact: 'Plant cellulose, super breathable!' },
    { pairId: 'wool', name: 'Sheep Wool', category: 'Natural' as const, icon: '🐑', fact: 'Natural protein fibre, traps warm air!' },
    { pairId: 'silk', name: 'Silkworm Silk', category: 'Natural' as const, icon: '🐛', fact: 'Spun from cocoons, shimmering lustre!' },
    { pairId: 'nylon', name: 'Nylon Cord', category: 'Synthetic' as const, icon: '💪', fact: 'Strongest synthetic fibre, holds 55kg!' },
    { pairId: 'pet', name: 'PET Bottle', category: 'Synthetic' as const, icon: '🫙', fact: 'Petrochemical polymer, shatterproof!' },
    { pairId: 'rubber', name: 'Vulcanized Tire', category: 'Synthetic' as const, icon: '🛞', fact: 'Heat-resistant rubber with sulfur bonds!' },
  ];

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryFactPopup, setMemoryFactPopup] = useState<string | null>(null);
  const [memoryGameOver, setMemoryGameOver] = useState(false);

  const startMemoryGame = () => {
    sounds.success();
    setSelectedGame('memory-lab');
    setMemoryMoves(0);
    setMemoryMatches(0);
    setMemoryGameOver(false);
    setSelectedCards([]);
    setMemoryFactPopup(null);

    // Duplicate and shuffle
    const deck: MemoryCard[] = [];
    let idCounter = 0;
    for (const item of MEMORY_DATA) {
      deck.push({ id: idCounter++, ...item, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, ...item, isFlipped: false, isMatched: false });
    }
    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setMemoryCards(deck);
    voiceAssistant.speak('Molecule Match Lab! Flip cards to link matching natural and synthetic material pairs!');
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length >= 2) return;
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    sounds.pop();
    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    setMemoryCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (newSelected.length === 2) {
      setMemoryMoves((m) => m + 1);
      const card1 = memoryCards.find((c) => c.id === newSelected[0])!;
      const card2 = card;

      if (card1.pairId === card2.pairId) {
        sounds.sparkle();
        setMemoryFactPopup(`🎉 Linked ${card1.name} (${card1.category})! ${card1.fact}`);
        setMemoryMatches((m) => {
          const nextM = m + 1;
          if (nextM === MEMORY_DATA.length) {
            setMemoryGameOver(true);
            const scoreCalc = Math.max(100, 500 - (memoryMoves + 1) * 20);
            addCredits(30);
            if (scoreCalc > (highScores['memory-lab'] || 0)) {
              setHighScores((h) => ({ ...h, 'memory-lab': scoreCalc }));
            }
            sounds.fanfare();
            voiceAssistant.speak(`Spectacular memory! You linked all specimen pairs and earned 30 PolyCredits!`);
          }
          return nextM;
        });

        setMemoryCards((prev) =>
          prev.map((c) =>
            c.id === newSelected[0] || c.id === newSelected[1]
              ? { ...c, isMatched: true }
              : c
          )
        );
        setSelectedCards([]);
      } else {
        sounds.boing();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === newSelected[0] || c.id === newSelected[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME 3: CIRCUIT CONDUCTOR SPARK RUN (Electrical Grid Lab)
  // ═══════════════════════════════════════════════════════════════════════════
  interface CircuitTile {
    id: number;
    type: 'wire' | 'insulator' | 'empty' | 'battery' | 'bulb';
    label: string;
    isPowered: boolean;
  }

  const [circuitGrid, setCircuitGrid] = useState<CircuitTile[]>([
    { id: 0, type: 'battery', label: '12V Battery 🔋', isPowered: true },
    { id: 1, type: 'empty', label: 'Slot A', isPowered: false },
    { id: 2, type: 'empty', label: 'Slot B', isPowered: false },
    { id: 3, type: 'bulb', label: 'Mega Lightbulb 💡', isPowered: false },
  ]);
  const [circuitInventory, setCircuitInventory] = useState<('copper' | 'rubber' | 'steel')[]>([
    'copper',
    'rubber',
    'steel',
  ]);
  const [circuitTimer, setCircuitTimer] = useState(25);
  const [circuitScore, setCircuitScore] = useState(0);
  const [circuitLevel, setCircuitLevel] = useState(1);
  const [circuitWon, setCircuitWon] = useState(false);

  const startCircuitRun = () => {
    sounds.success();
    setSelectedGame('circuit-run');
    setCircuitScore(0);
    setCircuitLevel(1);
    setCircuitTimer(25);
    setCircuitWon(false);
    setCircuitGrid([
      { id: 0, type: 'battery', label: '12V Battery 🔋', isPowered: true },
      { id: 1, type: 'empty', label: 'Slot A', isPowered: false },
      { id: 2, type: 'empty', label: 'Slot B', isPowered: false },
      { id: 3, type: 'bulb', label: 'Mega Lightbulb 💡', isPowered: false },
    ]);
    voiceAssistant.speak('Circuit Spark Run! Place conductive copper or steel bridges to light up the Mega Lightbulb!');
  };

  const handlePlaceMaterial = (slotId: number, mat: 'copper' | 'rubber' | 'steel') => {
    sounds.pop();
    setCircuitGrid((prev) => {
      const updated = prev.map((t) => {
        if (t.id === slotId) {
          const isConductor = mat === 'copper' || mat === 'steel';
          return {
            ...t,
            type: (isConductor ? 'wire' : 'insulator') as 'wire' | 'insulator',
            label: mat === 'copper' ? '⚡ Copper Wire' : mat === 'steel' ? '⚡ Steel Key' : '🛡️ Rubber Insulator',
            isPowered: isConductor,
          };
        }
        return t;
      });

      // Check if path from battery (0) to bulb (3) is fully powered
      const slotA = updated.find((t) => t.id === 1);
      const slotB = updated.find((t) => t.id === 2);
      const isConnected = slotA?.type === 'wire' && slotB?.type === 'wire';

      if (isConnected) {
        sounds.sparkle();
        sounds.fanfare();
        setCircuitWon(true);
        const pts = 150 + circuitTimer * 5;
        setCircuitScore((s) => s + pts);
        addCredits(25);
        if (pts > (highScores['circuit-run'] || 0)) {
          setHighScores((h) => ({ ...h, 'circuit-run': pts }));
        }
        voiceAssistant.speak('Brilliant circuit engineering! Copper and steel conduct electric current straight to the lightbulb!');
        return updated.map((t) => (t.id === 3 ? { ...t, isPowered: true } : t));
      }
      return updated;
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Arcade Cabinet Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-slate-900 text-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-amber-400 shadow-2xl flex flex-col max-w-4xl w-full max-h-[92vh] overflow-hidden font-sans"
          >
            {/* Arcade Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 flex items-center justify-between shadow-lg">
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
                    Class 5 EVS Interactive Mini-Games & Science Simulators
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
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Arcade Main Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 relative">
              {/* ═══════════════════════════════════════════════════════════════════
                  ARCADE HUB: GAME SELECTOR
              ═══════════════════════════════════════════════════════════════════ */}
              {selectedGame === 'hub' && (
                <div className="flex flex-col gap-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                      Select A Challenge
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Test Your Science Mastery & Reflexes!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-bold">
                      Earn high scores, unlock PolyCredits, and practice material physics in these fast-paced games!
                    </p>
                  </div>

                  {/* 3 Game Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Game 1 */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-slate-900 border-3 border-emerald-400/60 hover:border-emerald-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden group"
                      onClick={startSortRush}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
                            🌿⚡
                          </div>
                          <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                            High: {highScores['sort-rush']} pts
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                          1. Sort-o-Matic Rush
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Conveyor sorting blitz! Catch natural items in the Nature Oasis Bin & synthetics in the Lab Bin!
                        </p>
                      </div>

                      <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>PLAY SORT RUSH</span>
                      </button>
                    </motion.div>

                    {/* Game 2 */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-slate-900 border-3 border-sky-400/60 hover:border-sky-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden group"
                      onClick={startMemoryGame}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl">
                            🔬✨
                          </div>
                          <span className="text-[11px] font-black text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-500/30">
                            High: {highScores['memory-lab']} pts
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-sky-300 transition-colors">
                          2. Molecule Match Lab
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Tactile 3D memory card flip! Pair natural fibers, synthetic polymers & discover real science facts!
                        </p>
                      </div>

                      <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>PLAY MEMORY MATCH</span>
                      </button>
                    </motion.div>

                    {/* Game 3 */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-slate-900 border-3 border-amber-400/60 hover:border-amber-400 rounded-3xl p-5 flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden group"
                      onClick={startCircuitRun}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                            ⚡💡
                          </div>
                          <span className="text-[11px] font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                            High: {highScores['circuit-run']} pts
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                          3. Circuit Spark Run
                        </h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                          Guide electrical voltage! Connect copper conductors while shielding hazards with rubber insulators!
                        </p>
                      </div>

                      <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>PLAY CIRCUIT RUN</span>
                      </button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════════
                  GAME 1: SORT-O-MATIC RUSH VIEW
              ═══════════════════════════════════════════════════════════════════ */}
              {selectedGame === 'sort-rush' && (
                <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
                  {/* Top Game Status Row */}
                  <div className="flex items-center justify-between w-full bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-5 h-5 ${
                            i < sortLives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-black text-sm">
                        SCORE: {sortScore}
                      </span>
                      {sortStreak >= 3 && (
                        <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-md animate-bounce">
                          {sortStreak}x STREAK! 🔥
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Power-up Pill */}
                  {activePowerup !== 'none' && (
                    <div className="px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 animate-pulse shadow-md">
                      <Sparkles className="w-4 h-4" />
                      <span>POWER-UP: {activePowerup.toUpperCase()} ACTIVE!</span>
                    </div>
                  )}

                  {/* Conveyor Canvas Area */}
                  <div className="w-full h-80 bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-800 rounded-3xl relative overflow-hidden shadow-inner">
                    {/* Left & Right Target Zones Indicator */}
                    <div className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-dashed border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between p-3 pointer-events-none">
                      <span className="text-[10px] font-black text-emerald-400 uppercase">🌿 NATURE OASIS</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-sky-950/10 flex flex-col justify-between p-3 items-end pointer-events-none">
                      <span className="text-[10px] font-black text-sky-400 uppercase">🧪 SYNTHETIC LAB</span>
                    </div>

                    {/* Falling Items */}
                    {fallingItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className={`absolute px-3 py-1.5 rounded-2xl border-2 shadow-lg flex items-center gap-1.5 -translate-x-1/2 ${item.color}`}
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                        }}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-black">{item.name}</span>
                      </motion.div>
                    ))}

                    {/* Floating Text Particles */}
                    {floatingPops.map((pop) => (
                      <motion.div
                        key={pop.id}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8 }}
                        className="absolute text-amber-300 font-black text-xs font-mono pointer-events-none"
                        style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
                      >
                        {pop.text}
                      </motion.div>
                    ))}

                    {/* Player's Catcher Bucket at Bottom */}
                    <motion.div
                      animate={{ x: bucketPos === 'left' ? '25%' : '75%' }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute bottom-2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 font-black text-xs"
                    >
                      <Pip size="sm" mood="curious" />
                      <span>{bucketPos === 'left' ? '🌿 NATURE BIN' : '🧪 LAB BIN'}</span>
                    </motion.div>
                  </div>

                  {/* Mobile / Screen Control Buttons */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => {
                        sounds.pop();
                        setBucketPos('left');
                      }}
                      className={`p-4 rounded-2xl border-3 flex items-center justify-center gap-2 font-black text-sm cursor-pointer transition-all ${
                        bucketPos === 'left'
                          ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-lg scale-102'
                          : 'bg-slate-900 border-slate-700 text-emerald-400'
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[3]" />
                      <span>LEFT: NATURE BIN 🌿</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.pop();
                        setBucketPos('right');
                      }}
                      className={`p-4 rounded-2xl border-3 flex items-center justify-center gap-2 font-black text-sm cursor-pointer transition-all ${
                        bucketPos === 'right'
                          ? 'bg-sky-500 border-sky-300 text-slate-950 shadow-lg scale-102'
                          : 'bg-slate-900 border-slate-700 text-sky-400'
                      }`}
                    >
                      <span>RIGHT: LAB BIN 🧪</span>
                      <ArrowRight className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>

                  {/* Game Over Modal Screen */}
                  {sortGameOver && (
                    <div className="p-6 bg-slate-900 border-4 border-amber-400 rounded-3xl w-full text-center space-y-3 mt-2 shadow-2xl">
                      <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                      <h3 className="text-2xl font-black text-white">CONVEYOR RUN COMPLETE!</h3>
                      <p className="text-xs font-bold text-slate-300">
                        Final Score: <span className="font-mono text-amber-400 text-base">{sortScore}</span> • High Score: <span className="font-mono text-emerald-400 text-base">{highScores['sort-rush']}</span>
                      </p>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={startSortRush}
                          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <RotateCcw className="w-4 h-4" /> PLAY AGAIN
                        </button>
                        <button
                          onClick={() => setSelectedGame('hub')}
                          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl cursor-pointer"
                        >
                          ARCADE MENU
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════════
                  GAME 2: MOLECULE MATCH LAB VIEW
              ═══════════════════════════════════════════════════════════════════ */}
              {selectedGame === 'memory-lab' && (
                <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
                  {/* Top Status */}
                  <div className="flex items-center justify-between w-full bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400">
                        MOVES: <span className="text-white font-mono">{memoryMoves}</span>
                      </span>
                      <span className="text-xs font-black text-amber-400">
                        MATCHES: <span className="font-mono">{memoryMatches} / {MEMORY_DATA.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Fact Popup Banner */}
                  {memoryFactPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 rounded-2xl text-xs font-black text-center w-full shadow-md"
                    >
                      {memoryFactPopup}
                    </motion.div>
                  )}

                  {/* 3D Card Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
                    {memoryCards.map((card) => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                        whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                        onClick={() => handleCardClick(card.id)}
                        className={`h-28 rounded-2xl border-3 flex flex-col items-center justify-center p-2 cursor-pointer transition-all text-center relative ${
                          card.isMatched
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 opacity-90'
                            : card.isFlipped
                            ? 'bg-slate-800 border-amber-400 text-white shadow-xl'
                            : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500 text-slate-500'
                        }`}
                      >
                        {card.isFlipped || card.isMatched ? (
                          <>
                            <span className="text-2xl mb-1">{card.icon}</span>
                            <span className="text-xs font-black leading-tight text-white">{card.name}</span>
                            <span className="text-[9px] font-black text-amber-400 uppercase mt-0.5">
                              {card.category}
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6 text-slate-600 mb-1" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              FLIP
                            </span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Victory Banner */}
                  {memoryGameOver && (
                    <div className="p-6 bg-slate-900 border-4 border-emerald-400 rounded-3xl w-full text-center space-y-3 mt-2 shadow-2xl">
                      <Trophy className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                      <h3 className="text-2xl font-black text-white">ALL SPECIMENS LINKED! 🎉</h3>
                      <p className="text-xs font-bold text-slate-300">
                        Completed in <span className="font-mono text-amber-400 text-base">{memoryMoves} moves</span>! +30 PolyCredits Earned!
                      </p>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={startMemoryGame}
                          className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <RotateCcw className="w-4 h-4" /> PLAY AGAIN
                        </button>
                        <button
                          onClick={() => setSelectedGame('hub')}
                          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl cursor-pointer"
                        >
                          ARCADE MENU
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════════
                  GAME 3: CIRCUIT SPARK RUN VIEW
              ═══════════════════════════════════════════════════════════════════ */}
              {selectedGame === 'circuit-run' && (
                <div className="flex flex-col items-center gap-5 max-w-xl mx-auto">
                  {/* Top Status */}
                  <div className="flex items-center justify-between w-full bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedGame('hub')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <span className="font-mono text-amber-400 font-black text-sm">
                      VOLTAGE: {circuitWon ? '12.0V (CLOSED)' : '0.0V (OPEN)'}
                    </span>
                  </div>

                  {/* Circuit Board Arena */}
                  <div className="w-full p-6 bg-slate-900 border-4 border-amber-400/80 rounded-3xl flex flex-col items-center gap-6 shadow-2xl">
                    <div className="flex items-center justify-between w-full gap-2">
                      {circuitGrid.map((tile) => (
                        <div
                          key={tile.id}
                          className={`flex-1 p-3 rounded-2xl border-2 flex flex-col items-center text-center justify-center h-28 transition-all ${
                            tile.isPowered
                              ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] text-amber-200'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          <span className="text-xl mb-1">
                            {tile.type === 'battery' ? '🔋' : tile.type === 'bulb' ? (tile.isPowered ? '💡✨' : '💡') : tile.type === 'wire' ? '⚡' : tile.type === 'insulator' ? '🛡️' : '❓'}
                          </span>
                          <span className="text-[11px] font-black">{tile.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bridge Placement Palette */}
                    {!circuitWon && (
                      <div className="w-full space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs font-black text-slate-300 block text-center">
                          Choose Conductor to bridge Slot A & Slot B:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => {
                              handlePlaceMaterial(1, 'copper');
                              setTimeout(() => handlePlaceMaterial(2, 'copper'), 400);
                            }}
                            className="p-3 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-400 rounded-xl text-amber-200 font-black text-xs flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span className="text-lg">⚡</span>
                            <span>Copper Wire</span>
                          </button>

                          <button
                            onClick={() => {
                              handlePlaceMaterial(1, 'steel');
                              setTimeout(() => handlePlaceMaterial(2, 'steel'), 400);
                            }}
                            className="p-3 bg-sky-500/20 hover:bg-sky-500/30 border-2 border-sky-400 rounded-xl text-sky-200 font-black text-xs flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span className="text-lg">🔑</span>
                            <span>Steel Key</span>
                          </button>

                          <button
                            onClick={() => handlePlaceMaterial(1, 'rubber')}
                            className="p-3 bg-rose-500/20 hover:bg-rose-500/30 border-2 border-rose-400 rounded-xl text-rose-200 font-black text-xs flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span className="text-lg">🛡️</span>
                            <span>Rubber Block</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Circuit Complete Celebration */}
                    {circuitWon && (
                      <div className="w-full p-4 bg-amber-400/20 border-2 border-amber-400 rounded-2xl text-center space-y-2 animate-pulse">
                        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                        <h4 className="text-lg font-black text-amber-300">CIRCUIT POWERED! 💡⚡</h4>
                        <p className="text-xs text-slate-300 font-bold">
                          Free electrons flow through copper conductors to complete the loop! +25 PolyCredits!
                        </p>
                        <div className="flex gap-2 justify-center pt-2">
                          <button
                            onClick={startCircuitRun}
                            className="px-5 py-2 bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                          >
                            RUN AGAIN
                          </button>
                          <button
                            onClick={() => setSelectedGame('hub')}
                            className="px-5 py-2 bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer"
                          >
                            ARCADE MENU
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
