import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  GUIDEBOOK_CHAPTERS,
  GuidebookChapter,
} from '@/data/guidebookData';
import {
  Search,
  BookOpen,
  ArrowLeft,
  Volume2,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  Bookmark,
  Printer,
  Compass,
  Zap,
  HelpCircle,
  History,
  Home,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';

// Specimen image asset imports
import rawCottonImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import sheepWoolImg from '@/assets/images/specimens/sheep_wool_fleece.jpg';
import petBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import cottonAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyMeltingImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import nylonRopeImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import parachuteImg from '@/assets/images/experiments/parachute_canopy_jump.jpg';
import bakeliteImg from '@/assets/images/experiments/bakelite_pan_handle.jpg';
import pvcCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import soilAppleImg from '@/assets/images/decay/soil_apple_rotted.jpg';
import soilPlasticImg from '@/assets/images/decay/soil_plastic_450yrs.jpg';
import antsSugarImg from '@/assets/images/theme1/ants_trail_sugar.jpg';
import eagleMouseImg from '@/assets/images/theme1/eagle_view_mouse.jpg';
import eagleLandscapeImg from '@/assets/images/theme1/eagle_view_landscape.jpg';
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import soilAppleDay1Img from '@/assets/images/decay/soil_apple_day1.jpg';
import boilingKettleImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import acrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import nylonThreadImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import lightbulbImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import golcondaPersianImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';
import golcondaFortImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import golcondaFatehImg from '@/assets/images/theme-shelter/golconda_fateh_darwaza.jpg';
import bakeliteCleanImg from '@/assets/images/experiments/bakelite_handle_clean.jpg';
import plastic100yrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import copperWireImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pashminaMicroImg from '@/assets/images/theme-shelter/pashmina_microscope_macro.jpg';
import everestSummitImg from '@/assets/images/theme-shelter/everest_summit_mountaineer.jpg';
import steelCableImg from '@/assets/images/experiments/steel_cable_holding.jpg';
import timberWoodImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import wood450yrsImg from '@/assets/images/decay/wood_450yrs.jpg';

const LOCAL_ASSET_MAP: Record<string, string> = {
  'raw_cotton_boll.jpg': rawCottonImg,
  'polyester_raincoat_waterproof.jpg': polyesterRaincoatImg,
  'sheep_wool_fleece.jpg': sheepWoolImg,
  'pet_water_bottle_molding.jpg': petBottleImg,
  'cotton_burning_ash.jpg': cottonAshImg,
  'polyester_melting_bead.jpg': polyMeltingImg,
  'nylon_rope_heavy_weight.jpg': nylonRopeImg,
  'parachute_canopy_jump.jpg': parachuteImg,
  'bakelite_pan_handle.jpg': bakeliteImg,
  'pvc_insulated_cable.jpg': pvcCableImg,
  'soil_apple_rotted.jpg': soilAppleImg,
  'soil_plastic_450yrs.jpg': soilPlasticImg,
  'ants_trail_sugar.jpg': antsSugarImg,
  'eagle_view_mouse.jpg': eagleMouseImg,
  'eagle_view_landscape.jpg': eagleLandscapeImg,
  'silkworm_silk_cocoon.jpg': silkwormCocoonImg,
  'soil_apple_day1.jpg': soilAppleDay1Img,
  'boiling_tea_kettle_steam.jpg': boilingKettleImg,
  'synthetic_acrylic_yarn.jpg': acrylicYarnImg,
  'nylon_thread_spool.jpg': nylonThreadImg,
  'lightbulb_glowing_bright.jpg': lightbulbImg,
  'golconda_persian_wheel.jpg': golcondaPersianImg,
  'golconda_fort_bastions.jpg': golcondaFortImg,
  'golconda_fateh_darwaza.jpg': golcondaFatehImg,
  'bakelite_handle_clean.jpg': bakeliteCleanImg,
  'plastic_100yrs.jpg': plastic100yrsImg,
  'copper_wire_macro.jpg': copperWireImg,
  'pashmina_microscope_macro.jpg': pashminaMicroImg,
  'everest_summit_mountaineer.jpg': everestSummitImg,
  'steel_cable_holding.jpg': steelCableImg,
  'natural_wood_timber.jpg': timberWoodImg,
  'wood_450yrs.jpg': wood450yrsImg,
};

export const DigitalGuidebook: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | 'materials' | 'senses' | 'water' | 'shelter'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(GUIDEBOOK_CHAPTERS[0].id);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pq_guidebook_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isStudyPrintMode, setIsStudyPrintMode] = useState(false);

  const filteredChapters = useMemo(() => {
    return GUIDEBOOK_CHAPTERS.filter((ch) => {
      const matchesCourse = selectedCourseFilter === 'all' || ch.courseId === selectedCourseFilter;
      if (!matchesCourse) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      return (
        ch.title.toLowerCase().includes(q) ||
        ch.syllabusRef.toLowerCase().includes(q) ||
        ch.bigQuestion.toLowerCase().includes(q) ||
        ch.caseStudy.title.toLowerCase().includes(q) ||
        ch.caseStudy.discoverer.toLowerCase().includes(q) ||
        ch.coreConcepts.some((c) => c.heading.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q)) ||
        ch.vocabulary.some((v) => v.term.toLowerCase().includes(q) || v.definition.toLowerCase().includes(q))
      );
    });
  }, [selectedCourseFilter, searchQuery]);

  const activeChapter: GuidebookChapter = useMemo(() => {
    return (
      GUIDEBOOK_CHAPTERS.find((ch) => ch.id === selectedChapterId) ||
      filteredChapters[0] ||
      GUIDEBOOK_CHAPTERS[0]
    );
  }, [selectedChapterId, filteredChapters]);

  const toggleBookmark = (id: string) => {
    sounds.pop();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pq_guidebook_bookmarks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleReadAloud = (text: string) => {
    sounds.pop();
    voiceAssistant.speak(text);
  };

  const handlePrint = () => {
    sounds.fanfare();
    window.print();
  };

  const handleLaunchLab = (ch: GuidebookChapter) => {
    sounds.fanfare();
    voiceAssistant.stop();
    if (ch.courseId === 'materials') {
      navigate(`/chapter/3/mission/${ch.chapterNumber}`);
    } else if (ch.courseId === 'senses') {
      navigate(`/theme/1/chapter/${ch.chapterNumber}`);
    } else if (ch.courseId === 'water') {
      navigate(`/theme/water/chapter/${ch.chapterNumber}`);
    } else if (ch.courseId === 'shelter') {
      navigate(`/theme/shelter/chapter/${ch.chapterNumber}`);
    }
  };

  return (
    <div className={`min-h-screen w-full font-sans select-none ${
      isStudyPrintMode
        ? 'bg-white text-slate-900 p-6'
        : 'bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100 p-3 sm:p-6 md:p-8 flex flex-col items-center'
    }`}>
      {/* ── Top App Header Bar ── */}
      {!isStudyPrintMode && (
        <header className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200/80 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-20">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
              title="Return to All Subjects"
            >
              <Home className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate(-1);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-600 shadow-[0_4px_0_#D97706] active:translate-y-1 text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Digital Science Guidebook 📖
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500">
              CBSE Class 5 EVS • Comprehensive Concepts, Verified Micrographs & Case Studies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStudyPrintMode(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Switch to Print / PDF Study Mode"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Print Notes</span>
            </button>
            <AudioNavBarControls showProfile={false} />
          </div>
        </header>
      )}

      {/* Print Mode Header */}
      {isStudyPrintMode && (
        <div className="w-full flex items-center justify-between pb-4 border-b-2 border-slate-300 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">PolyQuest Digital Guidebook — Printable Study Mode</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Page (Ctrl + P)</span>
            </button>
            <button
              onClick={() => setIsStudyPrintMode(false)}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
            >
              Exit Print View
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-6 relative z-10">
        {/* ── Search & Course Filter Controls ── */}
        {!isStudyPrintMode && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 rounded-3xl border-3 border-slate-200 shadow-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 19 chapters, scientific laws, case studies, or vocabulary..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Course Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All (19)', icon: '📚' },
                { id: 'materials', label: 'Materials (6)', icon: '🧪' },
                { id: 'senses', label: 'Super Senses (4)', icon: '🐾' },
                { id: 'water', label: 'Water (4)', icon: '🌊' },
                { id: 'shelter', label: 'Shelter (5)', icon: '🏔️' },
              ].map((pill) => {
                const isSelected = selectedCourseFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => {
                      sounds.pop();
                      setSelectedCourseFilter(pill.id as any);
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Two-Column Main Guidebook Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          {!isStudyPrintMode && (
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-slate-200 shadow-md flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-500">
                  Chapter Directory ({filteredChapters.length})
                </span>
                {bookmarkedIds.length > 0 && (
                  <span className="text-[10px] font-black text-amber-600 flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-amber-400" />
                    <span>{bookmarkedIds.length} Saved</span>
                  </span>
                )}
              </div>

              {filteredChapters.length === 0 ? (
                <div className="p-6 text-center text-xs font-bold text-slate-500">
                  No chapters match "{searchQuery}". Try searching for another topic like "polyester", "ants", or "stepwells"!
                </div>
              ) : (
                filteredChapters.map((ch) => {
                  const isSelected = activeChapter.id === ch.id;
                  const isBookmarked = bookmarkedIds.includes(ch.id);

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        sounds.pop();
                        setSelectedChapterId(ch.id);
                        voiceAssistant.stop();
                      }}
                      className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md border-2 border-amber-600 ring-2 ring-amber-200'
                          : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{ch.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black line-clamp-1">{ch.title}</span>
                          <span className="text-[10px] font-bold opacity-75 truncate">{ch.courseName} • Ch {ch.chapterNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isBookmarked && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        )}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Right Main Panel: Comprehensive Chapter Study Guide */}
          <div className={`${isStudyPrintMode ? 'col-span-12' : 'lg:col-span-8'} bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 border-indigo-200 shadow-2xl flex flex-col gap-6`}>
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-100 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-950 rounded-full text-xs font-black uppercase">
                    {activeChapter.syllabusRef} • Chapter {activeChapter.chapterNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {activeChapter.courseName}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {activeChapter.title} {activeChapter.icon}
                </h1>
              </div>

              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={() => toggleBookmark(activeChapter.id)}
                  className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 ${
                    bookmarkedIds.includes(activeChapter.id)
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={bookmarkedIds.includes(activeChapter.id) ? 'Bookmarked' : 'Bookmark Chapter'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(activeChapter.id) ? 'fill-amber-500' : ''}`} />
                </button>

                <button
                  onClick={() => handleReadAloud(`${activeChapter.title}. Big question: ${activeChapter.bigQuestion}`)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 cursor-pointer active:scale-95 transition-all"
                  title="Listen to Chapter Overview"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Big Guiding Question Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-start gap-3 shadow-2xs">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-black uppercase text-amber-700 tracking-wider mb-0.5">
                  The Big Science Question
                </span>
                <span>{activeChapter.bigQuestion}</span>
              </div>
            </div>

            {/* ── Verified Photographic Specimen Visuals (2 Cards) ── */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Verified Visual Specimens & Micrographs</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeChapter.images.map((img, iIdx) => {
                  const imgSrc = LOCAL_ASSET_MAP[img.assetKey] || img.webFallbackUrl;
                  return (
                    <div
                      key={iIdx}
                      className="rounded-3xl border-2 border-slate-200 overflow-hidden bg-slate-950 flex flex-col shadow-md group"
                    >
                      <div className="w-full aspect-video relative overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/80 text-white rounded-lg text-[10px] font-mono font-bold backdrop-blur-xs">
                          {img.magnificationOrType}
                        </span>
                      </div>
                      <div className="p-3 bg-white border-t border-slate-100 flex-1">
                        <p className="text-[11px] font-bold text-slate-700 leading-snug">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Core Conceptual Deep-Dive ── */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Conceptual Knowledge Foundation</span>
              </span>

              <div className="flex flex-col gap-3">
                {activeChapter.coreConcepts.map((concept, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        {concept.heading}
                      </h3>
                      <button
                        onClick={() => handleReadAloud(`${concept.heading}. ${concept.explanation}`)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
                        title="Listen to Section"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      {concept.explanation}
                    </p>

                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-[11px] font-black text-emerald-950 flex items-start gap-1.5 shadow-2xs mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{concept.keyTakeaway}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Real-World Historical Case Study ── */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-World Discovery Case Study ({activeChapter.caseStudy.yearOrEra})</span>
                </span>
                <span className="text-[10px] font-mono bg-indigo-800/80 px-2 py-0.5 rounded-md text-indigo-200">
                  {activeChapter.caseStudy.discoverer}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-amber-300">
                {activeChapter.caseStudy.title}
              </h3>

              <p className="text-xs font-bold text-slate-200 leading-relaxed">
                {activeChapter.caseStudy.narrative}
              </p>

              <div className="p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-700/60 text-[11px] font-black text-indigo-200 mt-1">
                ⭐ Scientific Impact: {activeChapter.caseStudy.significance}
              </div>
            </div>

            {/* ── Scientific Vocabulary & Glossary ── */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Key Scientific Vocabulary & Terms</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeChapter.vocabulary.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col gap-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950">{vocab.term}</span>
                      {vocab.pronunciation && (
                        <span className="text-[9px] font-mono text-slate-500">/{vocab.pronunciation}/</span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 leading-snug">{vocab.definition}</p>
                    <span className="text-[10px] font-bold text-indigo-800 italic mt-0.5">"{vocab.example}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Quick Revision Flashcard & Memory Sheet ── */}
            <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-300 flex flex-col gap-2 shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Memory Sheet & Quick Revision Flashcard</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {activeChapter.quickRevisionPoints.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── "Try This at Home!" Safe Science Mini-Lab ── */}
            <div className="p-5 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-emerald-600" />
                  <span>Try This at Home! Safe Science Mini-Lab</span>
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md">
                  Difficulty: {activeChapter.miniLab.difficulty}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {activeChapter.miniLab.title}
              </h4>

              <div className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <p>
                  <span className="text-emerald-950 font-black">🧪 Materials Needed: </span>
                  {activeChapter.miniLab.materials.join(', ')}
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-emerald-950 font-black">📋 Step-by-Step Instructions:</span>
                  {activeChapter.miniLab.instructions.map((ins, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-mono font-bold">{iIdx + 1}.</span>
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-300 text-[11px] font-black text-emerald-950 mt-1">
                  🔬 Scientific Principle: {activeChapter.miniLab.scientificPrinciple}
                </div>
              </div>
            </div>

            {/* ── Pip's Golden Exam Tip ── */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-2 border-amber-500 shadow-md flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block mb-0.5">
                  ⭐ Pip's Golden Exam Tip for CBSE Class 5
                </span>
                <p className="text-xs font-black leading-snug">
                  {activeChapter.pipExamTip}
                </p>
              </div>
            </div>

            {/* ── Launch Interactive Mission Lab Action Button ── */}
            <div className="flex justify-center pt-2 print:hidden">
              <button
                onClick={() => handleLaunchLab(activeChapter)}
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl cursor-pointer active:scale-95 transition-all flex items-center gap-2.5"
              >
                <span>🚀 Launch Interactive {activeChapter.title} Lab ➔</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
