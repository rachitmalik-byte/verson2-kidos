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
  CheckCircle2,
  FlaskConical,
  Scale,
  FileCode,
  Lightbulb,
} from 'lucide-react';

const ACTIVITY_TYPES: { type: ActivityType; label: string; icon: string; description: string }[] = [
  { type: 'water_absorption_lab', label: 'Water Absorption Lab', icon: '💧', description: 'Spray water droplets to compare absorbent vs waterproof materials' },
  { type: 'microscopic_zoom_viewer', label: 'Microscope Studio', icon: '🔬', description: 'Interactive progressive magnifications (1x, 40x, 400x, 1500x) with scale bars' },
  { type: 'sorting_tray', label: 'Classification Sorting Trays', icon: '🗂️', description: 'Drag or tap specimens into classification trays (Natural, Synthetic, etc.)' },
  { type: 'tensile_strength_rig', label: 'Tensile Strength Rig', icon: '⚖️', description: 'Add weight loads to test material tensile strength and snapping points' },
  { type: 'matching_pairs', label: 'Matching Pairs Game', icon: '🔗', description: 'Connect everyday objects to their physical properties and uses' },
  { type: 'mcq_assessment', label: 'Challenge MCQ Quiz', icon: '❓', description: 'Formative questions with instant feedback and science explanations' },
  { type: 'scenario_sim', label: 'Scenario Simulation', icon: '🌤️', description: 'Evaluate material performance under rain, heat, or fire conditions' },
  { type: 'interactive_diagram', label: 'Interactive Diagram', icon: '🗺️', description: 'Clickable hotspot diagram to explore structural components' },
  { type: 'read_aloud_coach', label: 'Speech Fluency Coach', icon: '🗣️', description: 'Voice coaching for correct scientific terminology pronunciation' },
  { type: 'concept_summary', label: 'Golden Law Synthesis', icon: '⚡', description: '3-Pillar summary: Material ➔ Property ➔ Real-World Use' },
];

const PRESET_TEMPLATES = [
  { label: '💧 Water Cycle & Evaporation', query: 'water cycle evaporation and condensation' },
  { label: '🌿 Natural vs Synthetic Polymers', query: 'natural vs synthetic materials cotton nylon polyester' },
  { label: '🐾 Super Senses & Living World', query: 'animal senses ant pheromones eagle eyesight snake vibrations' },
  { label: '⛰️ Shelter, Mountains & Pashmina', query: 'pashmina wool changpa tribe mountain insulation' },
  { label: '⚡ Electricity & Circuit Conductors', query: 'electrical conductors insulators copper wire pvc' },
];

