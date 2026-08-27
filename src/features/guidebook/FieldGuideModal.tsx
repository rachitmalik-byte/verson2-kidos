import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Volume2, Sparkles, ChevronRight, ChevronLeft, Lightbulb, Compass, Award } from 'lucide-react';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { sounds } from '@/lib/sounds';
import {
  RaincoatCottonIllustration,
  RaincoatSyntheticIllustration,
  NylonIllustration,
  CottonIllustration,
  PlasticIllustration,
  WireIllustration,
  KettleIllustration,
  RubberIllustration,
} from '@/components/illustrations/MaterialIllustrations';

interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  illustration: React.ReactNode;
  content: string[];
  keyIdea: string;
  didYouKnow: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'raincoat',
    title: 'The Tale of Two Raincoats',
    subtitle: 'Natural Plant Fibres vs. Synthetic Waterproof Polymers',
    badge: 'Lesson 1',
    color: 'from-amber-400 to-orange-500',
    illustration: (
      <div className="flex items-center justify-center gap-4 py-4">
        <RaincoatCottonIllustration className="w-24 h-24" />
        <span className="font-black text-2xl text-slate-400">VS</span>
        <RaincoatSyntheticIllustration className="w-24 h-24" />
      </div>
    ),
    content: [
      'Imagine walking home when dark rain clouds roll in! You look into your closet and see two raincoats.',
      'Raincoat A is made from Natural Cotton gathered from cotton plants. Cotton is wonderful for soft shirts because its fibres have tiny spaces that absorb water and sweat.',
      'But in heavy rain, that absorption makes Raincoat A soak up water like a sponge, becoming heavy and cold!',
      'Raincoat B is made from Synthetic Polyester engineered in a laboratory. Water cannot enter polyester fibres at all — instead, rain forms round beads and rolls right off!',
    ],
    keyIdea: '🧱 MATERIAL decides ⚡ PROPERTY, which decides 🎯 USE!',
    didYouKnow: 'Cotton can absorb up to 27 times its own weight in water!',
  },
  {
    id: 'nylon',
    title: 'The Secret of Super-Nylon (1935)',
    subtitle: 'The First 100% Man-Made Miracle Fibre',
    badge: 'Lesson 2',
    color: 'from-sky-400 to-blue-600',
    illustration: (
      <div className="flex items-center justify-center py-4">
        <NylonIllustration className="w-28 h-28" />
      </div>
    ),
    content: [
      'Before 1935, every thread in the world came from plants or animals — like sheep wool and silkworm cocoons.',
      'Then, brilliant chemists discovered that by linking petroleum chemicals together under high pressure, they could create a brand-new fibre called Nylon.',
      'When scientists tested nylon on tensile weight machines, they were stunned: a single thin strand of nylon held MORE weight than steel wire of the exact same thickness!',
      'Today, nylon is used for parachutes, mountain climbing ropes, fishing nets, and toothbrush bristles.',
    ],
    keyIdea: 'Nylon has extreme tensile strength and will not snap under heavy loads.',
    didYouKnow: 'During World War II, nylon was so valuable for parachutes that people lined up for miles to buy nylon stockings!',
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & The Flame Test',
    subtitle: 'Why Natural vs Synthetic Behave Totally Differently',
    badge: 'Lesson 3',
    color: 'from-rose-400 to-red-600',
    illustration: (
      <div className="flex items-center justify-center gap-4 py-4">
        <CottonIllustration className="w-24 h-24" />
        <PlasticIllustration className="w-24 h-24" />
      </div>
    ),
    content: [
      'One of the most important lessons in science is understanding how different materials react to heat and open flames.',
      'Natural Cotton burns smoothly like dry paper and turns into soft, crumbly gray ash that falls away.',
      'Synthetic fibres (like Polyester and Nylon) do NOT turn to ash. Instead, they MELT and shrink into hot, sticky molten plastic beads that cling to skin!',
      'This is why you must ALWAYS wear natural cotton clothes during Diwali firecrackers or when helping in the kitchen.',
    ],
    keyIdea: 'Never wear synthetic clothes near open flames or firecrackers because they melt.',
    didYouKnow: 'Kitchen chef aprons are traditionally made of 100% pure thick cotton for heat protection!',
  },
  {
    id: 'plastics',
    title: 'Plastic: The Super-Insulator',
    subtitle: 'From Electrical Wires to Kettle Handles',
    badge: 'Lesson 4',
    color: 'from-emerald-400 to-teal-600',
    illustration: (
      <div className="flex items-center justify-center gap-4 py-4">
        <WireIllustration className="w-24 h-24" />
        <KettleIllustration className="w-24 h-24" />
      </div>
    ),
    content: [
      'Look at an electrical charging cable: Inside is copper metal, which is an Electrical Conductor that lets electricity flow.',
      'Outside is a flexible plastic sleeve, which is an Electrical Insulator that stops electricity from escaping, keeping your hands 100% safe!',
      'Similarly, the handles of boiling tea kettles are made of Bakelite plastic because plastic does not conduct heat to your fingers.',
      'However, because plastics do not rot (non-biodegradable), we must always reduce, reuse, and recycle plastic items to protect our planet.',
    ],
    keyIdea: 'Plastics are electrical and thermal insulators, but must be recycled responsibly.',
    didYouKnow: 'It takes over 450 years for a single plastic bottle to decompose in nature!',
  },
];

