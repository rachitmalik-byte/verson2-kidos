
import cottonZoomGif from '@/assets/videos/cotton_zoom_microstructure.gif';
import nylonZoomGif from '@/assets/videos/nylon_zoom_microstructure.gif';
import silkZoomGif from '@/assets/videos/silk_zoom_microstructure.gif';
import plasticZoomGif from '@/assets/videos/plastic_zoom_microstructure.gif';
import polyesterZoomGif from '@/assets/videos/polyester_zoom_weave.gif';
import woolZoomGif from '@/assets/videos/wool_zoom_fibers.gif';
import rubberZoomGif from '@/assets/videos/tire_rubber_crosslink.gif';

const SPECIMEN_GIF_MAP: Record<string, string> = {
  'ch-01': cottonZoomGif,
  'ch-02': cottonZoomGif,
  'ch-03': nylonZoomGif,
  'ch-04': polyesterZoomGif,
  'ch-05': plasticZoomGif,
  'ch-06': woolZoomGif,
  'ch-07': plasticZoomGif,
  'ch-08': plasticZoomGif,
  'ch-09': rubberZoomGif,
  'ch-10': plasticZoomGif,
  'ch-11': rubberZoomGif,
  'ch-12': plasticZoomGif,
  'ch-13': nylonZoomGif,
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  ALL_COURSES_CATALOG,
  CourseChapter,
} from '@/data/masterCurriculum';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  FlaskConical,
  Volume2,
  Star,
  Home,
  CheckCircle2,
  Layers,
  Leaf,
  Droplets,
  Mountain,
  Zap,
} from 'lucide-react';

export const DiscoveryBook: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  const activeCourse = ALL_COURSES_CATALOG[selectedCourseIdx] || ALL_COURSES_CATALOG[0];
  const chapters: CourseChapter[] = activeCourse.chapters;
  const activeChapter: CourseChapter = chapters[selectedChapterIdx] || chapters[0];
  const journal = activeChapter.fieldJournal;

  const handleSelectCourse = (idx: number) => {
    sounds.pop();
    setSelectedCourseIdx(idx);
    setSelectedChapterIdx(0);
    voiceAssistant.stop();
  };

  const handleSelectChapter = (idx: number) => {
    sounds.pop();
    setSelectedChapterIdx(idx);
    voiceAssistant.stop();
  };

  const handlePronounce = () => {
    sounds.pop();
    voiceAssistant.speak(`${activeChapter.chapterTitle}. ${journal.fieldBrief}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100 p-3 sm:p-6 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden select-none">
      {/* ── Top Header ── */}
      <header className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200/80 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-20">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/subjects');
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Return to Subjects"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.pop();
              navigate(-1);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-600 shadow-[0_4px_0_#D97706] active:translate-y-1 text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Master Science Field Journal 📖
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500">
            CBSE Class 5 EVS • Individual Logs, DIY Experiments & Reflection Badges
          </p>
        </div>

        <AudioNavBarControls showProfile={false} />
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-6 relative z-10">
        {/* ── 4 Course Selector Tabs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ALL_COURSES_CATALOG.map((c, cIdx) => {
            const isSelected = selectedCourseIdx === cIdx;
            return (
              <button
                key={c.courseId}
                onClick={() => handleSelectCourse(cIdx)}
                className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-lg ring-4 ring-indigo-200'
                    : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {c.chapters.length} Chapters
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  {c.courseName}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Main Two-Column Journal View ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Chapter List for Selected Course */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-slate-200 shadow-md flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase text-slate-500 px-2">
              {activeCourse.syllabusCode} • Chapters
            </span>

            <div className="flex flex-col gap-2">
              {chapters.map((ch, idx) => {
                const isSelected = selectedChapterIdx === idx;
                return (
                  <button
                    key={ch.chapterId}
                    onClick={() => handleSelectChapter(idx)}
                    className={`p-3.5 rounded-2xl text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md border-2 border-amber-600'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ch.icon}</span>
                      <span className="line-clamp-1">{ch.chapterTitle}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 shrink-0">Ch {ch.chapterNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel: Individual Chapter Field Journal */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b-2 border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                {/* Animated Microscopic Specimen Scan */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-lg shrink-0 bg-black relative ring-2 ring-amber-200">
                  <img
                    src={SPECIMEN_GIF_MAP[activeChapter.chapterId] || cottonZoomGif}
                    alt={journal.journalTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 py-0.5 text-center text-[8px] font-mono font-black text-amber-300">
                    🔬 SCAN
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full inline-block mb-1.5">
                    {activeCourse.courseName} • Chapter {activeChapter.chapterNumber}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {journal.journalTitle} {activeChapter.icon}
                  </h2>
                </div>
              </div>

              <button
                onClick={handlePronounce}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 cursor-pointer self-start sm:self-center transition-all active:scale-95"
                title="Read Journal Brief Aloud"
              >
                <Volume2 className="w-5 h-5 text-indigo-600" />
              </button>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
              {journal.fieldBrief}
            </p>

            {/* Specimen Fact Matrix (3 Cards) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Core Specimen Discoveries</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {journal.specimenFacts.map((f, fIdx) => (
                  <div key={fIdx} className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-1.5 shadow-2xs">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-xs font-black text-amber-950">{f.title}</span>
                    <p className="text-[11px] font-bold text-slate-600 leading-snug">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hands-On DIY Science Experiment */}
            <div className="p-5 bg-indigo-50 rounded-3xl border-3 border-indigo-200 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <span>Hands-On Mini Experiment: {journal.handsOnExperiment.title}</span>
                </span>
              </div>

              <div className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <p>
                  <span className="text-indigo-950 font-black">🧪 Materials Needed: </span>
                  {journal.handsOnExperiment.materialsNeeded.join(', ')}
                </p>
                <p>
                  <span className="text-indigo-950 font-black">📋 Step-by-Step Procedure: </span>
                  {journal.handsOnExperiment.procedure}
                </p>
                <div className="p-3 bg-emerald-100 rounded-2xl text-xs font-black text-emerald-950 border border-emerald-300 mt-1">
                  Expected Result: {journal.handsOnExperiment.expectedObservation}
                </div>
              </div>
            </div>

            {/* Golden Science Law & Reflection Prompt */}
            <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 flex flex-col gap-1.5">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Explorer Reflection Badge Prompt:</span>
              </span>
              <p className="text-xs font-bold text-slate-700">
                {journal.journalReflectionBadgePrompt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
