import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioStore } from '@/stores/audioStore';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Home,
  Music,
  Sliders,
  Coins,
  Shirt,
  Gamepad2,
  Compass,
  Menu,
  X,
  Sparkles,
  Camera,
  Bot,
  FlaskConical,
} from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { ScienceArcadeModal } from '@/features/arcade/ScienceArcadeModal';
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';
import { ScanMyWorldModal } from '@/components/ai/ScanMyWorldModal';
import { SocraticPipAITutorModal } from '@/components/ai/SocraticPipAITutorModal';
import { WhatIfScienceSandboxModal } from '@/components/ai/WhatIfScienceSandboxModal';

interface AudioNavBarControlsProps {
  className?: string;
  showProfile?: boolean;
  isMissionMode?: boolean;
}

/**
 * Clean, Compact Audio Controls for Mission Screens (Zero Clutter)
 */
export const MissionAudioControls: React.FC = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { isSfxMuted, isBgmMuted, isTtsMuted, toggleBgm, toggleSfx } = useAudioStore();

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Quick Music Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleBgm();
          }}
          className={`p-1.5 sm:p-2 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            !isBgmMuted
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isBgmMuted ? 'Mute Background Music' : 'Unmute Background Music'}
        >
          <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
        </button>

        {/* Quick SFX Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleSfx();
          }}
          className={`p-1.5 sm:p-2 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            !isSfxMuted
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isSfxMuted ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
        >
          {!isSfxMuted ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          )}
        </button>

        {/* Settings & Voice Studio Modal */}
        <button
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-black text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
          title="Open Audio Studio Settings"
        >
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          <span className="hidden sm:inline">Audio</span>
        </button>
      </div>

      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};

/**
 * Full Feature Navbar for Chapter Hub & Academy
 */
export const AudioNavBarControls: React.FC<AudioNavBarControlsProps> = ({
  className = '',
  showProfile = true,
  isMissionMode = false,
}) => {
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [showArcadeModal, setShowArcadeModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showPipChatModal, setShowPipChatModal] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isSfxMuted, isTtsMuted, isBgmMuted, toggleSfx, toggleTts, toggleBgm } = useAudioStore();
  const child = useParentStore((state) => state.child);
  const credits = useProgressStore((state) => state.credits);
  const startTryWithMe = useProgressStore((state) => state.startTryWithMe);

  const handleHomeClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  if (isMissionMode) {
    return <MissionAudioControls />;
  }

  return (
    <>
      <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
        {/* PolyCredits Balance Badge */}
        <button
          id="navbar-credits-btn"
          onClick={() => {
            sounds.pop();
            setShowClosetModal(true);
          }}
          className="px-2.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0"
          title="PolyCredits Balance • Click to open Pip's Dressing Room"
        >
          <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 animate-pulse" />
          <span>{credits} 🪙</span>
        </button>

        {/* Desktop AI Tools Bar */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* Scan My World (Gemini Vision AI) */}
          <button
            id="navbar-scan-btn"
            onClick={() => {
              sounds.pop();
              setShowScanModal(true);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-md active:scale-95 transition-all"
            title="Scan physical objects around your house with Gemini AI"
          >
            <Camera className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Scan World 📷</span>
          </button>

          {/* Ask Pip AI Mentor */}
          <button
            id="navbar-ask-pip-btn"
            onClick={() => {
              sounds.pop();
              setShowPipChatModal(true);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-md active:scale-95 transition-all"
            title="Chat with Pip Socratic AI Tutor"
          >
            <Bot className="w-3.5 h-3.5 text-white" />
            <span>Ask Pip AI 🤖</span>
          </button>

          {/* What-If Lab */}
          <button
            id="navbar-what-if-btn"
            onClick={() => {
              sounds.pop();
              setShowWhatIfModal(true);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-md active:scale-95 transition-all"
            title="Generative Physics Sandbox"
          >
            <FlaskConical className="w-3.5 h-3.5 text-white" />
            <span>What-If? 🧪</span>
          </button>

          {/* Pip's Closet */}
          <button
            id="navbar-closet-btn"
            onClick={() => {
              sounds.pop();
              setShowClosetModal(true);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-pink-100 hover:bg-pink-200 border-2 border-pink-300 text-pink-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Open Pip's Wardrobe"
          >
            <Shirt className="w-3.5 h-3.5 text-pink-600" />
            <span>Wardrobe</span>
          </button>

          {/* Science Arcade */}
          <button
            id="navbar-arcade-btn"
            onClick={() => {
              sounds.pop();
              setShowArcadeModal(true);
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300 text-indigo-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Play Mini Games in the Science Arcade"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Arcade</span>
          </button>
        </div>

        {/* Quick Sound Toggles */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              sounds.pop();
              toggleBgm();
            }}
            className={`p-1.5 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
              !isBgmMuted ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title="Toggle Music"
          >
            <Music className={`w-3.5 h-3.5 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => {
              sounds.pop();
              toggleSfx();
            }}
            className={`p-1.5 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
              !isSfxMuted ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title="Toggle SFX"
          >
            {!isSfxMuted ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile More Tools Menu Button */}
        <button
          onClick={() => {
            sounds.pop();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="md:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 cursor-pointer shrink-0"
          title="Open Menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Audio Studio Modal Trigger (Desktop) */}
        <button
          id="navbar-audio-studio-btn"
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="hidden lg:flex p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 items-center gap-1 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
          title="Open Audio Studio Settings"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span>Audio Studio</span>
        </button>

        {/* Profile shortcut */}
        {showProfile && (
          <button
            onClick={handleHomeClick}
            className="p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 flex items-center gap-1 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
            title="Return to Home"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-xs font-black">
              {child?.name ? child.name.charAt(0).toUpperCase() : <Home className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline font-black text-slate-800">{child?.name || 'Home'}</span>
          </button>
        )}
      </div>

      {/* Mobile Overflow Menu Drawer */}
      {/* Mobile Overflow Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 right-3 z-50 bg-white/95 backdrop-blur-xl border-3 border-slate-200 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[210px] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              sounds.pop();
              setShowScanModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 font-black text-xs flex items-center gap-2 text-left"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan My World 📷</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setShowPipChatModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-950 font-black text-xs flex items-center gap-2 text-left"
          >
            <Bot className="w-4 h-4 text-sky-600" />
            <span>Ask Pip AI 🤖</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setShowWhatIfModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 font-black text-xs flex items-center gap-2 text-left"
          >
            <FlaskConical className="w-4 h-4 text-purple-600" />
            <span>What-If? Sandbox 🧪</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setShowClosetModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-pink-50 border-2 border-pink-200 text-pink-900 font-black text-xs flex items-center gap-2 text-left"
          >
            <Shirt className="w-4 h-4 text-pink-600" />
            <span>Pip's Wardrobe</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setShowArcadeModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-2 text-left"
          >
            <Gamepad2 className="w-4 h-4 text-indigo-600" />
            <span>Science Arcade</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setShowSettingsModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 font-black text-xs flex items-center gap-2 text-left"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>Audio Studio</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <PipClosetModal isOpen={showClosetModal} onClose={() => setShowClosetModal(false)} />
      <ScienceArcadeModal isOpen={showArcadeModal} onClose={() => setShowArcadeModal(false)} />
      <FirstTimeTutorialOverlay isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} />
      <ScanMyWorldModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
      <SocraticPipAITutorModal isOpen={showPipChatModal} onClose={() => setShowPipChatModal(false)} />
      <WhatIfScienceSandboxModal isOpen={showWhatIfModal} onClose={() => setShowWhatIfModal(false)} />
    </>
  );
};
