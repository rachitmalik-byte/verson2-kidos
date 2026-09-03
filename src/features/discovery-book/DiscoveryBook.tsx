import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';
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
  Compass,
  Check,
} from 'lucide-react';

// ── Strictly Relevant Animated Micro-Zoom GIFs ──
import cottonZoomGif from '@/assets/videos/cotton_zoom_microstructure.gif';
import nylonZoomGif from '@/assets/videos/nylon_zoom_microstructure.gif';
import silkZoomGif from '@/assets/videos/silk_zoom_microstructure.gif';
import plasticZoomGif from '@/assets/videos/plastic_zoom_microstructure.gif';
import polyesterZoomGif from '@/assets/videos/polyester_zoom_weave.gif';
import woolZoomGif from '@/assets/videos/wool_zoom_fibers.gif';
import rubberZoomGif from '@/assets/videos/tire_rubber_crosslink.gif';
import treeLatexZoomGif from '@/assets/videos/tree_latex_zoom_polymers.gif';

// ── Strictly Relevant Macro Item Photography ──
import antsSugarImg from '@/assets/images/theme1/ants_trail_sugar.jpg';
import eagleMouseImg from '@/assets/images/theme1/eagle_view_mouse.jpg';
import snakeVibrationImg from '@/assets/images/specimens/snake_jawbone_vibrations.jpg';
import fourSnakesImg from '@/assets/images/specimens/four_venomous_snakes.jpg';
import tonguePapillaeImg from '@/assets/images/specimens/tongue_taste_papillae.jpg';
import drBeaumontImg from '@/assets/images/specimens/dr_beaumont_stomach.jpg';
import dandelionSeedImg from '@/assets/images/specimens/dandelion_seed_dispersal.jpg';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

import solarEvapImg from '@/assets/images/specimens/solar_evaporation_ocean.jpg';
import cloudsRainImg from '@/assets/images/specimens/clouds_condensation_rain.jpg';
import ghadisarLakeImg from '@/assets/images/specimens/jaisalmer_ghadisar_lake.jpg';
import stepwellBawriImg from '@/assets/images/specimens/stepwell_bawri_rajasthan.jpg';
import cargoShipImg from '@/assets/images/specimens/cargo_ship_buoyancy.jpg';
import deadSeaSaltImg from '@/assets/images/specimens/dead_sea_salt_floating.jpg';
import mosquitoLarvaImg from '@/assets/images/specimens/mosquito_larva_microscope.jpg';
import oilFilmImg from '@/assets/images/specimens/oil_film_mosquito_prevention.jpg';

import pashminaMicroImg from '@/assets/images/theme-shelter/pashmina_microscope_macro.jpg';
import reboTentImg from '@/assets/images/specimens/rebo_yak_tent.jpg';
import everestClimberImg from '@/assets/images/theme-shelter/everest_summit_mountaineer.jpg';
import cramponsImg from '@/assets/images/specimens/mountaineer_crampons.jpg';
import golcondaFortImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import persianWheelImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';
import earthquakeFaultImg from '@/assets/images/specimens/earthquake_fault_seismograph.jpg';
import bhungaHouseImg from '@/assets/images/specimens/kutch_bhunga_house.jpg';

import rawCottonImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import nylonThreadImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import syntheticAcrylicImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import bakeliteImg from '@/assets/images/experiments/bakelite_pan_handle.jpg';
import pvcCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import copperWireImg from '@/assets/images/wire/copper_wire_macro.jpg';
import soilPlasticImg from '@/assets/images/decay/soil_plastic_450yrs.jpg';
import parachuteImg from '@/assets/images/experiments/parachute_canopy_jump.jpg';
import plasticPelletsImg from '@/assets/images/specimens/plastic_pet_pellets.jpg';

// ── 100% Strictly Relevant Practical Asset Map per Chapter ──
interface ChapterAsset {
  type: 'gif' | 'image';
  src: string;
  badge: string;
  scaleNote: string;
}

