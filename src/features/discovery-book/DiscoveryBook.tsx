import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { materials } from '@/data/materials';
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
  Tag,
  Search,
  Filter,
} from 'lucide-react';

// Animated Micro-Zoom GIFs
import cottonZoomGif from '@/assets/videos/cotton_zoom_microstructure.gif';
import nylonZoomGif from '@/assets/videos/nylon_zoom_microstructure.gif';
import silkZoomGif from '@/assets/videos/silk_zoom_microstructure.gif';
import plasticZoomGif from '@/assets/videos/plastic_zoom_microstructure.gif';
import polyesterZoomGif from '@/assets/videos/polyester_zoom_weave.gif';
import woolZoomGif from '@/assets/videos/wool_zoom_fibers.gif';
import rubberZoomGif from '@/assets/videos/tire_rubber_crosslink.gif';
import treeLatexZoomGif from '@/assets/videos/tree_latex_zoom_polymers.gif';

const MATERIAL_GIF_MAP: Record<string, string> = {
  cotton: cottonZoomGif,
  wool: woolZoomGif,
  silk: silkZoomGif,
  nylon: nylonZoomGif,
  polyester: polyesterZoomGif,
  plastic: plasticZoomGif,
  acrylic: woolZoomGif,
  'natural-rubber': treeLatexZoomGif,
  'synthetic-rubber': rubberZoomGif,
  rubber: rubberZoomGif,
};

