import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

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
    subtitle: 'Natural vs. Synthetic Polymers, Fibres, Thermal Insulation & Biodegradability',
    syllabusCode: 'CBSE Class 5 EVS • Theme 6',
    bgGradient: 'from-amber-300 via-orange-100 to-sky-100',
    hubRoute: '/chapter-hub',
    accentColor: 'bg-amber-400 border-amber-600 text-slate-950',
    btnShadow: 'shadow-[0_8px_0_#D97706]',
    specimens: [
      { id: 'shirt', name: 'Polyester T-Shirt', emoji: '👕', subtitle: 'Hydrophobic Synthetic Polymer', x: '8%', y: '16%', delay: 0.1 },
      { id: 'coat', name: 'Raincoat', emoji: '🧥', subtitle: 'Non-Porous Water Barrier', x: '82%', y: '14%', delay: 0.2 },
      { id: 'wood', name: 'Raw Timber Wood', emoji: '🪵', subtitle: 'Natural Cellulose & Lignin Grain', x: '12%', y: '50%', delay: 0.3 },
      { id: 'rope', name: 'Nylon Climbing Cord', emoji: '🪢', subtitle: 'High-Tensile Aligned Polyamide', x: '84%', y: '48%', delay: 0.4 },
      { id: 'wool', name: 'Fluffy Sheep Fleece', emoji: '🐑', subtitle: 'Natural Keratin Protein Fiber', x: '10%', y: '75%', delay: 0.5 },
      { id: 'kettle', name: 'Bakelite Pan Handle', emoji: '🫖', subtitle: 'Heat-Proof 3D Thermoset Plastic', x: '48%', y: '12%', delay: 0.6 },
      { id: 'wire', name: 'PVC Insulated Wire', emoji: '⚡', subtitle: 'Safe Electrical Shock Barrier', x: '82%', y: '78%', delay: 0.7 },
      { id: 'bottle', name: 'PET Plastic Bottle', emoji: '🧴', subtitle: '450-Year Petrochemical Persistence', x: '48%', y: '82%', delay: 0.8 },
    ],
    pipLessons: [
      {
        dialogue: "Look around your home or classroom right now! Almost every object you use is made from a different material!",
        pipMood: 'explaining',
        keyConceptTitle: '1. The Everyday World of Materials',
        keyConceptHighlight: 'Every object around us is selected based on what it is made from.',
      },
      {
        dialogue: "Natural materials like cotton, wood, silk, and wool come directly from living plants and animals in nature!",
        pipMood: 'curious',
        keyConceptTitle: '2. Living Natural Resources',
        keyConceptHighlight: 'Plant cellulose, sheep keratin, and silkworm fibroin grow naturally in the biological world.',
      },
      {
        dialogue: "Synthetic materials like nylon, polyester, and plastic never exist in raw nature — chemists synthesize them from petrochemical polymers!",
        pipMood: 'thinking',
        keyConceptTitle: '3. Human Chemical Inventions',
        keyConceptHighlight: 'Petroleum monomers are chemically linked into artificial polymer chains with superpowers like waterproofing.',
      },
      {
        dialogue: "Here is our Golden Law: What something is MADE FROM decides what it CAN DO, which decides what it is USED FOR!",
        pipMood: 'celebrating',
        keyConceptTitle: '4. The Golden Triangle of Science',
        keyConceptHighlight: '🧱 Material ➔ ⚡ Physical Property ➔ 🎯 Practical Real-World Use.',
      },
    ],
  },
  senses: {
    id: 'senses',
    title: 'Super Senses & Living Creatures',
    subtitle: 'Animal Senses, Pheromone Communication, Acoustic Hearing & Seed Travel',
    syllabusCode: 'CBSE Class 5 EVS • Theme 1',
    bgGradient: 'from-emerald-300 via-teal-100 to-amber-100',
    hubRoute: '/theme/1/hub',
    accentColor: 'bg-emerald-400 border-emerald-600 text-slate-950',
    btnShadow: 'shadow-[0_8px_0_#059669]',
    specimens: [
      { id: 'ant', name: 'Scout Ant Colony', emoji: '🐜', subtitle: 'Pheromone Chemical Trail Radar', x: '8%', y: '16%', delay: 0.1 },
      { id: 'eagle', name: 'Telescopic Eagle', emoji: '🦅', subtitle: '4x Retinal Zoom Binocular Vision', x: '82%', y: '14%', delay: 0.2 },
      { id: 'snake', name: 'Charming Cobra', emoji: '🐍', subtitle: 'Seismic Lower-Jawbone Ground Hearing', x: '12%', y: '50%', delay: 0.3 },
      { id: 'moth', name: 'Silkworm Moth', emoji: '🦋', subtitle: 'Feathery Airborne Scent Detector', x: '84%', y: '48%', delay: 0.4 },
      { id: 'tongue', name: 'Taste Papillae', emoji: '👅', subtitle: 'Salivary Amylase Carbohydrate Digestion', x: '10%', y: '75%', delay: 0.5 },
      { id: 'seed', name: 'Burdock Burr', emoji: '🌱', subtitle: 'Micro-Hooks That Inspired Velcro', x: '48%', y: '12%', delay: 0.6 },
      { id: 'dog', name: 'Tracking Hound', emoji: '🐕', subtitle: '300 Million Olfactory Receptors', x: '82%', y: '78%', delay: 0.7 },
      { id: 'dandelion', name: 'Dandelion Fluff', emoji: '🌬️', subtitle: 'Aerodynamic Wind Parachute Travel', x: '48%', y: '82%', delay: 0.8 },
    ],
    pipLessons: [
      {
        dialogue: "Animals and plants experience planet Earth with extraordinary superpowers that humans can barely imagine!",
        pipMood: 'explaining',
        keyConceptTitle: '1. Animal Superpower Senses',
        keyConceptHighlight: 'Wildlife senses evolved over millions of years to guarantee survival and predator detection.',
      },
      {
        dialogue: "Ants leave invisible scent highways called pheromones so their colony marches in straight lines without spoken words!",
        pipMood: 'curious',
        keyConceptTitle: '2. Chemical Communication Radar',
        keyConceptHighlight: 'Ant antennae chemoreceptors pick up microscopic pheromone markers left by scout ants.',
      },
      {
        dialogue: "Eagles spot mice from 2 km in the clouds with 4x zoom eyes, while snakes feel footsteps as soil vibrations through their jawbone!",
        pipMood: 'thinking',
        keyConceptTitle: '3. Telescopic Eyes & Jawbone Hearing',
        keyConceptHighlight: 'Snakes have no external ears; soil vibrations transmit directly into their inner ear bones.',
      },
      {
        dialogue: "Even plants invent clever travel tricks: burdock seeds have tiny elastic hooks that inspired the invention of Velcro!",
        pipMood: 'celebrating',
        keyConceptTitle: '4. Biomimicry: Copying Nature',
        keyConceptHighlight: 'George de Mestral copied burdock seed micro-hooks to create modern Velcro fasteners.',
      },
    ],
  },
  water: {
    id: 'water',
    title: 'Water & Aquatic Experiments',
    subtitle: 'Planetary Hydrology, Density & Buoyancy, Jaisalmer Stepwells & Ecology',
    syllabusCode: 'CBSE Class 5 EVS • Theme 2 & 4',
    bgGradient: 'from-sky-300 via-blue-100 to-teal-100',
    hubRoute: '/theme/water/hub',
    accentColor: 'bg-sky-400 border-sky-600 text-slate-950',
    btnShadow: 'shadow-[0_8px_0_#0284C7]',
    specimens: [
      { id: 'steam', name: 'Solar Evaporation', emoji: '☀️', subtitle: 'Liquid Water to Vapor Kinetic Energy', x: '8%', y: '16%', delay: 0.1 },
      { id: 'cloud', name: 'Cumulus Cloud', emoji: '☁️', subtitle: 'High-Altitude Cold Condensation', x: '82%', y: '14%', delay: 0.2 },
      { id: 'ship', name: 'Steel Cargo Ship', emoji: '🚢', subtitle: 'Displaced Volume & Trapped Air Pockets', x: '12%', y: '50%', delay: 0.3 },
      { id: 'deadsea', name: 'Dead Sea Minerals', emoji: '🧂', subtitle: '300 g/L High-Density Saline Buoyancy', x: '84%', y: '48%', delay: 0.4 },
      { id: 'stepwell', name: 'Jaisalmer Bawri', emoji: '🏰', subtitle: '650-Year-Old 9-Lake Rain Harvesting', x: '10%', y: '75%', delay: 0.5 },
      { id: 'mosquito', name: 'Mosquito Larva', emoji: '🦟', subtitle: 'Microscopic Snorkel Breathing Siphon', x: '48%', y: '12%', delay: 0.6 },
      { id: 'oil', name: 'Eco-Oil Barrier', emoji: '🛢️', subtitle: 'Surface Tension Film That Stops Larvae', x: '82%', y: '78%', delay: 0.7 },
      { id: 'drop', name: '4-Billion-Year Water', emoji: '💧', subtitle: 'Continuous Planetary Hydrological Cycle', x: '48%', y: '82%', delay: 0.8 },
    ],
    pipLessons: [
      {
        dialogue: "Water is Earth's greatest shape-shifter! The water falling in today's rain is the exact same water dinosaurs drank millions of years ago!",
        pipMood: 'explaining',
        keyConceptTitle: '1. Earth’s Endless Water Cycle',
        keyConceptHighlight: 'Solar thermal energy continuously evaporates, condenses, and precipitates Earth’s water.',
      },
      {
        dialogue: "Density is the secret of buoyancy! A tiny iron nail sinks, but a massive steel ship floats because its hollow hull traps huge pockets of air!",
        pipMood: 'curious',
        keyConceptTitle: '2. Density & Archimedes’ Buoyancy',
        keyConceptHighlight: 'An object floats when its overall average density is lower than the liquid it displaces.',
      },
      {
        dialogue: "In the Dead Sea, water contains 300 grams of salt per liter! The liquid is so dense that human bodies float effortlessly on the surface!",
        pipMood: 'thinking',
        keyConceptTitle: '3. Dead Sea Salt Density Law',
        keyConceptHighlight: 'Dissolving salt packs more mass into liquid volume, increasing upward buoyant lifting force.',
      },
      {
        dialogue: "650 years ago in Jaisalmer, King Ghadsi engineered 9 interconnected gravity lakes and subterranean stepwells to save every monsoon drop!",
        pipMood: 'celebrating',
        keyConceptTitle: '4. Ancient Hydraulic Engineering',
        keyConceptHighlight: 'Bawri stepwells keep harvested rainwater cool and shaded, preventing hot desert sun evaporation.',
      },
    ],
  },
  shelter: {
    id: 'shelter',
    title: 'Shelter, Mountains & Earth Expeditions',
    subtitle: 'Cold Deserts, Pashmina Thermal Physics, Mt. Everest & Bhunga Architecture',
    syllabusCode: 'CBSE Class 5 EVS • Theme 3 & 5',
    bgGradient: 'from-indigo-300 via-sky-100 to-rose-100',
    hubRoute: '/theme/shelter/hub',
    accentColor: 'bg-indigo-500 border-indigo-700 text-white',
    btnShadow: 'shadow-[0_8px_0_#4338CA]',
    specimens: [
      { id: 'ladakh', name: 'Cold Desert Ladakh', emoji: '🏔️', subtitle: '5,000m Altitude Sub-Zero Changthang', x: '8%', y: '16%', delay: 0.1 },
      { id: 'goat', name: 'Pashmina Mountain Goat', emoji: '🐐', subtitle: '12-Micron Ultra-Fine Insulating Underwool', x: '82%', y: '14%', delay: 0.2 },
      { id: 'rebo', name: 'Yak-Hair Rebo Tent', emoji: '⛺', subtitle: 'Nomadic Woven Alpine Blizzard Shelter', x: '12%', y: '50%', delay: 0.3 },
      { id: 'crampon', name: 'Steel Ice Crampon', emoji: '🧗', subtitle: 'Glacier Bite Traction on Mt. Everest', x: '84%', y: '48%', delay: 0.4 },
      { id: 'arch', name: 'Fateh Darwaza Arch', emoji: '🏰', subtitle: 'Parabolic Acoustic Sound Waveguide', x: '10%', y: '75%', delay: 0.5 },
      { id: 'rahat', name: 'Persian Water Wheel', emoji: '⚙️', subtitle: 'Interlocking 90° Gears Lifting Well Water', x: '48%', y: '12%', delay: 0.6 },
      { id: 'bhunga', name: 'Circular Kutch Bhunga', emoji: '🏚️', subtitle: 'Earthquake-Resistant Round Mud Walls', x: '82%', y: '78%', delay: 0.7 },
      { id: 'solar', name: 'Solar Eco-Village Grid', emoji: '☀️', subtitle: 'Decentralized Clean Renewable Power', x: '48%', y: '82%', delay: 0.8 },
    ],
    pipLessons: [
      {
        dialogue: "Where people live on Earth shapes everything: how they build shelters, dress for weather, and adapt to mountains and deserts!",
        pipMood: 'explaining',
        keyConceptTitle: '1. Geography & Human Adaptation',
        keyConceptHighlight: 'Terrain, climate, and altitude dictate human architecture and survival biology.',
      },
      {
        dialogue: "At 5,000 meters in freezing Ladakh, Changpa nomads live in yak-hair tents, while Pashmina goats grow wool 6 times finer than human hair!",
        pipMood: 'curious',
        keyConceptTitle: '2. 12-Micron Pashmina Thermal Physics',
        keyConceptHighlight: 'Ultra-fine fibers trap thousands of micro-air pockets that block heat loss even at -40°C.',
      },
      {
        dialogue: "Climbers like Bachendri Pal climbed Mt. Everest using steel crampons for ice grip and iron nutrition to carry thin mountain oxygen!",
        pipMood: 'thinking',
        keyConceptTitle: '3. High-Altitude Mountaineering',
        keyConceptHighlight: 'Atmospheric pressure drops with altitude; specialized gear and physiology make summiting possible.',
      },
      {
        dialogue: "And historic builders were genius scientists: Golconda Fort carried claps across 1 km, and circular mud Bhunga huts survived earthquakes!",
        pipMood: 'celebrating',
        keyConceptTitle: '4. Indigenous Engineering Physics',
        keyConceptHighlight: 'Parabolic arches focus soundwaves, and circular geometry distributes seismic shockwaves evenly.',
      },
    ],
  },
};

