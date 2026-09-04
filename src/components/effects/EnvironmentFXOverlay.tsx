import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFXStore } from '@/stores/fxStore';
import { useEnvironmentStore } from '@/stores/environmentStore';

export const EnvironmentFXOverlay: React.FC = () => {
  const activeFX = useFXStore((state) => state.activeFX);
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  if (typeof document === 'undefined') return null;

  const isRainActive = activeFX === 'rain' || (!activeFX && timeOfDay === 'rain');
  const isSunsetActive = !activeFX && timeOfDay === 'sunset';
  const hasAnyFX = Boolean(activeFX || isRainActive || isSunsetActive);

  return createPortal(
    <AnimatePresence>
      {hasAnyFX && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-[999998] overflow-hidden"
        >
          {/* ═══════════════════════════════════════════════════════════
              1. 🌧️ RAIN — Thin realistic streaks, subtle blue tint
          ═══════════════════════════════════════════════════════════ */}
          {isRainActive && (
            <div className="absolute inset-0 bg-sky-900/10">
              {Array.from({ length: 35 }).map((_, i) => {
                const leftPos = `${(i / 35) * 100 + (Math.random() * 2 - 1)}%`;
                const delay = Math.random() * 0.5;
                const dur = 0.35 + Math.random() * 0.15;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '-10vh', opacity: 0.6 }}
                    animate={{ y: '110vh', opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: dur, delay, ease: 'linear' }}
                    style={{ left: leftPos }}
                    className="absolute top-0 w-[1px] h-10 sm:h-16 bg-gradient-to-b from-transparent via-sky-300/70 to-sky-200/40 rounded-full"
                  />
                );
              })}
              {/* Subtle bottom mist */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sky-400/10 to-transparent" />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              2. ⚡ SPARK — Brief flash + a few sparks
          ═══════════════════════════════════════════════════════════ */}
          {activeFX === 'spark' && (
            <div className="absolute inset-0 bg-amber-950/10">
              {/* Single bright flash */}
              <motion.div
                animate={{ opacity: [0, 0.6, 0, 0.8, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute inset-0 bg-amber-200/20 pointer-events-none"
              />
              {/* Fewer, more realistic spark particles */}
              {Array.from({ length: 18 }).map((_, i) => {
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 60,
                      y: (Math.random() - 0.5) * 60,
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.25 + Math.random() * 0.2,
                      delay: Math.random() * 0.4,
                    }}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]"
                  />
                );
              })}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              3. 🔥 STEAM — Soft rising wisps
          ═══════════════════════════════════════════════════════════ */}
          {activeFX === 'steam' && (
            <div className="absolute inset-0 bg-orange-900/5">
              {Array.from({ length: 14 }).map((_, i) => {
                const left = `${(i / 14) * 100}%`;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '105vh', opacity: 0.5, scale: 0.5 }}
                    animate={{
                      y: '-20vh',
                      opacity: [0.3, 0.5, 0],
                      scale: [0.5, 2, 3.5],
                      x: Math.sin(i * 0.8) * 30,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2 + Math.random() * 1.0,
                      delay: Math.random() * 0.8,
                      ease: 'easeOut',
                    }}
                    style={{ left }}
                    className="absolute bottom-0 w-20 h-20 rounded-full bg-gradient-to-t from-white/25 via-amber-50/15 to-transparent blur-md"
                  />
                );
              })}
              {/* Heat shimmer at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-300/10 to-transparent" />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              4. ⏳ TIMELAPSE — Swirling dust motes
          ═══════════════════════════════════════════════════════════ */}
          {activeFX === 'timelapse' && (
            <div className="absolute inset-0 bg-indigo-950/15">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-purple-500/5 to-transparent"
              />
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                    x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth * 0.7 : 600),
                    y: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 400),
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: Math.random() * 0.8,
                  }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-amber-200 to-yellow-100 shadow-[0_0_8px_#fbbf24]"
                />
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              5. 🌅 SUNSET MOTES — Soft floating golden twilight particles
          ═══════════════════════════════════════════════════════════ */}
          {isSunsetActive && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 22 }).map((_, i) => {
                const left = `${(i / 22) * 100 + (Math.random() * 2 - 1)}%`;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '105vh', opacity: 0, scale: 0.8 }}
                    animate={{
                      y: '-10vh',
                      opacity: [0, 0.75, 0],
                      scale: [0.8, 1.4, 0.8],
                      x: Math.sin(i * 1.5) * 40,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 7 + (i % 5),
                      delay: (i % 6) * 0.7,
                      ease: 'linear',
                    }}
                    style={{ left }}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-amber-300 via-orange-300 to-rose-300 blur-[0.5px] shadow-[0_0_8px_#f59e0b]"
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
