import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import type { CourseChapter } from '@/data/masterCurriculum';
import {
  Sparkles,
  Volume2,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Eye,
  Star,
  Award,
} from 'lucide-react';

interface Props {
  chapterData?: CourseChapter;
  onStartLab: () => void;
  accentBorderColor?: string;
}

interface MysterySpecimen {
  id: string;
  emoji: string;
  name: string;
  superpowerFact: string;
}

export const InteractiveChapterIntroCard: React.FC<Props> = ({
  chapterData,
  onStartLab,
  accentBorderColor = 'border-sky-400',
}) => {
  const [discoveredItems, setDiscoveredItems] = useState<string[]>([]);
  const [activeSpecimen, setActiveSpecimen] = useState<MysterySpecimen | null>(null);

  const intro = chapterData?.chapterIntro || ({} as any);
  const journal = chapterData?.fieldJournal || ({} as any);
  const facts = journal?.specimenFacts || [];

  // Generate 4 interactive discovery specimens based on chapter data
  const specimens: MysterySpecimen[] = facts.length >= 3
    ? facts.map((f: any, idx: number) => ({
        id: `specimen-${idx}`,
        emoji: f.icon || '🔬',
        name: f.title || 'Specimen',
        superpowerFact: f.detail || 'Discovered a unique microscopic property!',
      }))
    : [
        { id: 'item-1', emoji: '🦋', name: 'Butterfly', superpowerFact: 'Butterflies can taste sweet nectar with receptors on their feet!' },
        { id: 'item-2', emoji: '🐜', name: 'Scout Ant', superpowerFact: 'Ants leave chemical scent trails called pheromones to guide friends!' },
        { id: 'item-3', emoji: '🐍', name: 'Snake', superpowerFact: 'Snakes feel sound waves as ground vibrations through their lower jawbone!' },
        { id: 'item-4', emoji: '🦅', name: 'Eagle', superpowerFact: 'Eagles have 4x sharper telescopic eyesight and spot mice from 2 km away!' },
      ];

  const handleTapSpecimen = (specimen: MysterySpecimen) => {
    sounds.sparkle();
    setActiveSpecimen(specimen);
    if (!discoveredItems.includes(specimen.id)) {
      setDiscoveredItems((prev) => [...prev, specimen.id]);
    }
    voiceAssistant.speak(`${specimen.name}: ${specimen.superpowerFact}`);
  };

  const handleReadPip = () => {
    sounds.pop();
    const pipMsg = intro?.hookScene || 'Animals and plants have amazing senses. Some can see, hear, smell, or feel things humans cannot!';
    voiceAssistant.speak(pipMsg);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 select-none font-sans">
      {/* ── 1. Main Interactive Pip Greeting Card (Clean, Grade-5 Conversational) ── */}
      <div className={`w-full bg-white/98 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 ${accentBorderColor} shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}>
        {/* Pip Mascot */}
        <div className="shrink-0 flex flex-col items-center">
          <Pip mood={discoveredItems.length > 0 ? 'celebrating' : 'curious'} size="lg" />
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1">
            Pip • Guide
          </span>
        </div>

        {/* Conversational Bite-Sized Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-950 font-black text-xs">
              {chapterData?.syllabusRef || 'CBSE Class 5 EVS'} • Chapter {chapterData?.chapterNumber || 1}
            </span>
            <button
              onClick={handleReadPip}
              className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95 shadow-xs"
              title="Hear Pip read aloud"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {intro?.title || chapterData?.chapterTitle || 'Chapter Science Quest'} {chapterData?.icon || '🔬'}
          </h1>

          {/* 1-2 Exciting sentences max */}
          <p className="text-sm sm:text-base font-bold text-slate-700 mt-2 leading-relaxed">
            {intro?.hookScene || 'Animals and plants have amazing senses. Some can see, hear, smell, or feel things humans cannot!'}
          </p>

          {/* Quick "Did you know?" Mini Card */}
          <div className="mt-3 p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-start gap-2 shadow-2xs">
            <span className="text-lg">🔎</span>
            <div>
              <span className="text-amber-800 uppercase tracking-wider text-[10px] block font-black">Did you know?</span>
              <span className="font-bold">{intro?.bigGuidingQuestion || 'Animal senses help them hunt for food, spot danger, and travel miles across the wild.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. INTERACTIVE MINI-GAME: Tap Specimens to Discover Superpowers ── */}
      <div className="w-full bg-slate-950 p-6 sm:p-7 rounded-[36px] border-4 border-indigo-400 shadow-2xl text-white">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">👆</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Tap Any Floating Specimen to Discover Its Superpower:
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                Unlock secret science facts to power up your lab experiments!
              </p>
            </div>
          </div>

          {/* Sparks Counter */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-900/80 rounded-2xl border border-indigo-400/50 text-xs font-mono font-black text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{discoveredItems.length} / {specimens.length} Unlocked</span>
          </div>
        </div>

        {/* 4 Clickable Specimen Floating Bubbles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specimens.map((item) => {
            const isUnlocked = discoveredItems.includes(item.id);
            const isSelected = activeSpecimen?.id === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleTapSpecimen(item)}
                className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-500 border-white text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105'
                    : isUnlocked
                    ? 'bg-slate-900 border-emerald-400 text-white'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-sky-400'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow-md">{item.emoji}</span>
                <span className="text-xs font-black truncate w-full">{item.name}</span>
                <span className={`text-[9px] font-black uppercase mt-1 px-2 py-0.2 rounded-full ${
                  isUnlocked ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isUnlocked ? '✅ Unlocked' : 'Tap to scan'}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Superpower Reveal Pop-out */}
        <AnimatePresence mode="wait">
          {activeSpecimen && (
            <motion.div
              key={activeSpecimen.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 border-2 border-indigo-400 flex items-start gap-3 shadow-lg"
            >
              <span className="text-3xl">{activeSpecimen.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    {activeSpecimen.name} Discovery:
                  </h4>
                  <span className="text-[10px] font-mono bg-indigo-800 px-2 py-0.2 rounded-full text-indigo-200">
                    +1 Science Spark ✨
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                  {activeSpecimen.superpowerFact}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 3. Action Launch Button (Big, Friendly, Prominent) ── */}
      <div className="flex justify-center mt-2">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.fanfare();
            onStartLab();
          }}
          className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black text-sm sm:text-base shadow-[0_6px_0_#065F46] active:translate-y-1 cursor-pointer flex items-center gap-3 transition-all"
        >
          <span>🚀 LET'S START THE LAB EXPERIMENTS!</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
