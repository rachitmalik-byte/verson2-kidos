import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  Volume2,
  AlertTriangle,
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService, WhatIfResult } from '@/lib/geminiService';

interface WhatIfScienceSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MATERIALS = [
  '100% Natural Cotton Shirt',
  'Synthetic Polyester Raincoat',
  'High-Tensile Nylon Rope',
  'Vulcanized Rubber Car Tyre',
  'PET Plastic Water Bottle',
  'Thermosetting Bakelite Pan Handle',
  'Bare Copper Electrical Wire',
  'Natural Sheep Wool Fleece',
];

const AGENTS = [
  '100°C Boiling Hot Water & Steam',
  'Open Firecracker Flame (500°C)',
  'Heavy 500kg Hydraulic Weight',
  'Extreme Arctic Cold (-40°C)',
  '240V Live Electric Current',
  'Underground Soil Microbes (100 Years)',
];

const ACTIONS = [
  'Test Thermal Heat Transfer',
  'Test Tensile Breaking Strength',
  'Test Flame Melting vs Ash Reaction',
  'Test Electrical Conductivity',
  'Test Microbial Decomposition',
];

export const WhatIfScienceSandboxModal: React.FC<WhatIfScienceSandboxModalProps> = ({ isOpen, onClose }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [selectedAction, setSelectedAction] = useState(ACTIONS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<WhatIfResult | null>(null);

  const handleRunSimulation = async () => {
    sounds.sparkle();
    voiceAssistant.stop();
    setIsSimulating(true);
    setResult(null);

    try {
      const res = await geminiService.simulateWhatIfExperiment(
        selectedMaterial,
        selectedAgent,
        selectedAction
      );
      setResult(res);
      sounds.success();
      voiceAssistant.speak(`${res.title}! ${res.predictedOutcome} ${res.pipCommentary}`);
    } catch (err) {
      console.error('What-if error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-white w-full max-w-2xl rounded-3xl md:rounded-[36px] border-4 border-purple-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-between text-white border-b-2 border-purple-600">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl shadow-xs">
                  <FlaskConical className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/40 text-amber-300 px-2.5 py-0.5 rounded-full">
                    Gemini 2.5 Generative Physics Lab
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    "What If?" Science Sandbox 🧪✨
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  onClose();
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <p className="text-xs sm:text-sm font-bold text-slate-600 text-center">
                Combine any material with an extreme physical condition to see how molecular physics & chemistry respond!
              </p>

              {/* Setup Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Material 1 */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    1. Test Material
                  </span>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="p-2.5 bg-purple-50 border-2 border-purple-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-400"
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agent */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    2. Environment Force
                  </span>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="p-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-400"
                  >
                    {AGENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    3. Lab Test Action
                  </span>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="p-2.5 bg-amber-50 border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                  >
                    {ACTIONS.map((act) => (
                      <option key={act} value={act}>
                        {act}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {isSimulating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Simulating Molecular Physics Reaction...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>RUN "WHAT IF?" EXPERIMENT SIMULATION 🚀</span>
                  </>
                )}
              </button>

              {/* Simulation Output Card */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-purple-50 via-indigo-50 to-white p-5 rounded-3xl border-3 border-purple-300 shadow-xl flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                      {result.title}
                    </span>
                    <span className="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                      {result.safetyRating}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      PHYSICAL OUTCOME
                    </span>
                    <p className="text-sm font-black text-slate-900 leading-snug">
                      {result.predictedOutcome}
                    </p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-2xl border border-purple-200 text-xs font-bold text-slate-700">
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 block mb-0.5">
                      MOLECULAR REACTION:
                    </span>
                    {result.physicalReaction}
                  </div>

                  <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 text-xs font-black text-amber-950 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-amber-800 font-black block mb-0.5">
                        🤖 Pip's Commentary:
                      </span>
                      <span>{result.pipCommentary}</span>
                    </div>
                    <button
                      onClick={() => voiceAssistant.speak(result.pipCommentary)}
                      className="p-1.5 rounded-full bg-white text-amber-800 shadow-xs hover:bg-amber-50 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] font-black text-indigo-900 bg-indigo-100 px-3 py-1.5 rounded-xl text-center border border-indigo-200">
                    ✨ Core Science Law: {result.scienceLaw}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
