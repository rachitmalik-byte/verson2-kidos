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
import { Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, TreePine, Factory } from 'lucide-react';

type Phase = 'HOOK' | 'SORTING' | 'REFLECT' | 'UNDERSTANDING' | 'PRACTICE' | 'APPLY';

interface MaterialItem {
  id: string;
  name: string;
  renderIcon: (className?: string) => React.ReactNode;
  type: 'natural' | 'synthetic';
  hint: string;
}

const SORTING_ITEMS: MaterialItem[] = [
  { id: 'cotton', name: 'Cotton Boll', renderIcon: (cls) => <CottonIllustration className={cls} />, type: 'natural', hint: 'Harvested from cotton plants!' },
  { id: 'wool', name: 'Fluffy Wool', renderIcon: (cls) => <WoolIllustration className={cls} />, type: 'natural', hint: 'Gently sheared from sheep!' },
  { id: 'silk', name: 'Silk Cocoon', renderIcon: (cls) => <SilkIllustration className={cls} />, type: 'natural', hint: 'Spun by silkworm caterpillars!' },
  { id: 'wood', name: 'Forest Wood', renderIcon: (cls) => <WoodIllustration className={cls} />, type: 'natural', hint: 'From trees in the forest!' },
  { id: 'nylon', name: 'Nylon Cord', renderIcon: (cls) => <NylonIllustration className={cls} />, type: 'synthetic', hint: 'Engineered by chemists!' },
  { id: 'polyester', name: 'Polyester Shirt', renderIcon: (cls) => <PolyesterIllustration className={cls} />, type: 'synthetic', hint: 'Crafted with chemical polymers!' },
  { id: 'plastic', name: 'Plastic Bottle', renderIcon: (cls) => <PlasticIllustration className={cls} />, type: 'synthetic', hint: 'Moulded in modern factories!' },
  { id: 'rubber', name: 'Synthetic Tyre', renderIcon: (cls) => <RubberIllustration className={cls} />, type: 'synthetic', hint: 'Manufactured for vehicles!' },
];

