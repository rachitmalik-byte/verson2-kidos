import React from 'react';
import type {
  LessonStepData,
  ActivityType,
  WaterSpecimen,
  MicroscopicZoomTier,
  SortingItem,
  SortingTray,
  MatchingPairItem,
  McqOption,
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
} from 'lucide-react';

interface Props {
  step: LessonStepData;
  onChange: (updated: LessonStepData) => void;
}

const ACTIVITY_TYPES: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'water_absorption_lab', label: 'Water Absorption Lab', icon: '💧' },
  { type: 'microscopic_zoom_viewer', label: 'Microscope Studio', icon: '🔬' },
  { type: 'sorting_tray', label: 'Classification Sorting Trays', icon: '🗂️' },
  { type: 'tensile_strength_rig', label: 'Tensile Strength Rig', icon: '⚖️' },
  { type: 'matching_pairs', label: 'Matching Pairs Game', icon: '🔗' },
  { type: 'mcq_assessment', label: 'Challenge MCQ Quiz', icon: '❓' },
  { type: 'concept_summary', label: 'Golden Law Synthesis', icon: '⚡' },
  { type: 'read_aloud_coach', label: 'Speech Fluency Coach', icon: '🗣️' },
];

export const StepPropertyEditor: React.FC<Props> = ({ step, onChange }) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...step, [field]: value });
  };

  return (
    <div className="w-full flex flex-col gap-5 p-4 sm:p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs text-slate-900 font-sans select-none overflow-y-auto max-h-[700px]">
      {/* ── 1. General Step Meta ── */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Step Settings & Activity Type</span>
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
          <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
            Pip's Spoken Mascot Dialogue
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

      {/* ── 2. Type-Specific Config Editors ── */}

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
                  className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                />
                <select
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...(step as any).items];
                    updated[iIdx] = { ...updated[iIdx], category: e.target.value };
                    updateField('items', updated);
                  }}
                  className="text-xs font-black bg-white border border-slate-200 rounded-lg px-2 py-1"
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
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              Options & Correct Choice:
            </span>
            {((step as any).options || []).map((opt: McqOption, oIdx: number) => (
              <div key={opt.id || oIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2">
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
                  {opt.isCorrect ? 'Correct ✅' : 'Incorrect'}
                </span>
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
              placeholder="Why is the correct answer right?"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none resize-none"
            />
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
                  id: `p-${Date.now()}`,
                  leftItem: 'New Object',
                  leftIcon: '🧪',
                  rightProperty: 'Key Superpower',
                  explanation: 'Scientific rationale for this pairing',
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
              <div key={pair.id || pIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2">
                <input
                  type="text"
                  value={pair.leftIcon}
                  onChange={(e) => {
                    const updated = [...(step as any).pairs];
                    updated[pIdx] = { ...updated[pIdx], leftIcon: e.target.value };
                    updateField('pairs', updated);
                  }}
                  className="w-10 text-center text-lg bg-white border border-slate-200 rounded-lg py-0.5"
                />
                <input
                  type="text"
                  value={pair.leftItem}
                  onChange={(e) => {
                    const updated = [...(step as any).pairs];
                    updated[pIdx] = { ...updated[pIdx], leftItem: e.target.value };
                    updateField('pairs', updated);
                  }}
                  placeholder="Object Name"
                  className="w-1/3 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                />
                <span className="text-slate-400 font-black">➔</span>
                <input
                  type="text"
                  value={pair.rightProperty}
                  onChange={(e) => {
                    const updated = [...(step as any).pairs];
                    updated[pIdx] = { ...updated[pIdx], rightProperty: e.target.value };
                    updateField('pairs', updated);
                  }}
                  placeholder="Matching Superpower"
                  className="flex-1 font-bold text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
