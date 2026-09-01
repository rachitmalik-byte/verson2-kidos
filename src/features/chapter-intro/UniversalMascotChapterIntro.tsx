import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { PipLiveSubtitleOverlay } from '@/components/pip/PipLiveSubtitleOverlay';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft, Sparkles, Home, Map } from 'lucide-react';

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
    title: 'Things We Make & Do: Materials Science 🧪',
    subtitle: 'Natural vs. Synthetic Polymers, Fibres & Biodegradability',
    syllabusCode: 'CBSE Class 5 EVS • Theme 6',
    bgGradient: 'from-amber-200 via-orange-100 to-sky-100',
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
        dialogue: "Look around you! Everything you touch is made from a material chosen for a special superpower.",
        pipMood: 'explaining',
        keyConceptTitle: 'Everyday Materials',
        keyConceptHighlight: 'Every object is crafted from a material that fits its physical job.',
      },
      {
        dialogue: "Natural materials come from plants and animals. Synthetic materials are invented by scientists in labs!",
        pipMood: 'curious',
        keyConceptTitle: 'Natural vs Synthetic',
        keyConceptHighlight: 'Plant cellulose and animal fleece grow in nature; nylon and plastics are synthesized.',
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
    title: 'Super Senses & Living Creatures 🦋',
    subtitle: 'Animal Superpowers, Scent Trails & Seed Dispersal',
    syllabusCode: 'CBSE Class 5 EVS • Theme 1',
    bgGradient: 'from-emerald-200 via-teal-100 to-amber-100',
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
        dialogue: "Animals and plants have super senses! Some can see, hear, smell, or feel things humans cannot.",
        pipMood: 'explaining',
        keyConceptTitle: 'Animal Super Senses',
        keyConceptHighlight: 'Animal senses evolved to hunt food, communicate, and spot danger.',
      },
      {
        dialogue: "Ants leave chemical scent pheromones so their colony walks in a line. Snakes feel footsteps through their jawbone!",
        pipMood: 'curious',
        keyConceptTitle: 'Scent Highways & Seismic Hearing',
        keyConceptHighlight: 'Pheromones guide ant trails; bone conduction lets snakes hear ground steps.',
      },
      {
        dialogue: "Let's explore the Living World and discover how animal superpowers inspire human inventions!",
        pipMood: 'celebrating',
        keyConceptTitle: 'Nature to Inventions',
        keyConceptHighlight: 'Nature inspires science — like burdock seed hooks inspiring modern Velcro fasteners!',
      },
    ],
  },
  water: {
    id: 'water',
    title: 'Water & Aquatic Experiments 🌊',
    subtitle: 'Floating & Sinking, Water Cycle & Rain Preservation',
    syllabusCode: 'CBSE Class 5 EVS • Theme 2 & 4',
    bgGradient: 'from-sky-200 via-blue-100 to-indigo-100',
    hubRoute: '/theme/water/hub',
    accentColor: 'bg-sky-400 border-sky-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#0284C7]',
    specimens: [
      { id: 'drop', name: 'Water Drop', emoji: '💧', subtitle: 'Surface tension & evaporation', x: '8%', y: '16%', delay: 0.1 },
      { id: 'ship', name: 'Cargo Ship', emoji: '🚢', subtitle: 'Heavy steel buoyant displacement', x: '86%', y: '14%', delay: 0.2 },
      { id: 'salt', name: 'Dead Sea Salt', emoji: '🧂', subtitle: 'High saline liquid density (300 g/L)', x: '10%', y: '60%', delay: 0.3 },
      { id: 'lake', name: 'Bawri Stepwell', emoji: '🏰', subtitle: 'Ancient 9-lake rainwater harvesting', x: '88%', y: '62%', delay: 0.4 },
      { id: 'cloud', name: 'Rain Cloud', emoji: '🌧️', subtitle: 'Atmospheric condensation & precipitation', x: '50%', y: '8%', delay: 0.5 },
    ],
    pipLessons: [
      {
        dialogue: "Water is our planet's most magical liquid! It changes into invisible vapor, floats heavy ships, and sustains all life.",
        pipMood: 'explaining',
        keyConceptTitle: 'The Magic of Water',
        keyConceptHighlight: 'Water exists as solid ice, liquid water, and gaseous atmospheric vapor.',
      },
      {
        dialogue: "A heavy steel ship floats while a tiny iron nail sinks! It all comes down to buoyant upward force and liquid density.",
        pipMood: 'curious',
        keyConceptTitle: 'Buoyancy & Archimedes Principle',
        keyConceptHighlight: 'Displaced water weight pushes upward with buoyant force to keep ships afloat.',
      },
      {
        dialogue: "In the Dead Sea, water is so dense with minerals that you can float effortlessly without swimming!",
        pipMood: 'celebrating',
        keyConceptTitle: 'Density Discoveries',
        keyConceptHighlight: 'High density liquids generate strong upward buoyant force.',
      },
    ],
  },
  shelter: {
    id: 'shelter',
    title: 'Shelter, Mountains & Earth 🏔️',
    subtitle: 'Nomadic Rebo Tents, Pashmina Physics & Seismic Homes',
    syllabusCode: 'CBSE Class 5 EVS • Theme 3 & 5',
    bgGradient: 'from-indigo-200 via-purple-100 to-amber-100',
    hubRoute: '/theme/shelter/hub',
    accentColor: 'bg-indigo-400 border-indigo-600 text-slate-950',
    btnShadow: 'shadow-[0_6px_0_#4F46E5]',
    specimens: [
      { id: 'tent', name: 'Changpa Rebo Tent', emoji: '⛺', subtitle: 'Woven yak hair protects at -40°C', x: '8%', y: '16%', delay: 0.1 },
      { id: 'goat', name: 'Pashmina Goat', emoji: '🐐', subtitle: '12 µm ultra-fine thermal underfleece', x: '86%', y: '14%', delay: 0.2 },
      { id: 'peak', name: 'Mt. Everest', emoji: '🏔️', subtitle: '8,848m high-altitude oxygen hypoxia', x: '10%', y: '60%', delay: 0.3 },
      { id: 'fort', name: 'Golconda Fort', emoji: '🏰', subtitle: 'Acoustic clapping domes & bastions', x: '88%', y: '62%', delay: 0.4 },
      { id: 'bhunga', name: 'Kutch Bhunga', emoji: '🛖', subtitle: 'Circular earthquake-dispersal walls', x: '50%', y: '8%', delay: 0.5 },
    ],
    pipLessons: [
      {
        dialogue: "From the freezing plateaus of Ladakh to ancient stone forts, human shelters are masterpieces of engineering!",
        pipMood: 'explaining',
        keyConceptTitle: 'Habitats & Adaptations',
        keyConceptHighlight: 'Humans and animals build shelters tailored to extreme regional climates.',
      },
      {
        dialogue: "Changpa nomads weave warm yak hair into tents called Rebo. Pashmina goat hair is six times finer than human hair!",
        pipMood: 'curious',
        keyConceptTitle: 'Pashmina & Nomadic Life',
        keyConceptHighlight: 'Microscopic air pockets in Pashmina fleece trap heat during -40°C winter blizzards.',
      },
      {
        dialogue: "In earthquake-prone Kutch, circular Bhunga clay houses disperse tremors so families stay completely safe!",
        pipMood: 'celebrating',
        keyConceptTitle: 'Seismic Architecture',
        keyConceptHighlight: 'Circular architecture disperses seismic shockwaves without wall collapse.',
      },
    ],
  },
};

