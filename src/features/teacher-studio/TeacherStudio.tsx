import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  LessonMissionConfig,
  LessonStepData,
  ActivityType,
} from '@/types/lessonEngine';
import { ActivityRenderer } from '@/components/engine/ActivityRenderer';
import { generateLessonFromPrompt, generateFallbackLessonConfig } from '@/lib/geminiService';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Smartphone,
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
  Home,
  ChevronRight,
  PlusCircle,
  Play,
} from 'lucide-react';

const ACTIVITY_CATALOG: { type: ActivityType; label: string; icon: string; desc: string }[] = [
  { type: 'water_absorption_lab', label: 'Water Absorption Lab', icon: '💧', desc: 'Spray test to compare absorbent vs waterproof materials' },
  { type: 'microscopic_zoom_viewer', label: 'Microscope Studio', icon: '🔬', desc: 'Interactive magnifications (1x, 100x, 500x) with real scale bars' },
  { type: 'sorting_tray', label: 'Classification Sorting Trays', icon: '🗂️', desc: 'Drag or tap specimens into classification groups' },
  { type: 'tensile_strength_rig', label: 'Tensile Strength Rig', icon: '⚖️', desc: 'Add weight loads to test tensile limits and snapping points' },
  { type: 'matching_pairs', label: 'Matching Pairs Game', icon: '🔗', desc: 'Connect everyday objects to their scientific superpowers' },
  { type: 'mcq_assessment', label: 'Inquiry Challenge Quiz', icon: '❓', desc: 'Formative questions with instant feedback and explanations' },
  { type: 'scenario_sim', label: 'Interactive Scenario Lab', icon: '🌤️', desc: 'Evaluate material performance under simulated conditions' },
  { type: 'interactive_diagram', label: 'Interactive Diagram', icon: '🗺️', desc: 'Clickable diagram stages with hotspots' },
  { type: 'read_aloud_coach', label: 'Speech Fluency Coach', icon: '🗣️', desc: 'Voice coaching for scientific vocabulary' },
  { type: 'concept_summary', label: 'Golden Law Synthesis', icon: '⚡', desc: '3-Pillar summary: Material ➔ Property ➔ Use' },
];

