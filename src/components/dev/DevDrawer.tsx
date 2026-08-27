import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useParentStore } from '@/stores/parentStore';
import { useAudioStore } from '@/stores/audioStore';
import { usePipStore } from '@/stores/pipStore';
import { Pip } from '@/components/pip/Pip';
import { missions } from '@/data/missions';
import { materials } from '@/data/materials';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Code,
  X,
  Play,
  Unlock,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Coins,
  Shirt,
  Compass,
  User,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Gem,
} from 'lucide-react';

export const DevDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const pipStoreState = usePipStore((s) => s.state);
  const setPipState = usePipStore((s) => s.setState);
  const pipSpeak = usePipStore((s) => s.speak);

  const {
    completedMissions,
    completeMission,
    resetProgress,
    credits,
    addCredits,
    unlockedOutfits,
    unlockedHeadwear,
    unlockItem,
    startTryWithMe,
    endTryWithMe,
  } = useProgressStore();

  const { discoveries, addDiscovery, resetDiscoveries } = useDiscoveryStore();
  const { child, setChild, pin, setPin, isSetUp, completeSetup, reset: resetParent } = useParentStore();
  const { isSfxMuted, isTtsMuted, toggleSfx, toggleTts } = useAudioStore();

  const handleUnlockAll = () => {
    sounds.fanfare();
    missions.forEach((m) => completeMission(m.id));
    materials.forEach((mat) => {
      addDiscovery({
        materialId: mat.id,
        discoveredAt: Date.now(),
        properties: mat.properties.map((p) => p.name),
        uses: mat.uses,
        scienceWord: mat.type === 'natural' ? 'Natural material' : 'Synthetic material',
      });
    });
  };

  const handleUnlockAllSkins = () => {
    sounds.fanfare();
    const allOutfits = ['lab-coat', 'astronaut', 'winter-parka', 'gold-champion', 'detective'];
    const allHats = ['goggles', 'visor', 'grad-cap', 'crown', 'party-hat'];
    allOutfits.forEach((id) => unlockItem('outfit', id, 0));
    allHats.forEach((id) => unlockItem('headwear', id, 0));
    addCredits(500);
  };

  const handleAddCredits = (amount: number) => {
    sounds.sparkle();
    addCredits(amount);
  };

  const handleQuickSetupChild = () => {
    sounds.success();
    setChild({
      name: 'Aarav',
      grade: '5',
      interests: ['space', 'robotics', 'science', 'inventions'],
      avatar: '🧪',
    });
    setPin('1234');
    completeSetup();
  };

  const handleResetAll = () => {
    sounds.boing();
    resetProgress();
    resetDiscoveries();
    resetParent();
  };

  const handleTestTts = (text: string) => {
    voiceAssistant.speak(text);
  };

  return (
    <>
      {/* ── Collapsed Floating "DEV" Circle Badge ── */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.pop();
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-[99990] w-12 h-12 rounded-full bg-slate-950 text-amber-400 border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center font-black text-[10px] uppercase tracking-wider cursor-pointer hover:bg-slate-900 transition-all ring-4 ring-slate-900/40"
          title="Open Developer Testing Super-Hacks & Currency Cheats"
        >
          <Code className="w-4 h-4" />
          <span>DEV</span>
        </motion.button>
      )}

      {/* ── Slide-Out Super Hacks Drawer ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[100000] flex justify-end">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                />

                {/* Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="relative z-10 w-full max-w-md bg-slate-950 text-slate-100 h-full overflow-y-auto border-l-4 border-amber-400 p-6 flex flex-col font-sans shadow-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <div className="flex items-center gap-2">
                      <Code className="w-6 h-6 text-amber-400" />
                      <h2
                        className="text-xl font-black text-amber-400 tracking-tight"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        Developer Super-Hacks ⚡
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1 text-xs font-bold">
                    {/* ── SECTION 1: CURRENCY & WALLET CHEATS ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-amber-400" />
                          <span>PolyCredits Cheats</span>
                        </span>
                        <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 rounded-full font-black">
                          {credits} 🪙
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddCredits(100)}
                          className="py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+100 Coins 🪙</span>
                        </button>

                        <button
                          onClick={() => handleAddCredits(9999)}
                          className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1 shadow-md active:scale-95"
                        >
                          <Gem className="w-3.5 h-3.5" />
                          <span>Unlimited 9999 💎</span>
                        </button>
                      </div>
                    </div>

                    {/* ── SECTION 2: WARDROBE & SKINS UNLOCK ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-pink-500/40">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-pink-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Shirt className="w-4 h-4 text-pink-400" />
                          <span>Pip Skins & Wardrobe</span>
                        </span>
                        <span className="text-[10px] text-pink-400">
                          {unlockedOutfits.length} Outfits / {unlockedHeadwear.length} Hats
                        </span>
                      </div>

                      <button
                        onClick={handleUnlockAllSkins}
                        className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-black cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Unlock All 10 Outfits & Hats 🥼👑</span>
                      </button>
                    </div>

                    {/* ── SECTION 3: MASCOT STUDIO PLAYGROUND & STATE MACHINE TESTER ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-violet-500/40">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-violet-300 font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          <span>Mascot State Studio</span>
                        </span>
                        <span className="px-2 py-0.5 bg-violet-400/20 text-violet-300 rounded-full text-[10px] font-black uppercase">
                          State: {pipStoreState}
                        </span>
                      </div>

                      {/* Live Character Preview */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-4 mb-3">
                        <Pip size="lg" interactive={true} />
                        <div className="text-[11px] text-slate-400 font-medium">
                          <p className="text-violet-300 font-bold">✨ Tap Pip to interact!</p>
                          <p>Supports mouse cursor eyes & expressive ear mechanics.</p>
                        </div>
                      </div>

                      {/* State Switcher Grid */}
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {[
                          { id: 'idle', label: 'Idle 🧘' },
                          { id: 'curious', label: 'Curious 🧐' },
                          { id: 'teaching', label: 'Teaching 🪄' },
                          { id: 'listening', label: 'Listening 👂' },
                          { id: 'thinking', label: 'Thinking 🤔' },
                          { id: 'correct', label: 'Correct 🎉' },
                          { id: 'try_again', label: 'Try Again 💡' },
                          { id: 'celebrating', label: 'Celebrate 🏆' },
                          { id: 'high_five', label: 'High-Five ✋' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            onClick={() => {
                              sounds.pop();
                              setPipState(st.id as any);
                            }}
                            className={`p-2 rounded-xl text-[11px] font-black border text-center transition-all cursor-pointer ${
                              pipStoreState === st.id
                                ? 'bg-violet-600 border-violet-400 text-white shadow-md'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          sounds.pop();
                          pipSpeak("I am Pip, your science learning companion! Let's discover materials together!");
                        }}
                        className="w-full py-2 bg-violet-900/60 hover:bg-violet-800 text-violet-200 border border-violet-700/50 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1 text-[11px]"
                      >
                        <span>Test Lip-Sync Speech 🗣️</span>
                      </button>
                    </div>

                    {/* ── SECTION 4: "TRY IT WITH ME" SPOTLIGHT CONTROLS ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40">
                      <span className="text-amber-300 font-black uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span>"Try It With Me" Spotlight Engine</span>
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            startTryWithMe();
                            setIsOpen(false);
                            navigate('/subjects');
                          }}
                          className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1 shadow-md active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Guide 🪄</span>
                        </button>

                        <button
                          onClick={() => {
                            sounds.pop();
                            endTryWithMe();
                          }}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>End Guide</span>
                        </button>
                      </div>
                    </div>

                    {/* ── SECTION 4: CURRICULUM UNLOCKS & WARPS ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                      <span className="text-amber-400 font-black uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                        <Unlock className="w-4 h-4" />
                        <span>Curriculum & Discoveries</span>
                      </span>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={handleUnlockAll}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Unlock All 13 Missions</span>
                        </button>

                        <button
                          onClick={handleResetAll}
                          className="py-2.5 px-4 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {missions.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              sounds.pop();
                              setIsOpen(false);
                              navigate(`/chapter/3/mission/${m.number}`);
                            }}
                            className={`p-2 rounded-xl text-[11px] font-black border text-center transition-all cursor-pointer ${
                              completedMissions.includes(m.id)
                                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            M{m.number}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── SECTION 5: PARENT ACCOUNT QUICK-INJECT ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-violet-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>Parent Profile State</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isSetUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isSetUp ? 'Registered ✓' : 'Unregistered ❌'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleQuickSetupChild}
                          className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black cursor-pointer shadow-md"
                        >
                          Auto-Register ("Aarav, Gr 5")
                        </button>
                        <button
                          onClick={() => {
                            sounds.pop();
                            resetParent();
                          }}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-black cursor-pointer"
                        >
                          Clear ID
                        </button>
                      </div>
                    </div>

                    {/* ── SECTION 6: AUDIO SOUNDBOARD TESTER ── */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                      <span className="text-slate-400 font-black uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>Audio Soundboard Tester</span>
                      </span>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <button
                          onClick={() => sounds.sparkle()}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-center cursor-pointer"
                        >
                          ✨ Sparkle
                        </button>
                        <button
                          onClick={() => sounds.fanfare()}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-center cursor-pointer"
                        >
                          🎺 Fanfare
                        </button>
                        <button
                          onClick={() => sounds.boing()}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-center cursor-pointer"
                        >
                          ⚡ Boing
                        </button>
                      </div>

                      <button
                        onClick={() => handleTestTts('Hello master scientist! Pip audio test is running perfectly!')}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                        <span>Test Pip TTS Voice</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Antigravity Developer Mode</span>
                    <span>v2.4.0</span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
