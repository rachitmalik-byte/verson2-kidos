import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useParentStore } from '@/stores/parentStore';
import { useAudioStore } from '@/stores/audioStore';
import { usePipStore } from '@/stores/pipStore';
import { useFXStore } from '@/stores/fxStore';
import { Pip } from '@/components/pip/Pip';
import { PipWardrobeShopModal, PIP_OUTFITS, PIP_HEADWEAR } from '@/components/wardrobe/PipWardrobeShopModal';
import { missions } from '@/data/missions';
import { materials } from '@/data/materials';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, Code, Coins, Compass, Droplets, ExternalLink, FlaskConical, Gem, Home, Layers, Leaf, Play, PlusCircle, RotateCcw, Shield, Shirt, Sparkles, Unlock, User, UserCheck, Volume2, VolumeX, Wand2, X } from 'lucide-react';

export const DevDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/teacher-studio') return null;

  const pipStoreState = usePipStore((s) => s.state);
  const setPipState = usePipStore((s) => s.setState);
  const pipSpeak = usePipStore((s) => s.speak);

  const {
    completedMissions,
    completeMission,
    resetProgress,
    credits,
    addCredits,
    equippedOutfit,
    equippedHeadwear,
    equipOutfit,
    equipHeadwear,
    unlockedOutfits,
    unlockedHeadwear,
    unlockItem,
    startTryWithMe,
    endTryWithMe,
  } = useProgressStore();

  const { discoveries, addDiscovery, resetDiscoveries } = useDiscoveryStore();
  const { child, setChild, pin, setPin, isSetUp, completeSetup, reset: resetParent } = useParentStore();
  const { isSfxMuted, isTtsMuted, toggleSfx, toggleTts } = useAudioStore();

  const handleUnlockAllCurriculum = () => {
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
    PIP_OUTFITS.forEach((o) => unlockItem('outfit', o.id, 0));
    PIP_HEADWEAR.forEach((h) => unlockItem('headwear', h.id, 0));
    addCredits(500);
  };

  const handleAddCredits = (amount: number) => {
    sounds.sparkle();
    addCredits(amount);
  };

  const handleSignUpFreshStudent = () => {
    sounds.success();
    resetProgress();
    resetDiscoveries();
    setChild({
      name: 'Aarav (Grade 5)',
      grade: '5',
      interests: ['science', 'space', 'robotics', 'inventions', 'animals', 'water'],
      avatar: '🔬',
    });
    setPin('1234');
    completeSetup();
    setIsOpen(false);
    navigate('/subjects');
  };

  const handleQuickSetupChild = () => {
    sounds.success();
    setChild({
      name: 'Aarav',
      grade: '5',
      interests: ['space', 'robotics', 'science', 'inventions', 'water'],
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

  return (
    <>
      {/* Dev Toggle Floating Button (Bottom Right) */}
      <button
        onClick={() => {
          sounds.pop();
          setIsOpen(true);
        }}
        className="fixed bottom-4 right-4 z-40 p-2.5 bg-slate-950/90 hover:bg-slate-900 text-amber-400 border-2 border-amber-400/80 rounded-2xl shadow-xl flex items-center gap-1.5 font-mono text-xs font-black cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Open Developer Super-Hacks Drawer"
      >
        <Code className="w-4 h-4 text-amber-400" />
        <span>DEV</span>
      </button>

      {/* Wardrobe Modal */}
      <PipWardrobeShopModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
      />

      {/* Slide-in Dev Drawer Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-screen max-w-md bg-slate-950 text-slate-100 h-full overflow-y-auto border-l-4 border-amber-400 p-6 flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-black text-amber-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Developer Super-Hacks ⚡
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5 flex-1 text-xs font-bold">
                  {/* ── 0. QUICK TEST PROFILE SIGNUP (0% FRESH PROGRESS) ── */}
                  <div className="bg-gradient-to-br from-emerald-950 to-slate-900 p-4 rounded-2xl border-2 border-emerald-400 shadow-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-black uppercase flex items-center gap-1.5 text-xs">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>Instant Profile Sign-Up</span>
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 rounded-full text-[10px] font-black uppercase">
                        For Testing
                      </span>
                    </div>

                    <button
                      onClick={handleSignUpFreshStudent}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <span>🎓 Sign Up Sample Student (0% Fresh Progress)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          handleUnlockAllCurriculum();
                          handleUnlockAllSkins();
                          setChild({
                            name: 'Aarav (Master)',
                            grade: '5',
                            interests: ['science', 'space', 'robotics'],
                            avatar: '👑',
                          });
                          setPin('1234');
                          completeSetup();
                          setIsOpen(false);
                          navigate('/subjects');
                        }}
                        className="py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-xl font-black cursor-pointer text-center active:scale-95"
                      >
                        <span>👑 100% Complete</span>
                      </button>

                      <button
                        onClick={() => {
                          handleResetAll();
                          setIsOpen(false);
                          navigate('/');
                        }}
                        className="py-2 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 rounded-xl font-black cursor-pointer text-center active:scale-95"
                      >
                        <span>🔄 Reset All / Logout</span>
                      </button>
                    </div>
                  </div>

                  {/* ── 1. WALLET & COINS ── */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-amber-300 font-black uppercase flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>Science Coins Wallet</span>
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
                        className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl font-black cursor-pointer flex items-center justify-center gap-1 shadow-md active:scale-95"
                      >
                        <Gem className="w-3.5 h-3.5" />
                        <span>Max 9999 💎</span>
                      </button>
                    </div>
                  </div>

                  {/* ── 2. WARDROBE & 12 SKINS UNLOCK ── */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-pink-500/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-pink-300 font-black uppercase flex items-center gap-1.5">
                        <Shirt className="w-4 h-4 text-pink-400" />
                        <span>Mascot Wardrobe ({PIP_OUTFITS.length} Outfits)</span>
                      </span>
                      <span className="text-[10px] text-pink-400">
                        {unlockedOutfits.length} Unlocked
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleUnlockAllSkins}
                        className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-black cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Unlock All 12 Outfits 🥼</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsWardrobeOpen(true);
                        }}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black cursor-pointer shadow-md"
                      >
                        Open Dressing Room ✨
                      </button>
                    </div>

                    {/* Quick Outfit Switcher Pills */}
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                      {PIP_OUTFITS.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => {
                            sounds.sparkle();
                            equipOutfit(o.id);
                            voiceAssistant.speak(`Equipped ${o.name}!`);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black border flex items-center gap-1 cursor-pointer ${
                            equippedOutfit === o.id
                              ? 'bg-pink-600 border-pink-400 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span>{o.icon}</span>
                          <span className="truncate max-w-[80px]">{o.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── 3. CURRICULUM THEME WARP JUMPS ── */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/40">
                    <span className="text-indigo-300 font-black uppercase block mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Instant Theme Warps</span>
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsOpen(false);
                          navigate('/theme/water/hub');
                        }}
                        className="p-2.5 bg-sky-950/80 hover:bg-sky-900 border border-sky-600/50 text-sky-300 rounded-xl text-left font-black cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-sky-400" />
                          <span>Water Theme 🌊</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">2D Water Cycle Sim</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsOpen(false);
                          navigate('/theme/shelter/hub');
                        }}
                        className="p-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600/50 text-indigo-300 rounded-xl text-left font-black cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Shelter Hub 🏔️</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Ladakh & Everest</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsOpen(false);
                          navigate('/theme/1/hub');
                        }}
                        className="p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 rounded-xl text-left font-black cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Living World 🌿</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Super Senses</span>
                      </button>

                      <button
                        onClick={() => {
                          sounds.pop();
                          setIsOpen(false);
                          navigate('/chapter-hub');
                        }}
                        className="p-2.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-300 rounded-xl text-left font-black cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                          <span>Materials Lab 🧪</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Synthetic Fibers</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        sounds.pop();
                        setIsOpen(false);
                        navigate('/teacher-studio');
                      }}
                      className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>No-Code Teacher Studio 👩‍🏫</span>
                    </button>
                  </div>

                  {/* ── 4. MASCOT STATE STUDIO ── */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-violet-500/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-violet-300 font-black uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span>Mascot State Tester</span>
                      </span>
                      <span className="px-2 py-0.5 bg-violet-400/20 text-violet-300 rounded-full text-[10px] font-black uppercase">
                        {pipStoreState}
                      </span>
                    </div>

                    {/* Mascot Preview & Tap Interactivity */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-4">
                      <Pip size="lg" interactive={true} />
                      <div className="text-[11px] text-slate-400">
                        <p className="text-violet-300 font-bold">✨ Tap Pip to talk & react!</p>
                        <p>Tracks mouse pupils & expresses emotions.</p>
                      </div>
                    </div>

                    {/* State Grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'idle', label: 'Idle 🧘' },
                        { id: 'curious', label: 'Curious 🧐' },
                        { id: 'teaching', label: 'Teaching 🪄' },
                        { id: 'thinking', label: 'Thinking 🤔' },
                        { id: 'correct', label: 'Correct 🎉' },
                        { id: 'celebrating', label: 'Celebrate 🏆' },
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
                  </div>

                  {/* ── 5. CURRICULUM UNLOCK ALL & RESET ── */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 font-black uppercase block mb-2.5 flex items-center gap-1.5">
                      <Unlock className="w-4 h-4 text-emerald-400" />
                      <span>Curriculum Actions</span>
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={handleUnlockAllCurriculum}
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
                  </div>
                </div>
              </motion.div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
