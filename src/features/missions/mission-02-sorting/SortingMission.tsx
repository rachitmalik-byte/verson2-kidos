import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MissionLayout } from '../MissionLayout';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { CelebrationOverlay } from '@/components/feedback/CelebrationOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

// Real Studio Macro Educational Photography
import rawCottonBollImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import sheepWoolFleeceImg from '@/assets/images/specimens/sheep_wool_fleece.jpg';
import naturalWoodTimberImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import silkwormSilkCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import nylonThreadSpoolImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import polyesterFabricRollImg from '@/assets/images/specimens/polyester_fabric_roll.jpg';
import plasticPetPelletsImg from '@/assets/images/specimens/plastic_pet_pellets.jpg';
import syntheticAcrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';

import { Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, TreePine, Factory, Search, ZoomIn, X } from 'lucide-react';

type Phase = 'HOOK' | 'SORTING' | 'REFLECT' | 'UNDERSTANDING' | 'PRACTICE' | 'APPLY';

interface MaterialItem {
  id: string;
  name: string;
  emoji: string;
  image: string;
  type: 'natural' | 'synthetic';
  origin: string;
  hint: string;
  description: string;
}

const SORTING_ITEMS: MaterialItem[] = [
  {
    id: 'cotton',
    name: 'Raw Cotton Boll',
    emoji: '🌿',
    image: rawCottonBollImg,
    type: 'natural',
    origin: 'Cotton Plant Seed Capsule',
    hint: 'Grown on plant stems in open fields!',
    description: 'Natural plant cellulose fibers harvested from fluffy white bolls.',
  },
  {
    id: 'wool',
    name: 'Raw Sheep Wool',
    emoji: '🐑',
    image: sheepWoolFleeceImg,
    type: 'natural',
    origin: 'Animal Fleece (Sheep)',
    hint: 'Gently sheared from live sheep!',
    description: 'Natural animal protein keratin fibers that trap body warmth.',
  },
  {
    id: 'silk',
    name: 'Silkworm Silk Cocoon',
    emoji: '🪱',
    image: silkwormSilkCocoonImg,
    type: 'natural',
    origin: 'Spun by Silkworms',
    hint: 'Spun by silkworm caterpillars!',
    description: 'Shimmering natural continuous protein filament spun for cocoons.',
  },
  {
    id: 'wood',
    name: 'Natural Timber Oak Wood',
    emoji: '🪵',
    image: naturalWoodTimberImg,
    type: 'natural',
    origin: 'Forest Trees (Lignin & Cellulose)',
    hint: 'From oak and pine trees in forests!',
    description: 'Rigid natural plant material created through years of sunlight and rain.',
  },
  {
    id: 'nylon',
    name: 'Nylon Filament Spool',
    emoji: '🧵',
    image: nylonThreadSpoolImg,
    type: 'synthetic',
    origin: 'Petrochemical Polymerization',
    hint: 'Synthesized by chemists in a lab!',
    description: 'Man-made continuous polymer chain with extreme tensile strength.',
  },
  {
    id: 'polyester',
    name: 'Polyester Fabric Roll',
    emoji: '👕',
    image: polyesterFabricRollImg,
    type: 'synthetic',
    origin: 'Petroleum Ester Polymers',
    hint: 'Synthesized with chemical polymer chains!',
    description: 'Wrinkle-free hydrophobic plastic fabric crafted in modern factories.',
  },
  {
    id: 'plastic',
    name: 'Thermoplastic PET Pellets',
    emoji: '🫙',
    image: plasticPetPelletsImg,
    type: 'synthetic',
    origin: 'Mouldable Chemical Resins',
    hint: 'Moulded in chemical factory machines!',
    description: 'Lightweight thermoplastic resins that soften with heat to take any shape.',
  },
  {
    id: 'acrylic',
    name: 'Synthetic Acrylic Yarn',
    emoji: '🧶',
    image: syntheticAcrylicYarnImg,
    type: 'synthetic',
    origin: 'Polyacrylonitrile Chemical Polymer',
    hint: 'Artificial wool substitute made from petroleum!',
    description: 'Man-made warm synthetic yarn engineered to mimic wool without sheep.',
  },
];

