import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioStore } from '@/stores/audioStore';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Volume2, VolumeX, Mic, MicOff, Home, Music, Sliders, Coins, Shirt, Gamepad2, Compass } from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { ScienceArcadeModal } from '@/features/arcade/ScienceArcadeModal';
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';

interface AudioNavBarControlsProps {
  className?: string;
  showProfile?: boolean;
}

export const AudioNavBarControls: React.FC<AudioNavBarControlsProps> = ({
  className = '',
  showProfile = true,
}) => {
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [showArcadeModal, setShowArcadeModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const { isSfxMuted, isTtsMuted, isBgmMuted, toggleSfx, toggleTts, toggleBgm } = useAudioStore();
  const child = useParentStore((state) => state.child);
  const credits = useProgressStore((state) => state.credits);

  const handleHomeClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  return (
    <>
      <div className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${className}`}>
        {/* PolyCredits Balance Badge (Click to open Pip's Wardrobe) */}
        <button
          onClick={() => {
            sounds.pop();
            setShowClosetModal(true);
          }}
          className="px-2.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          title="PolyCredits Balance • Click to open Pip's Dressing Room"
        >
          <Coins className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{credits} 🪙</span>
        </button>

        {/* Pip's Closet & Wardrobe */}
        <button
          onClick={() => {
            sounds.pop();
            setShowClosetModal(true);
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-pink-100 hover:bg-pink-200 border-2 border-pink-300 text-pink-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
          title="Open Pip's Wardrobe to customize outfits & hats"
        >
          <Shirt className="w-4 h-4 text-pink-600" />
          <span className="hidden lg:inline">Pip's Closet</span>
        </button>

        {/* Science Arcade */}
        <button
          onClick={() => {
            sounds.pop();
            setShowArcadeModal(true);
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300 text-indigo-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
          title="Play Science Mini-Games in the Arcade"
        >
          <Gamepad2 className="w-4 h-4 text-indigo-600" />
          <span className="hidden lg:inline">Arcade</span>
        </button>

        {/* Trial Tour Guide */}
        <button
          onClick={() => {
            sounds.pop();
            setShowTutorialModal(true);
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-900 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
          title="Open First-Time Guided Trial Tour"
        >
          <Compass className="w-4 h-4 text-sky-600" />
          <span className="hidden lg:inline">Tour</span>
        </button>

        {/* BGM Music Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleBgm();
          }}
          className={`p-2 sm:px-2.5 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isBgmMuted
              ? 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isBgmMuted ? 'Mute Background Music' : 'Turn On Background Music'}
        >
          <Music className={`w-4 h-4 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
          <span className="hidden xl:inline">{!isBgmMuted ? 'Music' : 'Music Off'}</span>
        </button>

        {/* SFX Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleSfx();
          }}
          className={`p-2 sm:px-2.5 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isSfxMuted
              ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isSfxMuted ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
        >
          {!isSfxMuted ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden xl:inline">{!isSfxMuted ? 'SFX' : 'SFX Off'}</span>
        </button>

        {/* TTS Voice Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            toggleTts();
          }}
          className={`p-2 sm:px-2.5 sm:py-1.5 rounded-2xl border-2 flex items-center gap-1 font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
            !isTtsMuted
              ? 'bg-violet-100 border-violet-300 text-violet-900 hover:bg-violet-200'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isTtsMuted ? 'Mute Pip Voice' : 'Unmute Pip Voice'}
        >
          {!isTtsMuted ? <Mic className="w-4 h-4 text-violet-600" /> : <MicOff className="w-4 h-4" />}
          <span className="hidden xl:inline">{!isTtsMuted ? 'Voice' : 'Voice Off'}</span>
        </button>

        {/* Audio Studio Modal Trigger */}
        <button
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 flex items-center gap-1 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
          title="Open Audio & Voice Studio Settings (BGM Jukebox & Voice Speed)"
        >
          <Sliders className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Audio Studio</span>
        </button>

        {/* Profile / Home shortcut */}
        {showProfile && (
          <button
            onClick={handleHomeClick}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 flex items-center gap-1.5 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Click to return to Home"
          >
            <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
              {child?.name ? child.name.charAt(0).toUpperCase() : <Home className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden sm:inline font-black text-slate-800">{child?.name || 'Home'}</span>
          </button>
        )}
      </div>

      {/* Audio & Voice Settings Modal */}
      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Pip's Closet Modal */}
      <PipClosetModal isOpen={showClosetModal} onClose={() => setShowClosetModal(false)} />

      {/* Science Arcade Modal */}
      <ScienceArcadeModal isOpen={showArcadeModal} onClose={() => setShowArcadeModal(false)} />

      {/* First-Time Guided Tutorial Tour */}
      <FirstTimeTutorialOverlay isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} />
    </>
  );
};