const CHAPTER_GIF_MAP: Record<string, string> = {
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

export const DiscoveryBook: React.FC = () => {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  // Top Mode: 'materials' vs 'chapters'
  const [journalMode, setJournalMode] = useState<'materials' | 'chapters'>('materials');

  // Materials View State
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<'all' | 'natural' | 'synthetic'>('all');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('cotton');

  // Chapters View State
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // Materials Filtered
  const filteredMaterials = useMemo(() => {
    if (selectedMaterialFilter === 'all') return materials;
    return materials.filter((m) => m.type === selectedMaterialFilter);
  }, [selectedMaterialFilter]);

  const selectedMaterial = useMemo(() => {
    return materials.find((m) => m.id === selectedMaterialId) || materials[0];
  }, [selectedMaterialId]);

  // Active Chapter
  const activeCourse = ALL_COURSES_CATALOG[selectedCourseIdx] || ALL_COURSES_CATALOG[0];
  const chapters: CourseChapter[] = activeCourse.chapters;
  const activeChapter: CourseChapter = chapters[selectedChapterIdx] || chapters[0];
  const journal = activeChapter.fieldJournal;

  const handleSelectMaterial = (id: string) => {
    sounds.pop();
    setSelectedMaterialId(id);
    const mat = materials.find((m) => m.id === id);
    if (mat) {
      voiceAssistant.speak(`${mat.name}, a ${mat.type} material. ${mat.funFact || ''}`);
    }
  };

  const handlePronounceMaterial = () => {
    sounds.pop();
    voiceAssistant.speak(`${selectedMaterial.name}. Category: ${selectedMaterial.type} ${selectedMaterial.category}. ${selectedMaterial.funFact || ''}`);
  };

  const handlePronounceChapter = () => {
    sounds.pop();
    voiceAssistant.speak(`${activeChapter.chapterTitle}. ${journal.fieldBrief}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100 p-3 sm:p-6 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden select-none">
      {/* ── Top Header (Spacious, Single-Line, Zero-Wrapping) ── */}
      <header className="w-full max-w-7xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200/80 px-4 sm:px-6 py-3.5 shadow-xl flex items-center justify-between gap-4 mb-6 z-20">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/subjects');
            }}
            className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Return to Subjects"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.pop();
              navigate(-1);
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-600 shadow-[0_3px_0_#D97706] active:translate-y-0.5 text-slate-950 font-black text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Center: Title & Subtitle (Clean Single-Line with Truncation Protection) */}
        <div className="text-center min-w-0 flex-1 px-2 hidden sm:block">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
            <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 whitespace-nowrap truncate" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Master Science Field Journal 📖
            </h1>
          </div>
          <p className="text-[10px] md:text-[11px] font-bold text-slate-500 whitespace-nowrap truncate">
            CBSE Class 5 EVS • Material Specimens, Animated Micro-Zooms & DIY Labs
          </p>
        </div>

        {/* Right: Status & Compact Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xl:flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-indigo-900 font-black text-xs shadow-xs whitespace-nowrap">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span>{discoveries.length} / {materials.length} Discovered</span>
          </div>
          <AudioNavBarControls showProfile={false} />
        </div>
      </header>

      {/* ── Mode Switcher: Materials vs Chapters ── */}
      <div className="w-full max-w-6xl flex justify-center mb-6 z-20">
        <div className="bg-white/95 p-1.5 rounded-2xl border-3 border-indigo-300 shadow-md flex items-center gap-1.5">
          <button
            onClick={() => {
              sounds.pop();
              setJournalMode('materials');
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              journalMode === 'materials'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🔬 Material Specimens & Micro-Zooms ({materials.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setJournalMode('chapters');
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              journalMode === 'chapters'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span>📖 Chapter Logs & DIY Experiments</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODE 1: MATERIAL SPECIMENS & ANIMATED MICRO-ZOOM GALLERY
      ════════════════════════════════════════════════════════════════ */}
      {journalMode === 'materials' && (
        <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 z-20 mb-12">
          {/* Left Panel: Material Specimen Shelf (5 cols) */}
          <div className="md:col-span-5 bg-white/95 backdrop-blur-md p-5 rounded-3xl border-4 border-slate-200 shadow-xl flex flex-col h-[620px]">
            {/* Filter Pills */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4 text-xs font-black gap-1 border border-slate-200">
              {(['all', 'natural', 'synthetic'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sounds.pop();
                    setSelectedMaterialFilter(tab);
                  }}
                  className={`flex-1 py-2 rounded-xl capitalize transition-all cursor-pointer ${
                    selectedMaterialFilter === tab
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? 'All Materials' : tab}
                </button>
              ))}
            </div>

            {/* List of Specimens */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredMaterials.map((mat) => {
                const unlocked = discoveries.some((d) => d.materialId === mat.id);
                const isSelected = selectedMaterialId === mat.id;
                const gif = MATERIAL_GIF_MAP[mat.id] || cottonZoomGif;

                return (
                  <motion.button
                    key={mat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMaterial(mat.id)}
                    className={`w-full p-3 rounded-2xl border-3 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200'
                        : unlocked
                        ? 'bg-white border-emerald-200 hover:bg-emerald-50/40'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {/* Animated Micro-Thumbnail */}
                    <div className="w-14 h-14 rounded-2xl bg-black overflow-hidden border-2 border-slate-300 flex-shrink-0 shadow-inner relative">
                      <img src={gif} alt={mat.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-mono text-center text-white">
                        {mat.image}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm text-slate-800 truncate">{mat.name}</h3>
                        {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {mat.type} • {mat.category}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Specimen Showcase Card (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-4 border-indigo-300 shadow-2xl flex flex-col justify-between h-[620px] overflow-y-auto">
            <div>
              {/* Header with live animated microscope ocular lens */}
              {/* ── PROMINENT FULL-HERO LIVE ANIMATED MICRO-ZOOM SHOWCASE ── */}
              <div className="w-full mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          selectedMaterial.type === 'natural'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}
                      >
                        {selectedMaterial.type} Material
                      </span>
                      <span className="text-xs font-bold text-slate-500 capitalize">
                        ({selectedMaterial.category})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <h2
                        className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        {selectedMaterial.name} {selectedMaterial.image}
                      </h2>
                      <button
                        onClick={handlePronounceMaterial}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-sky-100 text-sky-600 transition-colors cursor-pointer"
                        title="Hear Pip read material properties"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Massive Animated Microscope Screen (High-Definition Zoom) */}
                <div className="relative w-full h-72 sm:h-80 rounded-3xl bg-slate-950 border-4 border-indigo-400 overflow-hidden shadow-2xl ring-4 ring-indigo-200/60 group flex items-center justify-center">
                  <img
                    src={MATERIAL_GIF_MAP[selectedMaterial.id] || cottonZoomGif}
                    alt={selectedMaterial.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Optical Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none border border-sky-400/20 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-sky-400/20 absolute" />
                    <div className="h-full w-[1px] bg-sky-400/20 absolute" />
                    <div className="w-40 h-40 rounded-full border border-sky-400/30 absolute" />
                  </div>

                  {/* Top-Right Practical Scale Bar */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-400/40 text-[11px] font-mono font-black text-sky-300">
                    🔬 Continuous Optical Zoom (1x ➔ 1,500x)
                  </div>

                  {/* Bottom HUD Tag */}
                  <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md rounded-2xl py-1.5 px-3 text-center text-xs font-mono font-black text-white flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE MICROSCOPIC LOOP</span>
                    </div>
                    <span className="text-amber-300 text-[11px]">Continuous Smooth Magnification 🎬</span>
                  </div>
                </div>
              </div>

              {/* Superpower Properties Grid */}
              <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Scientific Superpower Properties</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMaterial.properties.map((prop, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200/80 flex items-start gap-3 shadow-xs"
                    >
                      <span className="text-2xl flex-shrink-0">{prop.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{prop.name}</h4>
                        <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                          {prop.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Everyday Real-World Uses */}
              <div className="mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2.5">
                  Everyday Real-World Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.uses.map((use, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black rounded-xl shadow-xs"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Science Fun Fact Footer */}
            {selectedMaterial.funFact && (
              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center gap-3 mt-4 shadow-sm">
                <span className="text-3xl">💡</span>
                <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                  <span className="font-black">Science Fun Fact:</span> {selectedMaterial.funFact}
                </p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODE 2: CHAPTER LOGS & DIY HANDS-ON EXPERIMENTS
      ════════════════════════════════════════════════════════════════ */}
      {journalMode === 'chapters' && (
        <div className="w-full max-w-6xl flex flex-col gap-6 relative z-10">
          {/* 4 Course Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ALL_COURSES_CATALOG.map((course, idx) => {
              const isSelected = idx === selectedCourseIdx;
              return (
                <button
                  key={course.courseId}
                  onClick={() => {
                    sounds.pop();
                    setSelectedCourseIdx(idx);
                    setSelectedChapterIdx(0);
                  }}
                  className={`p-3.5 rounded-2xl border-3 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-lg scale-102 ring-2 ring-indigo-300'
                      : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${course.themeGradient} flex items-center justify-center text-white shadow-xs shrink-0`}>
                    {course.courseId === 'theme-senses' && <Leaf className="w-5 h-5" />}
                    {course.courseId === 'theme-materials' && <Layers className="w-5 h-5" />}
                    {course.courseId === 'theme-water' && <Droplets className="w-5 h-5" />}
                    {course.courseId === 'theme-shelter' && <Mountain className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-indigo-600 block uppercase">Course {idx + 1}</span>
                    <span className="text-xs font-black text-slate-900 truncate block leading-tight">{course.courseName}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chapter Grid & Journal Entry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Chapter List (4 cols) */}
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-slate-200 shadow-md flex flex-col gap-2 h-fit">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                Chapters in this Course:
              </span>
              <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
                {chapters.map((ch, cIdx) => {
                  const isSelected = cIdx === selectedChapterIdx;
                  return (
                    <button
                      key={ch.chapterId}
                      onClick={() => {
                        sounds.pop();
                        setSelectedChapterIdx(cIdx);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left font-black text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{ch.icon}</span>
                        <span className="line-clamp-1">{ch.chapterTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80 shrink-0">Ch {ch.chapterNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Panel: Individual Chapter Field Journal (8 cols) */}
            <div className="lg:col-span-8 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b-2 border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  {/* Animated Microscopic Specimen Scan */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-lg shrink-0 bg-black relative ring-2 ring-amber-200">
                    <img
                      src={CHAPTER_GIF_MAP[activeChapter.chapterId] || cottonZoomGif}
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
                  onClick={handlePronounceChapter}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
