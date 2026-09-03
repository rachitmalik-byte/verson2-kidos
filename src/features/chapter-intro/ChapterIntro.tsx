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
      <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] relative overflow-x-hidden flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
        {/* ── Top Expedition Bar ── */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-5 edtech-card p-3 sm:p-4">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/chapter-hub');
            }}
            className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Expedition Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-mono font-bold border border-blue-200/70 inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Theme 6 • Materials Science</span>
            </span>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/discovery-book');
            }}
            className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Field Journal</span>
          </button>
        </div>

        {/* ── Chapter Selection Pills ── */}
        <div className="w-full max-w-5xl flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span>{ch.icon}</span>
                <span>Ch {ch.chapterNumber}: {ch.chapterTitle}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Multi-Step Interactive Intro Card ── */}
        <div className="w-full max-w-5xl relative z-20 mb-8">
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
                accentBorderColor="border-blue-500/30"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PersistentAppShell>
  );
};
