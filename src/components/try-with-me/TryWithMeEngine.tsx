import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, X, ChevronRight } from 'lucide-react';

interface SpotlightTarget {
  id: string;
  route: string;
  title: string;
  text: string;
  actionText: string;
  nextRoute?: string;
  positionPreference?: 'bottom' | 'top' | 'left' | 'right';
}

const SPOTLIGHT_STEPS: SpotlightTarget[] = [
  {
    id: 'subject-chem-card',
    route: '/subjects',
    title: '🧪 Science Discipline: Chemistry & Materials',
    text: 'Welcome to our Science Academy! Chemistry is the study of what everything around us is made of — from cotton clothes to spacecraft plastics! Tap the highlighted card to enter!',
    actionText: 'Tap Chemistry Card →',
    nextRoute: '/chapter-hub',
    positionPreference: 'bottom',
  },
  {
    id: 'chapter-hero-banner',
    route: '/chapter-hub',
    title: '📖 Chapter 3: Synthetic Materials',
    text: 'This is our active chapter! "Synthetic" is a science word for materials created by people in factories — like nylon ropes and waterproof plastics! Let’s explore together!',
    actionText: 'Next: Explore Controls →',
    positionPreference: 'bottom',
  },
  {
    id: 'navbar-top-controls',
    route: '/chapter-hub',
    title: '🎧 Audio Studio, PolyCredits & Wardrobe',
    text: 'Look at your top toolbelt! You can play calm focus study music, check your PolyCredits 🪙 wallet, and spend coins in my Wardrobe to dress me in spacesuits!',
    actionText: 'Next: Start First Mission →',
    positionPreference: 'bottom',
  },
  {
    id: 'chapter-mission-1-card',
    route: '/chapter-hub',
    title: '🌧️ Mission 1: The Raincoat Mystery',
    text: 'Now try it with me! Tap on Mission 1 to begin your first hands-on experiment. I will be with you inside the lab to guide you step-by-step!',
    actionText: 'Enter Mission 1 🔬',
    nextRoute: '/chapter/3/mission/1',
    positionPreference: 'top',
  },
];

export const TryWithMeEngine: React.FC = () => {
  const isTryWithMeActive = useProgressStore((state) => state.isTryWithMeActive);
  const tryWithMeStep = useProgressStore((state) => state.tryWithMeStep);
  const setTryWithMeStep = useProgressStore((state) => state.setTryWithMeStep);
  const endTryWithMe = useProgressStore((state) => state.endTryWithMe);

  const navigate = useNavigate();
  const location = useLocation();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = SPOTLIGHT_STEPS[tryWithMeStep];

  // Re-calculate target bounding rect on window resize, scroll, or step change
  useEffect(() => {
    if (!isTryWithMeActive || !currentStep) return;

    // Check if we are on the correct route
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(currentStep.id);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        // Scroll element into view smoothly if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Retry shortly if element is rendering
        setTimeout(() => {
          const retryEl = document.getElementById(currentStep.id);
          if (retryEl) setTargetRect(retryEl.getBoundingClientRect());
        }, 300);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    // Speak Socratic guidance
    voiceAssistant.speak(currentStep.text);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isTryWithMeActive, tryWithMeStep, location.pathname, currentStep]);

  if (!isTryWithMeActive || !currentStep || typeof document === 'undefined') return null;

  const handleNext = () => {
    sounds.pop();
    if (currentStep.nextRoute) {
      navigate(currentStep.nextRoute);
    }
    if (tryWithMeStep < SPOTLIGHT_STEPS.length - 1) {
      setTryWithMeStep(tryWithMeStep + 1);
    } else {
      sounds.fanfare();
      endTryWithMe();
      voiceAssistant.speak("You did it! Now complete the raincoat mystery with me in the lab!");
    }
  };

  const handleTargetElementClick = () => {
    sounds.pop();
    handleNext();
  };

  const rect = targetRect || {
    x: window.innerWidth / 2 - 150,
    y: window.innerHeight / 2 - 100,
    width: 300,
    height: 200,
    top: window.innerHeight / 2 - 100,
    left: window.innerWidth / 2 - 150,
    bottom: window.innerHeight / 2 + 100,
    right: window.innerWidth / 2 + 150,
  };

  // Determine Pip & Bubble position (avoid going off screen)
  const bubbleTop =
    currentStep.positionPreference === 'top' || rect.top > window.innerHeight / 2
      ? Math.max(16, rect.top - 240)
      : Math.min(window.innerHeight - 260, rect.bottom + 20);

  const bubbleLeft = Math.max(16, Math.min(window.innerWidth - 380, rect.left + rect.width / 2 - 190));

  return createPortal(
    <div className="fixed inset-0 z-[99990] font-sans select-none overflow-hidden">
      {/* ── SVG CUTOUT LIMELIGHT SPOTLIGHT ── */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            {/* White covers all (opaque/dimmed) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black cutout over target (reveals target in bright limelight) */}
            <rect
              x={rect.left - 8}
              y={rect.top - 8}
              width={rect.width + 16}
              height={rect.height + 16}
              rx="28"
              fill="black"
            />
          </mask>
        </defs>
        {/* Dark dimmed vignette with limelight cutout */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(8, 14, 28, 0.86)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* ── Glowing Pulsing Ring around Cutout ── */}
      <motion.div
        animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: rect.top - 10,
          left: rect.left - 10,
          width: rect.width + 20,
          height: rect.height + 20,
          borderRadius: 30,
          border: '4px solid #F59E0B',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.6), inset 0 0 15px rgba(245, 158, 11, 0.3)',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={handleTargetElementClick}
        title="Tap highlighted item to proceed!"
      />

      {/* ── PIP AS TEACHER WITH POINTER WAND & SPOTLIGHT SPEECH BUBBLE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        style={{
          position: 'fixed',
          top: bubbleTop,
          left: bubbleLeft,
          width: 380,
          zIndex: 99999,
          pointerEvents: 'auto',
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-5 w-full relative filter drop-shadow-2xl">
          {/* Teacher Pip with Pointer Stick */}
          <div className="absolute -top-16 -left-6 scale-110">
            <Pip mood="celebrating" size="md" showPointerStick={true} interactive={true} />
          </div>

          <div className="pl-16">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 border border-amber-300 text-amber-900 px-3 py-0.5 rounded-full inline-block mb-1">
              🪄 Try It With Me • Step {tryWithMeStep + 1} of {SPOTLIGHT_STEPS.length}
            </span>
            <h4
              className="font-black text-base md:text-lg text-slate-900 leading-snug"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {currentStep.title}
            </h4>
          </div>

          <p className="text-xs font-bold text-slate-600 my-3 leading-relaxed">
            {currentStep.text}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                endTryWithMe();
              }}
              className="py-2 px-3 text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer rounded-xl hover:bg-slate-100"
            >
              Exit Guide
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{currentStep.actionText}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
