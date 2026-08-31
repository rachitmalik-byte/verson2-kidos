import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { MATERIALS_COURSE_CHAPTERS } from '@/data/masterCurriculum';
import { InteractiveChapterIntroCard } from '@/components/curriculum/InteractiveChapterIntroCard';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 via-indigo-100 to-amber-100 relative overflow-x-hidden flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 font-sans">
      {/* ── Top Navigation Bar ── */}
      <div className="w-full max-w-5xl flex items-center justify-between z-30 mb-6 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border-2 border-amber-300 shadow-md">
        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/chapter-hub');
          }}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Chapter Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full shadow-xs">
            Things We Make & Do: Materials
          </span>
        </div>

        <button
          onClick={() => {
            sounds.pop();
            voiceAssistant.stop();
            navigate('/discovery-book');
          }}
          className="p-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Field Journal</span>
        </button>
      </div>

      {/* ── Chapter Selection Pills (Chapters 1 to 6) ── */}
      <div className="w-full max-w-5xl flex items-center gap-2 overflow-x-auto pb-3 mb-4 z-20">
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
              className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-400 border-2 border-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <InteractiveChapterIntroCard
              chapterData={activeChapter}
              onStartLab={handleStartLab}
              accentBorderColor="border-amber-400"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