export const UniversalMascotChapterIntro: React.FC = () => {
  const { courseKey } = useParams<{ courseKey: string }>();
  const navigate = useNavigate();

  const key = courseKey && COURSE_INTROS[courseKey] ? courseKey : 'materials';
  const config = COURSE_INTROS[key];

  const [lessonIndex, setLessonIndex] = useState<number>(0);
  const activeLesson = config.pipLessons[lessonIndex] || config.pipLessons[0];

  useEffect(() => {
    voiceAssistant.speak(`${activeLesson.keyConceptTitle}. ${activeLesson.dialogue}`);
  }, [lessonIndex, key]);

  const handleNext = () => {
    sounds.pop();
    if (lessonIndex < config.pipLessons.length - 1) {
      setLessonIndex((prev) => prev + 1);
    } else {
      sounds.fanfare();
      voiceAssistant.stop();
      navigate(config.hubRoute);
    }
  };

  const handleSpecimenClick = (specimen: FloatingSpecimen) => {
    sounds.pop();
    voiceAssistant.speak(`${specimen.name}. ${specimen.subtitle}`);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${config.bgGradient} relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 font-sans select-none`}>
      {/* ── Top Header Bar ── */}
      <div className="w-full max-w-5xl flex items-center justify-between z-30 pt-2 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-slate-200 shadow-md">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/subjects');
          }}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-950 px-3.5 py-1 rounded-full shadow-xs">
            {config.syllabusCode} • Chapter Story Intro
          </span>
        </div>

        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate(config.hubRoute);
          }}
          className="text-xs font-black text-slate-700 bg-white/95 px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Skip to Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Floating Interactive Science Specimens ── */}
      <div className="absolute inset-0 pointer-events-none">
        {config.specimens.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, type: 'spring', damping: 15 }}
            className="absolute select-none"
            style={{ left: item.x, top: item.y }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 3.5 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (idx * 0.4) % 2,
              }}
              className="relative group pointer-events-auto cursor-pointer flex flex-col items-center"
              onClick={() => handleSpecimenClick(item)}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-md rounded-3xl border-3 border-white shadow-xl flex items-center justify-center text-3xl sm:text-4xl hover:scale-115 transition-transform duration-200">
                {item.emoji}
              </div>
              <span className="opacity-0 group-hover:opacity-100 absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-black bg-slate-950 text-white px-3 py-1 rounded-full shadow-xl pointer-events-none transition-opacity whitespace-nowrap z-40">
                {item.name}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ── Center Pip Storyteller Box ── */}
      <div className="z-30 max-w-2xl w-full flex flex-col items-center my-auto py-6">
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-900 bg-white/80 px-3.5 py-1 rounded-full border border-indigo-200 inline-block mb-2 shadow-2xs">
            {activeLesson.keyConceptTitle}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 drop-shadow-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {config.title}
          </h1>
        </div>

        {/* Mascot Speech Bubble Box */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 w-full justify-center">
          <Pip mood={activeLesson.pipMood} size="xl" />
          <PipSpeechBubble message={activeLesson.dialogue} isVisible={true} />
        </div>

        {/* Key Science Highlight Pill */}
        <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-indigo-200 text-xs sm:text-sm font-black text-indigo-950 flex items-center gap-2.5 shadow-md mb-6 max-w-lg text-center">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{activeLesson.keyConceptHighlight}</span>
        </div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          {lessonIndex < config.pipLessons.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-500 border-2 border-indigo-800 shadow-[0_6px_0_#3730A3] active:translate-y-1.5 active:shadow-none text-white font-black text-base sm:text-lg py-3.5 px-10 rounded-3xl transition-all cursor-pointer flex items-center gap-2"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <span>Continue Lesson ({lessonIndex + 1}/4)</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className={`${config.accentColor} border-3 ${config.btnShadow} active:translate-y-2 active:shadow-none font-black text-xl sm:text-2xl py-4 px-12 rounded-3xl transition-all cursor-pointer flex items-center gap-3 animate-bounce`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <span>🔬</span>
              <span>LET'S EXPLORE THE CHAPTER!</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </motion.button>
          )}

          {/* Stepping Dots */}
          <div className="flex gap-2.5 mt-1">
            {config.pipLessons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.pop();
                  setLessonIndex(idx);
                }}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === lessonIndex ? 'w-8 bg-indigo-600 border-2 border-indigo-800' : 'w-3 bg-white/80'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Audio Helper Banner */}
      <div className="z-30 text-center text-xs font-black text-slate-700 bg-white/85 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200 shadow-sm">
        💡 Pip reads the chapter foundation aloud! Tap any floating specimen on screen to hear its secret science property!
      </div>
    </div>
  );
};
