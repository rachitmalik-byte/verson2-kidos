import { Box } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '@/stores/audioStore';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Coins,
  Shirt,
  Gamepad2,
  Menu,
  X,
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Compass,
  Home,
  CheckCircle2,
  Settings,
  Star,
  ChevronDown,
} from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { ScienceArcadeModal } from '@/features/arcade/ScienceArcadeModal';
import { ScanMyWorldModal } from '@/components/ai/ScanMyWorldModal';
import { WhatIfScienceSandboxModal } from '@/components/ai/WhatIfScienceSandboxModal';
import { AiScienceLabModal } from '@/components/ai/AiScienceLabModal';
import { ReadingLevelToggle } from '@/components/accessibility/ReadingLevelToggle';

import { useUiSettingsStore } from '@/stores/uiSettingsStore';

interface AudioNavBarControlsProps {
  className?: string;
  showProfile?: boolean;
  isMissionMode?: boolean;
}

export const MissionAudioControls: React.FC = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiLabModal, setShowAiLabModal] = useState(false);
  const { isSfxMuted, isBgmMuted, toggleBgm, toggleSfx } = useAudioStore();
  const { showAiLabButton } = useUiSettingsStore();

  const isAllMuted = isSfxMuted && isBgmMuted;

  const handleToggleSoundMobile = () => {
    sounds.pop();
    if (!isAllMuted) {
      if (!isSfxMuted) toggleSfx();
      if (!isBgmMuted) toggleBgm();
    } else {
      if (isSfxMuted) toggleSfx();
      if (isBgmMuted) toggleBgm();
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 select-none">
        {/* Reading Level Accessibility Switcher (Responsive) */}
        <ReadingLevelToggle />

        {/* Quick AI Science Lab Trigger (Tablet/Desktop) */}
        {showAiLabButton && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sounds.sparkle();
              setShowAiLabModal(true);
            }}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all whitespace-nowrap"
            title="Open Gemini AI Science Tools"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="hidden md:inline">AI Lab ✨</span>
          </motion.button>
        )}

        {/* Mobile: Consolidated Quick Mute Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleToggleSoundMobile}
          className={`flex sm:hidden p-1.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            !isAllMuted
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isAllMuted ? 'Mute Audio' : 'Unmute Audio'}
        >
          {!isAllMuted ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </motion.button>

        {/* Desktop / Tablet: Separate Quick Music Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            toggleBgm();
          }}
          className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border-2 items-center justify-center transition-all cursor-pointer ${
            !isBgmMuted
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isBgmMuted ? 'Mute Background Music' : 'Unmute Background Music'}
        >
          <Music className={`w-3.5 h-3.5 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
        </motion.button>

        {/* Desktop / Tablet: Separate Quick SFX Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            toggleSfx();
          }}
          className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border-2 items-center justify-center transition-all cursor-pointer ${
            !isSfxMuted
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isSfxMuted ? 'Mute Sound FX' : 'Unmute Sound FX'}
        >
          {!isSfxMuted ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </motion.button>

        {/* Settings Modal Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Audio & Narration Settings"
        >
          <Sliders className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <AiScienceLabModal isOpen={showAiLabModal} onClose={() => setShowAiLabModal(false)} />
    </>
  );
};

export const AudioNavBarControls: React.FC<AudioNavBarControlsProps> = ({
  className = '',
  showProfile = true,
  isMissionMode = false,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [showArcadeModal, setShowArcadeModal] = useState(false);
  const [showAiLabHubModal, setShowAiLabHubModal] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const { isSfxMuted, isBgmMuted, toggleSfx, toggleBgm } = useAudioStore();
  const credits = useProgressStore((state) => state.credits);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const { showWardrobeButton, showArcadeButton, showAiLabButton } = useUiSettingsStore();

  if (isMissionMode) {
    return <MissionAudioControls />;
  }

  return (
    <>
      <div className={`flex items-center gap-1.5 shrink-0 select-none ${className}`}>
        {/* Profile & Action Tools (Only rendered when showProfile is true) */}
        {showProfile && (
          <>
            {/* Reading Level Accessibility Switcher */}
            <div className="hidden sm:block">
              <ReadingLevelToggle />
            </div>

            {/* 1. PolyCredits Balance Badge */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              id="navbar-credits-btn"
              onClick={() => {
                sounds.pop();
                setShowClosetModal(true);
              }}
              className="px-2.5 py-1 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
              title="PolyCredits • Click to open Wardrobe"
            >
              <Coins className="w-3.5 h-3.5 text-yellow-600 animate-bounce" />
              <span className="font-mono">{credits}</span>
              <span className="text-[10px] text-yellow-700">🪙</span>
            </motion.button>

            {/* 2. AI Science Lab Button */}
            {showAiLabButton && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="navbar-ai-lab-btn"
                onClick={() => {
                  sounds.sparkle();
                  setShowAiLabHubModal(true);
                }}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
                title="Open Gemini AI Science Lab"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span className="hidden sm:inline">AI Lab ✨</span>
              </motion.button>
            )}

            {/* 3. Pip's Wardrobe */}
            {showWardrobeButton && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="navbar-closet-btn"
                onClick={() => {
                  sounds.pop();
                  setShowClosetModal(true);
                }}
                className="hidden md:flex px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-900 font-bold text-xs items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
                title="Dress Up Pip with Outfits & Accessories"
              >
                <Shirt className="w-3.5 h-3.5 text-pink-600" />
                <span>Wardrobe</span>
              </motion.button>
            )}

            {/* 4. Science Arcade */}
            {showArcadeButton && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="navbar-arcade-btn"
                onClick={() => {
                  sounds.pop();
                  setShowArcadeModal(true);
                }}
                className="hidden lg:flex px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
                title="Play Mini Games"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Arcade</span>
              </motion.button>
            )}
          </>
        )}

        {/* 5. Sound & Music Icon Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sounds.pop();
              toggleBgm();
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              !isBgmMuted
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title="Toggle Music"
          >
            <Music className={`w-3.5 h-3.5 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sounds.pop();
              toggleSfx();
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              !isSfxMuted
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title="Toggle Sound Effects"
          >
            {!isSfxMuted ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </motion.button>

          {/* Settings Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sounds.pop();
              setShowSettingsModal(true);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            title="Open Audio & Speech Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>


      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <PipClosetModal isOpen={showClosetModal} onClose={() => setShowClosetModal(false)} />
      <ScienceArcadeModal isOpen={showArcadeModal} onClose={() => setShowArcadeModal(false)} />
      <AiScienceLabModal isOpen={showAiLabHubModal} onClose={() => setShowAiLabHubModal(false)} />
          </>
  );
};
