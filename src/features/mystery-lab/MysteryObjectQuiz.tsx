import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useProgressStore } from '@/stores/progressStore';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Search,
  Zap,
  Award,
  Layers,
  Flame,
  Droplet,
  Shield,
  Coins,
} from 'lucide-react';

interface MysterySpecimen {
  id: string;
  name: string;
  icon: string;
  category: 'clothing' | 'tools' | 'home' | 'nature';
  properties: string[];
  options: string[];
  correctMaterial: string;
  classification: 'Natural' | 'Synthetic';
  rightExplanation: string;
  wrongExplanation: string;
}

const MYSTERY_SPECIMENS: MysterySpecimen[] = [
  {
    id: 'raincoat',
    name: 'Yellow Storm Raincoat',
    icon: '🧥',
    category: 'clothing',
    properties: ['💧 100% Waterproof', '🪶 Lightweight', '💨 Wind-Resistant', '☀️ Dries Fast'],
    options: ['Polyester Plastic', 'Natural Cotton', 'Tree Wood', 'Pure Gold'],
    correctMaterial: 'Polyester Plastic',
    classification: 'Synthetic',
    rightExplanation: 'Spot on! Polyester is a synthetic polymer created by chemists from petroleum chemicals. Its hydrophobic weave makes rain bead up and slide off!',
    wrongExplanation: 'Not quite! Natural cotton or wood absorbs water. Raincoats are made from synthetic Polyester plastic so water never soaks through!',
  },
  {
    id: 'tshirt',
    name: 'Summer Graphic T-Shirt',
    icon: '👕',
    category: 'clothing',
    properties: ['☁️ Super Soft', '🌬️ Highly Breathable', '🧽 Absorbs Sweat', '🌱 Plant-Grown'],
    options: ['Natural Cotton', 'Synthetic Nylon', 'Polyester', 'Aluminium'],
    correctMaterial: 'Natural Cotton',
    classification: 'Natural',
    rightExplanation: 'Awesome! Cotton is a natural plant fiber harvested from fluffy white cotton bolls in fields. It is gentle, soft, and breathable for skin!',
    wrongExplanation: 'Cotton is harvested naturally from plants! Synthetic fibers like nylon feel less breathable on hot sunny days.',
  },
  {
    id: 'rope',
    name: 'Mountain Climbing Rope',
    icon: '🪢',
    category: 'tools',
    properties: ['💪 Extreme Tensile Strength', '⚡ Elastic Stretch', '🏔️ Weatherproof', '🛡️ Abrasion-Resistant'],
    options: ['Synthetic Nylon', 'Cotton Yarn', 'Dry Grass', 'Glass Fibres'],
    correctMaterial: 'Synthetic Nylon',
    classification: 'Synthetic',
    rightExplanation: 'Brilliant! Nylon was invented in 1935 as the world’s first fully synthetic fiber. It can hold hundreds of kilograms without snapping!',
    wrongExplanation: 'Natural cotton or grass rots and snaps easily under heavy weight. Climbers trust synthetic Nylon because chemists designed it for extreme strength!',
  },
  {
    id: 'stool',
    name: 'Rustic Handcrafted Stool',
    icon: '🪑',
    category: 'home',
    properties: ['🪵 Hard & Sturdy', '🌳 Natural Grain', '🍃 Biodegradable', '🔨 Rigid Support'],
    options: ['Natural Wood', 'Synthetic PVC', 'Polyester Resin', 'Silicone'],
    correctMaterial: 'Natural Wood',
    classification: 'Natural',
    rightExplanation: 'Correct! Wood is grown naturally by trees made of cellulose and lignin. It has been used by humans for thousands of years!',
    wrongExplanation: 'Wood comes straight from living trees in forests — making it a natural material grown by sunlight and rain!',
  },
  {
    id: 'bottle',
    name: 'Clear Mineral Water Bottle',
    icon: '🫙',
    category: 'home',
    properties: ['🔍 Crystal Transparent', '🛡️ Shatterproof', '🪶 Featherlight', '🧴 Moldable'],
    options: ['PET Plastic (Polyethylene)', 'Natural Quartz Glass', 'Animal Hide', 'Clay Pottery'],
    correctMaterial: 'PET Plastic (Polyethylene)',
    classification: 'Synthetic',
    rightExplanation: 'Exactly! PET plastic is synthesized in chemical refineries. Unlike glass, it does not shatter when dropped on concrete!',
    wrongExplanation: 'Water bottles are made from synthetic PET plastic so they are light, flexible, and do not smash into dangerous shards like quartz glass.',
  },
  {
    id: 'mittens',
    name: 'Fluffy Winter Mittens',
    icon: '🧤',
    category: 'clothing',
    properties: ['🔥 Traps Body Heat', '🐑 Animal Fleece', '☁️ Crimped Fibres', '❄️ Keeps Hands Warm'],
    options: ['Sheep Wool', 'Synthetic Acrylic', 'Sheet Metal', 'Rubber Latex'],
    correctMaterial: 'Sheep Wool',
    classification: 'Natural',
    rightExplanation: 'Great observation! Sheep wool is a natural animal protein fiber. Its crimped fibers trap millions of tiny pockets of warm air around your fingers!',
    wrongExplanation: 'Wool is sheared naturally from sheep! It grows on animals to protect them from icy mountain winds.',
  },
  {
    id: 'tyre',
    name: 'Rugged Bicycle Tyre',
    icon: '🛞',
    category: 'tools',
    properties: ['⚡ High Friction Grip', '🔄 Shock Absorbing', '🛡️ Puncture Resistant', '🌋 Vulcanized Polymer'],
    options: ['Synthetic Vulcanized Rubber', 'Natural Silk', 'Pine Wood', 'Cardboard Paper'],
    correctMaterial: 'Synthetic Vulcanized Rubber',
    classification: 'Synthetic',
    rightExplanation: 'Spot on! Modern tyres combine synthetic polymers with sulfur in a process called vulcanization to endure hot asphalt roads without melting!',
    wrongExplanation: 'Natural unvulcanized rubber becomes sticky in summer and brittle in winter. Tyres need synthetic polymer reinforcement!',
  },
  {
    id: 'panhandle',
    name: 'Heat-Proof Frying Pan Handle',
    icon: '🍳',
    category: 'home',
    properties: ['🔥 Does Not Melt on Stove', '❄️ Stays Cool to Touch', '⚡ Heat Insulator', '🛡️ Hard Thermoset'],
    options: ['Bakelite Plastic', 'Natural Copper', 'Iron Metal', 'Natural Cotton'],
    correctMaterial: 'Bakelite Plastic',
    classification: 'Synthetic',
    rightExplanation: 'Genius! Bakelite was the first fully synthetic plastic invented in 1907. It is a thermoset polymer that never melts, keeping your hands safe from burns!',
    wrongExplanation: 'Metals like copper or iron get blistering hot and would burn your hand! Chemists invented synthetic Bakelite plastic because it blocks heat.',
  },
  {
    id: 'scarf',
    name: 'Shimmering Royal Scarf',
    icon: '🧣',
    category: 'clothing',
    properties: ['✨ Silky Luster', '🪱 Spun by Silkworms', '☁️ Ultra Lightweight', '👑 Smooth Glaze'],
    options: ['Natural Silkworm Silk', 'Synthetic Polyester', 'Steel Wire', 'Dry Wood'],
    correctMaterial: 'Natural Silkworm Silk',
    classification: 'Natural',
    rightExplanation: 'Splendid! Silk is spun naturally by silkworm caterpillars when weaving their cocoons. Its triangular prism fiber structure reflects light beautifully!',
    wrongExplanation: 'Silk is produced naturally by silkworms! It was prized in ancient civilizations along the Silk Road for its natural shimmer.',
  },
  {
    id: 'cable',
    name: 'Electric Wire Safety Jacket',
    icon: '⚡',
    category: 'tools',
    properties: ['🚫 Electric Insulator', '🤸 Flexible Bending', '🛡️ Shock Proof', '🧪 Molded PVC'],
    options: ['Synthetic PVC Plastic', 'Natural Copper', 'Wet Paper', 'Aluminium Wire'],
    correctMaterial: 'Synthetic PVC Plastic',
    classification: 'Synthetic',
    rightExplanation: 'Super science skills! Synthetic PVC plastic is an electrical insulator. It blocks high-voltage currents from shocking anyone who touches the wire!',
    wrongExplanation: 'Copper conducts electricity, but the outer colorful safety sheath is made from synthetic PVC plastic to prevent electric shocks!',
  },
  {
    id: 'sponge',
    name: 'Natural Ocean Bath Sponge',
    icon: '🧽',
    category: 'nature',
    properties: ['🌊 Marine Organism', '🕳️ Porous Honeycomb', '💧 Holds 20x Water', '🌿 Biodegradable'],
    options: ['Natural Marine Sponge', 'Synthetic Polyurethane Foam', 'Clay Brick', 'Rock Crystal'],
    correctMaterial: 'Natural Marine Sponge',
    classification: 'Natural',
    rightExplanation: 'Fascinating! Sea sponges are simple multicellular marine animals that grow on ocean reefs. Their porous fibrous skeleton holds huge amounts of water!',
    wrongExplanation: 'While yellow kitchen sponges are synthetic polyurethane foam, real sea sponges grow naturally on coral reefs under the sea!',
  },
  {
    id: 'window',
    name: 'Crystal Clear Window Pane',
    icon: '🪟',
    category: 'home',
    properties: ['☀️ Lets Sunlight In', '🏖️ Melted Quartz Sand', '🔥 High Melting Temp', '🪨 Mineral Hardness'],
    options: ['Natural Silica Glass', 'Synthetic Acrylic Plastic', 'Wool Felt', 'Rubber Sheet'],
    correctMaterial: 'Natural Silica Glass',
    classification: 'Natural',
    rightExplanation: 'Masterful! Glass is made by melting natural quartz sand (silica) at over 1,700°C. It is an inorganic natural mineral transformation!',
    wrongExplanation: 'Glass is created from natural earth silica sand melted at fiery furnace temperatures!',
  },
];

