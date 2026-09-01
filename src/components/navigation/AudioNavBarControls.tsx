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
} from 'lucide-react';
import { AudioSettingsModal } from '@/components/audio/AudioSettingsModal';
import { PipClosetModal } from '@/features/closet/PipClosetModal';
import { ScienceArcadeModal } from '@/features/arcade/ScienceArcadeModal';
import { ScanMyWorldModal } from '@/components/ai/ScanMyWorldModal';
import { WhatIfScienceSandboxModal } from '@/components/ai/WhatIfScienceSandboxModal';
import { AiScienceLabModal } from '@/components/ai/AiScienceLabModal';

interface AudioNavBarControlsProps {
  className?: string;
  showProfile?: boolean;
  isMissionMode?: boolean;
}

/**
 * 🚀 Upgraded Mission Audio & Tools Bar (Compact, Zero-Clutter, Premium Frosted Glass)
 */
export const MissionAudioControls: React.FC = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiLabModal, setShowAiLabModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const { isSfxMuted, isBgmMuted, toggleBgm, toggleSfx } = useAudioStore();

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0 select-none">
        
        {/* Quick AI Science Lab Trigger */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sounds.sparkle();
            setShowAiLabModal(true);
          }}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all whitespace-nowrap"
          title="Open Gemini AI Science Tools"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span className="hidden sm:inline">AI Lab ✨</span>
        </motion.button>

        {/* Quick Music Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            toggleBgm();
          }}
          className={`p-1.5 sm:p-2 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            !isBgmMuted
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isBgmMuted ? 'Mute Background Music' : 'Unmute Background Music'}
        >
          <Music className={`w-3.5 h-3.5 ${!isBgmMuted ? 'text-rose-600' : 'text-slate-400'}`} />
        </motion.button>

        {/* Quick SFX Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            toggleSfx();
          }}
          className={`p-1.5 sm:p-2 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            !isSfxMuted
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
          title={!isSfxMuted ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
        >
          {!isSfxMuted ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </motion.button>

        {/* Settings Modal */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-black text-xs flex items-center gap-1 cursor-pointer transition-all"
          title="Audio Settings"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Audio</span>
        </motion.button>
      </div>

      <AiScienceLabModal
        isOpen={showAiLabModal}
        onClose={() => setShowAiLabModal(false)}
        onOpenScan={() => setShowScanModal(true)}
        onOpenWhatIf={() => setShowWhatIfModal(true)}
      />
      <ScanMyWorldModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
      <WhatIfScienceSandboxModal isOpen={showWhatIfModal} onClose={() => setShowWhatIfModal(false)} />
      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};

/**
 * 🌟 Upgraded Global Navigation Bar Controls (Frosted Glass, Micro-interactions, Full Responsive Drawer)
 */
export const AudioNavBarControls: React.FC<AudioNavBarControlsProps> = ({
  className = '',
  showProfile = true,
  isMissionMode = false,
}) => {
  const navigate = useNavigate();
  // Guidebook navigation helper
  const location = useLocation();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [showArcadeModal, setShowArcadeModal] = useState(false);
  const [showAiLabHubModal, setShowAiLabHubModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isSfxMuted, isBgmMuted, toggleSfx, toggleBgm } = useAudioStore();
  const credits = useProgressStore((state) => state.credits);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  if (isMissionMode) {
    return <MissionAudioControls />;
  }

  return (
    <>
      <div className={`flex items-center gap-1.5 sm:gap-2 select-none ${className}`}>
                {/* 1. PolyCredits Balance Badge */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          id="navbar-credits-btn"
          onClick={() => {
            sounds.pop();
            setShowClosetModal(true);
          }}
          className="px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
          title="PolyCredits • Click to open Wardrobe"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
          <span className="font-mono">{credits}</span>
          <span className="hidden sm:inline text-[10px] text-amber-700">🪙</span>
        </motion.button>

        {/* 2. Desktop Quick Nav Tools */}
        <div className="hidden xl:flex items-center gap-1.5">
          {/* AI Science Superpowers Hub */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            id="navbar-ai-lab-btn"
            onClick={() => {
              sounds.sparkle();
              setShowAiLabHubModal(true);
            }}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all shrink-0 whitespace-nowrap"
            title="Open Gemini AI Science Lab"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>AI Science Lab ✨</span>
          </motion.button>

          {/* Pip's Wardrobe Customizer */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            id="navbar-closet-btn"
            onClick={() => {
              sounds.pop();
              setShowClosetModal(true);
            }}
            className="px-3 py-1.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 text-pink-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
            title="Dress Up Pip with Outfits & Accessories"
          >
            <Shirt className="w-3.5 h-3.5 text-pink-600" />
            <span>Wardrobe</span>
          </motion.button>

          {/* Science Arcade Games */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            id="navbar-arcade-btn"
            onClick={() => {
              sounds.pop();
              setShowArcadeModal(true);
            }}
            className="px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all shrink-0 whitespace-nowrap"
            title="Play Mini Games"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Arcade</span>
          </motion.button>
        </div>

        {/* 3. Fast Sound & Music Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
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
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
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
          </motion.button>
        </div>

        {/* 4. Audio Settings Studio Trigger (Desktop) */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          id="navbar-audio-studio-btn"
          onClick={() => {
            sounds.pop();
            setShowSettingsModal(true);
          }}
          className="hidden lg:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 items-center gap-1 font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
          title="Audio & Voice Studio Settings"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden xl:inline">Settings</span>
        </motion.button>

        {/* 5. Mobile Responsive Menu Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.pop();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 cursor-pointer shrink-0"
          title="More Tools"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Mobile Dropdown Tools Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden fixed top-16 right-4 left-4 z-50 bg-white/95 backdrop-blur-xl border-3 border-sky-300 shadow-2xl rounded-3xl p-4 flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-500 uppercase">Quick Navigation & Tools</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.sparkle();
                  setIsMobileMenuOpen(false);
                  setShowAiLabHubModal(true);
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Science Lab</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  setIsMobileMenuOpen(false);
                  setShowClosetModal(true);
                }}
                className="p-3 rounded-2xl bg-pink-50 text-pink-900 border border-pink-200 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
              >
                <Shirt className="w-4 h-4 text-pink-600" />
                <span>Wardrobe</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  setIsMobileMenuOpen(false);
                  setShowArcadeModal(true);
                }}
                className="p-3 rounded-2xl bg-indigo-50 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
              >
                <Gamepad2 className="w-4 h-4 text-indigo-600" />
                <span>Arcade</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  setIsMobileMenuOpen(false);
                  navigate('/discovery-book');
                }}
                className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Journal ({discoveries.length})</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Sound & Audio Options:</span>
              <button
                onClick={() => {
                  sounds.pop();
                  setIsMobileMenuOpen(false);
                  setShowSettingsModal(true);
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-black text-xs flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Studio</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Modals */}
      <AiScienceLabModal
        isOpen={showAiLabHubModal}
        onClose={() => setShowAiLabHubModal(false)}
        onOpenScan={() => setShowScanModal(true)}
        onOpenWhatIf={() => setShowWhatIfModal(true)}
      />
      <PipClosetModal isOpen={showClosetModal} onClose={() => setShowClosetModal(false)} />
      <ScienceArcadeModal isOpen={showArcadeModal} onClose={() => setShowArcadeModal(false)} />
      <ScanMyWorldModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
      <WhatIfScienceSandboxModal isOpen={showWhatIfModal} onClose={() => setShowWhatIfModal(false)} />
      <AudioSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};
