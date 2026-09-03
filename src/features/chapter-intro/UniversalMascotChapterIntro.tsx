import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Bar ── */}
      <header className="w-full max-w-2xl flex items-center justify-between z-20">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/subjects');
          }}
          className="edtech-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>

        <button
          onClick={handleSkipDirectly}
          className="edtech-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── Main Focused Lesson Card (Modern EdTech) ── */}
      <main className="w-full max-w-xl edtech-card p-6 sm:p-8 flex flex-col items-center text-center gap-5 z-20 my-auto bg-white shadow-xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            {config.title}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            Concept {lessonIndex + 1} of {config.pipLessons.length}
          </span>
        </div>

        {/* Companion Pip & Speech Dialogue */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left">
          <div className="shrink-0">
            <Pip mood={activeLesson.pipMood} size={64} interactive={false} />
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              {activeLesson.keyTitle}
            </h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              "{activeLesson.dialogue}"
            </p>
          </div>
        </div>

        {/* Takeaway Insight Callout */}
        <div className="w-full text-left bg-blue-50/70 border-l-4 border-blue-600 p-3.5 rounded-r-xl">
          <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider block mb-0.5">
            Key Takeaway
          </span>
          <p className="text-xs font-semibold text-blue-950">
            {activeLesson.keyFact}
          </p>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="w-full flex items-center justify-between pt-2">
          {lessonIndex > 0 ? (
            <button
              onClick={() => {
                sounds.pop();
                setLessonIndex(lessonIndex - 1);
              }}
              className="edtech-btn-secondary px-4 py-2 text-xs"
            >
              Previous
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="edtech-btn-primary px-6 py-2.5 text-xs font-bold"
          >
            <span>{isLastLesson ? 'Begin Exploration →' : 'Next Concept →'}</span>
          </button>
        </div>
      </main>

      <div className="h-6" />
    </div>
  );
};
