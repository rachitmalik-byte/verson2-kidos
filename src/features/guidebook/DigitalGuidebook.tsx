import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
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

  const renderContent = () => (
    <div className={`w-full max-w-6xl flex flex-col gap-6 relative z-10 ${isStudyPrintMode ? 'text-slate-900' : 'text-white'}`}>
      {/* Print Mode Header */}
      {isStudyPrintMode && (
        <div className="w-full flex items-center justify-between pb-4 border-b-2 border-slate-300 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">Kidos Digital Guidebook — Printable Study Mode</h1>
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

      {/* ── Sub-Navigation & Header Bar ── */}
      {!isStudyPrintMode && (
        <header className="w-full world-glass-dock p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              title="Return to Subjects"
            >
              <Home className="w-4 h-4" />
              <span>Worlds</span>
            </button>

            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate(-1);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg sm:text-xl font-display font-extrabold text-white">
                Digital Science Guidebook
              </h1>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Verified Micrographs, Scientific Laws & Case Studies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStudyPrintMode(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Switch to Print / PDF Study Mode"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Print Notes</span>
            </button>
          </div>
        </header>
      )}

      {/* ── Search & Course Filter Controls ── */}
      {!isStudyPrintMode && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 19 chapters, scientific laws, or vocabulary..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Course Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-cyan-400/40'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
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
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                Chapter Directory ({filteredChapters.length})
              </span>
              {bookmarkedIds.length > 0 && (
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-amber-400" />
                  <span>{bookmarkedIds.length} Saved</span>
                </span>
              )}
            </div>

            {filteredChapters.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No chapters match "{searchQuery}".
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
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-600/30 border border-cyan-300'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{ch.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold line-clamp-1">{ch.title}</span>
                        <span className="text-[10px] opacity-75 truncate">{ch.courseName} • Ch {ch.chapterNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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
        <div className={`${isStudyPrintMode ? 'col-span-12' : 'lg:col-span-8'} ${isStudyPrintMode ? 'bg-white text-slate-900 border border-slate-300' : 'bg-slate-900/90 border border-white/15 text-white'} backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-6`}>
          {/* Chapter Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-mono font-bold">
                  Chapter {activeChapter.chapterNumber}
                </span>
                <span className="text-xs text-slate-400">
                  {activeChapter.courseName}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
                {activeChapter.title} {activeChapter.icon}
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start">
              <button
                onClick={() => toggleBookmark(activeChapter.id)}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  bookmarkedIds.includes(activeChapter.id)
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/15'
                }`}
                title={bookmarkedIds.includes(activeChapter.id) ? 'Bookmarked' : 'Bookmark Chapter'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(activeChapter.id) ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => handleReadAloud(`${activeChapter.title}. Big question: ${activeChapter.bigQuestion}`)}
                className="p-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-cyan-300 cursor-pointer transition-all"
                title="Listen to Chapter Overview"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Big Guiding Question Box */}
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-400/30 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider mb-0.5">
                The Big Science Question
              </span>
              <span className="font-semibold text-slate-100">{activeChapter.bigQuestion}</span>
            </div>
          </div>

          {/* ── Verified Photographic Specimen Visuals (2 Cards) ── */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Verified Micrographs & Macro Specimens</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeChapter.images.map((img, iIdx) => {
                const imgSrc = LOCAL_ASSET_MAP[img.assetKey] || img.webFallbackUrl;
                return (
                  <div
                    key={iIdx}
                    className="rounded-xl border border-white/15 overflow-hidden bg-slate-950 flex flex-col shadow-md group"
                  >
                    <div className="w-full aspect-video relative overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={img.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-cyan-300 border border-white/10">
                        {img.magnificationOrType}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/90 text-[11px] text-slate-300 leading-snug border-t border-white/10">
                      {img.caption}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Core Conceptual Deep-Dive ── */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Core Scientific Concepts</span>
            </span>

            <div className="flex flex-col gap-3">
              {activeChapter.coreConcepts.map((concept, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {concept.heading}
                    </h3>
                    <button
                      onClick={() => handleReadAloud(`${concept.heading}. ${concept.explanation}`)}
                      className="p-1 rounded-lg hover:bg-white/10 text-cyan-300 cursor-pointer"
                      title="Listen to Section"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-normal leading-relaxed">
                    {concept.explanation}
                  </p>

                  <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/30 text-[11px] font-semibold text-emerald-200 flex items-start gap-1.5 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{concept.keyTakeaway}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Real-World Historical Case Study ── */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/30 text-white shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Discovery Case Study ({activeChapter.caseStudy.yearOrEra})</span>
              </span>
              <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded-md text-indigo-300 border border-indigo-400/30">
                {activeChapter.caseStudy.discoverer}
              </span>
            </div>

            <h3 className="text-sm font-display font-bold text-amber-300">
              {activeChapter.caseStudy.title}
            </h3>

            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              {activeChapter.caseStudy.narrative}
            </p>

            <div className="p-2 bg-indigo-950/60 rounded-lg border border-indigo-500/30 text-[11px] font-semibold text-cyan-200 mt-1">
              ⭐ Scientific Impact: {activeChapter.caseStudy.significance}
            </div>
          </div>

          {/* ── Scientific Vocabulary & Glossary ── */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Scientific Vocabulary</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeChapter.vocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">{vocab.term}</span>
                    {vocab.pronunciation && (
                      <span className="text-[9px] font-mono text-slate-400">/{vocab.pronunciation}/</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{vocab.definition}</p>
                  <span className="text-[10px] text-cyan-400 italic mt-0.5">"{vocab.example}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Revision Flashcard ── */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Memory Sheet & Quick Revision</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {activeChapter.quickRevisionPoints.map((point, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── "Try This at Home!" Safe Science Mini-Lab ── */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>Try This at Home! Safe Mini-Lab</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                {activeChapter.miniLab.difficulty}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white">
              {activeChapter.miniLab.title}
            </h4>

            <div className="text-xs text-slate-300 flex flex-col gap-1.5">
              <p>
                <span className="text-emerald-300 font-bold">Materials Needed: </span>
                {activeChapter.miniLab.materials.join(', ')}
              </p>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-emerald-300 font-bold">Step-by-Step:</span>
                {activeChapter.miniLab.instructions.map((ins, iIdx) => (
                  <div key={iIdx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-mono font-bold">{iIdx + 1}.</span>
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-emerald-950/50 rounded-lg border border-emerald-500/30 text-[11px] text-emerald-200 mt-1">
                🔬 Scientific Principle: {activeChapter.miniLab.scientificPrinciple}
              </div>
            </div>
          </div>

          {/* ── Launch Interactive Mission Lab Action Button ── */}
          <div className="flex justify-center pt-2 print:hidden">
            <button
              onClick={() => handleLaunchLab(activeChapter)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Launch Interactive {activeChapter.title} Lab ➔</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isStudyPrintMode) {
    return (
      <div className="min-h-screen w-full bg-white text-slate-900 p-6 font-sans">
        {renderContent()}
      </div>
    );
  }

  return (
    <PersistentAppShell activeDestination="journal">
      <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 p-4 sm:p-6 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden">
        {renderContent()}
      </div>
    </PersistentAppShell>
  );
};
