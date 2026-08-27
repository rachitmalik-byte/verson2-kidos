import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, ArrowRight, Check, Compass, Sliders, Coins, Gamepad2, Shirt } from 'lucide-react';

interface FirstTimeTutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstTimeTutorialOverlay: React.FC<FirstTimeTutorialOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(0);
  const setHasSeenTutorial = useProgressStore((state) => state.setHasSeenTutorial);

  const TUTORIAL_STEPS = [
    {
      title: "Meet Pip, Your Lab Buddy! 🔬",
      text: "Hi! I'm Pip! I'm here to explore science with you! Tap on me anytime to talk, high-five, or hear fun science facts!",
      emoji: "👋",
      highlight: "pip",
    },
    {
      title: "Your Hands-On Mission Trail 🗺️",
      text: "Every stop on your trail is a real science mystery. You will test raincoats, light circuits, and operate the plastic press!",
      emoji: "🧭",
      highlight: "trail",
    },
    {
      title: "Audio Studio & Calm Focus 🎧",
      text: "You are in full control! Turn music on or off, pick relaxing study beats, or adjust Pip's speaking pace in the Audio Studio.",
      emoji: "🎵",
      highlight: "audio",
    },
    {
      title: "Earn Credits, Outfits & Arcade! 🪙",
      text: "Solve missions to earn PolyCredits! You can spend them in Pip's Wardrobe to dress him up in spacesuits, or play mini-games in the Arcade!",
      emoji: "🕹️",
      highlight: "arcade",
    },
  ];

  const current = TUTORIAL_STEPS[step];

  const handleNext = () => {
    sounds.pop();
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep((s) => s + 1);
      voiceAssistant.speak(TUTORIAL_STEPS[step + 1].text);
    } else {
      sounds.fanfare();
      setHasSeenTutorial(true);
      onClose();
      voiceAssistant.speak("You are all set! Let's start exploring!");
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Dimmed Focus Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Interactive Spotlight Card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        className="relative z-10 bg-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-amber-400 shadow-2xl p-6 md:p-8 max-w-lg w-full text-center flex flex-col items-center font-sans"
      >
        {/* Step Counter Pill */}
        <div className="px-3.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-full mb-4">
          Trial Guide • Step {step + 1} of {TUTORIAL_STEPS.length}
        </div>

        {/* Mascot Centerpiece */}
        <div className="my-2">
          {step === 0 ? (
            <Pip mood="celebrating" size="xl" interactive={true} />
          ) : step === 1 ? (
            <div className="w-24 h-24 rounded-3xl bg-sky-100 border-3 border-sky-400 flex items-center justify-center text-5xl shadow-md">
              🗺️
            </div>
          ) : step === 2 ? (
            <div className="w-24 h-24 rounded-3xl bg-purple-100 border-3 border-purple-400 flex items-center justify-center text-5xl shadow-md">
              🎧
            </div>
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-amber-100 border-3 border-amber-400 flex items-center justify-center text-5xl shadow-md">
              🪙🕹️
            </div>
          )}
        </div>

        <h3
          className="text-2xl font-black text-slate-900 mt-3 mb-2"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          {current.title}
        </h3>
        <p className="text-sm text-slate-600 font-bold mb-6 leading-relaxed">
          {current.text}
        </p>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => {
              sounds.fanfare();
              setHasSeenTutorial(true);
              onClose();
            }}
            className="py-3 px-4 rounded-2xl text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer"
          >
            Skip Tour
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-95 transition-all"
          >
            <span>{step < TUTORIAL_STEPS.length - 1 ? 'Next →' : "🚀 Let's Start Exploring!"}</span>
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
