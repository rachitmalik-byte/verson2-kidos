import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  X,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Gauge,
  Smile,
  Disc,
  PanelTop,
  Shirt,
  Gamepad2,
} from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';
import { bgmEngine, BGM_TRACKS } from '@/lib/bgmEngine';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { sounds } from '@/lib/sounds';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    isSfxMuted,
    isTtsMuted,
    isBgmMuted,
    bgmVolume,
    currentBgmTrack,
    ttsSpeed,
    ttsPitch,
    selectedVoiceName,
    toggleSfx,
    toggleTts,
    toggleBgm,
    setBgmVolume,
    setBgmTrack,
    setTtsSpeed,
    setTtsPitch,
    setSelectedVoiceName,
  } = useAudioStore();

  const {
    showWardrobeButton,
    showArcadeButton,
    showAiLabButton,
    toggleWardrobeButton,
    toggleArcadeButton,
    toggleAiLabButton,
    pipMode,
    setPipMode,
    showPipText,
    togglePipText,
  } = useUiSettingsStore();

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      setAvailableVoices(voiceAssistant.getAllVoices());
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTestVoice = () => {
    sounds.pop();
    voiceAssistant.speak('Hello young scientist! I am Pip, and I love exploring the science of materials with you!');
  };

  const handleResetDefaults = () => {
    sounds.pop();
    setTtsSpeed(0.94);
    setTtsPitch(1.08);
    setSelectedVoiceName('');
    setBgmVolume(0.35);
    setBgmTrack('playful-lab');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 bg-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-violet-400 shadow-2xl flex flex-col max-w-2xl w-full max-h-[90vh] overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs border border-white/30">
                  <Sliders className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Audio & Voice Studio 🎧
                  </h3>
                  <p className="text-xs text-violet-200 font-bold">
                    Customize Background Music, Voice Pace & Pitch
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-slate-50">
              {/* ════════════════════════════════════════════════════════════════════
                  SECTION 1: BGM JUKEBOX (8 UNCOPYRIGHTED TRACKS)
              ════════════════════════════════════════════════════════════════════ */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-black text-sm text-slate-800">Background Music (BGM Jukebox)</h4>
                      <p className="text-[11px] text-slate-500 font-bold">100% Royalty-Free & Uncopyrighted Synthesizer</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.pop();
                      toggleBgm();
                    }}
                    className={`px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      !isBgmMuted
                        ? 'bg-amber-100 border-2 border-amber-300 text-amber-900'
                        : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {!isBgmMuted ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
                    <span>{!isBgmMuted ? 'Music ON' : 'Music OFF'}</span>
                  </button>
                </div>

                {/* BGM Volume Slider */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-black text-slate-600">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isBgmMuted ? 0 : bgmVolume}
                    disabled={isBgmMuted}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setBgmVolume(val);
                      if (isBgmMuted && val > 0) toggleBgm();
                    }}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-black text-amber-600 w-10 text-right">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>

                {/* 8 Track Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {BGM_TRACKS.map((t) => {
                    const isSelected = currentBgmTrack === t.id && !isBgmMuted;

                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          sounds.pop();
                          setBgmTrack(t.id);
                          if (isBgmMuted) toggleBgm();
                        }}
                        className={`p-3 rounded-2xl text-left border-2 flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-xl">{t.emoji}</span>
                          <div className="truncate">
                            <span className="font-black text-xs text-slate-800 block truncate">{t.name}</span>
                            <span className="text-[10px] text-amber-700 font-bold block truncate">{t.genre} • {t.bpm} BPM</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-end gap-0.5 h-4 shrink-0">
                            <span className="w-1 bg-amber-500 rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
                            <span className="w-1 bg-amber-600 rounded-full animate-[bounce_0.6s_infinite_300ms] h-4" />
                            <span className="w-1 bg-amber-500 rounded-full animate-[bounce_0.6s_infinite_200ms] h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════════
                  SECTION 2: VOICE & SPEECH STUDIO (PACE, PITCH & VOICE SELECTION)
              ════════════════════════════════════════════════════════════════════ */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-violet-600" />
                    <div>
                      <h4 className="font-black text-sm text-slate-800">Pip Voice & Speech Settings</h4>
                      <p className="text-[11px] text-slate-500 font-bold">Speed, Pitch & Natural Voice Selector</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.pop();
                      toggleTts();
                    }}
                    className={`px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      !isTtsMuted
                        ? 'bg-violet-100 border-2 border-violet-300 text-violet-900'
                        : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {!isTtsMuted ? <Mic className="w-4 h-4 text-violet-600" /> : <MicOff className="w-4 h-4" />}
                    <span>{!isTtsMuted ? 'Voice ON' : 'Voice OFF'}</span>
                  </button>
                </div>

                {/* Voice Pace / Speed Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-violet-500" />
                      <span>Speaking Speed (Pace):</span>
                    </span>
                    <span className="font-mono text-violet-700">{ttsSpeed.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">🐢 Slow</span>
                    <input
                      type="range"
                      min="0.75"
                      max="1.25"
                      step="0.03"
                      value={ttsSpeed}
                      onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                      className="flex-1 accent-violet-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-400">Fast 🚀</span>
                  </div>
                </div>

                {/* Voice Pitch Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-fuchsia-500" />
                      <span>Voice Pitch (Tone):</span>
                    </span>
                    <span className="font-mono text-fuchsia-700">{ttsPitch.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">Deeper</span>
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.03"
                      value={ttsPitch}
                      onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                      className="flex-1 accent-fuchsia-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-400">Playful / Higher</span>
                  </div>
                </div>

                {/* Installed Voice Selector */}
                {availableVoices.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-slate-700 block">Select Voice Profile:</span>
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => setSelectedVoiceName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border-2 border-slate-300 font-bold text-xs text-slate-800 bg-slate-50 focus:border-violet-500 outline-none"
                    >
                      <option value="">✨ Auto (Best Child-Friendly Natural Neural Voice)</option>
                      {availableVoices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Test Voice Button */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleTestVoice}
                    className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Voice 🔊</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                    title="Reset to Default Audio Settings"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════════
                  SECTION 3: TASKBAR & UI CUSTOMIZATION
              ════════════════════════════════════════════════════════════════════ */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                     <PanelTop className="w-5 h-5 text-sky-500" />
                     <div>
                       <h4 className="font-black text-sm text-slate-800">Taskbar UI Organization</h4>
                       <p className="text-[11px] text-slate-500 font-bold">Show or hide buttons on your top navigation bar</p>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Toggle Wardrobe */}
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-pink-600" />
                      <span className="text-xs font-black text-slate-700">Show Wardrobe</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                      checked={showWardrobeButton}
                      onChange={() => {
                        sounds.pop();
                        toggleWardrobeButton();
                      }}
                    />
                  </label>

                  {/* Toggle Arcade */}
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-slate-700">Show Arcade</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                      checked={showArcadeButton}
                      onChange={() => {
                        sounds.pop();
                        toggleArcadeButton();
                      }}
                    />
                  </label>

                  {/* Toggle AI Lab */}
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-black text-slate-700">Show AI Lab ✨</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                      checked={showAiLabButton}
                      onChange={() => {
                        sounds.pop();
                        toggleAiLabButton();
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════════
                  SECTION 4: PIP ASSISTANT PREFERENCES
              ════════════════════════════════════════════════════════════════════ */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                     <Smile className="w-5 h-5 text-emerald-500" />
                     <div>
                       <h4 className="font-black text-sm text-slate-800">Pip Assistant Style</h4>
                       <p className="text-[11px] text-slate-500 font-bold">Customize how Pip appears in missions</p>
                     </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Pip Mode Toggle */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => { sounds.pop(); setPipMode('floating'); }}
                      className={`flex-1 p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                        pipMode === 'floating'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Floating (Left Corner)
                    </button>
                    <button
                      onClick={() => { sounds.pop(); setPipMode('inline'); }}
                      className={`flex-1 p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                        pipMode === 'inline'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Inline (Inside Page)
                    </button>
                    <button
                      onClick={() => { sounds.pop(); setPipMode('hidden'); }}
                      className={`flex-1 p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                        pipMode === 'hidden'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Hide Pip
                    </button>
                  </div>

                  {/* Show Speech Text Toggle */}
                  <label className={`flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer transition-colors ${pipMode === 'hidden' ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-100'}`}>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700">Show Speech Bubbles</span>
                      <span className="text-[10px] text-slate-500 font-bold">Display text when Pip talks</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      checked={showPipText}
                      onChange={() => {
                        sounds.pop();
                        togglePipText();
                      }}
                      disabled={pipMode === 'hidden'}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t-2 border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Settings are saved automatically</span>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
