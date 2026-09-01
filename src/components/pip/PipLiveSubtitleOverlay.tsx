import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Volume2 } from 'lucide-react';

interface Props {
  dialogue: string;
  pipMood?: 'explaining' | 'curious' | 'celebrating' | 'thinking' | 'encouraging';
  onComplete?: () => void;
  autoSpeak?: boolean;
}

export const PipLiveSubtitleOverlay: React.FC<Props> = ({
  dialogue,
  onComplete,
  autoSpeak = true,
}) => {
  const words = dialogue.split(' ');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setActiveWordIndex(0);
    if (autoSpeak) {
      handleSpeak();
    }
  }, [dialogue]);

  const handleSpeak = () => {
    sounds.pop();
    setIsSpeaking(true);
    voiceAssistant.speak(dialogue);

    const interval = setInterval(() => {
      setActiveWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsSpeaking(false);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 240);

    return () => clearInterval(interval);
  };

  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      {/* ── Glowing Animated Subtitle Overlay Pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-xl bg-slate-950/90 backdrop-blur-xl border-3 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400" />

        {/* Top Header: Voice Equalizer Indicator & Replay */}
        <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Live Audio Equalizer Bars */}
            <div className="flex items-center gap-0.5 h-3.5 px-2 py-0.5 bg-amber-400/20 rounded-full border border-amber-400/40">
              <motion.div
                animate={isSpeaking ? { height: ['4px', '14px', '6px', '12px', '4px'] } : { height: '4px' }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-0.5 bg-amber-300 rounded-full"
              />
              <motion.div
                animate={isSpeaking ? { height: ['8px', '4px', '14px', '6px', '8px'] } : { height: '4px' }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-0.5 bg-amber-300 rounded-full"
              />
              <motion.div
                animate={isSpeaking ? { height: ['12px', '6px', '4px', '14px', '12px'] } : { height: '4px' }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-0.5 bg-amber-300 rounded-full"
              />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 font-mono">
              Pip's Spoken Subtitles
            </span>
          </div>

          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 text-[10px] font-black"
            title="Hear Pip speak this line again"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Replay Voice</span>
          </button>
        </div>

        {/* Dynamic Word-by-Word Animated Subtitle Text */}
        <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-sm sm:text-base md:text-lg font-black leading-relaxed">
          {words.map((word, idx) => {
            const isCurrent = idx === activeWordIndex && isSpeaking;
            const isSpoken = idx <= activeWordIndex;

            return (
              <motion.span
                key={`${word}-${idx}`}
                initial={{ opacity: 0.4, scale: 0.95 }}
                animate={{
                  opacity: isSpoken ? 1 : 0.4,
                  scale: isCurrent ? 1.08 : 1,
                  color: isCurrent ? '#FDE047' : isSpoken ? '#FFFFFF' : '#94A3B8',
                }}
                transition={{ duration: 0.15 }}
                className={`inline-block transition-colors ${
                  isCurrent ? 'drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] font-black underline decoration-amber-400 decoration-2' : ''
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
