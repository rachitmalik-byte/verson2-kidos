
import cottonZoomGif from '@/assets/videos/cotton_zoom_microstructure.gif';
import nylonZoomGif from '@/assets/videos/nylon_zoom_microstructure.gif';
import silkZoomGif from '@/assets/videos/silk_zoom_microstructure.gif';
import plasticZoomGif from '@/assets/videos/plastic_zoom_microstructure.gif';
import woolZoomGif from '@/assets/videos/wool_zoom_fibers.gif';
import rubberZoomGif from '@/assets/videos/tire_rubber_crosslink.gif';
import polyesterZoomGif from '@/assets/videos/polyester_zoom_weave.gif';


interface ZoomSpecimen {
  id: string;
  name: string;
  category: 'Natural Fibre' | 'Synthetic Polymer' | 'Biomimicry' | 'Earth & Energy';
  gifSrc: string;
  videoSrc?: string;
  description: string;
  scienceTakeaway: string;
  badgeColor: string;
}

const ANIMATED_ZOOM_SPECIMENS: ZoomSpecimen[] = [
  {
    id: 'cotton',
    name: 'Cotton Plant to Microscopic Cellulose Weave',
    category: 'Natural Fibre',
    gifSrc: cottonZoomGif,
    videoSrc: '/assets/videos/cotton_microscopic_weave.mp4',
    description: 'Watch the continuous smooth zoom from everyday soft cotton textile deep into the intertwined botanical cellulose fiber ribbons.',
    scienceTakeaway: 'Cellulose fibers have natural hollow cores (lumens) that absorb moisture, keeping us cool in summer!',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'nylon',
    name: 'Nylon T-Shirt to Synthetic Polymer Grid',
    category: 'Synthetic Polymer',
    gifSrc: nylonZoomGif,
    videoSrc: '/assets/videos/nylon_microscopic_weave.mp4',
    description: 'Seamless zoom showing smooth petrochemical nylon filaments extruded into an unbreakable high-tensile mesh.',
    scienceTakeaway: 'Extruded polyamide chains lack surface pores, making nylon dry 5x faster than natural cotton!',
    badgeColor: 'bg-sky-600 text-white',
  },
  {
    id: 'silk',
    name: 'Silkworm Cocoon to Crystalline Fibroin Protein',
    category: 'Natural Fibre',
    gifSrc: silkZoomGif,
    videoSrc: '/assets/videos/silk_microscopic_fibers.mp4',
    description: 'Zooming from shimmering raw silk fabric into the triangular prism protein filaments produced by Bombyx mori silkworms.',
    scienceTakeaway: 'Triangular protein cross-sections refract ambient light like tiny glass prisms, creating natural luster!',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    id: 'plastic',
    name: 'Plastic Molded Surface to Polymer Chain Matrix',
    category: 'Synthetic Polymer',
    gifSrc: plasticZoomGif,
    description: 'Smooth magnification into the impermeable thermoplastic matrix of synthetic PET bottle containers.',
    scienceTakeaway: 'Synthetic polymers resist biological decomposition enzymes, allowing them to remain intact for over 450 years.',
    badgeColor: 'bg-indigo-600 text-white',
  },
  {
    id: 'wool',
    name: 'Sheep Fleece to Crimped Keratin Air Pockets',
    category: 'Natural Fibre',
    gifSrc: woolZoomGif,
    videoSrc: '/assets/videos/wool_microscopic_fibers.mp4',
    description: 'Watch the zoom into natural sheep wool fleece revealing wavy crimped keratin fibers trapping pockets of warm air.',
    scienceTakeaway: 'Natural fiber crimp creates millions of microscopic dead-air insulating chambers resisting freezing arctic winds.',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    id: 'rubber',
    name: 'Natural Tree Latex to Vulcanized Tire Tread',
    category: 'Biomimicry',
    gifSrc: rubberZoomGif,
    videoSrc: '/assets/videos/tire_rubber_microscopic.mp4',
    description: 'Microscopic look at how heating natural isoprene tree sap with sulfur creates resilient vulcanized rubber cross-links.',
    scienceTakeaway: 'Sulfur bridges lock flexible polymer chains together, preventing tires from melting on hot summer asphalt!',
    badgeColor: 'bg-purple-600 text-white',
  },
];

