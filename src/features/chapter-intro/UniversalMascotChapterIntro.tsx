import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft, Home, Sparkles, CheckCircle2 } from 'lucide-react';

interface CourseIntroConfig {
  id: string;
  title: string;
  subtitle: string;
  syllabusCode: string;
  bgGradient: string;
  hubRoute: string;
  accentColor: string;
  pipLessons: {
    dialogue: string;
    pipMood: 'explaining' | 'curious' | 'celebrating' | 'thinking' | 'encouraging';
    keyTitle: string;
    keyFact: string;
  }[];
}

const COURSE_INTROS: Record<string, CourseIntroConfig> = {
  materials: {
    id: 'materials',
    title: 'Things We Make & Do 🧪',
    subtitle: 'Materials & Inventions',
    syllabusCode: 'Class 5 • Science',
    bgGradient: 'from-amber-100 via-orange-50 to-sky-100',
    hubRoute: '/chapter-hub',
    accentColor: 'border-amber-400',
    pipLessons: [
      {
        dialogue: "Look around you! Everything you touch is made of a special material — like soft cotton for clothes, or strong plastic for bottles.",
        pipMood: 'explaining',
        keyTitle: 'Everyday Materials',
        keyFact: 'Every object is made from a material chosen to do a special job.',
      },
      {
        dialogue: "Natural materials come from plants and animals (like wood and wool). Synthetic materials are made by scientists in labs (like nylon and plastic)!",
        pipMood: 'curious',
        keyTitle: 'Nature vs. Science Lab',
        keyFact: 'Wood and wool grow in nature. Plastic and nylon are invented by people.',
      },
      {
        dialogue: "Here is our Big Science Rule: What something is MADE OF decides what it CAN DO!",
        pipMood: 'celebrating',
        keyTitle: 'The Big Science Rule',
        keyFact: 'Material ➔ What it can do ➔ What we use it for!',
      },
    ],
  },
  senses: {
    id: 'senses',
    title: 'Super Senses & Animals 🦋',
    subtitle: 'Animal Superpowers',
    syllabusCode: 'Class 5 • Living World',
    bgGradient: 'from-emerald-100 via-teal-50 to-amber-50',
    hubRoute: '/theme/1/hub',
    accentColor: 'border-emerald-400',
    pipLessons: [
      {
        dialogue: "Animals have amazing super senses! Some can see, hear, or smell things that humans could never notice.",
        pipMood: 'explaining',
        keyTitle: 'Animal Super Senses',
        keyFact: 'Animals use super senses to find food, talk to friends, and stay safe.',
      },
      {
        dialogue: "Ants leave an invisible smell trail so their friends can walk in a straight line. Snakes feel footsteps shaking the ground!",
        pipMood: 'curious',
        keyTitle: 'Scent Trails & Ground Shakes',
        keyFact: 'Ants follow smell trails. Snakes feel footsteps through their jawbone.',
      },
      {
        dialogue: "Let's explore animal superpowers and see how they inspire cool human inventions like Velcro!",
        pipMood: 'celebrating',
        keyTitle: 'Nature to Inventions',
        keyFact: 'Sticky burdock plant seeds inspired the invention of Velcro fasteners!',
      },
    ],
  },
  water: {
    id: 'water',
    title: 'Water Wonders & Experiments 🌊',
    subtitle: 'Floating, Sinking & Water Cycle',
    syllabusCode: 'Class 5 • Water',
    bgGradient: 'from-sky-100 via-blue-50 to-teal-50',
    hubRoute: '/theme/water/hub',
    accentColor: 'border-sky-400',
    pipLessons: [
      {
        dialogue: "Water is our planet's most magical liquid! It turns into cold ice, flows as rivers, and floats up into the sky as fluffy clouds.",
        pipMood: 'explaining',
        keyTitle: 'Water Travels in Circles',
        keyFact: 'Sun heat turns water into vapor clouds that fall back as rain!',
      },
      {
        dialogue: "Why does a giant steel boat float, but a small iron nail sinks to the bottom? It is all about how water pushes upward!",
        pipMood: 'curious',
        keyTitle: 'Why Things Float',
        keyFact: 'Water pushes up on wide shapes, helping heavy ships float!',
      },
      {
        dialogue: "Mosquito babies live in stagnant water and breathe through a tail snorkel. A drop of oil on water stops them from biting us!",
        pipMood: 'celebrating',
        keyTitle: 'Water Ecology & Safety',
        keyFact: 'Keeping water clean and covered protects us from malaria and dengue.',
      },
    ],
  },
  shelter: {
    id: 'shelter',
    title: 'Cool Houses & Mountains 🏔️',
    subtitle: 'Survival & Earthquake Architecture',
    syllabusCode: 'Class 5 • Shelters',
    bgGradient: 'from-indigo-100 via-sky-50 to-amber-50',
    hubRoute: '/theme/shelter/hub',
    accentColor: 'border-indigo-400',
    pipLessons: [
      {
        dialogue: "From freezing snowy peaks to hot deserts, people build clever homes to stay safe, warm, and comfortable.",
        pipMood: 'explaining',
        keyTitle: 'Clever Shelters',
        keyFact: 'Houses are built differently to match mountains, lakes, or deserts.',
      },
      {
        dialogue: "In cold mountains, Pashmina goats grow wool 6 times thinner than human hair. In desert Kutch, round mud houses survive huge earthquakes!",
        pipMood: 'curious',
        keyTitle: 'Warm Wool & Round Houses',
        keyFact: 'Round walls have no sharp corners to crack during earthquakes!',
      },
      {
        dialogue: "In outer space, water floats as round spheres with no gravity. Let's travel across India and orbit in space!",
        pipMood: 'celebrating',
        keyTitle: 'Ready for Adventure',
        keyFact: 'Explore Mount Everest, Golconda Fort, and the Space Station!',
      },
    ],
  },
};

