import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import type { CourseChapter } from '@/data/masterCurriculum';
import {
  Sparkles,
  Volume2,
  Zap,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Check,
  FlaskConical,
  X,
} from 'lucide-react';

// Specimen image asset map
import rawCottonImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import polyesterRaincoatImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import polyesterSwatchImg from '@/assets/images/experiments/polyester_swatch_clean.jpg';
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
import silkwormCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import eagleLandscapeImg from '@/assets/images/theme1/eagle_view_landscape.jpg';
import persianWheelImg from '@/assets/images/theme-shelter/golconda_persian_wheel.jpg';
import soilAppleDay1Img from '@/assets/images/decay/soil_apple_day1.jpg';
import boilingKettleImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import acrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import nylonThreadImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import lightbulbImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import golcondaFortImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import bakeliteCleanImg from '@/assets/images/experiments/bakelite_handle_clean.jpg';
import plastic100yrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import copperWireImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pashminaMicroImg from '@/assets/images/theme-shelter/pashmina_microscope_macro.jpg';
import everestClimberImg from '@/assets/images/theme-shelter/everest_summit_mountaineer.jpg';
import steelCableImg from '@/assets/images/experiments/steel_cable_holding.jpg';
import fatehDarwazaImg from '@/assets/images/theme-shelter/golconda_fateh_darwaza.jpg';
import timberWoodImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import wood450yrsImg from '@/assets/images/decay/wood_450yrs.jpg';

const IMAGE_MAP: Record<string, string> = {
  'raw_cotton_boll.jpg': rawCottonImg,
  'polyester_raincoat_waterproof.jpg': polyesterRaincoatImg,
  'polyester_swatch_clean.jpg': polyesterSwatchImg,
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
  'silkworm_silk_cocoon.jpg': silkwormCocoonImg,
  'eagle_view_landscape.jpg': eagleLandscapeImg,
  'persian_wheel.jpg': persianWheelImg,
  'golconda_persian_wheel.jpg': persianWheelImg,
  'soil_apple_day1.jpg': soilAppleDay1Img,
  'boiling_tea_kettle_steam.jpg': boilingKettleImg,
  'synthetic_acrylic_yarn.jpg': acrylicYarnImg,
  'nylon_thread_spool.jpg': nylonThreadImg,
  'lightbulb_glowing_bright.jpg': lightbulbImg,
  'golconda_fort_bastions.jpg': golcondaFortImg,
  'bakelite_handle_clean.jpg': bakeliteCleanImg,
  'plastic_100yrs.jpg': plastic100yrsImg,
  'copper_wire_macro.jpg': copperWireImg,
  'pashmina_microscope_macro.jpg': pashminaMicroImg,
  'everest_summit_mountaineer.jpg': everestClimberImg,
  'steel_cable_holding.jpg': steelCableImg,
  'golconda_fateh_darwaza.jpg': fatehDarwazaImg,
  'natural_wood_timber.jpg': timberWoodImg,
  'wood_450yrs.jpg': wood450yrsImg,
};

interface Props {
  chapterData: CourseChapter;
  onStartLab: () => void;
  accentBorderColor?: string;
}

