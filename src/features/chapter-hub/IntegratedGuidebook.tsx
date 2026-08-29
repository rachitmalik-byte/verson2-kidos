import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Volume2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  RaincoatCottonIllustration,
  RaincoatSyntheticIllustration,
  NylonIllustration,
  CottonIllustration,
  PlasticIllustration,
  WireIllustration,
  KettleIllustration,
} from '@/components/illustrations/MaterialIllustrations';

export interface GuideStory {
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

export const GUIDE_STORIES: GuideStory[] = [
  {
    id: 'raincoat',
    title: 'The Tale of Two Raincoats',
    subtitle: 'Natural Plant Fibres vs. Synthetic Waterproof Polymers',
    badge: 'Lesson 1',
    color: 'from-amber-400 to-orange-500',
    illustration: (
      <div className="flex items-center justify-center gap-4 py-3">
        <RaincoatCottonIllustration className="w-20 h-20" />
        <span className="font-black text-xl text-slate-400">VS</span>
        <RaincoatSyntheticIllustration className="w-20 h-20" />
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
      <div className="flex items-center justify-center py-3">
        <NylonIllustration className="w-24 h-24" />
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
      <div className="flex items-center justify-center gap-4 py-3">
        <CottonIllustration className="w-20 h-20" />
        <PlasticIllustration className="w-20 h-20" />
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
      <div className="flex items-center justify-center gap-4 py-3">
        <WireIllustration className="w-20 h-20" />
        <KettleIllustration className="w-20 h-20" />
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

export const IntegratedGuidebook: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const story = GUIDE_STORIES[activeStoryIndex];

  useEffect(() => {
    voiceAssistant.stop();
    setIsReadingAloud(false);
  }, [activeStoryIndex]);

  const handleReadAloud = () => {
    if (isReadingAloud) {
      voiceAssistant.stop();
      setIsReadingAloud(false);
    } else {
      sounds.sparkle();
      setIsReadingAloud(true);
      const fullText = `${story.title}. ${story.subtitle}. ${story.content.join(' ')}`;
      voiceAssistant.speak(fullText, () => {
        setIsReadingAloud(false);
      });
    }
  };

  const handleNextStory = () => {
    sounds.pop();
    voiceAssistant.stop();
    if (activeStoryIndex < GUIDE_STORIES.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
    } else {
      setActiveStoryIndex(0);
    }
  };

  const handlePrevStory = () => {
    sounds.pop();
    voiceAssistant.stop();
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    } else {
      setActiveStoryIndex(GUIDE_STORIES.length - 1);
    }
  };

  return (
    <div className="w-full bg-white/95 rounded-3xl md:rounded-[36px] p-5 sm:p-7 border-4 border-indigo-400 shadow-2xl flex flex-col gap-6 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-300">
              CBSE Class 5 EVS Field Guidebook
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {story.title}
            </h2>
          </div>
        </div>

        {/* Read Aloud & Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReadAloud}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isReadingAloud
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isReadingAloud ? 'Stop Voice' : 'Read Chapter 🔊'}</span>
          </button>
        </div>
      </div>

      {/* Story Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Illustration & Story Highlights (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-6 border-2 border-indigo-100 shadow-inner">
          <div className="mb-2">{story.illustration}</div>

          <div className="w-full bg-amber-100/90 border border-amber-300 rounded-2xl p-3.5 text-xs font-black text-amber-950 shadow-xs mb-3 text-center">
            <span className="text-[9px] uppercase tracking-wider text-amber-800 font-black block mb-0.5">
              ✨ Core Science Law
            </span>
            <span>{story.keyIdea}</span>
          </div>

          <div className="w-full bg-sky-50 border border-sky-200 rounded-2xl p-3 text-xs font-bold text-sky-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-[10px] uppercase tracking-wider text-sky-700 block">
                DID YOU KNOW?
              </span>
              <span>{story.didYouKnow}</span>
            </div>
          </div>
        </div>

        {/* Right Paragraphs Reader (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-black text-indigo-700 uppercase tracking-wider block">
              {story.subtitle}
            </span>

            {story.content.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom Lesson Slider Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handlePrevStory}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Lesson
            </button>

            <div className="flex gap-1.5">
              {GUIDE_STORIES.map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    sounds.pop();
                    setActiveStoryIndex(sIdx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    sIdx === activeStoryIndex ? 'w-7 bg-indigo-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextStory}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Next Lesson <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