function createBlankStep(type: ActivityType, index: number): LessonStepData {
  switch (type) {
    case 'water_absorption_lab':
      return {
        id: `step-${Date.now()}`,
        type: 'water_absorption_lab',
        title: 'Water Absorption Testing Lab',
        subtitle: 'Observe how natural vs synthetic materials react to moisture',
        pipPrompt: 'Spray water droplets onto each fabric to see if it absorbs moisture or beads off!',
        specimens: [
          { id: 'mat-1', name: 'Cotton Swatch', materialType: 'cotton', category: 'Natural', dryImage: '', wetImage: '', isHydrophobic: false, absorptionRateSec: 2, description: 'Porous cellulose plant fibers absorb water rapidly', microscopicNote: 'Hollow ribbon fibers soak up moisture' },
          { id: 'mat-2', name: 'Polyester Swatch', materialType: 'polyester', category: 'Synthetic', dryImage: '', wetImage: '', isHydrophobic: true, absorptionRateSec: 999, description: 'Smooth synthetic polymer repels water', microscopicNote: 'Tight extruded filament weave causes water to bead up' },
        ],
      };
    case 'sorting_tray':
      return {
        id: `step-${Date.now()}`,
        type: 'sorting_tray',
        title: 'Material Classification Desk',
        subtitle: 'Sort specimens into the correct scientific category',
        pipPrompt: 'Help me classify each specimen into Natural or Synthetic!',
        trays: [
          { id: 'natural', title: 'From Nature', subtitle: 'Plants, animals, and earth', icon: '🌿', color: 'border-emerald-400 bg-emerald-50' },
          { id: 'synthetic', title: 'Made in Labs', subtitle: 'Chemical polymers', icon: '🏭', color: 'border-sky-400 bg-sky-50' },
        ],
        items: [
          { id: 'item-1', name: 'Cotton Boll', emoji: '🌿', correctTrayId: 'natural', feedback: 'Cotton grows naturally on plant bushes!' },
          { id: 'item-2', name: 'Nylon Thread', emoji: '🧵', correctTrayId: 'synthetic', feedback: 'Nylon is synthesized from petroleum in factories!' },
          { id: 'item-3', name: 'Sheep Wool', emoji: '🐑', correctTrayId: 'natural', feedback: 'Wool comes directly from sheep fleece!' },
          { id: 'item-4', name: 'Plastic Bottle', emoji: '🫙', correctTrayId: 'synthetic', feedback: 'PET plastic is a synthetic polymer!' },
        ],
      };
    case 'matching_pairs':
      return {
        id: `step-${Date.now()}`,
        type: 'matching_pairs',
        title: 'Match Superpowers to Uses',
        subtitle: 'Connect each object to its primary scientific property',
        instruction: 'Tap an object on the left, then tap its matching superpower on the right!',
        pairs: [
          { id: 'p-1', leftItem: 'Raincoat', leftIcon: '🧥', rightProperty: 'Waterproof & Lightweight', explanation: 'Polyester repels rainwater easily!' },
          { id: 'p-2', leftItem: 'Climbing Rope', leftIcon: '🪢', rightProperty: 'High Tensile Strength', explanation: 'Nylon holds climbers safely!' },
          { id: 'p-3', leftItem: 'Kettle Handle', leftIcon: '🫖', rightProperty: 'Heat-Resistant Thermoset', explanation: 'Bakelite plastic stays cool on stoves!' },
        ],
      };
    case 'mcq_assessment':
      return {
        id: `step-${Date.now()}`,
        type: 'mcq_assessment',
        title: 'Science Discovery Checkpoint',
        question: 'Why does synthetic polyester make a superior raincoat compared to 100% natural cotton?',
        conceptBadge: 'Material Physics',
        explanation: 'Synthetic polyester fibers are tightly extruded without hollow capillary pores, causing rainwater to bead up and roll off.',
        options: [
          { id: 'opt-1', text: 'Polyester has non-porous synthetic fibers that repel liquid water droplets', isCorrect: true, feedback: 'Correct! Water beads up and rolls off smooth polyester fibers.' },
          { id: 'opt-2', text: 'Cotton is completely waterproof and never gets heavy in rain', isCorrect: false, feedback: 'Not quite! Cotton absorbs water until it gets soaked and heavy.' },
        ],
      };
    case 'concept_summary':
      return {
        id: `step-${Date.now()}`,
        type: 'concept_summary',
        title: 'The Golden Science Law',
        subtitle: 'Core Scientific Principle',
        pipPrompt: 'Remember our golden law: What something is MADE FROM decides what it CAN DO!',
        principles: [
          { icon: '🧱', title: '1. Made From', description: 'Natural plants/animals or synthetic factory polymers' },
          { icon: '⚡', title: '2. Superpower', description: 'Tensile strength, water repellency, heat resistance' },
          { icon: '🎯', title: '3. Used For', description: 'Everyday applications matched to physical traits' },
        ],
      };
    default:
      return {
        id: `step-${Date.now()}`,
        type: 'microscopic_zoom_viewer',
        title: 'Microscopic Zoom Studio',
        subtitle: 'Examine specimen microstructure at multiple magnifications',
        specimenName: 'Natural Plant Cellulose',
        specimenCategory: 'Natural Specimen',
        pipPrompt: 'Use the zoom reticle to inspect the fiber alignment under high optical magnification!',
        tiers: [
          { magnification: '1x Macro', label: 'Specimen Surface', image: '', scaleBarText: '10 mm', structuralFeatures: ['Visible texture', 'Surface fibers'], scientificExplanation: 'Macroscopic inspection shows woven natural filaments.' },
          { magnification: '400x Optical', label: 'Microstructure', image: '', scaleBarText: '50 µm', structuralFeatures: ['Hollow capillary pores', 'Cellulose wall'], scientificExplanation: 'High-power light microscopy reveals fine cellular pores.' },
        ],
      };
  }
}

const DEFAULT_CLEAN_LESSON: LessonMissionConfig = {
  id: 'custom-lesson-1',
  themeId: 'materials',
  title: 'Natural vs Synthetic Materials Lab',
  subtitle: 'Grade 5 Hands-On Science Discovery',
  targetGrade: 5,
  badgeReward: 'Polymer Pioneer ⭐',
  steps: [
    createBlankStep('water_absorption_lab', 0),
    createBlankStep('sorting_tray', 1),
    createBlankStep('mcq_assessment', 2),
  ],
};

