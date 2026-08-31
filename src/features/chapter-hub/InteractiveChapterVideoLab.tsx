import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Tv,
  ArrowRight,
  RotateCcw,
  Zap,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

// Real Macro Photography Assets
import rawCottonBollImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import nylonCordImg from '@/assets/images/experiments/nylon_cord_intact.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import plasticDecayImg from '@/assets/images/decay/plastic_100yrs.jpg';

export interface VideoTimestamp {
  timeSeconds: number;
  timeLabel: string;
  title: string;
  summary: string;
  keyLaw: string;
  image: string;
  quickQuestion: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

export interface VideoCourse {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  durationLabel: string;
  totalSeconds: number;
  category: string;
  color: string;
  description: string;
  timestamps: VideoTimestamp[];
}

export const VIDEO_COURSES: VideoCourse[] = [
  {
    id: 'course-1',
    title: 'Natural vs. Synthetic Fibres & Materials',
    subtitle: 'CBSE Class 5 Science • Complete Visual Chapter Guide',
    youtubeId: 'iG9A8F-OF_Y',
    durationLabel: '07:30',
    totalSeconds: 450,
    category: 'CBSE Class 5 EVS • Materials',
    color: 'from-sky-500 to-indigo-600',
    description:
      'Explore how nature makes cotton, silk, and wool, and how scientists synthesize waterproof polyester and super-strong nylon!',
    timestamps: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: '1. What is a Material?',
        summary:
          'Everything around us is made of matter. Natural materials come from plants and animals, while synthetic materials are made in factories.',
        keyLaw: '🧱 Natural comes from Earth • Synthetic is synthesized by people!',
        image: rawCottonBollImg,
        quickQuestion: {
          question: 'Where do natural materials like cotton come from?',
          options: [
            { text: 'From living plants and animals in nature', isCorrect: true },
            { text: 'Synthesized from plastic in factories', isCorrect: false },
          ],
          explanation: 'Natural materials grow in nature from plants (cotton) and animals (wool, silk)!',
        },
      },
      {
        timeSeconds: 70,
        timeLabel: '01:10',
        title: '2. Natural Fibres (Cotton, Wool & Silk)',
        summary:
          'Cotton has natural microscopic pores that absorb sweat and let air circulate, keeping us cool in hot summers.',
        keyLaw: '☀️ Cotton absorbs sweat and cools the body through evaporation.',
        image: silkwormCocoonImg,
        quickQuestion: {
          question: 'Why are cotton clothes best for hot summers?',
          options: [
            { text: 'They absorb sweat and let air circulate freely', isCorrect: true },
            { text: 'They trap all heat and make you hotter', isCorrect: false },
          ],
          explanation: 'Cotton fibers have tiny natural pores that absorb sweat so it can evaporate coolly!',
        },
      },
      {
        timeSeconds: 150,
        timeLabel: '02:30',
        title: '3. Synthetic Nylon: The Super Strong Cord',
        summary:
          'Nylon was the first 100% synthetic fiber ever invented. It is made of long continuous plastic chains with immense tensile strength.',
        keyLaw: '🪢 Nylon is lightweight, elastic, and strong enough for climbing ropes!',
        image: nylonCordImg,
        quickQuestion: {
          question: 'Why do rock climbers choose nylon ropes?',
          options: [
            { text: 'Nylon has extreme tensile strength and will not snap easily', isCorrect: true },
            { text: 'Nylon is made of pure sugar crystals', isCorrect: false },
          ],
          explanation: 'Continuous synthetic polymer chains give nylon massive tensile breaking strength!',
        },
      },
      {
        timeSeconds: 230,
        timeLabel: '03:50',
        title: '4. Waterproof Polyester Raincoats',
        summary:
          'Polyester is hydrophobic, meaning water cannot soak into it. Rain forms round droplets and rolls right off!',
        keyLaw: '💧 Hydrophobic synthetic fabrics shed water without getting heavy.',
        image: polyesterRaincoatImg,
        quickQuestion: {
          question: 'What happens to water on a polyester raincoat?',
          options: [
            { text: 'It beads up into droplets and rolls off', isCorrect: true },
            { text: 'It soaks straight in and drenches your clothes', isCorrect: false },
          ],
          explanation: 'Polyester fibers are non-porous, so water droplets roll right off!',
        },
      },
      {
        timeSeconds: 310,
        timeLabel: '05:10',
        title: '5. Kitchen Safety: Ash vs. Melting Beads',
        summary:
          'Natural cotton burns into soft crumbly ash. But synthetic polyester MELTS into hot sticky plastic beads. Always wear cotton in the kitchen!',
        keyLaw: '🔥 NEVER wear synthetic clothes near open flames or stoves!',
        image: cottonBurningAshImg,
        quickQuestion: {
          question: 'What fabric should you wear while cooking or near fireworks?',
          options: [
            { text: '100% Cotton (burns to safe ash)', isCorrect: true },
            { text: 'Synthetic Polyester (melts onto skin)', isCorrect: false },
          ],
          explanation: 'Cotton turns to harmless ash, while synthetic polyester melts into hot sticky plastic!',
        },
      },
      {
        timeSeconds: 390,
        timeLabel: '06:30',
        title: '6. Plastic Waste & The 3 R’s',
        summary:
          'Because synthetic plastics do not decompose in soil, we must Reduce plastic waste, Reuse bottles, and Recycle polymers.',
        keyLaw: '♻️ Reduce, Reuse, and Recycle to protect nature!',
        image: plasticDecayImg,
        quickQuestion: {
          question: 'Why do synthetic plastics stay in soil for hundreds of years?',
          options: [
            { text: 'Soil microbes cannot digest man-made plastic bonds', isCorrect: true },
            { text: 'Plastic is delicious food for earthworms', isCorrect: false },
          ],
          explanation: 'Microorganisms lack the enzymes to digest synthetic polymers!',
        },
      },
    ],
  },
];

