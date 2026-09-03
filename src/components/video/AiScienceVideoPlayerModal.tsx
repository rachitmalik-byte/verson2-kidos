import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiVideoStore } from '@/stores/aiVideoStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';
import {
  X,
  ExternalLink,
  Sparkles,
  Clock,
  Tv,
  Volume2,
  CheckCircle2,
  ListVideo,
  ChevronRight,
} from 'lucide-react';
import { aiVideoFinderService, ScienceVideo } from '@/services/aiVideoFinderService';

export const AiScienceVideoPlayerModal: React.FC = () => {
  const { isOpen, activeVideo, scannedTopicBadge, closeVideo, openVideoDirect } = useAiVideoStore();
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  if (!isOpen || !activeVideo) return null;

  const handleTimestampClick = (seconds: number) => {
    sounds.pop();
    setCurrentTimestamp(seconds);
  };

  const handleReadSummary = () => {
    sounds.pop();
    if (isNarrating) {
      voiceAssistant.stop();
      setIsNarrating(false);
      return;
    }

    const narration = `Here is what Pip found for you! ${activeVideo.title}. ${activeVideo.description}. Key things to watch for: ${activeVideo.whatToWatchFor.join('. ')}.`;
    setIsNarrating(true);
    voiceAssistant.speak(narration);
  };

  const handleClose = () => {
    sounds.pop();
    voiceAssistant.stop();
    setIsNarrating(false);
    setShowPlaylist(false);
    setCurrentTimestamp(0);
    closeVideo();
  };

  const allVideos = aiVideoFinderService.getAllCuratedVideos();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-4xl bg-slate-900 border-4 border-amber-400/80 rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden my-auto text-white relative"
        >
          {/* ── CINEMA TOP HEADER ── */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                <Tv className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-base sm:text-lg text-white leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Pip's AI Science Cinema
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Scanned: {scannedTopicBadge}</span>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                  Kid-Safe Educational YouTube Science Video
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.pop();
                  setShowPlaylist(!showPlaylist);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showPlaylist
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Browse All Science Videos"
              >
                <ListVideo className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Other Videos</span>
              </button>

              <button
                onClick={handleReadSummary}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isNarrating
                    ? 'bg-amber-400 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Pip Audio Narration"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 cursor-pointer transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── PLAYLIST DRAWER (TOGGLEABLE) ── */}
          {showPlaylist && (
            <div className="p-3 bg-slate-950/95 border-b border-slate-800 max-h-48 overflow-y-auto flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider px-2">
                All Chapter 1 & Mission Videos
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {allVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      openVideoDirect(vid);
                      setShowPlaylist(false);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                      activeVideo.id === vid.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <span className="truncate">{vid.title}</span>
                    <span className="text-[10px] text-slate-400 ml-2 shrink-0">{vid.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── MAIN CINEMA CONTENT AREA ── */}
          <div className="p-4 sm:p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
            {/* 16:9 Themed YouTube Player Stage */}
            <div className="w-full aspect-video shrink-0 rounded-2xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl relative">
              <iframe
                key={`${activeVideo.youtubeId}-${currentTimestamp}`}
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&start=${currentTimestamp}&modestbranding=1&playsinline=1`}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase tracking-wider">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Duration: {activeVideo.duration}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {activeVideo.title}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  {activeVideo.subtitle}
                </p>
              </div>

              {/* Direct YouTube Link Button */}
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.pop()}
                className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Interactive Jump Timestamps */}
            {activeVideo.timestamps && activeVideo.timestamps.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jump to Key Science Moment:</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeVideo.timestamps.map((ts, idx) => {
                    const minutes = Math.floor(ts.time / 60);
                    const seconds = ts.time % 60;
                    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleTimestampClick(ts.time)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                          currentTimestamp === ts.time
                            ? 'bg-amber-400 text-slate-950 border-amber-400 scale-103 shadow-md'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span>{ts.icon}</span>
                        <span>{ts.label}</span>
                        <span className="text-[10px] text-amber-400 bg-slate-950/60 px-1.5 py-0.2 rounded-md font-mono">
                          {timeStr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pip's AI "What to Watch For" Coach Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 rounded-2xl flex flex-col sm:flex-row items-start gap-4">
              <div className="shrink-0 flex sm:flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-900/80 border border-indigo-400 p-1 flex items-center justify-center shadow-inner">
                  <Pip mood="explaining" size="sm" />
                </div>
                <span className="text-[10px] font-black text-indigo-300">Pip's Notes</span>
              </div>

              <div className="flex-1 space-y-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                  🧐 What to Watch For:
                </span>
                <ul className="space-y-1.5">
                  {activeVideo.whatToWatchFor.map((point, index) => (
                    <li key={index} className="text-xs font-bold text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-indigo-900/50">
                  <p className="text-[11px] font-bold text-indigo-200 italic">
                    💡 Golden Science Law: {activeVideo.keyTakeaways[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── CINEMA FOOTER ── */}
          <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="hidden sm:inline">
              PolyQuest AI Science Video Assistant • Class 5 CBSE
            </span>
            <button
              onClick={handleClose}
              className="ml-auto px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
            >
              Back to Experiment 🔬
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
