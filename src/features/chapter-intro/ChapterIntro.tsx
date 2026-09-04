import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { MATERIALS_COURSE_CHAPTERS } from '@/data/masterCurriculum';
import { InteractiveChapterIntroCard } from '@/components/curriculum/InteractiveChapterIntroCard';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { ArrowLeft, BookOpen, Compass } from 'lucide-react';

export const ChapterIntro: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  const activeChapter = MATERIALS_COURSE_CHAPTERS[selectedChapterIdx] || MATERIALS_COURSE_CHAPTERS[0];

  const handleStartLab = () => {
    sounds.fanfare();
    voiceAssistant.stop();
    navigate(`/chapter/3/mission/${activeChapter.chapterNumber}`);
  };

  return (
    <PersistentAppShell activeDestination="map">
      <div className="min-h-screen w-full bg-[#090d16] text-white relative overflow-x-hidden flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
        {/* Subtle Radial Ambient Lighting */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl flex flex-col gap-6 relative z-10">
          {/* ── Top Expedition Bar ── */}
          <div className="w-full flex items-center justify-between world-glass-dock p-3 sm:p-4 rounded-2xl">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/chapter-hub');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Expedition Hub</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-400/30 inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Theme 6 • Materials Science</span>
              </span>
            </div>

            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/discovery-book');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Field Journal</span>
            </button>
          </div>

          {/* ── Chapter Selection Pills ── */}
          <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MATERIALS_COURSE_CHAPTERS.map((ch, idx) => {
              const isSelected = selectedChapterIdx === idx;
              return (
                <button
                  key={ch.chapterId}
                  onClick={() => {
                    sounds.pop();
                    setSelectedChapterIdx(idx);
                    voiceAssistant.stop();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-cyan-400/40'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
                  }`}
                >
                  <span>{ch.icon}</span>
                  <span>Ch {ch.chapterNumber}: {ch.chapterTitle}</span>
                </button>
              );
            })}
          </div>

          {/* ── Main Multi-Step Interactive Intro Card ── */}
          <div className="w-full relative z-20 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.chapterId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <InteractiveChapterIntroCard
                  chapterData={activeChapter}
                  onStartLab={handleStartLab}
                  accentBorderColor="border-blue-500/40"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PersistentAppShell>
  );
};
