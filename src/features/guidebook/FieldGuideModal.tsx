import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  X,
  Volume2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Tv,
  Play,
  Clock,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
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

interface VideoChapter {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  duration: string;
  category: string;
  color: string;
  description: string;
  keyTakeaway: string;
  timestamps: { time: number; label: string; icon: string }[];
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

const SCIENCE_VIDEOS: VideoChapter[] = [
  {
    id: 'vid-1',
    title: 'Synthetic Fibres & Plastics Complete Guide',
    subtitle: 'From Natural Raw Matter to Man-Made Miracle Polymers',
    youtubeId: 'iG9A8F-OF_Y',
    duration: '12:45',
    category: 'Class 8 Science Ch 3',
    color: 'from-sky-500 to-indigo-600',
    description:
      'Explore the full journey of how materials are made! Learn the fundamental differences between plant/animal fibres (cotton, wool, silk) and lab-synthesized polymers (nylon, acrylic, polyester).',
    keyTakeaway:
      'Natural fibres are limited by nature; synthetic fibres can be custom-engineered for specific superpowers like extreme strength or waterproofing!',
    timestamps: [
      { time: 0, label: 'Introduction: What is a Material?', icon: '🧱' },
      { time: 75, label: 'Natural Fibres from Plants & Animals', icon: '🌿' },
      { time: 180, label: 'The Invention of Synthetic Polymers', icon: '🧪' },
      { time: 320, label: 'Nylon, Polyester & Acrylic Breakdown', icon: '🧵' },
      { time: 480, label: 'Plastics & The Environment', icon: '🌍' },
    ],
  },
  {
    id: 'vid-2',
    title: 'How Synthetic Materials & Nylon are Made',
    subtitle: 'Petroleum Chemistry & The Tensile Strength Machine',
    youtubeId: 'IBdIzj0elzI',
    duration: '09:30',
    category: 'Lab Experiment',
    color: 'from-amber-500 to-rose-600',
    description:
      'Go inside the chemistry lab! Witness polymer polymerization reactions and see how molten nylon is extruded through spinnerets to create threads stronger than steel wire.',
    keyTakeaway:
      'Nylon fibres are formed by spinning molten chemical chains through micro-holes called spinnerets, aligning the molecules for maximum tensile strength.',
    timestamps: [
      { time: 0, label: 'Welcome to the Polymer Lab', icon: '🔬' },
      { time: 60, label: 'How Coal & Petroleum become Fibres', icon: '⚡' },
      { time: 195, label: 'The Extrusion Spinneret Process', icon: '🧶' },
      { time: 310, label: 'Tensile Strength Testing Rig', icon: '💪' },
      { time: 440, label: 'Everyday Nylon Inventions', icon: '🪂' },
    ],
  },
  {
    id: 'vid-3',
    title: 'Plastics, Microplastics & Planet Earth',
    subtitle: 'Understanding Biodegradability & Recycling Science',
    youtubeId: 'PDuiSnBYCQc',
    duration: '11:15',
    category: 'Environmental Science',
    color: 'from-emerald-500 to-teal-600',
    description:
      'Discover why plastics are both the most useful material ever invented and our biggest environmental challenge. Learn about microplastics and how recycling gives plastic a second life.',
    keyTakeaway:
      'Because synthetic plastics are non-biodegradable, we must practice the 3 Rs (Reduce, Reuse, Recycle) to protect marine life and soil.',
    timestamps: [
      { time: 0, label: 'Why Plastics are Everywhere', icon: '🫙' },
      { time: 90, label: 'Biodegradable vs Non-Biodegradable', icon: '⏳' },
      { time: 240, label: 'What are Microplastics?', icon: '🌊' },
      { time: 380, label: 'How Plastic Recycling Factories Work', icon: '♻️' },
      { time: 510, label: 'How Kids Can Help Protect Earth', icon: '🌱' },
    ],
  },
];

export const FieldGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'videos'>('stories');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [isReadingStory, setIsReadingStory] = useState(false);