export function TeacherStudio() {
  const navigate = useNavigate();

  const [missionConfig, setMissionConfig] = useState<LessonMissionConfig>(DEFAULT_CLEAN_LESSON);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const steps = missionConfig?.steps || [];
  const currentStep: LessonStepData = steps[activeStepIndex] || steps[0] || createBlankStep('water_absorption_lab', 0);

  // AI Generator
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    sounds.pop();
    setIsGenerating(true);
    voiceAssistant.stop();

    try {
      const generated = await generateLessonFromPrompt(aiPrompt, missionConfig.targetGrade || 5);
      sounds.fanfare();
      setMissionConfig(generated);
      setActiveStepIndex(0);
      setPreviewKey((k) => k + 1);
    } catch {
      sounds.boing();
      const fallback = generateFallbackLessonConfig(aiPrompt);
      setMissionConfig(fallback);
      setActiveStepIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddStep = (type: ActivityType) => {
    sounds.pop();
    const newStep = createBlankStep(type, steps.length);
    setMissionConfig((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setActiveStepIndex(steps.length);
    setShowAddDrawer(false);
    setPreviewKey((k) => k + 1);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert('A lesson must have at least 1 activity step.');
      return;
    }
    sounds.pop();
    const updated = steps.filter((_, i) => i !== index);
    setMissionConfig((prev) => ({ ...prev, steps: updated }));
    setActiveStepIndex(Math.max(0, index - 1));
    setPreviewKey((k) => k + 1);
  };

  const handleUpdateStepTitle = (title: string) => {
    setMissionConfig((prev) => {
      const updated = [...prev.steps];
      if (updated[activeStepIndex]) {
        updated[activeStepIndex] = { ...updated[activeStepIndex], title };
      }
      return { ...prev, steps: updated };
    });
  };

  const handleCopyJson = () => {
    sounds.sparkle();
    navigator.clipboard.writeText(JSON.stringify(missionConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col select-none">
      {/* ── Top Bar (Minimal, Apple-Clean) ── */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-30 shadow-xs">
        {/* Left: Navigation & Studio Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/subjects')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
            title="Return to Subjects"
          >
            <Home className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Teacher Activity Studio 🎓
              </span>
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                CBSE Grade 5
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 block -mt-0.5 truncate max-w-xs">
              {missionConfig.title}
            </span>
          </div>
        </div>

        {/* Center: AI Quick-Prompt */}
        <div className="hidden md:flex items-center gap-2 max-w-md w-full bg-slate-100 rounded-2xl px-3 py-1.5 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
          <Wand2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="Type any topic (e.g. Friction, Digestion, Water Cycle)..."
            className="w-full text-xs font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs cursor-pointer shrink-0 transition-all"
          >
            {isGenerating ? 'Building...' : 'Generate ✨'}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyJson}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Export JSON'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ── Left Sidebar: Steps Timeline ── */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Lesson Steps ({steps.length})
              </span>
              <button
                onClick={() => setShowAddDrawer(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            {/* Step Pills */}
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                const cat = ACTIVITY_CATALOG.find((c) => c.type === step.type);

                return (
                  <div
                    key={step.id || idx}
                    onClick={() => {
                      sounds.pop();
                      setActiveStepIndex(idx);
                      setPreviewKey((k) => k + 1);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{cat?.icon || '🔬'}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 block font-mono">Step {idx + 1}</span>
                        <span className="text-xs font-black text-slate-800 truncate block">{step.title}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(idx);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors shrink-0"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Presets Footer */}
          <div className="pt-4 border-t border-slate-200 mt-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Quick CBSE Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { title: '🌿 Natural vs Synthetic', prompt: 'natural vs synthetic materials cotton nylon polyester' },
                { title: '🦋 Super Senses & Living World', prompt: 'super senses ant pheromones eagle eyes snake hearing' },
                { title: '🌊 Water Density & Buoyancy', prompt: 'water buoyancy floating sinking dead sea salt' },
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAiPrompt(p.prompt);
                    sounds.pop();
                  }}
                  className="text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200 truncate cursor-pointer"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Panel: Live Interactive Simulator & Editor ── */}
        <main className="flex-1 bg-slate-100 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto">
          {/* Editor Tabs & Step Header */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs font-mono">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
              <input
                type="text"
                value={currentStep.title}
                onChange={(e) => handleUpdateStepTitle(e.target.value)}
                className="text-sm font-black text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none px-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.pop();
                  setPreviewKey((k) => k + 1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </button>
            </div>
          </div>

          {/* Device Viewport Canvas */}
          <div
            className={`transition-all duration-300 flex flex-col items-center justify-center ${
              previewDevice === 'mobile'
                ? 'w-[380px] min-h-[640px] bg-slate-900 rounded-[44px] p-3 border-8 border-slate-800 shadow-2xl relative'
                : 'w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm'
            }`}
          >
            {previewDevice === 'mobile' ? (
              <div className="w-full h-full bg-white rounded-[32px] overflow-y-auto p-4 flex flex-col items-center">
                <ActivityRenderer
                  key={`${currentStep.id}-${previewKey}`}
                  stepData={currentStep}
                  onComplete={() => sounds.fanfare()}
                  onStepComplete={() => sounds.fanfare()}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <ActivityRenderer
                  key={`${currentStep.id}-${previewKey}`}
                  stepData={currentStep}
                  onComplete={() => sounds.fanfare()}
                  onStepComplete={() => sounds.fanfare()}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Add Step Modal / Catalog Drawer ── */}
      <AnimatePresence>
        {showAddDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-[32px] border-4 border-indigo-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Choose Activity Engine Type 🔬
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Pick any interactive experiment engine for this step</span>
                </div>
                <button
                  onClick={() => setShowAddDrawer(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ACTIVITY_CATALOG.map((cat) => (
                  <button
                    key={cat.type}
                    onClick={() => handleAddStep(cat.type)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all cursor-pointer flex items-start gap-3 shadow-xs"
                  >
                    <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                      {cat.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 mb-0.5">{cat.label}</h4>
                      <p className="text-[11px] font-bold text-slate-500 leading-snug">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