export function SortingMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [sortedItems, setSortedItems] = useState<Record<string, 'natural' | 'synthetic'>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [inspectItem, setInspectItem] = useState<MaterialItem | null>(null);
  const [reflectAnswer1, setReflectAnswer1] = useState<number | null>(null);
  const [reflectAnswer2, setReflectAnswer2] = useState<number | null>(null);
  const [practiceSorted, setPracticeSorted] = useState<Record<string, 'natural' | 'synthetic'>>({});
  const [activePracticeItem, setActivePracticeItem] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Shuffle specimen cards on desk
  const [shuffledItems] = useState(() => {
    const arr = [...SORTING_ITEMS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  React.useEffect(() => {
    voiceAssistant.stop();
    return () => {
      voiceAssistant.stop();
    };
  }, [currentPhase]);

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'SORTING', 'REFLECT', 'UNDERSTANDING', 'PRACTICE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
    voiceAssistant.stop();
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      completeMission('mission-02');
      const naturalMaterials = ['cotton', 'wool', 'silk', 'wood'];
      const syntheticMaterials = ['nylon', 'polyester', 'plastic', 'acrylic'];

      naturalMaterials.forEach((id) => {
        addDiscovery({
          materialId: id,
          discoveredAt: Date.now(),
          properties: ['Natural', 'From Nature'],
          uses: [],
          scienceWord: 'Natural material',
        });
      });

      syntheticMaterials.forEach((id) => {
        addDiscovery({
          materialId: id,
          discoveredAt: Date.now(),
          properties: ['Synthetic', 'Man-Made'],
          uses: [],
          scienceWord: 'Synthetic material',
        });
      });

      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter/3/mission/3');
      }, 2400);
    }
  };

  const handlePrevPhase = () => {
    if (currentStepIndex > 0) {
      sounds.pop();
      setCurrentPhase(phaseOrder[currentStepIndex - 1]);
    }
  };

  const handleRedo = () => {
    sounds.pop();
    setSortedItems({});
    setActiveItem(null);
    setReflectAnswer1(null);
    setReflectAnswer2(null);
    setPracticeSorted({});
    setActivePracticeItem(null);
  };

  const isStepComplete = () => {
    switch (currentPhase) {
      case 'HOOK':
        return true;
      case 'SORTING':
        return Object.keys(sortedItems).length === SORTING_ITEMS.length;
      case 'REFLECT':
        return reflectAnswer1 === 0 && reflectAnswer2 === 0;
      case 'UNDERSTANDING':
        return true;
      case 'PRACTICE':
        return Object.keys(practiceSorted).length === 4;
      case 'APPLY':
        return true;
      default:
        return false;
    }
  };

  const handleCardClick = (item: MaterialItem) => {
    sounds.pop();
    if (activeItem === item.id) {
      setActiveItem(null);
    } else {
      setActiveItem(item.id);
    }
  };

  const handleZoneClick = (zoneType: 'natural' | 'synthetic') => {
    if (!activeItem) return;
    const item = SORTING_ITEMS.find((i) => i.id === activeItem);
    if (!item) return;

    if (item.type === zoneType) {
      sounds.pop();
      setSortedItems((prev) => ({ ...prev, [item.id]: zoneType }));
      setActiveItem(null);
    } else {
      sounds.boing();
      setInspectItem(item);
    }
  };

  return (
    <MissionLayout
      missionId="mission-02"
      missionNumber={2}
      missionTitle="The Sorting Desk: Nature vs Factory"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-emerald-100 via-amber-50 to-sky-100"
    >
      <CelebrationOverlay
        isVisible={showCelebration}
        type="mission-complete"
        onComplete={() => setShowCelebration(false)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full flex-1 flex flex-col items-center justify-center py-4"
        >
          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 1: HOOK (The Mixed-Up Workbench)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="curious" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Scientist's Sorting Desk! 🔬
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-6">
                Pip's laboratory desk is piled high with real materials from all around the world! Some were grown by{' '}
                <span className="text-emerald-700 font-black">Mother Nature</span>, while others were synthesized by{' '}
                <span className="text-sky-700 font-black">Chemists in Factories</span>. Can you sort them into the right scientific trays?
              </p>

              {/* Real Specimen Gallery Preview */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-lg mb-8">
                {[rawCottonBollImg, sheepWoolFleeceImg, nylonThreadSpoolImg, polyesterFabricRollImg].map((img, i) => (
                  <div key={i} className="w-full aspect-square rounded-2xl overflow-hidden border-3 border-slate-200 shadow-sm bg-white p-1">
                    <img src={img} alt="Specimen" className="w-full h-full object-cover rounded-xl" />
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextPhase}
                className="bg-amber-400 border-2 border-amber-600 shadow-[0_6px_0_#D97706] active:translate-y-1.5 active:shadow-none text-slate-900 font-black text-xl py-4 px-12 rounded-3xl hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Let's Start Sorting! 🧪</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 2: REAL SPECIMEN SORTING DESK (8 High-Res Photos)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'SORTING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Tap any real specimen photo below, then tap the tray where it belongs!"
                  isVisible={true}
                />
              </div>

              {/* ── TWO SCIENTIFIC SORTING TRAYS ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                {/* Natural Zone Tray */}
                <button
                  onClick={() => handleZoneClick('natural')}
                  className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                    activeItem
                      ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-300/60 shadow-xl hover:scale-101'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-black text-lg text-emerald-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      🌿 FROM NATURE (Natural)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">
                    Plants, Animals, Trees & Earth Minerals
                  </span>

                  {/* Sorted Count */}
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {SORTING_ITEMS.filter((i) => sortedItems[i.id] === 'natural').map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 bg-white rounded-full text-xs font-black text-emerald-900 border border-emerald-300 shadow-xs flex items-center gap-1"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>
                </button>

                {/* Synthetic Zone Tray */}
                <button
                  onClick={() => handleZoneClick('synthetic')}
                  className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                    activeItem
                      ? 'bg-sky-50 border-sky-400 ring-4 ring-sky-300/60 shadow-xl hover:scale-101'
                      : 'bg-sky-50/70 border-sky-300 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="w-6 h-6 text-sky-600" />
                    <h3 className="font-black text-lg text-sky-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      🏭 MADE BY CHEMISTS (Synthetic)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-sky-700">
                    Chemical Polymerization & Man-Made Resins
                  </span>

                  {/* Sorted Count */}
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {SORTING_ITEMS.filter((i) => sortedItems[i.id] === 'synthetic').map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 bg-white rounded-full text-xs font-black text-sky-900 border border-sky-300 shadow-xs flex items-center gap-1"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </span>
                    ))}
                  </div>
                </button>
              </div>

              {/* ── 8 REAL STUDIO SPECIMEN CARDS (SHUFFLED) ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
                {shuffledItems.map((item) => {
                  const isSorted = Boolean(sortedItems[item.id]);
                  const isSelected = activeItem === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: isSorted ? 1 : 1.03, y: isSorted ? 0 : -3 }}
                      whileTap={{ scale: isSorted ? 1 : 0.97 }}
                      onClick={() => !isSorted && handleCardClick(item)}
                      className={`p-3.5 rounded-3xl border-3 flex flex-col items-center text-center cursor-pointer transition-all relative overflow-hidden ${
                        isSorted
                          ? 'opacity-40 bg-slate-100 border-slate-300 cursor-default'
                          : isSelected
                          ? 'bg-amber-100 border-amber-500 shadow-2xl ring-4 ring-amber-300 scale-103'
                          : 'bg-white border-slate-200 hover:border-amber-300 shadow-md'
                      }`}
                    >
                      {/* Real Photo */}
                      <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 mb-2 p-1 relative flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.pop();
                            setInspectItem(item);
                          }}
                          className="absolute bottom-1.5 right-1.5 p-1 bg-slate-900/80 text-white rounded-lg text-[10px] flex items-center gap-0.5 shadow-md cursor-pointer hover:bg-slate-900"
                          title="Inspect Specimen under Magnifier"
                        >
                          <Search className="w-3 h-3" />
                        </button>
                      </div>

                      <h4 className="font-black text-xs md:text-sm text-slate-800 leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 mt-0.5 truncate w-full">
                        {item.origin}
                      </span>

                      {isSelected && (
                        <span className="mt-2 text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full animate-bounce">
                          Tap a Tray Above 👆
                        </span>
                      )}

                      {isSorted && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: REFLECT (Scientific Observation)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'REFLECT' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <Pip mood="thinking" size="lg" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Scientific Observation Time! 🔍
              </h2>

              <div className="bg-white p-6 rounded-3xl border-3 border-slate-200 shadow-lg w-full mb-6">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Question 1: Nature Tray
                </span>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-3 mb-4">
                  What do Cotton, Wool, Silk, and Wood ALL have in common?
                </p>

                <div className="flex flex-col gap-2.5">
                  {[
                    'They are grown naturally by living plants, animals, and trees 🌱',
                    'They were invented by chemists inside laboratories 🧪',
                    'They are all made from melted plastic beads 🫙',
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.pop();
                        setReflectAnswer1(idx);
                      }}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs md:text-sm text-left transition-all cursor-pointer ${
                        reflectAnswer1 === idx
                          ? idx === 0
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md'
                            : 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-3 border-slate-200 shadow-lg w-full mb-6">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                  Question 2: Synthetic Tray
                </span>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-3 mb-4">
                  What do Nylon, Polyester, Plastic, and Acrylic ALL have in common?
                </p>

                <div className="flex flex-col gap-2.5">
                  {[
                    'They are synthesized by people using chemicals and polymer chains 🏭',
                    'They grow on oak trees in forest valleys 🌳',
                    'They are harvested directly from sheep and caterpillars 🐑',
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.pop();
                        setReflectAnswer2(idx);
                      }}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs md:text-sm text-left transition-all cursor-pointer ${
                        reflectAnswer2 === idx
                          ? idx === 0
                            ? 'bg-sky-100 border-sky-500 text-sky-900 shadow-md'
                            : 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (The Core Science Law)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="celebrating" size="lg" />
              <h2 className="text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The Two Great Kingdoms of Materials 👑
              </h2>
              <p className="text-base text-slate-600 font-bold mb-8">
                Now you understand the primary rule of material science!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
                <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-300 shadow-xl flex flex-col items-center">
                  <span className="text-5xl mb-3">🌿</span>
                  <h3 className="text-xl font-black text-emerald-950">Natural Materials</h3>
                  <p className="text-xs font-bold text-slate-600 mt-2 leading-relaxed">
                    Materials harvested straight from living organisms (plants, animals) or extracted from the earth without chemical restructuring.
                  </p>
                  <span className="mt-4 text-[11px] font-black text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full">
                    Examples: Cotton, Wool, Silk, Wood, Leather
                  </span>
                </div>

                <div className="bg-sky-50 p-6 rounded-3xl border-4 border-sky-300 shadow-xl flex flex-col items-center">
                  <span className="text-5xl mb-3">🏭</span>
                  <h3 className="text-xl font-black text-sky-950">Synthetic Materials</h3>
                  <p className="text-xs font-bold text-slate-600 mt-2 leading-relaxed">
                    Materials synthesized artificially in chemical laboratories and industrial reactors by joining small molecules into giant polymer chains.
                  </p>
                  <span className="mt-4 text-[11px] font-black text-sky-900 bg-sky-200 px-3 py-1 rounded-full">
                    Examples: Nylon, Polyester, Plastic, Acrylic, Teflon
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 5: PRACTICE & APPLY
          ════════════════════════════════════════════════════════════════════════ */}
          {(currentPhase === 'PRACTICE' || currentPhase === 'APPLY') && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="lg" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Mastery Challenge: The Lab Invention 🔬
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-bold mb-6">
                A chemist mixes petroleum compounds in a test tube to invent an unbreakable new plastic bottle. Is this material Natural or Synthetic?
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <button
                  onClick={() => sounds.boing()}
                  className="p-5 rounded-3xl border-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-black text-base transition-all cursor-pointer flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">🌿</span>
                  <span>Natural</span>
                </button>

                <button
                  onClick={() => {
                    sounds.fanfare();
                    handleNextPhase();
                  }}
                  className="p-5 rounded-3xl border-3 border-sky-400 bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-base shadow-xl ring-4 ring-sky-300 scale-105 transition-all cursor-pointer flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">🏭✨</span>
                  <span>Synthetic (Man-Made)</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── HIGH-RES MAGNIFIER MODAL FOR SPECIMENS ── */}
      <AnimatePresence>
        {inspectItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectItem(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl flex flex-col items-center text-center"
            >
              <button
                onClick={() => setInspectItem(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 mb-3 p-1 flex items-center justify-center">
                <img src={inspectItem.image} alt={inspectItem.name} className="w-full h-full object-cover rounded-xl" />
              </div>

              <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {inspectItem.name}
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full mt-1">
                {inspectItem.origin}
              </span>
              <p className="text-xs font-bold text-slate-600 mt-3 leading-relaxed">
                {inspectItem.description}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MissionLayout>
  );
}