function resolveCourseConfig(key?: string): CourseIntroConfig {
  if (!key) return COURSE_INTROS.materials;
  const k = key.toLowerCase();
  if (k.includes('sense') || k === 'living-world' || k === '1' || k === 'theme1') return COURSE_INTROS.senses;
  if (k.includes('water') || k === '2' || k === '4') return COURSE_INTROS.water;
  if (k.includes('shelter') || k === '3' || k === '5' || k.includes('mountain')) return COURSE_INTROS.shelter;
  return COURSE_INTROS.materials;
}

export const UniversalMascotChapterIntro: React.FC = () => {
  const { courseKey, themeId } = useParams<{ courseKey?: string; themeId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Search query support: ?course=water
  const queryParam = new URLSearchParams(location.search).get('course') || new URLSearchParams(location.search).get('theme');
  const resolvedKey = queryParam || courseKey || themeId || (location.pathname.includes('water') ? 'water' : location.pathname.includes('shelter') ? 'shelter' : location.pathname.includes('1') || location.pathname.includes('senses') ? 'senses' : 'materials');

  const config = resolveCourseConfig(resolvedKey);
  const [lessonIndex, setLessonIndex] = useState(0);

  const activeLesson = config.pipLessons[lessonIndex] || config.pipLessons[0];

  const handleNext = () => {
    sounds.pop();
    if (lessonIndex < config.pipLessons.length - 1) {
      setLessonIndex(lessonIndex + 1);
    } else {
      sounds.fanfare();
      voiceAssistant.stop();
      navigate(config.hubRoute);
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none`}>
      {/* ── Soft Ambient Blurred Specimen Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
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

      {/* ── Sleek Top Navigation Bar ── */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/subjects');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs sm:text-sm border-2 border-slate-200 shadow-sm cursor-pointer active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>All Subjects</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 bg-white/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200 shadow-xs">
          {config.syllabusCode}
        </span>
      </header>

      {/* ── ONE FOCUSED HERO STAGE CARD WITH ANIMATED SUBTITLE OVERLAY ── */}
      <main className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[36px] border-4 border-amber-400/90 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-5 z-20 my-auto">
        {/* Title Header */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full inline-block mb-1 border border-indigo-200">
            {config.title}
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            {config.subtitle}
          </p>
        </div>

        {/* Mascot Center Stage */}
        <div className="flex flex-col items-center justify-center my-1">
          <Pip mood={activeLesson.pipMood} size={110} />
        </div>

        {/* ── LIVE SYNCHRONIZED ANIMATED SUBTITLE OVERLAY AROUND PIP ── */}
        <PipLiveSubtitleOverlay
          dialogue={activeLesson.dialogue}
          pipMood={activeLesson.pipMood}
        />

        {/* Specimen Superpower Quick-Pills Tray */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-slate-100">
          {config.specimens.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 shadow-xs"
            >
              <span>{item.emoji}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleNext}
          className={`w-full py-4 px-8 rounded-2xl ${config.accentColor} font-black text-sm sm:text-base cursor-pointer ${config.btnShadow} active:translate-y-1 transition-all flex items-center justify-center gap-2`}
        >
          <span>{lessonIndex < config.pipLessons.length - 1 ? 'Continue Lesson ➔' : "🚀 START CHAPTER EXPERIMENTS!"}</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </main>

      {/* ── Bottom Step Indicator ── */}
      <footer className="w-full max-w-md flex items-center justify-center gap-2 z-20 pb-2">
        {config.pipLessons.map((_, idx) => (
          <div
            key={idx}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === lessonIndex
                ? 'w-8 bg-slate-900 shadow-md'
                : 'w-2.5 bg-slate-400/60'
            }`}
          />
        ))}
      </footer>
    </div>
  );
};
