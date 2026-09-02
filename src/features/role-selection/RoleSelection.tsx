import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Play, Shield, Users, Compass, GraduationCap, UserCheck, ArrowRight, BookOpen } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const isSetUp = useParentStore((state) => state.isSetUp);
  const child = useParentStore((state) => state.child);
  const [showParentGuard, setShowParentGuard] = useState(false);

  const handleScientistClick = () => {
    sounds.fanfare();
    voiceAssistant.stop();
    if (!isSetUp) {
      // If not setup, let them start directly as Aarav for instant fun, or open setup
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
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-blue-50 to-amber-50 flex flex-col items-center justify-between p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* ── Soft Floating Decorative Bubbles ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🧪</div>
        <div className="absolute top-16 right-12 text-4xl animate-bounce" style={{ animationDuration: '5s' }}>🚀</div>
        <div className="absolute bottom-16 left-16 text-4xl animate-bounce" style={{ animationDuration: '4.5s' }}>💧</div>
        <div className="absolute bottom-20 right-16 text-4xl animate-bounce" style={{ animationDuration: '6s' }}>🌍</div>
      </div>

      {/* ── Top Header Brand ── */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20">
        <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-xs">
          <span className="text-sm">🌟</span>
          <span className="text-xs font-black text-slate-800">Class 5 Science Games</span>
        </div>

        {/* Parent & Teacher Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/teacher-studio');
            }}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-xs cursor-pointer flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Teacher</span>
          </button>

          <button
            onClick={handleParentClick}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-xs cursor-pointer flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Parents</span>
          </button>
        </div>
      </header>

      {/* ── Center Stage: Friendly Companion & Ultra-Clear Hero Call-to-Action ── */}
      <main className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-[36px] border-4 border-sky-400 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center z-20 my-auto gap-4">
        {/* Compact, Friendly Pip (Size 72px so it doesn't crowd screen) */}
        <div className="flex items-center gap-3 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 shadow-xs">
          <Pip mood="celebrating" size={64} />
          <div className="text-left">
            <span className="text-[11px] font-black text-sky-700 uppercase tracking-wider block">Hi, I'm Pip! 👋</span>
            <span className="text-xs font-bold text-slate-700">Ready to play and discover science secrets?</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            POLY<span className="text-sky-600">QUEST</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
            Fun 3D Games & Hands-on Science Experiments
          </p>
        </div>

        {/* 🌟 GIANT PRIMARY ACTION: START SCIENCE ADVENTURE (UNMISTAKABLE CLICK TARGET) */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleScientistClick}
          className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-lg sm:text-xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3 border-3 border-emerald-300 ring-4 ring-emerald-100"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>👉 START SCIENCE ADVENTURE ➔</span>
        </motion.button>

        {/* What You Will Explore Badge List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-2">
          <div className="p-2 bg-sky-50 rounded-xl border border-sky-200 text-center">
            <span className="text-lg block">💧</span>
            <span className="text-[11px] font-black text-sky-950">Water Magic</span>
          </div>
          <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <span className="text-lg block">🐜</span>
            <span className="text-[11px] font-black text-purple-950">Super Senses</span>
          </div>
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-lg block">🚀</span>
            <span className="text-[11px] font-black text-amber-950">Space Orbit</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-lg block">🛖</span>
            <span className="text-[11px] font-black text-emerald-950">Cool Houses</span>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full max-w-4xl flex items-center justify-between text-xs font-bold text-slate-500 z-20 pt-2">
        <span>Made for Grade 5 Science Explorers</span>
        <button
          onClick={() => navigate('/discovery-book')}
          className="hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Science Field Journal</span>
        </button>
      </footer>
    </div>
  );
};
