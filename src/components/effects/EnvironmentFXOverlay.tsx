import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFXStore } from '@/stores/fxStore';

export const EnvironmentFXOverlay: React.FC = () => {
  const activeFX = useFXStore((state) => state.activeFX);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {activeFX && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-[999998] overflow-hidden"
        >
          {/* ═════════════════════════════════════════════════════════════════
              1. 🌧️ RAIN & WATER SPRAY FULL-SCREEN EFFECT (3-4 SECONDS)
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'rain' && (
            <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-[0.5px]">
              {/* Falling Raindrop Streams */}
              {Array.from({ length: 45 }).map((_, i) => {
                const leftPos = `${(i * 100) / 45 + (Math.random() * 2 - 1)}%`;
                const delay = Math.random() * 0.4;
                const duration = 0.45 + Math.random() * 0.25;

                return (
                  <motion.div
                    key={i}
                    initial={{ y: '-10vh', opacity: 0.8 }}
                    animate={{ y: '110vh', opacity: [0.3, 0.9, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration,
                      delay,
                      ease: 'linear',
                    }}
                    style={{ left: leftPos }}
                    className="absolute top-0 w-0.5 sm:w-1 h-12 sm:h-20 bg-gradient-to-b from-transparent via-cyan-300 to-sky-100 rounded-full shadow-[0_0_8px_#38bdf8]"
                  />
                );
              })}

              {/* Splashes on Bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-around">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [0.5, 1.8, 0], opacity: [0.8, 0.4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.1,
                    }}
                    className="w-8 h-3 rounded-full border-2 border-cyan-300/60 bg-cyan-400/20"
                  />
                ))}
              </div>

              {/* Water Mist vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-sky-900/20" />
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              2. ⚡ ELECTRICAL SPARK & LIGHTNING SURGE EFFECT
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'spark' && (
            <div className="absolute inset-0 bg-amber-950/20">
              {/* Lightning Flashes */}
              <motion.div
                animate={{ opacity: [0, 0.6, 0, 0.9, 0, 0.3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-amber-400/25 pointer-events-none"
              />

              {/* Dynamic Sparks */}
              {Array.from({ length: 30 }).map((_, i) => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 80,
                      y: (Math.random() - 0.5) * 80,
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.35 + Math.random() * 0.3,
                      delay: Math.random() * 0.4,
                    }}
                    style={{ left: `${randomX}%`, top: `${randomY}%` }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_15px_#f59e0b]"
                  />
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              3. 🔥 STEAM & HEAT SHIMMER EFFECT
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'steam' && (
            <div className="absolute inset-0 bg-orange-950/20">
              {Array.from({ length: 25 }).map((_, i) => {
                const randomLeft = `${Math.random() * 100}%`;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '100vh', opacity: 0.7, scale: 0.8 }}
                    animate={{
                      y: '-20vh',
                      opacity: [0.3, 0.7, 0],
                      scale: [0.8, 2.5, 4],
                      x: Math.sin(i) * 40,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2 + Math.random() * 1.5,
                      delay: Math.random() * 0.8,
                      ease: 'easeOut',
                    }}
                    style={{ left: randomLeft }}
                    className="absolute bottom-0 w-20 h-20 rounded-full bg-gradient-to-t from-white/30 via-amber-200/20 to-transparent blur-md"
                  />
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              4. ⏳ 500-YEAR TIME MACHINE WORMHOLE DUST
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'timelapse' && (
            <div className="absolute inset-0 bg-indigo-950/30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/15 via-purple-600/10 to-transparent"
              />
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.9, 0],
                    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
                    y: (Math.random() - 0.5) * window.innerHeight * 0.8,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: Math.random() * 0.8,
                  }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fbbf24]"
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
