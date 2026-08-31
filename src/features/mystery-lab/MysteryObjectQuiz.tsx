import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
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
  ZoomIn,
  Trophy,
  Check,
  X,
  Star,
  Eye,
} from 'lucide-react';

// Real Studio Macro Educational Photography
import raincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonShirtImg from '@/assets/images/experiments/cotton_swatch_clean.jpg';
import nylonRopeImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import woodTimberImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import petBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import sheepWoolImg from '@/assets/images/specimens/sheep_wool_fleece.jpg';
import vulcanizedTireImg from '@/assets/images/experiments/vulcanized_car_tire_tread.jpg';
import bakelitePanHandleImg from '@/assets/images/experiments/bakelite_pan_handle.jpg';
import silkCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import insulatedCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import acrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import epoxyGlueImg from '@/assets/images/experiments/epoxy_resin_adhesive_glue.jpg';

interface MysterySpecimen {
  id: string;
  name: string;
  image: string;
  category: 'clothing' | 'tools' | 'home' | 'nature' | 'electronics';
  clues: string[];
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
    image: raincoatImg,
    category: 'clothing',
    clues: [
      '💧 Hydrophobic: Raindrops bead up and roll off instantly without soaking.',
      '🪶 Featherlight & flexible for stormy rainy day adventures.',
      '🏭 Synthesized from petroleum ethylene petrochemicals.',
    ],
    options: ['Synthetic Polyester', 'Natural Cotton', 'Tree Wood', 'Pure Gold'],
    correctMaterial: 'Synthetic Polyester',
    classification: 'Synthetic',
    rightExplanation: 'Spot on! Polyester is a synthetic polymer. Its tightly woven synthetic fibers do not absorb water, keeping you 100% dry!',
    wrongExplanation: 'Not quite! Natural cotton or wood absorbs rain. Raincoats are made from synthetic Polyester plastic so water slides off!',
  },
  {
    id: 'cotton-swatch',
    name: 'Summer Breathable T-Shirt',
    image: cottonShirtImg,
    category: 'clothing',
    clues: [
      '☁️ Soft microscopic plant cellulose fibers with hollow lumens.',
      '🌬️ Highly breathable & wicks sweat away in 40°C summer heat.',
      '🌱 Grown naturally in agricultural fields as fluffy white bolls.',
    ],
    options: ['Natural Cotton', 'Synthetic Nylon', 'PET Plastic', 'Aluminium'],
    correctMaterial: 'Natural Cotton',
    classification: 'Natural',
    rightExplanation: 'Awesome! Cotton is a natural plant fiber harvested from cotton bolls. It breathes naturally to cool skin through sweat evaporation!',
    wrongExplanation: 'Cotton is harvested from plants! Synthetic fibers like nylon trap heat more than natural cotton on hot summer days.',
  },
  {
    id: 'nylon-rope',
    name: 'Heavy-Duty Mountain Climbing Rope',
    image: nylonRopeImg,
    category: 'tools',
    clues: [
      '💪 Extreme Tensile Strength: Can support over 55kg per thin cord!',
      '⚡ Slight elastic stretch to cushion mountain climbers during sudden falls.',
      '🧪 World’s first fully synthetic fiber invented in 1935.',
    ],
    options: ['Synthetic Nylon', 'Cotton Yarn', 'Dry Grass', 'Glass Fibres'],
    correctMaterial: 'Synthetic Nylon',
    classification: 'Synthetic',
    rightExplanation: 'Brilliant! Nylon was invented in 1935 as the world’s first fully synthetic fiber. It can hold immense weight without snapping!',
    wrongExplanation: 'Natural cotton or grass rots and snaps easily under heavy loads. Climbers trust synthetic Nylon because chemists designed it for extreme strength!',
  },
  {
    id: 'wood-timber',
    name: 'Handcrafted Timber Stool & Beam',
    image: woodTimberImg,
    category: 'home',
    clues: [
      '🪵 Rigid and sturdy natural grain structure made of cellulose and lignin.',
      '🌳 Harvested sustainably from forest trees.',
      '🍃 100% Biodegradable and decomposes naturally into soil.',
    ],
    options: ['Natural Wood', 'Synthetic PVC', 'Polyester Resin', 'Silicone Rubber'],
    correctMaterial: 'Natural Wood',
    classification: 'Natural',
    rightExplanation: 'Correct! Wood is grown naturally by forest trees. It is sturdy, renewable, and decomposes back into rich soil.',
    wrongExplanation: 'Wood comes straight from living trees in forests — making it a natural material grown by sunlight and rain!',
  },
  {
    id: 'pet-bottle',
    name: 'Clear Molded Mineral Water Bottle',
    image: petBottleImg,
    category: 'home',
    clues: [
      '🔍 Crystal transparent, shatterproof, and featherlight.',
      '🧴 Melted and thermo-molded into custom shapes under heat and pressure.',
      '🛢️ Polyethylene Terephthalate polymer synthesized from crude oil.',
    ],
    options: ['PET Plastic (Polymer)', 'Natural Quartz Glass', 'Animal Hide', 'Clay Pottery'],
    correctMaterial: 'PET Plastic (Polymer)',
    classification: 'Synthetic',
    rightExplanation: 'Exactly! PET plastic is synthesized in chemical refineries. Unlike glass, it does not shatter when dropped on hard concrete!',
    wrongExplanation: 'Water bottles are made from synthetic PET plastic so they are light, flexible, and do not smash into dangerous shards like quartz glass.',
  },
  {
    id: 'sheep-wool',
    name: 'Winter Warm Mittens & Fleece',
    image: sheepWoolImg,
    category: 'clothing',
    clues: [
      '🐑 Natural crimped protein fibers shorn from sheep fleece.',
      '🔥 Traps millions of tiny pockets of warm air to insulate against snow.',
      '🌱 Natural animal fiber with natural water-repellent lanolin.',
    ],
    options: ['Natural Sheep Wool', 'Synthetic Acrylic', 'Sheet Metal', 'Rubber Latex'],
    correctMaterial: 'Natural Sheep Wool',
    classification: 'Natural',
    rightExplanation: 'Great observation! Sheep wool is a natural animal protein fiber. Its crimped fibers trap body heat to protect against icy winter winds!',
    wrongExplanation: 'Wool is sheared naturally from sheep! It grows on animals to protect them from icy mountain winds.',
  },
  {
    id: 'vulcanized-tire',
    name: 'High-Friction Vehicle Road Tyre',
    image: vulcanizedTireImg,
    category: 'tools',
    clues: [
      '🛞 Endures scorching hot asphalt roads without melting or wearing down.',
      '🌋 Reinforced with sulfur cross-links in a high-temperature vulcanization process.',
      '🛡️ Synthetic elastomer with deep treads for extreme road grip.',
    ],
    options: ['Synthetic Vulcanized Rubber', 'Natural Silk', 'Pine Wood', 'Cardboard Paper'],
    correctMaterial: 'Synthetic Vulcanized Rubber',
    classification: 'Synthetic',
    rightExplanation: 'Spot on! Modern tyres combine synthetic polymers with sulfur in a process called vulcanization to endure hot asphalt roads without melting!',
    wrongExplanation: 'Natural raw rubber becomes sticky in summer and brittle in winter. Tyres require vulcanized synthetic rubber reinforcement!',
  },
  {
    id: 'bakelite-handle',
    name: 'Heat-Resistant Frying Pan Handle',
    image: bakelitePanHandleImg,
    category: 'home',
    clues: [
      '🍳 Stays cool to touch even while the cast iron pan sizzles on open flame.',
      '🔥 Thermoset plastic that never melts or softens once molded.',
      '🛡️ Invented in 1907 as the world’s first thermosetting synthetic plastic.',
    ],
    options: ['Bakelite (Thermoset Plastic)', 'Natural Copper', 'Cast Iron Metal', 'Natural Cotton'],
    correctMaterial: 'Bakelite (Thermoset Plastic)',
    classification: 'Synthetic',
    rightExplanation: 'Genius! Bakelite was the first fully synthetic plastic invented in 1907. It is a thermoset polymer that never melts, protecting your hands from burns!',
    wrongExplanation: 'Metals like copper or iron get blistering hot and would burn your hand! Chemists invented synthetic Bakelite plastic because it blocks heat.',
  },
  {
    id: 'silk-cocoon',
    name: 'Shimmering Luxury Silk Scarf',
    image: silkCocoonImg,
    category: 'clothing',
    clues: [
      '🐛 Spun by silkworm larvae to construct their protective cocoons.',
      '✨ Natural triangular prism structure refracts light for a royal glossy sheen.',
      '👑 Historic natural luxury fiber treasured for centuries along the Silk Road.',
    ],
    options: ['Natural Silkworm Silk', 'Synthetic Nylon', 'PET Resin', 'PVC Plastic'],
    correctMaterial: 'Natural Silkworm Silk',
    classification: 'Natural',
    rightExplanation: 'Magnificent! Silk is a natural protein fiber produced by silkworms. Its triangular prism fibers refract light, giving it a natural glossy glow!',
    wrongExplanation: 'Silk is spun naturally by silkworm caterpillars as they spin their cocoons!',
  },
  {
    id: 'insulated-cable',
    name: 'Dual-Layer Electric Power Cable',
    image: insulatedCableImg,
    category: 'electronics',
    clues: [
      '⚡ Inside: Highly conductive Copper metal core that carries electricity.',
      '🛡️ Outside: Flexible PVC plastic sleeve that insulates and prevents shocks.',
      '🔌 Essential for all home appliances, switches, and charging cables.',
    ],
    options: ['Copper Core + PVC Insulator', 'Pure Cotton Rope', 'Glass Tube', 'Solid Wood Stick'],
    correctMaterial: 'Copper Core + PVC Insulator',
    classification: 'Synthetic',
    rightExplanation: 'Superb! Electric cables use high-conductivity Copper inside to carry power, protected by synthetic PVC plastic insulation to keep hands safe!',
    wrongExplanation: 'Electric wires need a metal conductor (copper) inside and a synthetic plastic insulator (PVC) outside so electricity does not shock anyone.',
  },
  {
    id: 'acrylic-yarn',
    name: 'Warm Knitted Winter Jumper',
    image: acrylicYarnImg,
    category: 'clothing',
    clues: [
      '🧶 Known as "Artificial Wool" — soft, warm, lightweight, and moth-resistant.',
      '🚿 Machine washable without shrinking unlike delicate animal wool.',
      '🧪 Synthesized from acrylonitrile petroleum polymers.',
    ],
    options: ['Synthetic Acrylic Yarn', 'Natural Spider Silk', 'Crushed Stone', 'Natural Leather'],
    correctMaterial: 'Synthetic Acrylic Yarn',
    classification: 'Synthetic',
    rightExplanation: 'Spot on! Acrylic is synthetic wool created in laboratories. It provides cozy winter warmth while resisting moths and shrinking in the wash!',
    wrongExplanation: 'Acrylic was invented by chemists to mimic sheep wool at lower cost and with higher durability against laundry washes.',
  },
  {
    id: 'epoxy-glue',
    name: 'High-Pressure Pipe Repair Adhesive',
    image: epoxyGlueImg,
    category: 'tools',
    clues: [
      '🧪 Two-part liquid resin and hardener that cross-link into a rock-solid seal.',
      '💧 100% Waterproof and withstands high water pressure without leaking.',
      '🛡️ Synthetic chemical polymer adhesive used for fixing broken materials.',
    ],
    options: ['Synthetic Epoxy Adhesive', 'Natural Fruit Jam', 'Mud Paste', 'Tree Leaf Juice'],
    correctMaterial: 'Synthetic Epoxy Adhesive',
    classification: 'Synthetic',
    rightExplanation: 'Expert engineering! Epoxy adhesives are synthetic polymers that form unbreakable chemical bonds to seal leaks and repair broken equipment!',
    wrongExplanation: 'High-pressure pipe leaks require synthetic epoxy adhesives whose chemical cross-links resist water pressure and never dissolve!',
  },
];