export const InteractiveChapterVideoLab: React.FC = () => {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  const activeCourse = VIDEO_COURSES[selectedCourseIndex] || VIDEO_COURSES[0];
  const activeTimestamp = activeCourse.timestamps[activeTimestampIndex] || activeCourse.timestamps[0];

  const handleSelectTimestamp = (index: number) => {
    sounds.pop();
    setActiveTimestampIndex(index);
    setSelectedQuizOption(null);
    voiceAssistant.stop();
  };

  const handleAnswerQuiz = (optionIndex: number, isCorrect: boolean) => {
    setSelectedQuizOption(optionIndex);
    if (isCorrect) {
      sounds.fanfare();
      setQuizAnswers((prev) => ({ ...prev, [activeTimestampIndex]: true }));
      voiceAssistant.speak(`Correct! ${activeTimestamp.quickQuestion.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Think again! Check the video takeaway above.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-2">
      {/* Course Header Banner */}
      <div className="w-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-amber-300">
            {activeCourse.category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {activeCourse.title}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-sky-100 mt-1 max-w-2xl">
            {activeCourse.description}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/40 px-4 py-2 rounded-2xl border border-white/20 shrink-0">
          <Clock className="w-4 h-4 text-amber-300" />
          <span className="font-black text-sm text-white">Duration: {activeCourse.durationLabel}</span>
        </div>
      </div>

      {/* Main Video + Interactive Chapter Timeline Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Embedded Player & Chapter Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* YouTube Video Player Embed */}
          <div className="w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300 relative">
            <iframe
              key={`${activeCourse.youtubeId}-${activeTimestamp.timeSeconds}`}
              src={`https://www.youtube.com/embed/${activeCourse.youtubeId}?start=${activeTimestamp.timeSeconds}&autoplay=1&rel=0`}
              title={activeCourse.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Interactive Chapter Timeline Scrubber */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-3 border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Interactive Video Chapters (Click to Jump)
              </span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Chapter {activeTimestampIndex + 1} of {activeCourse.timestamps.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCourse.timestamps.map((ts, idx) => {
                const isActive = idx === activeTimestampIndex;
                const isPassed = quizAnswers[idx] === true;
                return (
                  <button
                    key={ts.timeLabel}
                    onClick={() => handleSelectTimestamp(idx)}
                    className={`p-2.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center justify-between gap-1.5 ${
                      isActive
                        ? 'bg-amber-400 border-amber-600 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-[10px] font-black block opacity-80">{ts.timeLabel}</span>
                      <span className="text-xs font-bold truncate block">{ts.title.split('. ')[1] || ts.title}</span>
                    </div>
                    {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Synced Concept Cards & Quick Quiz */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Chapter Concept Focus Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-indigo-200 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                {activeTimestamp.timeLabel} • Key Science Law
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {activeTimestamp.title}
            </h3>

            {/* Specimen Macro Photo */}
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
              <img src={activeTimestamp.image} alt={activeTimestamp.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
              {activeTimestamp.summary}
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-black text-amber-950">
              {activeTimestamp.keyLaw}
            </div>
          </div>

          {/* Timestamp Quick Challenge */}
          <div className="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Chapter Quick Check
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              {activeTimestamp.quickQuestion.question}
            </h4>

            <div className="space-y-2">
              {activeTimestamp.quickQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                return (
                  <button
                    key={opt.text}
                    onClick={() => handleAnswerQuiz(optIdx, opt.isCorrect)}
                    className={`w-full p-3 rounded-xl border-2 text-left font-bold text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                          : 'bg-rose-100 border-rose-400 text-rose-950 font-black'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && (opt.isCorrect ? '✓' : '✗')}
                  </button>
                );
              })}
            </div>

            {selectedQuizOption !== null && (
              <p className="text-xs font-bold text-slate-600 mt-1">
                {activeTimestamp.quickQuestion.explanation}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
