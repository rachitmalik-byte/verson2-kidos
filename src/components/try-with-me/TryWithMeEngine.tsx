import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, X, Sparkles } from 'lucide-react';

interface SpotlightTarget {
  id: string;
  route: string;
  category: string;
  title: string;
  text: string;
  actionText: string;
  nextRoute?: string;
  positionPreference?: 'bottom' | 'top';
}

const SPOTLIGHT_STEPS: SpotlightTarget[] = [
  // ── PART 1: ACADEMY & SUBJECTS ──
  {
    id: 'subject-intro-banner',
    route: '/subjects',
    category: '🏛️ Science Academy Orientation',
    title: 'Welcome to the Science Academy! 🔬',
    text: 'Hello young scientist! Science is divided into disciplines like Physics, Biology, and Space. Today, our journey begins in the Chemistry & Materials laboratory!',
    actionText: 'Next: Explore Chemistry →',
    positionPreference: 'bottom',
  },
  {
    id: 'subject-chem-card',
    route: '/subjects',
    category: '🧪 Active Discipline',
    title: 'Chemistry & Materials Lab',
    text: 'Look at this glowing beaker! Here, we study what everything on Earth is made of — from clothing fibers to spaceship plastics. Tap this card to step inside!',
    actionText: 'Open Chemistry Lab 🔬',
    nextRoute: '/chapter-hub',
    positionPreference: 'bottom',
  },

  // ── PART 2: CHAPTER HUB & LESSON OVERVIEW ──
  {
    id: 'chapter-hero-banner',
    route: '/chapter-hub',
    category: '📖 Active Curriculum Chapter',
    title: 'Chapter 3: The World of Synthetic Materials',
    text: 'Here is our active chapter! "Synthetic" is a science word for materials created by people using chemistry — like waterproof raincoats and strong ropes!',
    actionText: 'Next: Learn Toolbelt →',
    positionPreference: 'bottom',
  },
  {
    id: 'navbar-audio-studio-btn',
    route: '/chapter-hub',
    category: '🎧 Focus & Accessibility',
    title: 'Audio Studio & Calm Lo-Fi Beats',
    text: 'Look up here at the Audio Studio! If you want calming study music to help you focus, or want to slow down Pip’s speaking pace, you can adjust everything here!',
    actionText: 'Next: Wallet →',
    positionPreference: 'bottom',
  },
  {
    id: 'navbar-credits-btn',
    route: '/chapter-hub',
    category: '🪙 Student Economy',
    title: 'Your PolyCredits Gold Balance',
    text: 'This is your PolyCredits wallet! You earn shiny gold coins for every experiment and puzzle you solve across the chapter!',
    actionText: 'Next: Wardrobe →',
    positionPreference: 'bottom',
  },
  {
    id: 'navbar-closet-btn',
    route: '/chapter-hub',
    category: '🥼 Pip Customization',
    title: 'Pip\'s Dressing Room & Wardrobe',
    text: 'This is my Wardrobe Studio! You can spend your earned credits to equip me with spacesuits, detective trenchcoats, safety goggles, and golden crowns!',
    actionText: 'Next: Arcade →',
    positionPreference: 'bottom',
  },
  {
    id: 'navbar-arcade-btn',
    route: '/chapter-hub',
    category: '🕹️ Reflex Mini-Games',
    title: 'PolyQuest Science Arcade',
    text: 'This is the Arcade! Spend 10 coins to take a study break with Classic Snake 🐍, Card Memory Match 🃏, and Bubble Pop Blitz 🫧!',
    actionText: 'Next: Chapter Tools →',
    positionPreference: 'bottom',
  },
  {
    id: 'chapter-intro-btn',
    route: '/chapter-hub',
    category: '🎬 Interactive Storybook',
    title: 'Play Chapter Intro Cinema',
    text: 'Tap this button anytime to watch an animated story showing everyday items and asking: Why are they made of different materials?',
    actionText: 'Next: Specimen Journal →',
    positionPreference: 'bottom',
  },
  {
    id: 'chapter-journal-btn',
    route: '/chapter-hub',
    category: '📖 Specimen Collection',
    title: 'Field Specimen Discovery Journal',
    text: 'Every material you test in the lab (like Nylon, Polyester, and Plastics) gets stamped into your personal journal with its superpowers and uses!',
    actionText: 'Next: Mission Trail →',
    positionPreference: 'bottom',
  },
  {
    id: 'chapter-missions-trail',
    route: '/chapter-hub',
    category: '🗺️ Progressive Learning Trail',
    title: 'The 13-Mission Learning Trail',
    text: 'Here is your roadmap! Each stop is a real hands-on investigation. Missions unlock sequentially as you test materials and master science concepts!',
    actionText: 'Next: Start Mission 1 →',
    positionPreference: 'top',
  },
  {
    id: 'chapter-mission-1-card',
    route: '/chapter-hub',
    category: '🌧️ First Hands-On Lab',
    title: 'Mission 1: The Raincoat Mystery',
    text: 'Now try it with me! Tap on Mission 1 to enter the lab. We will pour water on coats and discover what makes materials waterproof!',
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

  useEffect(() => {
    if (!isTryWithMeActive || !currentStep) return;

    // Navigate to expected route if not currently there
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(currentStep.id);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTimeout(() => {
          const retryEl = document.getElementById(currentStep.id);
          if (retryEl) {
            setTargetRect(retryEl.getBoundingClientRect());
            retryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 350);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    // Socratic voice narration
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
      voiceAssistant.speak("You did it! You mastered the entire platform tour! Now let's experiment in the lab!");
    }
  };

  const handleTargetClick = () => {
    sounds.pop();
    handleNext();
  };

  const rect = targetRect || {
    x: window.innerWidth / 2 - 160,
    y: window.innerHeight / 2 - 100,
    width: 320,
    height: 200,
    top: window.innerHeight / 2 - 100,
    left: window.innerWidth / 2 - 160,
    bottom: window.innerHeight / 2 + 100,
    right: window.innerWidth / 2 + 160,
  };

  // Safe bubble positioning
  const bubbleTop =
    currentStep.positionPreference === 'top' || rect.top > window.innerHeight / 2
      ? Math.max(16, rect.top - 250)
      : Math.min(window.innerHeight - 270, rect.bottom + 20);

  const bubbleLeft = Math.max(16, Math.min(window.innerWidth - 420, rect.left + rect.width / 2 - 210));

  return createPortal(
    <div className="fixed inset-0 z-[99990] font-sans select-none overflow-hidden">
      {/* ── SVG CUTOUT LIMELIGHT SPOTLIGHT ── */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            {/* White covers and dims everything */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black cutout creates a clear window over the active target element */}
            <rect
              x={rect.left - 10}
              y={rect.top - 10}
              width={rect.width + 20}
              height={rect.height + 20}
              rx="30"
              fill="black"
            />
          </mask>
        </defs>
        {/* Deep dark focus background with cutout mask */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(6, 11, 25, 0.88)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* ── Glowing Pulsing Ring around the Active Target ── */}
      <motion.div
        animate={{ scale: [1, 1.02, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: rect.top - 12,
          left: rect.left - 12,
          width: rect.width + 24,
          height: rect.height + 24,
          borderRadius: 32,
          border: '4px solid #F59E0B',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.7), inset 0 0 18px rgba(245, 158, 11, 0.4)',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={handleTargetClick}
        title="Tap highlighted item to continue!"
      />

      {/* ── TEACHER PIP WITH POINTER WAND & SPOTLIGHT SPEECH CARD ── */}
      <motion.div
        key={tryWithMeStep}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -15 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        style={{
          position: 'fixed',
          top: bubbleTop,
          left: bubbleLeft,
          width: 420,
          zIndex: 99999,
          pointerEvents: 'auto',
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-5 w-full relative filter drop-shadow-2xl">
          {/* Teacher Pip with Pointer Wand & Mouse-Tracking Eyes */}
          <div className="absolute -top-16 -left-6 scale-110">
            <Pip mood="celebrating" size="md" showPointerStick={true} interactive={true} />
          </div>

          <div className="pl-16">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 border border-amber-300 text-amber-900 px-3 py-0.5 rounded-full inline-block mb-1">
              🪄 {currentStep.category} • Step {tryWithMeStep + 1} of {SPOTLIGHT_STEPS.length}
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
