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
import {
  CottonIllustration,
  WoolIllustration,
  SilkIllustration,
  WoodIllustration,
  NylonIllustration,
  PolyesterIllustration,
  PlasticIllustration,
  RubberIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, TreePine, Factory, Search, ZoomIn } from 'lucide-react';

type Phase = 'HOOK' | 'SORTING' | 'REFLECT' | 'UNDERSTANDING' | 'PRACTICE' | 'APPLY';

interface MaterialItem {
  id: string;
  name: string;
  emoji: string;
  renderIcon: (className?: string) => React.ReactNode;
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
    renderIcon: (cls) => <CottonIllustration className={cls} />,
    type: 'natural',
    origin: 'Cotton Plant Seed Capsule',
    hint: 'Grown on plant stems in open fields!',
    description: 'Natural plant cellulose fibers harvested from fluffy white bolls.',
  },
  {
    id: 'wool',
    name: 'Raw Sheep Wool',
    emoji: '🐑',
    renderIcon: (cls) => <WoolIllustration className={cls} />,
    type: 'natural',
    origin: 'Animal Fleece (Sheep)',
    hint: 'Gently sheared from live sheep!',
    description: 'Natural animal protein keratin fibers that trap body warmth.',
  },
  {
    id: 'silk',
    name: 'Silkworm Silk Cocoon',
    emoji: '🪱',
    renderIcon: (cls) => <SilkIllustration className={cls} />,
    type: 'natural',
    origin: 'Spun by Silkworms',
    hint: 'Spun by silkworm caterpillars!',
    description: 'Shimmering natural continuous protein filament spun for cocoons.',
  },
  {
    id: 'wood',
    name: 'Natural Timber Oak Wood',
    emoji: '🪵',
    renderIcon: (cls) => <WoodIllustration className={cls} />,
    type: 'natural',
    origin: 'Forest Trees (Lignin & Cellulose)',
    hint: 'From oak and pine trees in forests!',
    description: 'Rigid natural plant material created through years of sunlight and rain.',
  },
  {
    id: 'nylon',
    name: 'Nylon Filament Spool',
    emoji: '🧵',
    renderIcon: (cls) => <NylonIllustration className={cls} />,
    type: 'synthetic',
    origin: 'Petrochemical Polymerization',
    hint: 'Synthesized by chemists in a lab!',
    description: 'Man-made continuous polymer chain with extreme tensile strength.',
  },
  {
    id: 'polyester',
    name: 'Polyester Fabric Roll',
    emoji: '👕',
    renderIcon: (cls) => <PolyesterIllustration className={cls} />,
    type: 'synthetic',
    origin: 'Petroleum Ester Polymers',
    hint: 'Synthesized with chemical polymer chains!',
    description: 'Wrinkle-free hydrophobic plastic fabric crafted in modern factories.',
  },
  {
    id: 'plastic',
    name: 'Thermoplastic PET Pellets',
    emoji: '🫙',
    renderIcon: (cls) => <PlasticIllustration className={cls} />,
    type: 'synthetic',
    origin: 'Mouldable Chemical Resins',
    hint: 'Moulded in chemical factory machines!',
    description: 'Lightweight thermoplastic resins that soften with heat to take any shape.',
  },
  {
    id: 'rubber',
    name: 'Synthetic Vulcanized Tyre',
    emoji: '🛞',
    renderIcon: (cls) => <RubberIllustration className={cls} />,
    type: 'synthetic',
    origin: 'Sulfur Cross-Linked Polymer',
    hint: 'Engineered for high road friction!',
    description: 'Heat-resistant synthetic elastomer engineered for vehicle tires.',
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

  const navigate = useNavigate();
  const completeMission = useProgressStore((state) => state.completeMission);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const phaseOrder: Phase[] = ['HOOK', 'SORTING', 'REFLECT', 'UNDERSTANDING', 'PRACTICE', 'APPLY'];
  const currentStepIndex = phaseOrder.indexOf(currentPhase);
  const totalSteps = phaseOrder.length;

  const handleNextPhase = () => {
    if (currentStepIndex < totalSteps - 1) {
      sounds.success();
      setCurrentPhase(phaseOrder[currentStepIndex + 1]);
    } else {
      sounds.fanfare();
      completeMission('mission-02');
      const naturalMaterials = ['cotton', 'wool', 'silk', 'wood'];
      const syntheticMaterials = ['nylon', 'polyester', 'plastic', 'synthetic-rubber'];

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
          properties: ['Synthetic', 'Chemical Process'],
          uses: [],
          scienceWord: 'Synthetic material',
        });
      });

      setShowCelebration(true);
      setTimeout(() => {
        navigate('/chapter-hub');
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
    if (currentPhase === 'SORTING') {
      setSortedItems({});
      setActiveItem(null);
    }
    if (currentPhase === 'REFLECT') {
      setReflectAnswer1(null);
      setReflectAnswer2(null);
    }
    if (currentPhase === 'PRACTICE') {
      setPracticeSorted({});
      setActivePracticeItem(null);
    }
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
        return false;
      default:
        return false;
    }
  };

  const handleSortItem = (zone: 'natural' | 'synthetic') => {
    if (!activeItem) return;
    const item = SORTING_ITEMS.find((i) => i.id === activeItem);
    if (item && item.type === zone) {
      sounds.pop();
      setSortedItems((prev) => ({ ...prev, [activeItem]: zone }));
      setActiveItem(null);
    } else {
      sounds.boing();
      setActiveItem(null);
    }
  };

  return (
    <MissionLayout
      missionId="mission-02"
      missionNumber={2}
      missionTitle="The Sorting Desk"
      currentStep={currentStepIndex + 1}
      totalSteps={totalSteps}
      isStepComplete={isStepComplete()}
      onNext={handleNextPhase}
      onPrev={handlePrevPhase}
      onRedo={handleRedo}
      themeGradient="from-emerald-100 via-teal-50 to-sky-100"
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
              PHASE 1: HOOK
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'HOOK' && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="xl" />
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Pip's Workbench is in Chaos! 🔬
              </h2>
              <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl leading-relaxed mb-8">
                Eight mystery specimens are jumbled up on the laboratory table! Can you help Pip sort which ones come from{' '}
                <span className="text-emerald-600 font-black">Mother Nature</span> and which were{' '}
                <span className="text-sky-600 font-black">Made by People</span>?
              </p>

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
              PHASE 2: SORTING DESK (Interactive Trays with Vector Icons)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'SORTING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Two Big Cartoon Trays */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                {/* Natural Tray */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSortItem('natural')}
                  className={`p-6 rounded-3xl border-4 transition-all cursor-pointer flex flex-col min-h-[170px] relative overflow-hidden ${
                    activeItem
                      ? 'border-emerald-500 bg-emerald-100/90 shadow-2xl ring-6 ring-emerald-300 scale-102 animate-pulse'
                      : 'border-emerald-400 bg-emerald-50 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <TreePine className="w-3.5 h-3.5" />
                      <span>FROM NATURE</span>
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {Object.values(sortedItems).filter((t) => t === 'natural').length} sorted
                    </span>
                  </div>

                  {/* Specimen Badges inside tray */}
                  <div className="flex flex-wrap gap-2 flex-1 items-start">
                    {Object.entries(sortedItems)
                      .filter(([_, type]) => type === 'natural')
                      .map(([id]) => {
                        const item = SORTING_ITEMS.find((i) => i.id === id);
                        return (
                          <span
                            key={id}
                            className="bg-white text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs border border-emerald-200 flex items-center gap-2 animate-bounce"
                          >
                            <div className="w-6 h-6">{item?.renderIcon('w-full h-full')}</div>
                            <span>{item?.name}</span>
                          </span>
                        );
                      })}
                  </div>

                  {activeItem && (
                    <div className="text-center font-black text-xs text-emerald-800 bg-white/90 py-1.5 px-3 rounded-full mt-2 shadow-xs">
                      👉 Tap here if this item comes from Nature!
                    </div>
                  )}
                </motion.div>

                {/* Synthetic Tray */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSortItem('synthetic')}
                  className={`p-6 rounded-3xl border-4 transition-all cursor-pointer flex flex-col min-h-[170px] relative overflow-hidden ${
                    activeItem
                      ? 'border-sky-500 bg-sky-100/90 shadow-2xl ring-6 ring-sky-300 scale-102 animate-pulse'
                      : 'border-sky-400 bg-sky-50 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-sky-200 text-sky-900 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5" />
                      <span>MADE BY PEOPLE</span>
                    </span>
                    <span className="text-xs font-black text-sky-700">
                      {Object.values(sortedItems).filter((t) => t === 'synthetic').length} sorted
                    </span>
                  </div>

                  {/* Specimen Badges inside tray */}
                  <div className="flex flex-wrap gap-2 flex-1 items-start">
                    {Object.entries(sortedItems)
                      .filter(([_, type]) => type === 'synthetic')
                      .map(([id]) => {
                        const item = SORTING_ITEMS.find((i) => i.id === id);
                        return (
                          <span
                            key={id}
                            className="bg-white text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs border border-sky-200 flex items-center gap-2 animate-bounce"
                          >
                            <div className="w-6 h-6">{item?.renderIcon('w-full h-full')}</div>
                            <span>{item?.name}</span>
                          </span>
                        );
                      })}
                  </div>

                  {activeItem && (
                    <div className="text-center font-black text-xs text-sky-800 bg-white/90 py-1.5 px-3 rounded-full mt-2 shadow-xs">
                      👉 Tap here if this item was Made by People!
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Status Header */}
              <div className="text-center font-black text-xs text-slate-500 uppercase tracking-widest mb-3">
                {SORTING_ITEMS.length - Object.keys(sortedItems).length} specimens remaining to sort
              </div>

              {/* Cards Deck */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
                {SORTING_ITEMS.map((item) => {
                  const isSorted = sortedItems[item.id] !== undefined;
                  const isSelected = activeItem === item.id;

                  if (isSorted) return null;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        sounds.pop();
                        setActiveItem(isSelected ? null : item.id);
                      }}
                      className={`p-4 rounded-2xl border-3 flex flex-col items-center text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100/90 shadow-xl ring-4 ring-amber-300 scale-105'
                          : 'border-slate-200 bg-white hover:bg-slate-50 shadow-md'
                      }`}
                    >
                      <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        {item.renderIcon('w-full h-full')}
                      </div>
                      <span className="font-black text-sm text-slate-800">{item.name}</span>
                      <span className="text-[11px] font-bold text-slate-500 mt-0.5">{item.hint}</span>
                    </motion.button>
                  );
                })}
              </div>

              {Object.keys(sortedItems).length === SORTING_ITEMS.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center shadow-lg"
                >
                  <p className="text-base font-black text-emerald-900 mb-2">
                    🎉 Outstanding! All 8 specimens placed into the right trays!
                  </p>
                  <button
                    onClick={handleNextPhase}
                    className="bg-amber-400 border-2 border-amber-600 shadow-[0_4px_0_#D97706] active:translate-y-1 text-slate-900 font-black text-sm py-2.5 px-8 rounded-full cursor-pointer"
                  >
                    See What They Have In Common →
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 3: REFLECT
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'REFLECT' && (
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
              <div className="text-center">
                <Pip mood="thinking" size="md" />
                <h2 className="text-2xl font-black text-slate-800 mt-2 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  What makes the Green group special? 🌿
                </h2>
                <p className="text-xs md:text-sm font-bold text-slate-500">
                  Think about where Cotton, Wool, Silk, and Wood all come from:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                {[
                  { label: 'They are all harvested from plants, animals, or trees! 🌿🐑', correct: true },
                  { label: 'They are all made in factories with chemicals 🏭', correct: false },
                  { label: 'They were invented by chemists in 1935 ⚡', correct: false },
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (opt.correct) {
                        sounds.success();
                        setReflectAnswer1(0);
                      } else {
                        sounds.boing();
                      }
                    }}
                    className={`p-4 rounded-2xl font-black text-sm border-2 text-left transition-all cursor-pointer ${
                      reflectAnswer1 === 0 && opt.correct
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {reflectAnswer1 === 0 && (
                <div className="w-full flex flex-col items-center space-y-4 pt-4 border-t-2 border-slate-200">
                  <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    And what makes the Blue group special? 🏭
                  </h3>
                  <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                    {[
                      { label: 'They are made by people using chemical reactions! 🧪', correct: true },
                      { label: 'They grow directly on trees in nature 🌳', correct: false },
                      { label: 'They are sheared from sheep fleece 🐑', correct: false },
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (opt.correct) {
                            sounds.fanfare();
                            setReflectAnswer2(0);
                          } else {
                            sounds.boing();
                          }
                        }}
                        className={`p-4 rounded-2xl font-black text-sm border-2 text-left transition-all cursor-pointer ${
                          reflectAnswer2 === 0 && opt.correct
                            ? 'bg-sky-100 border-sky-500 text-sky-950 ring-4 ring-sky-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (Definitions)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
              <Pip mood="celebrating" size="lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Natural Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-emerald-300 shadow-xl text-center">
                  <span className="text-4xl mb-2 block">🌿</span>
                  <h3 className="text-xl font-black text-emerald-900 mb-2">Natural Materials</h3>
                  <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed mb-4">
                    Materials obtained directly from plants, animals, or the earth without chemical alteration.
                  </p>
                  <div className="flex justify-center gap-2 text-xs font-black bg-emerald-50 py-2 px-4 rounded-full text-emerald-800">
                    <span>Cotton • Wool • Silk • Wood</span>
                  </div>
                </div>

                {/* Synthetic Card */}
                <div className="bg-white p-6 rounded-3xl border-4 border-sky-300 shadow-xl text-center">
                  <span className="text-4xl mb-2 block">🏭🧪</span>
                  <h3 className="text-xl font-black text-sky-900 mb-2">Synthetic Materials</h3>
                  <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed mb-4">
                    Man-made materials produced by chemists in laboratories using petroleum and chemical polymers.
                  </p>
                  <div className="flex justify-center gap-2 text-xs font-black bg-sky-50 py-2 px-4 rounded-full text-sky-800">
                    <span>Nylon • Polyester • Plastic • Acrylic</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 5: PRACTICE
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'PRACTICE' && (
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
              <div className="text-center">
                <Pip mood="encouraging" size="md" />
                <h2 className="text-2xl font-black text-slate-800 mt-2 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Speed Match Challenge! ⚡
                </h2>
                <p className="text-xs md:text-sm font-bold text-slate-500">
                  Tap a material below, then tap Natural or Synthetic!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-4">
                <button
                  onClick={() => {
                    if (activePracticeItem) {
                      const mat = [
                        { id: 'jute', type: 'natural' },
                        { id: 'rayon', type: 'synthetic' },
                        { id: 'gold', type: 'natural' },
                        { id: 'acrylic', type: 'synthetic' },
                      ].find((m) => m.id === activePracticeItem);
                      if (mat?.type === 'natural') {
                        sounds.pop();
                        setPracticeSorted((p) => ({ ...p, [activePracticeItem]: 'natural' }));
                        setActivePracticeItem(null);
                      } else {
                        sounds.boing();
                      }
                    }
                  }}
                  className="p-4 rounded-2xl border-3 border-emerald-400 bg-emerald-50 text-emerald-950 font-black text-sm cursor-pointer shadow-md hover:bg-emerald-100"
                >
                  🌿 NATURAL
                </button>

                <button
                  onClick={() => {
                    if (activePracticeItem) {
                      const mat = [
                        { id: 'jute', type: 'natural' },
                        { id: 'rayon', type: 'synthetic' },
                        { id: 'gold', type: 'natural' },
                        { id: 'acrylic', type: 'synthetic' },
                      ].find((m) => m.id === activePracticeItem);
                      if (mat?.type === 'synthetic') {
                        sounds.pop();
                        setPracticeSorted((p) => ({ ...p, [activePracticeItem]: 'synthetic' }));
                        setActivePracticeItem(null);
                      } else {
                        sounds.boing();
                      }
                    }
                  }}
                  className="p-4 rounded-2xl border-3 border-sky-400 bg-sky-50 text-sky-950 font-black text-sm cursor-pointer shadow-md hover:bg-sky-100"
                >
                  🏭 SYNTHETIC
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {[
                  { id: 'jute', name: 'Jute Sack', icon: '🌾' },
                  { id: 'rayon', name: 'Rayon Shirt', icon: '✨' },
                  { id: 'gold', name: 'Gold Mineral', icon: '🪙' },
                  { id: 'acrylic', name: 'Acrylic Blanket', icon: '🧶' },
                ].map((item) => {
                  const isDone = practiceSorted[item.id] !== undefined;
                  if (isDone) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.pop();
                        setActivePracticeItem(item.id);
                      }}
                      className={`p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        activePracticeItem === item.id
                          ? 'bg-amber-100 border-amber-500 scale-105 ring-4 ring-amber-300'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 6: APPLY
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <Pip mood="thinking" size="lg" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-4 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Young Scientist Mastery Challenge! 🏆
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-bold mb-6">
                A chemist synthesizes a brand-new ultra-strong fiber in a laboratory from chemical polymers. How should we classify this new material?
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => sounds.boing()}
                  className="p-5 rounded-3xl border-3 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-black text-sm cursor-pointer"
                >
                  🌿 Natural Material
                </button>

                <button
                  onClick={handleNextPhase}
                  className="p-5 rounded-3xl border-3 border-emerald-400 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-sm cursor-pointer shadow-lg ring-4 ring-emerald-300 scale-105"
                >
                  🏭 Synthetic Material ✨
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
