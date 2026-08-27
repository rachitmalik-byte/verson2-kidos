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
} from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { ScienceArcadeModal } from '@/features/arcade/ScienceArcadeModal';
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';

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

        {/* Desktop Visible Buttons */}
        <div className="hidden md:flex items-center gap-1.5">
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
            <span>Pip's Closet</span>
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

          {/* "Try It With Me" Guide */}
          <button
            onClick={() => {
              sounds.pop();
              startTryWithMe();
              navigate('/subjects');
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 border-2 border-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Launch Interactive Spotlight Walkthrough"
          >
            <Compass className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            <span>Try With Me 🪄</span>
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
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 right-3 z-50 bg-white/95 backdrop-blur-xl border-3 border-slate-200 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
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
              startTryWithMe();
              setIsMobileMenuOpen(false);
              navigate('/subjects');
            }}
            className="px-3 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 font-black text-xs flex items-center gap-2 text-left"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Try With Me 🪄</span>
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
    </>
  );
};