export const FieldGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isReadingStory, setIsReadingStory] = useState(false);

  const chapter = STORY_CHAPTERS[activeChapterIndex];

  const handleOpen = () => {
    sounds.pop();
    setIsOpen(true);
  };

  const handleClose = () => {
    sounds.pop();
    voiceAssistant.stop();
    setIsReadingStory(false);
    setIsOpen(false);
  };

  const handleReadAloud = () => {
    sounds.pop();
    setIsReadingStory(true);
    const fullStoryText = `${chapter.title}. ${chapter.subtitle}. ${chapter.content.join(' ')} Key science idea: ${chapter.keyIdea}`;
    voiceAssistant.speak(fullStoryText, () => setIsReadingStory(false));
  };

  const handleNextChapter = () => {
    sounds.pop();
    voiceAssistant.stop();
    setIsReadingStory(false);
    setActiveChapterIndex((prev) => (prev + 1) % STORY_CHAPTERS.length);
  };

  const handlePrevChapter = () => {
    sounds.pop();
    voiceAssistant.stop();
    setIsReadingStory(false);
    setActiveChapterIndex((prev) => (prev - 1 + STORY_CHAPTERS.length) % STORY_CHAPTERS.length);
  };

  return (
    <>
      {/* ── Floating "Field Guide / Storybook" Launcher Button ── */}
      <motion.button
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs md:text-sm px-4 py-2.5 rounded-full border-3 border-amber-300 shadow-[0_6px_0_#C2410C] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer transition-all"
        title="Open Interactive Science Storybook & Field Guide"
      >
        <BookOpen className="w-5 h-5 text-slate-950" />
        <span className="hidden sm:inline">Interactive Science Guidebook</span>
        <span className="sm:hidden">Guidebook 📖</span>
      </motion.button>

      {/* ── Modal Storybook Reader ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-xs"
            />

            {/* Reader Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-4 md:inset-10 z-50 bg-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-amber-400 shadow-2xl flex flex-col overflow-hidden font-sans max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs border border-white/30">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-200 block">
                      PolyQuest Field Storybook
                    </span>
                    <h3
                      className="text-lg md:text-2xl font-black tracking-tight"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {chapter.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReadAloud}
                    className="px-3.5 py-2 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isReadingStory ? 'Reading...' : 'Listen to Story 🎙️'}</span>
                  </button>

                  <button
                    onClick={handleClose}
                    className="p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
                  >
                    <X className="w-6 h-6 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Scrollable Story Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-amber-50/50 to-white space-y-6">
                {/* Chapter Badge & Subtitle */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black uppercase tracking-wider">
                    {chapter.badge}
                  </span>
                  <span className="text-xs font-black text-slate-400">
                    Page {activeChapterIndex + 1} of {STORY_CHAPTERS.length}
                  </span>
                </div>

                {/* Hero Illustration */}
                <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-inner flex items-center justify-center">
                  {chapter.illustration}
                </div>

                {/* Story Content Paragraphs */}
                <div className="space-y-4 text-slate-800 font-bold text-sm md:text-base leading-relaxed">
                  {chapter.content.map((p, idx) => (
                    <p key={idx} className="bg-white/80 p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Key Science Law Card */}
                <div className="p-4 md:p-5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl border-2 border-amber-300 shadow-xs flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-amber-900 mb-1">
                      Big Science Takeaway
                    </h4>
                    <p className="font-extrabold text-sm md:text-base text-amber-950">{chapter.keyIdea}</p>
                  </div>
                </div>

                {/* Did You Know? Flip Fact */}
                <div className="p-4 bg-sky-50 rounded-3xl border-2 border-sky-200 shadow-xs flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-sky-900 mb-1">Did You Know?</h4>
                    <p className="font-extrabold text-xs md:text-sm text-sky-950">{chapter.didYouKnow}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Story Navigation Bar */}
              <div className="p-4 md:p-5 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
                <button
                  onClick={handlePrevChapter}
                  className="px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Story</span>
                </button>

                <div className="flex gap-1.5">
                  {STORY_CHAPTERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sounds.pop();
                        voiceAssistant.stop();
                        setActiveChapterIndex(i);
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        i === activeChapterIndex ? 'w-8 bg-orange-500' : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextChapter}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <span>Next Story</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