  const storyChapter = STORY_CHAPTERS[activeChapterIndex];
  const videoChapter = SCIENCE_VIDEOS[activeVideoIndex];

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

  const handleReadStoryAloud = () => {
    sounds.pop();
    setIsReadingStory(true);
    const fullStoryText = `${storyChapter.title}. ${storyChapter.subtitle}. ${storyChapter.content.join(' ')} Key science takeaway: ${storyChapter.keyIdea}`;
    voiceAssistant.speak(fullStoryText, () => setIsReadingStory(false));
  };

  const handleReadVideoSummary = () => {
    sounds.pop();
    setIsReadingStory(true);
    const summaryText = `${videoChapter.title}. ${videoChapter.subtitle}. ${videoChapter.description} Key concept: ${videoChapter.keyTakeaway}`;
    voiceAssistant.speak(summaryText, () => setIsReadingStory(false));
  };

  const handleTimestampClick = (seconds: number) => {
    sounds.pop();
    setCurrentTimestamp(seconds);
  };

  return (
    <>
      {/* ── Floating "Field Guide & Video Lab" Launcher Button ── */}
      <motion.button
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-xs md:text-sm px-4 py-2.5 rounded-full border-3 border-amber-300 shadow-[0_6px_0_#C2410C] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer transition-all"
        title="Open Interactive Science Storybook & Video Cinema"
      >
        <BookOpen className="w-5 h-5 text-slate-950" />
        <span className="hidden sm:inline">Science Guidebook & Video Lab 🎬</span>
        <span className="sm:hidden">Guide & Videos 🎬</span>
      </motion.button>

      {/* ── Modal Storybook & Video Theatre ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-8">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClose}
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
                />

                {/* Reader Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  className="relative z-10 bg-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-amber-400 shadow-2xl flex flex-col overflow-hidden font-sans max-w-5xl w-full max-h-[92vh]"
                >
              {/* Header with Segmented Mode Switcher */}
              <div className="p-4 md:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md border-b-2 border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl font-black shadow-md">
                    {activeTab === 'stories' ? <BookOpen className="w-6 h-6" /> : <Tv className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3
                      className="text-lg md:text-2xl font-black text-amber-400 tracking-tight"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      PolyQuest Discovery Lab
                    </h3>
                    <p className="text-xs text-slate-400 font-bold hidden sm:block">
                      Interactive Visual Textbook & Video Cinema
                    </p>
                  </div>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setIsReadingStory(false);
                      setActiveTab('stories');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'stories'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Illustrated Stories (4)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setIsReadingStory(false);
                      setActiveTab('videos');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'videos'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    <span>Video Lab (3)</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
              </div>

              {/* ════════════════════════════════════════════════════════════════════
                  TAB 1: ILLUSTRATED SCIENCE STORIES
              ════════════════════════════════════════════════════════════════════ */}
              {activeTab === 'stories' && (
                <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-gradient-to-b from-amber-50/50 to-white space-y-6">
                  {/* Story Title & Narration */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black uppercase tracking-wider">
                        {storyChapter.badge}
                      </span>
                      <h2 className="text-xl md:text-3xl font-black text-slate-900 mt-1">
                        {storyChapter.title}
                      </h2>
                      <p className="text-xs md:text-sm font-extrabold text-slate-600">
                        {storyChapter.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={handleReadStoryAloud}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isReadingStory ? 'Reading Aloud...' : 'Listen to Story 🎙️'}</span>
                    </button>
                  </div>

                  {/* Hero Illustration Box */}
                  <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-inner flex items-center justify-center">
                    {storyChapter.illustration}
                  </div>

                  {/* Story Content Paragraphs */}
                  <div className="space-y-3.5 text-slate-800 font-bold text-sm md:text-base leading-relaxed">
                    {storyChapter.content.map((p, idx) => (
                      <p key={idx} className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-xs">
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
                      <p className="font-extrabold text-sm md:text-base text-amber-950">{storyChapter.keyIdea}</p>
                    </div>
                  </div>

                  {/* Did You Know? Flip Fact */}
                  <div className="p-4 bg-sky-50 rounded-3xl border-2 border-sky-200 shadow-xs flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-sky-900 mb-1">Did You Know?</h4>
                      <p className="font-extrabold text-xs md:text-sm text-sky-950">{storyChapter.didYouKnow}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════════
                  TAB 2: INTERACTIVE SCIENCE VIDEO LAB & CINEMA
              ════════════════════════════════════════════════════════════════════ */}
              {activeTab === 'videos' && (
                <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-slate-950 text-white space-y-6">
                  {/* Video Selector Pills */}
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {SCIENCE_VIDEOS.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          sounds.pop();
                          voiceAssistant.stop();
                          setIsReadingStory(false);
                          setActiveVideoIndex(i);
                          setCurrentTimestamp(0);
                        }}
                        className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap flex items-center gap-2 border-2 transition-all cursor-pointer ${
                          i === activeVideoIndex
                            ? 'bg-rose-600 text-white border-rose-400 shadow-lg scale-102 ring-4 ring-rose-500/30'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          Video {i + 1}: {v.title.slice(0, 24)}...
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Main Video Cinema Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Responsive YouTube Player */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black">
                        <iframe
                          key={`${videoChapter.youtubeId}-${currentTimestamp}`}
                          src={`https://www.youtube-nocookie.com/embed/${videoChapter.youtubeId}?autoplay=1&start=${currentTimestamp}&rel=0`}
                          title={videoChapter.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>

                      {/* Video Meta Info */}
                      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-black uppercase tracking-wider">
                            {videoChapter.category}
                          </span>
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Duration: {videoChapter.duration}</span>
                          </span>
                        </div>

                        <h2
                          className="text-xl md:text-2xl font-black text-white"
                          style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                          {videoChapter.title}
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 font-bold mt-1">
                          {videoChapter.subtitle}
                        </p>

                        <p className="text-xs md:text-sm text-slate-300 mt-3 leading-relaxed">
                          {videoChapter.description}
                        </p>

                        <button
                          onClick={handleReadVideoSummary}
                          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{isReadingStory ? 'Narrating Concept...' : 'Have Pip Explain This Video 🎙️'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Right 1 Col: Interactive Timestamps & Key Takeaways */}
                    <div className="flex flex-col gap-4">
                      {/* Interactive Chapter Timestamps */}
                      <div className="bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-800 flex-1">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <h4 className="font-black text-xs uppercase tracking-wider text-amber-400">
                            Jump to Key Moment
                          </h4>
                        </div>

                        <div className="space-y-2">
                          {videoChapter.timestamps.map((ts, idx) => {
                            const minutes = Math.floor(ts.time / 60);
                            const seconds = ts.time % 60;
                            const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                            return (
                              <button
                                key={idx}
                                onClick={() => handleTimestampClick(ts.time)}
                                className={`w-full p-2.5 rounded-2xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                  currentTimestamp === ts.time
                                    ? 'bg-rose-600/30 text-rose-300 border-rose-500'
                                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span>{ts.icon}</span>
                                  <span className="truncate">{ts.label}</span>
                                </div>
                                <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded-md text-amber-300 shrink-0 ml-2">
                                  {timeStr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Key Takeaway Card */}
                      <div className="p-4 bg-gradient-to-br from-emerald-900/60 to-teal-950 rounded-3xl border border-emerald-500/40 text-xs">
                        <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Core Science Discovery</span>
                        </div>
                        <p className="text-emerald-100 font-bold leading-snug">
                          {videoChapter.keyTakeaway}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Pagination Bar for Stories */}
              {activeTab === 'stories' && (
                <div className="p-4 md:p-5 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setIsReadingStory(false);
                      setActiveChapterIndex(
                        (prev) => (prev - 1 + STORY_CHAPTERS.length) % STORY_CHAPTERS.length
                      );
                    }}
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
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.stop();
                      setIsReadingStory(false);
                      setActiveChapterIndex((prev) => (prev + 1) % STORY_CHAPTERS.length);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                  >
                    <span>Next Story</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
};
