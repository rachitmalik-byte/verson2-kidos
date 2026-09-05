import React, { useState } from 'react';
import type {
  LessonStepData,
  ActivityType,
  WaterSpecimen,
  MicroscopicZoomTier,
  SortingItem,
  SortingTray,
  MatchingPairItem,
  McqOption,
  TensileSpecimen,
  DiagramHotspot,
} from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import {
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Type,
  MessageSquare,
  HelpCircle,
  Layers,
  CheckCircle2,
  XCircle,
  Tag,
  Clock,
  Award,
  Volume2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Settings2,
  Bot,
  Compass,
  Zap,
} from 'lucide-react';

interface Props {
  step: LessonStepData;
  onChange: (updated: LessonStepData) => void;
}

const ACTIVITY_TYPES: { type: ActivityType; label: string; icon: string; desc: string }[] = [
  { type: 'water_absorption_lab', label: 'Water Absorption Lab', icon: '💧', desc: 'Fluid absorption & contact angle tester' },
  { type: 'microscopic_zoom_viewer', label: 'Microscope Studio', icon: '🔬', desc: '1x to 500x magnifications with scale bars' },
  { type: 'sorting_tray', label: 'Classification Sorting Trays', icon: '🗂️', desc: 'Specimen grouping into color-coded trays' },
  { type: 'tensile_strength_rig', label: 'Tensile Strength Rig', icon: '⚖️', desc: 'Weight load limits and snap point testing' },
  { type: 'matching_pairs', label: 'Matching Pairs Game', icon: '🔗', desc: 'Object to scientific property connection' },
  { type: 'mcq_assessment', label: 'Inquiry Challenge Quiz', icon: '❓', desc: 'Formative questions with instant feedback' },
  { type: 'interactive_diagram', label: 'Interactive Diagram Map', icon: '🗺️', desc: 'Hotspots with animations and scientific facts' },
  { type: 'read_aloud_coach', label: 'Speech Fluency Coach', icon: '🗣️', desc: 'Pronunciation and scientific vocabulary practice' },
  { type: 'scenario_sim', label: 'Interactive Scenario Lab', icon: '🌤️', desc: 'Real-world choice & outcome simulator' },
  { type: 'concept_summary', label: 'Golden Law Synthesis', icon: '⚡', desc: '3-Pillar summary: Material ➔ Superpower ➔ Use' },
];