export const InteractiveChapterIntroCard: React.FC<Props> = ({
  chapterData,
  onStartLab,
  accentBorderColor = 'border-sky-400',
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChallengePassed, setIsChallengePassed] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  const intro = chapterData.chapterIntro;
  const journal = chapterData.fieldJournal;

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect) {
      sounds.fanfare();
      setIsChallengePassed(true);
      voiceAssistant.speak(`Brilliant discovery, Young Scientist! ${intro.thinkFastChallenge.explanation}`);
    } else {
      sounds.boing();
      voiceAssistant.speak('Look closely at the scientific concepts above and try again!');
    }
  };

  const handleReadAloud = (text: string) => {
    sounds.pop();
    voiceAssistant.speak(text);
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* ── Pip Teaching Hero Header Card ── */}
      <div className={`w-full bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-4 ${accentBorderColor} shadow-2xl flex flex-col md:flex-row items-center gap-6`}>
        <Pip mood="explaining" size="xl" />

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-950 font-black text-xs">
              {chapterData.syllabusRef} • Chapter {chapterData.chapterNumber}
            </span>
            <button
              onClick={() => handleReadAloud(`${intro.title}. ${intro.hookScene} ${intro.bigGuidingQuestion}`)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all active:scale-95 shadow-xs"
              title="Listen to Pip Read Intro Aloud"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => {
                sounds.pop();
                setIsJournalOpen(true);
              }}
              className="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Chapter Field Journal</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {intro.title} {chapterData.icon}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
            {intro.hookScene}
          </p>

          <div className="mt-3 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-start gap-2.5 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Big Question: {intro.bigGuidingQuestion}</span>
          </div>
        </div>
      </div>

      {/* ── Multi-Step Visual Concept Cards Taught by Pip ── */}
      <div className="w-full flex flex-col gap-4">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 ml-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Foundational Science Lessons (Taught by Pip)</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intro.conceptSteps.map((step, sIdx) => {
            const imgSrc = IMAGE_MAP[step.imageAsset] || rawCottonImg;
            return (
              <div
                key={sIdx}
                className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-slate-200 shadow-md flex flex-col justify-between gap-3 hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-950 mb-3 relative group">
                    <img
                      src={imgSrc}
                      alt={step.conceptTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-slate-950/80 text-white rounded-lg text-[10px] font-mono font-bold backdrop-blur-xs">
                      100x Micrograph / Specimen
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Step {step.stepNumber}: {step.conceptTitle}
                    </h3>
                    <button
                      onClick={() => handleReadAloud(`${step.conceptTitle}. ${step.pipDialogue}`)}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      title="Read Lesson Step"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-600 leading-relaxed">
                    {step.pipDialogue}
                  </p>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-[11px] font-black text-emerald-950 flex items-start gap-1.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step.keyTakeaway}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Golden Science Law & Learning Checklist ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Golden Law Card */}
        <div className="md:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-slate-950 border-3 border-amber-300 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2.5 py-1 rounded-full text-slate-950 inline-block mb-2">
              ⭐ Golden Science Law
            </span>
            <h4 className="text-sm font-black leading-snug">
              {intro.goldenLaw}
            </h4>
          </div>
          <span className="text-[10px] font-bold opacity-80 mt-3 block">
            Keep this principle in mind during the simulation!
          </span>
        </div>

        {/* Learning Roadmap Checklist */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-slate-200 shadow-md flex flex-col justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full w-fit mb-2">
            📋 What You Will Master
          </span>
          <div className="flex flex-col gap-2">
            {intro.learningChecklist.map((item, cIdx) => (
              <div key={cIdx} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interactive Think-Fast Challenge & Lab Unlock ── */}
      <div className="w-full bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-[32px] border-4 border-indigo-300 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-100 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Pip's Think-Fast Challenge</span>
          </span>

          {isChallengePassed && (
            <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4 stroke-[3]" /> Concept Mastered!
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
          {intro.thinkFastChallenge.question}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {intro.thinkFastChallenge.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            return (
              <motion.button
                key={oIdx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectOption(oIdx, opt.isCorrect)}
                className={`p-4 rounded-2xl border-2 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  isSelected && opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                    : isSelected && !opt.isCorrect
                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Launch Hands-On Simulator / Lab Button */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              onStartLab();
            }}
            className={`px-10 py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl cursor-pointer transition-all flex items-center gap-2.5 ${
              isChallengePassed
                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-slate-950 active:scale-95 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
            }`}
          >
            <span>🚀 Enter Hands-on Lab & Simulators ➔</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ── Unique Chapter Field Journal Modal ── */}
      <AnimatePresence>
        {isJournalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 border-4 border-amber-400 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {journal.journalTitle}
                  </h2>
                </div>
                <button
                  onClick={() => setIsJournalOpen(false)}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                {journal.fieldBrief}
              </p>

              {/* Specimen Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {journal.specimenFacts.map((fact, fIdx) => (
                  <div key={fIdx} className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-1">
                    <span className="text-2xl">{fact.icon}</span>
                    <span className="text-xs font-black text-amber-950">{fact.title}</span>
                    <p className="text-[11px] font-bold text-slate-600 leading-snug">{fact.detail}</p>
                  </div>
                ))}
              </div>

              {/* Hands-on DIY Activity */}
              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 flex flex-col gap-2">
                <span className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <span>{journal.handsOnExperiment.title}</span>
                </span>
                <p className="text-xs font-bold text-slate-700">
                  <span className="text-indigo-950">Materials: </span>
                  {journal.handsOnExperiment.materialsNeeded.join(', ')}
                </p>
                <p className="text-xs font-bold text-slate-700">
                  <span className="text-indigo-950">Procedure: </span>
                  {journal.handsOnExperiment.procedure}
                </p>
                <div className="p-2.5 bg-emerald-100/70 rounded-xl text-xs font-black text-emerald-950 mt-1">
                  Expected Result: {journal.handsOnExperiment.expectedObservation}
                </div>
              </div>

              {/* Reflection Badge Prompt */}
              <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 flex flex-col gap-1">
                <span className="font-black text-slate-900">Explorer Reflection Prompt:</span>
                <p>{journal.journalReflectionBadgePrompt}</p>
              </div>

              <button
                onClick={() => setIsJournalOpen(false)}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95"
              >
                Close Field Journal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
