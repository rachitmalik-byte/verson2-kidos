import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { X, Sparkles, Music, Flame } from 'lucide-react';
import { Pip } from '@/components/pip/Pip';

interface RickrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RickrollModal: React.FC<RickrollModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg select-none">
        {/* Animated Disco Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.2, 0.9, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{ repeat: Infinity, duration: 2 + (i % 3), ease: 'easeInOut' }}
              className="absolute text-xl"
              style={{
                top: `${(i * 19) % 90}%`,
                left: `${(i * 23) % 90}%`,
              }}
            >
              {['✨', '🕺', '💃', '🎵', '🎶', '⭐', '🎸'][i % 7]}
            </motion.div>
          ))}
        </div>

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 rounded-[36px] border-4 border-amber-400 p-5 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.6)] flex flex-col items-center text-center text-white z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all border border-white/30 z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Fun Banner */}
          <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-md mb-2">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>🎉 SECRET 7-CLICK MASCOT EASTER EGG FOUND! 🎉</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md tracking-tight">
            🕺 YOU JUST GOT RICKROLLED! 🎶
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-300 max-w-md mt-1 mb-4">
            You tapped Pip 7 times in a row! Enjoy the legendary groove of Rick Astley:
          </p>

          {/* 📺 Embedded YouTube Video at the EXACT 0:43 Chorus Timestamp */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden border-3 border-amber-400 shadow-2xl bg-black relative">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&start=43"
              title="Rick Astley - Never Gonna Give You Up"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Bottom Dancing Pip & Reward Badge */}
          <div className="flex items-center justify-between w-full mt-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2">
              <Pip mood="celebrating" size={48} />
              <div className="text-left">
                <span className="text-xs font-black text-amber-300 block">Pip is grooving! 💃</span>
                <span className="text-[11px] font-bold text-slate-300">Never gonna give you up, never gonna let you down!</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.fanfare();
                onClose();
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1 border border-amber-500"
            >
              <span>Back to Science! 🔬</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