const CHAPTER_PRACTICAL_ASSET_MAP: Record<string, ChapterAsset> = {
  // Course 1: Materials Science (mat-ch1 to mat-ch13)
  'mat-ch1': { type: 'gif', src: cottonZoomGif, badge: '🔬 100x Cotton Capillary Pores', scaleNote: 'Continuous zoom into hollow natural cellulose pores' },
  'mat-ch2': { type: 'gif', src: polyesterZoomGif, badge: '🔬 Synthetic Polymer Weave', scaleNote: 'Smooth non-porous extruded polyester fibers' },
  'mat-ch3': { type: 'gif', src: nylonZoomGif, badge: '🔬 High-Tensile Nylon Filaments', scaleNote: 'Aligned polyamide chains with extreme tensile hold' },
  'mat-ch4': { type: 'gif', src: silkZoomGif, badge: '🔬 Natural Triangular Silk Fibroin', scaleNote: 'Prismatic protein fibers spun by silkworm caterpillars' },
  'mat-ch5': { type: 'gif', src: polyesterZoomGif, badge: '🔬 Wrinkle-Resistant Ester Weave', scaleNote: 'Synthetic polymer spring memory loops' },
  'mat-ch6': { type: 'gif', src: woolZoomGif, badge: '🔬 Crimped Acrylic / Wool Fibers', scaleNote: 'Insulating air pockets trapping ambient warmth' },
  'mat-ch7': { type: 'gif', src: plasticZoomGif, badge: '🔬 Thermoplastic Molecular Matrix', scaleNote: 'Linear polymer chains softening under thermal heat' },
  'mat-ch8': { type: 'image', src: copperWireImg, badge: '⚡ Copper Electron Matrix & PVC', scaleNote: 'Conductive metallic core insulated with bound PVC jacket' },
  'mat-ch9': { type: 'image', src: bakeliteImg, badge: '🫖 3D Thermoset Bakelite Structure', scaleNote: 'Crosslinked polymer networks that never melt on stoves' },
  'mat-ch10': { type: 'image', src: soilPlasticImg, badge: '⏳ 450-Year Non-Biodegradable Petrochemical', scaleNote: 'Synthetic polymers immune to biological soil bacteria' },
  'mat-ch11': { type: 'gif', src: rubberZoomGif, badge: '🔬 Crosslinked Vulcanized Rubber', scaleNote: 'Sulfur bridge polymers providing tire friction & elasticity' },
  'mat-ch12': { type: 'image', src: plasticPelletsImg, badge: '♻️ Recycled PET Plastic Flakes', scaleNote: 'Thermoplastic pellets remolded into sustainable goods' },
  'mat-ch13': { type: 'image', src: parachuteImg, badge: '🪂 Ripstop High-Tensile Nylon Canopy', scaleNote: 'Ultra-lightweight synthetic canopy supporting paratroopers' },

  // Course 2: Super Senses (Theme 1, Chapters 1-4)
  'sense-ch1': { type: 'image', src: antsSugarImg, badge: '🐜 Pheromone Chemical Scent Highway', scaleNote: 'Invisible trail markers guiding foraging ant colonies' },
  'sense-ch2': { type: 'image', src: snakeVibrationImg, badge: '🐍 Seismic Lower-Jaw Ground Hearing', scaleNote: 'Soil compression waves transmitted to cranial auditory bones' },
  'sense-ch3': { type: 'image', src: tonguePapillaeImg, badge: '👅 Fungiform Taste Papillae & Acid Stomach', scaleNote: 'Hundreds of taste bud receptors & gastric digestive acids' },
  'sense-ch4': { type: 'image', src: burdockVelcroImg, badge: '🌱 Burdock Elastic Micro-Hooks (Velcro)', scaleNote: 'Natural curved hooks catching looped fabric fibers' },

  // Course 3: Water Experiments (Theme 2/4, Chapters 1-4)
  'water-ch1': { type: 'image', src: solarEvapImg, badge: '☀️ Solar Thermal Evaporation & Rain', scaleNote: 'Ocean water kinetic vapor rising into cold cumulus clouds' },
  'water-ch2': { type: 'image', src: ghadisarLakeImg, badge: '🏰 Jaisalmer Ghadisar & Bawri Stepwells', scaleNote: '650-year-old 9-lake rainwater harvesting engineering' },
  'water-ch3': { type: 'image', src: deadSeaSaltImg, badge: '🧂 300 g/L High-Density Dead Sea Salinity', scaleNote: 'Packed mineral mass creating effortless human buoyancy' },
  'water-ch4': { type: 'image', src: mosquitoLarvaImg, badge: '🦟 Microscopic Snorkel Siphon & Oil Barrier', scaleNote: 'Larval breathing siphon blocked by thin surface-tension oil' },

  // Course 4: Shelter & Earth (Theme 3/5, Chapters 1-5)
  'shelter-ch1': { type: 'image', src: reboTentImg, badge: '⛺ Changpa Rebo Yak-Hair Nomadic Tent', scaleNote: 'Woven yak hair protecting nomadic families from -40°C blizzard winds' },
  'shelter-ch2': { type: 'gif', src: woolZoomGif, badge: '🐐 12 µm Pashmina Mountain Underfleece', scaleNote: '6x finer than human hair with microscopic thermal air chambers' },
  'shelter-ch3': { type: 'image', src: everestClimberImg, badge: '🏔️ 8,848m Mt. Everest Summit Expedition', scaleNote: 'High-altitude hypoxia gear, ice axes & steel crampon spikes' },
  'shelter-ch4': { type: 'image', src: golcondaFortImg, badge: '🏰 Golconda Fateh Darwaza & Bastions', scaleNote: 'Curved stone bastions & acoustic clapping domes for siege defense' },
  'shelter-ch5': { type: 'image', src: bhungaHouseImg, badge: '🛖 Earthquake-Resistant Circular Bhunga', scaleNote: 'Conical thatched roofs & round clay walls dispersing seismic tremors' },
};

