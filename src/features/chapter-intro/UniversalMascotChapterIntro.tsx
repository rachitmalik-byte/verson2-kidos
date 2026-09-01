import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';

interface FloatingSpecimen {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  x: string;
  y: string;
  delay: number;
}

interface CourseIntroConfig {
  id: string;
  title: string;
  subtitle: string;
  syllabusCode: string;
  bgGradient: string;
  hubRoute: string;
  accentColor: string;
  btnShadow: string;
  specimens: FloatingSpecimen[];
  pipLessons: {
    dialogue: string;
    pipMood: 'explaining' | 'curious' | 'celebrating' | 'thinking' | 'encouraging';
    keyConceptTitle: string;
    keyConceptHighlight: string;
  }[];
}

const COURSE_INTROS: Record<string, CourseIntroConfig> = {
  materials: {
    id: 'materials',
    title: 'Things We Make & Do: Materials Science',
    subtitle: 'Natural vs. Synthetic Polymers, Fibres & Biodegradability',
    syllabusCode: 'CBSE Class 5 EVS • Theme 6',
    bgGradient: 'from-amber-100 via-orange-50 to-sky-100',
    hubRoute: '/chapter-hub',
    accentColor: 'bg-amber-400 border-amber-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#D97706]',
    specimens: [
      { id: 'shirt', name: 'Polyester Shirt', emoji: '👕', subtitle: 'Waterproof synthetic polymer', x: '8%', y: '16%', delay: 0.1 },
      { id: 'coat', name: 'Raincoat', emoji: '🧥', subtitle: 'Non-porous water barrier', x: '86%', y: '14%', delay: 0.2 },
      { id: 'wood', name: 'Forest Wood', emoji: '🪵', subtitle: 'Natural cellulose grain', x: '10%', y: '60%', delay: 0.3 },
      { id: 'rope', name: 'Nylon Rope', emoji: '🪢', subtitle: 'Super strong synthetic cord', x: '88%', y: '62%', delay: 0.4 },
      { id: 'wool', name: 'Sheep Wool', emoji: '🐑', subtitle: 'Natural warm animal fleece', x: '12%', y: '82%', delay: 0.5 },
      { id: 'kettle', name: 'Bakelite Handle', emoji: '🫖', subtitle: 'Heat-proof thermoset plastic', x: '50%', y: '8%', delay: 0.6 },
    ],
    pipLessons: [
      {
        dialogue: "Look around you! Everything you touch is made from a different material chosen for a special superpower.",
        pipMood: 'explaining',
        keyConceptTitle: 'Everyday Materials',
        keyConceptHighlight: 'Every object is crafted from a material that fits its job.',
      },
      {
        dialogue: "Natural materials come from plants and animals. Synthetic materials are invented by scientists in labs!",
        pipMood: 'curious',
        keyConceptTitle: 'Natural vs Synthetic',
        keyConceptHighlight: 'Plant cellulose and animal wool grow naturally; nylon and plastics are synthesized.',
      },
      {
        dialogue: "Here is our Golden Science Law: What something is MADE FROM decides what it CAN DO!",
        pipMood: 'celebrating',
        keyConceptTitle: 'The Golden Science Law',
        keyConceptHighlight: '🧱 Material ➔ ⚡ Physical Property ➔ 🎯 Practical Real-World Use.',
      },
    ],
  },
  senses: {
    id: 'senses',
    title: 'Super Senses & Living Creatures',
    subtitle: 'Animal Superpowers, Scent Trails & Seed Dispersal',
    syllabusCode: 'CBSE Class 5 EVS • Theme 1',
    bgGradient: 'from-emerald-100 via-teal-50 to-amber-50',
    hubRoute: '/theme/1/hub',
    accentColor: 'bg-emerald-400 border-emerald-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#059669]',
    specimens: [
      { id: 'ant', name: 'Scout Ant', emoji: '🐜', subtitle: 'Follows invisible chemical scent trails', x: '8%', y: '16%', delay: 0.1 },
      { id: 'eagle', name: 'Eagle Eye', emoji: '🦅', subtitle: '4x zoom eyesight spots mice from 2 km', x: '86%', y: '14%', delay: 0.2 },
      { id: 'snake', name: 'Cobra', emoji: '🐍', subtitle: 'Feels ground vibrations through jawbone', x: '10%', y: '60%', delay: 0.3 },
      { id: 'moth', name: 'Silkworm Moth', emoji: '🦋', subtitle: 'Feathery antennae detect distant scents', x: '88%', y: '62%', delay: 0.4 },
      { id: 'seed', name: 'Burdock Seed', emoji: '🌱', subtitle: 'Microscopic hooks that inspired Velcro', x: '50%', y: '8%', delay: 0.5 },
    ],
    pipLessons: [
      {
        dialogue: "Animals and plants have amazing senses! Some can see, hear, smell, or feel things humans cannot.",
        pipMood: 'explaining',
        keyConceptTitle: 'Animal Super Senses',
        keyConceptHighlight: 'Animal senses evolved to hunt food, communicate, and spot danger.',
      },
      {
        dialogue: "Ants leave invisible scent highways called pheromones so their colony marches in straight lines!",
        pipMood: 'curious',
        keyConceptTitle: 'Scent Trails & Pheromones',
        keyConceptHighlight: 'Ant antennae chemoreceptors pick up microscopic pheromone trails.',
      },
      {
        dialogue: "Eagles spot food from 2 km away, while snakes feel footsteps as soil vibrations through their jawbone!",
        pipMood: 'celebrating',
        keyConceptTitle: 'Telescopic Eyes & Soil Hearing',
        keyConceptHighlight: 'Different animals adapt specialized organs to master their habitats.',
      },
    ],
  },
  water: {
    id: 'water',
    title: 'Water & Aquatic Experiments',
    subtitle: 'Planetary Hydrology, Density & Buoyancy Experiments',
    syllabusCode: 'CBSE Class 5 EVS • Theme 2 & 4',
    bgGradient: 'from-sky-100 via-blue-50 to-teal-50',
    hubRoute: '/theme/water/hub',
    accentColor: 'bg-sky-400 border-sky-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#0284C7]',
    specimens: [
      { id: 'steam', name: 'Solar Evaporation', emoji: '☀️', subtitle: 'Sun heat turns water into invisible vapor', x: '8%', y: '16%', delay: 0.1 },
      { id: 'cloud', name: 'Cold Cloud', emoji: '☁️', subtitle: 'Vapor condenses into rain droplets', x: '86%', y: '14%', delay: 0.2 },
      { id: 'ship', name: 'Steel Cargo Ship', emoji: '🚢', subtitle: 'Hollow air pockets make heavy ships float', x: '10%', y: '60%', delay: 0.3 },
      { id: 'deadsea', name: 'Dead Sea Salt', emoji: '🧂', subtitle: 'Dense salt water makes humans float', x: '88%', y: '62%', delay: 0.4 },
    ],
    pipLessons: [
      {
        dialogue: "Water is Earth's greatest shape-shifter! Rain today is the same water dinosaurs drank millions of years ago!",
        pipMood: 'explaining',
        keyConceptTitle: 'The Endless Water Cycle',
        keyConceptHighlight: 'Solar energy evaporates water into clouds which rain back to Earth.',
      },
      {
        dialogue: "A solid iron nail sinks, but a massive steel ship floats because its hollow shape traps air!",
        pipMood: 'curious',
        keyConceptTitle: 'Density & Archimedes Buoyancy',
        keyConceptHighlight: 'Trapped air lowers overall density, creating upward buoyant force.',
      },
    ],
  },
  shelter: {
    id: 'shelter',
    title: 'Shelter, Mountains & Earth Expeditions',
    subtitle: 'Cold Deserts, Pashmina Wool & Earthquake Architecture',
    syllabusCode: 'CBSE Class 5 EVS • Theme 3 & 5',
    bgGradient: 'from-amber-100 via-orange-50 to-emerald-50',
    hubRoute: '/theme/shelter/hub',
    accentColor: 'bg-amber-400 border-amber-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#D97706]',
    specimens: [
      { id: 'pashmina', name: 'Pashmina Fleece', emoji: '🐐', subtitle: '6x warmer than human hair', x: '8%', y: '16%', delay: 0.1 },
      { id: 'tent', name: 'Rebo Yak Tent', emoji: '⛺', subtitle: 'Yak hair keeps biting winds out', x: '86%', y: '14%', delay: 0.2 },
      { id: 'everest', name: 'Mt. Everest', emoji: '🏔️', subtitle: '8,848m high frozen summit', x: '10%', y: '60%', delay: 0.3 },
      { id: 'bhunga', name: 'Bhunga House', emoji: '🛖', subtitle: 'Round walls resist strong earthquake tremors', x: '88%', y: '62%', delay: 0.4 },
    ],
    pipLessons: [
      {
        dialogue: "At 5,000 meters high in Ladakh, temperatures drop below freezing! The Changpa goats grow ultra-fine Pashmina wool.",
        pipMood: 'explaining',
        keyConceptTitle: 'High-Altitude Survival',
        keyConceptHighlight: 'Microscopic air pockets in Pashmina wool trap body warmth in sub-zero snow.',
      },
      {
        dialogue: "In Kutch, Gujarat, round Bhunga homes withstand violent earthquakes by dispersing seismic ground forces evenly!",
        pipMood: 'celebrating',
        keyConceptTitle: 'Earthquake-Safe Architecture',
        keyConceptHighlight: 'Circular architecture prevents wall collapse during seismic shockwaves.',
      },
    ],
  },
};

