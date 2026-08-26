import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  RaincoatSyntheticIllustration,
  PolyesterIllustration,
  NylonIllustration,
  PlasticIllustration,
  RubberIllustration,
  WireIllustration,
  KettleIllustration,
  WoolIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { Sparkles, ArrowRight, Play, Volume2 } from 'lucide-react';

const OBJECTS = [
  { id: 'shirt', name: 'Polyester Shirt', renderIcon: () => <PolyesterIllustration className="w-16 h-16" />, x: '10%', y: '16%', delay: 0.1 },
  { id: 'coat', name: 'Raincoat', renderIcon: () => <RaincoatSyntheticIllustration className="w-16 h-16" />, x: '82%', y: '14%', delay: 0.2 },
  { id: 'bottle', name: 'Plastic Bottle', renderIcon: () => <PlasticIllustration className="w-16 h-16" />, x: '20%', y: '48%', delay: 0.3 },
  { id: 'rope', name: 'Nylon Rope', renderIcon: () => <NylonIllustration className="w-16 h-16" />, x: '84%', y: '48%', delay: 0.4 },
  { id: 'wool', name: 'Wool Sweater', renderIcon: () => <WoolIllustration className="w-16 h-16" />, x: '12%', y: '72%', delay: 0.5 },
  { id: 'kettle', name: 'Kettle', renderIcon: () => <KettleIllustration className="w-16 h-16" />, x: '48%', y: '12%', delay: 0.6 },
  { id: 'wire', name: 'Insulated Wire', renderIcon: () => <WireIllustration className="w-16 h-16" />, x: '82%', y: '76%', delay: 0.7 },
  { id: 'tyre', name: 'Rubber Tyre', renderIcon: () => <RubberIllustration className="w-16 h-16" />, x: '45%', y: '78%', delay: 0.8 },
];

const MESSAGES = [
  'We use all these things every single day around our homes and schools...',
  'But have you ever stopped to wonder...',
  'Why is each object made from a completely different material?',
];

export const ChapterIntro = () => {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Speak with natural human voice when message changes
    voiceAssistant.speak(MESSAGES[messageIndex]);
  }, [messageIndex]);

  const handleNextMessage = () => {
    sounds.pop();
    if (messageIndex < MESSAGES.length - 1) {
      setMessageIndex((prev) => prev + 1);
    } else {
      sounds.fanfare();
      voiceAssistant.stop();
      navigate('/chapter/3/mission/1');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 via-indigo-100 to-amber-100 relative overflow-hidden flex flex-col items-center justify-between p-6 md:p-12 font-sans">
      {/* ── Top Header ── */}
      <div className="w-full max-w-5xl flex items-center justify-between z-30 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider bg-sky-500 text-white px-3.5 py-1.5 rounded-full shadow-xs">
            Chapter 3 Quest
          </span>
          <span className="text-sm font-extrabold text-slate-800">The World of Synthetic Materials</span>
        </div>

        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/chapter/3/mission/1');
          }}
          className="text-xs font-extrabold text-slate-800 bg-white/95 px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Skip to Mission 1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Floating Illustrated Objects ── */}
      <div className="absolute inset-0 pointer-events-none">
        {OBJECTS.map((obj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: obj.delay, type: 'spring', damping: 15 }}
            className="absolute select-none"
            style={{ left: obj.x, top: obj.y }}
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (i * 0.3) % 2,
              }}
              className="relative group pointer-events-auto cursor-pointer flex flex-col items-center"
              onClick={() => {
                sounds.pop();
                voiceAssistant.speak(obj.name);
              }}
            >
              <div className="filter drop-shadow-xl hover:scale-110 transition-transform">
                {obj.renderIcon()}
              </div>
              <span className="opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-black bg-white text-slate-800 px-3 py-1 rounded-full shadow-md border-2 border-slate-200 pointer-events-none transition-opacity whitespace-nowrap">
                {obj.name}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ── Center Pip Storyteller Box ── */}
      <div className="z-30 max-w-2xl w-full flex flex-col items-center my-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 w-full justify-center">
          <Pip mood={messageIndex === 2 ? 'curious' : 'explaining'} size="xl" />
          <PipSpeechBubble message={MESSAGES[messageIndex]} isVisible={true} />
        </div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          {messageIndex < MESSAGES.length - 1 ? (
            <button
              onClick={handleNextMessage}
              className="bg-sky-500 hover:bg-sky-400 border-2 border-sky-700 shadow-[0_6px_0_#0369A1] active:translate-y-1.5 active:shadow-none text-white font-black text-lg md:text-xl py-4 px-12 rounded-3xl transition-all cursor-pointer flex items-center gap-2"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <span>Continue Story</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.fanfare();
                voiceAssistant.stop();
                navigate('/chapter/3/mission/1');
              }}
              className="bg-amber-400 hover:bg-amber-300 border-2 border-amber-600 shadow-[0_8px_0_#D97706] active:translate-y-2 active:shadow-none text-slate-950 font-black text-2xl md:text-3xl py-5 px-14 rounded-3xl transition-all cursor-pointer flex items-center gap-3 animate-bounce"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <span>🔬</span>
              <span>LET'S FIND OUT!</span>
              <ArrowRight className="w-7 h-7 stroke-[3]" />
            </motion.button>
          )}

          {/* Stepping Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === messageIndex ? 'w-8 bg-amber-400 border-2 border-amber-600' : 'w-3 bg-white/80'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <div className="z-30 text-center text-xs font-black text-slate-700 bg-white/80 backdrop-blur-xs px-5 py-2 rounded-full border border-white/60 shadow-xs">
        💡 Pip will read instructions aloud automatically! You can tap any item to hear its name.
      </div>
    </div>
  );
};