export const MysteryObjectQuiz: React.FC = () => {
  const navigate = useNavigate();
  const addCredits = useProgressStore((s) => s.addCredits);

  const [activeSpecimen, setActiveSpecimen] = useState<MysterySpecimen | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<'Natural' | 'Synthetic' | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'clothing' | 'tools' | 'home' | 'nature'>('all');

  const openSpecimen = (s: MysterySpecimen) => {
    sounds.pop();
    setActiveSpecimen(s);
    setSelectedMaterial(null);
    setSelectedClassification(null);
    setIsEvaluated(false);
    voiceAssistant.speak(`Inspecting ${s.name}! Look at its clues and tell me what it is made of!`);
  };

  const handleCheckAnswer = () => {
    if (!activeSpecimen || !selectedMaterial || !selectedClassification) return;

    setIsEvaluated(true);
    const isMaterialCorrect = selectedMaterial === activeSpecimen.correctMaterial;
    const isClassCorrect = selectedClassification === activeSpecimen.classification;
    const isFullyCorrect = isMaterialCorrect && isClassCorrect;

    if (isFullyCorrect) {
      sounds.fanfare();
      if (!solvedIds.includes(activeSpecimen.id)) {
        setSolvedIds((prev) => [...prev, activeSpecimen.id]);
        addCredits(25);
      }
      voiceAssistant.speak(activeSpecimen.rightExplanation);
    } else {
      sounds.boing();
      voiceAssistant.speak(activeSpecimen.wrongExplanation);
    }
  };

  const filteredSpecimens = MYSTERY_SPECIMENS.filter(
    (s) => filter === 'all' || s.category === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white p-4 md:p-8 flex flex-col items-center">
      {/* ── TOP NAV & BANNER ── */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/chapter-hub')}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center gap-2 border border-slate-700 shadow-md cursor-pointer transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+25 PolyCredits / Mystery</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{solvedIds.length} / {MYSTERY_SPECIMENS.length} Solved</span>
          </div>
        </div>
      </div>

      {/* ── HEADER TITLE ── */}
      <div className="text-center max-w-2xl mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <Pip mood="curious" size="sm" />
          <h1 className="text-3xl md:text-4xl font-black text-amber-300 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            🔬 Specimen Mystery Quiz Lab
          </h1>
        </div>
        <p className="text-slate-300 text-xs md:text-sm font-bold">
          Tap any mystery object below to zoom into its clues, uncover its hidden material, and classify it as Natural or Synthetic!
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { id: 'all', label: 'All Mysteries 🔍' },
            { id: 'clothing', label: 'Clothes & Wear 🧥' },
            { id: 'tools', label: 'Tools & Gears 🪢' },
            { id: 'home', label: 'Everyday Home 🫙' },
            { id: 'nature', label: 'Earth & Nature 🌊' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.pop();
                setFilter(cat.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SPECIMEN CARDS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl">
        {filteredSpecimens.map((s) => {
          const isSolved = solvedIds.includes(s.id);
          return (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openSpecimen(s)}
              className={`p-5 rounded-3xl border-3 flex flex-col items-center text-center cursor-pointer transition-all relative overflow-hidden ${
                isSolved
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-800/80 border-slate-700 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10'
              }`}
            >
              {isSolved && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <span className="text-5xl my-2 filter drop-shadow-md">{s.icon}</span>
              <h3 className="font-black text-sm md:text-base text-white mt-1 leading-snug">
                {s.name}
              </h3>
              <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {s.properties[0]}
              </span>

              <div className="mt-4 w-full py-2 bg-slate-900/60 rounded-xl text-xs font-black text-amber-300 border border-slate-700/60 flex items-center justify-center gap-1">
                <Search className="w-3.5 h-3.5" />
                <span>{isSolved ? 'Inspect Again' : 'Tap to Inspect'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── SPOTLIGHT MACRO INSPECTION MODAL (ZOOM WITH BACKGROUND BLUR) ── */}
      <AnimatePresence>
        {activeSpecimen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
            {/* Backdrop with heavy blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSpecimen(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl"
            />

            {/* Centered Limelight Zoom Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-slate-900 border-4 border-amber-400/90 rounded-3xl p-6 md:p-8 shadow-2xl z-10 flex flex-col items-center max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveSpecimen(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800 border border-slate-700 cursor-pointer"
              >
                ✕
              </button>

              {/* Specimen Header & Zoom Icon */}
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-amber-400/50 flex items-center justify-center text-6xl shadow-inner mb-3">
                {activeSpecimen.icon}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-amber-300 text-center mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {activeSpecimen.name}
              </h2>

              {/* Discovered Physical Properties Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {activeSpecimen.properties.map((prop, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 rounded-full text-xs font-black shadow-xs"
                  >
                    {prop}
                  </span>
                ))}
              </div>

              {/* ── QUESTION 1: WHAT IS IT MADE OF? ── */}
              <div className="w-full bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-4">
                <label className="block text-xs font-black text-amber-400 uppercase tracking-widest mb-3 text-center">
                  🧪 1. What material is this object made of?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeSpecimen.options.map((opt) => (
                    <button
                      key={opt}
                      disabled={isEvaluated}
                      onClick={() => {
                        sounds.pop();
                        setSelectedMaterial(opt);
                      }}
                      className={`p-3 rounded-xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer ${
                        selectedMaterial === opt
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-102 ring-2 ring-amber-400/40'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── QUESTION 2: NATURAL OR SYNTHETIC? ── */}
              <div className="w-full bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6">
                <label className="block text-xs font-black text-sky-400 uppercase tracking-widest mb-3 text-center">
                  ⚡ 2. Is this material Natural or Synthetic?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={isEvaluated}
                    onClick={() => {
                      sounds.pop();
                      setSelectedClassification('Natural');
                    }}
                    className={`p-3.5 rounded-xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedClassification === 'Natural'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md scale-102 ring-2 ring-emerald-400/40'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>🌿 Natural (From Nature)</span>
                  </button>

                  <button
                    disabled={isEvaluated}
                    onClick={() => {
                      sounds.pop();
                      setSelectedClassification('Synthetic');
                    }}
                    className={`p-3.5 rounded-xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedClassification === 'Synthetic'
                        ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md scale-102 ring-2 ring-sky-400/40'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>🏭 Synthetic (Made by People)</span>
                  </button>
                </div>
              </div>

              {/* ── ACTION / FEEDBACK PANEL ── */}
              {!isEvaluated ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedMaterial || !selectedClassification}
                  className="w-full py-4 rounded-2xl font-black text-base md:text-lg bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>Reveal Science Answer! 🔬</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  {selectedMaterial === activeSpecimen.correctMaterial &&
                  selectedClassification === activeSpecimen.classification ? (
                    <div className="w-full p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-center mb-4">
                      <span className="font-black text-base text-emerald-300 block mb-1">
                        🎉 Correct! You Earned +25 PolyCredits! 🪙
                      </span>
                      <p className="text-xs md:text-sm text-slate-200 font-bold leading-relaxed">
                        {activeSpecimen.rightExplanation}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-400 text-center mb-4">
                      <span className="font-black text-base text-rose-300 block mb-1">
                        💡 Let's Learn Why!
                      </span>
                      <p className="text-xs md:text-sm text-slate-200 font-bold leading-relaxed">
                        {activeSpecimen.wrongExplanation}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        sounds.pop();
                        setIsEvaluated(false);
                        setSelectedMaterial(null);
                        setSelectedClassification(null);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs md:text-sm border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.pop();
                        setActiveSpecimen(null);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs md:text-sm cursor-pointer shadow-md"
                    >
                      Next Mystery →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
