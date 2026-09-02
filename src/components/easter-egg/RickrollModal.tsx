import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { X, Sparkles, Music, Loader2, Volume2 } from 'lucide-react';
import { Pip } from '@/components/pip/Pip';

interface RickrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RickrollModal: React.FC<RickrollModalProps> = ({ isOpen, onClose }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl select-none">
        {/* Animated Disco Spotlights & Floating Music Notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0.6, 1.4, 0.6],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 180, 360],
                y: [0, -30, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.8 + (i % 4) * 0.5, ease: 'easeInOut' }}
              className="absolute text-2xl"
              style={{
                top: `${(i * 17) % 92}%`,
                left: `${(i * 21) % 92}%`,
              }}
            >
              {['✨', '🕺', '💃', '🎵', '🎶', '⭐', '🎸', '🎉'][i % 8]}
            </motion.div>
          ))}
        </div>

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 rounded-[32px] sm:rounded-[40px] border-4 border-amber-400 p-4 sm:p-6 shadow-[0_0_60px_rgba(251,191,36,0.65)] flex flex-col items-center text-center text-white z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all border border-white/30 z-30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Secret Easter Egg Header Badge */}
          <div className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full font-black text-[11px] uppercase tracking-wider shadow-md mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>🎉 SECRET 7-CLICK MASCOT EASTER EGG FOUND! 🎉</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-amber-300 drop-shadow-md tracking-tight">
            🕺 YOU JUST GOT RICKROLLED! 🎶
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-300 max-w-md mt-0.5 mb-3">
            You clicked Pip 7 times! Dropping straight into the legendary chorus at <span className="text-amber-300 font-black">0:43</span>:
          </p>

          {/* 📺 Instant Video Stage with Zero Blank Wait Screen */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden border-3 border-amber-400 shadow-2xl bg-slate-900 relative">
            {/* Instant Energetic Disco Placeholder while Video Buffers */}
            {!isVideoLoaded && (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-4 z-10">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                  className="text-5xl mb-2"
                >
                  🕺
                </motion.div>
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Loading Chorus Drop (0:43)... 🎵</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[0.3, 0.9, 0.5, 1.0, 0.7, 0.4].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['6px', `${h * 24}px`, '6px'] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                      className="w-1.5 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fast YouTube Nocookie IFrame */}
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&start=43&rel=0&modestbranding=1&playsinline=1"
              title="Rick Astley - Never Gonna Give You Up"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsVideoLoaded(true)}
              className="w-full h-full"
            />
          </div>

          {/* Bottom Dancing Pip & Reward Action */}
          <div className="flex items-center justify-between w-full mt-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2.5">
              <Pip mood="celebrating" size="xs" />
              <div className="text-left">
                <span className="text-xs font-black text-amber-300 block">Pip is grooving! 💃</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300">
                  "Never gonna give you up, never gonna let you down!"
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.fanfare();
                onClose();
              }}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1 border border-amber-500 shrink-0"
            >
              <span>Back to Science! 🔬</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
