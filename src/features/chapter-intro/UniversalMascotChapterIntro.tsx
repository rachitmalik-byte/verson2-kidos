import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';

interface CourseIntroConfig {
  id: string;
  title: string;
  subtitle: string;
  themeCode: string;
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
    subtitle: 'Materials Science & Inventions',
    themeCode: 'REALM 06 • MATERIALS',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-950',
    hubRoute: '/chapter-hub',
    accentColor: 'border-blue-500/40',
    pipLessons: [
      {
        dialogue: "Look around you! Everything you touch is made of a special material — like soft cotton for clothes, or strong plastic for bottles.",
        pipMood: 'explaining',
        keyTitle: 'Everyday Materials Around Us',
        keyFact: 'Every object is engineered from a material chosen specifically for its unique physical properties.',
      },
      {
        dialogue: "Natural materials come from plants and animals (like wood, cotton, and wool). Synthetic materials are synthesized by scientists in labs (like nylon and polyester)!",
        pipMood: 'curious',
        keyTitle: 'Natural vs. Synthetic Polymers',
        keyFact: 'Natural fibers grow in nature. Synthetic polymers are invented by humans using chemistry.',
      },
      {
        dialogue: "Here is our Golden Science Rule: What a material is MADE OF determines what it CAN DO!",
        pipMood: 'celebrating',
        keyTitle: 'The Golden Science Law',
        keyFact: 'Molecular Structure ➔ Physical Properties ➔ Everyday Practical Uses!',
      },
    ],
  },
  senses: {
    id: 'senses',
    title: 'Super Senses & Living Biosphere 🌿',
    subtitle: 'Animal Superpowers & Biomimicry',
    themeCode: 'REALM 01 • SUPER SENSES',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-950',
    hubRoute: '/theme/1/hub',
    accentColor: 'border-emerald-500/40',
    pipLessons: [
      {
        dialogue: "Animals possess extraordinary sensory adaptations! They perceive sounds, scents, and light frequencies that humans cannot detect without complex instruments.",
        pipMood: 'explaining',
        keyTitle: 'Extreme Sensory Systems',
        keyFact: 'Animals use hypersensitive sensory organs to forage, navigate, and alert peers to danger.',
      },
      {
        dialogue: "Ants leave microscopic chemical pheromone trails so thousands can march without losing their way. Snakes detect seismic ground tremors through their lower jawbone!",
        pipMood: 'curious',
        keyTitle: 'Pheromones & Seismic Acoustics',
        keyFact: 'Ant trails use invisible scent molecules. Snakes feel acoustic ground vibrations through bone conduction.',
      },
      {
        dialogue: "Nature's designs inspire human engineering! Hook-shaped burdock seeds sticking to dog fur inspired Swiss engineer George de Mestral to invent Velcro!",
        pipMood: 'celebrating',
        keyTitle: 'Biomimicry in Action',
        keyFact: 'Microscopic plant seed hooks directly inspired the invention of Velcro fastening loops.',
      },
    ],
  },
  water: {
    id: 'water',
    title: 'Oceans, Density & Hydrosphere 🌊',
    subtitle: 'Buoyancy Forces & Hydrological Cycles',
    themeCode: 'REALM 02 • HYDROSPHERE',
    bgGradient: 'from-slate-950 via-cyan-950 to-slate-950',
    hubRoute: '/theme/water/hub',
    accentColor: 'border-cyan-500/40',
    pipLessons: [
      {
        dialogue: "Water is our planet's most versatile substance! It continuously cycles between solid glacial ice, ocean currents, and high-altitude cumulus clouds.",
        pipMood: 'explaining',
        keyTitle: 'The Planetary Water Cycle',
        keyFact: 'Solar radiation evaporates ocean surface water into vapor clouds that condense and return as rain.',
      },
      {
        dialogue: "Why does a 50,000-ton steel container ship float effortlessly while a tiny iron nail plunges to the ocean floor? It all depends on water displacement and upward buoyant force!",
        pipMood: 'curious',
        keyTitle: 'Displacement & Buoyant Force',
        keyFact: 'A ship floats because its hollow hull displaces a volume of water equal to its own massive weight.',
      },
      {
        dialogue: "In high-salinity waters like the Dead Sea, water becomes so dense with dissolved salt minerals that human swimmers float like corks without swimming!",
        pipMood: 'celebrating',
        keyTitle: 'Salinity & Density Gradients',
        keyFact: 'Dissolved salts increase water density, exerting greater upward buoyant pressure on immersed objects.',
      },
    ],
  },
  shelter: {
    id: 'shelter',
    title: 'Extreme Shelters & Habitats 🏔️',
    subtitle: 'High-Altitude Physics & Earth Architecture',
    themeCode: 'REALM 04 • HABITATS',
    bgGradient: 'from-slate-950 via-violet-950 to-slate-950',
    hubRoute: '/theme/shelter/hub',
    accentColor: 'border-violet-500/40',
    pipLessons: [
      {
        dialogue: "Humans adapt to the most extreme environments on Earth — from freezing -40°C Himalayan plateaus to scorched deserts and zero-gravity orbital stations!",
        pipMood: 'explaining',
        keyTitle: 'Extreme Climate Adaptations',
        keyFact: 'Traditional architectural materials are engineered to exploit local microclimates and natural insulation.',
      },
      {
        dialogue: "Changpa nomads in Ladakh weave yak hair into thick 'Rebo' tents. Yak hair expands in sub-zero snow to block freezing winds, yet stays breathable inside!",
        pipMood: 'curious',
        keyTitle: 'Woven Yak Hair Insulation',
        keyFact: 'Natural hollow yak hair fibers trap insulating air pockets, keeping mountain tents warm in blizzards.',
      },
      {
        dialogue: "In earthquake-prone Kutch, circular Bhunga mud houses withstand massive tremors. Round circular walls distribute seismic waves evenly without sharp corners to crack!",
        pipMood: 'celebrating',
        keyTitle: 'Seismic Shock Dissipation',
        keyFact: 'Circular architecture eliminates stress-concentration corners, preventing structural failure during quakes.',
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

  const handleReadAloud = () => {
    sounds.pop();
    voiceAssistant.speak(`${activeLesson.keyTitle}. ${activeLesson.dialogue}. Key fact: ${activeLesson.keyFact}`);
  };

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
    <PersistentAppShell activeDestination="map">
      <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} text-white relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 font-sans select-none`}>
        {/* Radial Ambient World Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative z-10 my-auto">
          {/* ── Sub Header Bar ── */}
          <header className="w-full flex items-center justify-between z-20">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Worlds</span>
            </button>

            <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/15">
              {config.themeCode}
            </span>

            <button
              onClick={handleSkipDirectly}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </header>

          {/* ── Main Focused Story Arena ── */}
          <main className={`portal-hero w-full bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border ${config.accentColor} shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden`}>
            {/* Step Indicator */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  {config.title}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                Briefing {lessonIndex + 1} of {config.pipLessons.length}
              </span>
            </div>

            {/* Companion Pip & Audio Narrator */}
            <div className="flex flex-col items-center gap-3">
              <Pip mood={activeLesson.pipMood} size={88} interactive={true} />
              <button
                onClick={handleReadAloud}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Read briefing aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Pip</span>
              </button>
            </div>

            {/* Dialogue & Concept Box */}
            <div className="w-full max-w-xl text-left bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-display font-extrabold text-white mb-2">
                {activeLesson.keyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                "{activeLesson.dialogue}"
              </p>
            </div>

            {/* Core Science Principle */}
            <div className="w-full max-w-xl text-left bg-cyan-950/40 border-l-4 border-cyan-400 p-4 rounded-r-2xl">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Core Scientific Principle
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                {activeLesson.keyFact}
              </p>
            </div>

            {/* Step Progression Meter */}
            <div className="w-full max-w-xl flex items-center justify-between gap-2 pt-2">
              {config.pipLessons.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    idx <= lessonIndex ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Bottom Navigation CTA */}
            <div className="w-full flex items-center justify-between pt-2">
              {lessonIndex > 0 ? (
                <button
                  onClick={() => {
                    sounds.pop();
                    setLessonIndex(lessonIndex - 1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 cursor-pointer transition-all"
                >
                  Previous
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-500/30 cursor-pointer transition-all"
              >
                <span>{isLastLesson ? 'Launch Expedition World →' : 'Next Discovery →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </PersistentAppShell>
  );
};
