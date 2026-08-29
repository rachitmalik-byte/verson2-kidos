import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Clock,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Tv,
  ArrowRight,
  RotateCcw,
  Zap,
  ExternalLink,
  Search,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

// Real Studio Macro Educational Photography
import rawCottonBollImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import nylonThreadSpoolImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import polyesterFabricRollImg from '@/assets/images/specimens/polyester_fabric_roll.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyesterMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import plasticDecay100YrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import copperWireImg from '@/assets/images/wire/copper_wire_macro.jpg';
import bakeliteHandleImg from '@/assets/images/experiments/bakelite_handle_safe.jpg';

export interface VideoTimestamp {
  time: number; // Seconds
  timeLabel: string;
  title: string;
  summary: string;
  narration: string;
  keyLaw: string;
  image: string;
  imageCaption: string;
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
  duration: string;
  category: string;
  color: string;
  description: string;
  timestamps: VideoTimestamp[];
}

export const VIDEO_COURSES: VideoCourse[] = [
  {
    id: 'course-1',
    title: 'The World of Natural & Synthetic Materials',
    subtitle: 'CBSE Class 5 EVS • Complete Visual Science Guide',
    youtubeId: 'iG9A8F-OF_Y',
    duration: '11:45',
    category: 'CBSE Class 5 EVS • Chapter 3',
    color: 'from-sky-500 to-indigo-600',
    description:
      'Watch how everyday matter is transformed! Discover why nature produces breathable cotton and sheep wool, while chemical laboratories synthesize waterproof polyester and indestructible nylon.',
    timestamps: [
      {
        time: 0,
        timeLabel: '00:00',
        title: 'Introduction: What is a Material?',
        summary:
          'Everything around us is made from matter with unique properties. Scientists classify materials into two main families: Natural (grown by nature) and Synthetic (synthesized by chemists).',
        narration:
          'Look around your room! Everything from your clothes to your chair is engineered from specific materials. Nature gives us wood, cotton, and wool, while laboratories give us synthetic polymers.',
        keyLaw: '🧱 MATERIAL dictates ⚡ PROPERTY, which dictates 🎯 USE!',
        image: rawCottonBollImg,
        imageCaption: 'Natural Cotton Boll grown in agricultural fields',
        quickQuestion: {
          question: 'Where do Natural materials come from?',
          options: [
            { text: 'Directly from plants, animals, or Earth', isCorrect: true },
            { text: 'Synthesized from petroleum chemicals in labs', isCorrect: false },
          ],
          explanation: 'Natural materials like cotton, wood, and wool come directly from living plants and animals!',
        },
      },
      {
        time: 75,
        timeLabel: '01:15',
        title: 'Natural Fibres: Cotton, Wool & Silk',
        summary:
          'Natural fibres have microscopic spaces between their cellulose chains. This makes cotton breathable and super absorbent (up to 27x its weight in moisture), keeping our bodies cool in hot summer heat.',
        narration:
          'Cotton plants produce fluffy white bolls containing cellulose fibers. These natural fibers absorb water and sweat, making cotton ideal for hot summer weather.',
        keyLaw: 'Plant cellulose fibres have open micro-pores that absorb water and breathe.',
        image: silkwormCocoonImg,
        imageCaption: 'Silkworm Silk Cocoon — continuous natural protein filament',
        quickQuestion: {
          question: 'Why is 100% cotton the best fabric for summer clothes?',
          options: [
            { text: 'It absorbs sweat and allows air circulation', isCorrect: true },
            { text: 'It is waterproof and traps all heat inside', isCorrect: false },
          ],
          explanation: 'Cotton fibers have tiny natural pores that absorb sweat and let air circulate freely!',
        },
      },
      {
        time: 180,
        timeLabel: '03:00',
        title: 'The Invention of Synthetic Polymers & Nylon (1935)',
        summary:
          'In 1935, chemists discovered that by linking petroleum chemicals together into long polymer chains, they could create Nylon—a miracle fibre with higher tensile strength than equal-thickness steel!',
        narration:
          'Synthetic fibers are manufactured by chemically linking small molecules called monomers into long polymer chains under high heat and pressure.',
        keyLaw: 'Synthetic polymers are artificial molecular chains engineered for extreme tensile strength.',
        image: nylonThreadSpoolImg,
        imageCaption: 'Nylon filament spool — high tensile strength polymer thread',
        quickQuestion: {
          question: 'What raw material is primarily used to create synthetic polymers?',
          options: [
            { text: 'Petrochemicals derived from crude petroleum', isCorrect: true },
            { text: 'Tree bark and crushed leaves', isCorrect: false },
          ],
          explanation: 'Synthetic polymers like nylon and polyester are synthesized from petrochemicals!',
        },
      },
      {
        time: 320,
        timeLabel: '05:20',
        title: 'Waterproof Raincoats & Parachutes',
        summary:
          'Synthetic polyester is naturally hydrophobic (water-repelling). Water cannot penetrate its tightly woven polymer fibres, so rain forms droplets and rolls off, keeping you completely dry.',
        narration:
          'Unlike cotton, synthetic polyester fibers have zero natural pores. Water droplets bead up on the surface and roll off effortlessly without getting absorbed.',
        keyLaw: 'Hydrophobic synthetic weaves bead water instead of soaking it up.',
        image: polyesterRaincoatImg,
        imageCaption: 'Macro photo of water droplets beading on polyester raincoat',
        quickQuestion: {
          question: 'What happens to water on a polyester raincoat?',
          options: [
            { text: 'It forms round beads and rolls off', isCorrect: true },
            { text: 'It soaks in and makes the coat heavy', isCorrect: false },
          ],
          explanation: 'Polyester is hydrophobic, so water beads up on the surface without soaking into the fibers!',
        },
      },
      {
        time: 460,
        timeLabel: '07:40',
        title: 'Critical Fire Safety: Ash vs. Melting Beads',
        summary:
          'CRITICAL SAFETY RULE: Natural cotton burns to powdery crumbly gray ash that falls harmlessly away. Synthetic fabrics MELT into boiling sticky plastic beads that stick to human skin. Always wear cotton in kitchens and near flames!',
        narration:
          'Always remember this fire safety rule! When natural cotton touches a flame, it burns into soft crumbly ash. But synthetic fabrics like polyester melt into hot sticky plastic beads!',
        keyLaw: 'NEVER wear synthetic clothes near open flames, stoves, or firecrackers!',
        image: cottonBurningAshImg,
        imageCaption: 'Cotton burning cleanly to gray ash vs molten synthetic bead',
        quickQuestion: {
          question: 'What fabric MUST you wear in the kitchen or during Diwali firecrackers?',
          options: [
            { text: '100% Pure Natural Cotton (burns to ash)', isCorrect: true },
            { text: 'Synthetic Polyester / Nylon (melts onto skin)', isCorrect: false },
          ],
          explanation: 'Always wear 100% cotton near fire because it turns to harmless ash instead of melting into skin!',
        },
      },
      {
        time: 580,
        timeLabel: '09:40',
        title: 'Plastics & Planet Earth: The 500-Year Challenge',
        summary:
          'Natural wood and cotton decompose in soil within weeks because microbes can digest them. Synthetic plastic polymer chains take over 450 years to break down. We must Reduce, Reuse, and Recycle to protect nature.',
        narration:
          'Because synthetic polymers do not rot naturally, discarded plastic items stay in our environment for centuries. We must actively recycle and minimize plastic waste.',
        keyLaw: 'Practice the 3 R’s: Reduce plastic use, Reuse containers, Recycle polymers!',
        image: plasticDecay100YrsImg,
        imageCaption: 'Plastic bottle remaining intact after decades in forest soil',
        quickQuestion: {
          question: 'Why does plastic trash take 450+ years to decay in soil?',
          options: [
            { text: 'Soil microbes cannot break down synthetic polymer chains', isCorrect: true },
            { text: 'Plastic dissolves completely in rainwater after 2 days', isCorrect: false },
          ],
          explanation: 'Soil bacteria lack the enzymes needed to digest man-made synthetic polymer chains!',
        },
      },
    ],
  },
  {
    id: 'course-2',
    title: 'How Electricity & Heat Travel: Conductors vs Insulators',
    subtitle: 'From Copper Wires to Thermosetting Bakelite Kettle Handles',
    youtubeId: 'IBdIzj0elzI',
    duration: '08:30',
    category: 'Physics & Electrical Lab',
    color: 'from-amber-500 to-rose-600',
    description:
      'Learn why electrical wires have copper inside and PVC plastic outside, and why boiling tea kettles use thermosetting Bakelite handles to keep our hands 100% safe from electric shocks and thermal burns.',
    timestamps: [
      {
        time: 0,
        timeLabel: '00:00',
        title: 'Electrical Circuits & Conductors',
        summary:
          'Metals like copper and steel have free electrons that allow electric current to flow smoothly through them, lighting up bulbs and powering appliances.',
        narration:
          'Copper is one of the greatest conductors on Earth. Its free electrons move freely to carry electricity across electrical circuits.',
        keyLaw: 'Conductors allow electrons and electric current to flow freely.',
        image: copperWireImg,
        imageCaption: 'Macro cross-section of central copper electrical wire',
        quickQuestion: {
          question: 'Why is copper used inside electric cables?',
          options: [
            { text: 'It conducts electricity with very low resistance', isCorrect: true },
            { text: 'It blocks electricity completely', isCorrect: false },
          ],
          explanation: 'Copper is an excellent electrical conductor that allows electricity to travel efficiently!',
        },
      },
      {
        time: 120,
        timeLabel: '02:00',
        title: 'PVC Plastic Insulating Sleeves',
        summary:
          'Plastic (PVC) does not have free electrons. It is an electrical insulator that completely blocks electric current, allowing us to safely hold live wires without getting shocked.',
        narration:
          'To protect our hands from dangerous 240-volt electrical currents, copper wires are coated in flexible PVC plastic insulation.',
        keyLaw: 'Electrical insulators block current and protect humans from shocks.',
        image: copperWireImg,
        imageCaption: 'PVC protective outer sleeve covering central wire',
        quickQuestion: {
          question: 'What role does PVC plastic play on an electrical cable?',
          options: [
            { text: 'It insulates the wire to prevent electrical shocks', isCorrect: true },
            { text: 'It generates extra electricity', isCorrect: false },
          ],
          explanation: 'PVC plastic is an insulator that traps electricity inside the wire, preventing shocks!',
        },
      },
      {
        time: 260,
        timeLabel: '04:20',
        title: 'Thermal Insulation: Bakelite Kettle Handles',
        summary:
          'Thermosetting Bakelite plastic is densely cross-linked. It does not conduct heat or melt at 100°C, so boiling kettle handles remain cool and safe to hold.',
        narration:
          'When water boils at 100 degrees Celsius, metal handles become scorching hot. Thermosetting Bakelite handles block heat transfer completely!',
        keyLaw: 'Thermosetting polymers trap heat vibrations and never soften when heated.',
        image: bakeliteHandleImg,
        imageCaption: 'Hand safely holding Bakelite handle on 100°C steaming kettle',
        quickQuestion: {
          question: 'Why does a Bakelite handle stay at 26°C on a boiling kettle?',
          options: [
            { text: 'Bakelite is a thermosetting polymer heat insulator', isCorrect: true },
            { text: 'Metal absorbs all the coolness from the room', isCorrect: false },
          ],
          explanation: 'Bakelite polymer chains are cross-linked, blocking heat conduction into the handle!',
        },
      },
    ],
  },
];

