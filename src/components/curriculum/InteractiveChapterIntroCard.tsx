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
  chapterData?: CourseChapter;
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

  const intro = chapterData?.chapterIntro || ({} as any);
  const journal = chapterData?.fieldJournal || ({} as any);

  const conceptSteps = intro?.conceptSteps || [];
  const checklist: string[] = intro?.learningChecklist || intro?.learningRoadmap || [
    'Explore foundational scientific principles and real-world mechanisms.',
    'Observe microscopic specimens and material properties.',
    'Conduct hands-on experiments in the laboratory simulator.',
  ];

  const challenge = intro?.thinkFastChallenge || intro?.pipThinkFastChallenge || {
    question: 'What is the key science principle discovered in this chapter?',
    options: [
      { text: 'The material structure determines its properties and uses', isCorrect: true },
      { text: 'Materials behave completely randomly', isCorrect: false },
    ],
    explanation: 'Every material has a unique microscopic structure that gives it specific properties!',
  };

  const challengeOptions = challenge?.options || [
    { text: 'The material structure determines its properties and uses', isCorrect: true },
    { text: 'Materials behave completely randomly', isCorrect: false },
  ];

  const reflectionPrompt =
    journal?.journalReflectionBadgePrompt ||
    journal?.journalBadgeQuestion ||
    'What was your most exciting discovery in this chapter?';
  const facts = journal?.specimenFacts || [];
  const handsOn = journal?.handsOnExperiment || {
    title: 'Hands-on Science Activity',
    materialsNeeded: ['Household items', 'Notebook'],
    procedure: 'Observe everyday materials around your home.',
    expectedObservation: 'Materials exhibit unique physical and chemical properties.',
  };

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect) {
      sounds.fanfare();
      setIsChallengePassed(true);
      voiceAssistant.speak(`Brilliant discovery, Young Scientist! ${challenge?.explanation || ''}`);
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
              {chapterData?.syllabusRef || 'CBSE Class 5 EVS'} • Chapter {chapterData?.chapterNumber || 1}
            </span>
            <button
              onClick={() => handleReadAloud(`${intro?.title || ''}. ${intro?.hookScene || ''} ${intro?.bigGuidingQuestion || ''}`)}
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
            {intro?.title || chapterData?.chapterTitle || 'Chapter Science Foundation'} {chapterData?.icon || '🔬'}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 leading-relaxed">
            {intro?.hookScene || 'Explore the fundamental scientific concepts behind everyday materials and environments.'}
          </p>

          <div className="mt-3 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-950 flex items-start gap-2.5 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Big Question: {intro?.bigGuidingQuestion || 'Why do materials behave differently?'}</span>
          </div>
        </div>
      </div>

      {/* ── Multi-Step Visual Concept Cards Taught by Pip ── */}
      {conceptSteps.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 ml-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Foundational Science Lessons (Taught by Pip)</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conceptSteps.map((step, sIdx) => {
              const localImg = step.imageAsset ? IMAGE_MAP[step.imageAsset] : null;
              return (
                <div
                  key={sIdx}
                  className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-slate-200 shadow-md flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full">
                        Step {step.stepNumber}: {step.conceptTitle}
                      </span>
                      <button
                        onClick={() => handleReadAloud(`${step.conceptTitle}. ${step.pipDialogue}`)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      </button>
                    </div>

                    {localImg && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 relative shadow-inner">
                        <img
                          src={localImg}
                          alt={step.conceptTitle}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

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
      )}

      {/* ── Golden Science Law & Learning Checklist ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-slate-950 border-3 border-amber-300 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2.5 py-1 rounded-full text-slate-950 inline-block mb-2">
              ⭐ Golden Science Law
            </span>
            <h4 className="text-sm font-black leading-snug">
              {intro?.goldenLaw || 'The Material structure determines its properties and practical uses!'}
            </h4>
          </div>
          <span className="text-[10px] font-bold opacity-80 mt-3 block">
            Keep this principle in mind during the simulation!
          </span>
        </div>

        <div className="md:col-span-2 p-5 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-slate-200 shadow-md flex flex-col justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full w-fit mb-2">
            📋 What You Will Master
          </span>
          <div className="flex flex-col gap-2">
            {checklist.map((item, cIdx) => (
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
          {challenge?.question || 'Why do materials behave differently under force and weather?'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challengeOptions.map((opt, oIdx) => {
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

        {/* Enter Simulator Button */}
        <div className="pt-3 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 text-center sm:text-left">
            {isChallengePassed
              ? '✨ Challenge unlocked! Launch the interactive laboratory below:'
              : '💡 Answer Pip’s challenge or jump straight into the live interactive lab!'}
          </span>

          <button
            onClick={() => {
              sounds.fanfare();
              voiceAssistant.stop();
              onStartLab();
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Enter Interactive Lab 🔬</span>
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
                    {journal?.journalTitle || 'Chapter Field Journal'}
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
                {journal?.fieldBrief || 'Record your scientific observations and field data.'}
              </p>

              {facts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {facts.map((fact: any, fIdx: number) => (
                    <div key={fIdx} className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex flex-col gap-1">
                      <span className="text-2xl">{fact.icon || '🔬'}</span>
                      <span className="text-xs font-black text-amber-950">{fact.title}</span>
                      <p className="text-[11px] font-bold text-slate-600 leading-snug">{fact.detail || fact.fact}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Hands-on DIY Activity */}
              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 flex flex-col gap-2">
                <span className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <span>{handsOn.title || 'Hands-on Science Activity'}</span>
                </span>
                {handsOn.materialsNeeded && (
                  <p className="text-xs font-bold text-slate-700">
                    <span className="text-indigo-950">Materials: </span>
                    {Array.isArray(handsOn.materialsNeeded) ? handsOn.materialsNeeded.join(', ') : handsOn.materialsNeeded}
                  </p>
                )}
                <p className="text-xs font-bold text-slate-700">
                  <span className="text-indigo-950">Procedure: </span>
                  {handsOn.procedure || handsOn.instructions || 'Perform the experiment in your home lab.'}
                </p>
                {handsOn.expectedObservation && (
                  <div className="p-2.5 bg-emerald-100/70 rounded-xl text-xs font-black text-emerald-950 mt-1">
                    Expected Result: {handsOn.expectedObservation}
                  </div>
                )}
              </div>

              {/* Reflection Badge Prompt */}
              <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 flex flex-col gap-1">
                <span className="font-black text-slate-900">Explorer Reflection Prompt:</span>
                <p>{reflectionPrompt}</p>
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