export function TeacherStudio() {
  const navigate = useNavigate();

  // Active Draft Mission
  const [missionConfig, setMissionConfig] = useState<LessonMissionConfig>(() => {
    return generateFallbackLessonConfig('water cycle');
  });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [previewCompleted, setPreviewCompleted] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [editorMode, setEditorMode] = useState<'visual' | 'json'>('visual');

  const currentStep = missionConfig.steps[activeStepIndex] || missionConfig.steps[0];

  // AI Generator
  const handleAiGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    sounds.pop();
    setIsGenerating(true);
    voiceAssistant.stop();

    try {
      const generated = await generateLessonFromPrompt(promptToUse, missionConfig.targetGrade || 5);
      sounds.fanfare();
      setMissionConfig(generated);
      setActiveStepIndex(0);
      setPreviewCompleted(false);
      setPreviewKey((k) => k + 1);
    } catch (err) {
      sounds.boing();
    } finally {
      setIsGenerating(false);
    }
  };

  // Add Step
  const handleAddStep = (type: ActivityType) => {
    sounds.pop();
    const newStepId = `step-${Date.now()}`;
    let newStep: LessonStepData;

    switch (type) {
      case 'water_absorption_lab':
        newStep = {
          id: newStepId,
          type: 'water_absorption_lab',
          title: 'Water Absorption Test',
          subtitle: 'Hydrophobic vs Hydrophilic Surfaces',
          pipPrompt: 'Spray water droplets to test which fabric absorbs moisture fastest!',
          pipMood: 'curious',
          learningGoal: 'Discover which materials create waterproof barriers',
          specimens: [
            {
              id: 'cotton',
              name: 'Cotton Swatch',
              materialType: 'cotton',
              category: 'Natural',
              dryImage: 'cotton_swatch_clean.jpg',
              wetImage: 'cotton_coat_soaked.jpg',
              isHydrophobic: false,
              absorptionRateSec: 2,
              description: 'Natural porous cellulose fibers absorb water rapidly',
              microscopicNote: 'Porous twisted ribbon fibers soak up moisture',
            },
            {
              id: 'polyester',
              name: 'Polyester Swatch',
              materialType: 'polyester',
              category: 'Synthetic',
              dryImage: 'polyester_swatch_clean.jpg',
              wetImage: 'polyester_raincoat_dry.jpg',
              isHydrophobic: true,
              absorptionRateSec: 999,
              description: 'Synthetic non-porous polymer causes water to bead up',
              microscopicNote: 'Smooth extruded synthetic filaments form a waterproof seal',
            },
          ],
        };
        break;

      case 'microscopic_zoom_viewer':
        newStep = {
          id: newStepId,
          type: 'microscopic_zoom_viewer',
          title: 'Microscope Specimen Studio',
          subtitle: 'Multi-Tier Optical Magnification',
          pipPrompt: 'Adjust optical focus to examine microscopic structures!',
          pipMood: 'explaining',
          specimenName: 'Natural Cotton Boll',
          specimenCategory: 'Natural',
          tiers: [
            {
              magnification: '1x',
              label: '1x Macro Specimen',
              image: 'raw_cotton_boll.jpg',
              scaleBarText: '10 mm',
              structuralFeatures: ['Fluffy cotton boll', 'Protective seed coating'],
              scientificExplanation: 'Natural cellulose hair growing on seed pods.',
            },
            {
              magnification: '100x',
              label: '400x High-Power Optical',
              image: 'cotton_micrograph_100x.jpg',
              scaleBarText: '50 µm',
              structuralFeatures: ['Twisted hollow lumen', 'Flat ribbon shape'],
              scientificExplanation: 'Cellulose fibers are flat ribbons with central air channels.',
            },
          ],
        };
        break;

      case 'sorting_tray':
        newStep = {
          id: newStepId,
          type: 'sorting_tray',
          title: 'Classification Sorting Trays',
          subtitle: 'Natural vs Synthetic Classification',
          pipPrompt: 'Tap a specimen, then tap its matching tray!',
          pipMood: 'curious',
          trays: [
            {
              id: 'natural',
              title: '🌿 From Nature',
              icon: '🌿',
              themeColor: 'sage',
              allowedCategories: ['natural'],
              description: 'Harvested from plants, animals, or soil',
            },
            {
              id: 'synthetic',
              title: '🏭 Human-Made',
              icon: '🏭',
              themeColor: 'sky',
              allowedCategories: ['synthetic'],
              description: 'Synthesized from petrochemicals in factories',
            },
          ],
          items: [
            { id: 'item-1', name: 'Cotton Boll', icon: '🌿', category: 'natural', hint: 'Harvested from cotton plants!', originDetails: 'Plant cellulose' },
            { id: 'item-2', name: 'Nylon Rope', icon: '🧵', category: 'synthetic', hint: 'Synthesized in a chemical plant!', originDetails: 'Petrochemical polymer' },
            { id: 'item-3', name: 'Sheep Wool', icon: '🐑', category: 'natural', hint: 'Sheared from sheep fleece!', originDetails: 'Animal keratin' },
            { id: 'item-4', name: 'Plastic Bottle', icon: '🧴', category: 'synthetic', hint: 'Molded from PET polymers!', originDetails: 'Synthetic polymer' },
          ],
        };
        break;

      case 'tensile_strength_rig':
        newStep = {
          id: newStepId,
          type: 'tensile_strength_rig',
          title: 'Tensile Strength Testing Rig',
          subtitle: 'Load-Bearing Suspension Test',
          pipPrompt: 'Hang heavier weights on each cord to test when it snaps!',
          pipMood: 'thinking',
          specimens: [
            { id: 'cotton', name: 'Cotton Thread', materialType: 'cotton', maxWeightGrams: 50, breakBehavior: 'snaps', description: 'Breaks at 50g load' },
            { id: 'nylon', name: 'Nylon Cord', materialType: 'nylon', maxWeightGrams: 500, breakBehavior: 'holds', description: 'Holds 500g load easily' },
          ],
        };
        break;

      case 'mcq_assessment':
        newStep = {
          id: newStepId,
          type: 'mcq_assessment',
          title: 'Concept Challenge Checkpoint',
          subtitle: 'Formative Assessment',
          pipPrompt: 'What key scientific law did we discover today?',
          pipMood: 'celebrating',
          question: 'Why does cotton absorb water while polyester repels water?',
          options: [
            { text: 'Cotton has porous cellulose fibers that draw in water', isCorrect: true, feedback: 'Correct! Porous cellulose fibers soak up moisture easily.' },
            { text: 'Polyester has tiny sponge holes inside', isCorrect: false, feedback: 'Incorrect! Polyester is a synthetic non-porous polymer.' },
          ],
          explanation: 'Molecular structure and porosity determine whether a material absorbs or repels liquids.',
        };
        break;

      default:
        newStep = {
          id: newStepId,
          type: 'concept_summary',
          title: 'The Golden Science Law',
          subtitle: 'Core Concept Synthesis',
          pipPrompt: 'Remember our Golden Science Triangle!',
          pipMood: 'celebrating',
          conceptName: 'Material-Property-Use Relationship',
          principles: [
            { icon: '🧱', title: 'What it is Made From', description: 'Molecular structure determines physical traits.' },
            { icon: '⚡', title: 'What it Can Do', description: 'Properties like strength, waterproofing, and heat resistance.' },
            { icon: '🎯', title: 'What it is Used For', description: 'Practical everyday applications based on its properties.' },
          ],
        };
    }

    setMissionConfig((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setActiveStepIndex(missionConfig.steps.length);
  };

  const handleDeleteStep = (idx: number) => {
    if (missionConfig.steps.length <= 1) return;
    sounds.pop();
    setMissionConfig((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx),
    }));
    setActiveStepIndex(Math.max(0, idx - 1));
  };

  const handleUpdateCurrentStep = (updates: Partial<LessonStepData>) => {
    setMissionConfig((prev) => {
      const nextSteps = [...prev.steps];
      nextSteps[activeStepIndex] = {
        ...nextSteps[activeStepIndex],
        ...updates,
      } as LessonStepData;
      return { ...prev, steps: nextSteps };
    });
    setPreviewKey((k) => k + 1);
  };

  const handleCopyJson = () => {
    sounds.pop();
    navigator.clipboard.writeText(JSON.stringify(missionConfig, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* ── 1. Minimal Top Navigation Bar ── */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/chapter-hub');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            title="Exit to Chapter Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Chapter Hub</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <h1 className="text-sm sm:text-base font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Teacher Activity Studio 🔬
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Grade {missionConfig.targetGrade || 5}
              </span>
            </div>
          </div>
        </div>

        {/* Device Viewport Toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                previewDevice === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                previewDevice === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                previewDevice === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all active:scale-95"
            title="Copy Lesson JSON"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedJson ? 'Copied!' : 'Export JSON'}</span>
          </button>
        </div>
      </header>

      {/* ── 2. AI Quick-Lesson Generator Strip ── */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[260px] flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 focus-within:border-indigo-500">
          <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="Type any science topic (e.g. 'Photosynthesis', 'States of Matter', 'Animal Senses')..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden font-bold"
          />
          <button
            onClick={() => handleAiGenerate()}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs cursor-pointer transition-all shrink-0"
          >
            {isGenerating ? 'Synthesizing...' : 'Generate AI Lesson ✨'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">Presets:</span>
          {PRESET_TEMPLATES.map((tmpl, i) => (
            <button
              key={i}
              onClick={() => {
                setAiPrompt(tmpl.query);
                handleAiGenerate(tmpl.query);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold shrink-0 cursor-pointer transition-all border border-slate-700"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Main Workspace: Step Timeline + Editor + Live Interactive Preview ── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Step List & Visual Editor (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-110px)] overflow-y-auto p-4 sm:p-5 gap-4">
          {/* Step Sequence Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Lesson Activity Sequence ({missionConfig.steps.length} Steps)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {missionConfig.steps.map((st, sIdx) => {
                const isSelected = sIdx === activeStepIndex;
                const act = ACTIVITY_TYPES.find((a) => a.type === st.type);
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      sounds.pop();
                      setActiveStepIndex(sIdx);
                      setPreviewCompleted(false);
                      setPreviewKey((k) => k + 1);
                    }}
                    className={`px-3 py-2 rounded-xl border-2 text-left cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md scale-102 ring-2 ring-indigo-400/50'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">{act?.icon || '🔬'}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] opacity-75 font-mono block">Step {sIdx + 1}</span>
                      <span className="text-xs font-black truncate block max-w-[110px]">{st.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add New Step Drawer Menu */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 block mb-2">
              + Add Any Experiment or Activity:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {ACTIVITY_TYPES.map((act) => (
                <button
                  key={act.type}
                  onClick={() => handleAddStep(act.type)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/60 text-left cursor-pointer transition-all flex items-center gap-2"
                  title={act.description}
                >
                  <span className="text-lg">{act.icon}</span>
                  <span className="text-[11px] font-bold text-slate-200 truncate">{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Form Editor */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black uppercase text-indigo-400">
                Editing Step {activeStepIndex + 1}: {currentStep.type}
              </span>
              <button
                onClick={() => handleDeleteStep(activeStepIndex)}
                disabled={missionConfig.steps.length <= 1}
                className="p-1 rounded-lg text-rose-400 hover:bg-rose-950 disabled:opacity-30 cursor-pointer transition-all"
                title="Delete this step"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Activity Title</label>
              <input
                type="text"
                value={currentStep.title}
                onChange={(e) => handleUpdateCurrentStep({ title: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-bold"
              />
            </div>

            {/* Pip's Instructional Prompt */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Pip's Mascot Prompt (1-2 sentences)</label>
              <textarea
                rows={2}
                value={currentStep.pipPrompt}
                onChange={(e) => handleUpdateCurrentStep({ pipPrompt: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-bold resize-none"
              />
            </div>

            {/* Activity-Specific Controls */}
            {currentStep.type === 'sorting_tray' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-black text-amber-300">🗂️ Sorting Trays Config:</span>
                <p className="text-[10px] text-slate-400">
                  Total Trays: <strong>{((currentStep as any).trays || []).length}</strong> | Total Items: <strong>{((currentStep as any).items || []).length}</strong>
                </p>
              </div>
            )}

            {currentStep.type === 'microscopic_zoom_viewer' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-black text-amber-300">🔬 Microscope Studio Config:</span>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-bold">Specimen Name</label>
                  <input
                    type="text"
                    value={(currentStep as any).specimenName || ''}
                    onChange={(e) => handleUpdateCurrentStep({ specimenName: e.target.value } as any)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {currentStep.type === 'water_absorption_lab' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-black text-amber-300">💧 Water Absorption Lab:</span>
                <p className="text-[10px] text-slate-400">
                  Specimens configured: <strong>{((currentStep as any).specimens || []).length}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Live Simulator Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 flex flex-col h-[calc(100vh-110px)] overflow-y-auto p-4 sm:p-6 items-center justify-start">
          <div className="w-full flex items-center justify-between mb-4 max-w-4xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Student Simulator (Live Preview)</span>
            </span>

            <button
              onClick={() => {
                sounds.pop();
                setPreviewKey((k) => k + 1);
                setPreviewCompleted(false);
              }}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Step</span>
            </button>
          </div>

          {/* Interactive Simulation Frame */}
          <div
            className={`w-full transition-all duration-300 bg-slate-900/60 p-4 sm:p-6 rounded-[36px] border-3 border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[500px] ${
              previewDevice === 'mobile'
                ? 'max-w-sm'
                : previewDevice === 'tablet'
                ? 'max-w-2xl'
                : 'max-w-4xl'
            }`}
          >
            <ActivityRenderer
              key={`${currentStep.id}-${previewKey}`}
              stepData={currentStep}
              onStepComplete={() => {
                sounds.fanfare();
                setPreviewCompleted(true);
              }}
              isCompleted={previewCompleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