export const UniversalMascotChapterIntro: React.FC = () => {
  const { courseKey, themeId } = useParams<{ courseKey?: string; themeId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParam = new URLSearchParams(location.search).get('course') || new URLSearchParams(location.search).get('theme');
  const resolvedKey = queryParam || courseKey || themeId || (location.pathname.includes('water') ? 'water' : location.pathname.includes('shelter') ? 'shelter' : location.pathname.includes('1') || location.pathname.includes('senses') ? 'senses' : 'materials');

  const config = COURSE_INTROS[resolvedKey] || COURSE_INTROS.materials;
  const [lessonIndex, setLessonIndex] = useState(0);

  const activeLesson = config.pipLessons[lessonIndex] || config.pipLessons[0];
  const isLastLesson = lessonIndex >= config.pipLessons.length - 1;

  const handleNext = () => {
    sounds.pop();
    if (!isLastLesson) {
      setLessonIndex(lessonIndex + 1);
    } else {
      sounds.fanfare();
      voiceAssistant.stop();
      navigate(config.hubRoute);
    }
  };

  const handleSkipDirectly = () => {
    sounds.fanfare();
    voiceAssistant.stop();
    navigate(config.hubRoute);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none`}>
      {/* ── Top Header Bar ── */}
      <header className="w-full max-w-2xl flex items-center justify-between z-20">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/subjects');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 font-black text-xs border border-slate-200 shadow-xs cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>

        <button
          onClick={handleSkipDirectly}
          className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs border border-amber-500 active:scale-95 transition-all"
        >
          <span>⚡ Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── Main Focused Lesson Card (Compact, Clear & Friendly) ── */}
      <main className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-[32px] border-4 border-sky-400 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 z-20 my-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
          <span className="text-[11px] font-black uppercase text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            {config.title}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Step {lessonIndex + 1} of {config.pipLessons.length}
          </span>
        </div>

        {/* Compact Companion Pip (Size 64px) & Bubble */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
          <div className="shrink-0">
            <Pip mood={activeLesson.pipMood} size={64} />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h4 className="text-sm font-black text-slate-900 mb-1">
              💡 {activeLesson.keyTitle}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              "{activeLesson.dialogue}"
            </p>
          </div>
        </div>

        {/* Key Science Takeaway Badge */}
        <div className="w-full p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <span className="text-[11px] font-black text-emerald-900 block">
            ⭐ Science Secret: {activeLesson.keyFact}
          </span>
        </div>

        {/* ── GIANT NEXT STEP BUTTON (CANNOT MISS WHAT TO CLICK NEXT) ── */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-base sm:text-lg shadow-lg cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-emerald-300 ring-4 ring-emerald-100"
        >
          <span>{isLastLesson ? '👉 ENTER SCIENCE LAB ➔' : '👉 NEXT STEP ➔'}</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </motion.button>

        {/* Clickable Step Dots */}
        <div className="flex items-center gap-2 mt-1">
          {config.pipLessons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setLessonIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === lessonIndex ? 'w-8 bg-sky-500 shadow-xs' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full max-w-2xl flex items-center justify-center text-xs font-bold text-slate-500 z-20">
        <span>Tap the green button above to continue!</span>
      </footer>
    </div>
  );
};
