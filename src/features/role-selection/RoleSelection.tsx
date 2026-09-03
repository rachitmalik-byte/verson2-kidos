import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  Users,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Leaf,
  Droplets,
  Home,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import heroBannerImg from '@/assets/images/showcase/polyquest_hero_banner.jpg';

const TOPIC_CARDS = [
  {
    emoji: '🧪',
    label: 'Materials & Fibres',
    sub: 'Chapter 3',
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FED7AA]',
    text: 'text-[#9A3412]',
    iconBg: 'bg-[#FFEDD5]',
    icon: FlaskConical,
    delay: 0,
  },
  {
    emoji: '🐜',
    label: 'Super Senses',
    sub: 'Theme 1',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]',
    text: 'text-[#166534]',
    iconBg: 'bg-[#DCFCE7]',
    icon: Leaf,
    delay: 0.08,
  },
  {
    emoji: '💧',
    label: 'Water Magic',
    sub: 'Theme 2',
    bg: 'bg-[#F0F9FF]',
    border: 'border-[#BAE6FD]',
    text: 'text-[#075985]',
    iconBg: 'bg-[#E0F2FE]',
    icon: Droplets,
    delay: 0.16,
  },
  {
    emoji: '🏠',
    label: 'Shelter & Earth',
    sub: 'Theme 5',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
    text: 'text-[#5B21B6]',
    iconBg: 'bg-[#EDE9FE]',
    icon: Home,
    delay: 0.24,
  },
];

const STATS = [
  { icon: FlaskConical, label: 'Hands-on Experiments', value: '40+' },
  { icon: Sparkles, label: 'Mascot AI Coach', value: 'Sparky' },
  { icon: Award, label: 'Curriculum Missions', value: '13+' },
];

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const isSetUp = useParentStore((state) => state.isSetUp);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = heroBannerImg;
    img.onload = () => setHeroLoaded(true);
  }, []);

  const handleScientistClick = () => {
    sounds.fanfare();
    voiceAssistant.stop();
    if (!isSetUp) {
      const pStore = useParentStore.getState();
      pStore.setChild({
        name: 'Young Scientist',
        grade: '5',
        interests: ['science', 'space', 'water', 'animals', 'inventions'],
        avatar: '🔬',
      });
      pStore.setPin('1234');
      pStore.completeSetup();
    }
    navigate('/subjects');
  };

  const handleParentClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    if (!isSetUp) {
      navigate('/parent/setup');
    } else {
      navigate('/parent/pin');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#262930] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* ── Soft Pastel Ambient Orbs (Low Saturation, Non-Intrusive) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FEF3C7]/40 rounded-full blur-[90px]" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-[#E0F2FE]/45 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 left-1/4 w-[450px] h-80 bg-[#DCFCE7]/35 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#F3E8FF]/40 rounded-full blur-[90px]" />
      </div>

      {/* ── TOP NAVIGATION BAR ── */}
      <motion.header
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-[#262930] fill-[#262930]" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-[#262930] leading-none tracking-tight">
              KIDOS <span className="font-medium text-[#5A6072] text-sm">• Class 5 EVS</span>
            </h1>
            <span className="text-[10px] font-bold text-[#8A90A0] uppercase tracking-widest block mt-0.5">
              Curriculum Science Adventures
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { sounds.pop(); navigate('/teacher-studio'); }}
            className="pill-btn-ghost px-3.5 py-1.5 text-xs flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher Studio</span>
          </button>
          <button
            onClick={handleParentClick}
            className="pill-btn-secondary px-4 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#5A6072]" />
            <span>Parent Gate</span>
          </button>
        </div>
      </motion.header>

      {/* ── MAIN HERO SECTION ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-7 text-center">

          {/* ── Sparky Mascot & Warm Welcome Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-1">
              <SparkyMascot
                mood="welcoming"
                size={140}
                showSpeechBubble
                speechText="Hi! I'm Sparky 👋 Ready to explore?"
                animate
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEFCE8] border border-[#FEF08A] text-[11px] font-bold text-[#854D0E] mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
              <span>Interactive Science Lab for Curious Young Minds</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#262930] tracking-tight max-w-xl leading-tight">
              Learn Science Through Play & Discovery
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#5A6072] max-w-md mx-auto mt-2 leading-relaxed">
              Explore 40+ interactive experiments, animated microscopy, and guided quests crafted to make learning delightful.
            </p>
          </motion.div>

          {/* ── HERO BANNER CARD (Soft Squircle with Diffuse Shadow) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="w-full max-w-2xl squircle-card p-2 sm:p-2.5 overflow-hidden"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[21/9] bg-[#FAF8F5]">
              <img
                src={heroBannerImg}
                alt="PolyQuest Science Lab"
                className={`w-full h-full object-cover object-center transition-opacity duration-500 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#262930]/75 via-[#262930]/20 to-transparent" />

              {/* Progress Indicator Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs">
                    🔬
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/80 block uppercase tracking-wider">CBSE Class 5</span>
                    <span className="text-xs font-bold text-white">Environmental Studies</span>
                  </div>
                </div>

                {completedMissions.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                    <TrendingUp className="w-3.5 h-3.5 text-[#86EFAC]" />
                    <span>{completedMissions.length}/13 Completed</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── PRIMARY CTA: High-Contrast Dark Charcoal Pill Button ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="w-full max-w-sm flex flex-col items-center gap-2"
          >
            <button
              onClick={handleScientistClick}
              className="w-full pill-btn-primary py-4 px-8 text-base sm:text-lg flex items-center justify-center gap-3 shadow-soft-pill group"
            >
              <span>Start for Free</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-[11px] font-medium text-[#7E8494]">
              Free access • No credit card required • 100% kid-safe
            </span>
          </motion.div>

          {/* ── TOPIC PREVIEW CARDS (Soft Pastel Squircle Elements) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
          >
            {TOPIC_CARDS.map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScientistClick}
                className={`${card.bg} ${card.border} border p-3.5 rounded-2xl text-center cursor-pointer transition-all shadow-xs flex flex-col items-center justify-between min-h-[92px]`}
              >
                <div className="text-2xl mb-1">{card.emoji}</div>
                <div>
                  <span className={`text-xs font-extrabold ${card.text} block leading-tight`}>
                    {card.label}
                  </span>
                  <span className="text-[10px] font-semibold text-[#7E8494] block mt-0.5">
                    {card.sub}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── RESTFUL STATS BAR (Low Visual Noise) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center justify-center gap-6 sm:gap-10 pt-1"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-[#8A90A0]" />
                <div className="text-left">
                  <span className="text-xs font-extrabold text-[#262930] block leading-none">{stat.value}</span>
                  <span className="text-[10px] font-medium text-[#7E8494] block mt-0.5">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── QUIET FOOTER ── */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-[#7E8494] border-t border-slate-200/50">
        <span className="font-medium">
          Designed with love for young scientists & learners
        </span>
        <button
          onClick={() => navigate('/discovery-book')}
          className="font-semibold hover:text-[#262930] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Field Journal</span>
        </button>
      </footer>
    </div>
  );
};

