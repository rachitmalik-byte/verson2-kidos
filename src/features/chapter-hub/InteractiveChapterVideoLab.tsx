import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Tv,
  ArrowRight,
  RotateCcw,
  Zap,
  Volume2,
  Layers,
  FlaskConical,
  Flame,
  Droplets,
  Scissors,
  Check,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';

// Real Macro Educational Photography Assets
import rawCottonBollImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import nylonCordImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import plasticDecayImg from '@/assets/images/decay/plastic_100yrs.jpg';
import acrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import timberImg from '@/assets/images/specimens/natural_wood_timber.jpg';

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
  badge: string;
  color: string;
  description: string;
  timestamps: VideoTimestamp[];
  postAnalysis: {
    takeawaySummary: string;
    comparisonTable: {
      material: string;
      source: string;
      strength: string;
      waterReaction: string;
      flameReaction: string;
      bestUse: string;
    }[];
    transformationSteps: {
      rawResource: string;
      process: string;
      finalProduct: string;
      icon: string;
    }[];
  };
}

export const VIDEO_COURSES: VideoCourse[] = [
  {
    id: 'course-synthetic-fibres',
    title: 'Synthetic Fibres: Types, Properties & Uses',
    subtitle: 'Learning Junction • Complete Visual Guide to Petrochemical Polymers',
    youtubeId: 'IBdIzj0elzI',
    durationLabel: '05:15',
    totalSeconds: 315,
    category: 'CBSE Class 5 EVS • Synthetic Fibres',
    badge: '🧪 Polymer Chemistry',
    color: 'from-sky-500 to-indigo-600',
    description:
      'Discover how scientists synthesize Nylon, Rayon, Polyester, and Acrylic from petrochemicals, and explore why different fibers are chosen for parachutes, raincoats, and winter sweaters!',
    timestamps: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: '1. What Are Synthetic Fibres?',
        summary:
          'Unlike natural fibers from cotton plants or sheep fleece, synthetic fibers are man-made chemical chains synthesized primarily from petroleum raw materials.',
        keyLaw: '🧱 Monomers link together into long repeating chains called Polymers!',
        image: rawCottonBollImg,
        quickQuestion: {
          question: 'What is the primary raw source used to make synthetic fibers?',
          options: [
            { text: 'Petrochemicals (crude oil derivatives)', isCorrect: true },
            { text: 'Crushed fruit seeds', isCorrect: false },
          ],
          explanation: 'Synthetic polymers are synthesized from petroleum chemical compounds!',
        },
      },
      {
        timeSeconds: 45,
        timeLabel: '00:45',
        title: '2. Rayon (The Regenerated Artificial Silk)',
        summary:
          'Rayon is made by chemically treating natural wood pulp with sodium hydroxide and carbon disulfide. It feels as soft, cool, and shiny as natural silk at a fraction of the cost!',
        keyLaw: '✨ Rayon is a semi-synthetic fiber made from chemically processed wood cellulose.',
        image: silkwormCocoonImg,
        quickQuestion: {
          question: 'Why is Rayon called "Artificial Silk"?',
          options: [
            { text: 'It has the lustrous shine and drape of silk, made from wood pulp', isCorrect: true },
            { text: 'It is woven by mechanical robot spiders', isCorrect: false },
          ],
          explanation: 'Rayon mimics natural silk gloss using dissolved wood cellulose fibers!',
        },
      },
      {
        timeSeconds: 100,
        timeLabel: '01:40',
        title: '3. Nylon: 100% Fully Synthetic Wonder',
        summary:
          'Invented in 1935, Nylon was the world’s first 100% synthetic fiber made without any natural plant cellulose. It is elastic, lightweight, and stronger than a steel wire of equal thickness!',
        keyLaw: '🪢 Nylon has immense tensile strength — ideal for parachutes and climbing ropes!',
        image: nylonCordImg,
        quickQuestion: {
          question: 'Why is nylon used for rock-climbing ropes and parachute cords?',
          options: [
            { text: 'It has extreme tensile breaking strength and high elasticity', isCorrect: true },
            { text: 'It melts into water when stretched', isCorrect: false },
          ],
          explanation: 'Nylon’s continuous molecular chains resist massive snapping forces!',
        },
      },
      {
        timeSeconds: 155,
        timeLabel: '02:35',
        title: '4. Polyester (Terylene / PET): Wrinkle-Free & Hydrophobic',
        summary:
          'Polyester fibers are completely hydrophobic (water-fearing). They do not wrinkle easily, dry extremely fast, and shed rain without absorbing moisture.',
        keyLaw: '💧 Polyester fibers refuse water absorption, making raincoats light and dry!',
        image: polyesterRaincoatImg,
        quickQuestion: {
          question: 'What makes polyester the #1 choice for raincoats and sportswear?',
          options: [
            { text: 'It is hydrophobic, sheds water, and dries in minutes', isCorrect: true },
            { text: 'It absorbs 10 liters of water like a sponge', isCorrect: false },
          ],
          explanation: 'Non-porous polyester chains prevent water from entering the fiber core!',
        },
      },
      {
        timeSeconds: 200,
        timeLabel: '03:20',
        title: '5. Acrylic (Artificial Wool): Warmth Without Moths',
        summary:
          'Acrylic fiber mimics sheep wool. It is lightweight, fluffy, warm, and immune to moth damage, making it perfect for winter sweaters, blankets, and carpets.',
        keyLaw: '🧶 Acrylic is a synthetic wool substitute that traps insulating pockets of warm air.',
        image: acrylicYarnImg,
        quickQuestion: {
          question: 'What is a major advantage of Acrylic blankets over natural sheep wool?',
          options: [
            { text: 'Much lighter, cheaper, washable, and moths do not eat it', isCorrect: true },
            { text: 'It grows thicker when watered', isCorrect: false },
          ],
          explanation: 'Moths cannot digest synthetic acrylic polymer chains!',
        },
      },
      {
        timeSeconds: 250,
        timeLabel: '04:10',
        title: '6. Kitchen Safety: The Melting Warning',
        summary:
          'CRITICAL SAFETY RULE: Natural fibers burn into safe, powdery ash. Synthetic clothes MELT and stick to human skin when exposed to heat. NEVER wear synthetic clothes while cooking or near fireworks!',
        keyLaw: '🔥 Safety Alert: Wear 100% natural cotton in the kitchen, NEVER synthetics!',
        image: cottonBurningAshImg,
        quickQuestion: {
          question: 'Why must we NEVER wear polyester or nylon clothes near kitchen stoves or fire?',
          options: [
            { text: 'Synthetic polymers melt into hot sticky plastic that severely burns skin', isCorrect: true },
            { text: 'Fire makes synthetic clothes turn into ice', isCorrect: false },
          ],
          explanation: 'Thermoplastic synthetic fibers melt into molten plastic upon flame contact!',
        },
      },
    ],
    postAnalysis: {
      takeawaySummary:
        'Synthetic fibers are engineered polymers tailored for specific superpowers: Rayon provides silk shine, Nylon delivers rock-climbing tensile strength, Polyester repels rain, and Acrylic offers lightweight winter warmth!',
      comparisonTable: [
        {
          material: '🌱 Natural Cotton',
          source: 'Gossypium Plant Seed Pods',
          strength: 'Moderate (weakens when worn)',
          waterReaction: 'High absorbency (soaks sweat)',
          flameReaction: 'Burns into safe, crumbly grey ash',
          bestUse: 'Summer shirts, kitchen aprons, bandages',
        },
        {
          material: '🧵 Synthetic Nylon',
          source: 'Petroleum Chemicals (Coal, Water, Air)',
          strength: 'Extremely High (stronger than steel)',
          waterReaction: 'Low absorbency, quick-drying',
          flameReaction: 'Melts with celery-like odor into hard bead',
          bestUse: 'Climbing ropes, parachutes, toothbrushes',
        },
        {
          material: '🧥 Synthetic Polyester',
          source: 'Petrochemical Esters (PET)',
          strength: 'Very High, wrinkle-resistant',
          waterReaction: 'Hydrophobic (water beads & rolls off)',
          flameReaction: 'Melts with sweet chemical smell into hard bead',
          bestUse: 'Raincoats, sportswear, umbrellas, sails',
        },
        {
          material: '🧶 Synthetic Acrylic',
          source: 'Polyacrylonitrile Petrochemicals',
          strength: 'High, resilient crimped fluff',
          waterReaction: 'Moderate moisture management',
          flameReaction: 'Burns and melts with black acrid smoke',
          bestUse: 'Winter sweaters, carpets, warm blankets',
        },
      ],
      transformationSteps: [
        { rawResource: 'Crude Petroleum Oil', process: 'Polymerization & Spinning', finalProduct: 'Strong Nylon Ropes', icon: '🛢️ ➔ 🧵' },
        { rawResource: 'Natural Wood Pulp', process: 'Chemical Cellulose Regeneration', finalProduct: 'Soft Lustrous Rayon', icon: '🪵 ➔ ✨' },
        { rawResource: 'Petrochemical Esters', process: 'Extrusion & Hydrophobic Weave', finalProduct: 'Waterproof Raincoat', icon: '🧴 ➔ 🧥' },
      ],
    },
  },
  {
    id: 'course-natural-vs-synthetic',
    title: "Natural & Synthetic Materials: Transforming Nature's Resources",
    subtitle: 'Miacademy Physical Science • Chemical Transformations in the Real World',
    youtubeId: '2Vt2DnUKsDU',
    durationLabel: '06:00',
    totalSeconds: 360,
    category: 'Miacademy Physical Science • Materials',
    badge: '🌍 Resource Engineering',
    color: 'from-emerald-500 to-teal-700',
    description:
      'Learn how humans transform raw Earth resources (crude oil, quartz sand, limestone, and trees) through chemical engineering into modern synthetic materials like plastics, glass, paper, and synthetic rubber!',
    timestamps: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: '1. What Are Natural Resources?',
        summary:
          'Natural resources exist naturally on Earth without human interference: living plants, animal fleece, timber trees, rock minerals, quartz sand, and underground crude oil.',
        keyLaw: '🌿 Natural resources are harvested directly from the biosphere, ground, or ocean.',
        image: timberImg,
        quickQuestion: {
          question: 'Which of the following is a raw Natural Resource?',
          options: [
            { text: 'Timber wood and quartz beach sand', isCorrect: true },
            { text: 'Plastic sandwich bags', isCorrect: false },
          ],
          explanation: 'Wood and sand are extracted directly from nature without chemical synthesis!',
        },
      },
      {
        timeSeconds: 50,
        timeLabel: '00:50',
        title: '2. What Makes a Material "Synthetic"?',
        summary:
          'A material is synthetic when human chemists use high heat, pressure, or chemical catalysts to chemically alter the atomic bonds of natural resources, forming a brand-new substance.',
        keyLaw: '🔬 Synthetic materials undergo permanent chemical changes to gain new properties.',
        image: nylonCordImg,
        quickQuestion: {
          question: 'What is the key difference between simple processing and creating a synthetic material?',
          options: [
            { text: 'Synthetic materials undergo chemical reactions changing their molecular structure', isCorrect: true },
            { text: 'Synthetic materials are just painted in bright colors', isCorrect: false },
          ],
          explanation: 'Chemical reactions rearrange atoms to produce substances with brand-new physical traits!',
        },
      },
      {
        timeSeconds: 105,
        timeLabel: '01:45',
        title: '3. From Underground Crude Oil to Useful Plastics',
        summary:
          'Crude oil is refined into smaller hydrocarbon molecules like ethylene. In chemical reactors, these monomers snap together into versatile plastics like polyethylene and PVC.',
        keyLaw: '🛢️ Crude Oil ➔ Monomer Refining ➔ Polymerization ➔ Durable Plastics.',
        image: plasticDecayImg,
        quickQuestion: {
          question: 'Why are plastics so widely used in modern society?',
          options: [
            { text: 'They are lightweight, durable, waterproof, and can be molded into any shape', isCorrect: true },
            { text: 'They evaporate into thin air within 2 seconds', isCorrect: false },
          ],
          explanation: 'Plastics provide an unmatched combination of lightweight moldability and water resistance!',
        },
      },
      {
        timeSeconds: 160,
        timeLabel: '02:40',
        title: '4. Sand to Glass & Trees to Paper',
        summary:
          'When quartz sand is heated to 1700°C, it melts into liquid silica and cools into transparent glass. When wood chips are chemically digested, pure cellulose fibers form smooth paper sheets.',
        keyLaw: '⏳ High temperature thermal and chemical processing transforms sand into glass!',
        image: timberImg,
        quickQuestion: {
          question: 'What raw Earth resource is melted at 1,700°C to create transparent glass windows?',
          options: [
            { text: 'Quartz silica sand from the ground', isCorrect: true },
            { text: 'Melted ice cubes from the freezer', isCorrect: false },
          ],
          explanation: 'Silicon dioxide in beach sand melts into molten liquid that cools into transparent glass!',
        },
      },
      {
        timeSeconds: 215,
        timeLabel: '03:35',
        title: '5. Comparing Properties: Natural vs Synthetic',
        summary:
          'Natural materials are often breathable, biodegradable, and renewable. Synthetic materials are often waterproof, shatterproof, non-corrosive, and mechanically stronger.',
        keyLaw: '⚖️ Neither is "better" — scientists select materials based on the exact job requirements!',
        image: rawCottonBollImg,
        quickQuestion: {
          question: 'What is a superpower that synthetic materials often have over natural ones?',
          options: [
            { text: 'They do not rot easily from bacteria, water, or moisture', isCorrect: true },
            { text: 'They can sing songs when tapped', isCorrect: false },
          ],
          explanation: 'Synthetic polymer bonds resist biological microbial decay and moisture rotting!',
        },
      },
      {
        timeSeconds: 265,
        timeLabel: '04:25',
        title: '6. Environmental Impact & The 3 R’s',
        summary:
          'Because synthetic plastics do not decompose in landfills for hundreds of years, responsible scientists follow the 3 R’s: Reduce unnecessary usage, Reuse containers, and Recycle plastics into new items.',
        keyLaw: '♻️ Reduce single-use plastics • Reuse durable containers • Recycle polymers!',
        image: plasticDecayImg,
        quickQuestion: {
          question: 'Why is recycling synthetic plastic so crucial for our planet?',
          options: [
            { text: 'It saves crude oil resources and prevents long-lasting landfill pollution', isCorrect: true },
            { text: 'Because plastic turns into gold coins after 2 days', isCorrect: false },
          ],
          explanation: 'Recycling conserves raw petrochemicals and stops non-biodegradable waste in ecosystems!',
        },
      },
    ],
    postAnalysis: {
      takeawaySummary:
        'Human civilization relies on chemically transforming Earth’s natural resources into engineered materials. Balancing the benefits of durable synthetics with environmental recycling is key to sustainable science!',
      comparisonTable: [
        {
          material: '🏖️ Quartz Sand',
          source: 'Earth’s crust & beaches',
          strength: 'Rigid, scratch-resistant',
          waterReaction: '100% waterproof & inert',
          flameReaction: 'Withstands extreme heat (1,700°C)',
          bestUse: 'Melted into glass windows, lenses, beakers',
        },
        {
          material: '🛢️ Crude Oil',
          source: 'Ancient underground fossils',
          strength: 'Engineered high tensile strength',
          waterReaction: 'Impermeable barrier',
          flameReaction: 'Melts / burns (thermoplastics)',
          bestUse: 'Synthesized into PET bottles, PVC cables',
        },
        {
          material: '🌲 Timber Trees',
          source: 'Renewable forests',
          strength: 'High compressive wood strength',
          waterReaction: 'Absorbs water, expands',
          flameReaction: 'Combusts to carbon ash',
          bestUse: 'Pulp chemically separated for smooth paper',
        },
      ],
      transformationSteps: [
        { rawResource: 'Quartz Silica Sand', process: 'Furnace Melting at 1,700°C', finalProduct: 'Clear Glass Bottles & Windows', icon: '🏖️ ➔ 🪟' },
        { rawResource: 'Underground Crude Oil', process: 'Fractional Distillation & Polymerization', finalProduct: 'Waterproof Plastic Bottles', icon: '🛢️ ➔ 🧴' },
        { rawResource: 'Forest Timber Wood', process: 'Chemical Lignin Removal & Rolling', finalProduct: 'Smooth Notebook Paper', icon: '🌲 ➔ 📄' },
      ],
    },
  },
];