export const StepPropertyEditor: React.FC<Props> = ({ step, onChange }) => {
  const [showOptionalOptions, setShowOptionalOptions] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({ ...step, [field]: value });
  };

  return (
    <div className="w-full flex flex-col gap-5 p-4 sm:p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs text-slate-900 font-sans select-none overflow-y-auto max-h-[750px]">
      {/* ── 1. General Step Meta ── */}
      <div className="space-y-3.5 border-b border-slate-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Activity Engine Type</span>
          </span>
          <select
            value={step.type}
            onChange={(e) => updateField('type', e.target.value as ActivityType)}
            className="text-xs font-black bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
            Activity Title
          </label>
          <input
            type="text"
            value={step.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Water Absorption Testing Lab"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
            Subtitle / Learning Objective
          </label>
          <input
            type="text"
            value={step.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="e.g. Compare natural cellulose vs synthetic polymers"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase text-slate-500 block mb-1 flex items-center justify-between">
            <span>Pip's Spoken Mascot Dialogue</span>
            <span className="text-[10px] text-indigo-600 font-bold lowercase">Spoken aloud by TTS</span>
          </label>
          <textarea
            rows={2}
            value={step.pipPrompt || ''}
            onChange={(e) => updateField('pipPrompt', e.target.value)}
            placeholder="What should Pip say to guide the student?"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* ── 2. Functional Optional Options Accordion ── */}
      <div className="border border-indigo-100 rounded-2xl bg-indigo-50/30 overflow-hidden">
        <button
          onClick={() => setShowOptionalOptions(!showOptionalOptions)}
          className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-indigo-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
              Advanced & Optional Parameters
            </span>
            <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
              Pacing, Pip AI, Hints & Rewards
            </span>
          </div>
          {showOptionalOptions ? (
            <ChevronUp className="w-4 h-4 text-indigo-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {showOptionalOptions && (
          <div className="p-4 bg-white border-t border-indigo-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Pip AI Mood */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pip Mascot Mood</span>
                </label>
                <select
                  value={step.pipMood || 'curious'}
                  onChange={(e) => updateField('pipMood', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="curious">Curious (Head tilted) 🔍</option>
                  <option value="explaining">Explaining (Science goggles) 👓</option>
                  <option value="thinking">Thinking (Pondering) 🤔</option>
                  <option value="celebrating">Celebrating (Party sparkles) 🎉</option>
                  <option value="hinting">Hinting (Lightbulb cue) 💡</option>
                  <option value="encouraging">Encouraging (Supportive smile) ⭐</option>
                </select>
              </div>

              {/* Concept Badge */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Concept Superpower Badge</span>
                </label>
                <input
                  type="text"
                  value={step.conceptBadge || ''}
                  onChange={(e) => updateField('conceptBadge', e.target.value)}
                  placeholder="e.g. HYDROPHOBIC LATTICE"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              {/* Optional Hint */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Scaffolding Student Hint</span>
                </label>
                <input
                  type="text"
                  value={(step as any).hint || ''}
                  onChange={(e) => updateField('hint', e.target.value)}
                  placeholder="e.g. Notice how plant fibers have capillary tubes"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              {/* Audio Prompt */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Accessibility Audio Prompt</span>
                </label>
                <input
                  type="text"
                  value={step.audioPrompt || ''}
                  onChange={(e) => updateField('audioPrompt', e.target.value)}
                  placeholder="e.g. Listen carefully to the breaking sound"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Type-Specific Config Editors ── */}

      {/* 💧 WATER ABSORPTION LAB EDITOR */}
      {step.type === 'water_absorption_lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Test Specimens ({((step as any).specimens || []).length})
            </span>
            <button
              onClick={() => {
                const existing = (step as any).specimens || [];
                const newSpecimen: WaterSpecimen = {
                  id: `mat-${Date.now()}`,
                  name: 'New Fabric Swatch',
                  materialType: 'nylon',
                  category: 'Synthetic',
                  dryImage: '',
                  wetImage: '',
                  isHydrophobic: true,
                  absorptionRateSec: 999,
                  description: 'Synthetic non-porous polymer weave',
                  microscopicNote: 'Repels moisture droplets',
                };
                updateField('specimens', [...existing, newSpecimen]);
              }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specimen</span>
            </button>
          </div>

          <div className="space-y-3">
            {((step as any).specimens || []).map((spec: WaterSpecimen, sIdx: number) => (
              <div key={spec.id || sIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => {
                      const updated = [...(step as any).specimens];
                      updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                      updateField('specimens', updated);
                    }}
                    placeholder="Specimen Name"
                    className="font-black text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex-1 outline-none"
                  />

                  <select
                    value={spec.category}
                    onChange={(e) => {
                      const updated = [...(step as any).specimens];
                      updated[sIdx] = { ...updated[sIdx], category: e.target.value as any };
                      updateField('specimens', updated);
                    }}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="Natural">🌿 Natural</option>
                    <option value="Synthetic">🧪 Synthetic</option>
                  </select>

                  <button
                    onClick={() => {
                      const updated = (step as any).specimens.filter((_: any, i: number) => i !== sIdx);
                      updateField('specimens', updated);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spec.isHydrophobic}
                      onChange={(e) => {
                        const updated = [...(step as any).specimens];
                        updated[sIdx] = { ...updated[sIdx], isHydrophobic: e.target.checked };
                        updateField('specimens', updated);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                    <span>Waterproof (Droplets bead up)</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={spec.description}
                  onChange={(e) => {
                    const updated = [...(step as any).specimens];
                    updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                    updateField('specimens', updated);
                  }}
                  placeholder="Short educational observation"
                  className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔬 MICROSCOPIC ZOOM VIEWER EDITOR */}
      {step.type === 'microscopic_zoom_viewer' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Specimen Specimen Name
              </label>
              <input
                type="text"
                value={(step as any).specimenName || ''}
                onChange={(e) => updateField('specimenName', e.target.value)}
                placeholder="e.g. Natural Plant Cellulose"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Material Classification
              </label>
              <select
                value={(step as any).specimenCategory || 'Natural'}
                onChange={(e) => updateField('specimenCategory', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Natural">🌿 Natural Organism / Fiber</option>
                <option value="Synthetic">🧪 Synthetic Polymer</option>
                <option value="Metallic">⚡ Metallic Structure</option>
                <option value="Mineral">💎 Mineral Crystal</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
              Magnification Tiers ({((step as any).tiers || []).length})
            </span>
            {((step as any).tiers || []).map((tier: MicroscopicZoomTier, tIdx: number) => (
              <div key={tIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Zoom: {tier.magnification}
                  </span>
                  <input
                    type="text"
                    value={tier.scaleBarText || '50 µm'}
                    onChange={(e) => {
                      const updated = [...(step as any).tiers];
                      updated[tIdx] = { ...updated[tIdx], scaleBarText: e.target.value };
                      updateField('tiers', updated);
                    }}
                    placeholder="Scale Bar (e.g. 50 µm)"
                    className="text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg px-2 py-0.5 w-28 text-right outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={tier.label}
                  onChange={(e) => {
                    const updated = [...(step as any).tiers];
                    updated[tIdx] = { ...updated[tIdx], label: e.target.value };
                    updateField('tiers', updated);
                  }}
                  placeholder="Tier Label (e.g. Cellular Microstructure)"
                  className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
                <textarea
                  rows={2}
                  value={tier.scientificExplanation}
                  onChange={(e) => {
                    const updated = [...(step as any).tiers];
                    updated[tIdx] = { ...updated[tIdx], scientificExplanation: e.target.value };
                    updateField('tiers', updated);
                  }}
                  placeholder="Scientific observation revealed at this optical scale"
                  className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg p-2 outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🗂️ SORTING TRAY EDITOR */}
      {step.type === 'sorting_tray' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Sorting Items ({((step as any).items || []).length})
            </span>
            <button
              onClick={() => {
                const existing = (step as any).items || [];
                const newItem: SortingItem = {
                  id: `item-${Date.now()}`,
                  name: 'New Specimen',
                  icon: '🌿',
                  category: 'natural',
                  hint: 'Look at the biological origin of this specimen',
                  originDetails: 'Harvested from natural environment',
                };
                updateField('items', [...existing, newItem]);
              }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {((step as any).items || []).map((item: any, iIdx: number) => (
              <div key={item.id || iIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.icon || '🌿'}
                  onChange={(e) => {
                    const updated = [...(step as any).items];
                    updated[iIdx] = { ...updated[iIdx], icon: e.target.value };
                    updateField('items', updated);
                  }}
                  className="w-10 text-center text-lg bg-white border border-slate-200 rounded-lg py-0.5"
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...(step as any).items];
                    updated[iIdx] = { ...updated[iIdx], name: e.target.value };
                    updateField('items', updated);
                  }}
                  placeholder="Item Name"
                  className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
                <select
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...(step as any).items];
                    updated[iIdx] = { ...updated[iIdx], category: e.target.value };
                    updateField('items', updated);
                  }}
                  className="text-xs font-black bg-white border border-slate-200 rounded-lg px-2 py-1 cursor-pointer"
                >
                  <option value="natural">🌿 Natural</option>
                  <option value="synthetic">🏭 Synthetic</option>
                </select>
                <button
                  onClick={() => {
                    const updated = (step as any).items.filter((_: any, i: number) => i !== iIdx);
                    updateField('items', updated);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⚖️ TENSILE STRENGTH RIG EDITOR */}
      {step.type === 'tensile_strength_rig' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Tensile Specimens ({((step as any).specimens || []).length})
            </span>
            <button
              onClick={() => {
                const existing = (step as any).specimens || [];
                const newSpecimen: TensileSpecimen = {
                  id: `tensile-${Date.now()}`,
                  name: 'New Fiber Cord',
                  material: 'Braided Aramid',
                  icon: '🪢',
                  breakingWeightGrams: 4500,
                  elasticDeformationMm: 12,
                  snapSound: 'snap',
                  description: 'High tensile strength polymer cord',
                  realWorldUse: 'Climbing ropes and suspension slings',
                };
                updateField('specimens', [...existing, newSpecimen]);
              }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specimen</span>
            </button>
          </div>

          <div className="space-y-3">
            {((step as any).specimens || []).map((spec: TensileSpecimen, sIdx: number) => (
              <div key={spec.id || sIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.icon || '🪢'}
                    onChange={(e) => {
                      const updated = [...(step as any).specimens];
                      updated[sIdx] = { ...updated[sIdx], icon: e.target.value };
                      updateField('specimens', updated);
                    }}
                    className="w-10 text-center text-lg bg-white border border-slate-200 rounded-lg py-0.5"
                  />
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => {
                      const updated = [...(step as any).specimens];
                      updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                      updateField('specimens', updated);
                    }}
                    placeholder="Cord / Material Name"
                    className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (step as any).specimens.filter((_: any, i: number) => i !== sIdx);
                      updateField('specimens', updated);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Snap Limit (Grams)</label>
                    <input
                      type="number"
                      value={spec.breakingWeightGrams || 1000}
                      onChange={(e) => {
                        const updated = [...(step as any).specimens];
                        updated[sIdx] = { ...updated[sIdx], breakingWeightGrams: Number(e.target.value) };
                        updateField('specimens', updated);
                      }}
                      className="w-full font-mono text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Real World Application</label>
                    <input
                      type="text"
                      value={spec.realWorldUse || ''}
                      onChange={(e) => {
                        const updated = [...(step as any).specimens];
                        updated[sIdx] = { ...updated[sIdx], realWorldUse: e.target.value };
                        updateField('specimens', updated);
                      }}
                      placeholder="e.g. Parachute suspension cords"
                      className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔗 MATCHING PAIRS EDITOR */}
      {step.type === 'matching_pairs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Matching Pairs ({((step as any).pairs || []).length})
            </span>
            <button
              onClick={() => {
                const existing = (step as any).pairs || [];
                const newPair: MatchingPairItem = {
                  id: `pair-${Date.now()}`,
                  leftText: 'Everyday Object',
                  leftIcon: '🎒',
                  rightText: 'Scientific Superpower',
                  explanation: 'Why this material trait was chosen for this use.',
                };
                updateField('pairs', [...existing, newPair]);
              }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pair</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {((step as any).pairs || []).map((pair: MatchingPairItem, pIdx: number) => (
              <div key={pair.id || pIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pair.leftIcon || '🎒'}
                    onChange={(e) => {
                      const updated = [...(step as any).pairs];
                      updated[pIdx] = { ...updated[pIdx], leftIcon: e.target.value };
                      updateField('pairs', updated);
                    }}
                    className="w-10 text-center text-lg bg-white border border-slate-200 rounded-lg py-0.5"
                  />
                  <input
                    type="text"
                    value={pair.leftText}
                    onChange={(e) => {
                      const updated = [...(step as any).pairs];
                      updated[pIdx] = { ...updated[pIdx], leftText: e.target.value };
                      updateField('pairs', updated);
                    }}
                    placeholder="Object (e.g. Firefighter Jacket)"
                    className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                  />
                  <span className="text-slate-400 font-black text-xs">➔</span>
                  <input
                    type="text"
                    value={pair.rightText}
                    onChange={(e) => {
                      const updated = [...(step as any).pairs];
                      updated[pIdx] = { ...updated[pIdx], rightText: e.target.value };
                      updateField('pairs', updated);
                    }}
                    placeholder="Trait (e.g. Flame-Resistant Aramid)"
                    className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (step as any).pairs.filter((_: any, i: number) => i !== pIdx);
                      updateField('pairs', updated);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={pair.explanation || ''}
                  onChange={(e) => {
                    const updated = [...(step as any).pairs];
                    updated[pIdx] = { ...updated[pIdx], explanation: e.target.value };
                    updateField('pairs', updated);
                  }}
                  placeholder="Educational reason explaining connection"
                  className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ❓ MCQ ASSESSMENT EDITOR */}
      {step.type === 'mcq_assessment' && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
              Question Prompt
            </label>
            <input
              type="text"
              value={(step as any).question || ''}
              onChange={(e) => updateField('question', e.target.value)}
              placeholder="What scientific law does this experiment prove?"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Options & Correct Answer:
              </span>
              <button
                onClick={() => {
                  const existing = (step as any).options || [];
                  const newOption: McqOption = {
                    id: `opt-${Date.now()}`,
                    text: 'New answer option',
                    isCorrect: false,
                    feedback: 'Reason why this option is correct or incorrect',
                  };
                  updateField('options', [...existing, newOption]);
                }}
                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Choice</span>
              </button>
            </div>

            {((step as any).options || []).map((opt: McqOption, oIdx: number) => (
              <div key={opt.id || oIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={opt.isCorrect}
                    onChange={() => {
                      const updated = (step as any).options.map((o: any, idx: number) => ({
                        ...o,
                        isCorrect: idx === oIdx,
                      }));
                      updateField('options', updated);
                    }}
                    className="w-4 h-4 text-emerald-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...(step as any).options];
                      updated[oIdx] = { ...updated[oIdx], text: e.target.value };
                      updateField('options', updated);
                    }}
                    placeholder={`Option ${oIdx + 1}`}
                    className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                  />
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${opt.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {opt.isCorrect ? 'Correct ✅' : 'Choice'}
                  </span>
                  <button
                    onClick={() => {
                      const updated = (step as any).options.filter((_: any, i: number) => i !== oIdx);
                      updateField('options', updated);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={opt.feedback || ''}
                  onChange={(e) => {
                    const updated = [...(step as any).options];
                    updated[oIdx] = { ...updated[oIdx], feedback: e.target.value };
                    updateField('options', updated);
                  }}
                  placeholder="Student feedback when this option is selected"
                  className="w-full text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
              Scientific Explanation
            </label>
            <textarea
              rows={2}
              value={(step as any).explanation || ''}
              onChange={(e) => updateField('explanation', e.target.value)}
              placeholder="Why this answer is scientifically correct..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* 🗺️ INTERACTIVE DIAGRAM MAP EDITOR */}
      {step.type === 'interactive_diagram' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Diagram Topic
              </label>
              <select
                value={(step as any).topic || 'water_cycle'}
                onChange={(e) => updateField('topic', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="water_cycle">💧 Water Cycle & Condensation</option>
                <option value="photosynthesis">🌱 Photosynthesis Bio-Energy</option>
                <option value="electric_circuit">⚡ Closed Circuit Currents</option>
                <option value="states_of_matter">🧊 Solid, Liquid & Gas Phase</option>
                <option value="custom">✨ Custom Science Canvas</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Canvas Theme Background
              </label>
              <select
                value={(step as any).backgroundTheme || 'sky_ocean'}
                onChange={(e) => updateField('backgroundTheme', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="sky_ocean">Sky & Ocean Horizon</option>
                <option value="nature_field">Forest Canopy & Soil</option>
                <option value="circuit_board">Electric Circuit Board</option>
                <option value="science_lab">Modern Chemistry Bench</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Interactive Hotspots ({((step as any).hotspots || []).length})
              </span>
              <button
                onClick={() => {
                  const existing = (step as any).hotspots || [];
                  const newHotspot: DiagramHotspot = {
                    id: `spot-${Date.now()}`,
                    name: 'Evaporation Stage',
                    stageNumber: existing.length + 1,
                    icon: '☁️',
                    xPercent: 50,
                    yPercent: 40,
                    title: 'Vapor Ascent',
                    explanation: 'Solar heat transforms liquid into airborne water vapor.',
                    animationType: 'evaporate_steam',
                    funFact: 'Water in clouds can stay aloft for up to 9 days!',
                  };
                  updateField('hotspots', [...existing, newHotspot]);
                }}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hotspot</span>
              </button>
            </div>

            {((step as any).hotspots || []).map((spot: DiagramHotspot, hIdx: number) => (
              <div key={spot.id || hIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spot.icon || '📍'}
                    onChange={(e) => {
                      const updated = [...(step as any).hotspots];
                      updated[hIdx] = { ...updated[hIdx], icon: e.target.value };
                      updateField('hotspots', updated);
                    }}
                    className="w-10 text-center text-lg bg-white border border-slate-200 rounded-lg py-0.5"
                  />
                  <input
                    type="text"
                    value={spot.name}
                    onChange={(e) => {
                      const updated = [...(step as any).hotspots];
                      updated[hIdx] = { ...updated[hIdx], name: e.target.value };
                      updateField('hotspots', updated);
                    }}
                    placeholder="Hotspot Title"
                    className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                  />
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <span>X:</span>
                    <input
                      type="number"
                      value={spot.xPercent}
                      onChange={(e) => {
                        const updated = [...(step as any).hotspots];
                        updated[hIdx] = { ...updated[hIdx], xPercent: Number(e.target.value) };
                        updateField('hotspots', updated);
                      }}
                      className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5"
                    />
                    <span>% Y:</span>
                    <input
                      type="number"
                      value={spot.yPercent}
                      onChange={(e) => {
                        const updated = [...(step as any).hotspots];
                        updated[hIdx] = { ...updated[hIdx], yPercent: Number(e.target.value) };
                        updateField('hotspots', updated);
                      }}
                      className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5"
                    />
                    <span>%</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = (step as any).hotspots.filter((_: any, i: number) => i !== hIdx);
                      updateField('hotspots', updated);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={spot.explanation}
                  onChange={(e) => {
                    const updated = [...(step as any).hotspots];
                    updated[hIdx] = { ...updated[hIdx], explanation: e.target.value };
                    updateField('hotspots', updated);
                  }}
                  placeholder="Stage explanation for students"
                  className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🗣️ SPEECH READ-ALOUD COACH EDITOR */}
      {step.type === 'read_aloud_coach' && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
              Target Scientific Sentence to Read Aloud
            </label>
            <input
              type="text"
              value={(step as any).targetSentence || ''}
              onChange={(e) => updateField('targetSentence', e.target.value)}
              placeholder="e.g. Synthetic polymers repel liquid moisture molecules."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
              Key Vocabulary Word & Definition
            </label>
            <input
              type="text"
              value={(step as any).scienceDefinition || ''}
              onChange={(e) => updateField('scienceDefinition', e.target.value)}
              placeholder="e.g. Hydrophobic: Materials that naturally repel liquid water."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            />
          </div>
        </div>
      )}

      {/* ⚡ CONCEPT SUMMARY / GOLDEN LAW EDITOR */}
      {step.type === 'concept_summary' && (
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
            3-Pillar Golden Law Takeaways
          </span>
          <p className="text-xs font-bold text-slate-500">
            Synthesizes the core scientific principle: What something is Made From determines what it Can Do and how it is Used.
          </p>
        </div>
      )}
    </div>
  );
};
