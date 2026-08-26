import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useAudioStore } from '@/stores/audioStore';
import { sounds } from '@/lib/sounds';

export interface PipSpeechBubbleProps {
  message: string;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
  speakerName?: string;
  autoSpeak?: boolean;
}

export const PipSpeechBubble: React.FC<PipSpeechBubbleProps> = ({
  message,
  isVisible,
  onComplete,
  className = '',
  speakerName = 'Pip',
  autoSpeak = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isTtsMuted = useAudioStore((state) => state.isTtsMuted);
  const toggleTts = useAudioStore((state) => state.toggleTts);

  useEffect(() => {
    const listener = (speaking: boolean) => setIsSpeaking(speaking);
    voiceAssistant.addListener(listener);
    return () => {
      voiceAssistant.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      voiceAssistant.stop();
      return;
    }

    sounds.pop();
    if (autoSpeak && !isTtsMuted) {
      voiceAssistant.speak(message);
    }
    if (onComplete) onComplete();
  }, [isVisible, message, autoSpeak, isTtsMuted, onComplete]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.pop();
    voiceAssistant.speak(message);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.pop();
    toggleTts();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative bg-white p-5 md:p-6 rounded-3xl border-3 border-violet-400 shadow-xl max-w-lg w-full ${className}`}
        >
          {/* Speech bubble tail */}
          <div className="absolute -left-3 top-7 w-5 h-5 bg-white border-l-3 border-b-3 border-violet-400 transform rotate-45" />

          {/* Top Bar: Speaker Badge + Voice Equalizer + Controls */}
          <div className="flex items-center justify-between mb-3 border-b-2 border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{speakerName} the Science Guide</span>
              </span>

              {/* Animated 5-Bar Soundwave Equalizer */}
              {isSpeaking && (
                <div className="flex items-center gap-0.5 h-4 ml-1">
                  {[0.4, 0.9, 0.5, 1.0, 0.6].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['4px', `${h * 16}px`, '4px'] }}
                      transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.08 }}
                      className="w-1 bg-violet-600 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Audio Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReplay}
                className="p-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all active:scale-95 cursor-pointer"
                title="Replay Voice Audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleMute}
                className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                  isTtsMuted
                    ? 'bg-rose-100 text-rose-700 border-rose-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={isTtsMuted ? 'Unmute Voice' : 'Mute Voice'}
              >
                {isTtsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 opacity-70" />}
              </button>
            </div>
          </div>

          {/* Speech Message Body */}
          <p className="text-slate-800 font-extrabold text-base md:text-lg leading-relaxed">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
