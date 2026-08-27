import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  Sparkles,
  FlaskConical,
  Zap,
  Leaf,
  Rocket,
  Calculator,
  Lock,
  ArrowRight,
  BookOpen,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';

interface Subject {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  active: boolean;
  chapterCount: number;
  unlockedChapters: number;
  path?: string;
}

const SUBJECTS: Subject[] = [
  {
    id: 'chemistry',
    name: 'Chemistry & Materials',
    subtitle: 'Synthetic Polymers, Fibres & Plastics Lab',
    icon: <FlaskConical className="w-10 h-10 text-amber-500" />,
    color: 'from-amber-400/20 via-orange-400/10 to-amber-500/20',
    border: 'border-amber-400 hover:border-amber-500',
    active: true,
    chapterCount: 5,
    unlockedChapters: 1,
    path: '/chapter-hub',
  },
  {
    id: 'physics',
    name: 'Physics & Electricity',
    subtitle: 'Circuits, Magnets, Light & Gravity',
    icon: <Zap className="w-10 h-10 text-sky-500" />,
    color: 'from-sky-400/10 to-blue-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 6,
    unlockedChapters: 0,
  },
  {
    id: 'biology',
    name: 'Biology & Living Organisms',
    subtitle: 'Plant Cells, Photosynthesis & Human Body',
    icon: <Leaf className="w-10 h-10 text-emerald-500" />,
    color: 'from-emerald-400/10 to-teal-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 4,
    unlockedChapters: 0,
  },
  {
    id: 'space',
    name: 'Space & Earth Science',
    subtitle: 'Solar System, Volcanoes & Atmosphere',
    icon: <Rocket className="w-10 h-10 text-indigo-500" />,
    color: 'from-indigo-400/10 to-purple-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 5,
    unlockedChapters: 0,
  },
  {
    id: 'math',
    name: 'Interactive Math Lab',
    subtitle: 'Geometry, Speed, Fractions & Logic',
    icon: <Calculator className="w-10 h-10 text-rose-500" />,
    color: 'from-rose-400/10 to-pink-500/20',
    border: 'border-slate-300',
    active: false,
    chapterCount: 6,
    unlockedChapters: 0,
  },
];

export const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleSubjectClick = (subject: Subject) => {
    sounds.pop();
    if (subject.active && subject.path) {
      voiceAssistant.stop();
      navigate(subject.path);
    } else {
      sounds.boing();
      voiceAssistant.speak(`${subject.name} is coming soon in the next science curriculum update!`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-50 to-amber-100 flex flex-col justify-between pt-6 pb-16 px-4 md:px-8 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 rounded-2xl shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 leading-none">POLYQUEST</h1>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Science Academy • Grades 5–6
              </span>
            </div>
          </div>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* Mascot Banner */}
        <div id="subject-intro-banner" className="bg-white/95 rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <Pip mood="celebrating" size="lg" />
          <div className="flex-1 text-center md:text-left">
            <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-2">
              Select Your Science Subject
            </span>
            <h2
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Welcome to the PolyQuest Science Academy! 🔬
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-bold mt-1.5 leading-relaxed">
              Pick a science discipline below to dive into interactive storybooks, video labs, and hands-on experiments!
            </p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div id="subject-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECTS.map((sub) => (
            <motion.div
              key={sub.id}
              id={sub.id === 'chemistry' ? 'subject-chem-card' : undefined}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSubjectClick(sub)}
              className={`p-6 rounded-3xl border-4 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden bg-white ${
                sub.active
                  ? `${sub.border} shadow-xl hover:shadow-2xl ring-4 ring-amber-300/50`
                  : 'border-slate-200 opacity-75 hover:opacity-90 shadow-sm'
              }`}
            >
              {/* Active / Locked Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                  {sub.icon}
                </div>
                {sub.active ? (
                  <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Active Course</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 border border-slate-300 text-slate-500 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Coming Soon</span>
                  </span>
                )}
              </div>

              {/* Subject Title & Description */}
              <div className="space-y-1.5 mb-6">
                <h3
                  className="text-xl md:text-2xl font-black text-slate-900"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {sub.name}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-snug">
                  {sub.subtitle}
                </p>
              </div>

              {/* Bottom Course Progress / CTA */}
              <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                {sub.active ? (
                  <>
                    <div className="flex items-center gap-2 text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{completedMissions.length} / 13 Missions Complete</span>
                    </div>
                    <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md">
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </>
                ) : (
                  <span className="text-xs font-black text-slate-400">
                    {sub.chapterCount} Chapters in Development
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