export const UniversalMascotChapterIntro: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const config = COURSE_INTROS[themeId || 'senses'] || COURSE_INTROS.senses;
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selectedSpecimen, setSelectedSpecimen] = useState<FloatingSpecimen | null>(null);

  const activeLesson = config.pipLessons[lessonIndex] || config.pipLessons[0];

  const handleNext = () => {
    sounds.pop();
    if (lessonIndex < config.pipLessons.length - 1) {
      setLessonIndex(lessonIndex + 1);
      voiceAssistant.speak(config.pipLessons[lessonIndex + 1].dialogue);
    } else {
      sounds.fanfare();
      voiceAssistant.stop();
      navigate(config.hubRoute);
    }
  };

  const handleSpecimenTap = (specimen: FloatingSpecimen) => {
    sounds.sparkle();
    setSelectedSpecimen(specimen);
    voiceAssistant.speak(`${specimen.name}: ${specimen.subtitle}`);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none`}>
      {/* ── Soft Ambient Blurred Specimen Background (Low Opacity, Zero Distraction) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {config.specimens.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4 + (idx % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className="absolute blur-[1px] text-4xl sm:text-5xl"
            style={{ left: item.x, top: item.y }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* ── Sleek Top Minimal Header ── */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20 pt-1">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/subjects');
          }}
          className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider bg-white/85 backdrop-blur-md text-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
          {config.syllabusCode}
        </span>

        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate(config.hubRoute);
          }}
          className="text-xs font-black text-slate-700 bg-white/90 hover:bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* ── 🌟 SINGLE UNIFIED FOCUSED HERO CARD (Zero Clutter, 100% Clarity) ── */}
      <main className="z-20 max-w-2xl w-full my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[40px] border-4 border-white shadow-2xl flex flex-col items-center text-center relative"
        >
          {/* Top Clean Sub-Pill */}
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200 inline-block mb-2">
            {activeLesson.keyConceptTitle}
          </span>

          {/* Main Clean Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {config.title}
          </h1>

          {/* Pip & Speech Bubble in Focused Duo */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-5 w-full justify-center">
            <div className="shrink-0">
              <Pip mood={activeLesson.pipMood} size="lg" />
            </div>
            <div className="flex-1 bg-gradient-to-tr from-slate-50 to-indigo-50/40 p-4 sm:p-5 rounded-3xl border-2 border-indigo-100 text-left shadow-xs relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  ✨ Pip the Science Guide
                </span>
                <button
                  onClick={() => {
                    sounds.pop();
                    voiceAssistant.speak(activeLesson.dialogue);
                  }}
                  className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                  title="Listen aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                {activeLesson.dialogue}
              </p>
            </div>
          </div>

          {/* Interactive Specimen Quick-Tray (Tucked neatly inside the card) */}
          <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
              Tap any specimen to preview its superpower:
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {config.specimens.map((item) => {
                const isSelected = selectedSpecimen?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSpecimenTap(item)}
                    className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-300 border-amber-500 text-slate-950 scale-105 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedSpecimen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 p-2 rounded-xl bg-amber-100 text-amber-950 text-xs font-bold text-center border border-amber-300"
              >
                <strong>{selectedSpecimen.emoji} {selectedSpecimen.name}:</strong> {selectedSpecimen.subtitle}
              </motion.div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="w-full flex flex-col items-center gap-3">
            {lessonIndex < config.pipLessons.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-800 shadow-[0_5px_0_#3730A3] active:translate-y-1 text-white font-black text-sm sm:text-base py-3 px-10 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Continue Lesson ({lessonIndex + 1}/{config.pipLessons.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 border-2 border-emerald-700 shadow-[0_5px_0_#065F46] active:translate-y-1 text-slate-950 font-black text-sm sm:text-base py-3.5 px-10 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>🚀 LET'S START CHAPTER EXPERIMENTS!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {/* Stepping Dots */}
            <div className="flex gap-2 mt-1">
              {config.pipLessons.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.pop();
                    setLessonIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === lessonIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