export const InteractiveChapterVideoLab: React.FC = () => {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(0);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showXpReward, setShowXpReward] = useState(false);

  const course = VIDEO_COURSES[selectedCourseIndex];
  const activeTimestamp = course.timestamps[activeTimestampIndex] || course.timestamps[0];

  // Stop speech when switching courses or timestamps
  useEffect(() => {
    voiceAssistant.stop();
    setIsPlayingNarration(false);
  }, [selectedCourseIndex, activeTimestampIndex]);

  const handleSelectTimestamp = (index: number) => {
    sounds.pop();
    voiceAssistant.stop();
    setActiveTimestampIndex(index);
  };

  const handlePlayNarration = () => {
    if (isPlayingNarration) {
      voiceAssistant.stop();
      setIsPlayingNarration(false);
    } else {
      sounds.sparkle();
      setIsPlayingNarration(true);
      voiceAssistant.speak(activeTimestamp.narration, () => {
        setIsPlayingNarration(false);
      });
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.fanfare();
      setQuizAnswers((prev) => ({ ...prev, [activeTimestampIndex]: true }));
      setShowXpReward(true);
      setTimeout(() => setShowXpReward(false), 2000);
      voiceAssistant.speak(`Brilliant! ${activeTimestamp.quickQuestion.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Not quite! Try thinking about the material properties again.');
    }
  };

  return (
    <div className="w-full bg-white/95 rounded-3xl md:rounded-[36px] p-5 sm:p-7 border-4 border-sky-400 shadow-2xl flex flex-col gap-6 text-slate-900">
      {/* ── Course Header & Video Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-md">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-sky-300">
                {course.category}
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {course.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {course.title}
            </h2>
          </div>
        </div>

        {/* Video Course Switcher Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {VIDEO_COURSES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                sounds.pop();
                setSelectedCourseIndex(idx);
                setActiveTimestampIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                idx === selectedCourseIndex
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Lesson {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Video Player & Interactive Timeline Strip ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Video Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 bg-slate-950 relative">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${course.youtubeId}?start=${activeTimestamp.time}&autoplay=0&rel=0&modestbranding=1`}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Interactive Timeline Timestamp Scrubber Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Jump to Synced Chapter Topics:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {course.timestamps.map((ts, idx) => {
                const isActive = idx === activeTimestampIndex;
                const isAnswered = quizAnswers[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectTimestamp(idx)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-2 ${
                      isActive
                        ? 'bg-amber-400 border-amber-600 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">{ts.timeLabel}</span>
                    <span className="truncate max-w-[140px] sm:max-w-none">{ts.title}</span>
                    {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Synced Explanation Console (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white rounded-3xl p-5 border-3 border-sky-300 shadow-md relative overflow-hidden flex flex-col justify-between">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                ⏱️ Synced Topic: {activeTimestamp.timeLabel}
              </span>

              <button
                onClick={handlePlayNarration}
                className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isPlayingNarration
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingNarration ? 'Stop Voice' : 'Read Aloud 🔊'}</span>
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {activeTimestamp.title}
            </h3>

            <p className="text-xs font-bold text-slate-700 leading-relaxed mb-3">
              {activeTimestamp.summary}
            </p>

            {/* Real Macro Specimen Photography Card */}
            <div className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border-2 border-sky-200 shadow-xs mb-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={activeTimestamp.image}
                  alt={activeTimestamp.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-sky-600 block">
                  MACRO SPECIMEN EVIDENCE
                </span>
                <span className="text-xs font-extrabold text-slate-800 leading-tight block mt-0.5">
                  {activeTimestamp.imageCaption}
                </span>
              </div>
            </div>

            {/* Key Science Law Callout */}
            <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-2xl text-xs font-black text-amber-950 shadow-xs">
              <span className="text-[9px] uppercase tracking-wider text-amber-800 font-black block mb-0.5">
                ✨ Core Science Law
              </span>
              <span>{activeTimestamp.keyLaw}</span>
            </div>
          </div>

          {/* Mini Comprehension Check for Current Timestamp */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md relative">
            <AnimatePresence>
              {showXpReward && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1.2, y: -20 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-3.5 py-1 rounded-full font-black text-xs shadow-lg flex items-center gap-1 z-20"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  <span>+15 XP Earned! ⭐</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Quick Understanding Check:
              </h4>
            </div>

            <p className="text-xs font-bold text-slate-700 mb-3">
              {activeTimestamp.quickQuestion.question}
            </p>

            <div className="flex flex-col gap-2">
              {activeTimestamp.quickQuestion.options.map((opt, oIdx) => {
                const isSolved = quizAnswers[activeTimestampIndex];
                return (
                  <button
                    key={oIdx}
                    disabled={isSolved}
                    onClick={() => handleQuizAnswer(opt.isCorrect)}
                    className={`p-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between ${
                      isSolved && opt.isCorrect
                        ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950 shadow-xs'
                        : isSolved && !opt.isCorrect
                        ? 'bg-slate-50 border border-slate-200 text-slate-400 opacity-60'
                        : 'bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-800 cursor-pointer active:scale-98'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSolved && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