export const MysteryObjectQuiz: React.FC = () => {
  const navigate = useNavigate();
  const addCredits = useProgressStore((state) => state.addCredits);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [unlockedClues, setUnlockedClues] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const specimen = MYSTERY_SPECIMENS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / MYSTERY_SPECIMENS.length) * 100);

  // Shuffle options for the current specimen
  const randomizedOptions = React.useMemo(() => {
    const arr = [...specimen.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentIndex, specimen.options]);

  // Cancel prior voice speech when moving to next question
  React.useEffect(() => {
    voiceAssistant.stop();
    return () => {
      voiceAssistant.stop();
    };
  }, [currentIndex]);

  const handleOptionSelect = (opt: string) => {
    voiceAssistant.stop();
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === specimen.correctMaterial;

    if (isCorrect) {
      sounds.success();
      const pointsEarned = Math.max(10, 30 - (unlockedClues - 1) * 5) + streak * 5;
      setScore((s) => s + pointsEarned);
      setStreak((st) => st + 1);
      addCredits(10);
      addDiscovery({
        materialId: specimen.id,
        discoveredAt: Date.now(),
        properties: specimen.clues,
        uses: [specimen.name],
        scienceWord: specimen.correctMaterial,
      });
      voiceAssistant.speak(specimen.rightExplanation);
    } else {
      sounds.boing();
      setStreak(0);
      voiceAssistant.speak(specimen.wrongExplanation);
    }
  };

  const handleNext = () => {
    sounds.pop();
    if (currentIndex < MYSTERY_SPECIMENS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setUnlockedClues(1);
      setIsZoomed(false);
    } else {
      sounds.fanfare();
      setIsQuizComplete(true);
      addCredits(50);
      voiceAssistant.speak(`Grand Master of Materials! You completed the Specimen Mystery Quiz Lab with ${score} points!`);
    }
  };

  const handleRestart = () => {
    sounds.pop();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUnlockedClues(1);
    setIsZoomed(false);
    setScore(0);
    setStreak(0);
    setIsQuizComplete(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between pt-4 sm:pt-6 pb-16 px-3 sm:px-6 md:px-8 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-slate-800/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-slate-700 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/chapter-hub');
              }}
              className="px-3.5 py-2 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Chapter Hub</span>
            </button>

            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span className="font-black text-sm text-white hidden md:inline">
                Specimen Mystery Quiz Lab 🔬
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-amber-400/40">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-mono font-black text-amber-300 text-xs sm:text-sm">
                {score} PTS
              </span>
              {streak >= 2 && (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-md animate-bounce ml-1">
                  {streak}x STREAK! 🔥
                </span>
              )}
            </div>

            <AudioNavBarControls showProfile={false} />
          </div>
        </div>

        {/* Quiz Progress Gauge */}
        <div className="w-full bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
          <span className="text-xs font-black text-slate-400">
            SPECIMEN {currentIndex + 1} OF {MYSTERY_SPECIMENS.length}
          </span>
          <div className="flex-1 bg-slate-900 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 h-full rounded-full"
            />
          </div>
          <span className="text-xs font-mono font-black text-amber-400">
            {progressPercent}%
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN QUIZ CARD ARENA
        ═══════════════════════════════════════════════════════════════════ */}
        {!isQuizComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Specimen Macro Photography Studio (5 cols) */}
            <div className="lg:col-span-5 bg-slate-800/90 border-4 border-amber-400/60 rounded-3xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
              <div className="flex items-center justify-between w-full mb-3">
                <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                  Unknown Specimen #{currentIndex + 1}
                </span>
                <button
                  onClick={() => {
                    sounds.pop();
                    setIsZoomed(!isZoomed);
                  }}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-black text-slate-200 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isZoomed ? 'Reset View' : 'Macro Zoom'}</span>
                </button>
              </div>

              {/* Photo Display Frame */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-600 bg-slate-950 relative shadow-inner flex items-center justify-center group">
                <motion.img
                  animate={{ scale: isZoomed ? 1.75 : 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  src={specimen.image}
                  alt={specimen.name}
                  className="w-full h-full object-cover select-none cursor-pointer"
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Classification Reveal Pill after answer */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute bottom-3 px-4 py-1.5 rounded-full text-xs font-black shadow-xl border-2 ${
                      specimen.classification === 'Natural'
                        ? 'bg-emerald-500 text-slate-950 border-white'
                        : 'bg-sky-500 text-slate-950 border-white'
                    }`}
                  >
                    {specimen.classification === 'Natural' ? '🌿 100% NATURAL MATERIAL' : '🧪 SYNTHETIC POLYMER'}
                  </motion.div>
                )}
              </div>

              <h3
                className="text-xl sm:text-2xl font-black text-white mt-4 text-center"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {specimen.name}
              </h3>
            </div>

            {/* Right Column: Clues, Options & Pip Feedback (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Clues Lab Container */}
              <div className="bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-black text-slate-200">Investigation Clues</h4>
                  </div>
                  {unlockedClues < specimen.clues.length && !isAnswered && (
                    <button
                      onClick={() => {
                        sounds.pop();
                        setUnlockedClues((c) => Math.min(c + 1, specimen.clues.length));
                      }}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Reveal Next Clue (+1)
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {specimen.clues.slice(0, unlockedClues).map((clue, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="font-mono text-amber-400 font-black text-xs mt-0.5">
                        #{idx + 1}
                      </span>
                      <span>{clue}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Multiple Choice Material Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-black text-slate-400 block ml-1">
                  What material is this specimen constructed from?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {randomizedOptions.map((opt) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === specimen.correctMaterial;

                    let btnStyle = 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-300';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 border-rose-400 text-white';
                      } else {
                        btnStyle = 'bg-slate-800/50 border-slate-700 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                        whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                        disabled={isAnswered}
                        onClick={() => handleOptionSelect(opt)}
                        className={`p-4 rounded-2xl border-3 text-left font-black text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <Check className="w-5 h-5 text-white stroke-[3]" />}
                        {isAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-white stroke-[3]" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback & Next Action Banner */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-3xl border-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
                    selectedOption === specimen.correctMaterial
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-400 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <Pip mood={selectedOption === specimen.correctMaterial ? 'celebrating' : 'curious'} size="sm" />
                    <div>
                      <h5 className="font-black text-sm text-white">
                        {selectedOption === specimen.correctMaterial ? '🎉 Correct Identification!' : '🔬 Review Science Observation:'}
                      </h5>
                      <p className="text-xs font-bold mt-0.5 leading-relaxed">
                        {selectedOption === specimen.correctMaterial ? specimen.rightExplanation : specimen.wrongExplanation}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
                  >
                    {currentIndex < MYSTERY_SPECIMENS.length - 1 ? 'NEXT SPECIMEN ➔' : 'SEE FINAL REPORT 🏆'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════════
             QUIZ LAB CAPSTONE VICTORY SCREEN
          ═══════════════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/90 border-4 border-amber-400 rounded-3xl md:rounded-[36px] p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-6"
          >
            <Trophy className="w-20 h-20 text-amber-400 mx-auto animate-bounce" />
            <div className="space-y-2">
              <span className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                Junior Scientist Certified 🎓
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Specimen Mystery Master!
              </h2>
              <p className="text-sm text-slate-300 font-bold max-w-md mx-auto">
                You successfully analyzed and classified all 12 real-world materials using macroscopic investigation and material properties!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-700 max-w-sm mx-auto">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase">Final Score</span>
                <span className="font-mono text-2xl font-black text-amber-400 block">{score} PTS</span>
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase">Credits Won</span>
                <span className="font-mono text-2xl font-black text-emerald-400 block">+50 🪙</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleRestart}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> PLAY AGAIN
              </button>
              <button
                onClick={() => navigate('/chapter-hub')}
                className="px-8 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-black text-sm rounded-2xl cursor-pointer"
              >
                RETURN TO CHAPTER HUB
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
