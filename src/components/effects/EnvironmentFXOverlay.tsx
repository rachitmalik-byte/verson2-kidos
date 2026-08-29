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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 pointer-events-none z-[999998] overflow-hidden"
        >
          {/* ═════════════════════════════════════════════════════════════════
              1. 🌧️ RAINSTORM & WATER DROPLET EFFECT (3-4 SECONDS)
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'rain' && (
            <div className="absolute inset-0 bg-sky-950/25 backdrop-blur-[1px]">
              {/* Rain Streams */}
              {Array.from({ length: 50 }).map((_, i) => {
                const leftPos = `${(i * 100) / 50 + (Math.random() * 2 - 1)}%`;
                const delay = Math.random() * 0.3;
                const duration = 0.4 + Math.random() * 0.2;

                return (
                  <motion.div
                    key={i}
                    initial={{ y: '-15vh', opacity: 0.9 }}
                    animate={{ y: '115vh', opacity: [0.3, 1, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration,
                      delay,
                      ease: 'linear',
                    }}
                    style={{ left: leftPos }}
                    className="absolute top-0 w-1 sm:w-1.5 h-16 sm:h-28 bg-gradient-to-b from-transparent via-cyan-300 to-sky-100 rounded-full shadow-[0_0_12px_#38bdf8]"
                  />
                );
              })}

              {/* Water Splash Rings on Bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-around pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [0.3, 2.2, 0], opacity: [0.9, 0.5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.55,
                      delay: i * 0.08,
                    }}
                    className="w-12 h-4 rounded-full border-2 border-cyan-300 bg-cyan-400/30 shadow-[0_0_10px_#38bdf8]"
                  />
                ))}
              </div>

              {/* Rain Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 via-transparent to-sky-900/25" />
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              2. ⚡ ELECTRICAL SPARK & LIGHTNING FLASH EFFECT
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'spark' && (
            <div className="absolute inset-0 bg-amber-950/20">
              {/* Lightning Strobe Flashes */}
              <motion.div
                animate={{ opacity: [0, 0.8, 0, 0.95, 0, 0.4, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="absolute inset-0 bg-amber-300/30 pointer-events-none"
              />

              {/* High Voltage Lightning Bolt Arcs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.9, 1.1], rotate: [-5, 5, -3, 3] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  className="w-72 h-72 rounded-full border-4 border-amber-300/60 shadow-[0_0_50px_#f59e0b] blur-[1px]"
                />
              </div>

              {/* Dynamic Electric Spark Particles */}
              {Array.from({ length: 45 }).map((_, i) => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 2, 0],
                      x: (Math.random() - 0.5) * 120,
                      y: (Math.random() - 0.5) * 120,
                      opacity: [1, 0.9, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.3 + Math.random() * 0.25,
                      delay: Math.random() * 0.3,
                    }}
                    style={{ left: `${randomX}%`, top: `${randomY}%` }}
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-cyan-300 shadow-[0_0_20px_#f59e0b]"
                  />
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              3. 🔥 STEAM & BOILING HEAT SHIMMER EFFECT
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'steam' && (
            <div className="absolute inset-0 bg-orange-950/20">
              {Array.from({ length: 30 }).map((_, i) => {
                const randomLeft = `${Math.random() * 100}%`;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '105vh', opacity: 0.8, scale: 0.6 }}
                    animate={{
                      y: '-25vh',
                      opacity: [0.4, 0.85, 0],
                      scale: [0.6, 3, 5],
                      x: Math.sin(i) * 50,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.0 + Math.random() * 1.2,
                      delay: Math.random() * 0.7,
                      ease: 'easeOut',
                    }}
                    style={{ left: randomLeft }}
                    className="absolute bottom-0 w-28 h-28 rounded-full bg-gradient-to-t from-white/40 via-amber-100/30 to-transparent blur-lg"
                  />
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              4. ⏳ 500-YEAR TIME MACHINE WORMHOLE DUST
              ═════════════════════════════════════════════════════════════════ */}
          {activeFX === 'timelapse' && (
            <div className="absolute inset-0 bg-indigo-950/35">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/25 via-purple-600/15 to-transparent"
              />
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2, 0],
                    opacity: [0, 1, 0],
                    x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800),
                    y: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600),
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.0,
                    delay: Math.random() * 0.6,
                  }}
                  className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 shadow-[0_0_15px_#fbbf24]"
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
