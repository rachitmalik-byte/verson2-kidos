import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useParentStore } from '@/stores/parentStore';
import { useAudioStore } from '@/stores/audioStore';
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
  Radio,
  BookOpen,
  User,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const DevDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { completedMissions, completeMission, resetProgress } = useProgressStore();
  const { discoveries, addDiscovery, resetDiscoveries } = useDiscoveryStore();
  const { child, setChild, pin, setPin, isSetUp, completeSetup } = useParentStore();
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

  const handleResetAll = () => {
    sounds.boing();
    resetProgress();
    resetDiscoveries();
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
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-900 text-amber-400 border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center font-black text-[10px] uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-all ring-4 ring-slate-900/30"
          title="Open Developer Testing Super-Hacks"
        >
          <Code className="w-4 h-4" />
          <span>DEV</span>
        </motion.button>
      )}

      {/* ── Slide-Out Super Hacks Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900 text-white z-50 shadow-2xl border-l-4 border-amber-400 flex flex-col overflow-hidden font-sans select-none"
            >
              {/* Header */}
              <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-400/20 text-amber-400 rounded-xl border border-amber-400/40">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-amber-400">PolyQuest Dev Console</h3>
                    <p className="text-[11px] text-slate-400">Testing Hacks & Route Fast-Travel</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Hack Tools */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                {/* 1. Global Fast Travel Navigation */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-2.5">
                    🚀 Fast Travel (Routes)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Role Selection', path: '/' },
                      { name: 'Chapter Hub Map', path: '/chapter-hub' },
                      { name: 'Chapter 3 Intro', path: '/chapter/3' },
                      { name: 'Field Journal', path: '/discovery-book' },
                      { name: 'Parent PIN Gate', path: '/parent/pin' },
                      { name: 'Parent Dashboard', path: '/parent/dashboard' },
                      { name: 'Parent Setup', path: '/parent/setup' },
                    ].map((route) => (
                      <button
                        key={route.path}
                        onClick={() => {
                          sounds.pop();
                          voiceAssistant.stop();
                          navigate(route.path);
                          setIsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-left font-bold truncate flex items-center justify-between cursor-pointer"
                      >
                        <span>{route.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Jump to Any Mission (1-13) */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-2.5">
                    🔬 Jump to Mission
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                    {missions.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          sounds.pop();
                          voiceAssistant.stop();
                          navigate(`/chapter/3/mission/${m.number}`);
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700 text-left font-extrabold truncate cursor-pointer transition-colors"
                      >
                        M{m.number}: {m.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Progression Super Hacks */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-2.5">
                    ⚡ Progression Cheats
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleUnlockAll}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unlock All Missions</span>
                    </button>

                    <button
                      onClick={handleResetAll}
                      className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset All Progress</span>
                    </button>
                  </div>
                </div>

                {/* 4. Audio & Voice Studio */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-2.5">
                    🎙️ Audio & Voice Testing
                  </span>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Sound FX:</span>
                      <button
                        onClick={toggleSfx}
                        className={`px-3 py-1 rounded-lg font-black text-xs ${
                          isSfxMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {isSfxMuted ? 'Muted' : 'Enabled'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Voice / TTS:</span>
                      <button
                        onClick={toggleTts}
                        className={`px-3 py-1 rounded-lg font-black text-xs ${
                          isTtsMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {isTtsMuted ? 'Muted' : 'Enabled'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => sounds.pop()}
                        className="px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
                      >
                        Pop
                      </button>
                      <button
                        onClick={() => sounds.splash()}
                        className="px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
                      >
                        Splash
                      </button>
                      <button
                        onClick={() => sounds.success()}
                        className="px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
                      >
                        Success
                      </button>
                      <button
                        onClick={() => sounds.fanfare()}
                        className="px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
                      >
                        Fanfare
                      </button>
                      <button
                        onClick={() => handleTestTts('Hello young scientist! Welcome to PolyQuest!')}
                        className="px-2.5 py-1 bg-violet-600 rounded-lg hover:bg-violet-500 font-bold cursor-pointer"
                      >
                        Test Voice 🔊
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Live State Viewer */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-2">
                    📊 Live Storage Cache Inspector
                  </span>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                    <div>Scientist: {child?.name || 'Not Set'} (Grade {child?.grade || '5'})</div>
                    <div>Completed: {completedMissions.length} / 13</div>
                    <div>Discoveries: {discoveries.length} / {materials.length}</div>
                    <div>Parent Setup: {isSetUp ? 'Complete' : 'Pending'} (PIN: {pin || 'None'})</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 font-bold">
                Dev Drawer is only visible during development / QA testing
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