import React, { useState, useEffect } from 'react';
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

// Real Macro Photography Assets
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
  creator: string;
  youtubeId: string;
  thumbnail: string;
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
    id: 'course-learning-junction',
    title: 'Synthetic Fibres: Types, Properties & Uses',
    subtitle: 'Learning Junction • Complete Visual Guide to Petrochemical Polymers',
    creator: 'Learning Junction',
    youtubeId: 'IBdIzj0elzI',
    thumbnail: 'https://img.youtube.com/vi/IBdIzj0elzI/hqdefault.jpg',
    durationLabel: '03:15',
    totalSeconds: 195,
    category: 'CBSE Class 5 EVS • Synthetic Fibres',
    badge: '🧪 Video 1: Polymer Chemistry',
    color: 'from-sky-500 via-blue-600 to-indigo-600',
    description:
      'Learn what synthetic fibres are, how Rayon, Nylon, Polyester, and Acrylic are synthesized, and compare their superpowers like tensile strength, water resistance, and heat melting.',
    timestamps: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: '1. What Are Synthetic Fibres?',
        summary:
          'Synthetic fibres are man-made polymer chains synthesized through chemical processes using petrochemicals, unlike natural fibres from cotton or sheep.',
        keyLaw: '🧱 Monomers link together into long repeating chains called Polymers!',
        image: cottonZoomGif,
        quickQuestion: {
          question: 'What is the primary raw source used to make synthetic fibers?',
          options: [
            { text: 'Petrochemicals (chemicals from petroleum/crude oil)', isCorrect: true },
            { text: 'Crushed fruit seeds from trees', isCorrect: false },
          ],
          explanation: 'Synthetic polymers are synthesized from petroleum chemical compounds!',
        },
      },
      {
        timeSeconds: 30,
        timeLabel: '00:30',
        title: '2. Rayon (Artificial Silk from Wood Pulp)',
        summary:
          'Rayon is made by chemically treating natural wood pulp cellulose. It is smooth, shiny, and absorbent like natural silk, but much more affordable!',
        keyLaw: '✨ Rayon is a semi-synthetic fiber made from chemically treated wood cellulose.',
        image: silkZoomGif,
        quickQuestion: {
          question: 'Why is Rayon called "Artificial Silk"?',
          options: [
            { text: 'It has the lustrous shine and soft drape of silk, made from wood pulp', isCorrect: true },
            { text: 'It is woven by mechanical robot spiders', isCorrect: false },
          ],
          explanation: 'Rayon mimics natural silk gloss using dissolved wood cellulose fibers!',
        },
      },
      {
        timeSeconds: 60,
        timeLabel: '01:00',
        title: '3. Nylon: 100% Fully Synthetic Wonder',
        summary:
          'Nylon was the world’s first fully synthetic fiber. It is elastic, lightweight, lustrous, and stronger than a steel wire of equal thickness!',
        keyLaw: '🪢 Nylon has immense tensile strength — ideal for climbing ropes & toothbrushes!',
        image: nylonZoomGif,
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
        timeSeconds: 90,
        timeLabel: '01:30',
        title: '4. Polyester (Terylene): Wrinkle-Free & Hydrophobic',
        summary:
          'Polyester is made of repeating ester units. It does not get wrinkled easily, remains crisp, sheds water droplets, and is very easy to wash.',
        keyLaw: '💧 Polyester fibers refuse water absorption, making raincoats light and dry!',
        image: polyesterZoomGif,
        quickQuestion: {
          question: 'What makes polyester the #1 choice for raincoats and dress materials?',
          options: [
            { text: 'It is wrinkle-free, hydrophobic, and dries quickly', isCorrect: true },
            { text: 'It absorbs 10 liters of water like a sponge', isCorrect: false },
          ],
          explanation: 'Non-porous polyester chains prevent water from entering the fiber core!',
        },
      },
      {
        timeSeconds: 120,
        timeLabel: '02:00',
        title: '5. Acrylic (Artificial Wool): Warmth Without Moths',
        summary:
          'Acrylic is made from polyacrylonitrile. It is a synthetic substitute for natural wool that is lightweight, warm, colorful, and immune to moth damage.',
        keyLaw: '🧶 Acrylic is an affordable artificial wool that traps insulating pockets of warm air.',
        image: woolZoomGif,
        quickQuestion: {
          question: 'What is a major advantage of Acrylic blankets over natural sheep wool?',
          options: [
            { text: 'Much cheaper, washable, lightweight, and moths do not eat it', isCorrect: true },
            { text: 'It grows thicker when watered', isCorrect: false },
          ],
          explanation: 'Moths cannot digest synthetic acrylic polymer chains!',
        },
      },
      {
        timeSeconds: 150,
        timeLabel: '02:30',
        title: '6. Advantages, Disadvantages & Heat Safety',
        summary:
          'Advantages: Durable, cheap, wrinkle-free, and easy to wash. Disadvantages: Poor air circulation (sweaty) and melts when heated. NEVER wear synthetics in kitchens!',
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
    id: 'course-miacademy',
    title: "Natural & Synthetic Materials: Transforming Nature's Resources",
    subtitle: 'Miacademy Physical Science • Chemical Changes in Everyday Objects',
    creator: 'Miacademy Physical Science',
    youtubeId: '2Vt2DnUKsDU',
    thumbnail: 'https://img.youtube.com/vi/2Vt2DnUKsDU/hqdefault.jpg',
    durationLabel: '10:05',
    totalSeconds: 605,
    category: 'Miacademy Physical Science • Materials',
    badge: "🌍 Video 2: Resource Engineering",
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    description:
      'Explore how humans chemically transform raw Earth resources (crude oil, quartz sand, fleece, and trees) into modern synthetic substances like fleece hoodies, plastics, glass, and rubber!',
    timestamps: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: '1. Natural Resources in Everyday Items',
        summary:
          'Every object we use begins with natural resources extracted from Earth: plants, animals, rock minerals, sand, and petroleum crude oil.',
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
        timeSeconds: 80,
        timeLabel: '01:20',
        title: '2. What Makes a Material "Synthetic"?',
        summary:
          'A material is synthetic when scientists make new materials in labs with special powers that do not exist in nature.',
        keyLaw: '🔬 Synthetic materials undergo permanent chemical changes to gain new properties.',
        image: nylonCordImg,
        quickQuestion: {
          question: 'What is the key difference between physical shaping and creating a synthetic material?',
          options: [
            { text: 'Synthetic materials undergo chemical reactions changing their molecular structure', isCorrect: true },
            { text: 'Synthetic materials are just painted in bright colors', isCorrect: false },
          ],
          explanation: 'Chemical reactions rearrange atoms to produce substances with brand-new physical traits!',
        },
      },
      {
        timeSeconds: 180,
        timeLabel: '03:00',
        title: '3. Crude Oil to Useful Plastics & Fleece',
        summary:
          'Crude oil is refined into monomers that are chemically linked into synthetic polymers like polyethylene and polyester fleece for warm winter hoodies.',
        keyLaw: '🛢️ Crude Oil ➔ Monomer Refining ➔ Polymerization ➔ Durable Plastics & Fleece.',
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
        timeSeconds: 285,
        timeLabel: '04:45',
        title: '4. Sand to Glass & Trees to Paper',
        summary:
          'When quartz sand is heated to 1,700°C, it melts into liquid silica and cools into transparent glass. When wood chips are chemically digested, cellulose fibers form smooth paper.',
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
        timeSeconds: 390,
        timeLabel: '06:30',
        title: '5. Comparing Properties: Natural vs Synthetic',
        summary:
          'Natural materials are often breathable and biodegradable. Synthetic materials are often waterproof, shatterproof, non-corrosive, and mechanically stronger.',
        keyLaw: '⚖️ Scientists select materials based on the exact job requirements!',
        image: nylonZoomGif,
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
        timeSeconds: 495,
        timeLabel: '08:15',
        title: '6. Sustainable Science & The 3 R’s',
        summary:
          'Because synthetic plastics resist natural decay, responsible scientists follow the 3 R’s: Reduce unnecessary usage, Reuse containers, and Recycle plastics into new items.',
        keyLaw: '♻️ Reduce single-use plastics • Reuse durable containers • Recycle polymers!',
        image: plasticZoomGif,
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
  const timestamps = activeCourse?.timestamps || [];
  const activeTimestamp = timestamps[activeTimestampIndex] || timestamps[0];

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
      voiceAssistant.speak(`Spot on, Young Scientist! ${activeTimestamp?.quickQuestion?.explanation || ''}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Look closely at the key scientific law above and try again!');
    }
  };

  const completedCount = Object.keys(quizAnswers).filter((k) => k.startsWith(activeCourse.id)).length;
  const totalCheckpoints = timestamps.length;

  if (!activeCourse || !activeTimestamp) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-2 select-none">
      {/* ── 1. PROMINENT DUAL VIDEO SHOWCASE SELECTOR (BOTH VIDEOS VISIBLE) ── */}
      <div className="flex flex-col gap-3 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-3 border-sky-300 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Video Lesson Hub
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">
                Choose Video Lesson (2 Complete Videos Available):
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-sky-700 bg-sky-100 px-3 py-1 rounded-full hidden sm:inline">
            2 Lessons
          </span>
        </div>

        {/* 2 Big Visual Cards for Both Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          {VIDEO_COURSES.map((course, idx) => {
            const isSelected = idx === selectedCourseIndex;
            const courseCompleted = Object.keys(quizAnswers).filter((k) => k.startsWith(course.id)).length;

            return (
              <motion.button
                key={course.id}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCourse(idx)}
                className={`p-3.5 rounded-2xl border-3 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-50 to-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-50 hover:bg-white border-slate-200 shadow-xs'
                }`}
              >
                {/* Video Thumbnail with Duration Overlay */}
                <div className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden shadow-xs shrink-0 border border-slate-300 bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded font-black">
                    {course.durationLabel}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Video Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {idx === 0 ? 'Video 1 (3:15)' : 'Video 2 (10:05)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {course.creator}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-snug">
                    {course.title.split(':')[0]}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                    {course.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[10px] font-black text-slate-600">
                    <span>{courseCompleted}/{course.timestamps.length} Checkpoints</span>
                    <span className={isSelected ? 'text-indigo-600 font-black' : 'text-slate-400'}>
                      {isSelected ? '▶ NOW WATCHING' : 'CLICK TO WATCH ➔'}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Active Course Header Banner ── */}
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

          <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {activeCourse.title}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-sky-100 mt-1 max-w-2xl leading-relaxed">
            {activeCourse.description}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5 bg-slate-950/40 px-3.5 py-1.5 rounded-2xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="font-black text-xs text-white">Length: {activeCourse.durationLabel}</span>
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
          {/* Left 7 Columns: Embedded YouTube Video + Exact Timestamp Scrubber */}
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
                  <span>Click Exact Timestamp to Jump Directly:</span>
                </span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Topic {activeTimestampIndex + 1} of {timestamps.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timestamps.map((ts, idx) => {
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

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Animated Micro-Zoom Live Lens */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-indigo-400 shadow-xl shrink-0 bg-black ring-4 ring-indigo-200/60 group">
                  <img
                    src={activeTimestamp.image}
                    alt={activeTimestamp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-1 inset-x-1 bg-black/75 backdrop-blur-xs rounded-xl px-1.5 py-0.5 text-center text-[9px] font-black text-white uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Micro-Zoom 🔬</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {activeTimestamp.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-1.5 leading-relaxed">
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
                {activeTimestamp?.quickQuestion?.question || ''}
              </h4>

              <div className="flex flex-col gap-2">
                {(activeTimestamp?.quickQuestion?.options || []).map((opt, oIdx) => {
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
              {activeTimestampIndex < timestamps.length - 1 ? (
                <button
                  onClick={() => handleSelectTimestamp(activeTimestampIndex + 1)}
                  className="w-full mt-2 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span>Next Video Chapter ({timestamps[activeTimestampIndex + 1]?.timeLabel || ''})</span>
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
                {activeCourse?.postAnalysis?.takeawaySummary || ''}
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
              {(activeCourse?.postAnalysis?.transformationSteps || []).map((step, sIdx) => (
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
                {(activeCourse?.postAnalysis?.comparisonTable || []).map((row, rIdx) => (
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
