import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  LessonMissionConfig,
  LessonStepData,
  ActivityType,
  SortingItem,
  SortingTray,
  MatchingPairItem,
  TensileSpecimen,
  McqOption,
} from '@/types/lessonEngine';
import { ActivityRenderer } from '@/components/engine/ActivityRenderer';
import { generateLessonFromPrompt, generateFallbackLessonConfig } from '@/lib/geminiService';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  ArrowLeft,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Wand2,
  BookOpen,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  Settings2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export function TeacherStudio() {
  const navigate = useNavigate();

  // Active Draft Mission State
  const [missionConfig, setMissionConfig] = useState<LessonMissionConfig>(() => {
    return generateFallbackLessonConfig('water cycle');
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [copiedJson, setCopiedJson] = useState(false);
  const [previewCompleted, setPreviewCompleted] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const currentStep = missionConfig.steps[activeStepIndex] || missionConfig.steps[0];

  // AI Level Generator Trigger with Animated Real-Time Progress Visualization
  const handleAiGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    sounds.pop();
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationProgress(15);
    voiceAssistant.stop();

    // Step 1: Concept & Grade Analysis
    const timer1 = setTimeout(() => {
      setGenerationStep(2);
      setGenerationProgress(55);
      sounds.pop();
    }, 400);

    // Step 2: 2D Visual Synthesis
    const timer2 = setTimeout(() => {
      setGenerationStep(3);
      setGenerationProgress(85);
      sounds.sparkle();
    }, 900);

    try {
      const generated = await generateLessonFromPrompt(promptToUse, missionConfig.targetGrade || 5);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setGenerationStep(3);
      setGenerationProgress(100);
      sounds.fanfare();

      setTimeout(() => {
        setMissionConfig(generated);
        setActiveStepIndex(0);
        setPreviewCompleted(false);
        setPreviewKey((k) => k + 1);
        setIsGenerating(false);
      }, 400);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      sounds.boing();
      console.error('AI generation error:', err);
      setIsGenerating(false);
    }
  };

  // Paradigm Switching
  const handleSwitchParadigm = (type: ActivityType) => {
    sounds.pop();
    let newStep: LessonStepData;

    switch (type) {
      case 'interactive_diagram':
        newStep = {
          id: `step_${Date.now()}`,
          type: 'interactive_diagram',
          title: "Earth's Water Cycle Simulation",
          topic: 'water_cycle',
          diagramTitle: "Earth's Water Cycle Simulation",
          backgroundTheme: 'sky_ocean',
          pipPrompt: 'Water on Earth travels in an endless circle! Tap each stage in the animated diagram or use the weather controls to see how it works.',
          learningObjective: 'Explore how solar heat evaporates water into vapor, condenses it into clouds, and falls as rain!',
          summaryTakeaway: "The water cycle has been recycling the exact same water molecules on Earth for over 4 billion years!",
          hotspots: [
            {
              id: 'evap',
              name: 'Evaporation',
              stageNumber: 1,
              icon: '☀️',
              xPercent: 28,
              yPercent: 45,
              title: '1. Evaporation & Solar Heating',
              explanation: 'Heat energy from the Sun warms oceans and lakes, turning liquid water into invisible water vapor gas that rises into the sky!',
              animationType: 'evaporate_steam',
              funFact: 'Over 1,000 cubic kilometers of water evaporate into the sky every single day!',
            },
            {
              id: 'cond',
              name: 'Condensation',
              stageNumber: 2,
              icon: '☁️',
              xPercent: 72,
              yPercent: 24,
              title: '2. Condensation & Cloud Formation',
              explanation: 'As warm water vapor climbs higher into the cold atmosphere, it cools down and clumps into billions of tiny droplets, creating clouds!',
              animationType: 'condense_cloud',
              funFact: 'A single fluffy cumulus cloud can weigh over 500,000 kilograms — as heavy as 100 elephants!',
            },
            {
              id: 'precip',
              name: 'Precipitation',
              stageNumber: 3,
              icon: '🌧️',
              xPercent: 78,
              yPercent: 58,
              title: '3. Precipitation (Rain, Snow & Hail)',
              explanation: 'When water droplets inside clouds get too heavy to float, gravity pulls them down to Earth as rain, snow, sleet, or hail!',
              animationType: 'rain_drops',
              funFact: 'The fastest falling raindrops can reach speeds over 30 kilometers per hour!',
            },
            {
              id: 'collect',
              name: 'Collection & Runoff',
              stageNumber: 4,
              icon: '🌊',
              xPercent: 42,
              yPercent: 86,
              title: '4. Collection & Reservoir Storage',
              explanation: 'Rainwater flows down mountains into rivers, streams, and oceans. The cycle is complete and ready to begin all over again!',
              animationType: 'flow_water',
              funFact: "97% of Earth's water is stored in oceans, while only 1% is accessible fresh drinking water!",
            },
          ],
        };
        break;

      case 'matching_pairs':
        newStep = {
          id: `step_${Date.now()}`,
          type: 'matching_pairs',
          title: 'Material Property Match',
          instruction: 'Match each everyday object to its scientific property!',
          pipPrompt: 'Can you match each object to its superpowers?',
          feedbackSuccess: 'All pairs matched correctly!',
          pairs: [
            { id: '1', leftText: 'Raincoat', leftIcon: '🧥', rightText: 'Waterproof', rightIcon: '💧', explanation: 'Sheds water droplets' },
            { id: '2', leftText: 'Climbing Rope', leftIcon: '🪢', rightText: 'High Tensile Strength', rightIcon: '🏋️', explanation: 'Holds heavy climbers safely' },
          ],
        };
        break;

      case 'tensile_strength_rig':
        newStep = {
          id: `step_${Date.now()}`,
          type: 'tensile_strength_rig',
          title: '1v1 Weight Pull Rig',
          pipPrompt: 'Drag the slider to test how much weight each cord holds before snapping!',
          weightIncrementGrams: 1000,
          maxWeightGrams: 50000,
          scientificTakeaway: 'Synthetic fibers hold massive loads without breaking!',
          specimens: [
            { id: 'cotton', name: 'Cotton Rope', material: 'Cellulose', icon: '🧵', breakingWeightGrams: 2000, elasticDeformationMm: 4, snapSound: 'snap', description: 'Short plant fibers.', realWorldUse: 'Clothing' },
            { id: 'nylon', name: 'Nylon Cord', material: 'Polyamide', icon: '🪢', breakingWeightGrams: 25000, elasticDeformationMm: 15, snapSound: 'tensionSnap', description: 'Continuous plastic chains.', realWorldUse: 'Climbing rope' },
          ],
        };
        break;

      case 'mcq_assessment':
        newStep = {
          id: `step_${Date.now()}`,
          type: 'mcq_assessment',
          title: 'Science Mystery Question',
          pipPrompt: 'Think like a scientist and make your deduction!',
          question: 'Which material should an engineer use for an airplane parachute canopy?',
          explanation: 'Nylon is strong and lightweight, making it ideal for parachutes!',
          options: [
            { id: 'nylon', text: 'Synthetic Nylon (Lightweight & Super Strong)', isCorrect: true, feedback: 'Correct! Nylon provides high tensile strength without extra weight!' },
            { id: 'iron', text: 'Heavy Iron Metal (Too heavy to fly)', isCorrect: false, feedback: 'Iron is too heavy for a parachute!' },
          ],
        };
        break;

      default: // sorting_tray
        newStep = {
          id: `step_${Date.now()}`,
          type: 'sorting_tray',
          title: 'Two-Tray Classification',
          pipPrompt: 'Sort these items into the correct trays!',
          trays: [
            { id: 'natural', title: '🌿 Natural', icon: '🌿', themeColor: 'sage', allowedCategories: ['natural'], description: 'From nature' },
            { id: 'synthetic', title: '🏭 Synthetic', icon: '🏭', themeColor: 'sky', allowedCategories: ['synthetic'], description: 'Made by people' },
          ],
          items: [
            { id: '1', name: 'Cotton Boll', icon: '🌿', category: 'natural', hint: 'Grows on a plant', originDetails: 'Plant fiber' },
            { id: '2', name: 'Nylon Rope', icon: '🪢', category: 'synthetic', hint: 'Made in factory', originDetails: 'Petroleum polymer' },
          ],
        };
        break;
    }

    const updatedSteps = [...missionConfig.steps];
    updatedSteps[activeStepIndex] = newStep;
    setMissionConfig({ ...missionConfig, steps: updatedSteps });
    setPreviewKey((k) => k + 1);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(missionConfig, null, 2));
    sounds.success();
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    sounds.pop();
    const blob = new Blob([JSON.stringify(missionConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${missionConfig.id || 'custom-lesson'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col font-sans">
      {/* ── Top Studio Bar ── */}
      <header className="w-full bg-white border-b-2 border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chapter-hub')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-all active:scale-95"
            title="Back to Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                No-Code Studio
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                Grade {missionConfig.targetGrade || 5}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight mt-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
              PolyQuest Teacher & Creator Studio 👩‍🏫🧪
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyJson}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => navigate('/chapter-hub')}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play as Student 🚀</span>
          </button>
        </div>
      </header>

      {/* ── AI Auto-Generate Level Banner ── */}
      <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-4 sm:p-5 text-white shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-wider text-amber-300">
                AI Auto-Generate Level Engine
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-200">
              Powered by Google Gemini 2.x & 3.x Multimodal Architect
            </span>
          </div>

          <div className="flex items-center gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. i want an animated interactive water cycle diagram"
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              className="flex-1 bg-white/10 border-2 border-white/20 focus:border-amber-400 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-indigo-300/70 outline-none transition-all"
            />
            <button
              onClick={() => handleAiGenerate()}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg cursor-pointer flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 fill-slate-950" />
              )}
              <span>{isGenerating ? `Generating (${generationProgress}%)...` : 'Generate with AI ✨'}</span>
            </button>
          </div>

          {/* Real-time Visual Progress Stepper Banner */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-amber-300/40 flex flex-col gap-2 mt-1"
              >
                <div className="flex items-center justify-between text-xs font-black text-amber-200">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    {generationStep === 1 && 'Step 1/3: Analyzing Science Concepts & Grade Calibration...'}
                    {generationStep === 2 && 'Step 2/3: Synthesizing 2D Animated Vector Simulation & Physics...'}
                    {generationStep === 3 && 'Step 3/3: Calibrating Hotspots & Voice Narration...'}
                  </span>
                  <span>{generationProgress}%</span>
                </div>
                {/* Progress Bar Track */}
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Idea Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-indigo-300">Try Instant Prompts:</span>
            {[
              '🌊 Water Cycle with Animated Diagram ☀️🌧️',
              '🌿 Natural vs Synthetic 4-item Sorting',
              '✨ Raincoat vs Parachute Matching Pairs',
              '🏋️ Tensile Rig: Steel vs Nylon vs Cotton',
              '📝 Grade 5 Fire Safety MCQ Assessment',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setAiPrompt(chip);
                  handleAiGenerate(chip);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-1 rounded-lg text-indigo-100 font-bold text-[11px] cursor-pointer transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Split-Screen Studio Workspace ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-start">
        {/* ══════════════════════════════════════════════════════════════════════
            LEFT COLUMN (6 Cols): Visual No-Code Configurator
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Mission Metadata Box */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                1. Mission Metadata
              </span>
              <span className="text-xs font-bold text-slate-400">Step {activeStepIndex + 1} of {missionConfig.steps.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-600 block mb-1">Mission Title</label>
                <input
                  type="text"
                  value={missionConfig.title}
                  onChange={(e) => setMissionConfig({ ...missionConfig, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-600 block mb-1">Subtitle / Objective</label>
                <input
                  type="text"
                  value={missionConfig.subtitle}
                  onChange={(e) => setMissionConfig({ ...missionConfig, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Activity Paradigm Switcher */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              2. Choose Activity Paradigm
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'interactive_diagram', label: '2D Science Sim', icon: '🌊' },
                { type: 'sorting_tray', label: 'Sorting Trays', icon: '🌿' },
                { type: 'matching_pairs', label: 'Matching Pairs', icon: '✨' },
                { type: 'tensile_strength_rig', label: '1v1 Tensile Rig', icon: '🏋️' },
                { type: 'mcq_assessment', label: 'MCQ Assessment', icon: '📝' },
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => handleSwitchParadigm(p.type as ActivityType)}
                  className={`p-3 rounded-2xl border-2 text-left font-black text-xs flex flex-col gap-1 cursor-pointer transition-all ${
                    currentStep.type === p.type
                      ? 'bg-amber-400 border-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step Form Builder */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                3. Configure Paradigm Content
              </span>
              <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                {currentStep.type}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-600 block mb-1">Step Title / Prompt</label>
              <input
                type="text"
                value={currentStep.title}
                onChange={(e) => {
                  const updated = [...missionConfig.steps];
                  updated[activeStepIndex] = { ...currentStep, title: e.target.value };
                  setMissionConfig({ ...missionConfig, steps: updated });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-600 block mb-1">Pip Speech Bubble Prompt (Age 10-11)</label>
              <textarea
                value={currentStep.pipPrompt}
                rows={2}
                onChange={(e) => {
                  const updated = [...missionConfig.steps];
                  updated[activeStepIndex] = { ...currentStep, pipPrompt: e.target.value };
                  setMissionConfig({ ...missionConfig, steps: updated });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none resize-none"
              />
            </div>

            {/* Sub-Editor for Sorting Trays */}
            {currentStep.type === 'sorting_tray' && (currentStep as any).items && (
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-black text-slate-700">Items to Sort ({((currentStep as any).items || []).length})</span>
                {((currentStep as any).items || []).map((item: any, idx: number) => (
                  <div key={item.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{item.icon}</span>
                      <div className="truncate">
                        <span className="font-black text-xs text-slate-900 block truncate">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-500">Tray: {item.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updatedItems = ((currentStep as any).items || []).filter((_: any, i: number) => i !== idx);
                        const updated = [...missionConfig.steps];
                        updated[activeStepIndex] = { ...currentStep, items: updatedItems } as any;
                        setMissionConfig({ ...missionConfig, steps: updated });
                        setPreviewKey((k) => k + 1);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Editor for Matching Pairs */}
            {currentStep.type === 'matching_pairs' && (currentStep as any).pairs && (
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-black text-slate-700">Pairs ({((currentStep as any).pairs || []).length})</span>
                {((currentStep as any).pairs || []).map((pair: any, idx: number) => (
                  <div key={pair.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{pair.leftIcon}</span>
                      <div className="truncate">
                        <span className="font-black text-xs text-slate-900 block truncate">{pair.leftText} ➔ {pair.rightText}</span>
                        <span className="text-[10px] font-bold text-slate-500 truncate">{pair.explanation}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updatedPairs = ((currentStep as any).pairs || []).filter((_: any, i: number) => i !== idx);
                        const updated = [...missionConfig.steps];
                        updated[activeStepIndex] = { ...currentStep, pairs: updatedPairs } as any;
                        setMissionConfig({ ...missionConfig, steps: updated });
                        setPreviewKey((k) => k + 1);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Editor for 2D Interactive Diagram Hotspots */}
            {currentStep.type === 'interactive_diagram' && (currentStep as any).hotspots && (
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-black text-slate-700">Stage Hotspots ({((currentStep as any).hotspots || []).length})</span>
                {((currentStep as any).hotspots || []).map((spot: any, idx: number) => (
                  <div key={spot.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{spot.icon}</span>
                      <div className="truncate">
                        <span className="font-black text-xs text-slate-900 block truncate">{spot.title}</span>
                        <span className="text-[10px] font-bold text-slate-500 truncate">{spot.explanation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (6 Cols): Live Interactive Student Preview
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col gap-4 sticky top-20">
          <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="font-black text-xs uppercase tracking-wider text-slate-700">
                Live Interactive Student Preview
              </span>
            </div>

            {/* Device Frame Viewport Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {[
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                { id: 'tablet', icon: Tablet, label: 'Tablet (iPad)' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              ].map((d) => {
                const Icon = d.icon;
                const isActive = previewDevice === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setPreviewDevice(d.id as any)}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      isActive ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title={d.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Frame Stage */}
          <div className="w-full flex justify-center bg-slate-900/5 p-3 sm:p-4 rounded-3xl border-2 border-dashed border-slate-300 min-h-[520px] overflow-x-auto">
            <div
              className={`transition-all duration-300 flex flex-col items-center justify-center ${
                previewDevice === 'mobile'
                  ? 'w-[375px] max-w-full bg-slate-50 rounded-[40px] p-3 sm:p-4 shadow-2xl border-6 border-slate-800 my-2'
                  : previewDevice === 'tablet'
                  ? 'w-[720px] max-w-full bg-slate-50 rounded-3xl p-4 shadow-2xl border-6 border-slate-800 my-2'
                  : 'w-full'
              }`}
            >
              {/* Phone Notch Header in Mobile Preview */}
              {previewDevice === 'mobile' && (
                <div className="w-full flex items-center justify-center mb-3">
                  <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-end px-2">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                  </div>
                </div>
              )}

              <div key={previewKey} className="w-full">
                <ActivityRenderer
                  stepData={currentStep}
                  onComplete={() => setPreviewCompleted(true)}
                  isCompleted={previewCompleted}
                />
              </div>

              {previewCompleted && (
                <div className="mt-4 p-3 bg-emerald-100 border border-emerald-400 rounded-2xl text-center text-xs font-black text-emerald-950 w-full">
                  🎉 Activity Completed Successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
