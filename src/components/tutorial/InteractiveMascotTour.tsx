import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { ArrowRight, Check, X, Sparkles, Hand, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const InteractiveMascotTour: React.FC = () => {
  const isTourActive = useProgressStore((state) => state.isTourActive);
  const tourStep = useProgressStore((state) => state.tourStep);
  const setTourStep = useProgressStore((state) => state.setTourStep);
  const endTour = useProgressStore((state) => state.endTour);

  const navigate = useNavigate();
  const location = useLocation();

  const TOUR_MESSAGES = [
    {
      step: 0,
      title: "Step 1: Your Laboratory Controls 🎧",
      text: "Look up here! You can adjust your background music, voice speed, check your PolyCredits 🪙, and dress Pip up in the Wardrobe!",
      actionText: "Next: Find Mission 1 →",
      targetPosition: "top-20 right-8 md:right-32",
    },
    {
      step: 1,
      title: "Step 2: Start Mission 1! 🌧️",
      text: "Tap on Mission 1: The Raincoat Mystery below! I'll fly right into the lab with you and assist you through the whole mission!",
      actionText: "Enter Mission 1 🔬",
      targetPosition: "top-64 left-1/2 -translate-x-1/2",
    },
  ];

  const currentMsg = TOUR_MESSAGES[tourStep] || TOUR_MESSAGES[0];

  useEffect(() => {
    if (isTourActive && location.pathname === '/chapter-hub') {
      voiceAssistant.speak(currentMsg.text);
    }
  }, [isTourActive, tourStep, location.pathname]);

  if (!isTourActive || typeof document === 'undefined') return null;

  // Only show on ChapterHub for Step 0 and 1
  if (location.pathname !== '/chapter-hub' && (tourStep === 0 || tourStep === 1)) {
    return null;
  }

  const handleNextStep = () => {
    sounds.pop();
    if (tourStep === 0) {
      setTourStep(1);
    } else if (tourStep === 1) {
      sounds.fanfare();
      navigate('/chapter/3/mission/1');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99998] pointer-events-none font-sans select-none">
      {/* Floating Animated Mascot Guide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tourStep}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className={`absolute ${currentMsg.targetPosition} pointer-events-auto max-w-sm w-full p-4`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-5 flex flex-col items-center text-center relative filter drop-shadow-xl">
            {/* Mascot on top of speech card */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <Pip mood="celebrating" size="md" interactive={true} />
            </div>

            <div className="mt-8">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full mb-1 inline-block">
                🧭 Pip's Guided Walkthrough
              </span>
              <h4
                className="font-black text-lg text-slate-900 mt-1"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {currentMsg.title}
              </h4>
              <p className="text-xs font-bold text-slate-600 my-2 leading-relaxed">
                {currentMsg.text}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2 w-full">
              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  endTour();
                }}
                className="py-2 px-3 text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer rounded-xl hover:bg-slate-100"
              >
                End Tour
              </button>

              <button
                onClick={handleNextStep}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <span>{currentMsg.actionText}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};
