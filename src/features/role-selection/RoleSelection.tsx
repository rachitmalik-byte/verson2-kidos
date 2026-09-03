import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  Play,
  Users,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Leaf,
  Droplets,
  Home,
  Rocket,
  ChevronRight,
  Star,
  Zap,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import heroBannerImg from '@/assets/images/showcase/polyquest_hero_banner.jpg';

const TOPIC_CARDS = [
  { emoji: '🧪', label: 'Materials & Fibres', color: 'from-amber-400 to-orange-500', icon: FlaskConical, delay: 0 },
  { emoji: '🐜', label: 'Super Senses', color: 'from-emerald-400 to-teal-500', icon: Leaf, delay: 0.1 },
  { emoji: '💧', label: 'Water Magic', color: 'from-sky-400 to-blue-500', icon: Droplets, delay: 0.2 },
  { emoji: '🏠', label: 'Shelter & Earth', color: 'from-indigo-400 to-violet-500', icon: Home, delay: 0.3 },
];

const STATS = [
  { icon: FlaskConical, label: 'Interactive Experiments', value: '40+' },
  { icon: Zap, label: 'AI-Powered Learning', value: 'Live' },
  { icon: Trophy, label: 'Missions & Quests', value: '13+' },
];

const FLOATING_PARTICLES = [
  { emoji: '⚗️', x: '8%', y: '15%', duration: 5.2, size: 'text-3xl' },
  { emoji: '🔬', x: '88%', y: '12%', duration: 4.8, size: 'text-2xl' },
  { emoji: '🧬', x: '15%', y: '78%', duration: 6.1, size: 'text-2xl' },
  { emoji: '⚡', x: '92%', y: '72%', duration: 5.5, size: 'text-3xl' },
  { emoji: '🌡️', x: '5%', y: '45%', duration: 4.3, size: 'text-xl' },
  { emoji: '🧲', x: '95%', y: '40%', duration: 5.8, size: 'text-xl' },
  { emoji: '💎', x: '20%', y: '92%', duration: 6.5, size: 'text-xl' },
  { emoji: '🔭', x: '80%', y: '88%', duration: 4.6, size: 'text-2xl' },
  { emoji: '🪐', x: '50%', y: '8%', duration: 7.0, size: 'text-3xl' },
  { emoji: '🌊', x: '70%', y: '55%', duration: 5.0, size: 'text-xl' },
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
    <div className="min-h-screen w-full bg-slate-950 flex flex-col relative overflow-hidden select-none font-sans">
      {/* ── ANIMATED SCIENCE PARTICLES LAYER ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {FLOATING_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.15, 0.4, 0.15],
              y: [0, -18, 0],
              x: [0, (i % 2 === 0 ? 6 : -6), 0],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            className={`absolute ${p.size}`}
            style={{ left: p.x, top: p.y }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* ── GRADIENT GLOW ORBS (Ambient) ── */}
      <div className="absolute inset-0 pointer-events-none z-[0] overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      {/* ── TOP NAVIGATION BAR ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30">
            <Sparkles className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-white leading-none tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              POLY<span className="text-sky-400">QUEST</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Class 5 EVS Science
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { sounds.pop(); navigate('/teacher-studio'); }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white/80 hover:text-white font-bold text-xs border border-white/10 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher</span>
          </button>
          <button
            onClick={handleParentClick}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white/80 hover:text-white font-bold text-xs border border-white/10 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parents</span>
          </button>
        </div>
      </motion.header>

      {/* ── MAIN HERO SECTION ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8">
        <div className="w-full max-w-5xl flex flex-col items-center gap-6 md:gap-8">

          {/* ── HERO BANNER IMAGE WITH PIP ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl"
          >
            {/* Glow ring behind the banner */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 rounded-[32px] blur-sm opacity-60" />
            
            <div className="relative rounded-[28px] overflow-hidden border-2 border-white/20 shadow-2xl shadow-violet-500/20">
              <img
                src={heroBannerImg}
                alt="PolyQuest – Pip's Science Lab"
                className={`w-full h-48 sm:h-56 md:h-72 object-cover object-center transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Pip on the banner */}
              <div className="absolute bottom-3 left-4 sm:left-6">
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <Pip mood="celebrating" size={48} interactive={false} />
                  <div>
                    <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                      Hi, I'm Pip! 👋
                    </span>
                    <span className="text-xs font-bold text-white/80">
                      Your AI Science Buddy
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats on the banner */}
              <div className="absolute bottom-3 right-4 sm:right-6 hidden sm:flex items-center gap-2">
                {completedMissions.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/30">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-black text-emerald-300">
                      {completedMissions.length}/13 Done
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── TITLE + SUBTITLE ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <span className="text-white">POLY</span>
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                QUEST
              </span>
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-400 max-w-md mx-auto leading-relaxed">
              Interactive 3D Science Adventures & Hands-on Experiments for Class 5 EVS
            </p>
          </motion.div>

          {/* ── PRIMARY CTA BUTTON ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="w-full max-w-md"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleScientistClick}
              className="w-full group relative py-5 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 text-white font-black text-lg sm:text-xl shadow-[0_12px_40px_rgba(16,185,129,0.35)] cursor-pointer transition-all flex items-center justify-center gap-3 border border-emerald-300/30 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Play className="w-6 h-6 fill-white relative z-10" />
              <span className="relative z-10">Start Science Adventure</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* ── TOPIC PREVIEW CARDS (Horizontal Grid) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl"
          >
            {TOPIC_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + card.delay, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="group p-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 hover:border-white/25 text-center cursor-pointer transition-all hover:bg-white/[0.12]"
                onClick={handleScientistClick}
              >
                <span className="text-2xl block mb-1.5">{card.emoji}</span>
                <span className="text-[11px] font-black text-white/80 group-hover:text-white block leading-tight">
                  {card.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── MINI STATS BAR ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-4 sm:gap-8 pt-2"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-center">
                <stat.icon className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="text-xs font-black text-white/90 block">{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-500 block">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-5 flex items-center justify-between"
      >
        <span className="text-xs font-bold text-slate-600">
          Made for Grade 5 Science Explorers
        </span>
        <button
          onClick={() => navigate('/discovery-book')}
          className="text-xs font-bold text-slate-500 hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Science Field Journal</span>
        </button>
      </motion.footer>
    </div>
  );
};