export const DiscoveryBook: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  // URL query params support: ?course=senses&chapter=1
  const courseParam = searchParams.get('course');
  const chapterParam = searchParams.get('chapter');

  // Active Course Index
  const initialCourseIdx = useMemo(() => {
    if (!courseParam) return 0;
    const idx = ALL_COURSES_CATALOG.findIndex((c) =>
      c.courseId.toLowerCase().includes(courseParam.toLowerCase()) ||
      c.courseName.toLowerCase().includes(courseParam.toLowerCase())
    );
    return idx !== -1 ? idx : 0;
  }, [courseParam]);

  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(initialCourseIdx);

  // Active Chapter Index
  const initialChapterIdx = useMemo(() => {
    if (!chapterParam) return 0;
    const chNum = parseInt(chapterParam, 10);
    if (!isNaN(chNum)) {
      const course = ALL_COURSES_CATALOG[initialCourseIdx] || ALL_COURSES_CATALOG[0];
      const cIdx = course.chapters.findIndex((ch) => ch.chapterNumber === chNum);
      return cIdx !== -1 ? cIdx : 0;
    }
    return 0;
  }, [chapterParam, initialCourseIdx]);

  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(initialChapterIdx);

  const activeCourse = ALL_COURSES_CATALOG[selectedCourseIdx] || ALL_COURSES_CATALOG[0];
  const chapters: CourseChapter[] = activeCourse.chapters;
  const activeChapter: CourseChapter = chapters[selectedChapterIdx] || chapters[0];
  const journal = activeChapter.fieldJournal;

  const currentAsset: ChapterAsset = CHAPTER_PRACTICAL_ASSET_MAP[activeChapter.chapterId] || {
    type: 'gif',
    src: cottonZoomGif,
    badge: '🔬 Microscopic Item Scan',
    scaleNote: 'High-resolution calibrated item structure',
  };

  const handlePronounceChapter = () => {
    sounds.pop();
    voiceAssistant.speak(`${activeChapter.chapterTitle}. ${journal.fieldBrief}. Key Law: ${activeChapter.chapterIntro.goldenLaw}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#262930] p-3 sm:p-6 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden select-none">
      {/* ── Top Header (Squircle Card with Diffuse Shadow) ── */}
      <header className="w-full max-w-7xl squircle-card px-4 sm:px-6 py-3.5 shadow-soft-card flex items-center justify-between gap-4 mb-6 z-20">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/subjects');
            }}
            className="pill-btn-secondary p-2 text-[#5A6072]"
            title="Return to Subjects"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.pop();
              navigate(-1);
            }}
            className="pill-btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="text-center min-w-0 flex-1 px-2 hidden sm:block">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-[#262930] shrink-0" />
            <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-[#262930] whitespace-nowrap truncate">
              Master Science Field Journal 📖
            </h1>
          </div>
          <p className="text-[10px] md:text-[11px] font-medium text-[#7E8494] whitespace-nowrap truncate">
            CBSE Class 5 EVS • Dedicated Chapter Field Logs, Practical Micro-Scans & DIY Labs
          </p>
        </div>

        {/* Right: Status & Compact Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xl:flex items-center gap-1 px-3 py-1.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-full text-[#854D0E] font-bold text-xs shadow-xs whitespace-nowrap">
            <Star className="w-3.5 h-3.5 text-[#EAB308] fill-[#EAB308] shrink-0" />
            <span>{discoveries.length} Discovered</span>
          </div>
          <AudioNavBarControls showProfile={false} />
        </div>
      </header>

      {/* ── 4 Course Selector Tabs (Soft Pastel Squircle Tints) ── */}
      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 z-10">
        {ALL_COURSES_CATALOG.map((course, idx) => {
          const isSelected = idx === selectedCourseIdx;
          const coursePastels = [
            { bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', text: 'text-[#166534]', iconBg: 'bg-[#DCFCE7]' },
            { bg: 'bg-[#FFF7ED]', border: 'border-[#FED7AA]', text: 'text-[#9A3412]', iconBg: 'bg-[#FFEDD5]' },
            { bg: 'bg-[#F0F9FF]', border: 'border-[#BAE6FD]', text: 'text-[#075985]', iconBg: 'bg-[#E0F2FE]' },
            { bg: 'bg-[#F5F3FF]', border: 'border-[#DDD6FE]', text: 'text-[#5B21B6]', iconBg: 'bg-[#EDE9FE]' },
          ][idx % 4];

          return (
            <button
              key={course.courseId}
              onClick={() => {
                sounds.pop();
                setSelectedCourseIdx(idx);
                setSelectedChapterIdx(0);
              }}
              className={`p-3.5 squircle-card text-left transition-all cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'border-[#262930] shadow-soft-card ring-2 ring-[#262930]/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl ${coursePastels.iconBg} flex items-center justify-center ${coursePastels.text} shadow-xs shrink-0`}>
                {course.courseId === 'theme-senses' && <Leaf className="w-5 h-5" />}
                {course.courseId === 'theme-materials' && <Layers className="w-5 h-5" />}
                {course.courseId === 'theme-water' && <Droplets className="w-5 h-5" />}
                {course.courseId === 'theme-shelter' && <Mountain className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className={`text-[10px] font-extrabold ${coursePastels.text} block uppercase`}>Course {idx + 1}</span>
                <span className="text-xs font-extrabold text-[#262930] truncate block leading-tight">{course.courseName}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Dedicated Chapter Field Journal Workspace ── */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 mb-12">
        {/* Left Column: Chapter Navigator (4 cols) */}
        <div className="lg:col-span-4 squircle-card p-4 shadow-soft-card bg-white flex flex-col gap-2 h-fit">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {activeCourse.courseName}:
            </span>
            <span className="text-[11px] font-bold text-indigo-600 font-mono">
              {chapters.length} Chapters
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[560px] overflow-y-auto pr-1">
            {chapters.map((ch, cIdx) => {
              const isSelected = cIdx === selectedChapterIdx;
              const chAsset = CHAPTER_PRACTICAL_ASSET_MAP[ch.chapterId];

              return (
                <button
                  key={ch.chapterId}
                  onClick={() => {
                    sounds.pop();
                    setSelectedChapterIdx(cIdx);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left font-black text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{ch.icon}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block font-mono">Chapter {ch.chapterNumber}</span>
                      <span className="truncate block font-bold text-slate-800 text-xs">{ch.chapterTitle}</span>
                    </div>
                  </div>
                  {chAsset && (
                    <span className="text-[9px] font-black uppercase text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shrink-0">
                      {chAsset.type === 'gif' ? '🎬 Live Zoom' : '📷 Macro'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dedicated Chapter Field Journal (8 cols) */}
        <div className="lg:col-span-8 squircle-card p-6 sm:p-8 shadow-soft-float flex flex-col gap-6 bg-white border border-slate-200/80">
          {/* Chapter Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] shadow-xs shrink-0">
                {activeChapter.icon}
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wide text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1 rounded-full inline-block mb-1">
                  {activeCourse.courseName} • Chapter {activeChapter.chapterNumber}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#262930] tracking-tight">
                  {journal.journalTitle}
                </h2>
              </div>
            </div>

            <button
              onClick={handlePronounceChapter}
              className="p-2.5 pill-btn-secondary text-[#5A6072] cursor-pointer self-start sm:self-center"
              title="Hear read aloud"
            >
              <Volume2 className="w-5 h-5 text-[#262930]" />
            </button>
          </div>

          {/* ── STRICTLY RELEVANT PRACTICAL SPECIMEN VIEWPORT ── */}
          <div className="w-full relative rounded-3xl bg-slate-900 border border-slate-200/80 overflow-hidden shadow-soft-card flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72 md:h-80 relative overflow-hidden flex items-center justify-center">
              <img
                src={currentAsset.src}
                alt={journal.journalTitle}
                className="w-full h-full object-cover"
              />

              {/* Optical Reticle */}
              <div className="absolute inset-0 pointer-events-none border border-sky-400/25 flex items-center justify-center">
                <div className="w-full h-[1px] bg-sky-400/20 absolute" />
                <div className="h-full w-[1px] bg-sky-400/20 absolute" />
                <div className="w-36 h-36 rounded-full border border-sky-400/30 absolute" />
              </div>

              {/* Top Badge */}
              <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-1 rounded-xl border border-sky-400/50 text-[11px] font-mono font-black text-sky-300 shadow-md">
                {currentAsset.badge}
              </div>

              {/* Bottom HUD */}
              <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md rounded-2xl py-1.5 px-3.5 text-center text-xs font-mono font-black text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CALIBRATED PRACTICAL SPECIMEN</span>
                </div>
                <span className="text-amber-300 text-[11px] hidden sm:inline">{currentAsset.scaleNote}</span>
              </div>
            </div>
          </div>

          {/* Field Brief */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Field Investigation Brief:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {journal.fieldBrief}
            </p>
          </div>

          {/* Golden Science Law */}
          {activeChapter.chapterIntro?.goldenLaw && (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3 shadow-xs">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider block">
                  Core Science Law:
                </span>
                <p className="text-xs sm:text-sm font-black text-amber-950 leading-snug mt-0.5">
                  {activeChapter.chapterIntro.goldenLaw}
                </p>
              </div>
            </div>
          )}

          {/* Core Item Discoveries (3-Card Matrix) */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chapter Item Discoveries ({journal.itemFacts.length} Observations)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {journal.itemFacts.map((f, fIdx) => (
                <div key={fIdx} className="p-4 bg-gradient-to-tr from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-1 shadow-xs">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs font-black text-amber-950">{f.title}</span>
                  <p className="text-[11px] font-bold text-slate-600 leading-snug mt-0.5">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-On DIY Science Experiment */}
          <div className="p-5 bg-indigo-50/90 rounded-3xl border-3 border-indigo-200 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                <span>Hands-On Mini Experiment: {journal.handsOnExperiment.title}</span>
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 flex flex-col gap-2">
              <p>
                <span className="text-indigo-950 font-black">🧪 Materials Needed: </span>
                {journal.handsOnExperiment.materialsNeeded.join(', ')}
              </p>
              <p>
                <span className="text-indigo-950 font-black">📋 Step-by-Step Procedure: </span>
                {journal.handsOnExperiment.procedure}
              </p>
              <div className="p-3 bg-emerald-100 rounded-2xl text-xs font-black text-emerald-950 border border-emerald-300">
                ✅ Expected Observation: {journal.handsOnExperiment.expectedObservation}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