export function SortingMission() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const [sortedItems, setSortedItems] = useState<Record<string, 'natural' | 'synthetic'>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);
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
      // Complete Mission and celebrate
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
              PHASE 2: SORTING DESK (Interactive Toy Trays with Vector Icons)
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
                <h2 className="text-3xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  What Did You Discover? 🔍
                </h2>
                <p className="text-slate-600 font-bold text-sm">Observe the two groups on the workbench!</p>
              </div>

              {/* Question 1: Nature */}
              <div className="w-full bg-white p-6 rounded-3xl border-3 border-emerald-200 shadow-lg">
                <h3 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <span>1. What do Cotton, Wool, Silk & Wood all have in common?</span>
                </h3>
                <div className="space-y-2.5">
                  {[
                    'They come directly from living plants, animals, or trees in nature.',
                    'They are artificial materials cooked up in chemical factories.',
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === 0) sounds.success();
                        else sounds.boing();
                        setReflectAnswer1(idx);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-extrabold text-sm transition-all cursor-pointer ${
                        reflectAnswer1 === idx
                          ? idx === 0
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_#059669]'
                            : 'bg-rose-500 text-white border-rose-600 shadow-[0_4px_0_#E11D48]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Synthetic */}
              <div className="w-full bg-white p-6 rounded-3xl border-3 border-sky-200 shadow-lg">
                <h3 className="font-black text-slate-800 text-base mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏭</span>
                  <span>2. What do Nylon, Polyester & Plastic all have in common?</span>
                </h3>
                <div className="space-y-2.5">
                  {[
                    'They were invented and created by humans using chemical processes.',
                    'They grow naturally on bushes and can be harvested like berries.',
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === 0) sounds.success();
                        else sounds.boing();
                        setReflectAnswer2(idx);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-extrabold text-sm transition-all cursor-pointer ${
                        reflectAnswer2 === idx
                          ? idx === 0
                            ? 'bg-sky-500 text-white border-sky-600 shadow-[0_4px_0_#0284C7]'
                            : 'bg-rose-500 text-white border-rose-600 shadow-[0_4px_0_#E11D48]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 4: UNDERSTANDING (Definitions)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'UNDERSTANDING' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <Pip mood="explaining" size="lg" />
                <PipSpeechBubble
                  message="Scientists give these two categories special scientific names! Meet Natural & Synthetic!"
                  isVisible={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Natural Materials Bento */}
                <div className="bg-white p-8 rounded-3xl border-4 border-emerald-300 shadow-2xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <CottonIllustration className="w-full h-full" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Category 1</span>
                      <h3 className="text-2xl font-black text-emerald-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Natural Material
                      </h3>
                    </div>
                  </div>
                  <p className="text-base text-slate-700 font-bold leading-relaxed mb-6">
                    A substance that comes straight from nature — gathered from living plants, animals, trees, or minerals in the earth.
                  </p>
                  <div className="mt-auto pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-slate-500">
                    <span>Key Specimens:</span>
                    <span className="text-emerald-700 text-sm">Cotton, Wool, Silk, Wood</span>
                  </div>
                </div>

                {/* Synthetic Materials Bento */}
                <div className="bg-white p-8 rounded-3xl border-4 border-sky-300 shadow-2xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <NylonIllustration className="w-full h-full" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-sky-600">Category 2</span>
                      <h3 className="text-2xl font-black text-sky-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Synthetic Material
                      </h3>
                    </div>
                  </div>
                  <p className="text-base text-slate-700 font-bold leading-relaxed mb-6">
                    A man-made substance engineered by humans using chemical reactions in factories — not found ready-made in nature.
                  </p>
                  <div className="mt-auto pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-slate-500">
                    <span>Key Specimens:</span>
                    <span className="text-sky-700 text-sm">Nylon, Polyester, Plastic, Acrylic</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 5: SPEED ROUND (No Hints)
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'PRACTICE' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-slate-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Speed Challenge! ⚡
                </h2>
                <p className="text-slate-600 font-bold text-sm">Sort these 4 new materials without any hints!</p>
              </div>

              {/* Trays */}
              <div className="grid grid-cols-2 gap-6 w-full mb-6">
                <button
                  onClick={() => {
                    if (activePracticeItem) {
                      const targets: Record<string, 'natural' | 'synthetic'> = {
                        iron: 'natural',
                        gold: 'natural',
                        acrylic: 'synthetic',
                        rayon: 'synthetic',
                      };
                      if (targets[activePracticeItem] === 'natural') {
                        sounds.success();
                        setPracticeSorted((p) => ({ ...p, [activePracticeItem]: 'natural' }));
                        setActivePracticeItem(null);
                      } else {
                        sounds.boing();
                        setActivePracticeItem(null);
                      }
                    }
                  }}
                  className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    activePracticeItem
                      ? 'border-emerald-500 bg-emerald-100 shadow-xl scale-102 animate-pulse'
                      : 'border-emerald-300 bg-emerald-50'
                  }`}
                >
                  <span className="text-4xl mb-1">🌿</span>
                  <span className="font-black text-lg text-emerald-800">Natural</span>
                </button>

                <button
                  onClick={() => {
                    if (activePracticeItem) {
                      const targets: Record<string, 'natural' | 'synthetic'> = {
                        iron: 'natural',
                        gold: 'natural',
                        acrylic: 'synthetic',
                        rayon: 'synthetic',
                      };
                      if (targets[activePracticeItem] === 'synthetic') {
                        sounds.success();
                        setPracticeSorted((p) => ({ ...p, [activePracticeItem]: 'synthetic' }));
                        setActivePracticeItem(null);
                      } else {
                        sounds.boing();
                        setActivePracticeItem(null);
                      }
                    }
                  }}
                  className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    activePracticeItem
                      ? 'border-sky-500 bg-sky-100 shadow-xl scale-102 animate-pulse'
                      : 'border-sky-300 bg-sky-50'
                  }`}
                >
                  <span className="text-4xl mb-1">🏭</span>
                  <span className="font-black text-lg text-sky-800">Synthetic</span>
                </button>
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {[
                  { id: 'iron', name: 'Iron Ore', icon: <span className="text-5xl">⛏️</span> },
                  { id: 'gold', name: 'Gold Nugget', icon: <span className="text-5xl">🪙</span> },
                  { id: 'acrylic', name: 'Acrylic Yarn', icon: <WoolIllustration className="w-12 h-12" /> },
                  { id: 'rayon', name: 'Rayon Silk', icon: <SilkIllustration className="w-12 h-12" /> },
                ].map((item) => {
                  const isSorted = practiceSorted[item.id] !== undefined;
                  const isSelected = activePracticeItem === item.id;

                  if (isSorted) return null;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        sounds.pop();
                        setActivePracticeItem(isSelected ? null : item.id);
                      }}
                      className={`p-4 rounded-2xl border-3 flex flex-col items-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100 shadow-xl ring-4 ring-amber-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-md'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center mb-1">
                        {item.icon}
                      </div>
                      <span className="font-black text-sm text-slate-800">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {Object.keys(practiceSorted).length === 4 && (
                <div className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-sm font-black text-emerald-900 shadow-md">
                  🎉 Fantastic! 4 out of 4 sorted like a master scientist!
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════════
              PHASE 6: APPLY
          ════════════════════════════════════════════════════════════════════════ */}
          {currentPhase === 'APPLY' && (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-white p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl mb-6 w-full text-center">
                <span className="text-6xl mb-2 block animate-bounce">🔬🧪</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Real-World Scientist Dilemma
                </h2>
                <p className="text-base text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                  A team of research chemists invents a super-stretchy material inside a high-tech laboratory by combining petroleum chemicals.
                  How should they classify this new substance?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sounds.fanfare();
                    handleNextPhase();
                  }}
                  className="p-8 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-4 border-emerald-400 shadow-lg text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    <NylonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-2xl text-slate-800 mb-1">Synthetic Material</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    Created by humans with chemistry ✓
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sounds.boing()}
                  className="p-8 rounded-3xl bg-white hover:bg-rose-50 border-4 border-slate-200 opacity-60 text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    <CottonIllustration className="w-full h-full" />
                  </div>
                  <span className="font-black text-2xl text-slate-800 mb-1">Natural Material</span>
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    Incorrect (Not found in nature)
                  </span>
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MissionLayout>
  );
}