export const InteractiveChapterVideoLab: React.FC = () => {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(0);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'post_analysis'>('video');

  const activeCourse = VIDEO_COURSES[selectedCourseIndex] || VIDEO_COURSES[0];
  const activeTimestamp = activeCourse.timestamps[activeTimestampIndex] || activeCourse.timestamps[0];

  const handleSelectCourse = (index: number) => {
    sounds.pop();
    setSelectedCourseIndex(index);
    setActiveTimestampIndex(0);
    setSelectedQuizOption(null);
    voiceAssistant.stop();
  };

  const handleSelectTimestamp = (index: number) => {
    sounds.pop();
    setActiveTimestampIndex(index);
    setSelectedQuizOption(null);
    voiceAssistant.stop();
  };

  const handleAnswerQuiz = (optionIndex: number, isCorrect: boolean) => {
    setSelectedQuizOption(optionIndex);
    const quizKey = `${activeCourse.id}-${activeTimestampIndex}`;

    if (isCorrect) {
      sounds.fanfare();
      setQuizAnswers((prev) => ({ ...prev, [quizKey]: true }));
      voiceAssistant.speak(`Spot on, Young Scientist! ${activeTimestamp.quickQuestion.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Look closely at the key scientific law above and try again!');
    }
  };

  const completedCount = Object.keys(quizAnswers).filter((k) => k.startsWith(activeCourse.id)).length;
  const totalCheckpoints = activeCourse.timestamps.length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-2 select-none">
      {/* ── 1. Course Switcher Tabs (Video 1 vs Video 2) ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-3 border-sky-300 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Interactive Science Video Lab
            </span>
            <span className="text-sm font-black text-slate-800">
              Select Video Lesson:
            </span>
          </div>
        </div>

        {/* Video Course Selection Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {VIDEO_COURSES.map((course, idx) => {
            const isSelected = idx === selectedCourseIndex;
            return (
              <motion.button
                key={course.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectCourse(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{course.badge}</span>
                <span className="hidden sm:inline">• {course.title.split(':')[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Active Course Hero Banner ── */}
      <div
        className={`w-full bg-gradient-to-r ${activeCourse.color} rounded-[32px] p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-amber-200 border border-white/20">
              {activeCourse.category}
            </span>
            <span className="text-[11px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs">
              {completedCount}/{totalCheckpoints} Checkpoints Mastered
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {activeCourse.title}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-sky-100 mt-1 max-w-2xl leading-relaxed">
            {activeCourse.description}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5 bg-slate-950/40 px-3.5 py-1.5 rounded-2xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="font-black text-xs text-white">Video Length: {activeCourse.durationLabel}</span>
          </div>

          {/* Tab Switcher: Video Player vs Post-Video Analysis */}
          <div className="flex items-center gap-1 bg-white/20 p-1 rounded-2xl border border-white/20">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'video' ? 'bg-white text-indigo-950 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              🎬 Video Lab
            </button>
            <button
              onClick={() => setActiveTab('post_analysis')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'post_analysis' ? 'bg-white text-indigo-950 shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              📊 Post-Analysis
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT: VIDEO LAB vs POST-ANALYSIS ── */}
      {activeTab === 'video' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Columns: Embedded YouTube Video + Timestamp Scrubber */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Embedded YouTube Player with Dynamic Timestamp Start */}
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

            {/* Interactive Chapter Timestamp Scrubber */}
            <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-3 border-slate-200 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                  <span>Click Any Timestamp to Jump Directly in Video:</span>
                </span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Topic {activeTimestampIndex + 1} of {activeCourse.timestamps.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeCourse.timestamps.map((ts, idx) => {
                  const isActive = idx === activeTimestampIndex;
                  const isPassed = quizAnswers[`${activeCourse.id}-${idx}`] === true;
                  return (
                    <motion.button
                      key={ts.timeLabel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTimestamp(idx)}
                      className={`p-2.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center justify-between gap-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-500 to-indigo-600 border-indigo-700 text-white shadow-md scale-102'
                          : isPassed
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className={`text-[10px] font-black uppercase block ${isActive ? 'text-amber-200' : 'text-slate-400'}`}>
                          {ts.timeLabel}
                        </span>
                        <span className="text-xs font-black truncate block leading-tight">
                          {ts.title.split('.')[1] || ts.title}
                        </span>
                      </div>

                      {isPassed && !isActive && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Active Topic Breakdown & Interactive Quiz Checkpoint */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Timestamp Concept Card */}
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border-3 border-sky-300 shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-950 font-black text-xs">
                  ⏱️ Timestamp: {activeTimestamp.timeLabel}
                </span>

                <button
                  onClick={() => {
                    sounds.bubble();
                    voiceAssistant.speak(`${activeTimestamp.title}. ${activeTimestamp.summary} ${activeTimestamp.keyLaw}`);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95"
                  title="Listen to Pip's Explanation"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src={activeTimestamp.image}
                  alt={activeTimestamp.title}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-200 shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {activeTimestamp.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">
                    {activeTimestamp.summary}
                  </p>
                </div>
              </div>

              {/* The Golden Science Law */}
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs font-black text-amber-950 flex items-start gap-2 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{activeTimestamp.keyLaw}</span>
              </div>
            </div>

            {/* Interactive Checkpoint Quiz for this Timestamp */}
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border-3 border-indigo-200 shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-full flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Video Checkpoint Quiz</span>
                </span>

                {quizAnswers[`${activeCourse.id}-${activeTimestampIndex}`] && (
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Passed!
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                {activeTimestamp.quickQuestion.question}
              </h4>

              <div className="flex flex-col gap-2">
                {activeTimestamp.quickQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedQuizOption === oIdx;
                  return (
                    <motion.button
                      key={oIdx}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerQuiz(oIdx, opt.isCorrect)}
                      className={`p-3 rounded-2xl border-2 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected && opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                          : isSelected && !opt.isCorrect
                          ? 'bg-rose-100 border-rose-400 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next Topic Progression Button */}
              {activeTimestampIndex < activeCourse.timestamps.length - 1 ? (
                <button
                  onClick={() => handleSelectTimestamp(activeTimestampIndex + 1)}
                  className="w-full mt-2 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span>Next Video Chapter ({activeCourse.timestamps[activeTimestampIndex + 1].timeLabel})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('post_analysis')}
                  className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <span>Complete Video Lab & Open Post-Analysis 📊</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── 4. POST-ANALYSIS & COMPARISON MATRIX SECTION ── */
        <div className="w-full flex flex-col gap-6">
          {/* Post Analysis Summary Card */}
          <div className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-4 border-indigo-400 shadow-xl flex flex-col md:flex-row items-center gap-6">
            <Pip mood="celebrating" size="lg" />
            <div className="flex-1 text-center md:text-left">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-black uppercase">
                Post-Video Master Scientific Analysis
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Key Takeaways from "{activeCourse.title.split(':')[0]}"
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1.5 leading-relaxed">
                {activeCourse.postAnalysis.takeawaySummary}
              </p>
            </div>
          </div>

          {/* Chemical Transformation Blueprint (How Raw Nature Becomes Products) */}
          <div className="w-full bg-white/95 backdrop-blur-md p-6 rounded-3xl border-3 border-amber-300 shadow-lg">
            <h4 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <FlaskConical className="w-5 h-5 text-amber-500" />
              <span>Chemical Transformation Blueprints from the Video</span>
            </h4>
            <p className="text-xs font-bold text-slate-500 mb-4">
              How human chemical engineering transforms raw Earth resources into final products:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCourse.postAnalysis.transformationSteps.map((step, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col justify-between text-center">
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <div>
                    <span className="text-xs font-black text-amber-950 block">{step.rawResource}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200 inline-block my-1.5">
                      ⚡ {step.process}
                    </span>
                    <span className="text-xs font-black text-slate-800 block">➔ {step.finalProduct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Comparison Matrix Table */}
          <div className="w-full bg-white/95 backdrop-blur-md p-6 rounded-3xl border-3 border-slate-200 shadow-lg overflow-x-auto">
            <h4 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Scientific Property Comparison Matrix</span>
            </h4>
            <p className="text-xs font-bold text-slate-500 mb-4">
              Side-by-side comparison of molecular properties, flame safety, and engineering applications:
            </p>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] border-b-2 border-slate-200">
                  <th className="p-3 rounded-l-xl">Material</th>
                  <th className="p-3">Raw Source</th>
                  <th className="p-3">Tensile Strength</th>
                  <th className="p-3">Water Reaction</th>
                  <th className="p-3">Flame Reaction</th>
                  <th className="p-3 rounded-r-xl">Best Practical Use</th>
                </tr>
              </thead>
              <tbody className="font-bold text-slate-700 divide-y divide-slate-100">
                {activeCourse.postAnalysis.comparisonTable.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-black text-slate-900">{row.material}</td>
                    <td className="p-3 text-[11px]">{row.source}</td>
                    <td className="p-3 text-[11px]">{row.strength}</td>
                    <td className="p-3 text-[11px]">{row.waterReaction}</td>
                    <td className="p-3 text-[11px] text-rose-700">{row.flameReaction}</td>
                    <td className="p-3 text-[11px] text-indigo-700 font-black">{row.bestUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Footer: Return to Video */}
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('video')}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              <span>← Return to Video Player & Timestamps</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
